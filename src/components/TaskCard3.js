import React, { useState } from 'react';

const TaskCard3 = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart, tasks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 处理卡片点击事件
  const handleCardClick = (event) => {
    event.stopPropagation();
    setIsModalOpen(true); // 打开弹窗显示故事内容
  };
  
  // 检查任务是否被锁定（前置任务未完成）
  const isTaskLocked = () => {
    // 如果不是第一个任务，检查前一个任务是否已完成
    if (index > 0 && tasks && tasks.length > index) {
      const previousTask = tasks[index - 1];
      return !previousTask.isCompleted;
    }
    return false;
  };

  // 处理任务完成状态切换
  const handleToggleCompletion = (event) => {
    event.stopPropagation();
    // 如果任务被锁定，不执行状态切换
    if (!isTaskLocked()) {
      toggleTaskCompletion(task.id);
    }
  };
  
  // 根据索引和任务数量计算位置
  const getPosition = () => {
    const positions = {
      3: [
        { x: 150, y: 60 },  // 第一个任务
        { x: 600, y: 60 },  // 第二个任务
        { x: 980, y: 350 }   // 第三个任务
      ],
      default: [
        { x: 100 + index * 300, y: 100 + (index % 2) * 280 }
      ]
    };
    
    return positions[taskCount]?.[index] || positions.default[0];
  };
  
  const position = getPosition();
  
  // 计算任务完成百分比
  const completionPercentage = task.isCompleted ? 100 : 0;
  
  // 获取任务图片
  const getTaskImage = () => {
    const imageIds = {
      'aaaa': '1025', // 山脉图片
      'bbbb': '1039', // 城堡图片
      'cccc': '1043', // 森林图片
    };
    return `https://picsum.photos/id/${imageIds[task.id] || '1025'}/400/300`;
  };
  
  return (
    <>
      {/* 任务卡片 */}
      <div 
        key={task.id}
        id={task.id}
        className={`task-card task-card-3 ${task.isCompleted ? 'task-completed' : ''} ${dragState.dragging === task.id ? 'dragging' : ''}`}
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: dragState.dragging === task.id ? 'grabbing' : 'grab',
          zIndex: 5,
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: task.isCompleted 
            ? '0 8px 20px rgba(16, 185, 129, 0.15)' 
            : '0 8px 20px rgba(59, 130, 246, 0.15)',
          border: `1px solid ${task.isCompleted ? '#d1fae5' : '#eff6ff'}`,
          width: '200px',
          height: '240px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: dragState.dragging === task.id ? 'scale(1.03) rotate(1deg)' : 'scale(1)',
        }}
        onClick={handleCardClick}
        onMouseDown={(event) => handleDragStart(task.id, event)}
        onTouchStart={(event) => handleDragStart(task.id, event.touches[0])}
      >
        {/* 顶部装饰条 - 根据完成状态变化颜色 */}
        <div 
          className="task-top-bar" 
          style={{
            height: '4px',
            backgroundColor: task.isCompleted ? '#10b981' : '#3b82f6',
          }}
        />
        
        {/* 任务图片区域 - 作为卡片的上半部分 */}
        <div 
          className="task-image-container" 
          style={{
            width: '100%',
            height: '130px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* 网络图片 */}
          <img 
            src={`${task.cardImg}`} 
            alt={`任务 ${task.text}`} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '16px 16px 0 0',
            }}
          />
          
          {/* 图片遮罩 - 增强文字可读性 */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
              borderRadius: '0 0 16px 16px',
            }}
          />
          
          {/* 任务头部信息 - 放置在图片底部 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '10px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div className="task-number" style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#ffffff',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}>
              任务 {index + 1}
            </div>
            
            {/* 状态指示器 */}
            <div 
              className="status-indicator" 
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: task.isCompleted ? '#10b981' : isTaskLocked() ? '#9ca3af' : '#6366f1',
                boxShadow: `0 0 0 3px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.3)`,
              }}
            />
          </div>
        </div>
        
        {/* 任务内容区域 - 作为卡片的下半部分 */}
        <div className="task-content" style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
          {/* 任务标题 - 调整为上下布局的文字部分 */}
          <div className="task-text" style={{
              fontSize: '16px',
              fontWeight: '700',
              color: task.isCompleted ? '#10b981' : isTaskLocked() ? '#9ca3af' : '#111827',
              textAlign: 'left',
              lineHeight: '1.3',
              marginBottom: '10px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {task.text}
          </div>
          
          {/* 任务底部 - 进度条区域 */}
          <div className="task-footer" style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {/* 进度条容器 */}
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              {/* 进度条填充 */}
              <div 
                style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  backgroundColor: task.isCompleted ? '#10b981' : '#3b82f6',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            
            {/* 进度文本 */}
            <div style={{
              fontSize: '11px',
              color: '#6b7280',
              textAlign: 'right',
            }}>
              {task.isCompleted ? '已完成' : `${completionPercentage}% 未开始`}
            </div>
          </div>
        </div>
      </div>
      
      {/* 故事章节风格弹窗 */}
      {isModalOpen && (
        <div 
          className="story-modal-overlay" 
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
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="story-modal-content" 
            style={{
              backgroundColor: '#fffef0',
              borderRadius: '24px',
              padding: '32px',
              width: '90%',
              maxWidth: '700px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              position: 'relative',
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=100 height=100 viewBox=0 0 100 100 xmlns=http://www.w3.org/2000/svg%3E%3Cpath d=M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill=%23d4c8a1 fill-opacity=0.15 fill-rule=evenodd/%3E%3C/svg%3E')",
              minWidth: '400px', // 确保弹窗有足够的最小宽度
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 装饰性卷轴元素 */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '20px',
              background: 'linear-gradient(to bottom, #d4c8a1, #fffef0)',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
            }} />
            
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '20px',
              background: 'linear-gradient(to top, #d4c8a1, #fffef0)',
              borderBottomLeftRadius: '24px',
              borderBottomRightRadius: '24px',
            }} />
            
            {/* 章节装饰线 */}
            <div style={{
              width: '100%',
              height: '2px',
              background: 'linear-gradient(to right, transparent, #8b4513, transparent)',
              marginBottom: '20px',
            }} />
            
            {/* 故事标题 */}
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#4a3c31',
              textAlign: 'center',
              marginBottom: '24px',
              fontFamily: '"Georgia", "Times New Roman", serif',
            }}>
              {task.text}
            </h2>
            
            {/* 故事内容 */}
            <div style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#4a3c31',
              fontFamily: '"Georgia", "Times New Roman", serif',
              textIndent: '2em',
              padding: '10px',
            }}>
              {task.levelPlot || '这个任务还没有故事内容。'}
            </div>
            
            {/* 任务状态卡片 */}
            <div style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: 'rgba(212, 200, 161, 0.2)',
              borderRadius: '12px',
              border: '1px solid #d4c8a1',
            }}>
              <div style={{
                fontSize: '14px',
                color: '#8b4513',
                fontWeight: '600',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: task.isCompleted ? '#8b4513' : '#cd5c5c',
                  marginRight: '8px',
                }} />
                任务状态: {task.isCompleted ? '已完成' : '未完成'}
              </div>
            </div>
            
            {/* 底部操作按钮 */}
            <div style={{
              marginTop: '32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <button
                onClick={handleToggleCompletion}
                style={{
                  backgroundColor: task.isCompleted ? '#cd5c5c' : isTaskLocked() ? '#9ca3af' : '#8b4513',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isTaskLocked() ? 'not-allowed' : 'pointer',
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  transition: 'all 0.3s ease',
                  opacity: isTaskLocked() ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isTaskLocked()) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(139, 69, 19, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isTaskLocked()) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {task.isCompleted ? '标记为未完成' : isTaskLocked() ? '任务已锁定' : '标记为已完成'}
              </button>
              
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#8b4513',
                  border: '1px solid #8b4513',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(139, 69, 19, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                关闭卷轴
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard3;