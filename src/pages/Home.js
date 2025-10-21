import React, { useState, useEffect, useRef } from 'react';
import FloatingBubble from '../FloatingBubble';
import SnowEffect from '../SnowEffect';
import SnowToggle from '../SnowToggle';
import '../SnowToggle.css';
import './Home.css';
import SuccessPage from '../components/SuccessPage';

const Home = () => {
  const [isSnowing, setIsSnowing] = useState(false); // 雪花状态，默认为关闭
  
  // 定义任务数据，包含id、文本、位置坐标和完成状态
  const [tasks, setTasks] = useState([
    { id: 'aaaaa', text: 'aaaaaa', x: 100, y: 100, isCompleted: true },
    { id: 'ccccc', text: 'ccccc', x: 400, y: 250, isCompleted: false },
    { id: 'ddddd', text: 'ddddd', x: 700, y: 250, isCompleted: false },
    { id: 'bbbbb', text: 'bbbbb', x: 700, y: 400, isCompleted: false }
  ]);
  
  // 拖拽状态管理
  const [dragState, setDragState] = useState({
    isDragging: false,
    taskId: null,
    offsetX: 0,
    offsetY: 0
  });
  
  // 定义连接关系，添加type属性支持不同类型的连接
  const connections = [
    { source: 'aaaaa', target: 'ccccc', type: 'line' }, // 直线连接
    { source: 'ccccc', target: 'ddddd', type: 'line' }, // 直线连接
    { source: 'ddddd', target: 'bbbbb', type: 'line' }  // 直线连接
  ];
  
  // 切换雪花效果
  const toggleSnow = () => {
    setIsSnowing(prev => !prev);
  };
  
  // 下雪完成时自动关闭开关
  const handleSnowComplete = () => {
    setIsSnowing(false);
  };
  
  // 切换任务完成状态
  const toggleTaskCompletion = (taskId, event) => {
    // 如果正在拖拽，不切换完成状态
    if (dragState.isDragging) return;
    
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };
  
  // 开始拖拽
  const handleDragStart = (taskId, event) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 计算鼠标点击位置相对于任务卡片左上角的偏移量
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    
    setDragState({
      isDragging: true,
      taskId,
      offsetX,
      offsetY
    });
    
    // 添加视觉反馈
    event.currentTarget.style.zIndex = '10';
    event.currentTarget.style.transform = 'scale(1.05)';
    event.currentTarget.style.cursor = 'grabbing';
  };
  
  // 拖拽中
  const handleDragMove = (event) => {
    if (!dragState.isDragging) return;
    
    const taskFlowEl = document.querySelector('.task-flow');
    if (!taskFlowEl) return;
    
    const taskFlowRect = taskFlowEl.getBoundingClientRect();
    
    // 计算新位置，确保任务卡片保持在task-flow容器内
    let newX = event.clientX - taskFlowRect.left - dragState.offsetX;
    let newY = event.clientY - taskFlowRect.top - dragState.offsetY;
    
    // 边界检查
    const cardWidth = 150;
    const cardHeight = 120;
    newX = Math.max(0, Math.min(taskFlowRect.width - cardWidth, newX));
    newY = Math.max(0, Math.min(taskFlowRect.height - cardHeight, newY));
    
    // 更新任务位置
    setTasks(tasks.map(task => 
      task.id === dragState.taskId 
        ? { ...task, x: newX, y: newY }
        : task
    ));
  };
  
  // 结束拖拽
  const handleDragEnd = () => {
    if (!dragState.isDragging) return;
    
    // 重置拖拽状态
    setDragState({
      isDragging: false,
      taskId: null,
      offsetX: 0,
      offsetY: 0
    });
    
    // 恢复视觉效果
    const taskEl = document.getElementById(dragState.taskId);
    if (taskEl) {
      taskEl.style.zIndex = '';
      taskEl.style.transform = '';
      taskEl.style.cursor = 'grab';
    }
  };
  
  // 添加全局鼠标/触摸事件监听
  useEffect(() => {
    if (dragState.isDragging) {
      const handleMouseMove = (event) => handleDragMove(event);
      const handleMouseUp = () => handleDragEnd();
      const handleTouchMove = (event) => handleDragMove(event.touches[0]);
      const handleTouchEnd = () => handleDragEnd();
      
      // 添加事件监听器
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      // 清理事件监听器
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [dragState]);
  
  // 检查连接是否应该变为绿色（源任务已完成）
  const isConnectionCompleted = (sourceId) => {
    const sourceTask = tasks.find(task => task.id === sourceId);
    return sourceTask ? sourceTask.isCompleted : false;
  };

  // 计算连接线的样式
  const getConnectionStyle = (connection) => {
    const sourceTask = tasks.find(task => task.id === connection.source);
    const targetTask = tasks.find(task => task.id === connection.target);
    
    if (!sourceTask || !targetTask) return {};
    
    // 计算源任务和目标任务的中心点
    const cardWidth = 150; // 默认卡片宽度
    const cardHeight = 120; // 估算的卡片高度
    const sourceX = sourceTask.x + cardWidth / 2;
    const sourceY = sourceTask.y + cardHeight / 2;
    const targetX = targetTask.x + cardWidth / 2;
    const targetY = targetTask.y + cardHeight / 2;
    
    // 计算连线的长度和角度
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // 根据连接类型返回不同的样式
    if (connection.type === 'line') {
      // 直线连接
      return {
        width: `${length}px`,
        transform: `translate(${sourceX}px, ${sourceY}px) rotate(${angle}deg)`,
        top: '0',
        left: '0'
      };
    } else if (connection.type === 'curve') {
      // 曲线连接（可以扩展实现贝塞尔曲线等）
      return {
        width: `${length}px`,
        transform: `translate(${sourceX}px, ${sourceY}px) rotate(${angle}deg)`,
        top: '0',
        left: '0'
      };
    }
    
    // 默认直线连接
    return {
      width: `${length}px`,
      transform: `translate(${sourceX}px, ${sourceY}px) rotate(${angle}deg)`,
      top: '0',
      left: '0'
    };
  };
  
  // 响应式调整任务位置
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // 根据屏幕尺寸动态计算任务位置，使用百分比而非固定值以适应不同屏幕
      if (width <= 360) {
        // 小屏幕手机
        setTasks(prevTasks => prevTasks.map(task => {
          if (task.id === 'aaaaa') return { ...task, x: 10, y: 30 };
          if (task.id === 'ccccc') return { ...task, x: width * 0.4, y: 100 };
          if (task.id === 'ddddd') return { ...task, x: width * 0.7, y: 180 };
          if (task.id === 'bbbbb') return { ...task, x: width * 0.3, y: 250 };
          return task;
        }));
      } else if (width <= 480) {
        // 手机
        setTasks(prevTasks => prevTasks.map(task => {
          if (task.id === 'aaaaa') return { ...task, x: 20, y: 40 };
          if (task.id === 'ccccc') return { ...task, x: width * 0.35, y: 120 };
          if (task.id === 'ddddd') return { ...task, x: width * 0.65, y: 200 };
          if (task.id === 'bbbbb') return { ...task, x: width * 0.3, y: 280 };
          return task;
        }));
      } else if (width <= 768) {
        // 平板竖屏
        setTasks(prevTasks => prevTasks.map(task => {
          if (task.id === 'aaaaa') return { ...task, x: 40, y: 60 };
          if (task.id === 'ccccc') return { ...task, x: width * 0.3, y: 150 };
          if (task.id === 'ddddd') return { ...task, x: width * 0.6, y: 150 };
          if (task.id === 'bbbbb') return { ...task, x: width * 0.6, y: 300 };
          return task;
        }));
      } else if (width <= 1024) {
        // 平板横屏
        setTasks(prevTasks => prevTasks.map(task => {
          if (task.id === 'aaaaa') return { ...task, x: 60, y: 80 };
          if (task.id === 'ccccc') return { ...task, x: width * 0.3, y: 200 };
          if (task.id === 'ddddd') return { ...task, x: width * 0.6, y: 200 };
          if (task.id === 'bbbbb') return { ...task, x: width * 0.6, y: 350 };
          return task;
        }));
      } else if (width <= 1279) {
        // 大屏幕
        setTasks(prevTasks => prevTasks.map(task => {
          if (task.id === 'aaaaa') return { ...task, x: 100, y: 100 };
          if (task.id === 'ccccc') return { ...task, x: 400, y: 250 };
          if (task.id === 'ddddd') return { ...task, x: 700, y: 250 };
          if (task.id === 'bbbbb') return { ...task, x: 700, y: 400 };
          return task;
        }));
      } else {
        // 超大屏幕
        setTasks(prevTasks => prevTasks.map(task => {
          if (task.id === 'aaaaa') return { ...task, x: 150, y: 120 };
          if (task.id === 'ccccc') return { ...task, x: 500, y: 300 };
          if (task.id === 'ddddd') return { ...task, x: 900, y: 300 };
          if (task.id === 'bbbbb') return { ...task, x: 900, y: 500 };
          return task;
        }));
      }
    };
    
    // 初始调整
    handleResize();
    
    // 窗口大小改变时调整，添加防抖处理
    let resizeTimeout;
    const debouncedHandleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 150);
    };
    
    window.addEventListener('resize', debouncedHandleResize);
    
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      clearTimeout(resizeTimeout);
    };
  }, []); // 只在组件挂载和卸载时执行
  
  // 检查是否所有任务都已完成
  const allTasksCompleted = tasks.every(task => task.isCompleted);
  
  // 处理重新开始功能
  const handleRestart = () => {
    setTasks(tasks.map(task => ({ ...task, isCompleted: false })));
  };
  
  return (
    <div className="page home-page task-flow-container">
      {/* 雪花效果组件 - 条件渲染 */}
      {isSnowing && <SnowEffect onSnowComplete={handleSnowComplete} />}
      
      {/* 雪花开关组件 - 只在任务未全部完成时显示 */}
      {!allTasksCompleted && <SnowToggle isSnowing={isSnowing} onToggle={toggleSnow} />}
      
      {/* 根据任务完成状态条件渲染 */}
      {allTasksCompleted ? (
        <SuccessPage 
            tasks={tasks}
            onRestart={handleRestart}
          />
      ) : (
        <div className="task-flow">
          {/* 渲染连接线 */}
            <div className="connections">
              {connections.map((connection, index) => (
                <div 
                  key={index}
                  className={`connection-line ${isConnectionCompleted(connection.source) ? 'connection-completed' : ''}`}
                  style={getConnectionStyle(connection)}
                />
              ))}
            </div>
          
          {/* 渲染任务卡片 */}
          <div className="tasks">
            {tasks.map(task => (
                <div 
                  key={task.id}
                  id={task.id}
                  className={`task-card ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
                  style={{
                    left: `${task.x}px`,
                    top: `${task.y}px`,
                    cursor: dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab'
                  }}
                  onClick={(event) => toggleTaskCompletion(task.id, event)}
                  onMouseDown={(event) => handleDragStart(task.id, event)}
                  onTouchStart={(event) => handleDragStart(task.id, event.touches[0])}
                >
                  <div className="task-image">
                    <div className="mountain-icon">
                      <svg viewBox="0 0 40 30" width="40" height="30">
                        <polygon points="0,30 20,10 40,30" fill="#3b82f6" />
                        <polygon points="5,30 20,15 35,30" fill="#60a5fa" />
                      </svg>
                      {task.isCompleted && (
                        <div className="completion-check">
                          <svg viewBox="0 0 20 20" width="20" height="20">
                            <circle cx="10" cy="10" r="8" fill="#22c55e" />
                            <path d="M5,10 L8,13 L15,6" stroke="white" strokeWidth="2" fill="none" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="task-text">{task.text}</div>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {!allTasksCompleted && <FloatingBubble />}
    </div>
  );
};

export default Home;