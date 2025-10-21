import React from 'react';
import { Link } from 'react-router-dom';
import '../components/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          故事应用
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">首页</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">关于我们</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">联系我们</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;