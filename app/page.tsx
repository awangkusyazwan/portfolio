'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

const useScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff00ff, 1); // Neon Purple light
    pointLight.position.set(0, 2, 5);
    scene.add(pointLight);

    // 3. The 3D Object (An Icosahedron with wireframe)
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, // Tailwind Violet-500
      roughness: 0.4,
      metalness: 0.8,
      wireframe: true
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // 4. Add a second object (A Torus Knot) for complexity
    const torusGeometry = new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16);
    const torusMaterial = new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.3 });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    // 5. Mouse Interaction Logic
    let mouseX = 0;
    let mouseY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    function handleMousemove(event: MouseEvent) {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);

      // Update object rotation based on mouse
      sphere.rotation.x += 0.05 * (mouseY + sphere.rotation.y);
      sphere.rotation.y -= 0.05 * (mouseX + sphere.rotation.x);
    }

    // --- RENDER LOOP ---
    function animate() {
      requestAnimationFrame(animate);

      // Smooth rotation logic
      const time = Date.now();

      // Auto rotate slowly if not moving mouse drastically
      sphere.rotation.y += 0.02;
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
      containerRef.current?.removeChild(renderer.domElement);
      window.removeEventListener('mousemove', handleMousemove);
      window.removeEventListener('resize', resizeWindow);
    };
  }, []);

  return containerRef;
}

// --- MAIN PAGE RENDER ---
export default function Portfolio() {
  const container = useScene(); // This hook initializes the 3D canvas

  return (
    <main className="relative w-full h-screen overflow-hidden">

      {/* THE 3D BACKGROUND CANVAS */}
      <div ref={container} className="fixed inset-0 pointer-events-none z-0" />

      {/* PORTFOLIO CONTENT OVERLAY */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-8">

        {/* Navbar */}
        <nav className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400
to-cyan-500">
            Awangku Syazwan
          </h1>
          <div className="space-x-4">
            <Link href="#" className="px-4 py-2 border border-white/30 rounded-full hover:bg-white/10
transition">Work</Link>
            <Link href="#" className="px-4 py-2 border border-white/30 rounded-full hover:bg-white/10
transition">About</Link>
            <Link href="#" className="px-4 py-2 bg-purple-600 rounded-full hover:bg-purple-500 transition shadow-lg
shadow-purple-500/50">Contact</Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-end justify-between h-[80vh]">
          <div className="max-w-xl">
            <h2 className="text-6xl font-black mb-6 leading-tight">
              Creative <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400
to-blue-500">Developer</span>
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-md leading-relaxed">
              Welcome to my portfolio site. I'm a software developer specialising in web development using MERN  stack.
            </p>

            <div className="flex space-x-4">
              <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition
shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                <a target="_blank" href="https://resume.awangkusyazwan.my">Download CV/Resume</a>
              </button>
            </div>
          </div>

          {/* Glassmorphism card to sit on top of 3D scene */}
          <div className="hidden md:block mt-auto w-96 bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6
rounded-2xl hover:border-purple-500/50 transition duration-500">
            <p className="text-sm text-slate-400 uppercase tracking-widest mb-2">Stack</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {['React', 'Next.js', 'Three.js', 'TypeScript', 'Tailwind'].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-slate-800/50 rounded-lg border border-white/5 text-xs
font-mono text-cyan-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid (Sitting at bottom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[20vh]">
          {/* Project 1 Card */}
          <Link href="#" className="group relative overflow-hidden rounded-xl bg-slate-900/30 backdrop-blur-md border
border-white/5 p-8 hover:border-purple-500 transition-all duration-300 hover:bg-slate-800/40">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-500 opacity-0
group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">E-Commerce 3D</h3>
            <p className="text-slate-400 text-sm">A fully functional store with WebGL product previews.</p>
          </Link>

          {/* Project 2 Card */}
          <Link href="#" className="group relative overflow-hidden rounded-xl bg-slate-900/30 backdrop-blur-md border
border-white/5 p-8 hover:border-pink-500 transition-all duration-300 hover:bg-slate-800/40">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-red-500 opacity-0
group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xl font-bold mb-2 group-hover:text-pink-400 transition-colors">Portfolio V1</h3>
            <p className="text-slate-400 text-sm">My previous work showcasing the evolution of my UI/UX skills.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
