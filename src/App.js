import './App.css';
import FloatingBubble from './FloatingBubble';
import logo1 from './img/1.png'; // 导入logo作为示例图片
import logo2 from './img/2.png'; // 导入logo作为示例图片
import avatar from './img/avatar.png'; // 导入头像作为另一个示例图片
import { useState } from 'react';

function App() {
  // 定义带图片、时间和完成状态的待办事项列表
  const [todos, setTodos] = useState([
    { 
      id: 1, 
      text: '背诵10个单词', 
      image: logo1,
      time: '10:00 AM',
      isCompleted: true // 已完成
    },
    { 
      id: 2, 
      text: '阅读一篇英文文章', 
      image: avatar,
      time: '12:30 PM',
      isCompleted: false // 未完成
    },
    { 
      id: 3, 
      text: '看一个视频', 
      image: logo2,
      time: '3:45 PM',
      isCompleted: false // 未完成
    }
  ]);
  
  // 切换任务完成状态
  const toggleTodoStatus = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    ));
  };

  // 格式化日期显示
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* 添加标题和日期 */}
        <h1 className="app-title">我的待办事项</h1>
        <p className="app-date">{formatDate()}</p>
        
        <div className="todo-card-container">
          {todos.map(todo => (
            <div 
              key={todo.id} 
              className={`todo-card ${todo.isCompleted ? 'todo-completed' : 'todo-pending'}`}
              onClick={() => toggleTodoStatus(todo.id)}
            >
              <div className="todo-card-header">
                <span className="todo-card-number">任务 {todo.id}</span>
                <span className={`todo-status ${todo.isCompleted ? 'status-completed' : 'status-pending'}`}>
                  {todo.isCompleted ? '已完成' : '未完成'}
                </span>
              </div>
              <div className="todo-card-content">
                {todo.image && (
                  <img 
                    src={todo.image} 
                    alt={`Todo ${todo.id}`} 
                    className={`todo-image ${todo.isCompleted ? 'image-completed' : ''}`}
                  />
                )}
                <p className={`todo-text ${todo.isCompleted ? 'text-completed' : ''}`}>{todo.text}</p>
              </div>
              {/* 添加卡片底部时间 */}
              <div className="todo-card-footer">
                <span className="todo-card-time">{todo.time}</span>
              </div>
            </div>
          ))}
        </div>
      </header>
      <FloatingBubble />
    </div>
  );
}

export default App;
