import React from 'react';
import ConnectionLine from './ConnectionLine';

const TaskCard7 = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart }) => {
  // 根据索引和任务数量计算位置
  const getPosition = () => {
    const positions = {
      7: [
        { x: 120, y: 80 },   // 第一个任务
        { x: 320, y: 150 },  // 第二个任务
        { x: 520, y: 80 },   // 第三个任务
        { x: 180, y: 250 },  // 第四个任务
        { x: 420, y: 250 },  // 第五个任务
        { x: 280, y: 350 },  // 第六个任务
        { x: 520, y: 350 }   // 第七个任务
      ],
      default: [
        { x: 100 + (index % 3) * 200, y: 80 + Math.floor(index / 3) * 180 }
      ]
    };
    
    return positions[taskCount]?.[index] || positions.default[0];
  };
  
  const position = getPosition();
  
  // TaskCard7特定的连接关系定义（圆形布局）
  const connections = [
    { source: 'aaaaa', target: 'ccccc', type: 'line' }, // 1 -> 2
    { source: 'ccccc', target: 'ddddd', type: 'line' }, // 2 -> 3
    { source: 'ddddd', target: 'bbbbb', type: 'line' }, // 3 -> 4
    { source: 'bbbbb', target: 'eeeee', type: 'line' }, // 4 -> 5
    { source: 'eeeee', target: 'fffff', type: 'line' }, // 5 -> 6
    { source: 'fffff', target: 'ggggg', type: 'line' }, // 6 -> 7
    { source: 'ggggg', target: 'aaaaa', type: 'line' }  // 7 -> 1（循环连接）
  ];
  
  // 获取当前任务相关的连接
  const getTaskConnections = () => {
    // 对于TaskCard7，显示从当前任务出发的连接
    return connections.filter(conn => conn.source === task.id);
  };
  
  // 获取目标任务的位置（基于7个任务的圆形布局）
  const getTargetPosition = (targetId) => {
    // 对于TaskCard7特定的圆形布局
    const targetPositions = {
      'aaaaa': { x: 400, y: 100 },  // 顶部
      'ccccc': { x: 580, y: 150 },  // 右上1
      'ddddd': { x: 650, y: 300 },  // 右上2
      'bbbbb': { x: 580, y: 450 },  // 右下
      'eeeee': { x: 400, y: 550 },  // 底部
      'fffff': { x: 220, y: 450 },  // 左下
      'ggggg': { x: 150, y: 300 }   // 左上
    };
    return targetPositions[targetId] || { x: position.x + 180, y: position.y + 150 };
  };
  
  // TaskCard7特定的连接线样式和逻辑 - 紫色渐变风格
  const renderConnections = () => {
    const taskConnections = getTaskConnections();
    const cardWidth = 90;
    const cardHeight = 90;
    
    return taskConnections.map((connection, connIndex) => {
      // 计算起点（根据任务在圆形中的位置调整连接点）
      let startX, startY;
      
      // 根据任务ID确定连接点位置，适配圆形布局
      if (task.id === 'aaaaa') { // 顶部
        startX = position.x + cardWidth / 2;
        startY = position.y + cardHeight + 10;
      } else if (task.id === 'ccccc') { // 右上1
        startX = position.x - 10;
        startY = position.y + cardHeight / 2;
      } else if (task.id === 'ddddd') { // 右上2
        startX = position.x - 10;
        startY = position.y + cardHeight / 2;
      } else if (task.id === 'bbbbb') { // 右下
        startX = position.x - 10;
        startY = position.y + cardHeight / 2;
      } else if (task.id === 'eeeee') { // 底部
        startX = position.x + cardWidth / 2;
        startY = position.y - 10;
      } else if (task.id === 'fffff') { // 左下
        startX = position.x + cardWidth + 10;
        startY = position.y + cardHeight / 2;
      } else if (task.id === 'ggggg') { // 左上
        startX = position.x + cardWidth + 10;
        startY = position.y + cardHeight / 2;
      } else {
        // 默认连接点
        startX = position.x + cardWidth / 2;
        startY = position.y + cardHeight / 2;
      }
      
      // 获取目标位置并计算终点
      const targetPos = getTargetPosition(connection.target);
      let endX, endY;
      
      // 根据目标任务ID确定连接点位置
      if (connection.target === 'aaaaa') { // 连接到顶部
        endX = targetPos.x + cardWidth / 2;
        endY = targetPos.y - 10;
      } else if (connection.target === 'ccccc') { // 连接到右上1
        endX = targetPos.x + cardWidth + 10;
        endY = targetPos.y + cardHeight / 2;
      } else if (connection.target === 'ddddd') { // 连接到右上2
        endX = targetPos.x + cardWidth + 10;
        endY = targetPos.y + cardHeight / 2;
      } else if (connection.target === 'bbbbb') { // 连接到右下
        endX = targetPos.x + cardWidth + 10;
        endY = targetPos.y + cardHeight / 2;
      } else if (connection.target === 'eeeee') { // 连接到底部
        endX = targetPos.x + cardWidth / 2;
        endY = targetPos.y + cardHeight + 10;
      } else if (connection.target === 'fffff') { // 连接到左下
        endX = targetPos.x - 10;
        endY = targetPos.y + cardHeight / 2;
      } else if (connection.target === 'ggggg') { // 连接到左上
        endX = targetPos.x - 10;
        endY = targetPos.y + cardHeight / 2;
      } else {
        // 默认连接点
        endX = targetPos.x + cardWidth / 2;
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
      className={`task-card task-card-7 ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
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
        <div className="task-diamond">
        <div className="note-header">
          <div className="note-pin"></div>
        </div>
        <div className="note-content">
          <div className="task-text">{task.text}</div>
          <div className={`note-status ${task.isCompleted ? 'completed' : 'pending'}`}>
            {task.isCompleted ? '已完成' : '待完成'}
          </div>
        </div>
        <div className="note-footer">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TaskCard7;