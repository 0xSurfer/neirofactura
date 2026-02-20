/* ========================================
   NEIROFACTURA — Main Entry Point
   ======================================== */

// Cursor Module (inline)
(function initCursor() {
    const cursor = document.getElementById('cursor');
    
    // Проверяем, что мы не на тач-устройстве
    const isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    
    if (!cursor || isTouch) {
        if (cursor) cursor.style.display = 'none';
        return;
    }
    
    // Скрываем курсор до первого движения мыши
    cursor.style.opacity = '0';
    
    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let isFirstMove = true;
    let rafId;
    
    // Плавное следование за курсором
    function animate() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        rafId = requestAnimationFrame(animate);
    }
    
    // Отслеживаем движение мыши
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Показываем курсор при первом движении
        if (isFirstMove) {
            isFirstMove = false;
            cursorX = mouseX;
            cursorY = mouseY;
            cursor.style.opacity = '1';
        }
    }, { passive: true });
    
    // Hover-эффект на интерактивных элементах
    const interactiveElements = document.querySelectorAll(
        'a, button, .service-card, .portfolio-item, .diagram-box, input, textarea'
    );
    
    interactiveElements.forEach(function(el) {
        el.addEventListener('mouseenter', function() { cursor.classList.add('hovered'); });
        el.addEventListener('mouseleave', function() { cursor.classList.remove('hovered'); });
    });
    
    // Скрываем курсор когда мышь уходит за пределы окна
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
    });
    
    animate();
})();

// Waves Module (inline)
(function initWaves() {
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
    
    function WaveLine(index) {
        this.index = index;
        this.reset();
    }
    
    WaveLine.prototype.reset = function() {
        this.phase = (this.index / config.count) * Math.PI * 2;
        this.speed = config.baseSpeed + (Math.random() * 0.001);
        this.amplitude = 50 + Math.random() * 100;
        this.yOffset = (Math.random() - 0.5) * 150;
    };
    
    WaveLine.prototype.draw = function() {
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
        ctx.strokeStyle = 'rgba(255, 255, 255, ' + alpha + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
    };
    
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
        
        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, width * dpr, height * dpr);
        
        time += 0.005;
        for (let i = 0; i < lines.length; i++) {
            lines[i].draw();
        }
        
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
    document.addEventListener('visibilitychange', function() {
        isVisible = document.visibilityState === 'visible';
    });
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 200);
    }, { passive: true });
    
    init();
})();

// Scroll reveal (optional)
(function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    if (!reveals.length) return;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(function(el) { observer.observe(el); });
})();



// Methodology Node Animation (n8n style) - Ping-pong cycle
(function initNodeAnimation() {
    const nodeBoxes = document.querySelectorAll('.node-box');
    const connectorLines = document.querySelectorAll('.connector-line');
    
    if (!nodeBoxes.length) return;
    
    let isAnimating = false;

    // Forward sequence: 0->1->2 (indices for nodes 1,2,3)
    // Backward sequence: 2->1->0
    function runCycle() {
        // Forward: 1 -> 2 -> 3
        animateForward(0, function() {
            // Pause, then backward: 3 -> 2 -> 1
            setTimeout(function() {
                animateBackward(2, function() {
                    // Pause, then restart cycle (4 seconds pause)
                    setTimeout(runCycle, 4000);
                });
            }, 500);
        });
    }

    function animateForward(index, onComplete) {
        if (index >= nodeBoxes.length) {
            if (onComplete) onComplete();
            return;
        }

        activateNode(index, 1, function() {
            animateForward(index + 1, onComplete);
        });
    }

    function animateBackward(index, onComplete) {
        if (index < 0) {
            if (onComplete) onComplete();
            return;
        }

        activateNode(index, -1, function() {
            animateBackward(index - 1, onComplete);
        });
    }

    function activateNode(nodeIndex, dir, onDone) {
        const node = nodeBoxes[nodeIndex];
        const progressRect = node.querySelector('.progress-rect');
        
        if (!progressRect) {
            if (onDone) onDone();
            return;
        }
        
        // Activate node
        progressRect.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
        progressRect.style.strokeDashoffset = '0';
        node.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.25)';
        node.style.borderColor = '#FFFFFF';

        setTimeout(function() {
            // Animate connector (if not last node in sequence)
            const connectorIndex = dir === 1 ? nodeIndex : nodeIndex - 1;
            
            if (connectorIndex >= 0 && connectorIndex < connectorLines.length) {
                const connector = connectorLines[connectorIndex];
                const pulse = connector.querySelector('.connector-pulse');
                
                if (pulse) {
                    pulse.style.opacity = '1';
                    
                    if (dir === 1) {
                        // Forward: pulse goes down (from top to bottom)
                        // Default position is translateY(-100%), animate to full bottom
                        pulse.style.transition = 'transform 0.8s ease-in, opacity 0.3s ease';
                        pulse.style.transform = 'translateX(-50%) translateY(650%)';
                    } else {
                        // Backward: pulse goes up (from bottom to top)
                        // First set starting position at bottom without animation
                        pulse.style.transition = 'none';
                        pulse.style.transform = 'translateX(-50%) translateY(650%)';
                        // Force reflow
                        pulse.offsetHeight;
                        // Now animate to full top
                        pulse.style.transition = 'transform 0.8s ease-in, opacity 0.3s ease';
                        pulse.style.transform = 'translateX(-50%) translateY(-550%)';
                    }

                    setTimeout(function() {
                        pulse.style.opacity = '0';
                        pulse.style.transform = 'translateX(-50%) translateY(-100%)';
                        pulse.style.transition = 'none';
                    }, 800);
                }
            }

            // Reset node and continue
            setTimeout(function() {
                progressRect.style.transition = 'stroke-dashoffset 0.5s ease';
                progressRect.style.strokeDashoffset = progressRect.getAttribute('stroke-dasharray') || '1000';
                node.style.boxShadow = 'none';
                node.style.borderColor = '';

                if (onDone) onDone();
            }, 500);
        }, 1500);
    }

    function startNodeAnimation() {
        if (!isAnimating) {
            isAnimating = true;
            runCycle();
        }
    }

    // Start animation on page load (with delay)
    setTimeout(startNodeAnimation, 1000);

    // Restart animation when methodology section is in view
    const methodologySection = document.querySelector('.methodology');
    if (methodologySection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !isAnimating) {
                    startNodeAnimation();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(methodologySection);
    }
})();

// Burger Menu
(function initBurger() {
    console.log('Burger init started');
    const burger = document.querySelector('.burger');
    const mobileNav = document.querySelector('.nav--mobile');
    
    console.log('Found:', {burger: !!burger, mobileNav: !!mobileNav});
    
    if (!burger || !mobileNav) {
        console.log('Burger or mobile nav not found');
        return;
    }
    
    burger.addEventListener('click', function(e) {
        e.stopPropagation();
        const isActive = !burger.classList.contains('active');
        burger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : '';
        
        if (isActive) {
            // Opening - force inline styles
            burger.querySelectorAll('.burger__line').forEach(function(line, i) {
                line.style.background = '#F2F2F2';
                if (i === 0) line.style.transform = 'translateY(8.5px) rotate(45deg)';
                if (i === 2) line.style.transform = 'translateY(-8.5px) rotate(-45deg)';
                if (i === 1) {
                    line.style.opacity = '0';
                    line.style.transform = 'scaleX(0)';
                }
            });
        } else {
            // Closing - reset styles
            burger.querySelectorAll('.burger__line').forEach(function(line) {
                line.style.background = '';
                line.style.height = '';
                line.style.transform = '';
                line.style.opacity = '';
            });
        }
    });
    
    // Close menu when clicking on links
    mobileNav.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            burger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset inline styles
            burger.querySelectorAll('.burger__line').forEach(function(line) {
                line.style.background = '';
                line.style.height = '';
                line.style.transform = '';
                line.style.opacity = '';
            });
        });
    });
})();
