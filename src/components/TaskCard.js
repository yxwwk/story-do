import React from 'react';

const TaskCard = ({ task, onDragStart, onDragOver, onDragEnd, onDrop, onClick }) => {
  // 生成任务颜色
  const getTaskColor = (index) => {
    const colors = ['#3b82f6', '#22c55e', '#f97316', '#8b5cf6', '#ec4899'];
    return colors[index % colors.length];
  };

  return (
    <div
      className={`task-card ${task.isCompleted ? 'task-completed' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragOver={(e) => onDragOver(e, task)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop(e, task)}
      onClick={() => onClick(task)}
      style={{
        borderLeftColor: getTaskColor(task.id),
        backgroundColor: task.isCompleted ? '#f0fdf4' : '#ffffff'
      }}
    >
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