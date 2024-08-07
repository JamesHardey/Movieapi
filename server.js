require('dotenv').config(); // Add this line at the top

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/MovieRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:3001', // Your frontend URL
}));
app.use(express.json());
app.use('/movies', movieRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Error handling for unhandled promises
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});