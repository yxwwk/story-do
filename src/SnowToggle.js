import React from 'react';

const SnowToggle = ({ isSnowing, onToggle }) => {
  return (
    <div className="snow-toggle">
      <label className="toggle-label">
        <input 
          type="checkbox" 
          checked={isSnowing} 
          onChange={onToggle}
          className="toggle-checkbox"
        />
        <span className="toggle-slider">
          <span className="toggle-icon">❄️</span>
        </span>
      </label>
      <span className="toggle-text">{isSnowing ? '关闭下雪' : '开启下雪'}</span>
    </div>
  );
};

export default SnowToggle;