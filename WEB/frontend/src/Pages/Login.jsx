import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Login.css';
import * as Yup from 'yup';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, [navigate]);

    const schema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await schema.validate({ username, password }, { abortEarly: false });
            const res = await axios.post('http://localhost:5050/login', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/home');
        } catch (err) {
            if (err.name === 'ValidationError') {
                const validationErrors = {};
                err.inner.forEach(error => {
                    validationErrors[error.path] = error.message;
                });
                setErrors(validationErrors);
            } else {
                console.error(err);
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login Page</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label>
                    <span>Username</span>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && <div className="error">{errors.username}</div>}
                </label>
                <label>
                    <span>Password</span>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
                </label>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
};
