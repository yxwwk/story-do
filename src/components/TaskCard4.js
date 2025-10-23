import React, { useState } from 'react';

const TaskCard4 = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart, tasks }) => {
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
    4: [
      { x: 100, y: 60 },  // 第一个任务
      { x: 550, y: 250 },  // 第二个任务
      { x: 960, y: 250 },  // 第三个任务
      { x: 960, y: 500 }   // 第四个任务
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
  
  // 计算两点之间的线与矩形框的交点，并让交点远离卡片边缘一定距离
  const getIntersectionPoint = (rectX, rectY, rectWidth, rectHeight, targetX, targetY, offset = 25) => {
    // 矩形中心
    const rectCenterX = rectX + rectWidth / 2;
    const rectCenterY = rectY + rectHeight / 2;
    
    // 从矩形中心指向目标点的向量
    const dx = targetX - rectCenterX;
    const dy = targetY - rectCenterY;
    
    // 向量长度
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // 单位向量
    const unitDx = dx / length;
    const unitDy = dy / length;
    
    // 计算射线与矩形边缘的交点
    let t;
    if (Math.abs(dx) > Math.abs(dy)) {
      // 水平方向更接近边缘
      t = (rectWidth / 2) / Math.abs(dx);
    } else {
      // 垂直方向更接近边缘
      t = (rectHeight / 2) / Math.abs(dy);
    }
    
    // 计算交点（在卡片边缘上）
    const edgeX = rectCenterX + t * dx;
    const edgeY = rectCenterY + t * dy;
    
    // 从边缘向外偏移一定距离，使连接线远离卡片
    const intersectionX = edgeX + unitDx * offset;
    const intersectionY = edgeY + unitDy * offset;
    
    return { x: intersectionX, y: intersectionY };
  };
  
  // TaskCard4特定的连接线样式和逻辑 - 优化为现代风格
  const renderConnections = () => {
    const taskConnections = getTaskConnections();
    const cardWidth = 200;
    const cardHeight = 240;
    
    return taskConnections.map((connection, connIndex) => {
      // 获取目标位置
      const targetPos = getTargetPosition(connection.target);
      
      // 计算起点（源卡片边缘外的点，距离卡片有一定偏移）
      const sourceIntersection = getIntersectionPoint(
        position.x, 
        position.y, 
        cardWidth, 
        cardHeight, 
        targetPos.x + cardWidth / 2, 
        targetPos.y + cardHeight / 2,
        25 // 增加偏移量，使连接线更远离卡片
      );
      
      // 计算终点（目标卡片边缘外的点，距离卡片有一定偏移）
      const targetIntersection = getIntersectionPoint(
        targetPos.x, 
        targetPos.y, 
        cardWidth, 
        cardHeight, 
        position.x + cardWidth / 2, 
        position.y + cardHeight / 2,
        25 // 增加偏移量，使连接线更远离卡片
      );
      
      return (
        <React.Fragment key={connIndex}>
          {/* 连接线 */}
          <div 
            style={{
              position: 'absolute',
              left: `${sourceIntersection.x}px`,
              top: `${sourceIntersection.y}px`,
              width: `${Math.sqrt(Math.pow(targetIntersection.x - sourceIntersection.x, 2) + Math.pow(targetIntersection.y - sourceIntersection.y, 2))}px`,
              height: '3px', // 精致的线宽
              backgroundColor: task.isCompleted ? '#10b981' : '#8b5cf6', // 紫色主题
              background: task.isCompleted ? 
                'linear-gradient(90deg, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.8) 100%)' : 
                'linear-gradient(90deg, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0.8) 100%)',
              transformOrigin: '0 50%',
              transform: `rotate(${Math.atan2(targetIntersection.y - sourceIntersection.y, targetIntersection.x - sourceIntersection.x) * (180 / Math.PI)}deg)`,
              zIndex: 10,
              pointerEvents: 'none',
              borderRadius: '3px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              opacity: 0.9,
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
              borderWidth: '6px 0 6px 12px',
              borderColor: 'transparent transparent transparent ' + (task.isCompleted ? '#10b981' : '#8b5cf6'),
              transform: `rotate(${Math.atan2(targetIntersection.y - sourceIntersection.y, targetIntersection.x - sourceIntersection.x) * (180 / Math.PI)}deg)`,
              transformOrigin: '0 50%',
              zIndex: 11,
              marginLeft: '-1px',
            }}
          />
        </React.Fragment>
      );
    });
  };
  
  // 计算任务完成百分比
  const completionPercentage = task.isCompleted || false ? 100 : 0;
  
  // 为不同任务分配不同的网络图片
  const getTaskImage = () => {
    return `https://picsum.photos/id/${42 + (index % 10)}/800/600`;
  };
  
  return (
    <>
      {/* 先渲染连接线，确保在卡片下方 */}
      {renderConnections()}
      {/* 再渲染任务卡片 */}
      <div 
        key={task.id}
        id={task.id}
        className={`task-card task-card-4 ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab',
          zIndex: 5,
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: (task.isCompleted || false) 
            ? '0 8px 20px rgba(16, 185, 129, 0.15)' 
            : '0 8px 20px rgba(139, 92, 246, 0.15)', // 紫色主题阴影
          border: `1px solid ${(task.isCompleted || false) ? '#d1fae5' : '#e9d5ff'}`,
          width: '260px', // 缩小宽度
          height: '120px', // 相应减小高度
          display: 'flex',
          flexDirection: 'row', // 改为左右布局
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: dragState.isDragging && dragState.taskId === task.id ? 'scale(1.03) rotate(1deg)' : 'scale(1)',
        }}
        onClick={handleCardClick}
        onMouseDown={(event) => handleDragStart(task.id, event)}
        onTouchStart={(event) => handleDragStart(task.id, event.touches[0])}
      >
        {/* 任务图片区域 - 作为卡片的左侧 */}
        <div 
          className="task-image-container" 
          style={{
            width: '100px', // 缩小图片宽度
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* 网络图片 */}
          <img 
            src={getTaskImage()} 
            alt={`任务 ${task.text}`} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '16px 0 0 16px', // 左侧圆角
            }}
          />
          
          {/* 左侧装饰条 - 根据完成状态变化颜色 */}
          <div 
            className="task-left-bar" 
            style={{
              width: '4px',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
              backgroundColor: (task.isCompleted || false) ? '#10b981' : isTaskLocked() ? '#9ca3af' : '#8b5cf6', // 紫色主题，锁定时显示灰色
              }}
          />
        </div>
        
        {/* 任务内容区域 - 作为卡片的右侧 */}
        <div className="task-content" style={{
              flex: 1,
              padding: '12px', // 减小内边距
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
          {/* 任务头部信息 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}>
            <div className="task-number" style={{
              fontSize: '10px', // 减小字体大小 // 减小字体大小
              fontWeight: '600',
              color: (task.isCompleted || false) ? '#10b981' : '#8b5cf6', // 紫色主题
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              任务 {index + 1}
            </div>
            
            {/* 状态指示器 */}
            <div 
              className="status-indicator" 
              style={{
                width: '8px',
              height: '8px', // 减小状态指示器大小
                borderRadius: '50%',
                backgroundColor: (task.isCompleted || false) ? '#10b981' : isTaskLocked() ? '#9ca3af' : '#8b5cf6', // 紫色主题，锁定时显示灰色
                boxShadow: `0 0 0 3px rgba(139, 92, 246, 0.1)`,
              }}
            />
          </div>
          
          {/* 任务标题 - 多行显示 */}
          <div className="task-text" style={{
              fontSize: '14px', // 减小字体大小
              fontWeight: '700',
              color: (task.isCompleted || false) ? '#10b981' : isTaskLocked() ? '#9ca3af' : '#111827',
              textAlign: 'left',
              lineHeight: '1.3',
              marginBottom: 'auto', // 自动填充中间空间
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            textDecoration: 'none',
          }}>
            {task.text}
          </div>
          
          {/* 任务底部 - 进度条区域 */}
          <div className="task-footer" style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginTop: '8px',
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
                  backgroundColor: task.isCompleted ? '#10b981' : isTaskLocked() ? '#9ca3af' : '#8b5cf6', // 紫色主题，锁定时显示灰色
                  borderRadius: '4px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            
            {/* 进度文本 */}
              <div style={{
                fontSize: '11px',
                color: '#6b7280',
                textAlign: 'left', // 改为左对齐
              }}>
                {task.isCompleted ? '已完成' : `${completionPercentage}% 未开始`}
              </div>
          </div>
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

export default TaskCard4;