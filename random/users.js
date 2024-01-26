import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
            apiKey: "AIzaSyCiNLLV_8GXpvSD7IeVUfp4dbq-_pcvn7w",
            authDomain: "bookish-proj.firebaseapp.com",
            databaseURL: "https://bookish-proj-default-rtdb.firebaseio.com",
            projectId: "bookish-proj",
            storageBucket: "bookish-proj.appspot.com",
            messagingSenderId: "351432216616",
            appId: "1:351432216616:web:59c46450f373a82ad9251d",
            measurementId: "G-DH4RJ9TML1"
        };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to display all registered users
function displayUsers() {
  const usersContainer = document.getElementById("usersContainer");

  // Assume 'users' is the node where your users are stored in Firebase
  const usersRef = ref(db, 'users');

  onValue(usersRef, (snapshot) => {
    usersContainer.innerHTML = ''; // Clear previous content

    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val();
      const userKey = childSnapshot.key;

      // Create user list element
      const userElement = createUserElement(userData, userKey);
      usersContainer.appendChild(userElement);
    });
  });
}

// Function to create a user list element
function createUserElement(userData, userKey) {
    const userElement = document.createElement('div');
    userElement.classList.add('user');
  
    // Display user details
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('user-details');
  
    const username = document.createElement('div');
    username.classList.add('username');
    username.textContent = 'Username: ' + userData.username;
    detailsContainer.appendChild(username);
  
    const email = document.createElement('div');
    email.classList.add('email');
    email.textContent = 'Email: ' + userData.email;
    detailsContainer.appendChild(email);
  
    const password = document.createElement('div');
    password.classList.add('password');
    password.textContent = 'Password: ' + userData.password;
    detailsContainer.appendChild(password);
  
    userElement.appendChild(detailsContainer);
  
    // Action buttons
    const actionButtons = document.createElement('div');
    actionButtons.classList.add('action-buttons');
  
    // Button to delete user
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteUser(userKey));
    actionButtons.appendChild(deleteButton);
  
    // Button to block user
    const blockButton = document.createElement('button');
    blockButton.textContent = 'Block';
    blockButton.addEventListener('click', () => blockUser(userKey));
    actionButtons.appendChild(blockButton);
  
    userElement.appendChild(actionButtons);
  
    // Border line
    const borderLine = document.createElement('div');
    borderLine.classList.add('border-line');
    userElement.appendChild(borderLine);
  
    return userElement;
  }
  
  // Function to delete a user
  function deleteUser(userKey) {
    // Implement user deletion logic here
    console.log('Deleting user with key:', userKey);
  }
  
  // Function to block a user
  function blockUser(userKey) {
    // Implement user blocking logic here
    console.log('Blocking user with key:', userKey);
  }

// Call the displayUsers function when the page loads
document.addEventListener('DOMContentLoaded', () => {
  displayUsers();
});
