const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const recommendationRouter = require('./routes/recommendations');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/recommendations', recommendationRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 