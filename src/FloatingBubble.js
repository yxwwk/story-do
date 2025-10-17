import React, { useState, useRef } from 'react';

const FloatingBubble = () => {
  // 使用top和left统一的位置状态
  const [position, setPosition] = useState({
    top: 20,
    left: window.innerWidth - 100 // 初始位置在右上角，考虑气泡宽度80px和一些边距
  });
  
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const bubbleRef = useRef(null);

  // 确保在组件挂载后添加清理函数
  React.useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // 鼠标按下事件
  const handleMouseDown = (e) => {
    if (!bubbleRef.current) return;
    
    e.preventDefault();
    isDragging.current = true;
    
    // 更新鼠标样式为'grabbing'
    bubbleRef.current.style.cursor = 'grabbing';
    
    const rect = bubbleRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  // 触摸按下事件
  const handleTouchStart = (e) => {
    if (!bubbleRef.current) return;
    
    e.preventDefault();
    isDragging.current = true;
    
    const touch = e.touches[0];
    const rect = bubbleRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  // 鼠标移动事件
  const handleMouseMove = (e) => {
    if (!isDragging.current || !bubbleRef.current) return;
    
    updatePosition(e.clientX, e.clientY);
  };
  
  // 触摸移动事件
  const handleTouchMove = (e) => {
    if (!isDragging.current || !bubbleRef.current) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  };
  
  // 更新位置的通用函数，添加边界检查
  const updatePosition = (clientX, clientY) => {
    const bubbleWidth = 80;
    const bubbleHeight = 80;
    
    // 计算新位置并添加边界检查
    let newLeft = clientX - dragOffset.current.x;
    let newTop = clientY - dragOffset.current.y;
    
    // 确保不会超出视口边界
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - bubbleWidth));
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - bubbleHeight));
    
    setPosition({
      top: newTop,
      left: newLeft
    });
  };

  // 鼠标释放事件
  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // 恢复鼠标样式
    if (bubbleRef.current) {
      bubbleRef.current.style.cursor = 'grab';
    }
  };
  
  // 触摸结束事件
  const handleTouchEnd = () => {
    isDragging.current = false;
    document.removeEventListener('touchmove', handleTouchMove, { passive: false });
    document.removeEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      ref={bubbleRef}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: '80px',
        height: '80px',
        backgroundColor: '#4A90E2',
        borderRadius: '50%',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        userSelect: 'none',
        touchAction: 'none',
        // 防止拖拽时选中文本
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        MsUserSelect: 'none',
        // 确保快速响应
        transition: 'none',
        // 提升性能
        willChange: 'transform',
        // 添加持续动效，只在非拖拽状态下显示
        animation: isDragging.current ? 'none' : 'floatAndBreathe 4s ease-in-out infinite'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDragStart={(e) => e.preventDefault()} // 防止拖动时默认的拖拽行为
    >
      💬
    </div>
  );
};

export default FloatingBubble;