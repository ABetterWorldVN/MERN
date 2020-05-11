const express = require('express');
const app = express();
const connectDB = require('./config/db');

//Connect mongoDB
connectDB();

// Inital middleware
app.use(express.json({ extended: false }));

// Simple path API
app.get('/', (req, res) => res.send('Get API is running'));

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

// app.all('/', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With');
//   next();
// });

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} !!!`);
});
