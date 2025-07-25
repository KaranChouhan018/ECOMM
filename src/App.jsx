import * as THREE from 'three'
import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, extend, useThree, useLoader, useFrame } from '@react-three/fiber'
import {  Sky } from '@react-three/drei'


import { Water } from 'three-stdlib'

import { Model4 } from './islands/Island4'

extend({ Water })

function Ocean() {
  const ref = useRef()
  const gl = useThree((state) => state.gl)
  const waterNormals = useLoader(THREE.TextureLoader, '/waternormals.jpeg')
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
  const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), [])
  const config = useMemo(
    () => ({
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(),
      sunColor: 0xff4500, // Deep orange/red

      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: true,
      format: gl.encoding
    }),
    [waterNormals]
  )
  useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta))
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2} />
}

function MouseMoveEffect() {
  const { camera, mouse } = useThree()
  useFrame(() => {
    // Smoothly interpolate camera rotation based on mouse
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, mouse.x * 0.1, 0.01)
    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, -mouse.y * 0.1, 0.01)
  })
  return null
}

export default function App() {
  return (
    <Canvas
  camera={{ position: [0, 10, 100], fov: 55, near: 1, far: 20000 }}
  fog={{ color: '#ff4500', near: 10, far: 300 }}
>
      <pointLight position={[100, 100, 100]} />
      <pointLight position={[-100, -100, -100]} />
      <Suspense fallback={null}>
        <Ocean />
        {/* <Model1 scale={10} /> */}
        {/* <Model2 position={[0,-55,0]}/> */}
        {/* <Model3 scale={10}  position={[0,-0.4,0]} /> */}
        <Model4 scale={2} position={[0, -38, 0]} />
      </Suspense>
      <Sky
      
    scale={45000}
    sunPosition={[0, 0, -1000]}
    turbidity={10}
    rayleigh={3}
    mieCoefficient={0.005}
    mieDirectionalG={0.8}
    elevation={10}
    azimuth={180}
    exposure={10.0}
  />
      
  <MouseMoveEffect />

      {/* <OrbitControls maxAzimuthAngle={Math.PI} maxPolarAngle={Math.PI} /> */}
    </Canvas>
  )
}
