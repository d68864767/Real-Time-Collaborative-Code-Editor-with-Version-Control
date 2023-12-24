```javascript
// Import necessary modules
const socket = io();

// Initialize the code editor
document.addEventListener('DOMContentLoaded', () => {
    initEditor();
});

// Function to initialize the code editor
function initEditor() {
    // Code to initialize the code editor goes here
    // This will depend on the library you are using (e.g., CodeMirror or Monaco Editor)
    const editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        mode: 'javascript',
        theme: 'monokai'
    });

    // Listen for changes in the code editor
    editor.on('change', () => {
        const newContent = editor.getValue();
        socket.emit('codeUpdate', { projectId: 'your_project_id', fileIndex: 'your_file_index', newContent });
    });

    // Listen for changes from the server
    socket.on('codeUpdate', ({ fileIndex, newContent }) => {
        // Check if the update is for the current file
        if (fileIndex === 'your_file_index') {
            // Update the content of the editor
            const cursor = editor.getCursor();
            editor.setValue(newContent);
            editor.setCursor(cursor);
        }
    });
}

// Function to join a project
function joinProject(projectId) {
    socket.emit('join', { projectId });
}

// Function to leave a project
function leaveProject(projectId) {
    socket.emit('leave', { projectId });
}
```
