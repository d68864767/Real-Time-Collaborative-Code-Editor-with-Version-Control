```javascript
// Import required modules
const socketio = require('socket.io');
const Project = require('./projectModel');

module.exports = function(server) {
  // Setup socket.io
  const io = socketio(server);

  // On connection event
  io.on('connection', (socket) => {
    console.log('New user connected');

    // Join room event
    socket.on('join', ({ projectId }) => {
      socket.join(projectId);
    });

    // Leave room event
    socket.on('leave', ({ projectId }) => {
      socket.leave(projectId);
    });

    // Code update event
    socket.on('codeUpdate', async ({ projectId, fileIndex, newContent }) => {
      // Update the project in the database
      const project = await Project.findById(projectId);
      project.files[fileIndex].content = newContent;
      await project.save();

      // Emit the code update event to all users in the room except the sender
      socket.to(projectId).emit('codeUpdate', { fileIndex, newContent });
    });

    // Disconnect event
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
```
