import React, { useState, useEffect } from 'react';

const TaskCard2 = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart }) => {
  // 控制弹窗显示的状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 注入CSS动画样式
  useEffect(() => {
    // 创建样式元素
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes scaleIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      @keyframes scrollIn {
        from { 
          transform: translateY(30px) scale(0.95); 
          opacity: 0; 
        }
        to { 
          transform: translateY(0) scale(1); 
          opacity: 1; 
        }
      }
    `;
    
    // 添加样式到文档
    document.head.appendChild(styleElement);
    
    // 清理函数
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // 安全获取任务对象的属性
  const safeTask = {
    id: task?.id || '',
    text: task?.text || '',
    levelPlot: task?.levelPlot || '',
    isCompleted: task?.isCompleted || false
  };
  // 根据索引和任务数量计算位置 - 增加间距以适应更大的卡片
  const getPosition = () => {
    const positions = {
      2: [
        { x: 200, y: 100 },  // 第一个任务，位置适当调整
        { x: 850, y: -250 }   // 第二个任务，位置适当调整
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
          backgroundColor: '#fffef0', // 羊皮纸颜色，与故事风格一致
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', // 类似海胆的不规则圆形
          boxShadow: (task.isCompleted || false) 
            ? '0 12px 30px rgba(139, 69, 19, 0.2)' 
            : '0 12px 30px rgba(148, 103, 36, 0.2)', // 使用故事风格的暖色调阴影
          border: `2px solid ${(task.isCompleted || false) ? '#8b4513' : '#d4c8a1'}`, // 使用故事风格的边框颜色
          width: '340px', // 稍微增大卡片宽度
          height: '360px', // 稍微增大卡片高度
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // 更平滑的过渡效果
          transform: dragState.isDragging && dragState.taskId === task.id ? 'scale(1.03) rotate(1deg)' : 'scale(1)',
          position: 'relative',
        }}
        onClick={(event) => {
            // 点击卡片显示弹窗
            event.stopPropagation();
            setIsModalOpen(true);
          }}
        onMouseDown={(event) => handleDragStart(task.id, event)}
        onTouchStart={(event) => handleDragStart(task.id, event.touches[0])}
      >
        {/* 海胆形状的尖刺装饰 */}
        {[...Array(20)].map((_, i) => {
          // 计算尖刺位置，均匀分布在卡片周围
          const angle = (i / 20) * Math.PI * 2;
          const radius = 180; // 尖刺延伸距离
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          // 根据位置调整尖刺大小和旋转角度
          const size = 10 + Math.random() * 5; // 随机大小使尖刺看起来更自然
          const rotation = angle * 180 / Math.PI;
          
          return (
            <div
              key={`spike-${i}`}
              style={{
                position: 'absolute',
                width: 0,
                height: 0,
                borderLeft: `${size / 2}px solid transparent`,
                borderRight: `${size / 2}px solid transparent`,
                borderBottom: `${size}px solid ${(task.isCompleted || false) ? '#8b4513' : '#d4c8a1'}`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                zIndex: -1, // 确保尖刺在卡片背景下方
                opacity: 0.8,
                transition: 'all 0.3s ease',
              }}
            />
          );
        })}
        {/* 顶部装饰条 - 故事风格 */}
        <div 
          className="task-top-bar" 
          style={{
            height: '4px',
            backgroundColor: (task.isCompleted || false) ? '#8b4513' : '#d4c8a1',
            backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(0,0,0,0.1) 100%)',
          }}
        />
        
        {/* 任务图片区域 - 故事风格 */}
        <div 
          className="task-image-container" 
          style={{
            width: '95%',
            height: '180px',
            margin: '10px auto 0',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '50% 50% 40% 40% / 50% 50% 30% 30%',
            border: `1px solid ${(task.isCompleted || false) ? '#d4c8a1' : '#e6d8b9'}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05) inset',
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
              transition: 'transform 0.5s ease',
              filter: 'sepia(0.1) contrast(1.05)', // 轻微棕褐色调，增强故事感
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
              fontFamily: '"Georgia", "Times New Roman", serif',
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
            padding: '15px 20px',
            backgroundColor: 'transparent', // 透明背景，使用卡片背景色
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
          {/* 任务标题 - 调整为上下布局的文字部分 */}
          <div className="task-text" style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#4a3c31', // 故事风格的深棕色文字
            textAlign: 'center', // 居中显示，更适合圆形卡片
            lineHeight: '1.4',
            marginBottom: '16px',
            fontFamily: '"Georgia", "Times New Roman", serif', // 与故事弹窗一致的字体
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '0 10px',
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
              backgroundColor: '#e6d8b9', // 故事风格的浅色背景
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              {/* 进度条填充 */}
              <div 
                style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  backgroundColor: (task.isCompleted || false) ? '#8b4513' : '#cd5c5c', // 故事风格的颜色
                  borderRadius: '4px',
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
            
            {/* 进度文本 */}
            <div style={{
              fontSize: '13px',
            color: '#8b4513', // 故事风格的颜色
            textAlign: 'center', // 居中显示
              fontWeight: '500',
            }}>
              {(task.isCompleted || false) ? '100% 已完成' : '0% 未开始'}
            </div>
          </div>
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
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            animation: 'fadeIn 0.4s ease-out',
            backdropFilter: 'blur(6px)'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="story-modal"
            style={{
              backgroundColor: '#fffef0', // 羊皮纸颜色
              borderRadius: '3px',
              padding: '48px 40px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 40px 100px rgba(0, 0, 0, 0.4), 0 0 0 20px rgba(255, 254, 240, 0.3)',
              animation: 'scrollIn 0.8s ease-out',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"%23d4c8a1\" fill-opacity=\"0.1\" fill-rule=\"evenodd\"/%3E%3C/svg%3E")',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 故事装饰元素 - 顶部 */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '30px',
              backgroundColor: '#8b4513',
              borderRadius: '15px 15px 0 0',
              borderBottom: 'none',
              boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.2)'
            }} />
            
            {/* 故事装饰元素 - 左右卷轴边 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '20px',
              height: '100%',
              background: 'linear-gradient(to right, #d4c8a1, transparent)',
              opacity: 0.7
            }} />
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '20px',
              height: '100%',
              background: 'linear-gradient(to left, #d4c8a1, transparent)',
              opacity: 0.7
            }} />
            
            {/* 故事内容 */}
            <div style={{
              position: 'relative',
              zIndex: 1
            }}>
              {/* 章节装饰线 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '32px',
                justifyContent: 'center'
              }}>
                <div style={{
                  height: '1px',
                  backgroundColor: '#d4c8a1',
                  flex: 1,
                  maxWidth: '100px'
                }} />
                <div style={{
                  padding: '0 20px',
                  color: '#8b4513',
                  fontSize: '24px'
                }}>
                  ✦
                </div>
                <div style={{
                  height: '1px',
                  backgroundColor: '#d4c8a1',
                  flex: 1,
                  maxWidth: '100px'
                }} />
              </div>
              
              {/* 故事文本内容 */}
              <div style={{
                fontSize: '18px',
                lineHeight: '1.8',
                color: '#4a3c31',
                fontFamily: '"Georgia", "Times New Roman", serif',
                textAlign: 'justify',
                textIndent: '2em',
                marginBottom: '32px',
                letterSpacing: '0.2px',
                wordSpacing: '2px'
              }}>
                {safeTask.levelPlot || '暂无故事内容...'}
              </div>
              
              {/* 章节装饰线 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '32px',
                marginBottom: '32px',
                justifyContent: 'center'
              }}>
                <div style={{
                  height: '1px',
                  backgroundColor: '#d4c8a1',
                  flex: 1,
                  maxWidth: '100px'
                }} />
                <div style={{
                  padding: '0 20px',
                  color: '#8b4513',
                  fontSize: '24px'
                }}>
                  ✦
                </div>
                <div style={{
                  height: '1px',
                  backgroundColor: '#d4c8a1',
                  flex: 1,
                  maxWidth: '100px'
                }} />
              </div>
            </div>
            
            {/* 任务状态卡片 - 故事风格 */}
            <div style={{
              marginBottom: '32px',
              padding: '16px 20px',
              borderRadius: '3px',
              backgroundColor: safeTask.isCompleted ? '#f5f8f0' : '#f0f5f8',
              border: `1px solid ${safeTask.isCompleted ? '#d1d8c5' : '#c5d1d8'}`,
              textAlign: 'center',
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#fffef0',
                padding: '0 12px',
                color: '#8b4513',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                任务进度
              </div>
              <div style={{
                color: safeTask.isCompleted ? '#4a6728' : '#285467',
                fontSize: '16px',
                fontWeight: 'bold',
                marginTop: '6px',
                fontFamily: '"Georgia", "Times New Roman", serif'
              }}>
                {safeTask.isCompleted ? '任务已完成 ✓' : '任务进行中'}
              </div>
            </div>
            
            {/* 底部操作按钮 - 融入故事风格 */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px dashed #d4c8a1'
            }}>
              <button
                onClick={() => {
                  // 标记任务完成状态切换
                  toggleTaskCompletion(safeTask.id);
                }}
                style={{
                  padding: '12px 32px',
                  borderRadius: '3px',
                  border: '2px solid',
                  borderColor: safeTask.isCompleted ? '#8b4513' : '#4a6728',
                  backgroundColor: safeTask.isCompleted ? 'transparent' : '#4a6728',
                  color: safeTask.isCompleted ? '#8b4513' : '#fffef0',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  fontFamily: '"Georgia", "Times New Roman", serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                }}
              >
                {safeTask.isCompleted ? '标记为未完成' : '标记为已完成'}
              </button>
              
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '12px 32px',
                  borderRadius: '3px',
                  border: '2px solid #8b4513',
                  backgroundColor: 'transparent',
                  color: '#8b4513',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  fontFamily: '"Georgia", "Times New Roman", serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
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

export default TaskCard2;