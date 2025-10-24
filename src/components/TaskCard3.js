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
  // 定义位置数据，使其在整个组件中可用
  const positions = {
    3: [
      { x: 100, y: 200 },  // 第一个任务
      { x: 500, y: -60 },  // 第二个任务
      { x: 900, y: -320 },  // 第三个任务
      // { x: 1060, y: -710 }   // 第四个任务
    ],
    default: [
      { x: 150 + index * 300, y: 100 + Math.floor(index / 2) * 250 }
    ]
  };
  
  // 根据索引和任务数量计算位置
  const getPosition = () => {
    return positions[taskCount]?.[index] || positions.default[0];
  };
  
  const position = getPosition();
  
  // 更新连接关系以匹配Home.js中的任务ID
  const connections = [
    { source: 'aaaa', target: 'bbbb', type: 'line' },  // 1 -> 2
    { source: 'bbbb', target: 'cccc', type: 'line' },  // 2 -> 3
    { source: 'cccc', target: 'dddd', type: 'line' }   // 3 -> 4
  ];
  
  // 获取当前任务相关的连接
  const getTaskConnections = () => {
    // 只让源任务渲染连接线，避免重复渲染
    // 确保只有在connections中定义的源任务才渲染连接线
    const sourceTasks = connections.map(conn => conn.source);
    if (!sourceTasks.includes(task.id)) {
      return []; // 如果任务不是任何连接的源，不渲染任何连接线
    }
    return connections.filter(conn => conn.source === task.id);
  };
  
  // 获取目标任务的位置
  const getTargetPosition = (targetId) => {
    // 使用positions对象中的新坐标，根据任务ID映射到对应的索引位置
    const idToIndex = {
      'aaaa': 0, // 第一个任务
      'bbbb': 1, // 第二个任务
      'cccc': 2, // 第三个任务
      'dddd': 3  // 第四个任务
    };
    
    const targetIndex = idToIndex[targetId];
    // 从positions对象中获取对应任务的位置
    if (targetIndex !== undefined && positions[taskCount] && positions[taskCount][targetIndex]) {
      return positions[taskCount][targetIndex];
    }
    
    return { x: position.x + 300, y: position.y + 150 }; // 默认回退位置
  };
  
  // 简化的交点计算方法，确保连接线准确连接到卡片边缘中点
  const getIntersectionPoint = (rectX, rectY, rectWidth, rectHeight, targetX, targetY) => {
    // 矩形中心
    const rectCenterX = rectX + rectWidth / 2;
    const rectCenterY = rectY + rectHeight / 2;
    
    // 计算方向向量
    const dx = targetX - rectCenterX;
    const dy = targetY - rectCenterY;
    
    // 根据方向选择合适的边缘中点
    if (Math.abs(dx) > Math.abs(dy)) {
      // 水平方向为主
      if (dx > 0) {
        // 右侧边缘中点
        return { x: rectX + rectWidth, y: rectCenterY };
      } else {
        // 左侧边缘中点
        return { x: rectX, y: rectCenterY };
      }
    } else {
      // 垂直方向为主
      if (dy > 0) {
        // 底部边缘中点
        return { x: rectCenterX, y: rectY + rectHeight };
      } else {
        // 顶部边缘中点
        return { x: rectCenterX, y: rectY };
      }
    }
  };
  
  // 故事章节连接线样式 - 水滴卡片风格
  const renderConnections = () => {
    const taskConnections = getTaskConnections();
    const cardWidth = 200;
    const cardHeight = 240;
    
    return taskConnections.map((connection, connIndex) => {
      // 获取目标位置
      const targetPos = getTargetPosition(connection.target);
      
      // 计算起点（源卡片边缘上的点）
      const sourceIntersection = getIntersectionPoint(
        position.x, 
        position.y, 
        cardWidth, 
        cardHeight, 
        targetPos.x + cardWidth / 2, 
        targetPos.y + cardHeight / 2
      );
      
      // 计算终点（目标卡片边缘上的点）
      const targetIntersection = getIntersectionPoint(
        targetPos.x, 
        targetPos.y, 
        cardWidth, 
        cardHeight, 
        position.x + cardWidth / 2, 
        position.y + cardHeight / 2
      );
      
      return (
        <React.Fragment key={connIndex}>
          {/* 连接线 - 改为故事风格 */}
          <div 
            style={{
              position: 'absolute',
              left: `${sourceIntersection.x}px`,
              top: `${sourceIntersection.y}px`,
              width: `${Math.sqrt(Math.pow(targetIntersection.x - sourceIntersection.x, 2) + Math.pow(targetIntersection.y - sourceIntersection.y, 2))}px`,
              height: '3px', // 水滴卡片风格的线宽
              backgroundColor: task.isCompleted ? '#8b4513' : '#d4a76a', // 木质色调
              background: task.isCompleted ? 
                'linear-gradient(90deg, rgba(139,69,19,0.5) 0%, rgba(139,69,19,0.9) 100%)' : 
                'linear-gradient(90deg, rgba(212,167,106,0.5) 0%, rgba(212,167,106,0.9) 100%)',
              transformOrigin: '0 50%',
              transform: `rotate(${Math.atan2(targetIntersection.y - sourceIntersection.y, targetIntersection.x - sourceIntersection.x) * (180 / Math.PI)}deg)`,
              zIndex: 10,
              pointerEvents: 'none',
              borderRadius: '3px',
              boxShadow: '0 3px 8px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.15) inset',
              opacity: 1,
              transition: 'all 0.3s ease',
            }}
          />
          {/* 优化的箭头 - 精确对齐连接线末端 */}
          <div
            style={{
              position: 'absolute',
              left: `${targetIntersection.x}px`,
              top: `${targetIntersection.y}px`,
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '8px 0 8px 16px',
              borderColor: 'transparent transparent transparent ' + (task.isCompleted ? '#8b4513' : '#d4a76a'),
              transform: `rotate(${Math.atan2(targetIntersection.y - sourceIntersection.y, targetIntersection.x - sourceIntersection.x) * (180 / Math.PI)}deg)`,
              transformOrigin: '0 50%',
              zIndex: 11,
              marginLeft: '-16px', // 调整箭头位置，使其完全位于连接线上
              boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
            }}
          />
        </React.Fragment>
      );
    });
  };
  
  //{/* 任务完成百分比 - 保留但不再直接使用 */}
  const completionPercentage = task.isCompleted || false ? 100 : 0;
  
  // 为不同任务分配不同的网络图片 - 选择更符合故事氛围的图片
  const getTaskImage = () => {
    // 使用更有故事感的图片ID
    const storyImageIds = [42, 16, 24, 45, 55, 65, 76, 87, 96, 106];
    return `https://picsum.photos/id/${storyImageIds[index % storyImageIds.length]}/800/600`;
  };
  
  return (
    <>
      {/* 渲染任务卡片 */}
      <div 
        key={task.id}
        id={task.id}
        className={`task-card task-card-4 ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
        style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab',
            zIndex: 5,
            backgroundColor: '#f8f3e6',
            boxShadow: (task.isCompleted || false) 
              ? '0 10px 30px rgba(139, 69, 19, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.4) inset' 
              : '0 10px 30px rgba(139, 69, 19, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3) inset',
            border: `1px solid #d4c8a1`,
            width: '240px', // 增大宽度
            height: '220px', // 增大高度
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: dragState.isDragging && dragState.taskId === task.id ? 'scale(1.05) rotate(1deg)' : 'scale(1)',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-paper.png")',
            backgroundBlendMode: 'overlay',
            position: 'relative',
            filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2))',
            borderRadius: '12px', // 长方形圆角设计
          }}
        onClick={handleCardClick}
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
              height: '100px', // 增大图片区域高度
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
            src={`${task.image_url}`} 
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
        
        {/* 故事内容区域 - 参考弹窗风格 */}
          <div className="task-content" style={{
                flex: 1,
                padding: '15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}>
          {/* 故事章节标题 - 参考弹窗风格 */}
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
          
          {/* 故事章节状态信息 - 参考弹窗风格 */}
            <div className="task-footer" style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 'auto',
              paddingTop: '8px',
              borderTop: '1px dashed rgba(139, 69, 19, 0.4)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '8px',
              borderRadius: '8px',
            }}>
            {/* 状态文本 - 参考弹窗风格 */}
              <div style={{
                fontSize: '12px',
                color: isTaskLocked() ? '#9ca3af' : (task.isCompleted ? '#8b4513' : '#cd5c5c'),
                fontWeight: '600',
                fontFamily: '"Georgia", "Times New Roman", serif',
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
              }}>
              {isTaskLocked() ? '已锁定' : (task.isCompleted ? '已完成' : '未完成')}
            </div>
            
            {/* 状态指示器 - 参考弹窗风格 */}
              <div 
                className="status-indicator" 
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: task.isCompleted ? '#8b4513' : isTaskLocked() ? '#9ca3af' : '#cd5c5c',
                  boxShadow: `0 0 0 4px rgba(139, 69, 19, 0.1), 0 2px 4px rgba(0,0,0,0.2)`,
                  border: '1px solid rgba(255,255,255,0.5)',
                }}
              />
          </div>
        </div>
        
        {/* 水滴形状的装饰性底部 */}
          <div style={{
            width: '100%',
            height: '15px',
            background: 'linear-gradient(to top, #8b4513, #d4a76a, #f8f3e6)',
            boxShadow: '0 -1px 5px rgba(0, 0, 0, 0.2) inset',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
              position: 'relative',
          }}>
            {/* 底部装饰线 */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '10%',
              width: '80%',
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(139, 69, 19, 0.7), transparent)'
            }} />
          </div>
      </div>

      {/* 故事章节风格弹窗 */}
      {isModalOpen && (
        <div
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
            style={{
              backgroundColor: '#f8f3e6',
              borderRadius: '16px',
              padding: '40px',
              maxWidth: '600px',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-paper.png")',
              minWidth: '500px',
              position: 'relative',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {/* 装饰性卷轴顶部 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '20px',
              background: 'linear-gradient(to bottom, #d4a76a, #f8f3e6)',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
            }} />
            
            {/* 装饰性卷轴底部 */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '20px',
              background: 'linear-gradient(to top, #d4a76a, #f8f3e6)',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
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
                  backgroundColor: isTaskLocked() ? '#9ca3af' : (task.isCompleted ? '#8b4513' : '#cd5c5c'),
                  marginRight: '8px',
                }} />
                任务状态: {isTaskLocked() ? '已锁定' : (task.isCompleted ? '已完成' : '未完成')}
                {isTaskLocked() && (
                  <span style={{
                    marginLeft: '8px',
                    color: '#9ca3af',
                    fontSize: '12px',
                    fontStyle: 'italic',
                  }}>
                    (请先完成前置任务)
                  </span>
                )}
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
                  backgroundColor: isTaskLocked() ? '#9ca3af' : (task.isCompleted ? '#cd5c5c' : '#8b4513'),
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
                {isTaskLocked() ? '任务已锁定' : (task.isCompleted ? '标记为未完成' : '标记为已完成')}
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
                  e.target.style.backgroundColor = 'rgba(139, 69, 19, 0.1)';
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