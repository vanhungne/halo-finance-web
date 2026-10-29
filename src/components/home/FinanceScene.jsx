import { Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function OrbitRings() {
  const group = useRef(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.08;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
  });

  return (
    <group ref={group} rotation={[0.55, -0.4, 0.15]}>
      {[2.15, 2.75, 3.35].map((radius, index) => (
        <mesh key={radius} rotation={[Math.PI / 2 + index * 0.25, index * 0.3, 0]}>
          <torusGeometry args={[radius, 0.018 + index * 0.004, 10, 180]} />
          <meshBasicMaterial
            color={index === 1 ? "#facc15" : "#0ea5e9"}
            transparent
            opacity={0.35 - index * 0.06}
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingAssets() {
  const coins = useRef(null);

  useFrame((state, delta) => {
    if (!coins.current) return;
    coins.current.rotation.y += delta * 0.18;
    coins.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.08;
  });

  const coinPositions = [
    [-2.35, 1.65, -0.8, 0.3],
    [2.4, 1.35, -1.1, 0.26],
    [-2.15, -1.55, -0.5, 0.24],
    [2.45, -1.25, -0.9, 0.28],
  ];

  return (
    <group ref={coins}>
      {coinPositions.map(([x, y, z, size], index) => (
        <Float key={`${x}-${y}`} speed={1.1 + index * 0.12} rotationIntensity={0.8} floatIntensity={0.7}>
          <group position={[x, y, z]} rotation={[Math.PI / 2, index * 0.7, index * 0.35]} scale={size}>
            <mesh>
              <cylinderGeometry args={[1, 1, 0.24, 48]} />
              <meshStandardMaterial color="#fde047" emissive="#ca8a04" emissiveIntensity={0.22} metalness={0.58} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <torusGeometry args={[0.62, 0.075, 12, 48]} />
              <meshStandardMaterial color="#fff7ae" emissive="#facc15" emissiveIntensity={0.2} metalness={0.45} roughness={0.2} />
            </mesh>
            {[0.4, 0.68, 0.98].map((height, barIndex) => (
              <mesh
                key={height}
                position={[(barIndex - 1) * 0.3, 0.17, -0.33 + height / 2]}
              >
                <boxGeometry args={[0.16, 0.08, height]} />
                <meshStandardMaterial color="#f8fafc" emissive="#e0f2fe" emissiveIntensity={0.18} metalness={0.22} roughness={0.18} />
              </mesh>
            ))}
          </group>
        </Float>
      ))}

      <Float speed={1.3} rotationIntensity={1.2} floatIntensity={0.8}>
        <mesh position={[-3.6, 0.05, -1.5]} scale={0.42}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#38bdf8" wireframe emissive="#0369a1" emissiveIntensity={0.5} />
        </mesh>
      </Float>
      <Float speed={1.6} rotationIntensity={1.4} floatIntensity={0.7}>
        <mesh position={[3.6, 0.1, -1.8]} scale={0.34}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#818cf8" wireframe emissive="#4338ca" emissiveIntensity={0.45} />
        </mesh>
      </Float>
    </group>
  );
}

function DataCore() {
  const core = useRef(null);
  const heights = [0.8, 1.35, 1.05, 1.9, 1.5, 2.4, 2.05, 2.85, 2.55];

  useFrame((state, delta) => {
    if (!core.current) return;
    core.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.28;
    core.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.12;
    core.current.rotation.z += delta * 0.015;
  });

  return (
    <group ref={core} position={[0, -1.2, -1]} rotation={[0.15, -0.35, -0.06]}>
      {heights.map((height, index) => (
        <mesh key={height} position={[(index - 4) * 0.58, height / 2, 0]}>
          <boxGeometry args={[0.28, height, 0.28]} />
          <meshStandardMaterial
            color={index > 5 ? "#38bdf8" : "#2563eb"}
            emissive={index > 5 ? "#0284c7" : "#1d4ed8"}
            emissiveIntensity={0.3}
            metalness={0.45}
            roughness={0.28}
          />
        </mesh>
      ))}
      <mesh position={[0, 1.45, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.15, 0.025, 10, 150]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.48} />
      </mesh>
      <mesh position={[0, 1.45, -0.7]} rotation={[Math.PI / 2.35, 0.25, 0]}>
        <torusGeometry args={[3.8, 0.016, 10, 150]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.34} />
      </mesh>
    </group>
  );
}

export default function FinanceScene({ variant = "hero" }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 48 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1.6} />
        <pointLight position={[3, 4, 5]} intensity={18} color="#7dd3fc" />
        <pointLight position={[-4, -2, 3]} intensity={10} color="#fde047" />
        {variant === "insight" ? (
          <>
            <DataCore />
            <Sparkles count={80} scale={[11, 7, 5]} size={1.8} speed={0.22} color="#38bdf8" />
          </>
        ) : (
          <>
            <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.45}>
              <OrbitRings />
            </Float>
            <FloatingAssets />
            <Sparkles count={58} scale={[9, 7, 5]} size={2.2} speed={0.18} color="#38bdf8" />
          </>
        )}
      </Canvas>
    </div>
  );
}
