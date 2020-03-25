const mongoose = require('mongoose');
const config = require('config');
const dbUri = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('Mongoose connected!');
  } catch (err) {
    console.error(err.message);
    // Exit with failure
    process.exit(1);
  }
};

module.exports = connectDB;
