import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// ─── Waving Grass Field ────────────────────────────────────────
const GrassField = () => {
  const meshRef = useRef();
  const materialRef = useRef();

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#2d5a1e') },
    uColor2: { value: new THREE.Color('#4ade80') },
    uColor3: { value: new THREE.Color('#166534') },
  }), []);

  const vertexShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vUv = uv;

      vec3 pos = position;

      // Multi-frequency wind wave
      float wave1 = sin(pos.x * 1.5 + uTime * 0.8) * 0.15;
      float wave2 = sin(pos.z * 2.0 + uTime * 1.2) * 0.1;
      float wave3 = cos(pos.x * 0.8 + pos.z * 1.0 + uTime * 0.5) * 0.08;
      float wave4 = sin(pos.x * 3.0 + uTime * 2.0) * 0.04;

      pos.y += wave1 + wave2 + wave3 + wave4;
      vElevation = pos.y;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      // Mix colors based on position and elevation
      float mixFactor1 = smoothstep(0.0, 0.5, vUv.y);
      float mixFactor2 = smoothstep(0.3, 0.8, vUv.x + sin(vUv.y * 3.0 + uTime * 0.3) * 0.1);

      vec3 color = mix(uColor1, uColor2, mixFactor1);
      color = mix(color, uColor3, mixFactor2 * 0.4);

      // Add subtle light variation based on elevation
      color += vec3(0.08, 0.12, 0.04) * (vElevation + 0.2);

      // Soft fog at distance
      float fogFactor = smoothstep(0.0, 1.0, vUv.y);
      vec3 fogColor = vec3(0.75, 0.85, 0.65);
      color = mix(color, fogColor, fogFactor * 0.3);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2.4, 0, 0]}
      position={[0, -2.5, -2]}
    >
      <planeGeometry args={[30, 20, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// ─── Floating Particles (Pollen / Dust) ────────────────────────
const FloatingParticles = ({ count = 120 }) => {
  const pointsRef = useRef();

  const { positions, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 8 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;

      speeds[i] = 0.2 + Math.random() * 0.6;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    return { positions, speeds, offsets };
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position.array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Gentle drift
      posArray[i3] += Math.sin(t * speeds[i] + offsets[i]) * 0.003;
      posArray[i3 + 1] += Math.cos(t * speeds[i] * 0.5 + offsets[i]) * 0.002;
      posArray[i3 + 2] += Math.sin(t * speeds[i] * 0.3) * 0.002;

      // Wrap-around
      if (posArray[i3 + 1] > 7) posArray[i3 + 1] = -1;
      if (posArray[i3 + 1] < -1.5) posArray[i3 + 1] = 7;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#fde68a"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ─── Sky Gradient Background ───────────────────────────────────
const SkyBackground = () => {
  const meshRef = useRef();

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.9999, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    void main() {
      // Sky gradient: warm gold at bottom → soft blue at top
      vec3 topColor = vec3(0.45, 0.65, 0.85);       // Soft sky blue
      vec3 midColor = vec3(0.70, 0.82, 0.55);        // Misty green
      vec3 bottomColor = vec3(0.95, 0.85, 0.55);     // Warm sunset gold

      vec3 color;
      if (vUv.y < 0.4) {
        color = mix(bottomColor, midColor, vUv.y / 0.4);
      } else {
        color = mix(midColor, topColor, (vUv.y - 0.4) / 0.6);
      }

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh ref={meshRef} renderOrder={-1000}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

// ─── Gentle Camera Auto-Rotation & Swoop ──────────────────────────
const CameraRig = () => {
  const { camera } = useThree();
  const initialized = useRef(false);

  useEffect(() => {
    // Initial camera position far away and high up
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, -2);
    
    // Cinematic swoop-in using GSAP
    gsap.to(camera.position, {
      x: 0,
      y: 2,
      z: 6,
      duration: 2.5,
      ease: 'power3.out',
      onComplete: () => {
        initialized.current = true;
      }
    });
  }, [camera]);

  useFrame(({ clock }) => {
    if (!initialized.current) return;
    const t = clock.getElapsedTime() - 2.5; // offset time by swoop duration
    if (t < 0) return;
    
    // Gentle sway after swoop is complete
    camera.position.x = Math.sin(t * 0.08) * 1.5;
    camera.position.y = 2 + Math.sin(t * 0.12) * 0.3;
    camera.lookAt(0, 0, -2);
  });
  
  return null;
};

// ─── Simple 3D Scenery Components ──────────────────────────────
const LowPolyTree = ({ position, scale = 1, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      {/* Trunk */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.8, 5]} />
        <meshLambertMaterial color="#4a3b32" />
      </mesh>
      {/* Leaves (Layer 1) */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.8, 1.5, 5]} />
        <meshLambertMaterial color="#22c55e" flatShading />
      </mesh>
      {/* Leaves (Layer 2) */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.6, 1.2, 5]} />
        <meshLambertMaterial color="#16a34a" flatShading />
      </mesh>
      {/* Leaves (Layer 3) */}
      <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.4, 0.8, 5]} />
        <meshLambertMaterial color="#15803d" flatShading />
      </mesh>
    </group>
  );
};

const LowPolyStone = ({ position, scale = 1, rotation = [0, 0, 0] }) => {
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.4, 0]} />
      <meshLambertMaterial color="#9ca3af" flatShading />
    </mesh>
  );
};

const GrassTuft = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={scale}>
      {[...Array(5)].map((_, i) => (
        <mesh 
          key={i} 
          position={[(Math.random() - 0.5) * 0.2, 0.2, (Math.random() - 0.5) * 0.2]} 
          rotation={[(Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4]}
        >
          <coneGeometry args={[0.02, 0.4 + Math.random() * 0.2, 3]} />
          <meshLambertMaterial color={Math.random() > 0.5 ? "#4ade80" : "#22c55e"} flatShading />
        </mesh>
      ))}
    </group>
  );
};

// ─── Flora & Fauna Additions ──────────────────────────────────
const Flower = ({ position, scale = 1, color = "#f43f5e" }) => {
  return (
    <group position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshLambertMaterial color="#16a34a" />
      </mesh>
      {/* Flower Head */}
      <group position={[0, 0.4, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.06, 5, 5]} />
          <meshLambertMaterial color="#fbbf24" flatShading />
        </mesh>
        {[...Array(5)].map((_, i) => (
          <mesh key={`petal-${i}`} position={[Math.sin(i * Math.PI * 0.4) * 0.1, Math.cos(i * Math.PI * 0.4) * 0.1, 0]} castShadow>
            <sphereGeometry args={[0.05, 5, 5]} />
            <meshLambertMaterial color={color} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const Bird = ({ offset = 0, speed = 1, startPos = [0, 5, 0], radius = 10 }) => {
  const group = useRef();
  const wings = useRef();
  
  useFrame(({ clock }) => {
    if (!group.current || !wings.current) return;
    const t = clock.getElapsedTime();
    const time = t * speed + offset;
    
    // Circular path
    group.current.position.x = startPos[0] + Math.sin(time * 0.3) * radius;
    group.current.position.z = startPos[2] + Math.cos(time * 0.3) * radius;
    group.current.position.y = startPos[1] + Math.sin(time * 1.5) * 0.5;
    
    // Orient along path (tangent to circle)
    group.current.rotation.y = (time * 0.3) + Math.PI; 
    
    // Flap wings
    wings.current.rotation.x = Math.sin(time * 15) * 0.6;
  });

  return (
    <group ref={group} scale={0.15}>
      {/* Body */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
         <coneGeometry args={[0.2, 1, 3]} />
         <meshLambertMaterial color="#334155" flatShading />
      </mesh>
      {/* Wings Wrapper */}
      <group ref={wings}>
        <mesh position={[0.6, 0, 0]} rotation={[0, -0.2, 0]} castShadow>
          <boxGeometry args={[1.2, 0.05, 0.4]} />
          <meshLambertMaterial color="#475569" />
        </mesh>
        <mesh position={[-0.6, 0, 0]} rotation={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.2, 0.05, 0.4]} />
          <meshLambertMaterial color="#475569" />
        </mesh>
      </group>
    </group>
  );
};

const Butterfly = ({ offset = 0, startPos = [0, -2, 0] }) => {
  const group = useRef();
  const leftWing = useRef();
  const rightWing = useRef();
  const color = useMemo(() => ["#60a5fa", "#fbbf24", "#f472b6", "#a78bfa"][Math.floor(Math.random() * 4)], []);

  useFrame(({ clock }) => {
    if (!group.current || !leftWing.current || !rightWing.current) return;
    const t = clock.getElapsedTime() + offset;
    
    // Fluttering animation (rapid flap)
    const flap = Math.sin(t * 25) * 0.8;
    leftWing.current.rotation.y = flap;
    rightWing.current.rotation.y = -flap;

    // Chaotic path
    group.current.position.x = startPos[0] + Math.sin(t * 0.5) * 3 + Math.sin(t * 1.5) * 0.5;
    group.current.position.y = startPos[1] + Math.abs(Math.sin(t * 1.2)) * 1.5;
    group.current.position.z = startPos[2] + Math.cos(t * 0.4) * 3 + Math.cos(t * 1.8) * 0.5;
    
    // Twisting orientation
    group.current.rotation.y = Math.sin(t * 0.5) * Math.PI;
    group.current.rotation.x = Math.sin(t * 2) * 0.2;
    group.current.rotation.z = Math.cos(t * 2) * 0.2;
  });

  return (
    <group ref={group} scale={0.06}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1]} />
        <meshLambertMaterial color="#333" />
      </mesh>
      <group position={[0.1, 0, 0]} ref={leftWing}>
        <mesh position={[0.5, 0, 0]} castShadow>
          <planeGeometry args={[1, 1]} />
          <meshLambertMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group position={[-0.1, 0, 0]} ref={rightWing}>
        <mesh position={[-0.5, 0, 0]} castShadow>
          <planeGeometry args={[1, 1]} />
          <meshLambertMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

const SceneryEnvironment = () => {
  // Static scattered positions
  const trees = useMemo(() => [
    { pos: [-6, -2.5, -8], scale: 1.5, rot: [0, Math.random() * Math.PI, 0] },
    { pos: [7, -2.5, -9], scale: 1.8, rot: [0, Math.random() * Math.PI, 0] },
    { pos: [-9, -2.5, -4], scale: 1.2, rot: [0, Math.random() * Math.PI, 0] },
    { pos: [8, -2.5, -3], scale: 1.4, rot: [0, Math.random() * Math.PI, 0] },
    { pos: [-4, -2.5, -12], scale: 2.0, rot: [0, Math.random() * Math.PI, 0] },
    { pos: [3, -2.5, -14], scale: 1.6, rot: [0, Math.random() * Math.PI, 0] },
  ], []);

  const stones = useMemo(() => [
    { pos: [-2, -2.5, -4], scale: 1, rot: [Math.random(), Math.random(), Math.random()] },
    { pos: [4, -2.5, -5], scale: 0.8, rot: [Math.random(), Math.random(), Math.random()] },
    { pos: [-6, -2.5, -6], scale: 1.3, rot: [Math.random(), Math.random(), Math.random()] },
    { pos: [6, -2.5, -8], scale: 1.5, rot: [Math.random(), Math.random(), Math.random()] },
    { pos: [1, -2.5, -7], scale: 0.6, rot: [Math.random(), Math.random(), Math.random()] },
  ], []);

  const grassTufts = useMemo(() => {
    const tufts = [];
    for (let i = 0; i < 60; i++) {
      tufts.push({
        pos: [(Math.random() - 0.5) * 24, -2.5, (Math.random() - 0.5) * 16 - 2],
        scale: 0.8 + Math.random() * 0.6
      });
    }
    return tufts;
  }, []);

  const flowers = useMemo(() => {
    const list = [];
    const colors = ["#f43f5e", "#fbbf24", "#e879f9", "#38bdf8"];
    for (let i = 0; i < 15; i++) {
      list.push({
        pos: [(Math.random() - 0.5) * 20, -2.5, (Math.random() - 0.5) * 12 - 3],
        scale: 0.8 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    return list;
  }, []);

  return (
    <group>
      {trees.map((t, i) => <LowPolyTree key={`tree-${i}`} position={t.pos} scale={t.scale} rotation={t.rot} />)}
      {stones.map((s, i) => <LowPolyStone key={`stone-${i}`} position={s.pos} scale={s.scale} rotation={s.rot} />)}
      {grassTufts.map((g, i) => <GrassTuft key={`grass-${i}`} position={g.pos} scale={g.scale} />)}
      {flowers.map((f, i) => <Flower key={`flower-${i}`} position={f.pos} scale={f.scale} color={f.color} />)}
      
      {/* Animated Fauna */}
      <Bird offset={0} speed={0.8} startPos={[0, 4, -8]} radius={12} />
      <Bird offset={2} speed={1.1} startPos={[2, 5, -10]} radius={15} />
      <Bird offset={5} speed={0.9} startPos={[-3, 6, -12]} radius={10} />
      
      <Butterfly offset={0} startPos={[-4, -2.3, -5]} />
      <Butterfly offset={1.5} startPos={[5, -2.3, -6]} />
      <Butterfly offset={3.2} startPos={[0, -2.3, -4]} />
      <Butterfly offset={5.1} startPos={[-2, -2.3, -8]} />
    </group>
  );
};

// ─── Main Background Component ──────────────────────────────────
const AgriBackground = () => {
  return (
    <div className="auth-canvas-container">
      <Canvas
        camera={{ position: [0, 2, 6], fov: 55, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        shadows
      >
        <SkyBackground />

        {/* Lighting */}
        <ambientLight intensity={0.6} color="#f5f0e0" />
        <directionalLight
          position={[8, 12, 4]}
          intensity={1.5}
          color="#fff8e7"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={30}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight
          position={[-3, 4, -2]}
          intensity={0.4}
          color="#a7f3d0"
        />

        {/* Scene elements */}
        <GrassField />
        <SceneryEnvironment />
        <FloatingParticles count={100} />
        <CameraRig />

        {/* Fog for depth */}
        <fog attach="fog" args={['#c5d9a4', 8, 25]} />
      </Canvas>
      <div className="auth-canvas-overlay" />
    </div>
  );
};

export default AgriBackground;
