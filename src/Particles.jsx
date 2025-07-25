import { useRef } from "react";
import { Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ParticleInstance = ({ position }) => {
  const ref = useRef();
  const velocity = useRef({
    x: (Math.random() - 0.5) * 0.05,
    y: (Math.random() - 0.5) * 0.05,
    z: (Math.random() - 0.5) * 0.05,
  });

  const intensity = useRef({
    value: Math.random() * 0.3 + 0.1,
    speed: Math.random() * 0.02 + 0.01,
  });

  useFrame((state) => {
    ref.current.position.x += velocity.current.x;
    ref.current.position.y += velocity.current.y;
    ref.current.position.z += velocity.current.z;

    const flicker =
      1 + Math.sin(state.clock.elapsedTime * intensity.current.speed) * 0.5;
    ref.current.scale.setScalar(flicker * intensity.current.value);

    if (Math.abs(ref.current.position.x) > 12.5) velocity.current.x *= -1;
    if (ref.current.position.y < 0.5 || ref.current.position.y > 9)
      velocity.current.y *= -1;
    if (Math.abs(ref.current.position.z) > 12.5) velocity.current.z *= -1;
  });

  return <Instance ref={ref} position={position} />;
};

const Particles = () => {
  const positions = Array.from({ length: 1000 }, () => [
    (Math.random() - 0.5) * 200,
    Math.random() * 8 + 1,
    (Math.random() - 0.5) * 200,
  ]);

  return (
    <Instances limit={1000}>
      <sphereGeometry args={[0.025, 4, 4]} />
      <meshBasicMaterial
        color="#ff4500"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
      {positions.map((pos, i) => (
        <ParticleInstance key={i} position={pos} />
      ))}
    </Instances>
  );
};

export default Particles;