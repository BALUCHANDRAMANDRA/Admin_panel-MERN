import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './Pages/home';
import { Login } from './Pages/Login';
import Layout from './Components/Layout'; 
import {CreateEmployee} from './Pages/CreateEmployee';
import { EmployeeList} from './Pages/EmployeeList';
import { Register } from './Pages/Register';
import EditEmployee from './Pages/EditEmployee';


function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                     <Route path='/register' element={<Register />} />
                    <Route path="/" element={<Login />} />
                    <Route element={<Layout />}> 
                        <Route path="/home" element={<Home />} />
                        <Route path="/create-employee" element={<CreateEmployee />} />
                        <Route path="/employee-list/" element={<EmployeeList />} />
                    </Route>
                    <Route path="/edit-employee/:id" element={<EditEmployee />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
