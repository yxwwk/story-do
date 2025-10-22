import React from 'react';

const TaskCard3 = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart }) => {
  // 根据索引和任务数量计算位置 - 调整为更小的卡片尺寸
  const getPosition = () => {
    const positions = {
      3: [
        { x: 150, y: 60 },  // 第一个任务
        { x: 600, y: 60 },  // 第二个任务，减小间距适应更小卡片
        { x: 980, y: 350 }   // 第三个任务，减小间距适应更小卡片
      ],
      default: [
        { x: 100 + index * 300, y: 100 + (index % 2) * 280 } // 减小间距以适应更小的卡片
      ]
    };
    
    return positions[taskCount]?.[index] || positions.default[0];
  };
  
  const position = getPosition();
  
  // TaskCard3特定的连接关系定义 - 保持三角形结构
  const connections = [
    { source: 'aaaa', target: 'bbbb', type: 'line' }, // 更新为匹配当前任务ID
    { source: 'bbbb', target: 'cccc', type: 'line' },

  ];
  
  // 获取当前任务相关的连接
  const getTaskConnections = () => {
    // 只让源任务渲染连接线，避免重复渲染
    return connections.filter(conn => conn.source === task.id);
  };
  
  // 获取目标任务的位置（基于3个任务的三角布局）
  const getTargetPosition = (targetId) => {
    // 更新位置以匹配新的更小卡片布局
    const targetPositions = {
      'aaaa': { x: 150, y: 60 },
      'bbbb': { x: 600, y: 60 },
      'cccc': { x: 950, y: 350 }
    };
    return targetPositions[targetId] || { x: position.x + 250, y: position.y + 80 }; // 减小间距以适应更小的布局
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
  
  // TaskCard3特定的连接线样式和逻辑 - 优化为现代风格
    const renderConnections = () => {
      const taskConnections = getTaskConnections();
      const cardWidth = 200; // 减小卡片宽度
      const cardHeight = 240; // 减小卡片高度
    
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
      
      // 优化的连接线样式，确保在卡片外部且更加美观
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
              backgroundColor: task.isCompleted ? '#10b981' : '#6366f1',
              background: task.isCompleted ? 
                'linear-gradient(90deg, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.8) 100%)' : 
                'linear-gradient(90deg, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0.8) 100%)',
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
              // 计算箭头位置，使其精确连接到连接线末端
              left: `${targetIntersection.x}px`,
              top: `${targetIntersection.y}px`,
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '6px 0 6px 12px',
              borderColor: 'transparent transparent transparent ' + (task.isCompleted ? '#10b981' : '#6366f1'),
              // 计算旋转角度，确保箭头指向正确方向
              transform: `rotate(${Math.atan2(targetIntersection.y - sourceIntersection.y, targetIntersection.x - sourceIntersection.x) * (180 / Math.PI)}deg)`,
              // 确保旋转点正确
              transformOrigin: '0 50%',
              zIndex: 11,
              // 微调位置，确保箭头与连接线完美衔接
              marginLeft: '-1px',
            }}
          />
        </React.Fragment>
      );
    });
  };
  
  // 渲染连接线
  const renderedConnections = renderConnections();
  
  // 计算任务完成百分比
  const completionPercentage = task.isCompleted || false ? 100 : 0;
  
  // 为不同任务分配不同的网络图片（使用占位图片服务）
  const getTaskImage = () => {
    const imageThemes = [
      'code',
      'education',
      'technology',
      'productivity',
      'business'
    ];
    
    const taskImages = {
      'aaaa': `https://picsum.photos/id/${42 + (index % 10)}/800/600`,
      'ccc': `https://picsum.photos/id/${52 + (index % 10)}/800/600`,
      'ddddd': `https://picsum.photos/id/${62 + (index % 10)}/800/600`,
    };
    
    return taskImages[task.id] || `https://picsum.photos/id/${32 + (index % 10)}/800/600`;
  };
  
  return (
    <>
      {/* 先渲染连接线，确保在卡片下方 */}
      {renderedConnections}
      {/* 再渲染任务卡片 */}
      <div 
        key={task.id}
        id={task.id}
        className={`task-card task-card-3 ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
        style={{
          left: `${position.x}px`,
            top: `${position.y}px`,
            cursor: dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab',
            zIndex: 5,
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: (task.isCompleted || false) 
              ? '0 8px 20px rgba(16, 185, 129, 0.15)' 
              : '0 8px 20px rgba(59, 130, 246, 0.15)',
            border: `1px solid ${(task.isCompleted || false) ? '#d1fae5' : '#eff6ff'}`,
            width: '200px',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: dragState.isDragging && dragState.taskId === task.id ? 'scale(1.03) rotate(1deg)' : 'scale(1)',
        }}
        onClick={(event) => toggleTaskCompletion(task.id, event)}
        onMouseDown={(event) => handleDragStart(task.id, event)}
        onTouchStart={(event) => handleDragStart(task.id, event.touches[0])}
      >
        {/* 顶部装饰条 - 根据完成状态变化颜色 */}
        <div 
          className="task-top-bar" 
          style={{
            height: '4px',
            backgroundColor: (task.isCompleted || false) ? '#10b981' : '#3b82f6',
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
            src={getTaskImage()} 
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
                backgroundColor: (task.isCompleted || false) ? '#10b981' : '#6366f1',
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
              color: '#111827',
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
    </>
  );
};

export default TaskCard3;