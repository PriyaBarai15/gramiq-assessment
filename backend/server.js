const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const weatherRoutes = require('./routes/weather');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log('Mongo connected'))
    .catch(err => console.error('Mongo connect error', err));
}

app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
