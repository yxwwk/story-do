import React from 'react';

const ConnectionLine = ({ startX, startY, endX, endY, isCompleted }) => {
  // 计算连接线的长度和角度
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  
  // 设置连接线的样式
  const lineStyle = {
    position: 'absolute',
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${length}px`,
    height: isCompleted ? '4px' : '3px',
    transformOrigin: '0 50%',
    transform: `rotate(${angle}deg)`,
    backgroundColor: isCompleted ? '#22c55e' : '#3b82f6',
    borderTopLeftRadius: '3px',
    borderBottomLeftRadius: '3px',
    zIndex: 1
  };
  
  // 设置箭头的样式
  const arrowStyle = {
    position: 'absolute',
    width: '0',
    height: '0',
    borderLeft: `8px solid ${isCompleted ? '#22c55e' : '#3b82f6'}`,
    borderTop: '4px solid transparent',
    borderBottom: '4px solid transparent',
    left: `${endX - 2}px`,
    top: `${endY - 4}px`,
    zIndex: 2
  };
  
  // 设置起点圆点样式
  const startDotStyle = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: isCompleted ? '#22c55e' : '#3b82f6',
    left: `${startX - 6}px`,
    top: `${startY - 6}px`,
    zIndex: 2,
    boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
  };
  
  return (
    <>
      <div className={`connection-line ${isCompleted ? 'line-completed' : ''}`} style={lineStyle} />
      <div className="arrowhead" style={arrowStyle} />
      <div className="connection-dot" style={startDotStyle} />
    </>
  );
};

export default ConnectionLine;