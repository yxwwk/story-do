import React, { useState, useEffect, useRef } from 'react';
import FloatingBubble from '../FloatingBubble';
import SnowEffect from '../SnowEffect';
import SnowToggle from '../SnowToggle';
import '../SnowToggle.css';
import './Home.css';
import '../components/TaskCardStyles.css';
import SuccessPage from '../components/SuccessPage';
import TaskCard1 from '../components/TaskCard';
import TaskCard2 from '../components/TaskCard2';
import TaskCard3 from '../components/TaskCard3';
import TaskCard4 from '../components/TaskCard4';
import TaskCard5 from '../components/TaskCard5';
import TaskCard6 from '../components/TaskCard6';
import TaskCard7 from '../components/TaskCard7';
import TaskCard8 from '../components/TaskCard8';

const Home = () => {
  const [isSnowing, setIsSnowing] = useState(false); // 雪花状态，默认为关闭

  // 定义任务数据，只包含id、文本和完成状态，坐标将在组件内部管理
  const [tasks, setTasks] = useState([
    { id: 'aaaa', text: '背诵50个单词', isCompleted: false },
    { id: 'bbbb', text: '看一个视频', isCompleted: false },
    { id: 'cccc', text: '做一套题', isCompleted: false },
    { id: 'dddd', text: '造个句子', isCompleted: false },
    { id: 'eeee', text: '热', isCompleted: true },
    // { id: 'ccccc', text: 'ccccc', isCompleted: false },
    // { id: 'ddddd', text: 'ddddd', isCompleted: false },
    // { id: 'bbbbb', text: 'bbbbb', isCompleted: false }
  ]);

  const imgB = 'https://simg01.gaodunwangxiao.com/uploadimgs/tmp/upload/202510/22/69af8_20251022155738.png'

  // 拖拽状态管理
  const [dragState, setDragState] = useState({
    isDragging: false,
    taskId: null,
    offsetX: 0,
    offsetY: 0
  });

  // 连接线逻辑已移至各个TaskCard组件内部

  // 切换雪花效果
  const toggleSnow = () => {
    setIsSnowing(prev => !prev);
  };

  // 下雪完成时自动关闭开关
  const handleSnowComplete = () => {
    setIsSnowing(false);
  };

  // 切换任务完成状态
  const toggleTaskCompletion = (taskId, event) => {
    // 如果正在拖拽，不切换完成状态
    if (dragState.isDragging) return;

    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  // 开始拖拽
  const handleDragStart = (taskId, event) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // 计算鼠标点击位置相对于任务卡片左上角的偏移量
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    setDragState({
      isDragging: true,
      taskId,
      offsetX,
      offsetY
    });

    // 添加视觉反馈
    event.currentTarget.style.zIndex = '10';
    event.currentTarget.style.transform = 'scale(1.05)';
    event.currentTarget.style.cursor = 'grabbing';
  };

  // 拖拽中
  const handleDragMove = (event) => {
    if (!dragState.isDragging) return;

    const taskFlowEl = document.querySelector('.task-flow');
    if (!taskFlowEl) return;

    const taskFlowRect = taskFlowEl.getBoundingClientRect();

    // 计算新位置，确保任务卡片保持在task-flow容器内
    let newX = event.clientX - taskFlowRect.left - dragState.offsetX;
    let newY = event.clientY - taskFlowRect.top - dragState.offsetY;

    // 边界检查
    const cardWidth = 150;
    const cardHeight = 120;
    newX = Math.max(0, Math.min(taskFlowRect.width - cardWidth, newX));
    newY = Math.max(0, Math.min(taskFlowRect.height - cardHeight, newY));

    // 更新任务位置
    setTasks(tasks.map(task =>
      task.id === dragState.taskId
        ? { ...task, x: newX, y: newY }
        : task
    ));
  };

  // 结束拖拽
  const handleDragEnd = () => {
    if (!dragState.isDragging) return;

    // 重置拖拽状态
    setDragState({
      isDragging: false,
      taskId: null,
      offsetX: 0,
      offsetY: 0
    });

    // 恢复视觉效果
    const taskEl = document.getElementById(dragState.taskId);
    if (taskEl) {
      taskEl.style.zIndex = '';
      taskEl.style.transform = '';
      taskEl.style.cursor = 'grab';
    }
  };

  // 添加全局鼠标/触摸事件监听
  useEffect(() => {
    if (dragState.isDragging) {
      const handleMouseMove = (event) => handleDragMove(event);
      const handleMouseUp = () => handleDragEnd();
      const handleTouchMove = (event) => handleDragMove(event.touches[0]);
      const handleTouchEnd = () => handleDragEnd();

      // 添加事件监听器
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      // 清理事件监听器
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [dragState]);



  // 响应式调整任务位置
  useEffect(() => {
    // 任务位置计算已移至各个TaskCard组件内部
    // 这里保持空的useEffect以维持原有结构，但移除了位置计算逻辑
  }, []);

  // 检查是否所有任务都已完成
  const allTasksCompleted = tasks.every(task => task.isCompleted);

  // 处理重新开始功能
  const handleRestart = () => {
    setTasks(tasks.map(task => ({ ...task, isCompleted: false })));
  };

  return (
    <div className="page home-page task-flow-container">
      {/* 雪花效果组件 - 条件渲染 */}
      {isSnowing && <SnowEffect onSnowComplete={handleSnowComplete} />}

      {/* 雪花开关组件 - 只在任务未全部完成时显示 */}
      {!allTasksCompleted && <SnowToggle isSnowing={isSnowing} onToggle={toggleSnow} />}

      {/* 根据任务完成状态条件渲染 */}
      {allTasksCompleted ? (
        <SuccessPage
          tasks={tasks}
          onRestart={handleRestart}
        />
      ) : (
        <div className="task-flow">
          {/* 连接线已移至各个TaskCard组件内部渲染 */}

          {/* 渲染任务卡片 - 根据任务数量选择不同的组件 */}
          <div className="tasks" style={{
            backgroundImage: `url(${imgB})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}>
            {tasks.map((task, index) => {
              const taskCount = tasks.length;

              // 根据任务数量选择不同的组件
              if (taskCount === 2) {
                return <TaskCard2
                  key={task.id}
                  task={task}
                  index={index}
                  taskCount={taskCount}
                  dragState={dragState}
                  toggleTaskCompletion={toggleTaskCompletion}
                  handleDragStart={handleDragStart}

                />;
              } else if (taskCount === 3) {
                return <TaskCard3
                  key={task.id}
                  task={task}
                  index={index}
                  taskCount={taskCount}
                  dragState={dragState}
                  toggleTaskCompletion={toggleTaskCompletion}
                  handleDragStart={handleDragStart}

                />;
              } else if (taskCount === 4) {
                return <TaskCard4
                  key={task.id}
                  task={task}
                  index={index}
                  taskCount={taskCount}
                  dragState={dragState}
                  toggleTaskCompletion={toggleTaskCompletion}
                  handleDragStart={handleDragStart}
  
                />;
              } else if (taskCount === 5) {
                return <TaskCard5
                  key={task.id}
                  task={task}
                  index={index}
                  taskCount={taskCount}
                  dragState={dragState}
                  toggleTaskCompletion={toggleTaskCompletion}
                  handleDragStart={handleDragStart}
  
                />;
              } else if (taskCount === 6) {
                return <TaskCard6
                  key={task.id}
                  task={task}
                  index={index}
                  taskCount={taskCount}
                  dragState={dragState}
                  toggleTaskCompletion={toggleTaskCompletion}
                  handleDragStart={handleDragStart}

                />;
              } else if (taskCount === 7) {
                return <TaskCard7
                  key={task.id}
                  task={task}
                  index={index}
                  taskCount={taskCount}
                  dragState={dragState}
                  toggleTaskCompletion={toggleTaskCompletion}
                  handleDragStart={handleDragStart}

                />;
              } else if (taskCount === 8) {
                return <TaskCard8
                  key={task.id}
                  task={task}
                  index={index}
                  taskCount={taskCount}
                  dragState={dragState}
                  toggleTaskCompletion={toggleTaskCompletion}
                  handleDragStart={handleDragStart}

                />;
              } else {
                // 默认使用TaskCard1（原TaskCard）
                return <div
                  key={task.id}
                  id={task.id}
                  className={`task-card ${task.isCompleted ? 'task-completed' : ''} ${dragState.isDragging && dragState.taskId === task.id ? 'dragging' : ''}`}
                  style={{
                    left: `${100 + index * 200}px`,
                    top: `${100 + (index % 2) * 150}px`,
                    cursor: dragState.isDragging && dragState.taskId === task.id ? 'grabbing' : 'grab'
                  }}
                  onClick={(event) => toggleTaskCompletion(task.id, event)}
                  onMouseDown={(event) => handleDragStart(task.id, event)}
                  onTouchStart={(event) => handleDragStart(task.id, event.touches[0])}
                >
                  <div className="task-image">
                    <div className="mountain-icon">
                      <svg viewBox="0 0 40 30" width="40" height="30">
                        <polygon points="0,30 20,10 40,30" fill="#3b82f6" />
                        <polygon points="5,30 20,15 35,30" fill="#60a5fa" />
                      </svg>
                      {task.isCompleted && (
                        <div className="completion-check">
                          <svg viewBox="0 0 20 20" width="20" height="20">
                            <circle cx="10" cy="10" r="8" fill="#22c55e" />
                            <path d="M5,10 L8,13 L15,6" stroke="white" strokeWidth="2" fill="none" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="task-text">{task.text}</div>
                </div>;
              }
            })}
          </div>
        </div>
      )}

      {!allTasksCompleted && <FloatingBubble />}
    </div>
  );
};

export default Home;