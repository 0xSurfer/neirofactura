/* ========================================
   NEURAL.FORM — Canvas Wave Animation
   ======================================== */

export function initWaves() {
    const canvas = document.getElementById('wavesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let time = 0;
    let animationId;
    let isVisible = true;
    
    const config = {
        count: 25,
        baseSpeed: 0.002,
        amplitude: 100,
        spread: 150
    };
    
    const lines = [];
    
    class WaveLine {
        constructor(index) {
            this.index = index;
            this.reset();
        }
        
        reset() {
            this.phase = (this.index / config.count) * Math.PI * 2;
            this.speed = config.baseSpeed + (Math.random() * 0.001);
            this.amplitude = 50 + Math.random() * 100;
            this.yOffset = (Math.random() - 0.5) * 150;
        }
        
        draw() {
            ctx.beginPath();
            
            for (let x = 0; x < width; x += 10) {
                const normalizeX = x / width;
                
                const y1 = Math.sin(normalizeX * Math.PI + time + this.phase) * this.amplitude;
                const y2 = Math.cos(normalizeX * Math.PI * 2 + time * 1.5) * (this.amplitude * 0.2);
                
                const taper = Math.sin(normalizeX * Math.PI);
                const y = (height / 2) + (y1 + y2) * taper + this.yOffset;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            const alpha = 0.05 + (Math.sin(time + this.phase) + 1) / 2 * 0.15;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
    
    function resize() {
        const dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        ctx.scale(dpr, dpr);
    }
    
    function animate() {
        if (!isVisible) {
            animationId = requestAnimationFrame(animate);
            return;
        }
        
        ctx.clearRect(0, 0, width * (window.devicePixelRatio || 1), height * (window.devicePixelRatio || 1));
        
        time += 0.005;
        lines.forEach(line => line.draw());
        
        animationId = requestAnimationFrame(animate);
    }
    
    function init() {
        resize();
        
        // Очищаем старые линии
        lines.length = 0;
        
        for (let i = 0; i < config.count; i++) {
            lines.push(new WaveLine(i));
        }
        
        animate();
    }
    
    // Pause animation when tab is hidden
    document.addEventListener('visibilitychange', () => {
        isVisible = document.visibilityState === 'visible';
    });
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 200);
    }, { passive: true });
    
    init();
    
    // Cleanup function
    return () => {
        cancelAnimationFrame(animationId);
    };
}
