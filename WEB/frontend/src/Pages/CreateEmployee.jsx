import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/CreateEmployee.css';

export const CreateEmployee = () => {
    const [employeeData, setEmployeeData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        courses: [], 
        image: null
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            let newCourses = [...employeeData.courses];
            if (checked) {
                newCourses.push(value);
            } else {
                newCourses = newCourses.filter(course => course !== value);
            }
            setEmployeeData({
                ...employeeData,
                courses: newCourses
            });
        } else if (type === 'file') {
            setEmployeeData({
                ...employeeData,
                [name]: e.target.files[0]
            });
        } else {
            setEmployeeData({
                ...employeeData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            for (let key in employeeData) {
                if (Array.isArray(employeeData[key])) {
                    employeeData[key].forEach((value) => {
                        formData.append(key, value);
                    });
                } else {
                    formData.append(key, employeeData[key]);
                }
            }

            const res = await axios.post('http://localhost:5050/create-employee', formData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(res.data.msg);
    
            setEmployeeData({
                name: '',
                email: '',
                mobile: '',
                designation: '',
                gender: '',
                courses: [],
                image: null
            });
        } catch (err) {
            setMessage('Failed to create employee');
            console.error(err);
        }
    };

    return (
        <div className="create-employee-container">
            <h2>Create Employee</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>
                    Name:
                    <input type="text" name="name" value={employeeData.name} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={employeeData.email} onChange={handleChange} required />
                </label>
                <label>
                    Mobile:
                    <input type="number" name="mobile" value={employeeData.mobile} onChange={handleChange} required />
                </label>
                <label>
                    Designation:
                    <select name="designation" value={employeeData.designation} onChange={handleChange} required>
                        <option value="">Select a designation</option>
                        <option value="hr">HR</option>
                        <option value="manager">Manager</option>
                        <option value="sales">Sales</option>
                    </select>
                </label>
                <label>
                    Gender:
                    <div>
                        <input type="radio" name="gender" value="Male" checked={employeeData.gender === 'Male'} onChange={handleChange} required />
                        Male
                    </div>
                    <div>
                        <input type="radio" name="gender" value="Female" checked={employeeData.gender === 'Female'} onChange={handleChange} required />
                        Female
                    </div>
                </label>
                <label>
                    Courses:
                    <div>
                        <input type="checkbox" name="courses" value="MCA" checked={employeeData.courses.includes('MCA')} onChange={handleChange} />
                        MCA
                    </div>
                    <div>
                        <input type="checkbox" name="courses" value="BCA" checked={employeeData.courses.includes('BCA')} onChange={handleChange} />
                        BCA
                    </div>
                    <div>
                        <input type="checkbox" name="courses" value="BSC" checked={employeeData.courses.includes('BSC')} onChange={handleChange} />
                        BSC
                    </div>
                </label>
                <label>
                    Image:
                    <input type="file" name="image" accept=".jpg,.png" onChange={handleChange} required />
                </label>
                <button type="submit">Create Employee</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};
