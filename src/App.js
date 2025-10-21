import { Outlet } from 'react-router-dom';
import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Outlet将渲染当前路由匹配的子组件 */}
        <Outlet />
      </header>
    </div>
  );
}

export default App;
