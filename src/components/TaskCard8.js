import React from 'react';
import ConnectionLine from './ConnectionLine';

const TaskCard8 = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart }) => {
  // 根据索引和任务数量计算位置
  const getPosition = () => {
    const positions = {
      8: [
        { x: 100, y: 100 },  // 第一个任务
        { x: 280, y: 70 },   // 第二个任务
        { x: 460, y: 100 },  // 第三个任务
        { x: 640, y: 70 },   // 第四个任务
        { x: 100, y: 250 },  // 第五个任务
        { x: 280, y: 300 },  // 第六个任务
        { x: 460, y: 250 },  // 第七个任务
        { x: 640, y: 300 }   // 第八个任务
      ],
      default: [
        { x: 100 + (index % 4) * 170, y: 100 + Math.floor(index / 4) * 220 }
      ]
    };
    
    return positions[taskCount]?.[index] || positions.default[0];
  };
  
  const position = getPosition();
  
  // TaskCard8特定的连接关系定义（网格布局）
  const connections = [
    { source: 'aaaaa', target: 'ccccc', type: 'line' }, // 1 -> 2
    { source: 'ccccc', target: 'ddddd', type: 'line' }, // 2 -> 3
    { source: 'ddddd', target: 'bbbbb', type: 'line' }, // 3 -> 4
    { source: 'bbbbb', target: 'eeeee', type: 'line' }, // 4 -> 5
    { source: 'eeeee', target: 'fffff', type: 'line' }, // 5 -> 6
    { source: 'fffff', target: 'ggggg', type: 'line' }, // 6 -> 7
    { source: 'ggggg', target: 'hhhhh', type: 'line' }, // 7 -> 8
    { source: 'hhhhh', target: 'aaaaa', type: 'line' }  // 8 -> 1（循环连接）
  ];
  
  // 获取当前任务相关的连接
  const getTaskConnections = () => {
    // 对于TaskCard8，显示从当前任务出发的连接
    return connections.filter(conn => conn.source === task.id);
  };
  
  // 获取目标任务的位置（基于8个任务的网格布局）
  const getTargetPosition = (targetId) => {
    // 对于TaskCard8特定的网格布局
    const targetPositions = {
      'aaaaa': { x: 150, y: 150 },   // 左上
      'ccccc': { x: 350, y: 150 },   // 右上
      'ddddd': { x: 350, y: 350 },   // 右下
      'bbbbb': { x: 150, y: 350 },   // 左下
      'eeeee': { x: 550, y: 150 },   // 右上2
      'fffff': { x: 550, y: 350 },   // 右下2
      'ggggg': { x: 550, y: 550 },   // 右下3
      'hhhhh': { x: 150, y: 550 }    // 左下3
    };
    return targetPositions[targetId] || { x: position.x + 200, y: position.y + 200 };
  };
  
  // TaskCard8特定的连接线样式和逻辑 - 青色渐变风格
  const renderConnections = () => {
    const taskConnections = getTaskConnections();
    const cardWidth = 120;
    const cardHeight = 120;
    
    return taskConnections.map((connection, connIndex) => {
      // 计算起点（根据任务在网格中的位置调整连接点）
      let startX, startY;
      
      // 根据任务ID确定连接点位置，适配网格布局
      // 上两行右侧任务向右连接
      if ([ 'ccccc', 'eeeee', 'fffff' ].includes(task.id)) {
        startX = position.x + cardWidth + 10;
        startY = position.y + cardHeight / 2;
      }
      // 左侧任务向右连接
      else if ([ 'aaaaa', 'bbbbb', 'hhhhh' ].includes(task.id)) {
        startX = position.x + cardWidth + 10;
        startY = position.y + cardHeight / 2;
      }
      // 底部任务向上连接
      else if (task.id === 'ggggg') {
        startX = position.x + cardWidth / 2;
        startY = position.y - 10;
      }
      else {
        // 默认连接点
        startX = position.x + cardWidth + 10;
        startY = position.y + cardHeight / 2;
      }
      
      // 获取目标位置并计算终点
      const targetPos = getTargetPosition(connection.target);
      let endX, endY;
      
      // 根据目标任务ID确定连接点位置
      // 连接到右侧任务从左侧进入
      if ([ 'ccccc', 'ddddd', 'eeeee', 'fffff', 'ggggg' ].includes(connection.target)) {
        endX = targetPos.x - 10;
        endY = targetPos.y + cardHeight / 2;
      }
      // 连接到底部任务从顶部进入
      else if (connection.target === 'bbbbb' || connection.target === 'hhhhh') {
        endX = targetPos.x + cardWidth / 2;
        endY = targetPos.y - 10;
      }
      // 连接到顶部任务从底部进入
      else if (connection.target === 'aaaaa') {
        endX = targetPos.x + cardWidth / 2;
        endY = targetPos.y + cardHeight + 10;
      }
      else {
        // 默认连接点
        endX = targetPos.x - 10;
        endY = targetPos.y + cardHeight / 2;
      }
      
      return (
        <ConnectionLine 
          key={connIndex}
          startX={startX}
          startY={startY}
          endX={endX}
          endY={endY}
          isCompleted={task.isCompleted}
        />
      );
    });
  };
  
  return (
    <div 
      key={task.id}
      id={task.id}
      className={`task-card task-card-8 ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab'
      }}
      onClick={(event) => toggleTaskCompletion(task.id, event)}
      onMouseDown={(event) => handleDragStart(task.id, event)}
     onTouchStart={(event) => handleDragStart(task.id, event.touches[0])}
      >
        {renderConnections()}
        <div className="task-cube">
        <div className="glass-header">
          <div className="task-number">{task.id.slice(-3).toUpperCase()}</div>
        </div>
        <div className="glass-content">
          <div className="task-text">{task.text}</div>
          {task.isCompleted && (
            <div className="glass-check">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#22c55e">
                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
        </div>
        <div className="glass-footer">
          <div className="footer-dot"></div>
          <div className="footer-dot"></div>
          <div className="footer-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard8;