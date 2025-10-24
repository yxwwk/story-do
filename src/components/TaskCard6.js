import React, { useState } from 'react';

const TaskCard6 = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart, tasks }) => {
  // 定义位置数据，使其在整个组件中可用
  const positions = {
    6: [
      { x: 100, y: 0 },  // 顶部 (aaaaa)
      { x: 500, y: 0 },  // 右上 (ccccc)
      { x: 900, y: 0 },  // 右下 (ddddd)
      { x: 100, y: 400 },  // 底部 (bbbbb)
      { x: 500, y: 400 },  // 左下 (eeeee)
      { x: 900, y: 400 }   // 左上 (fffff)
    ],
    default: [
      { x: 100 + (index % 3) * 200, y: 100 + Math.floor(index / 3) * 220 }
    ]
  };
  
  // 根据索引和任务数量计算位置
  const getPosition = () => {
    return positions[taskCount]?.[index] || positions.default[0];
  };
  
  const position = getPosition();
  
  // 已移除连接线相关功能
  

  // 为不同任务分配不同的网络图片
  const getTaskImage = () => {
    return task.image_url || `https://picsum.photos/id/${62 + (index % 10)}/800/600`;
  };
  
  // 计算任务完成百分比
  const completionPercentage = task.isCompleted || false ? 100 : 0;
  
  // 状态管理：控制故事章节弹窗的显示
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 处理卡片点击事件
  const handleCardClick = (event) => {
    // 无论任务是否锁定，都打开故事章节弹窗
    setIsModalOpen(true);
  };
  
  // 检查任务是否被锁定 - 确保第一个任务始终解锁
  const isTaskLocked = () => {
    // 边界检查
    if (!tasks || !Array.isArray(tasks)) {
      // 对于第一个任务，即使没有tasks参数也应该解锁
      return index !== 0;
    }
    
    // 第一个任务（索引为0）必须始终保持解锁状态，以便用户可以开始
    if (index === 0) {
      return false;
    }
    
    // 对于其他任务（索引>0），严格检查前一个任务是否已完成
    if (index > 0 && index - 1 < tasks.length) {
      const previousTask = tasks[index - 1];
      return !previousTask || !previousTask.isCompleted;
    }
    
    // 对于超出范围的索引，默认返回锁定状态
    return true;
  };

  // 处理任务完成
  const handleCompleteTask = () => {
    toggleTaskCompletion(task.id);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* 渲染任务卡片 */}
      <div 
        key={task.id}
        id={task.id}
        className={`task-card task-card-6 ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab',
          zIndex: 5,
          backgroundColor: '#f8f3e6',
          boxShadow: (task.isCompleted || false) 
            ? '0 10px 30px rgba(139, 69, 19, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.4) inset' 
            : '0 10px 30px rgba(139, 69, 19, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
          border: `1px solid #d4c8a1`,
          width: '240px',
          height: '220px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: dragState.isDragging && dragState.taskId === task.id ? 'scale(1.05) rotate(1deg)' : 'scale(1)',
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-paper.png")',
          backgroundBlendMode: 'overlay',
          filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2))',
          borderRadius: '12px',
        }}
        onClick={(event) => handleCardClick(event)}
        onMouseDown={(event) => handleDragStart(task.id, event)}
        onTouchStart={(event) => handleDragStart(task.id, event.touches[0])}
      >
        {/* 水滴形状的装饰性顶部 - 故事章节风格 */}
        <div style={{
          width: '100%',
          height: '15px',
          background: 'linear-gradient(to bottom, #8b4513, #d4a76a, #f8f3e6)',
          boxShadow: '0 1px 5px rgba(0, 0, 0, 0.2) inset',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          position: 'relative',
        }}>
          {/* 装饰性章节线 */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '10%',
            width: '80%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(139, 69, 19, 0.7), transparent)'
          }} />
        </div>
        
        {/* 任务头部 - 装饰和标题 */}
        <div style={{
          width: '100%',
          height: '2px',
          background: 'linear-gradient(to right, transparent, #8b4513, transparent)',
          marginTop: '8px',
          marginBottom: '10px',
        }} />
        
        {/* 故事章节插图区域 - 水滴形状顶部 */}
        <div 
          className="task-image-container" 
          style={{
            width: '100%',
            height: '100px',
            overflow: 'hidden',
            position: 'relative',
            borderBottom: '1px solid rgba(212, 167, 106, 0.6)',
          }}
        >
          {/* 装饰性边框 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: '8px solid rgba(255, 255, 255, 0.2)',
            pointerEvents: 'none',
          }} />
          
          {/* 网络图片 */}
          <img 
            src={getTaskImage()} 
            alt={`故事章节 ${task.text}`} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.85,
              transition: 'transform 0.5s ease',
            }}
          />
          
          {/* 故事书风格的覆盖层 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(248, 243, 230, 0.1), rgba(248, 243, 230, 0.6))',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
            backgroundBlendMode: 'multiply',
            opacity: 0.6,
          }} />
          
          {/* 章节装饰编号 - 故事书风格 */}
          <div 
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: 'rgba(139, 69, 19, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 6px rgba(0,0,0,0.25)',
              border: '2px solid rgba(255, 255, 255, 0.6)',
            }}
          >
            <span style={{
              color: '#ffffff',
              fontWeight: 'bold',
              fontSize: '16px',
              fontFamily: '"Georgia", "Times New Roman", serif',
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}>
              {index + 1}
            </span>
          </div>
        </div>
        
        {/* 故事内容区域 */}
        <div className="task-content" style={{
          flex: 1,
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}>
          {/* 故事章节标题 */}
          <div className="task-text" style={{
            fontSize: '16px',
            fontWeight: '700',
            color: task.isCompleted ? '#8b4513' : isTaskLocked() ? '#9ca3af' : '#4a3c31',
            textAlign: 'center',
            lineHeight: '1.4',
            fontFamily: '"Georgia", "Times New Roman", serif',
            textDecoration: task.isCompleted ? 'line-through' : 'none',
            textDecorationColor: '#8b4513',
            textDecorationThickness: '2px',
            textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)',
            letterSpacing: '0.5px',
            paddingBottom: '10px',
          }}>
            {task.text}
          </div>
          
          {/* 故事主题装饰线 */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '15%',
            width: '70%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(139, 69, 19, 0.4), transparent)'
          }} />
          
          {/* 任务状态区域 - 故事书风格 */}
          <div style={{
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            height: '28px',
          }}>
            {task.isCompleted ? (
              <div 
                className="task-completed-badge" 
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(139, 69, 19, 0.8)',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  fontFamily: '"Georgia", "Times New Roman", serif',
                }}
              >
                已完成
              </div>
            ) : (
              <div 
                className="task-pending-badge" 
                style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: isTaskLocked() 
                    ? 'rgba(156, 163, 175, 0.8)' 
                    : 'rgba(139, 69, 19, 0.2)',
                  color: isTaskLocked() ? '#ffffff' : '#8b4513',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  border: `1px solid ${isTaskLocked() ? 'rgba(156, 163, 175, 1)' : 'rgba(139, 69, 19, 0.3)'}`,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  fontFamily: '"Georgia", "Times New Roman", serif',
                }}
              >
                {isTaskLocked() ? '锁定' : '进行中'}
              </div>
            )}
          </div>
          
          {/* 底部装饰 */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            height: '30px',
            background: 'linear-gradient(to top, rgba(212, 167, 106, 0.2), transparent)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>
      
      {/* 故事章节风格弹窗 */}
      {isModalOpen && (
        <div 
          className="modal-overlay" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="story-modal"
            style={{
              position: 'relative',
              width: '400px',
              maxHeight: '600px',
              backgroundColor: '#f8f3e6',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              zIndex: 2,
              fontFamily: '"Georgia", "Times New Roman", serif',
              overflowY: 'auto',
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-paper.png")',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 章节标题 */}
            <h2 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#8b4513',
              textAlign: 'center',
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '2px solid #d4a76a',
              fontFamily: '"Georgia", "Times New Roman", serif',
            }}>
              故事章节 {index + 1}
            </h2>
            
            {/* 故事内容 */}
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#4a3c31',
              textAlign: 'justify',
              marginBottom: '25px',
            }}>
              {task.levelPlot || '这是故事的一部分，完成任务以继续探索。'}
            </p>
            
            {/* 任务信息 */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '25px',
              border: '1px solid #d4a76a',
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#8b4513',
                marginBottom: '10px',
              }}>
                任务要求
              </h3>
              <p style={{
                fontSize: '16px',
                color: '#4a3c31',
              }}>
                {task.text}
              </p>
            </div>
            
            {/* 操作按钮 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
            }}>
              {!isTaskLocked() && !task.isCompleted && (
                <button
                  onClick={handleCompleteTask}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#8b4513',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontFamily: '"Georgia", "Times New Roman", serif',
                  }}
                >
                  完成任务
                </button>
              )}
              
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#d4a76a',
                  color: '#4a3c31',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: '"Georgia", "Times New Roman", serif',
                }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard6;