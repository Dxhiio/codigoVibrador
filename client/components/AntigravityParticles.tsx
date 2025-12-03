import { useEffect, useRef } from 'react';

export default function AntigravityParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const parent = canvas.parentElement;
        if (!parent) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = parent.clientWidth;
        let height = parent.clientHeight;

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                width = entry.contentRect.width;
                height = entry.contentRect.height;
                canvas.width = width;
                canvas.height = height;
            }
        });

        resizeObserver.observe(parent);

        // Mouse interaction
        let mouse = { x: -1000, y: -1000 };
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };
        
        // Listen to mouse move on the parent container for better UX
        parent.addEventListener('mousemove', handleMouseMove);
        parent.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

        // Configuration
        const particleCount = 80; // Fewer particles for cleaner look
        const particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            size: number;
            speedY: number;
            speedX: number;
            alpha: number;
            angle: number;
            
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1; // Slightly larger for visibility
                this.speedY = Math.random() * 0.3 + 0.1; // Slow, deliberate floating
                this.speedX = 0;
                this.alpha = Math.random() * 0.4 + 0.1; // Subtle transparency
                this.angle = Math.random() * Math.PI * 2;
            }

            update() {
                // Mouse interaction (Gentle Repulsion)
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 120;

                if (distance < maxDistance) {
                    const force = (maxDistance - distance) / maxDistance;
                    const angle = Math.atan2(dy, dx);
                    this.speedX += Math.cos(angle) * force * 0.3;
                    this.speedY += Math.sin(angle) * force * 0.3;
                }

                // Antigravity movement (Upwards with slight acceleration)
                this.speedY += 0.001; // Tiny upward acceleration
                this.y -= this.speedY;
                this.x += this.speedX + Math.sin(this.angle) * 0.2; // Organic sway
                
                this.angle += 0.005;

                // Friction
                this.speedX *= 0.96;
                this.speedY = Math.min(this.speedY, 2); // Cap max speed
                
                // Reset
                if (this.y < -10) {
                    this.y = height + 10;
                    this.x = Math.random() * width;
                    this.speedX = 0;
                    this.speedY = Math.random() * 0.3 + 0.1; // Reset speed
                }
            }

            draw() {
                if (!ctx) return;

                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = '#e2e8f0'; // Slate-200 (Cool Grey/White)
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            resizeObserver.disconnect();
            parent.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0" // z-0 is fine inside the relative container if content is z-10
            style={{ mixBlendMode: 'overlay' }} // Overlay for subtle integration
        />
    );
}
