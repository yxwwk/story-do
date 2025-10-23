import React, { useState } from 'react';

const TaskCard6 = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart, tasks }) => {
  // 定义位置数据，使其在整个组件中可用
  const positions = {
    6: [
      { x: 100, y: 100 },  // 顶部 (aaaaa)
      { x: 400, y: 100 },  // 右上 (ccccc)
      { x: 400, y: 300 },  // 右下 (ddddd)
      { x: 400, y: 500 },  // 底部 (bbbbb)
      { x: 700, y: 500 },  // 左下 (eeeee)
      { x: 1000, y: 500 }   // 左上 (fffff)
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
  
  // TaskCard6特定的连接关系定义（六边形布局）
  const connections = [
    { source: 'aaaa', target: 'bbbb', type: 'line' }, // 顶部 -> 右上
    { source: 'bbbb', target: 'cccc', type: 'line' }, // 右上 -> 右下
    { source: 'cccc', target: 'dddd', type: 'line' }, // 右下 -> 底部
    { source: 'dddd', target: 'eeee', type: 'line' }, // 底部 -> 左下
    { source: 'eeee', target: 'ffff', type: 'line' }, // 左下 -> 左上
    // { source: 'ffff', target: 'aaaa', type: 'line' }  // 左上 -> 顶部（循环连接）
  ];
  
  // 获取当前任务相关的连接
  const getTaskConnections = () => {
    // 只让源任务渲染连接线，避免重复渲染
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
      'aaaa': 0, // 顶部
      'bbbb': 1, // 右上
      'cccc': 2, // 右下
      'dddd': 3, // 底部
      'eeee': 4, // 左下
      'ffff': 5  // 左上
    };
    
    const targetIndex = idToIndex[targetId];
    // 从positions对象中获取对应任务的位置
    if (targetIndex !== undefined && positions[taskCount] && positions[taskCount][targetIndex]) {
      return positions[taskCount][targetIndex];
    }
    
    return { x: position.x + 200, y: position.y + 150 }; // 默认回退位置
  };
  
  // 计算两点之间的线与矩形框的交点，并让交点远离卡片边缘一定距离
  // 优化交点计算以适应六边形布局结构
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
    
    // 针对水平连接（如顶部到右上）
    if (Math.abs(dy) < 50) {
      adjustedOffset = offset * 0.8;
    }
    // 针对垂直连接（如右上到右下）
    else if (Math.abs(dx) < 50) {
      adjustedOffset = offset * 0.7;
    }
    // 针对超长距离连接（如左上到顶部）
    else if (length > 600) {
      adjustedOffset = offset * 1.5;
    }
    
    // 从边缘向外偏移一定距离，使连接线远离卡片
    const intersectionX = edgeX + unitDx * adjustedOffset;
    const intersectionY = edgeY + unitDy * adjustedOffset;
    
    return { x: intersectionX, y: intersectionY };
  };
  
  // TaskCard6特定的连接线样式和逻辑 - 优化为更精致的连接效果
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
      if (task.id === 'aaaaa' && connection.target === 'ccccc') {
        offset = 15; // 顶部到右上的水平连接
      } else if (task.id === 'ccccc' && connection.target === 'ddddd') {
        offset = 15; // 右上到右下的垂直连接
      } else if (task.id === 'ddddd' && connection.target === 'bbbbb') {
        offset = 15; // 右下到底部的垂直连接
      } else if (task.id === 'bbbbb' && connection.target === 'eeeee') {
        offset = 15; // 底部到左下的水平连接
      } else if (task.id === 'eeeee' && connection.target === 'fffff') {
        offset = 15; // 左下到左上的水平连接
      } else if (task.id === 'fffff' && connection.target === 'aaaaa') {
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
      
      // 对于长距离连接线（左上到顶部），调整样式使其更醒目
      const isLongConnection = task.id === 'fffff' && connection.target === 'aaaaa';
      
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
              backgroundColor: task.isCompleted ? '#22c55e' : '#3b82f6',
              background: task.isCompleted ? 
                'linear-gradient(90deg, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0.8) 100%)' : 
                (isLongConnection ? 
                  'linear-gradient(90deg, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.6) 50%, rgba(59,130,246,0.8) 100%)' :
                  'linear-gradient(90deg, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.8) 100%)'),
              transformOrigin: '0 50%',
              transform: `rotate(${angle}deg)`,
              zIndex: 10,
              pointerEvents: 'none',
              borderRadius: '3px',
              boxShadow: isLongConnection ? 
                '0 2px 8px rgba(59,130,246,0.15)' : 
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
              borderColor: 'transparent transparent transparent ' + (task.isCompleted ? '#22c55e' : '#3b82f6'),
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
              backgroundColor: task.isCompleted ? '#22c55e' : '#3b82f6',
              zIndex: 11,
              marginLeft: isLongConnection ? '-7px' : '-6px',
              marginTop: isLongConnection ? '-7px' : '-6px',
              boxShadow: isLongConnection ? 
                `0 0 12px ${task.isCompleted ? 'rgba(34, 197, 94, 0.6)' : 'rgba(59, 130, 246, 0.6)'}` : 
                `0 0 10px ${task.isCompleted ? 'rgba(34, 197, 94, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`,
              opacity: 0.9,
              transition: 'all 0.3s ease',
            }}
          />
        </React.Fragment>
      );
    });
  };
  
  // 为不同任务分配不同的网络图片
  const getTaskImage = () => {
    return `https://picsum.photos/id/${62 + (index % 10)}/800/600`;
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
  
  return (
    <>
      {/* 先渲染连接线，确保在卡片下方 */}
      {renderConnections()}
      
      {/* 再渲染任务卡片 - 参考TaskCard5优化样式 */}
      <div 
        key={task.id}
        id={task.id}
        className={`task-card task-card-6 ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '140px', // 增加宽度以容纳更多内容
          height: '100px', // 保持高度
          cursor: dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab',
          zIndex: 20, // 确保卡片在连接线上方
          backgroundColor: isTaskLocked() ? '#f3f4f6' : '#ffffff',
          borderRadius: '16px', // 更大的圆角
          boxShadow: isTaskLocked() 
            ? '0 8px 20px rgba(0, 0, 0, 0.05)' 
            : (task.isCompleted || false) 
              ? '0 8px 20px rgba(34, 197, 94, 0.15)' 
              : '0 8px 20px rgba(59, 130, 246, 0.15)', // 蓝色主题阴影
          border: `1px solid ${isTaskLocked() ? '#e5e7eb' : (task.isCompleted || false) ? '#d1fae5' : '#dbeafe'}`,
          cursor: isTaskLocked() ? 'not-allowed' : (dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab'),
          display: 'flex',
          flexDirection: 'row', // 改为左右布局，参考TaskCard5
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: dragState.isDragging && dragState.taskId === task.id ? 'scale(1.05) rotate(1deg)' : 'scale(1)',
        }}
        onClick={(event) => handleCardClick(event)}
        onMouseDown={(event) => handleDragStart(task.id, event)}
        onTouchStart={(event) => handleDragStart(task.id, event.touches[0])}
      >
        {/* 任务图片区域 - 作为卡片的左侧，参考TaskCard5 */}
        <div 
          className="task-image-container" 
          style={{
            width: '70px', // 图片区域宽度
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
              backgroundColor: isTaskLocked() ? '#9ca3af' : (task.isCompleted || false) ? '#22c55e' : '#3b82f6' // 蓝色主题
            }}
          />
        </div>
        
        {/* 任务内容区域 - 作为卡片的右侧，参考TaskCard5布局 */}
        <div className="task-content" style={{
              flex: 1,
              padding: '10px', // 内边距
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
            marginBottom: '4px',
          }}>
            <div className="task-number" style={{
              fontSize: '10px',
              fontWeight: '600',
              color: isTaskLocked() ? '#9ca3af' : (task.isCompleted || false) ? '#22c55e' : '#3b82f6', // 蓝色主题
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
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isTaskLocked() ? '#9ca3af' : (task.isCompleted || false) ? '#22c55e' : '#3b82f6',
                boxShadow: `0 0 0 3px ${isTaskLocked() ? 'rgba(156, 163, 175, 0.1)' : (task.isCompleted || false) ? 'rgba(34, 197, 94, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`,
              }}
            />
          </div>
          
          {/* 任务标题 - 多行显示 */}
          <div className="task-text" style={{
              fontSize: '12px', // 适合小卡片的字体大小
              fontWeight: '700',
              color: isTaskLocked() ? '#9ca3af' : '#111827',
              textAlign: 'left',
              lineHeight: '1.3',
              marginBottom: 'auto', // 自动填充中间空间
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              textDecoration: 'none',
              display: '-webkit-box',
              WebkitLineClamp: 2, // 限制两行
              WebkitBoxOrient: 'vertical',
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
            gap: '4px',
            marginTop: '6px',
          }}>
            {/* 进度条容器 */}
            <div style={{
              width: '100%',
              height: '4px', // 更细的进度条
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              {/* 进度条填充 */}
              <div 
                style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  backgroundColor: task.isCompleted ? '#22c55e' : '#3b82f6', // 蓝色主题
                  borderRadius: '4px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            
            {/* 进度文本 */}
              <div style={{
                fontSize: '10px',
                color: '#6b7280',
                textAlign: 'left',
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
              background: 'repeating-linear-gradient(#81a1c1, #81a1c1 2px, #88c0d0 2px, #88c0d0 10px)',
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
              backgroundColor: '#e5e9f0',
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
              color: '#2e3440',
              textAlign: 'center',
              marginBottom: '25px',
              paddingBottom: '15px',
              borderBottom: '2px solid #5e81ac',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              故事章节 {index + 1}
            </div>
            
            {/* 故事内容 */}
            <div className="story-content" style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: '#4c566a',
              textAlign: 'justify',
              marginBottom: '30px',
            }}>
              {index === 0 && (
                <p>"欢迎来到北方的冰原，勇者。你的冒险将从这里开始，第一个挑战正等待着你。证明你的决心与勇气，踏上这段史诗般的旅程。"
                </p>
              )}
              {index === 1 && (
                <p>"很好，你已经通过了第一个试炼。现在，继续向北前进，探索这片神秘的冰原，完成下一个使命，解锁更多的故事篇章。"
                </p>
              )}
              {index === 2 && (
                <p>"你的能力正在不断提升。前方的道路依然充满挑战，但你已经证明了自己的价值。继续前进吧，新的冒险在等待着你。"
                </p>
              )}
              {index === 3 && (
                <p>"你已经接近旅程的高潮。每一个完成的任务都让你变得更加强大。坚持下去，最后的挑战即将到来。"
                </p>
              )}
              {index === 4 && (
                <p>"你已经到达了冰原的深处，这里的寒冷超乎想象。但你已经不是当初那个新手了，继续前进，征服这片土地！"
                </p>
              )}
              {index === 5 && (
                <p>"这是你的终极挑战！完成这最后一项任务，你将成为真正的北方英雄，解锁冰原的古老秘密。"
                </p>
              )}
            </div>
            
            {/* 任务信息卡片 */}
            <div className="task-info-card" style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #81a1c1',
            }}>
              <div className="task-info-title" style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#2e3440',
                marginBottom: '12px',
              }}>
                任务详情
              </div>
              <div className="task-info-text" style={{
                fontSize: '16px',
                color: '#4c566a',
                lineHeight: '1.6',
              }}>
                {task.text}
              </div>
            </div>
            
            {/* 任务状态 */}
            <div className="task-status" style={{
              fontSize: '16px',
              color: '#2e3440',
              textAlign: 'center',
              marginBottom: '30px',
              padding: '12px',
              backgroundColor: 'rgba(94, 129, 172, 0.1)',
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
              {/* 当任务未锁定时才显示标记按钮 */}
              {!isTaskLocked() && (
                <button
                  className="complete-task-btn"
                  style={{
                  padding: '12px 24px',
                  backgroundColor: task.isCompleted ? '#ef4444' : '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: task.isCompleted 
                    ? '0 2px 6px rgba(239, 68, 68, 0.3)'
                    : '0 2px 6px rgba(34, 197, 94, 0.3)',
                }}
                  onClick={() => {
                    toggleTaskCompletion(task.id);
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = task.isCompleted ? '#dc2626' : '#16a34a';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = task.isCompleted ? '#ef4444' : '#22c55e';
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
                  backgroundColor: '#2e3440',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 6px rgba(46, 52, 64, 0.3)',
                }}
                onClick={() => setIsModalOpen(false)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#3b4252';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#2e3440';
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
              backgroundColor: 'rgba(94, 129, 172, 0.2)',
              border: '2px solid #5e81ac',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#2e3440',
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

export default TaskCard6;