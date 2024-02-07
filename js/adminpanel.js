import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getDatabase, ref, set, get, remove } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyCiNLLV_8GXpvSD7IeVUfp4dbq-_pcvn7w",
    authDomain: "bookish-proj.firebaseapp.com",
    databaseURL: "https://bookish-proj-default-rtdb.firebaseio.com",
    projectId: "bookish-proj",
    storageBucket: "bookish-proj.appspot.com",
    messagingSenderId: "351432216616",
    appId: "1:351432216616:web:59c46450f373a82ad9251d",
    measurementId: "G-DH4RJ9TML1"
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

function fetchUsers() {
    const userTableBody = document.getElementById('userTableBody');
    // Clear existing content
    while (userTableBody.firstChild) {
        userTableBody.removeChild(userTableBody.firstChild);
    }

    // Assuming your users are stored in a "users" node
    const usersRef = ref(database, 'users');

    get(usersRef).then((snapshot) => {
        let serialNumber = 1; // Initialize serial number

        snapshot.forEach((userSnapshot) => {
            const userData = userSnapshot.val();

            const username = userData.username;
            const email = userData.email;

            // Create a table row for each user
            const row = document.createElement('tr');

            // Create the table cells
            const cellSerialNumber = document.createElement('td');
            cellSerialNumber.textContent = serialNumber++;

            const cellUsername = document.createElement('td');
            cellUsername.textContent = username;

            const cellEmail = document.createElement('td');
            cellEmail.textContent = email;

            const cellActions = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', function () {
                editUser(userSnapshot.key);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function () {
                deleteUser(userSnapshot.key);
            });

            cellActions.appendChild(editButton);
            cellActions.appendChild(deleteButton);

            row.appendChild(cellSerialNumber);
            row.appendChild(cellUsername);
            row.appendChild(cellEmail);
            row.appendChild(cellActions);

            // Append row to table body
            userTableBody.appendChild(row);
        });
    });
}

function searchUsers() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const userTableBody = document.getElementById('userTableBody');

    const usersRef = ref(database, `users`);
    get(usersRef).then((snapshot) => {
        userTableBody.innerHTML = ''; // Clear existing content

        snapshot.forEach((userSnapshot) => {
            const userId = userSnapshot.key;
            const userData = userSnapshot.val();
            const username = userData.username.toLowerCase();

            const row = document.createElement('tr');
            const cellUserId = document.createElement('td');
            cellUserId.textContent = userId;

            const cellUsername = document.createElement('td');
            cellUsername.textContent = userData.username;

            const cellEmail = document.createElement('td');
            cellEmail.textContent = userData.email;

            const cellActions = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', function () {
                editUser(userId);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function () {
                deleteUser(userId);
            });

            cellActions.appendChild(editButton);
            cellActions.appendChild(deleteButton);

            row.appendChild(cellUserId);
            row.appendChild(cellUsername);
            row.appendChild(cellEmail);
            row.appendChild(cellActions);

            if (username.includes(searchInput)) {
                userTableBody.appendChild(row);
            }
        });
    });
}

// Attach the searchUsers function to the input event
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', searchUsers);


function editUser(userId) {
    // Assuming your users are stored in a "users" node
    const userRef = ref(database, `users/${userId}`);

    // Fetch the existing user data using get
    get(userRef)
        .then((snapshot) => {
            const userData = snapshot.val();

            // Get the updated user details from the admin
            const newName = prompt('Enter the new name:', userData.username);
            const newEmail = prompt('Enter the new email:', userData.email);

            // Create an object to store updated fields
            const updatedFields = {};

            // Update only the specified fields
            if (newName !== null && newName !== '') {
                updatedFields.username = newName;
            } else {
                // Keep the existing value if not provided
                updatedFields.username = userData.username;
            }

            if (newEmail !== null && newEmail !== '') {
                updatedFields.email = newEmail;
            } else {
                // Keep the existing value if not provided
                updatedFields.email = userData.email;
            }

            // Update the user details in the Firebase Realtime Database
            set(userRef, updatedFields);

            // Fetch updated users to refresh the table
            fetchUsers();
        })
        .catch((error) => {
            console.error('Error fetching user data:', error.message);
            // Handle the error if needed
        });
}

// Function to delete user
function deleteUser(userId) {
    // Assuming your users are stored in a "users" node
    const userRef = ref(database, `users/${userId}`);

    // Fetch the user data for confirmation
    get(userRef)
        .then((snapshot) => {
            const userData = snapshot.val();

            // Confirm deletion with the admin
            const confirmation = confirm('Are you sure you want to delete the user?\n\nUser ID: ${userId}\nUsername: ${userData.username}\nEmail: ${userData.email}');

            if (confirmation) {
                // Perform the deletion if confirmed
                remove(userRef)
                    .then(() => {
                        // Successfully removed user, now fetch updated users to refresh the table
                        fetchUsers();
                    })
                    .catch((error) => {
                        console.error('Error removing user:', error.message);
                        // Handle the error if needed
                    });
            }
        })
        .catch((error) => {
            console.error('Error fetching user data for deletion:', error.message);
            // Handle the error if needed
        });
}

// Fetch users on page load
fetchUsers();

// document
//   .getElementById("searchInput")
//   .addEventListener("click", function (event) {
//     searchUsers();
//   });
