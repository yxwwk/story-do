import React, { useState, useEffect } from 'react';

const SuccessPage = ({ tasks, onRestart }) => {
  // 模拟烟花效果的状态
  const [fireworks, setFireworks] = useState([]);
  
  // 生成烟花效果
  useEffect(() => {
    const createFireworks = () => {
      const newFireworks = [];
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          setFireworks(prev => [...prev, {
            id: Date.now() + i,
            x: Math.random() * 100,
            y: Math.random() * 60,
            size: 5 + Math.random() * 10,
            color: ['#3b82f6', '#22c55e', '#f97316', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 5)],
            opacity: 1,
            animationProgress: 0
          }]);
        }, i * 200);
      }
    };
    
    createFireworks();
    
    // 清理烟花效果
    const interval = setInterval(() => {
      setFireworks(prev => prev.filter(firework => {
        // 逐渐减少透明度
        if (firework.animationProgress > 0.8) {
          firework.opacity -= 0.1;
        }
        // 增加动画进度
        firework.animationProgress += 0.02;
        return firework.opacity > 0;
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleShare = () => {
    alert('分享功能即将上线！');
  };
  
  return (
    <div className="success-page">
      {/* 烟花效果 */}
      {fireworks.map(firework => (
        <div 
          key={firework.id}
          className="firework"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
            width: `${firework.size}px`,
            height: `${firework.size}px`,
            backgroundColor: firework.color,
            opacity: firework.opacity,
            transform: `scale(${firework.animationProgress})`
          }}
        />
      ))}
      
      <div className="success-container">
        <h2 className="success-title">
          <span className="success-emoji">🎉</span>
          <br />
          恭喜！任务全部完成！
        </h2>
        
        <div className="success-icon">
          <svg viewBox="0 0 120 120" width="120" height="120">
            <circle cx="60" cy="40" r="20" fill="#3b82f6" />
            <path d="M40,80 L80,80" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" />
            <path d="M45,80 L35,90" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
            <path d="M75,80 L85,90" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
            {/* 手臂 */}
            <path d="M40,55 L30,40" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
            <path d="M80,55 L90,40" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" />
          </svg>
        </div>
        
        <div className="success-stats">
          <div className="stat-item">
            <div className="stat-number">{tasks.length}</div>
            <div className="stat-label">完成任务</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">完成率</div>
          </div>
        </div>
        
        <div className="completed-tasks">
          {tasks.map(task => (
            <div key={task.id} className="mini-task-card">
              <div className="mini-task-image">
                <svg viewBox="0 0 40 30" width="40" height="30">
                  <polygon points="0,30 20,10 40,30" fill="#22c55e" />
                  <polygon points="5,30 20,15 35,30" fill="#4ade80" />
                </svg>
                <div className="completion-check">
                  <svg viewBox="0 0 20 20" width="20" height="20">
                    <circle cx="10" cy="10" r="8" fill="#22c55e" />
                    <path d="M5,10 L8,13 L15,6" stroke="white" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              </div>
              <div className="mini-task-text">{task.text}</div>
            </div>
          ))}
        </div>
        
        <div className="success-actions">
          <button 
            className="restart-button primary"
            onClick={onRestart}
          >
            重新开始
          </button>
          <button 
            className="share-button"
            onClick={handleShare}
          >
            分享成就
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;