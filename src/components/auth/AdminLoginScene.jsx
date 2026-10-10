import { Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

function CommandCore({ offsetX = 0, paused = false }) {
  const core = useRef(null);
  const satellites = useRef(null);

  useFrame((state, delta) => {
    if (paused) return;
    if (core.current) {
      core.current.rotation.y += delta * 0.12;
      core.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.14;
    }
    if (satellites.current) satellites.current.rotation.z -= delta * 0.08;
  });

  return (
    <group position={[0.35 + offsetX, 0, -0.4]}>
      <group ref={core} rotation={[0.25, -0.4, 0.1]}>
        <mesh>
          <icosahedronGeometry args={[1.55, 2]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#075985"
            emissiveIntensity={0.42}
            metalness={0.52}
            roughness={0.18}
            wireframe
            transparent
            opacity={0.62}
          />
        </mesh>
        <mesh scale={0.72}>
          <icosahedronGeometry args={[1.55, 1]} />
          <meshStandardMaterial
            color="#082f49"
            emissive="#0284c7"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.78}
          />
        </mesh>
      </group>

      <group ref={satellites} rotation={[0.85, 0.2, 0.2]}>
        {[2.25, 2.75, 3.25].map((radius, index) => (
          <mesh key={radius} rotation={[Math.PI / 2 + index * 0.22, index * 0.32, 0]}>
            <torusGeometry args={[radius, 0.018 + index * 0.005, 10, 180]} />
            <meshBasicMaterial
              color={index === 1 ? "#fde047" : "#38bdf8"}
              transparent
              opacity={0.48 - index * 0.08}
            />
          </mesh>
        ))}
      </group>

      {[
        [-2.65, 1.55, 0.2, "#38bdf8"],
        [2.75, 1.15, -0.4, "#fde047"],
        [-2.45, -1.65, -0.2, "#818cf8"],
        [2.55, -1.55, 0.15, "#22d3ee"],
      ].map(([x, y, z, color], index) => (
        <Float key={`${x}-${y}`} speed={1.1 + index * 0.15} floatIntensity={0.8} rotationIntensity={1.2}>
          <mesh position={[x, y, z]} scale={0.2 + index * 0.025}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} wireframe={index % 2 === 0} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function DataColumns({ offsetX = 0, paused = false }) {
  const group = useRef(null);
  const heights = [0.55, 0.9, 1.4, 1.05, 1.85, 1.5, 2.25];

  useFrame((state) => {
    if (paused) return;
    if (!group.current) return;
    group.current.position.y = -2.25 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
  });

  return (
    <group ref={group} position={[-0.4 + offsetX, -2.25, -1.2]} rotation={[0.1, -0.25, 0]}>
      {heights.map((height, index) => (
        <mesh key={`${height}-${index}`} position={[(index - 3) * 0.48, height / 2, 0]}>
          <boxGeometry args={[0.22, height, 0.22]} />
          <meshStandardMaterial
            color={index > 4 ? "#fde047" : "#0ea5e9"}
            emissive={index > 4 ? "#a16207" : "#0369a1"}
            emissiveIntensity={0.34}
            metalness={0.65}
            roughness={0.22}
          />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent({ paused }) {
  const wideScreen = useThree((state) => state.size.width >= 900);
  const offsetX = wideScreen ? -2.05 : 0;

  return (
    <>
      <ambientLight intensity={1.4} />
      <pointLight position={[4, 5, 4]} intensity={22} color="#38bdf8" />
      <pointLight position={[-4, -3, 3]} intensity={14} color="#fde047" />
      <CommandCore offsetX={offsetX} paused={paused} />
      <DataColumns offsetX={offsetX} paused={paused} />
      <Sparkles count={125} scale={[13, 9, 7]} size={1.8} speed={paused ? 0 : 0.24} color="#7dd3fc" />
    </>
  );
}

export default function AdminLoginScene({ paused = false }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.45]}
        camera={{ position: [0, 0, 7.5], fov: 48 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        <SceneContent paused={paused} />
      </Canvas>
    </div>
  );
}
