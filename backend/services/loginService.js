const User = require('../models/user');
const Verification = require('../models/verification');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const moment = require('moment');
const { generateToken } = require('../middleware/jwt');
const nodemailer = require('nodemailer');

// Function to validate email format
// Uses regex to check if the email string is in a valid email format
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Create a transporter for sending emails via Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,           // Gmail address from environment variables
      pass: process.env.EMAIL_PASS,           // Gmail App Password from environment variables
    },
  });

// Adds a new user to the database after validations, hashes password, sends verification code email
const addUser = async ({ email, password, username, confirmPassword, UserLocationX, UserLocationY }) => {
    // Validate email format and presence
    if (!email?.trim() || !isValidEmail(email)) throw new Error("A valid email address is required");
    // Validate password length and presence
    if (!password?.trim() || password.length < 6) throw new Error("Password must be at least 6 characters");
    // Check password and confirmPassword match
    if (password !== confirmPassword) throw new Error("Passwords do not match");
    // Validate username presence
    if (!username?.trim()) throw new Error("Username is required");
    
    email = email.trim().toLowerCase(); // Normalize email for consistency
    username = username.trim();

    // Check if email already registered
    const emailExists = await User.findOne({ Email: email });
    if (emailExists) throw new Error("Email is already registered");

    // Check if username already taken
    const usernameExists = await User.findOne({ Username: username });
    if (usernameExists) throw new Error("Username is already taken");

    // Hash password securely using bcrypt with salt rounds 12
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user object with default IsVerified false and location coordinates
    const newUser = new User({
        Email: email,
        Username: username,
        Password: hashedPassword,
        IsVerified: false,
        UserLocationX,
        UserLocationY
    });

    // Save new user to database
    await newUser.save();
    // Send verification code email after user creation
    await sendVerificationCode(email);
    return { message: "User added successfully. Please verify your email." };
};

// Sends a 6-digit verification code to the given email address, stores code and expiration in DB
const sendVerificationCode = async (email) => {
    if (!email?.trim() || !isValidEmail(email)) throw new Error("A valid email address is required");

    email = email.trim().toLowerCase();

    // Generate random 6-digit numeric verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    // Set code expiry to 1 hour from now
    const verificationExpiresAt = moment().add(1, 'hour').toDate();

    // Confirm user exists for the given email
    const user = await User.findOne({ Email: email });
    if (!user) throw new Error("No user found with this email");

    // If verification entry exists, update the code and expiry; else create new record
    const existingVerification = await Verification.findOne({ Email: email });
    if (existingVerification) {
        existingVerification.VerificationCode = verificationCode;
        existingVerification.VerificationExpiresAt = verificationExpiresAt;
        await existingVerification.save();
    } else {
        const verification = new Verification({
            Email: email,
            VerificationCode: verificationCode,
            VerificationExpiresAt: verificationExpiresAt,
        });
        await verification.save();
    }

    // Email options to send the verification code to the user
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification Code',
        text: `Your verification code is: ${verificationCode}\nThis code will expire in 1 hour.`,
    };

    // Send email and handle potential errors
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error("Error sending email:", err);
        throw new Error("Failed to send verification code via email.");
    }

    return { message: 'Please check your email for the verification code.' };
};

// Verifies user by checking the provided code against stored code and expiry, then marks user as verified
const verifyUser = async (email, verificationCode) => {
    if (!email?.trim()) throw new Error("Email is required");
    if (!verificationCode?.trim()) throw new Error("Verification code is required");

    email = email.trim().toLowerCase();
    // Find matching verification document with email and code
    const verification = await Verification.findOne({ Email: email, VerificationCode: verificationCode.trim() });

    if (!verification) {
        throw new Error("Invalid verification attempt");
    }

    // Check if the verification code has expired
    if (moment().isAfter(verification.VerificationExpiresAt)) {
        throw new Error("Verification code has expired");
    }

    // Retrieve user and mark as verified
    const user = await User.findOne({ Email: email });
    if (!user) throw new Error("User not found");
    
    if(user.isVerified) {
        // (This block hashes verificationCode to password if user already verified, unusual step)
        user.Password = await bcrypt.hash(verificationCode, 12);
    }
    user.IsVerified = true;
    
    await user.save();

    return { message: 'Verification successful. You can now complete your registration.' };
};

// Completes the registration process by setting username and password after verification
const completeRegistration = async (email, username, password) => {
    const user = await User.findOne({ Email: email });

    if (!user) throw new Error("User not found");
    if (!user.IsVerified) throw new Error("User must verify their email first");

    // Check username uniqueness again before finalizing
    const usernameExists = await User.findOne({ Username: username });
    if (usernameExists) throw new Error("Username is already taken");

    user.Username = username;
    user.Password = await bcrypt.hash(password, 12);
    user.JoinDate = moment().format('YYYY-MM-DD');

    await user.save();

    return { message: 'Registration completed successfully.' };
};

// Resets the user's password if the provided reset token is valid and not expired
const resetPassword = async (resetToken, newPassword) => {
    try {
        // Find verification record with matching reset token and unexpired
        const verification = await Verification.findOne({
            VerificationCode: resetToken,
            VerificationExpiresAt: { $gt: Date.now() }, // Not expired
        });

        if (!verification) {
            throw new Error('Invalid or expired reset token.');
        }

        // Find user associated with this verification email
        const user = await User.findOne({ Email: verification.Email });

        if (!user) {
            throw new Error('User not found.');
        }

        if (newPassword.length < 6) {
            throw new Error('Password must be at least 6 characters.');
        }

        // Hash and update the new password
        user.Password = await bcrypt.hash(newPassword, 12);
        await user.save();

        // Remove verification record after successful reset
        await Verification.deleteOne({ _id: verification._id });

        // The following mailOptions and sendMail block appears redundant here since it's about sending verification code (likely a copy-paste leftover)

        return { message: 'Password has been reset successfully.' };
    } catch (error) {
        console.error('Error resetting password:', error);
        throw new Error('Failed to reset password.');
    }
};

// Generates a reset token and sends it to user's email for password reset requests
const forgotPassword = async (email) => {
    if (!email?.trim() || !isValidEmail(email)) throw new Error("A valid email address is required");

    email = email.trim().toLowerCase();

    const user = await User.findOne({ Email: email });

    if (!user) {
        throw new Error('No account found with this email.');
    }

    // Generate a 6-digit reset token and expiry date
    const resetToken = crypto.randomInt(100000, 999999).toString();
    const resetPasswordExpire = moment().add(1, 'hour').toDate();

    // Create verification entry for password reset
    const verification = new Verification({
        Email: email,
        VerificationCode: resetToken,
        VerificationExpiresAt: resetPasswordExpire,
    });

    await verification.save();

    // Email options with reset token instructions
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Use this token to reset your password: ${resetToken}\nThe token will expire in 1 hour.`,
    };

    // Send reset token email
    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error("Error sending reset email:", err);
        throw new Error('Failed to send reset email.');
    }

    return { message: 'A password reset link has been sent to your email.' };
};

// Authenticates user credentials, compares hashed password, returns JWT token on success
const loginUser = async (username, password) => {
    if (!username?.trim()) throw new Error("Username is required");
    if (!password?.trim()) throw new Error("Password is required");

    // Find the user by username
    const user = await User.findOne({ Username: username.trim() });
    
    if (!user) {
        throw new Error("Username or password is incorrect");
    }

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.Password);
    
    if (!isMatch) {
        throw new Error("Username or password is incorrect");
    }

    // Generate JWT token with userId, username, and joinDate payload
    const token = generateToken({
        userId: user._id,
        username: user.Username,
        joinDate: user.JoinDate,
    });

    return {
        message: "Logged in successfully!",
        userId: user._id,
        token,
    };
};

// Service to check if an email is already registered
const checkEmailExists = async (email) => {
    const user = await User.findOne({ Email: email });
    return { exists: !!user };
};

// Service to check if a username is already taken
const checkUsernameExists = async (username) => {
    const user = await User.findOne({ Username: username });
    return { exists: !!user };
};

module.exports = {
    sendVerificationCode,
    verifyUser,
    resetPassword, 
    loginUser,
    completeRegistration,
    forgotPassword,  
    checkEmailExists,
    checkUsernameExists,
    addUser
};
