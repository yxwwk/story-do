import React, { useEffect, useRef } from 'react';
import './SnowEffect.css';

const SnowEffect = () => {
  const snowContainerRef = useRef(null);

  useEffect(() => {
    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      
      // 使用雪花表情符号
      snowflake.textContent = '❄️';
      
      // 随机生成雪花大小（更大的雪花）
      const size = Math.random() * 20 + 12; // 增大范围以适应表情符号
      snowflake.style.fontSize = `${size}px`;
      
      // 随机生成雪花起始位置
      snowflake.style.left = `${Math.random() * 100}vw`;
      snowflake.style.opacity = `${Math.random() * 0.9 + 0.1}`;
      
      // 随机旋转雪花
      snowflake.style.transform = `rotate(${Math.random() * 360}deg)`;
      
      // 随机生成雪花飘落速度和延迟
      const duration = Math.random() * 15 + 8; // 减慢速度让雪花表情更清晰可见
      const delay = Math.random() * 5;
      snowflake.style.animationDuration = `${duration}s`;
      snowflake.style.animationDelay = `${delay}s`;
      
      // 添加到容器
      if (snowContainerRef.current) {
        snowContainerRef.current.appendChild(snowflake);
      }
      
      // 雪花动画结束后移除
      setTimeout(() => {
        snowflake.remove();
      }, (duration + delay) * 1000);
    };
    
    // 初始创建一批雪花
    for (let i = 0; i < 50; i++) {
      setTimeout(createSnowflake, Math.random() * 2000);
    }
    
    // 持续创建新雪花
    const interval = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        createSnowflake();
      }
    }, 1000);
    
    // 清理函数
    return () => clearInterval(interval);
  }, []);

  return <div ref={snowContainerRef} className="snow-container" />;
};

export default SnowEffect;