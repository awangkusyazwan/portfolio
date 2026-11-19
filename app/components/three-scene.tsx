'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useSyncExternalStore } from 'react';
import { CineonToneMapping, type Mesh } from 'three';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const CUBE_COLORS = {
  light: '#14b8a6',
  dark: '#2dd4bf',
} as const;

function subscribeToReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener('change', onChange);

  return () => media.removeEventListener('change', onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, () => false);
}

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return () => observer.disconnect();
}

function getThemeSnapshot() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function useIsDarkTheme() {
  return useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => false);
}

type SceneContentsProps = {
  animate: boolean;
  dark: boolean;
};

const RotatingBox = ({ animate, dark }: SceneContentsProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!animate || !meshRef.current) return;

    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={dark ? CUBE_COLORS.dark : CUBE_COLORS.light}
        roughness={0.7}
        metalness={0.3}
      />
    </mesh>
  );
};

const SceneContents = ({ animate, dark }: SceneContentsProps) => (
  <>
    <ambientLight intensity={0.5} />
    <directionalLight
      position={[-2, 2, 1]}
      intensity={1}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
    <RotatingBox animate={animate} dark={dark} />
  </>
);

export const ThreeScene = () => {
  const reducedMotion = usePrefersReducedMotion();
  const dark = useIsDarkTheme();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <Canvas
        shadows
        frameloop={reducedMotion ? 'demand' : 'always'}
        camera={{ position: [2, 2, 2], fov: 60 }}
        gl={{ alpha: true, antialias: true, toneMapping: CineonToneMapping }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
        dpr={[1, 1.75]}
      >
        <SceneContents animate={!reducedMotion} dark={dark} />
      </Canvas>
    </div>
  );
};
