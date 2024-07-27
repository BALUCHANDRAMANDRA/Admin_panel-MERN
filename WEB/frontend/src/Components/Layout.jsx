import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../Styles/Home.css';

const Layout = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/';
    };

    return (
        <div className="layout-container">
            <header className="header">
                <div className="navbar">
                    <Link to="/home" className="nav-link">Home</Link>
                    <Link to="/create-employee" className="nav-link">Create Employee</Link>
                    <Link to="/employee-list" className="nav-link">Employee List</Link>
                </div>
                <div className="header-right">
                    <span className="username">{localStorage.getItem('username')}</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
