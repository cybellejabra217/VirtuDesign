import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, TransformControls } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import {
  Box,
  Stack,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  Fade,
} from '@mui/material'
import {
  PanTool,
  RotateRight,
  ZoomIn,
  Fullscreen,
  Lightbulb,
  GridOn,
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'

// Styled Components
const ViewerContainer = styled(Paper)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '80vh',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
}))

const ControlButton = styled(IconButton)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : 'rgba(255,255,255,0.1)',
  color: active ? '#fff' : 'rgba(255,255,255,0.7)',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : 'rgba(255,255,255,0.2)',
  },
  transition: 'all 0.3s ease',
}))

const ControlPanel = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  padding: theme.spacing(1),
  borderRadius: theme.spacing(2),
  background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(10px)',
  zIndex: 10,
}))

function Furniture({ modelPath, initialPosition = [0, 0, 0], mode = 'translate' }) {
  const { scene } = useGLTF(modelPath)
  const objectRef = useRef()
  const transformRef = useRef()

  // Attach object to transform controls after mount
  useEffect(() => {
    if (objectRef.current && transformRef.current) {
      transformRef.current.attach(objectRef.current)
    }
  }, [scene])

  return (
    <>
      <primitive
        object={scene}
        ref={objectRef}
        position={initialPosition}
        scale={1.5}
      />
      <TransformControls ref={transformRef} mode={mode} />
    </>
  )
}

export default function SofaScene() {
  const [mode, setMode] = useState('translate')
  const [showGrid, setShowGrid] = useState(true)
  const [showLights, setShowLights] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const theme = useTheme()

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: 3, height: '100%' }}>
        <Stack spacing={3}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            3D Furniture Viewer
          </Typography>

          <ViewerContainer>
            <ControlPanel>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Move">
                  <ControlButton
                    active={mode === 'translate'}
                    onClick={() => setMode('translate')}
                  >
                    <PanTool />
                  </ControlButton>
                </Tooltip>
                <Tooltip title="Rotate">
                  <ControlButton
                    active={mode === 'rotate'}
                    onClick={() => setMode('rotate')}
                  >
                    <RotateRight />
                  </ControlButton>
                </Tooltip>
                <Tooltip title="Scale">
                  <ControlButton
                    active={mode === 'scale'}
                    onClick={() => setMode('scale')}
                  >
                    <ZoomIn />
                  </ControlButton>
                </Tooltip>
                <Tooltip title="Toggle Grid">
                  <ControlButton
                    active={showGrid}
                    onClick={() => setShowGrid(!showGrid)}
                  >
                    <GridOn />
                  </ControlButton>
                </Tooltip>
                <Tooltip title="Toggle Lights">
                  <ControlButton
                    active={showLights}
                    onClick={() => setShowLights(!showLights)}
                  >
                    <Lightbulb />
                  </ControlButton>
                </Tooltip>
                <Tooltip title="Fullscreen">
                  <ControlButton onClick={toggleFullscreen}>
                    <Fullscreen />
                  </ControlButton>
                </Tooltip>
              </Stack>
            </ControlPanel>

            <Canvas
              camera={{ position: [0, 3, 8], fov: 45 }}
              style={{ background: 'transparent' }}
            >
              {showLights && (
                <>
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <spotLight
                    position={[-5, 5, 0]}
                    angle={0.3}
                    penumbra={1}
                    intensity={0.5}
                  />
                </>
              )}
              {showGrid && <gridHelper args={[20, 20, '#666666', '#444444']} />}
              <OrbitControls
                enableDamping
                dampingFactor={0.05}
                minDistance={3}
                maxDistance={20}
              />

              {/* 3D room */}
              <Furniture
                modelPath="/models/shapespark-example-room.gltf"
                initialPosition={[0, 0, 0]}
              />

              {/* Draggable sofa */}
              <Furniture
                modelPath="/models/leather-sofa-gltf.glb"
                initialPosition={[2, 0, 2]}
                mode={mode}
              />
            </Canvas>
          </ViewerContainer>

          <Typography variant="body2" color="text.secondary" align="center">
            Use mouse to orbit, scroll to zoom, and right-click to pan. Select a control mode to manipulate the furniture.
          </Typography>
        </Stack>
      </Box>
    </Fade>
  )
}
