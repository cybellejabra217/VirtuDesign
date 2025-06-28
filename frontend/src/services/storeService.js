import http from "../http-common";

export const getAllStores = async () => {
    try {
        const response = await http.get('/api/store');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message);
    }
};

export const getStoreById = async (storeId) => {
    try {
        const response = await http.get(`/api/store/${storeId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message);
    }
};

export const createStore = async (storeData) => {
    try {
        const response = await http.post('/api/store', storeData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message);
    }
};

export const updateStore = async (storeId, storeData) => {
    try {
        const response = await http.put(`/api/store/${storeId}`, storeData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message);
    }
};

export const deleteStore = async (storeId) => {
    try {
        const response = await http.delete(`/api/store/${storeId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message);
    }
};