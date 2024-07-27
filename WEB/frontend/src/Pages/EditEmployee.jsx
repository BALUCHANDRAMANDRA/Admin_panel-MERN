import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../Styles/EditEmployee.css';

const EditEmployee = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        courses: [],
        image: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`http://localhost:5050/get-employee/${id}`);
                const fetchedEmployee = response.data.data;
                setEmployee({
                    ...fetchedEmployee,
                    courses: fetchedEmployee.courses, 
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch employee data');
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setEmployee((prevEmployee) => ({
                ...prevEmployee,
                courses: checked
                    ? [...prevEmployee.courses, value]
                    : prevEmployee.courses.filter((course) => course !== value),
            }));
        } else {
            setEmployee({
                ...employee,
                [name]: value,
            });
        }
    };

    const handleImageChange = (e) => {
        setEmployee({
            ...employee,
            image: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedEmployee = {
                ...employee,
                courses: employee.courses, 
            };

            const formData = new FormData();
            for (let key in updatedEmployee) {
                if (key === 'image' && updatedEmployee[key]) {
                    formData.append(key, updatedEmployee[key]);
                } else if (Array.isArray(updatedEmployee[key])) {
                    updatedEmployee[key].forEach((item, index) => {
                        formData.append(`${key}[${index}]`, item);
                    });
                } else {
                    formData.append(key, updatedEmployee[key]);
                }
            }

            await axios.put(`http://localhost:5050/update-employee/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/employee-list');
        } catch (err) {
            setError('Failed to update employee');
            console.error(err); 
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="edit-employee-container">
            <h1>Edit Employee</h1>
            <form onSubmit={handleSubmit} className="edit-employee-form">
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={employee.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={employee.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Mobile:</label>
                    <input type="text" name="mobile" value={employee.mobile} onChange={handleChange} required />
                </div>
                <div>
                    <label>Designation:</label>
                    <select name="designation" value={employee.designation} onChange={handleChange} required>
                        <option value="">Select Designation</option>
                        <option value="Hr">Hr</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div>
                <div>
                    <label>Gender:</label>
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={employee.gender === 'Male'}
                            onChange={handleChange}
                            required
                        />
                        Male
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={employee.gender === 'Female'}
                            onChange={handleChange}
                            required
                        />
                        Female
                    </label>
                </div>
                <div>
                    <label>Courses:</label>
                    <label>
                        <input
                            type="checkbox"
                            name="courses"
                            value="MCA"
                            checked={employee.courses.includes('MCA')}
                            onChange={handleChange}
                        />
                        MCA
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="courses"
                            value="BCA"
                            checked={employee.courses.includes('BCA')}
                            onChange={handleChange}
                        />
                        BCA
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="courses"
                            value="BSC"
                            checked={employee.courses.includes('BSC')}
                            onChange={handleChange}
                        />
                        BSC
                    </label>
                </div>
                <div>
                    <label>Image:</label>
                    <input type="file" name="image" onChange={handleImageChange} />
                </div>
                <button type="submit">Update Employee</button>
            </form>
        </div>
    );
};

export default EditEmployee;
