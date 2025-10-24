import React, { useState } from 'react';

const TaskCard5 = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart, tasks }) => {
  // 定义位置数据，使其在整个组件中可用
  const positions = {
    5: [
      { x: 50, y: 50 },  // 第一个任务
      { x: 450, y: -220 },   // 第二个任务
      { x: 850, y: -480 },  // 第三个任务
      { x: 50, y: -380 },  // 第四个任务
      { x: 450, y: -640 }   // 第五个任务
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
  
  // 状态管理：控制故事章节弹窗的显示
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 处理卡片点击事件
  const handleCardClick = (event) => {
    // 无论任务是否锁定，都打开故事章节弹窗
    setIsModalOpen(true);
  };
  
  // 检查任务是否被锁定
  const isTaskLocked = () => {
    // 如果不是第一个任务，检查前一个任务是否已完成
    if (index > 0 && tasks && tasks[index - 1]) {
      return !tasks[index - 1].isCompleted;
    }
    return false;
  };
  
  // 为不同任务分配不同的网络图片
  const getTaskImage = () => {
    return `https://picsum.photos/id/${52 + (index % 10)}/800/600`;
  };
  
  return (
    <>
      {/* 渲染任务卡片 */}
      <div 
        key={task.id}
        id={task.id}
        className={`task-card task-card-5 ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
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
          width: '240px',
          height: '220px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: dragState.isDragging && dragState.taskId === task.id ? 'scale(1.05) rotate(1deg)' : 'scale(1)',
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/old-paper.png")',
          backgroundBlendMode: 'overlay',
          position: 'relative',
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
          className="story-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-in-out',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          {/* 装饰卷轴效果 */}
          <div
            className="story-scroll"
            style={{
              position: 'absolute',
              width: '500px',
              height: '650px',
              background: 'repeating-linear-gradient(#d4a55e, #d4a55e 2px, #e8c07d 2px, #e8c07d 10px)',
              borderRadius: '12px',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
              transform: 'rotate(-2deg) scale(1.1)',
              zIndex: 1,
            }}
          />
          
          <div
            className="story-modal"
            style={{
              position: 'relative',
              width: '450px',
              maxHeight: '600px',
              backgroundColor: '#f8f3e8',
              borderRadius: '12px',
              padding: '40px 35px',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
              zIndex: 2,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, serif',
              overflowY: 'auto',
              animation: 'slideIn 0.4s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 章节标题 */}
            <div className="story-chapter-title" style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#8b4513',
              textAlign: 'center',
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: '2px solid #d4a55e',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              故事章节 {index + 1}
            </div>
            
            {/* 故事内容 */}
            <div className="story-content" style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#5a402a',
              textAlign: 'justify',
              marginBottom: '30px',
            }}>
              {/* 优先使用task.levelPlot作为故事内容，如果不存在则使用默认文本 */}
              {task && task.levelPlot ? (
                <p>{task.levelPlot}</p>
              ) : (
                <p>这是一段神奇的冒险故事。完成任务，解锁更多精彩内容！</p>
              )}
            </div>
            
            {/* 任务信息卡片 */}
            <div className="task-info-card" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #d4a55e',
            }}>
              <div className="task-info-title" style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#8b4513',
                marginBottom: '12px',
              }}>
                任务详情
              </div>
              <div className="task-info-text" style={{
                fontSize: '16px',
                color: '#5a402a',
                lineHeight: '1.6',
              }}>
                {task.text}
              </div>
            </div>
            
            {/* 任务状态 */}
            <div className="task-status" style={{
              fontSize: '16px',
              color: '#8b4513',
              textAlign: 'center',
              marginBottom: '30px',
              padding: '12px',
              backgroundColor: 'rgba(212, 165, 94, 0.1)',
              borderRadius: '6px',
            }}>
              {isTaskLocked() ? (
                <span>此任务已锁定，请先完成前置任务</span>
              ) : (
                <span>任务已解锁，准备好接受挑战了吗？</span>
              )}
            </div>
            
            {/* 底部按钮 */}
            <div className="modal-footer" style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              flexWrap: 'wrap',
            }}>
              {!isTaskLocked() && (
                <button
                  className="complete-task-btn"
                  style={{
                  padding: '12px 24px',
                  backgroundColor: task.isCompleted ? '#ef4444' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: task.isCompleted 
                    ? '0 2px 6px rgba(239, 68, 68, 0.3)'
                    : '0 2px 6px rgba(16, 185, 129, 0.3)',
                }}
                  onClick={() => {
                    toggleTaskCompletion(task.id);
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = task.isCompleted ? '#dc2626' : '#059669';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = task.isCompleted ? '#ef4444' : '#10b981';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {task.isCompleted ? '标记为未完成' : '标记为已完成'}
                </button>
              )}
              <button
                className="close-modal-btn"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#8b4513',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 6px rgba(139, 69, 19, 0.3)',
                }}
                onClick={() => setIsModalOpen(false)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#a0522d';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#8b4513';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
           关闭卷轴
              </button>
            </div>
            
            {/* 装饰元素 */}
            <div className="decorative-seal" style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 165, 94, 0.2)',
              border: '2px solid #d4a55e',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#8b4513',
              fontSize: '18px',
              fontWeight: '700',
            }}>
              {index + 1}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard5;