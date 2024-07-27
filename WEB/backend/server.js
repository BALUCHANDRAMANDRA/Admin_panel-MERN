const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const User = require('./modules/User');
const Employee = require('./modules/empolyee'); 

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

mongoose.connect('mongodb://127.0.0.1:27017/Web')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const JWT_SECRET = 'your_jwt_secret_key'; 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });


app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(200).json({
            success: true,
            msg: "User registration successful"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            token,
            data: {
                userId: user.id,
                username: user.username
            },
            msg: "Login successful"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.get('/get-user', async (req, res) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ msg: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }
        res.status(200).json({
            success: true,
            data: {
                userId: user.id,
                username: user.username,
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.post('/create-employee', upload.single('image'), async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, courses } = req.body;
        const image = req.file ? req.file.filename : '';
        
      
        const token = req.headers['authorization'];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const newEmployee = new Employee({
            userId,
            name,
            email,
            mobile,
            designation,
            gender,
            courses: Array.isArray(courses) ? courses : [courses], 
            image
        });

        await newEmployee.save();
        res.status(200).json({ success: true, msg: "Employee created successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.get('/get-employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        
        if (!employees) {
            return res.status(404).json({ success: false, msg: 'No employees found' });
        }

        res.status(200).json({ success: true, data: employees });
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});

app.get('/get-employee/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, msg: 'Invalid employee ID' });
        }

        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ success: false, msg: 'Employee not found' });
        }

        res.status(200).json({ success: true, data: employee });
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});




app.put('/update-employee/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, mobile, designation, gender, courses } = req.body;

        const updatedEmployee = {
            name,
            email,
            mobile,
            designation,
            gender,
            courses: Array.isArray(courses) ? courses : courses.split(',').map(course => course.trim())
        };

        if (req.file) {
            updatedEmployee.image = req.file.filename;
        }

        const employee = await Employee.findByIdAndUpdate(
            id,
            updatedEmployee,
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({ success: false, msg: 'Employee not found' });
        }

        res.status(200).json({ success: true, data: employee });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.delete('/delete-employee/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ success: false, msg: 'Employee not found' });
        }

        res.status(200).json({ success: true, msg: 'Employee deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



app.listen(5050, () => {
    console.log("Server is running on port 5050");
});
