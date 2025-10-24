import React, { useState } from 'react';

const TaskCard7 = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart, tasks }) => {
  // 任务锁状态管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 位置数据定义 - 移到组件顶层使其在所有函数中可访问
  const positions = {
    7: [
      { x: 120, y: 80 },   // 第一个任务
      { x: 420, y: 80 },  // 第二个任务
      { x: 420, y: 280 },   // 第三个任务
      { x: 680, y: 280 },  // 第四个任务
      { x: 920, y: 280 },  // 第五个任务
      { x: 920, y: 490 },  // 第六个任务
      { x: 620, y: 490 }   // 第七个任务
    ],
    default: [
      { x: 100 + (index % 3) * 200, y: 80 + Math.floor(index / 3) * 180 }
    ]
  };
  
  // 根据索引和任务数量计算位置
  const getPosition = () => {
    return positions[taskCount]?.[index] || positions.default[0];
  };
  
  const position = getPosition();
  
  // TaskCard7特定的连接关系定义（圆形布局）
  const connections = [
    { source: 'aaaa', target: 'bbbb', type: 'line' }, // 1 -> 2
    { source: 'bbbb', target: 'cccc', type: 'line' }, // 2 -> 3
    { source: 'cccc', target: 'dddd', type: 'line' }, // 3 -> 4
    { source: 'dddd', target: 'eeee', type: 'line' }, // 4 -> 5
    { source: 'eeee', target: 'ffff', type: 'line' }, // 5 -> 6
    { source: 'ffff', target: 'gggg', type: 'line' }, // 6 -> 7
  ];
  
  // 任务ID到索引的映射
  const idToIndex = {
    'aaaa': 0, // 顶部
    'bbbb': 1, // 右上1
    'cccc': 2, // 右上2
    'dddd': 3, // 右下
    'eeee': 4, // 底部
    'ffff': 5, // 左下
    'gggg': 6  // 左上
  };
  
  // 获取当前任务相关的连接
  const getTaskConnections = () => {
    return connections.filter(conn => conn.source === task.id || conn.target === task.id);
  };
  
  // 获取目标元素的位置
  const getTargetPosition = (targetId) => {
    // 如果targetId对应的索引在positions[taskCount]中存在，则使用该位置
    const targetIndex = idToIndex[targetId];
    if (targetIndex !== undefined && positions[taskCount]?.[targetIndex]) {
      return positions[taskCount][targetIndex];
    }
    
    // 否则返回默认位置
    return positions.default[0];
  };
  
  // 计算线与矩形框的交点
  const getIntersectionPoint = (sourcePos, targetPos, isSource) => {
    // 假设卡片的中心点就是位置点
    const cardCenter = isSource ? position : getTargetPosition(targetPos);
    const otherCenter = isSource ? getTargetPosition(targetPos) : position;
    
    // 卡片宽度和高度
    const cardWidth = 140;
    const cardHeight = 100;
    
    // 计算两个中心点之间的向量
    const dx = otherCenter.x - cardCenter.x;
    const dy = otherCenter.y - cardCenter.y;
    
    // 计算向量长度
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return cardCenter;
    
    // 计算交点坐标
    const scale = Math.min(1, Math.max(0, length - Math.min(cardWidth, cardHeight) / 2) / length);
    return {
      x: cardCenter.x + dx * scale,
      y: cardCenter.y + dy * scale
    };
  };
  
  // 渲染连接线
  const renderConnections = () => {
    const taskConnections = getTaskConnections();
    
    return taskConnections.map((conn, connIndex) => {
      // 确定当前任务是源还是目标
      const isSource = conn.source === task.id;
      const sourcePos = position;
      const targetId = isSource ? conn.target : conn.source;
      
      // 计算交点
      const sourceIntersection = getIntersectionPoint(sourcePos, targetId, true);
      const targetIntersection = getIntersectionPoint(sourcePos, targetId, false);
      
      // 计算距离和角度
      const dx = targetIntersection.x - sourceIntersection.x;
      const dy = targetIntersection.y - sourceIntersection.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      // 判断是否为长连接
      const isLongConnection = length > 150;
      
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
              backgroundColor: task.isCompleted ? '#22c55e' : '#8b5cf6', // 紫色主题
              background: task.isCompleted ? 
                'linear-gradient(90deg, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0.8) 100%)' : 
                (isLongConnection ? 
                  'linear-gradient(90deg, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0.6) 50%, rgba(139,92,246,0.8) 100%)' :
                  'linear-gradient(90deg, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0.8) 100%)'),
              transformOrigin: '0 50%',
              transform: `rotate(${angle}deg)`,
              zIndex: 10,
              pointerEvents: 'none',
              borderRadius: '3px',
              boxShadow: isLongConnection ? 
                '0 2px 8px rgba(139,92,246,0.15)' : 
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
              borderColor: 'transparent transparent transparent ' + (task.isCompleted ? '#22c55e' : '#8b5cf6'),
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
              backgroundColor: task.isCompleted ? '#22c55e' : '#8b5cf6',
              zIndex: 11,
              marginLeft: isLongConnection ? '-7px' : '-6px',
              marginTop: isLongConnection ? '-7px' : '-6px',
              boxShadow: isLongConnection ? 
                `0 0 12px ${task.isCompleted ? 'rgba(34, 197, 94, 0.6)' : 'rgba(139, 92, 246, 0.6)'}` : 
                `0 0 10px ${task.isCompleted ? 'rgba(34, 197, 94, 0.5)' : 'rgba(139, 92, 246, 0.5)'}`,
              opacity: 0.9,
              transition: 'all 0.3s ease',
            }}
          />
        </React.Fragment>
      );
    });
  };
  
  // 检查任务是否被锁定
  const isTaskLocked = () => {
    // 边界检查
    if (!tasks || !Array.isArray(tasks)) {
      return index !== 0; // 当tasks不存在时，默认只有第一个任务(索引0)解锁
    }
    
    // 第一个任务(索引0)始终保持解锁状态
    if (index === 0) {
      return false;
    }
    
    // 检查前一个任务是否已完成
    const previousTask = tasks[index - 1];
    return !previousTask || !previousTask.isCompleted;
  };
  
  // 处理切换任务完成状态
  const handleToggleCompletion = () => {
    // 只有未锁定的任务才能切换完成状态
    if (!isTaskLocked()) {
      toggleTaskCompletion(task.id);
    }
  };

  // 获取故事章节内容
  const getChapterContent = () => {
    // 优先使用task.levelPlot作为内容
    if (task && task.levelPlot) {
      return {
        title: `第${index + 1}章 冒险故事`,
        content: task.levelPlot
      };
    }
    
    // 如果task.levelPlot不存在，使用默认内容作为后备
    const defaultChapters = [
      {
        title: "魔法森林的入口",
        content: "你站在魔法森林的入口处，古老的树木散发着神秘的光芒。传说中，这里隐藏着强大的宝藏，但只有通过一系列考验的勇者才能获得。"
      },
      {
        title: "水晶湖的守护者",
        content: "水晶湖平静如镜，湖面倒映着璀璨的星空。守护者是一只古老的水精灵，它会考验你的智慧和勇气。"
      },
      {
        title: "迷雾山谷",
        content: "迷雾山谷中，方向感会被扭曲，只有坚定信念的人才能找到正确的道路。小心，山谷中隐藏着各种幻象。"
      },
      {
        title: "火焰山脉",
        content: "火焰山脉的温度极高，岩浆在地面流淌。这里居住着火元素生物，它们尊重强者但讨厌弱者。"
      },
      {
        title: "云端城堡",
        content: "漂浮在云端的城堡是最后一站，也是最艰难的挑战。城堡的守护者会检验你的一切品质，只有真正的勇者才能通过。"
      }
    ];
    
    // 根据索引返回对应的章节，如果超出范围则返回默认章节
    return defaultChapters[index] || defaultChapters[0];
  };

  // 关闭模态框
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  // 为不同任务分配不同的网络图片
  const getTaskImage = () => {
    return `https://picsum.photos/id/${70 + (index % 10)}/800/600`;
  };
  
  // 计算任务完成百分比
  const completionPercentage = task.isCompleted || false ? 100 : 0;
  
  // 注意：TaskCard7不包含内部拖拽结束处理逻辑，与TaskCard6保持一致
  // 拖拽状态管理应在父组件中处理

  return (
    <>
      {/* 先渲染连接线，确保在卡片下方 */}
      {renderConnections()}
      
      {/* 再渲染任务卡片 - 优化的内容结构和布局 */}
      <div 
        key={task.id}
        id={task.id}
        className={`task-card task-card-7 ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
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
          boxShadow: (task.isCompleted || false) 
            ? '0 8px 20px rgba(34, 197, 94, 0.15)' 
            : (isTaskLocked() 
              ? '0 8px 20px rgba(156, 163, 175, 0.15)' 
              : '0 8px 20px rgba(139, 92, 246, 0.15)'),
          border: `1px solid ${(task.isCompleted || false) ? '#d1fae5' : (isTaskLocked() ? '#e5e7eb' : '#e9d5ff')}`,
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
          if (!dragState.isDragging || dragState.taskId !== task.id) {
            setIsModalOpen(true);
          }
        }}
        onMouseDown={(event) => {
          // 增强拖拽体验
          event.preventDefault();
          handleDragStart(task.id, event);
        }}
        onTouchStart={(event) => {
          // 增强触摸拖拽体验
          event.preventDefault();
          if (event.touches && event.touches.length > 0) {
            handleDragStart(task.id, event.touches[0]);
          }
        }}
        // 添加悬停效果
        onMouseEnter={(event) => {
          if (!dragState.isDragging) {
            event.currentTarget.style.boxShadow = task.isCompleted 
              ? '0 10px 25px rgba(34, 197, 94, 0.25)' 
              : (isTaskLocked() 
                ? '0 10px 25px rgba(156, 163, 175, 0.25)' 
                : '0 10px 25px rgba(139, 92, 246, 0.25)');
            event.currentTarget.style.transform = 'scale(1.02)';
          }
        }}
        onMouseLeave={(event) => {
          if (!dragState.isDragging) {
            event.currentTarget.style.boxShadow = task.isCompleted 
              ? '0 8px 20px rgba(34, 197, 94, 0.15)' 
              : (isTaskLocked() 
                ? '0 8px 20px rgba(156, 163, 175, 0.15)' 
                : '0 8px 20px rgba(139, 92, 246, 0.15)');
            event.currentTarget.style.transform = 'scale(1)';
          }
        }}
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
            src={`${task.image_url}`} 
            alt={`任务 ${task.text}`} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '16px 0 0 16px',
              transition: 'transform 0.5s ease',
              // 悬停时略微放大图片，增加交互感
              transform: 'scale(1.05)',
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
              backgroundColor: (task.isCompleted || false) ? '#22c55e' : (isTaskLocked() ? '#9ca3af' : '#8b5cf6'),
              // 添加渐变色效果
              background: task.isCompleted 
                ? 'linear-gradient(to bottom, #22c55e, #16a34a)' 
                : (isTaskLocked() 
                  ? 'linear-gradient(to bottom, #9ca3af, #6b7280)' 
                  : 'linear-gradient(to bottom, #8b5cf6, #7c3aed)'),
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
              color: (task.isCompleted || false) ? '#22c55e' : (isTaskLocked() ? '#9ca3af' : '#8b5cf6'),
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
                backgroundColor: (task.isCompleted || false) ? '#22c55e' : (isTaskLocked() ? '#9ca3af' : '#8b5cf6'),
                boxShadow: `0 0 0 3px ${(task.isCompleted || false) ? 'rgba(34, 197, 94, 0.2)' : (isTaskLocked() ? 'rgba(156, 163, 175, 0.2)' : 'rgba(139, 92, 246, 0.2)')}`,
                // 添加脉冲动画效果
                animation: task.isCompleted 
                  ? 'pulseGreen 2s infinite' 
                  : 'pulsePurple 2s infinite',
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
              textDecoration: task.isCompleted ? 'line-through' : 'none',
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
                  backgroundColor: (task.isCompleted || false) ? '#22c55e' : (isTaskLocked() ? '#9ca3af' : '#8b5cf6'),
                  borderRadius: '2px',
                  transition: 'width 0.3s ease',
                  // 添加渐变效果
                  background: task.isCompleted 
                    ? 'linear-gradient(to right, #22c55e, #16a34a)' 
                    : (isTaskLocked() 
                      ? 'linear-gradient(to right, #9ca3af, #6b7280)' 
                      : 'linear-gradient(to right, #8b5cf6, #7c3aed)'),
                }}
              />
            </div>
            
            {/* 进度文本 - 更简洁的显示 */}
            <div className="progress-text" style={{
              fontSize: '10px',
              fontWeight: '600',
              color: (task.isCompleted || false) ? '#22c55e' : (isTaskLocked() ? '#9ca3af' : '#8b5cf6'),
              minWidth: '25px', // 略微减少宽度
              textAlign: 'right',
            }}>
              {completionPercentage}%
            </div>
          </div>
        </div>
      </div>
      
      {/* 故事章节弹窗 - 故事书风格优化 */}
      {isModalOpen && (
        <div 
          className="task-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // 使用奇幻故事风格的渐变背景
            background: 'radial-gradient(circle at center, rgba(23, 25, 35, 0.9), rgba(15, 15, 25, 0.95))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.4s ease-in-out'
          }}
          onClick={closeModal}
        >
          {/* 装饰魔法粒子效果 */}
          <div style={{ position: 'absolute', top: '10%', left: '20%', width: '10px', height: '10px', backgroundColor: '#8b5cf6', borderRadius: '50%', opacity: 0.7, animation: 'float 3s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', top: '15%', right: '25%', width: '8px', height: '8px', backgroundColor: '#22c55e', borderRadius: '50%', opacity: 0.6, animation: 'float 4s ease-in-out infinite 0.5s' }} />
          <div style={{ position: 'absolute', bottom: '20%', left: '30%', width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '50%', opacity: 0.5, animation: 'float 5s ease-in-out infinite 1s' }} />
          
          <div 
            className="task-modal"
            style={{
              // 故事书样式背景
              backgroundColor: '#f8f5e9',
              borderRadius: '20px',
              padding: '0',
              width: '90%',
              maxWidth: '550px',
              maxHeight: '85vh',
              overflow: 'hidden',
              // 增强的阴影效果，模拟实体书
              boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              border: '3px solid rgba(255, 255, 255, 0.1)',
              animation: 'bookOpen 0.6s ease-out',
              // 渐变背景确保没有语法错误
              background: 'linear-gradient(145deg, #f8f5e9, #f0ebdd)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 故事书装饰性顶部 */}
            <div style={{
              height: '22px',
              background: 'linear-gradient(to right, #8b5cf6, #7c3aed, #6d28d9)',
              width: '100%',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* 魔法线条装饰 */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                transform: 'translateY(-50%)',
                animation: 'magicFlow 3s linear infinite'
              }} />
            </div>
            
            {/* 故事章节标题 - 装饰为故事书章节 */}
            <div style={{
              padding: '30px 30px 10px',
              backgroundColor: 'rgba(139, 92, 246, 0.03)',
              borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
              position: 'relative',
              textAlign: 'center'
            }}>
              {/* 装饰角标 */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '20px',
                width: '30px',
                height: '30px',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                transform: 'rotate(45deg)'
              }} />
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '20px',
                width: '30px',
                height: '30px',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                transform: 'rotate(-45deg)'
              }} />
              
              <h3 style={{
                margin: '0 auto',
                fontSize: '22px',
                fontWeight: '800',
                color: '#5b21b6',
                textAlign: 'center',
                fontFamily: 'Georgia, serif',
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                // 魔法文字效果
                background: 'linear-gradient(135deg, #5b21b6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {getChapterContent().title}
              </h3>
              
              {/* 装饰分隔线 */}
              <div style={{
                margin: '15px auto 0',
                width: '100px',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
                borderRadius: '3px'
              }} />
            </div>
            
            {/* 故事内容区域 - 优化为故事书页面风格 */}
            <div style={{
              padding: '30px',
              maxHeight: '40vh',
              overflowY: 'auto',
              fontFamily: 'Georgia, serif',
              lineHeight: '1.8',
              position: 'relative',
              // 页面纹理效果
              background: 'linear-gradient(to bottom, rgba(248, 245, 233, 0.8), rgba(248, 245, 233, 1))',
            }}>
              {/* 装饰性首字母 */}
              <p style={{
                margin: 0,
                fontSize: '16px',
                color: '#2d3748',
                textIndent: '2em',
                // 增强故事阅读感的排版
                letterSpacing: '0.3px'
              }}>
                <span style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: '#8b5cf6',
                  float: 'left',
                  margin: '-5px 10px 0 0',
                  lineHeight: '0.9',
                  fontFamily: 'Georgia, serif'
                }}>
                  {getChapterContent().content.charAt(0)}
                </span>
                {getChapterContent().content.slice(1)}
              </p>
              
              {/* 装饰性魔法光芒 */}
              <div style={{
                position: 'absolute',
                top: '50%',
                right: '-50px',
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(15px)',
                zIndex: 0
              }} />
            </div>
            
            {/* 任务信息卡片 - 优化为羊皮纸风格 */}
            <div style={{
              margin: '0 30px 30px',
              padding: '25px',
              backgroundColor: '#f7f3e3',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              // 羊皮纸效果通过渐变替代
              background: 'linear-gradient(145deg, #f7f3e3, #eee6cf)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05) inset, 0 2px 4px rgba(0, 0, 0, 0.03)'
            }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#6b21a8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.7px',
                  fontFamily: 'Georgia, serif'
                }}>
                  冒险者任务卷轴
                </span>
                
                {/* 任务状态显示 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: task.isCompleted ? '#166534' : (isTaskLocked() ? '#64748b' : '#6b21a8'),
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    letterSpacing: '0.5px'
                  }}>
                    {task.isCompleted ? '✓ 任务已完成' : (isTaskLocked() ? '🔒 任务已锁定' : '✨ 任务可执行')}
                  </span>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: task.isCompleted ? '#22c55e' : (isTaskLocked() ? '#9ca3af' : '#8b5cf6')
                  }} />
                </div>
              </div>
              
              <h4 style={{
                margin: '0 0 15px',
                fontSize: '18px',
                fontWeight: '700',
                color: '#1c1917',
                fontFamily: 'Georgia, serif',
                lineHeight: '1.4'
              }}>
                {task.text}
              </h4>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                fontSize: '13px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#8b5cf6', fontSize: '15px' }}>📜</span>
                  <span>第 {index + 1} 章</span>
                </div>
                {isTaskLocked() && !task.isCompleted && (
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontStyle: 'italic',
                    fontFamily: 'Georgia, serif'
                  }}>
                    <span style={{ fontSize: '14px' }}>🔐</span>
                    需要完成前置任务才能解锁此章节
                  </div>
                )}
              </div>
            </div>
            
            {/* 底部按钮区域 */}
            <div style={{
              padding: '0 24px 24px',
              display: 'flex',
              justifyContent: 'center',
              gap: '12px'
            }}>
              {!task.isCompleted && !isTaskLocked() && (
                <button
                onClick={handleToggleCompletion}
                style={{
                  padding: '12px 28px',
                  backgroundColor: '#6b21a8',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 6px 18px rgba(107, 33, 168, 0.4), 0 2px 6px rgba(0, 0, 0, 0.15)',
                  fontFamily: 'Georgia, serif',
                  letterSpacing: '0.5px',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#5b21b6';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(107, 33, 168, 0.5), 0 4px 12px rgba(0, 0, 0, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#6b21a8';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 6px 18px rgba(107, 33, 168, 0.4), 0 2px 6px rgba(0, 0, 0, 0.15)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}>
                  完成冒险任务
                </button>
              )}
              
              {task.isCompleted && (
                <button
                onClick={handleToggleCompletion}
                style={{
                  padding: '12px 28px',
                  backgroundColor: '#f7f6f3',
                  color: '#44403c',
                  border: '2px solid #d6d3d1',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e7e5e4';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f7f6f3';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}>
                  取消完成
                </button>
              )}
              
              <button
                onClick={closeModal}
                style={{
                  padding: '12px 28px',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '2px solid #d1d5db',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.05)';
                  e.target.style.color = '#4b5563';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                  e.target.style.borderColor = '#d1d5db';
                }}>
                关闭卷轴
                </button>
            </div>
            
            {/* 故事书装饰元素 - 魔法光芒效果 */}
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              right: '-40px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
              zIndex: -1,
              filter: 'blur(20px)',
              animation: 'pulseMagic 4s ease-in-out infinite'
            }} />
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
              zIndex: -1,
              filter: 'blur(15px)'
            }} />
            
            {/* 故事书页码装饰 */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '12px',
              color: 'rgba(139, 92, 246, 0.5)',
              fontFamily: 'Georgia, serif',
              fontWeight: '600',
              letterSpacing: '1px'
            }}>
              - {index + 1} -
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard7;