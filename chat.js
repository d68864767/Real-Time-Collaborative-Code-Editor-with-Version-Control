```javascript
// Import necessary modules
const socket = io();

// Function to send a chat message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    // Check if the message is not empty
    if (message) {
        // Emit the 'chat message' event
        socket.emit('chat message', {
            sender: socket.id,
            message: message
        });

        // Clear the input field
        messageInput.value = '';
    }
}

// Function to add a chat message to the chat box
function addMessageToChatBox(message) {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('p');

    // Set the text of the message element
    messageElement.textContent = `${message.sender}: ${message.message}`;

    // Add the message element to the chat box
    chatBox.appendChild(messageElement);
}

// Listen for the 'chat message' event
socket.on('chat message', function(message) {
    // Add the received message to the chat box
    addMessageToChatBox(message);
});

// Listen for the 'join chat' event
socket.on('join chat', function(user) {
    // Add a message to the chat box indicating that the user has joined the chat
    addMessageToChatBox({ sender: 'System', message: `${user} has joined the chat.` });
});

// Listen for the 'leave chat' event
socket.on('leave chat', function(user) {
    // Add a message to the chat box indicating that the user has left the chat
    addMessageToChatBox({ sender: 'System', message: `${user} has left the chat.` });
});

// Add event listener to the send button
document.getElementById('sendButton').addEventListener('click', sendMessage);

// Add event listener to the message input field to send a message when the Enter key is pressed
document.getElementById('messageInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
```
