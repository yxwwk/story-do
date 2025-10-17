import React, { useEffect, useRef, useState } from 'react';
import './SnowEffect.css';

const SnowEffect = ({ onSnowComplete }) => {
  const snowContainerRef = useRef(null);
  const frozenOverlayRef = useRef(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const crackElementsRef = useRef([]); // 存储冰裂纹元素的引用

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
      
      // 调整雪花飘落速度（减慢下落速度）
      const duration = Math.random() * 8 + 7; // 减慢速度让下雪更自然
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
      for (let i = 0; i < 8; i++) {
        createSnowflake();
      }
    }, 1000);
    
    // 设置定时添加冰冻结效果（减少延迟，让冰冻效果提前出现）
    const freezeTimeout = setTimeout(() => {
      setIsFrozen(true);
      // 结冰时停止生成新雪花
      clearInterval(interval);
      
      // 结冰后立即开始让雪花逐渐消失（更缓慢的交错消失效果）
      setTimeout(() => {
        if (snowContainerRef.current) {
          // 获取所有现有的雪花
          const allSnowflakes = snowContainerRef.current.querySelectorAll('.snowflake');
          
          // 为每个雪花添加更缓慢的交错消失动画
          allSnowflakes.forEach((snowflake, index) => {
            // 为每个雪花设置更长的随机延迟（0-6秒），创造更缓慢的交错消失效果
            const randomDelay = Math.random() * 6000;
            
            // 为每个雪花设置不同的消失动画持续时间（3-4秒）
            const animationDuration = Math.random() * 1000 + 3000;
            
            setTimeout(() => {
              // 添加更平滑的消失动画（更长的持续时间，更自然的变换）
              snowflake.style.transition = `opacity ${animationDuration/1000}s ease-out, transform ${animationDuration/1000}s ease-out`;
              snowflake.style.opacity = '0';
              // 添加更自然的飘落和旋转效果
              snowflake.style.transform = `translateY(50px) scale(0.7) rotate(${Math.random() * 360}deg)`;
              
              // 动画结束后移除元素
              setTimeout(() => {
                if (snowflake.parentNode) {
                  snowflake.remove();
                }
              }, animationDuration);
            }, randomDelay);
          });
        }
      }, 1000);
      
      // 冰冻效果持续6秒后自动消失（延长持续时间）
      const unfreezeTimeout = setTimeout(() => {
        setIsFrozen(false);
        // 冰效果消失时调用回调函数，通知父组件关闭下雪开关
        if (onSnowComplete) {
          onSnowComplete();
        }
      }, 6000); // 冰冻效果持续6秒后消失
    }, 5000); // 5秒后开始冻结效果，让冰冻效果提前出现
    
    // 清理函数
    return () => {
      clearInterval(interval);
      clearTimeout(freezeTimeout);
      // 移除冰冻效果
      setIsFrozen(false);
    };
  }, []);

  // 创建更自然的冰裂纹效果，在结冰过程中逐渐出现
  useEffect(() => {
    let crackContainer = null;
    let crackTimeout = null;
    let crackAnimations = [];
    
    // 创建真实感冰裂纹效果
    const createNaturalIceCracks = () => {
      // 移除之前可能存在的冰裂纹元素
      const existingContainer = document.getElementById('ice-crack-container');
      if (existingContainer && existingContainer.parentNode) {
        existingContainer.parentNode.removeChild(existingContainer);
      }
      
      // 创建冰裂纹容器
      crackContainer = document.createElement('div');
      crackContainer.id = 'ice-crack-container';
      crackContainer.style.position = 'fixed';
      crackContainer.style.top = '0';
      crackContainer.style.left = '0';
      crackContainer.style.width = '100vw';
      crackContainer.style.height = '100vh';
      crackContainer.style.pointerEvents = 'none';
      crackContainer.style.zIndex = '2000';
      crackContainer.style.overflow = 'hidden';
      
      // 创建更自然的冰裂纹结构
      const createCrack = (startX, startY, length, angle, thickness, opacity = 0.7) => {
        const crack = document.createElement('div');
        
        // 设置基础样式
        crack.className = 'natural-ice-crack';
        crack.style.position = 'absolute';
        crack.style.top = `${startY}px`;
        crack.style.left = `${startX}px`;
        crack.style.width = `${length}px`;
        crack.style.height = `${thickness}px`;
        crack.style.backgroundColor = '#FFFFFF';
        crack.style.opacity = '0'; // 初始透明，用于动画
        crack.style.transform = `rotate(${angle}deg)`;
        crack.style.transformOrigin = '0 50%';
        crack.style.borderRadius = `${thickness / 4}px`;
        crack.style.pointerEvents = 'none';
        
        // 更自然的阴影效果
        crack.style.boxShadow = `0 0 ${thickness * 3}px ${thickness / 2}px rgba(255, 255, 255, 0.7)`;
        
        // 添加到容器
        crackContainer.appendChild(crack);
        
        return crack;
      };
      
      // 生成随机分支角度
      const getRandomBranchAngle = (parentAngle) => {
        // 更自然的分支角度 - 主要在父裂纹的45度范围内
        const angleVariation = (Math.random() - 0.5) * 90;
        return parentAngle + angleVariation;
      };
      
      // 计算裂纹终点
      const calculateEndpoint = (startX, startY, length, angle) => {
        const rad = (angle * Math.PI) / 180;
        return {
          x: startX + Math.cos(rad) * length,
          y: startY + Math.sin(rad) * length
        };
      };
      
      // 递归创建更自然的分支裂纹
      const createBranchingCracks = (startX, startY, length, angle, thickness, level = 0, maxLevel = 3) => {
        if (level > maxLevel || length < 20) return;
        
        // 创建当前裂纹
        const crack = createCrack(startX, startY, length, angle, thickness);
        
        // 计算终点
        const endPoint = calculateEndpoint(startX, startY, length, angle);
        
        // 随机决定是否创建分支
        const branchProbability = level === 0 ? 1 : 0.7 - (level * 0.1); // 随着层级增加，分支概率降低
        
        if (Math.random() < branchProbability) {
          // 创建1-2个分支
          const branchCount = level === 0 ? 2 : Math.random() > 0.5 ? 2 : 1;
          
          for (let i = 0; i < branchCount; i++) {
            // 计算分支起点 - 不在裂纹末端，而是在裂纹的70%-90%处
            const branchPosition = 0.7 + Math.random() * 0.2;
            const branchStartX = startX + Math.cos((angle * Math.PI) / 180) * length * branchPosition;
            const branchStartY = startY + Math.sin((angle * Math.PI) / 180) * length * branchPosition;
            
            // 分支角度和参数
            const branchAngle = getRandomBranchAngle(angle);
            const branchLength = length * (0.4 + Math.random() * 0.4); // 更自然的长度变化
            const branchThickness = thickness * (0.5 + Math.random() * 0.3);
            
            // 递归创建分支
            createBranchingCracks(branchStartX, branchStartY, branchLength, branchAngle, branchThickness, level + 1, maxLevel);
          }
        }
        
        return crack;
      };
      
      // 创建主要裂纹系统
      const mainCrackSystems = [
        // 从不同方向的主要裂纹系统
        { startX: -100, startY: window.innerHeight * 0.3, length: window.innerWidth * 1.3, angle: 5 + Math.random() * 15, thickness: 3 + Math.random() * 2 },
        { startX: window.innerWidth * 0.7, startY: -100, length: window.innerHeight * 1.4, angle: 70 + Math.random() * 20, thickness: 2.5 + Math.random() * 2 },
        { startX: window.innerWidth * 0.1, startY: window.innerHeight, length: window.innerHeight * 1.2, angle: 170 + Math.random() * 20, thickness: 2 + Math.random() * 2 },
        { startX: window.innerWidth, startY: window.innerHeight * 0.2, length: window.innerWidth * 1.2, angle: 290 + Math.random() * 30, thickness: 2 + Math.random() * 1.5 }
      ];
      
      // 创建所有主裂纹系统
      mainCrackSystems.forEach((system, index) => {
        const crack = createBranchingCracks(
          system.startX,
          system.startY,
          system.length,
          system.angle,
          system.thickness
        );
        
        // 添加动画延迟 - 让裂纹系统依次出现
        if (crack) {
          const animation = {
            element: crack,
            delay: index * 300 // 每个系统延迟300ms
          };
          crackAnimations.push(animation);
        }
      });
      
      // 添加随机的小裂纹
      for (let i = 0; i < 20; i++) {
        // 随机位置
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        // 随机参数
        const length = 30 + Math.random() * 100;
        const angle = Math.random() * 360;
        const thickness = 1 + Math.random() * 2;
        
        // 创建小裂纹
        const crack = createCrack(startX, startY, length, angle, thickness, 0.6);
        
        // 添加到动画列表
        if (crack) {
          const animation = {
            element: crack,
            delay: 1000 + Math.random() * 2000 // 小裂纹在1-3秒内随机出现
          };
          crackAnimations.push(animation);
        }
      }
      
      // 添加到body
      document.body.appendChild(crackContainer);
      
      // 启动动画
      animateCracks();
    };
    
    // 冰裂纹出现动画
    const animateCracks = () => {
      crackAnimations.forEach(animation => {
        setTimeout(() => {
          const element = animation.element;
          if (element && element.parentNode) {
            // 添加关键帧动画
            element.style.transition = 'opacity 1.2s ease-out, transform 1.5s ease-out';
            element.style.opacity = '1';
            
            // 添加微小的波动效果，让裂纹更自然
            element.style.animation = 'crackWiggle 0.5s ease-in-out 1.5s 3';
          }
        }, animation.delay);
      });
    };
    
    // 监听冰冻状态，在结冰过程中出现冰裂纹
    if (isFrozen) {
      // 冰冻效果开始2秒后出现冰裂纹，使其与结冰过程同步
      crackTimeout = setTimeout(() => {
        createNaturalIceCracks();
      }, 2000);
    }
    
    // 组件卸载或状态变化时清理
    return () => {
      if (crackTimeout) {
        clearTimeout(crackTimeout);
      }
      
      // 清除所有动画
      crackAnimations.forEach(animation => {
        if (animation.element && animation.element.parentNode) {
          animation.element.style.transition = 'none';
          animation.element.style.animation = 'none';
        }
      });
      crackAnimations = [];
      
      // 移除容器
      if (crackContainer && crackContainer.parentNode) {
        crackContainer.parentNode.removeChild(crackContainer);
      }
      
      // 再次清理确保没有遗留
      const existingContainer = document.getElementById('ice-crack-container');
      if (existingContainer && existingContainer.parentNode) {
        existingContainer.parentNode.removeChild(existingContainer);
      }
    };
  }, [isFrozen]); // 依赖isFrozen状态变化
  
  return (
    <>
      <div ref={snowContainerRef} className="snow-container" />
      {/* 冰冻蒙层 */}
      {isFrozen && <div ref={frozenOverlayRef} className="frozen-overlay" />}
    </>
  );
};

// 设置默认值，避免父组件未传递该prop时出错
SnowEffect.defaultProps = {
  onSnowComplete: () => {}
};

export default SnowEffect;