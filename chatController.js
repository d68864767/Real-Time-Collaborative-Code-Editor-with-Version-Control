```javascript
// Import required modules
const socketio = require('socket.io');
const Project = require('./projectModel');

module.exports = function(io) {
  // Create a new namespace for each project
  io.of(/^\/[a-z0-9]+$/).on('connection', function(socket) {
    const namespace = socket.nsp;

    // Listen for chat messages
    socket.on('chat message', function(msg) {
      // Save the chat message to the database
      Project.findOneAndUpdate(
        { name: namespace.name.slice(1) },
        { $push: { chat: msg } },
        { new: true },
        function(err, project) {
          if (err) {
            console.log(err);
            return;
          }

          // Broadcast the chat message to all users in the namespace
          namespace.emit('chat message', msg);
        }
      );
    });

    // Listen for users joining the chat
    socket.on('join chat', function(user) {
      // Broadcast to all users in the namespace that a user has joined the chat
      namespace.emit('join chat', user);
    });

    // Listen for users leaving the chat
    socket.on('leave chat', function(user) {
      // Broadcast to all users in the namespace that a user has left the chat
      namespace.emit('leave chat', user);
    });
  });
};
```
