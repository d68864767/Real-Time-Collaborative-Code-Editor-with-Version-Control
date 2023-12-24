```javascript
// Import required modules
const mongoose = require('mongoose');
const { dbConfig } = require('./config');

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('MongoDB is connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
```
