import React, { useState, useRef, useEffect } from 'react';
import avatarImage from './img/avatar.png';

const FloatingBubble = () => {
  // 先定义计算位置的函数，然后再在useState中使用它
  const calculatePosition = () => {
    // 尝试找到todo-card-container元素
    const todoContainer = document.querySelector('.todo-card-container');
    
    // 对于H5移动端，恢复到右上角
    if (window.innerWidth <= 768) {
      return {
        top: 20,
        left: window.innerWidth - 100 // 考虑气泡宽度80px和一些边距
      };
    }
    
    // PC端的默认位置
    let defaultTop = 20; // 更靠上的位置
    let defaultLeft = 20;
    
    // 如果找到了todo容器，基于它的位置计算
    if (todoContainer) {
      const containerRect = todoContainer.getBoundingClientRect();
      // 放在todo容器右侧，留出一些间距
      defaultLeft = containerRect.right + 40;
      // 更靠上的位置，而不是居中
      defaultTop = containerRect.top; // 与todo容器顶部对齐
    }
    
    return {
      top: defaultTop,
      left: defaultLeft
    };
  };
  
  // 使用top和left统一的位置状态
  const [position, setPosition] = useState(() => {
    // 初始位置计算
    return calculatePosition();
  });
  
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const bubbleRef = useRef(null);
  const bubbleContainerRef = useRef(null);

  // 生成小泡泡的函数
  const createBubble = () => {
    if (!bubbleContainerRef.current) return;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // 随机大小、位置和透明度
    const size = Math.random() * 10 + 5; // 5-15px
    const left = Math.random() * 60 + 10; // 10-70px (在容器内)
    const opacity = Math.random() * 0.4 + 0.3; // 0.3-0.7
    const delay = Math.random() * 0.5; // 0-0.5s 随机延迟
    
    // 多种颜色选择
    const colors = [
      'rgba(147, 197, 253, 0.6)',  // 蓝色
      'rgba(152, 251, 152, 0.6)',  // 绿色
      'rgba(255, 228, 181, 0.6)',  // 橙色
      'rgba(255, 182, 193, 0.6)',  // 粉色
      'rgba(221, 160, 221, 0.6)'   // 紫色
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${left}px`;
    bubble.style.bottom = `0px`;
    bubble.style.opacity = opacity;
    bubble.style.animationDelay = `${delay}s`;
    bubble.style.backgroundColor = color;
    
    // 创建一个包装元素来实现泡泡上升到悬浮框上方的效果
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.style.position = 'absolute';
    bubbleWrapper.style.width = `${size}px`;
    bubbleWrapper.style.height = `${size}px`;
    bubbleWrapper.style.left = `${left}px`;
    bubbleWrapper.style.bottom = `0px`;
    bubbleWrapper.style.overflow = 'visible';
    bubbleWrapper.style.zIndex = '-1';
    
    bubbleWrapper.appendChild(bubble);
    bubbleContainerRef.current.appendChild(bubbleWrapper);
    
    // 动画结束后移除元素
    setTimeout(() => {
      if (bubbleWrapper.parentNode === bubbleContainerRef.current) {
        bubbleContainerRef.current.removeChild(bubbleWrapper);
      }
    }, 3500);
  };

  // 确保在组件挂载后添加清理函数，并监听窗口大小变化
  React.useEffect(() => {
      // 添加CSS动画样式到文档
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        @keyframes floatAndBreathe {
          0% {
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-3px) scale(1.01);
          }
          50% {
            transform: translateY(0) scale(1);
          }
          75% {
            transform: translateY(-3px) scale(1.01);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes glowingBorder {
          0% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
                        0 0 0 0 rgba(147, 197, 253, 0.4);
          }
          70% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
                        0 0 0 10px rgba(147, 197, 253, 0);
          }
          100% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15),
                        0 0 0 0 rgba(147, 197, 253, 0);
          }
        }
        
        @keyframes borderPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 182, 193, 0.7),
                        inset 0 0 0 0 rgba(255, 182, 193, 0.7);
          }
          50% {
            box-shadow: 0 0 0 5px rgba(255, 182, 193, 0),
                        inset 0 0 0 5px rgba(255, 182, 193, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 182, 193, 0),
                        inset 0 0 0 0 rgba(255, 182, 193, 0);
          }
        }
        
        /* 小泡泡动画 */
        @keyframes bubbleFloat {
          0% {
            transform: translateY(0) scale(0);
            opacity: 0.8;
          }
          20% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-150px) scale(1);
            opacity: 0;
          }
        }
        
        .bubble {
          position: absolute;
          background-color: rgba(147, 197, 253, 0.6);
          border-radius: 50%;
          animation: bubbleFloat 3s ease-out forwards;
          pointer-events: none;
          z-index: -1; /* 确保泡泡在悬浮框下方 */
        }
      `;
      document.head.appendChild(styleElement);
      
      // 定时生成小泡泡
      let bubbleInterval;
      
      // 延迟一段时间后开始生成小泡泡，避免页面刚加载就有太多动画
      const startBubbles = setTimeout(() => {
        bubbleInterval = setInterval(() => {
          // 每次生成多个泡泡（3-5个）
          const bubbleCount = Math.floor(Math.random() * 3) + 3; // 3-5个泡泡
          for (let i = 0; i < bubbleCount; i++) {
            // 给每个泡泡一些延迟，避免同时出现
            setTimeout(() => {
              createBubble();
            }, i * 150);
          }
        }, 2000); // 提高频率，每2秒生成一次
      }, 2000); // 2秒后开始
      
      // 窗口大小变化处理函数
      const handleResize = () => {
        // 只有在非拖拽状态下才更新位置
        if (!isDragging.current) {
          setPosition(calculatePosition());
        }
      };
      
      // 页面加载完成后再调整位置，确保DOM元素已渲染
      setTimeout(() => {
        if (!isDragging.current) {
          setPosition(calculatePosition());
        }
      }, 100);
      
      // 添加窗口大小变化监听
      window.addEventListener('resize', handleResize);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('resize', handleResize);
        document.head.removeChild(styleElement);
        // 清理定时器
        clearTimeout(startBubbles);
        if (bubbleInterval) {
          clearInterval(bubbleInterval);
        }
        // 清理所有小泡泡
        if (bubbleContainerRef.current) {
          bubbleContainerRef.current.innerHTML = '';
        }
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
  
  // 在页面滚动时也更新位置，但只在PC端
  useEffect(() => {
    const handleScroll = () => {
      if (!isDragging.current && window.innerWidth > 768) {
        setPosition(calculatePosition());
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
        backgroundColor: '#ffffff', // 更适合头像的背景色
        border: '2px solid transparent',
        borderRadius: '50%',
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // 移除文字相关样式，因为我们使用图片
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
        animation: isDragging.current ? 'none' : 'floatAndBreathe 10s ease-in-out infinite, borderPulse 8s ease-in-out infinite'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDragStart={(e) => e.preventDefault()} // 防止拖动时默认的拖拽行为
    >
      <img 
        src={avatarImage} 
        alt="豆包头像" 
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          objectFit: 'cover',
          // 头像本身的动画效果，降低频率和幅度
          animation: isDragging.current ? 'none' : 'floatAndBreathe 9s ease-in-out infinite',
          transition: 'transform 0.3s ease'
        }}
      />
      {/* 小泡泡容器 */}
      <div
        ref={bubbleContainerRef}
        style={{
          position: 'absolute',
          width: '80px',
          height: '150px',
          bottom: '-20px',
          left: 0,
          pointerEvents: 'none',
          zIndex: 999
        }}
      />
    </div>
  );
};

export default FloatingBubble;