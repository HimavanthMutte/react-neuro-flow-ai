require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

const users_list = [];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = decoded;
    next();
  });
};

app.post('/api/register', async (req, res)=>{
  try{
    const {username, email, password} = req.body;
    if(!username || !email || !password){
      return res.status(400).json({message: "Enter all the details correctly"});
    }

    const checkUser = users_list.find(u => u.username === username);
    if(checkUser){
      res.status(401).json({message: "Username already existed."});
    }
    const checkEmail = users_list.find(u => u.email === email);
    if(checkEmail){
      res.status(401).json({message: "Email already existed."});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const new_user = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword
    };
    users_list.push(new_user);
    return res.status(201).json({message: "User has created."});
    
  }catch(e){
    return res.status(500).json({message : "Internal server error."});
  }

});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    // const user = {"email": "test@user.com", "password": "testuser"}
    const user = users_list.find(u=>u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    // const isMatch = password === user.password;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password.' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});