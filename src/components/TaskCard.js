import React from 'react';

const TaskCard = ({ task, index, taskCount, dragState, toggleTaskCompletion, handleDragStart }) => {
  const getTaskColor = (taskId) => {
    // 根据任务ID生成一致的颜色
    const colors = ['#4F46E5', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#6366F1'];
    return colors[taskId % colors.length];
  };
  
  // 根据索引和任务数量计算位置
  const getPosition = () => {
    // 默认网格布局
    return {
      x: 100 + (index % 3) * 220,
      y: 100 + Math.floor(index / 3) * 180
    };
  };
  
  const position = getPosition();
  
  return (
    <div 
      key={task.id}
      id={task.id}
      className={`task-card ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
      draggable
      onDragStart={() => handleDragStart(task.id)}
      onClick={() => toggleTaskCompletion(task)}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        borderColor: getTaskColor(task.id),
        cursor: dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab'
      }}>

      <div className="task-image-container">
        <div className="task-image">
          <svg viewBox="0 0 40 30" width="40" height="30">
            <polygon 
              points="0,30 20,10 40,30" 
              fill={task.isCompleted ? '#22c55e' : '#3b82f6'}
            />
            <polygon 
              points="5,30 20,15 35,30" 
              fill={task.isCompleted ? '#4ade80' : '#60a5fa'}
            />
          </svg>
        </div>
        {task.isCompleted && (
          <div className="completion-check">
            <svg viewBox="0 0 20 20" width="20" height="20">
              <circle cx="10" cy="10" r="8" fill="#22c55e" />
              <path d="M5,10 L8,13 L15,6" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
        )}
      </div>
      <div className="task-content">
        <div className="task-text">{task.text}</div>
        <div className="task-description">{task.description}</div>
      </div>
    </div>
  );
};

export default TaskCard;