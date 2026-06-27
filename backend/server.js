require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const apiRoutes = require('./routes/api');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/api', apiRoutes);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Wallpaper Backend is running!' });
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
