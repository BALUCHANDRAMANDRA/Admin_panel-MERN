import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Home.css';

export const Home = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token'); 

        if (!token) {
            navigate('/'); 
            return;
        }

        axios.get('http://localhost:5050/get-user', {
            headers: { 'Authorization': token } 
        })
        .then(res => {
            setName(res.data.data.username);
        })
        .catch(err => {
            console.error(err);
            navigate('/'); 
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="home-container">
            <header className="header">
                <div className="navbar">
                    <a href="/home" className="nav-link">Home</a>
                    <a href="/create-empolyee" className="nav-link">Create Empolyee</a>
                    <a href="/employee-list" className="nav-link">Employee List</a>
                </div>
                <div className="header-right">
                    <span className="username">{name}</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>
            <div className="dash-bord">DashBoard</div>
            <main className="main-content">
                <h2>Welcome Admin panel</h2>
        
            </main>
        </div>
    );
};
