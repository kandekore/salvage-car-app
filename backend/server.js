require('dotenv').config();
const express = require('express');
// This line is now corrected
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./Routes');

const app = express();
const PORT = process.env.PORT || 5001;

const whitelist = ['http://localhost:3000', 'https://your-live-frontend-domain.com'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
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

app.listen(PORT, () => console.log(`Server is live on port ${PORT}`));