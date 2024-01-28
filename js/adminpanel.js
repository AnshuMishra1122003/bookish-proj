import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js';

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

// Function to fetch users from Firebase Realtime Database
function fetchUsers() {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = ''; // Clear existing content

    // Assuming your users are stored in a "users" node
    const usersRef = ref(database, 'users');

    onValue(usersRef, (snapshot) => {
        snapshot.forEach((userSnapshot) => {
            const userId = userSnapshot.key;
            const userData = userSnapshot.val();

            const username = userData.username;
            const email = userData.email;

            // Create a table row for each user
           
            const row = document.createElement('tr');

            // Create the table cells
            //Changes made by Saurabh (used createElement to call functions instead of innerhtml)
            const cellUserId = document.createElement('td');
            cellUserId.textContent = userId;
            
            const cellUsername = document.createElement('td');
            cellUsername.textContent = userData.username;
            
            const cellEmail = document.createElement('td');
            cellEmail.textContent = userData.email;
            
            const cellActions = document.createElement('td');
            
           
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', function() {
                editUser(userId);
            });
            
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', function() {
                deleteUser(userId);
            });
            
            
            cellActions.appendChild(editButton);
            cellActions.appendChild(deleteButton);
            
            
            row.appendChild(cellUserId);
            row.appendChild(cellUsername);
            row.appendChild(cellEmail);
            row.appendChild(cellActions);
            //Changes made by saurabh ENDS HERE!
            userTableBody.appendChild(row);
        });
    });
}
const usersSection = document.getElementById('usersSubMenu');

// Function to search users based on input
function searchUsers() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = ''; // Clear existing content

    const usersRef = ref(database,'users'); // Adjust 'users' to your actual Firebase node
    onValue(usersRef, (snapshot) => {
        snapshot.forEach((userSnapshot) => {
            const userId = userSnapshot.key;
            const userData = userSnapshot.val();

            const username = userData.username.toLowerCase();
            const email = userData.email.toLowerCase();

            if (username.includes(searchInput) || email.includes(searchInput)) {
                const row = document.createElement('tr');

                // Create the table cells
                //Changes made by Saurabh (used createElement to call functions instead of innerhtml)
                const cellUserId = document.createElement('td');
                cellUserId.textContent = userId;
                
                const cellUsername = document.createElement('td');
                cellUsername.textContent = userData.username;
                
                const cellEmail = document.createElement('td');
                cellEmail.textContent = userData.email;
                
                const cellActions = document.createElement('td');
                
               
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', function() {
                    editUser(userId);
                });
                
                
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', function() {
                    deleteUser(userId);
                });
                
                userTableBody.appendChild(row);
            }
        });
    });
    fetchUsers();
}

// Function to edit user details
function editUser(userId) {
    // Get the updated user details from the admin
    const newName = prompt('Enter the new name:');
    const newEmail = prompt('Enter the new email:');

    if (newName !== null && newEmail !== null) {
        // Assuming your users are stored in a "users" node
        const userRef = ref(database, `users/${userId}`);

        // Update the user details in the Firebase Realtime Database
        userRef.update({
            username: newName,
            email: newEmail
        });

        // Fetch updated users to refresh the table
        fetchUsers();
    }
}

// Function to delete user
function deleteUser(userId) {
    // Implement delete user functionality using userId
    alert('Delete user with ID ' + userId);
}

// Fetch users on page load
fetchUsers();


// import { db } from "./firebaseConfig.mjs";
// import { ref, onValue } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js';


// // Function to fetch users from Firebase Realtime Database
// function fetchUsers() {
//     const userTableBody = document.getElementById('userTableBody');
//     userTableBody.innerHTML = ''; // Clear existing content

//     // Assuming your users are stored in a "users" node
//     const usersRef = ref(db, 'users');

//     onValue(usersRef, (snapshot) => {
//         snapshot.forEach((userSnapshot) => {
//             const userId = userSnapshot.key;
//             const userData = userSnapshot.val();

//             const username = userData.username;
//             const email = userData.email;

//             // Create a table row for each user
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${userId}</td>
//                 <td>${userData.username}</td>
//                 <td>${userData.email}</td>
//                 <td>
//                     <button onclick="editUser('${userId}')">Edit</button>
//                     <button onclick="deleteUser('${userId}')">Delete</button>
//                 </td>
//             `;

//             userTableBody.appendChild(row);
//         });
//     });
// }
// const usersSection = document.getElementById('usersSubMenu');

// // Function to search users based on input
// function searchUsers() {
//     const searchInput = document.getElementById('searchInput').value.toLowerCase();
//     const userTableBody = document.getElementById('userTableBody');
//     userTableBody.innerHTML = ''; // Clear existing content

//     const usersRef = ref(db,'users'); // Adjust 'users' to your actual Firebase node
//     onValue(usersRef, (snapshot) => {
//         snapshot.forEach((userSnapshot) => {
//             const userId = userSnapshot.key;
//             const userData = userSnapshot.val();

//             const username = userData.username.toLowerCase();
//             const email = userData.email.toLowerCase();

//             if (username.includes(searchInput) || email.includes(searchInput)) {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//           <td>${userId}</td>
//           <td>${userData.name}</td>
//           <td>${userData.email}</td>
//           <td>
//             <button id="edituser-btn">Edit</button>
//             <button onclick="deleteUser('${userId}')">Delete</button>
//           </td>
//         `;
//                 userTableBody.appendChild(row);
//             }
//             console.log(typeof('${userId}'));
//             document.getElementById("edituser-btn").addEventListener("click", editUser('${userId}'));
//         });
//         function editUser(userId) {
//             console.log('This funtion is called')
//             // Get the updated user details from the admin
//             const newName = prompt('Enter the new name:');
//             const newEmail = prompt('Enter the new email:');
        
//             if (newName !== null && newEmail !== null) {
//                 // Assuming your users are stored in a "users" node
//                 const userRef = ref(db,'users/${userId}');
        
//                 // Update the user details in the Firebase Realtime Database
//                 userRef.update({
//                     username: newName,
//                     email: newEmail
//                 });
        
//                 // Fetch updated users to refresh the table
//                 fetchUsers();
//             }
//         }
//     });
//     fetchUsers();
// }

// // Function to edit user details

// // Function to delete user
// function deleteUser(userId) {
//     // Implement delete user functionality using userId
//     alert('Delete user with ID ' + userId);
// }

// // Fetch users on page load
// fetchUsers();