/* ========================================
   NEURAL.FORM — Custom Cursor
   ======================================== */

export function initCursor() {
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
    
    // Плавное следование за курсором
    function animate() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animate);
    }
    
    // Отслеживаем движение мыши
    document.addEventListener('mousemove', (e) => {
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
        'a, button, .service-card, .portfolio-item, input, textarea'
    );
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
    
    // Скрываем курсор когда мышь уходит за пределы окна
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
    
    animate();
}
