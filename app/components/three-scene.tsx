'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff00ff, 1); // Neon Purple light
    pointLight.position.set(0, 2, 5);
    scene.add(pointLight);

    // 3. The 3D Object (An Icosahedron with wireframe)
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
      metalness: 0.8,
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // 4. Add a second object (A Torus Knot) for complexity
    const torusGeometry = new THREE.TorusKnotGeometry(0.8, 0.2, 100, 16);
    const torusMaterial = new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.3 });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    // 5. Animation + mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function handleMousemove(event: MouseEvent) {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;

      // Update object rotation based on mouse
      sphere.rotation.x += 0.0002 * (mouseY + sphere.rotation.y);
      sphere.rotation.y -= 0.0002 * (mouseX + sphere.rotation.x);
    }

    // --- RENDER LOOP ---
    let frameId = 0;

    function animate() {
      frameId = requestAnimationFrame(animate);

      // Smooth rotation logic
      sphere.rotation.y += 0.002;
      torus.rotation.x -= 0.01;
      torus.rotation.y += 0.01;

      renderer.render(scene, camera);
    }

    animate();
    window.addEventListener('mousemove', handleMousemove);

    // Handle Resize
    function resizeWindow() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', resizeWindow);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMousemove);
      window.removeEventListener('resize', resizeWindow);

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      torusGeometry.dispose();
      torusMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" />;
};
