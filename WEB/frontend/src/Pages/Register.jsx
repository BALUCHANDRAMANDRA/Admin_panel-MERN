import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Register.css';
import * as Yup from 'yup';

export const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const schema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await schema.validate({ username, password }, { abortEarly: false });
            await axios.post('http://localhost:5050/register', { username, password });
            alert('Registration successful!');
            navigate('/');
        } catch (err) {
            if (err.name === 'ValidationError') {
                const validationErrors = {};
                err.inner.forEach(error => {
                    validationErrors[error.path] = error.message;
                });
                setErrors(validationErrors);
            } else {
                alert('Registration failed: ' + (err.response?.data.msg || err.message));
                console.error(err);
            }
        }
    };

    return (
        <div className="register-container">
            <h2>Register Page</h2>
            <form className="register-form" onSubmit={handleSubmit}>
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
};
