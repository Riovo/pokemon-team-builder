const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/team');

const app = express();

app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/pokemon-team-builder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
}).catch((error) => {
    console.log("MongoDB connection error: ", error);
});

app.use((req, res, next) => {
    console.log('Incoming Request:', req.method, req.url);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
