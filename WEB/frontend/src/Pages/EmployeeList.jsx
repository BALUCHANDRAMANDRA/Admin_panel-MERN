import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/EmployeeList.css'; 

export const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:5050/get-employees');
                setEmployees(response.data.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch employee data');
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const deleteEmployee = async (id) => {
        try {
            await axios.delete(`http://localhost:5050/delete-employee/${id}`);
            setEmployees(employees.filter(employee => employee._id !== id));
        } catch (err) {
            setError('Failed to delete employee');
        }
    };

    const editEmployee = (id) => {
        navigate(`/edit-employee/${id}`);
    };

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="employee-list-container">
            <h1>Employee List</h1>
            <p>Total Employees: {filteredEmployees.length}</p>
            <input
                type="text"
                placeholder="Enter search keyword"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="search-input"
            />
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Designation</th>
                        <th>Gender</th>
                        <th>Courses</th>
                        <th>Created Date</th> 
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map((employee) => (
                        <tr key={employee._id}>
                            <td>
                                {employee.image && (
                                    <img
                                        src={`http://localhost:5050/uploads/${employee.image}`}
                                        alt="Employee"
                                        className="employee-image"
                                    />
                                )}
                            </td>
                            <td>{employee.name}</td>
                            <td className="email-highlight">{employee.email}</td>
                            <td>{employee.mobile}</td>
                            <td>{employee.designation}</td>
                            <td>{employee.gender}</td>
                            <td>{employee.courses.join(', ')}</td>
                            <td>{new Date(employee.createdAt).toLocaleDateString()}</td> 
                            <td>
                                <button className="edit-button" onClick={() => editEmployee(employee._id)}>Edit</button>
                                <button className="delete-button" onClick={() => deleteEmployee(employee._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
