require('dotenv').config();
const express = require('express');
// This line is now corrected
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./Routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: "Hello! The backend server is running correctly." });
});

app.use('/api', routes);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('CRITICAL MONGO ERROR:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is live on port ${PORT}`));