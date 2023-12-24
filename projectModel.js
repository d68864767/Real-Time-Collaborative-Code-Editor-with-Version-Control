```javascript
// Import required modules
const mongoose = require('mongoose');

// Define the Project schema
const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  files: [{
    name: {
      type: String,
      required: true
    },
    content: {
      type: String,
      default: ''
    }
  }],
  chat: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

// Create the Project model
const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
```
