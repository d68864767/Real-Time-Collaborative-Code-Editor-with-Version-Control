```javascript
// Import required modules
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import controllers
const authController = require('./authController');
const projectController = require('./projectController');
const editorController = require('./editorController');
const chatController = require('./chatController');

// Create express app
const app = express();

// Create server and setup socket.io
const server = http.createServer(app);
const io = socketio(server);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/collab-code-editor', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// Passport config
require('./config')(passport);

// Routes
app.use('/api/auth', authController);
app.use('/api/projects', projectController);

// Setup editor and chat with socket.io
editorController(io);
chatController(io);

// Serve static files
app.use(express.static(__dirname));

// Start server
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server started on port ${port}`));
```
