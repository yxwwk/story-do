import React from 'react';

const TaskCard5 = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart }) => {
  // 定义位置数据，使其在整个组件中可用
  const positions = {
    5: [
      { x: 50, y: 50 },  // 第一个任务
      { x: 50, y: 280 },   // 第二个任务
      { x: 450, y: 280 },  // 第三个任务
      { x: 800, y: 280 },  // 第四个任务
      { x: 950, y: 500 }   // 第五个任务
    ],
    default: [
      { x: 100 + (index % 3) * 200, y: 100 + Math.floor(index / 3) * 200 }
    ]
  };
  
  // 根据索引和任务数量计算位置
  const getPosition = () => {
    return positions[taskCount]?.[index] || positions.default[0];
  };
  
  const position = getPosition();
  
  // TaskCard5特定的连接关系定义
  const connections = [
    { source: 'aaaa', target: 'bbbb', type: 'line' }, // 1 -> 2
    { source: 'bbbb', target: 'cccc', type: 'line' }, // 2 -> 3
    { source: 'cccc', target: 'dddd', type: 'line' }, // 3 -> 4
    { source: 'dddd', target: 'eeee', type: 'line' }  // 4 -> 5
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
    // 使用positions对象中的坐标，根据任务ID映射到对应的索引位置
    const idToIndex = {
      'aaaa': 0, // 第一个任务 (x: 50, y: 50)
      'bbbb': 1, // 第二个任务 (x: 50, y: 280)
      'cccc': 2, // 第三个任务 (x: 450, y: 280)
      'dddd': 3, // 第四个任务 (x: 800, y: 280)
      'eeee': 4  // 第五个任务 (x: 950, y: 500)
    };
    
    const targetIndex = idToIndex[targetId];
    // 从positions对象中获取对应任务的位置
    if (targetIndex !== undefined && positions[taskCount] && positions[taskCount][targetIndex]) {
      return positions[taskCount][targetIndex];
    }
    
    return { x: position.x + 150, y: position.y + 150 }; // 默认回退位置
  };
  
  // 计算两点之间的线与矩形框的交点，并让交点远离卡片边缘一定距离
  // 优化交点计算以适应新的布局结构
  const getIntersectionPoint = (rectX, rectY, rectWidth, rectHeight, targetX, targetY, offset = 25) => {
    // 矩形中心
    const rectCenterX = rectX + rectWidth / 2;
    const rectCenterY = rectY + rectHeight / 2;
    
    // 从矩形中心指向目标点的向量
    const dx = targetX - rectCenterX;
    const dy = targetY - rectCenterY;
    
    // 向量长度
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // 避免除以零
    if (length === 0) {
      return { x: rectCenterX, y: rectCenterY };
    }
    
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
    
    // 根据布局特点调整偏移量，对于垂直布局和水平布局的连接使用不同的偏移策略
    let adjustedOffset = offset;
    
    // 对于垂直连接（特别是第一个和第二个任务之间），稍微减少偏移量以获得更好的视觉效果
    if (Math.abs(Math.abs(dx) - Math.abs(dy)) < 100) {
      adjustedOffset = offset * 0.8;
    }
    
    // 从边缘向外偏移一定距离，使连接线远离卡片
    const intersectionX = edgeX + unitDx * adjustedOffset;
    const intersectionY = edgeY + unitDy * adjustedOffset;
    
    return { x: intersectionX, y: intersectionY };
  };
  
  // TaskCard5特定的连接线样式和逻辑 - 优化为现代风格，适配新的布局位置
  const renderConnections = () => {
    const taskConnections = getTaskConnections();
    const cardWidth = 260;
    const cardHeight = 120;
    
    return taskConnections.map((connection, connIndex) => {
      // 获取目标位置
      const targetPos = getTargetPosition(connection.target);
      
      // 根据连接类型调整偏移量，针对新的布局位置优化连接线显示
      let offset = 25;
      
      // 特殊处理垂直连接（第一个到第二个任务）
      if ((task.id === 'aaaaa' && connection.target === 'ccccc') || 
          (task.id === 'bbbbb' && connection.target === 'eeeee')) {
        offset = 20; // 减少垂直连接线的偏移量
      }
      // 特殊处理长距离水平连接
      else if ((task.id === 'ccccc' && connection.target === 'ddddd') || 
               (task.id === 'ddddd' && connection.target === 'bbbbb')) {
        offset = 30; // 增加水平连接线的偏移量
      }
      
      // 计算起点（源卡片边缘外的点，距离卡片有一定偏移）
      const sourceIntersection = getIntersectionPoint(
        position.x, 
        position.y, 
        cardWidth, 
        cardHeight, 
        targetPos.x + cardWidth / 2, 
        targetPos.y + cardHeight / 2,
        offset
      );
      
      // 计算终点（目标卡片边缘外的点，距离卡片有一定偏移）
      const targetIntersection = getIntersectionPoint(
        targetPos.x, 
        targetPos.y, 
        cardWidth, 
        cardHeight, 
        position.x + cardWidth / 2, 
        position.y + cardHeight / 2,
        offset
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
              backgroundColor: task.isCompleted ? '#10b981' : '#f97316', // 橙色主题
              background: task.isCompleted ? 
                'linear-gradient(90deg, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.8) 100%)' : 
                'linear-gradient(90deg, rgba(249,115,22,0.3) 0%, rgba(249,115,22,0.8) 100%)',
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
              borderColor: 'transparent transparent transparent ' + (task.isCompleted ? '#10b981' : '#f97316'),
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
    return `https://picsum.photos/id/${52 + (index % 10)}/800/600`;
  };
  
  return (
    <>
      {/* 先渲染连接线，确保在卡片下方 */}
      {renderConnections()}
      {/* 再渲染任务卡片 */}
      <div 
        key={task.id}
        id={task.id}
        className={`task-card task-card-5 ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab',
          zIndex: 5,
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: (task.isCompleted || false) 
            ? '0 8px 20px rgba(16, 185, 129, 0.15)' 
            : '0 8px 20px rgba(249, 115, 22, 0.15)', // 橙色主题阴影
          border: `1px solid ${(task.isCompleted || false) ? '#d1fae5' : '#fed7aa'}`,
          width: '260px', // 缩小宽度
          height: '120px', // 相应减小高度
          display: 'flex',
          flexDirection: 'row', // 改为左右布局
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: dragState.isDragging && dragState.taskId === task.id ? 'scale(1.03) rotate(1deg)' : 'scale(1)',
        }}
        onClick={(event) => toggleTaskCompletion(task.id, event)}
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
              backgroundColor: (task.isCompleted || false) ? '#10b981' : '#f97316', // 橙色主题
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
              fontSize: '10px', // 减小字体大小
              fontWeight: '600',
              color: (task.isCompleted || false) ? '#10b981' : '#f97316', // 橙色主题
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
                backgroundColor: (task.isCompleted || false) ? '#10b981' : '#f97316', // 橙色主题
                boxShadow: `0 0 0 3px rgba(249, 115, 22, 0.1)`,
              }}
            />
          </div>
          
          {/* 任务标题 - 多行显示 */}
          <div className="task-text" style={{
              fontSize: '14px', // 减小字体大小
              fontWeight: '700',
              color: '#111827',
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
                  backgroundColor: task.isCompleted ? '#10b981' : '#f97316', // 橙色主题
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
    </>
  );
};

export default TaskCard5;