import React from 'react';

const TaskCard2 = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart }) => {
  // 根据索引和任务数量计算位置 - 增加间距以适应更大的卡片
  const getPosition = () => {
    const positions = {
      2: [
        { x: 200, y: 100 },  // 第一个任务，位置适当调整
        { x: 850, y: 100 }   // 第二个任务，位置适当调整
      ],
      default: [
        { x: 100 + index * 400, y: 100 + (index % 2) * 350 } // 增加间距以适应更大的卡片
      ]
    };
    
    return positions[taskCount]?.[index] || positions.default[0];
  };
  
  const position = getPosition();
  
  // TaskCard2特定的连接关系定义
  const connections = [
    { source: 'aaaa', target: 'bbbb', type: 'line' } // 保持正确的任务ID连接
  ];
  
  // 获取当前任务相关的连接
  const getTaskConnections = () => {
    // 只让源任务（第一个任务）渲染连接线，避免重复渲染
    if (index === 0) {
      return connections.filter(conn => conn.source === task.id);
    }
    // 其他任务不渲染任何连接线
    return [];
  };
  
  // 获取目标任务的位置（如果有）
  const getTargetPosition = (targetId) => {
    // 对于TaskCard2特定的连接逻辑，我们使用预设位置，确保与getPosition函数中的位置一致
    const targetPositions = {
      'bbbb': { x: 800, y: 100 } // 更新位置以匹配getPosition函数中的定义
    };
    return targetPositions[targetId] || { x: position.x + 800, y: position.y }; // 增加间距以适应更大的布局
  };
  
  // 计算两点之间的线与矩形框的交点，并让交点远离卡片边缘一定距离
  const getIntersectionPoint = (rectX, rectY, rectWidth, rectHeight, targetX, targetY, offset = 20) => {
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
  
  // TaskCard2特定的连接线样式和逻辑 - 修改为从卡片边缘连接
  const renderConnections = () => {
    const taskConnections = getTaskConnections();
    const cardWidth = 320; // 进一步增大卡片宽度
    const cardHeight = 350; // 进一步增大卡片高度
    
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
              height: '3px', // 稍微调整粗细，更加精致
              backgroundColor: task.isCompleted ? '#10b981' : '#6366f1', // 紫色调更加现代
              background: task.isCompleted ? 
                'linear-gradient(90deg, rgba(16,185,129,0.3) 0%, rgba(16,185,129,0.8) 100%)' : 
                'linear-gradient(90deg, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0.8) 100%)', // 渐变效果
              transformOrigin: '0 50%',
              transform: `rotate(${Math.atan2(targetIntersection.y - sourceIntersection.y, targetIntersection.x - sourceIntersection.x) * (180 / Math.PI)}deg)`,
              zIndex: 10,
              pointerEvents: 'none',
              borderRadius: '3px', // 更圆润的边角
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)', // 微妙的阴影增强立体感
              opacity: 0.9, // 稍微提高不透明度以增强可见性
              transition: 'all 0.3s ease', // 添加过渡效果
            }}
          />
          {/* 优化的箭头 */}
          <div
            style={{
              position: 'absolute',
              left: `${targetIntersection.x - 10}px`,
              top: `${targetIntersection.y - 5}px`,
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent', // 稍微增大箭头尺寸
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              // 创建渐变箭头效果的技巧
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '-12px',
                top: '-6px',
                width: 0,
                height: 0,
                borderLeft: '12px solid ' + (task.isCompleted ? '#10b981' : '#6366f1'),
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
              }}
            />
          </div>
        </React.Fragment>
      );
    });
  };
  
  // 渲染连接线
  const renderedConnections = renderConnections();
  
  // 计算任务完成百分比 - 确保初始化时任务未完成
  const completionPercentage = task.isCompleted || false ? 100 : 0; // 默认0%，而不是40%
  
  // 为不同任务分配不同的网络图片（使用占位图片服务）
  const getTaskImage = () => {
    // 根据任务索引或ID选择不同的图片主题
    const imageThemes = [
      'code',           // 编程相关图片
      'education',      // 教育相关图片
      'technology',     // 技术相关图片
      'productivity',   // 生产力相关图片
      'business'        // 商业相关图片
    ];
    
    // 为特定任务ID分配固定的图片
    const taskImages = {
      'aaaa': `https://picsum.photos/id/${42 + (index % 10)}/800/600`, // 使用picsum的随机图片
      'bbbb': `https://picsum.photos/id/${52 + (index % 10)}/800/600`, // 使用不同的随机种子
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
        className={`task-card task-card-2 ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab',
          zIndex: 5,
          backgroundColor: '#ffffff', // 确保背景是白色
          borderRadius: '24px', // 更圆润的边角
          boxShadow: (task.isCompleted || false) 
            ? '0 12px 30px rgba(16, 185, 129, 0.15)' 
            : '0 12px 30px rgba(59, 130, 246, 0.15)', // 根据完成状态变化阴影
          border: `1px solid ${(task.isCompleted || false) ? '#d1fae5' : '#eff6ff'}`, // 根据完成状态变化边框颜色
          width: '320px', // 进一步增大卡片宽度
          height: '350px', // 进一步增大卡片高度
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // 更平滑的过渡效果
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
        
        {/* 任务图片区域 - 新增，作为卡片的上半部分 */}
        <div 
          className="task-image-container" 
          style={{
            width: '100%',
            height: '180px', // 图片区域高度
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
              objectFit: 'cover', // 保持图片比例并填充容器
              transition: 'transform 0.5s ease',
              borderRadius: '24px 24px 0 0', // 为图片添加顶部圆角，与卡片整体风格一致
            }}
          />
          
          {/* 图片遮罩 - 增强文字可读性 */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
              borderRadius: '0 0 24px 24px', // 确保遮罩底部圆角与卡片匹配
            }}
          />
          
          {/* 任务头部信息 - 放置在图片底部 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div className="task-number" style={{
              fontSize: '14px',
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
          padding: '20px 24px',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* 任务标题 - 调整为上下布局的文字部分 */}
          <div className="task-text" style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#111827',
            textAlign: 'left', // 调整为左对齐
            lineHeight: '1.4',
            marginBottom: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            textDecoration: 'none', // 确保没有删除线
            whiteSpace: 'nowrap', // 防止文本换行
            overflow: 'hidden', // 隐藏溢出部分
            textOverflow: 'ellipsis', // 溢出部分显示省略号
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
              height: '8px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              {/* 进度条填充 */}
              <div 
                style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  backgroundColor: (task.isCompleted || false) ? '#10b981' : '#3b82f6',
                  borderRadius: '4px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            
            {/* 进度文本 */}
            <div style={{
              fontSize: '13px',
              color: '#6b7280',
              textAlign: 'right',
              fontWeight: '500',
            }}>
              {(task.isCompleted || false) ? '100% 已完成' : '0% 未开始'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard2;