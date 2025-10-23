import React, { useEffect, useState, useRef } from 'react';

const TaskCard8 = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart }) => {
  // 初始化任务状态，确保任务对象有完整属性
  const safeTask = {
    id: task?.id || `task-${index}`,
    text: task?.text || `任务 ${index + 1}`,
    isCompleted: task?.isCompleted || false
  };
  
  // 动画相关状态
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  // 位置数据定义 - 移到组件顶层使其在所有函数中可访问
  const positions = {
    8: [
      { x: 100, y: 100 },  // 第一个任务
      { x: 100, y: 300 },   // 第二个任务
      { x: 400, y: 300 },  // 第三个任务
      { x: 400, y: 500 },   // 第四个任务
      { x: 700, y: 500 },  // 第五个任务
      { x: 1000, y: 500 },  // 第六个任务
      { x: 1000, y: 300 },  // 第七个任务
      { x: 1000, y: 100 }   // 第八个任务
    ],
    default: [
      { x: 100 + (index % 4) * 170, y: 100 + Math.floor(index / 4) * 220 }
    ]
  };
  
  // 根据索引和任务数量计算位置
  const getPosition = () => {
    return positions[taskCount]?.[index] || positions.default[0];
  };
  
  const position = getPosition();
  
  // TaskCard8特定的连接关系定义（网格布局）
  const connections = [
    { source: 'aaaa', target: 'bbbb', type: 'line' }, // 1 -> 2
    { source: 'bbbb', target: 'cccc', type: 'line' }, // 2 -> 3
    { source: 'cccc', target: 'dddd', type: 'line' }, // 3 -> 4
    { source: 'dddd', target: 'eeee', type: 'line' }, // 4 -> 5
    { source: 'eeee', target: 'ffff', type: 'line' }, // 5 -> 6
    { source: 'ffff', target: 'gggg', type: 'line' }, // 6 -> 7
    { source: 'gggg', target: 'hhhh', type: 'line' }, // 7 -> 8
    // { source: 'hhhh', target: 'aaaa', type: 'line' }  // 8 -> 1（循环连接）
  ];
  
  // 任务ID到索引的映射
  const idToIndex = {
    'aaaa': 0, // 左上
    'bbbb': 1, // 右上
    'cccc': 2, // 右下
    'dddd': 3, // 左下
    'eeee': 4, // 右上2
    'ffff': 5, // 右下2
    'gggg': 6, // 右下3
    'hhhh': 7  // 左下3
  };
  
  // 获取当前任务相关的连接
  const getTaskConnections = () => {
    // 对于TaskCard8，显示从当前任务出发的连接
    return connections.filter(conn => conn.source === task.id);
  };
  
  // 为不同任务分配不同的网络图片
  const getTaskImage = () => {
    return `https://picsum.photos/id/${80 + (index % 10)}/800/600`;
  };
  
  // 计算任务完成百分比
  const completionPercentage = task.isCompleted || false ? 100 : 0;
  
  // 获取目标任务的位置（基于8个任务的网格布局）
  const getTargetPosition = (targetId) => {
    const targetIndex = idToIndex[targetId];
    if (targetIndex !== undefined && positions[taskCount] && positions[taskCount][targetIndex]) {
      return positions[taskCount][targetIndex];
    }
    
    // 对于TaskCard8特定的网格布局，使用正确的四字符任务ID格式
    const targetPositions = {
      'aaaa': { x: 150, y: 150 },   // 左上
      'cccc': { x: 350, y: 150 },   // 右上
      'dddd': { x: 350, y: 350 },   // 右下
      'bbbb': { x: 150, y: 350 },   // 左下
      'eeee': { x: 550, y: 150 },   // 右上2
      'ffff': { x: 550, y: 350 },   // 右下2
      'gggg': { x: 550, y: 550 },   // 右下3
      'hhhh': { x: 150, y: 550 }    // 左下3
    };
    return targetPositions[targetId] || { x: position.x + 200, y: position.y + 200 };
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
    
    // 根据新的位置布局调整偏移量，针对水平和垂直连接使用不同策略
    let adjustedOffset = offset;
    
    // 针对水平连接
    if (Math.abs(dy) < 50) {
      adjustedOffset = offset * 0.8;
    }
    // 针对垂直连接
    else if (Math.abs(dx) < 50) {
      adjustedOffset = offset * 0.7;
    }
    // 针对超长距离连接（如左下3到左上的循环连接）
    else if (length > 600) {
      adjustedOffset = offset * 1.5;
    }
    
    // 从边缘向外偏移一定距离，使连接线远离卡片
    const intersectionX = edgeX + unitDx * adjustedOffset;
    const intersectionY = edgeY + unitDy * adjustedOffset;
    
    return { x: intersectionX, y: intersectionY };
  };
  
  // TaskCard8优化的连接线样式和逻辑 - 青色渐变风格
  const renderConnections = () => {
    const taskConnections = getTaskConnections();
    const cardWidth = 140; // 调整为新的卡片宽度
    const cardHeight = 100; // 调整为新的卡片高度
    
    return taskConnections.map((connection, connIndex) => {
      // 获取目标位置
      const targetPos = getTargetPosition(connection.target);
      
      // 根据新的位置布局调整偏移量
      let offset = 25;
      
      // 特殊处理不同类型的连接
      if (task.id === 'aaaa' && connection.target === 'cccc') {
        offset = 15; // 左上到右上的连接
      } else if (task.id === 'cccc' && connection.target === 'dddd') {
        offset = 15; // 右上到右下的连接
      } else if (task.id === 'dddd' && connection.target === 'bbbb') {
        offset = 15; // 右下到左下的连接
      } else if (task.id === 'bbbb' && connection.target === 'eeee') {
        offset = 15; // 左下到右上2的连接
      } else if (task.id === 'eeee' && connection.target === 'ffff') {
        offset = 15; // 右上2到右下2的连接
      } else if (task.id === 'ffff' && connection.target === 'gggg') {
        offset = 15; // 右下2到右下3的连接
      } else if (task.id === 'gggg' && connection.target === 'hhhh') {
        offset = 15; // 右下3到左下3的连接
      } else if (task.id === 'hhhh' && connection.target === 'aaaa') {
        offset = 25; // 长距离循环连接
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
      
      // 计算连接线的角度
      const angle = Math.atan2(
        targetIntersection.y - sourceIntersection.y, 
        targetIntersection.x - sourceIntersection.x
      ) * (180 / Math.PI);
      
      // 计算连接线长度
      const length = Math.sqrt(
        Math.pow(targetIntersection.x - sourceIntersection.x, 2) + 
        Math.pow(targetIntersection.y - sourceIntersection.y, 2)
      );
      
      // 对于长距离连接线（左下3到左上），调整样式使其更醒目
      const isLongConnection = task.id === 'hhhh' && connection.target === 'aaaa';
      
      return (
        <React.Fragment key={connIndex}>
          {/* 连接线 */}
          <div 
            style={{
              position: 'absolute',
              left: `${sourceIntersection.x}px`,
              top: `${sourceIntersection.y}px`,
              width: `${length}px`,
              height: task.isCompleted ? '4px' : (isLongConnection ? '3.5px' : '3px'),
              backgroundColor: task.isCompleted ? '#22c55e' : '#06b6d4', // 青色主题
              background: task.isCompleted ? 
                'linear-gradient(90deg, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0.8) 100%)' : 
                (isLongConnection ? 
                  'linear-gradient(90deg, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0.6) 50%, rgba(6,182,212,0.8) 100%)' :
                  'linear-gradient(90deg, rgba(6,182,212,0.3) 0%, rgba(6,182,212,0.8) 100%)'),
              transformOrigin: '0 50%',
              transform: `rotate(${angle}deg)`,
              zIndex: 10,
              pointerEvents: 'none',
              borderRadius: '3px',
              boxShadow: isLongConnection ? 
                '0 2px 8px rgba(6,182,212,0.15)' : 
                '0 2px 6px rgba(0,0,0,0.1)',
              opacity: 0.9,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
              borderWidth: isLongConnection ? '8px 0 8px 16px' : '6px 0 6px 12px',
              borderColor: 'transparent transparent transparent ' + (task.isCompleted ? '#22c55e' : '#06b6d4'),
              transform: `rotate(${angle}deg)`,
              transformOrigin: '0 50%',
              zIndex: 11,
              marginLeft: '-1px',
            }}
          />
          {/* 起点圆点 - 针对长距离连接使用更大的圆点 */}
          <div
            style={{
              position: 'absolute',
              left: `${sourceIntersection.x}px`,
              top: `${sourceIntersection.y}px`,
              width: isLongConnection ? '14px' : '12px',
              height: isLongConnection ? '14px' : '12px',
              borderRadius: '50%',
              backgroundColor: task.isCompleted ? '#22c55e' : '#06b6d4',
              zIndex: 11,
              marginLeft: isLongConnection ? '-7px' : '-6px',
              marginTop: isLongConnection ? '-7px' : '-6px',
              boxShadow: isLongConnection ? 
                `0 0 12px ${task.isCompleted ? 'rgba(34, 197, 94, 0.6)' : 'rgba(6, 182, 212, 0.6)'}` : 
                `0 0 10px ${task.isCompleted ? 'rgba(34, 197, 94, 0.5)' : 'rgba(6, 182, 212, 0.5)'}`,
              opacity: 0.9,
              transition: 'all 0.3s ease',
            }}
          />
        </React.Fragment>
      );
    });
  };
  
  // TaskCard8不包含内部拖拽结束处理逻辑，与TaskCard6保持一致
  // 拖拽状态管理应在父组件中处理

  return (
    <>
      {/* 先渲染连接线，确保在卡片下方 */}
      {renderConnections()}
      
      {/* 再渲染任务卡片 - 优化的内容结构和布局 */}
      <div 
        key={task.id}
        id={task.id}
        className={`task-card task-card-8 ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '140px',
          height: '100px',
          cursor: dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab',
          zIndex: 20,
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: isHovered 
            ? (safeTask.isCompleted 
                ? '0 10px 25px rgba(34, 197, 94, 0.25)' 
                : '0 10px 25px rgba(6, 182, 212, 0.25)')
            : (safeTask.isCompleted 
                ? '0 8px 20px rgba(34, 197, 94, 0.15)' 
                : '0 8px 20px rgba(6, 182, 212, 0.15)'),
          border: `1px solid ${safeTask.isCompleted ? '#d1fae5' : '#cffafe'}`,
          transform: dragState.isDragging && dragState.taskId === safeTask.id 
            ? 'scale(1.05) rotate(1deg)' 
            : (isHovered ? 'scale(1.02)' : 'scale(1)'),
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: dragState.isDragging && dragState.taskId === task.id ? 'scale(1.05) rotate(1deg)' : 'scale(1)',
          // 增强交互体验的额外样式
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          MsUserSelect: 'none',
        }}
        onClick={(event) => {
            // 防止点击拖拽时触发完成状态切换
            if (!dragState.isDragging || dragState.taskId !== safeTask.id) {
              toggleTaskCompletion(safeTask.id, event);
            }
          }}
        onMouseDown={(event) => {
          // 增强拖拽体验
          event.preventDefault();
          handleDragStart(safeTask.id, event);
        }}
        onTouchStart={(event) => {
          // 增强触摸拖拽体验
          event.preventDefault();
          if (event.touches && event.touches.length > 0) {
            handleDragStart(safeTask.id, event.touches[0]);
          }
        }}
        // 添加悬停效果
        onMouseEnter={() => {
          if (!dragState.isDragging) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (!dragState.isDragging) {
            setIsHovered(false);
          }
        }}
        ref={cardRef}
      >
        {/* 任务图片区域 - 左侧固定宽度 */}
        <div 
          className="task-image-container" 
          style={{
            width: '70px',
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
              borderRadius: '16px 0 0 16px',
              transition: 'transform 0.5s ease',
              // 悬停时略微放大图片，增加交互感
              transform: isHovered ? 'scale(1.1)' : 'scale(1.05)',
            }}
          />
          
          {/* 左侧装饰条 - 视觉强调 */}
          <div 
            className="task-left-bar" 
            style={{
              width: '4px',
              height: '100%',
              position: 'absolute',
              left: 0,
              top: 0,
              backgroundColor: (task.isCompleted || false) ? '#22c55e' : '#06b6d4',
              // 添加渐变色效果
              background: safeTask.isCompleted 
                ? 'linear-gradient(to bottom, #22c55e, #16a34a)' 
                : 'linear-gradient(to bottom, #06b6d4, #0891b2)',
            }}
          />
          
          {/* 任务完成状态徽章 - 右上角 */}
          {task.isCompleted && (
            <div 
              className="task-completion-badge" 
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#22c55e">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          )}
        </div>
        
        {/* 任务内容区域 - 右侧自适应布局 */}
        <div className="task-content" style={{
              flex: 1,
              padding: '10px',
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}>
          {/* 任务头部信息 - 更紧凑的布局 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '3px', // 略微减少间距
          }}>
            <div className="task-number" style={{
              fontSize: '10px',
              fontWeight: '600',
              color: safeTask.isCompleted ? '#22c55e' : '#06b6d4',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              任务 {index + 1}
            </div>
            
            {/* 状态指示器 - 增强视觉效果 */}
            <div 
              className="status-indicator" 
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: safeTask.isCompleted ? '#22c55e' : '#06b6d4',
                boxShadow: `0 0 0 3px ${safeTask.isCompleted ? 'rgba(34, 197, 94, 0.2)' : 'rgba(6, 182, 212, 0.2)'}`,
              // 添加脉冲动画效果
                // 添加脉冲动画效果
                animation: safeTask.isCompleted 
                  ? 'pulseGreen 2s infinite' 
                  : 'pulseCyan 2s infinite',
              }}
            />
          </div>
          
          {/* 任务标题 - 优化文本显示 */}
          <div className="task-text" style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#111827',
              textAlign: 'left',
              lineHeight: '1.3',
              marginBottom: 'auto',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              textDecoration: safeTask.isCompleted ? 'line-through' : 'none',
              textDecorationThickness: '1.5px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
            {task.text}
          </div>
          
          {/* 任务底部进度信息 - 优化空间利用 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '6px', // 略微减少间距
          }}>
            {/* 进度条 - 优化宽度和视觉效果 */}
            <div className="progress-container" style={{
              flex: 1,
              height: '4px',
              backgroundColor: '#f3f4f6',
              borderRadius: '2px',
              overflow: 'hidden',
              marginRight: '6px', // 略微减少间距
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
            }}>
              <div 
                className="progress-bar" 
                style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  backgroundColor: safeTask.isCompleted ? '#22c55e' : '#06b6d4',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease',
                  // 添加渐变效果
                  background: safeTask.isCompleted 
                    ? 'linear-gradient(to right, #22c55e, #16a34a)' 
                    : 'linear-gradient(to right, #06b6d4, #0891b2)',
                }}
              />
            </div>
            
            {/* 进度文本 - 更简洁的显示 */}
            <div className="progress-text" style={{
              fontSize: '10px',
              fontWeight: '600',
              color: safeTask.isCompleted ? '#22c55e' : '#06b6d4',
              minWidth: '25px', // 略微减少宽度
              textAlign: 'right',
            }}>
              {completionPercentage}%
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard8;