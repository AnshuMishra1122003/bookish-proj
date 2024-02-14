import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getDatabase, ref, set, get, remove } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js';

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
const auth = getAuth(firebaseApp);

// Function to fetch users from Firebase Realtime Database
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

            const enableButton = document.createElement('button');
            enableButton.textContent = 'Enable';
            enableButton.style.display = userData.disabled ? 'inline-block' : 'none';
            enableButton.addEventListener('click', function () {
                enableUser(userSnapshot.key);
            });


            const disableButton = document.createElement('button');
            disableButton.textContent = 'Disable';
            disableButton.style.display = userData.disabled ? 'none' : 'inline-block';
            disableButton.addEventListener('click', function () {
                disableUser(userSnapshot.key);
            });


            cellActions.appendChild(editButton);
            cellActions.appendChild(deleteButton);
            cellActions.appendChild(enableButton);
            cellActions.appendChild(disableButton);

            row.appendChild(cellSerialNumber);
            row.appendChild(cellUsername);
            row.appendChild(cellEmail);
            row.appendChild(cellActions);

            // Append row to table body
            userTableBody.appendChild(row);
        });
    });
}

fetchUsers();


function searchUsers() {
    const searchInput = document.getElementById('searchInput');
    const userTableBody = document.getElementById('userTableBody');
    const searchTerm = searchInput.value.toLowerCase();

    while (userTableBody.firstChild) {
        userTableBody.removeChild(userTableBody.firstChild);
    }

    const usersRef = ref(database, 'users');
    get(usersRef).then((snapshot) => {
        let serialNumber = 1; // Initialize serial number

        snapshot.forEach((userSnapshot) => {
            const userData = userSnapshot.val();
            const username = userData.username.toLowerCase();
            const email = userData.email.toLowerCase();

            if (username.includes(searchTerm) || email.includes(searchTerm)) {
                // Create table row
                const row = document.createElement('tr');

                // Create and append table cells
                const cellSerialNumber = document.createElement('td');
                cellSerialNumber.textContent = serialNumber++;

                const cellUsername = document.createElement('td');
                cellUsername.textContent = userData.username;
                row.appendChild(cellUsername);

                const cellEmail = document.createElement('td');
                cellEmail.textContent = userData.email;
                row.appendChild(cellEmail);

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

                const enableButton = document.createElement('button');
                enableButton.textContent = 'Enable';
                enableButton.style.display = userData.disabled ? 'inline-block' : 'none';
                enableButton.addEventListener('click', function () {
                    enableUser(userSnapshot.key);
                });


                const disableButton = document.createElement('button');
                disableButton.textContent = 'Disable';
                disableButton.style.display = userData.disabled ? 'none' : 'inline-block';
                disableButton.addEventListener('click', function () {
                    disableUser(userSnapshot.key);
                });

                cellActions.appendChild(editButton);
                cellActions.appendChild(deleteButton);
                cellActions.appendChild(enableButton);
                cellActions.appendChild(disableButton);

                row.appendChild(cellSerialNumber);
                row.appendChild(cellUsername);
                row.appendChild(cellEmail);
                row.appendChild(cellActions);

                // Append row to table body
                userTableBody.appendChild(row);
            }
        });
    });
}


// Attach the searchUsers function to the input event
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
            const confirmation = confirm(`Are you sure you want to delete the user?\n\nUser ID: ${userId}\nUsername: ${userData.username}\nEmail: ${userData.email}`);

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

// Function to disable user
function disableUser(userId) {
    const userRef = ref(database, `users/${userId}`);
    // Fetch the existing user data
    get(userRef)
        .then((snapshot) => {
            const userData = snapshot.val();
            userData.disabled = true; // Set disabled property to true for disabling user

            // Update user data in the database
            set(userRef, userData)
                .then(() => {
                    console.log('User disabled successfully');
                    alert('User has been disabled successfully.');

                    // Check if the user is currently logged in
                    const currentUser = getCurrentUser();
                    if (currentUser && currentUser.uid === userId) {
                        // If the disabled user is currently logged in, sign them out
                        signOutUser();
                    }

                    // Refresh user table
                    fetchUsers();
                })
                .catch((error) => {
                    console.error('Error disabling user:', error.message);
                    alert('Failed to disable user. Please try again.');
                });
        })
        .catch((error) => {
            console.error('Error fetching user data:', error.message);
            alert('Failed to fetch user data. Please try again.');
        });
}

// Function to enable user
function enableUser(userId) {
    const userRef = ref(database, `users/${userId}`);
    // Fetch the existing user data
    get(userRef)
        .then((snapshot) => {
            const userData = snapshot.val();
            userData.disabled = false; // Set disabled property to false for enabling user

            // Update user data in the database
            set(userRef, userData)
                .then(() => {
                    console.log('User enabled successfully');
                    alert('User has been enabled successfully.');

                    // Refresh user table
                    fetchUsers();
                })
                .catch((error) => {
                    console.error('Error enabling user:', error.message);
                    alert('Failed to enable user. Please try again.');
                });
        })
        .catch((error) => {
            console.error('Error fetching user data:', error.message);
            alert('Failed to fetch user data. Please try again.');
        });
}

// Function to sign out user if currently logged in
function signOutUser() {
    signOut(auth)
        .then(() => {
            console.log('User signed out successfully');
            alert('Your account has been disabled. Please contact the administrator for assistance.');
        })
        .catch((error) => {
            console.error('Error signing out user:', error.message);
            alert('Failed to sign out user. Please try again.');
        });
}

// Function to get the current user
function getCurrentUser() {
    return auth.currentUser;
}


async function submitForm(event) {
    event.preventDefault();
    console.log(database);

    try {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log(user?.email);
                const authUid = user?.uid;
                const email = user?.email;

                // Get form values
                const bookTitle = document.getElementById("bookTitle").value;
                const genresInput = document.getElementById("genres");
                const genres = genresInput.value
                    .split(",")
                    .map((genre) => genre.trim());
                const tagsInput = document.getElementById("tags");
                const tags = tagsInput.value.split(",").map((tag) => tag.trim());
                const description = document.getElementById("description").value;
                const imageUrl =
                    document.getElementById("uploadedImage").src || "";

                // var file = document.getElementById("fileInput").files[0];

                // if (!file) {
                //   return alert("Please select a file.");
                // }

                // var xhr = new XMLHttpRequest();
                // var formData = new FormData();
                // formData.append("file", file);
                // xhr.open("POST", `/assets/users/books/${email}_${file.name}`);

                // xhr.onload = function () {
                //   if (xhr.status === 200) {
                //     alert("File uploaded successfully!");
                //   } else {
                //     alert("An error occurred while uploading the file.");
                //   }
                // };

                // xhr.send(formData);

                // const imageUrl = `/assets/users/books/${email}_${file.name}`;

                const newBook = {
                    email: email,
                    title: bookTitle,
                    genres: genres,
                    tags: tags,
                    description: description,
                    imageUrl: imageUrl.toString(),
                };

                console.log(newBook);

                await set(ref(database, `books/${bookId.trim()}`), newBook);
                // Clear form fields after successful submission
                document.getElementById("bookId").value = "";
                genresInput.value = "";
                tagsInput.value = "";
                document.getElementById("description").value = "";
                document.getElementById("uploadedImage").src = "";

                // Display success message or redirect if needed
                alert("Book added successfully!");
                window.location.replace("/html/addchapter.html")

                // Clear form fields after submission
                document.getElementById("bookId").value = "";
                document.getElementById("genres").value = "";
                document.getElementById("tags").value = "";
                document.getElementById("description").value = "";
                document.getElementById("uploadedImage").src = "#";

                // Reset the image container
                const imageContainer = document.getElementById("imageContainer");
                imageContainer.style.background = "#fff";
                imageContainer.querySelector("#placeholder").style.display = "block";
                imageContainer.querySelector("#uploadedImage").style.display = "none";
            }
        });
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred. Please try again.");
    }
}

document
    .getElementById("addbooks_btn")
    .addEventListener("click", function (event) {
        submitForm(event);
    });

function previewImage(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];

    const uploadedImage = document.getElementById("uploadedImage");

    const imageContainer = document.getElementById("imageContainer");
    const placeholder = document.getElementById("placeholder");

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imageContainer.style.background = "none";
            placeholder.style.display = "none";
            uploadedImage.style.display = "block";
            uploadedImage.src = e.target.result;
        };

        reader.readAsDataURL(file);
    } else {
        imageContainer.style.background = "#fff";
        placeholder.style.display = "block";
        uploadedImage.style.display = "none";
        uploadedImage.src = "#";
    }
}
document
    .getElementById("fileInput")
    .addEventListener("change", function (event) {
        previewImage(event);
    });

function deleteBook(bookId) {
    const bookRef = ref(database, `books/${bookId}`);

    // Remove the book data from the database
    remove(bookRef)
        .then(() => {
            document.getElementById('deleteButton').addEventListener('click', function () {
                const bookTitle = prompt('Enter the title of the book to delete:');
                deleteBook(bookId);
            });
            console.log('Book deleted successfully');
            alert('Book has been deleted successfully.');
            // You can add further actions here, like refreshing the book list
        })
        .catch((error) => {
            console.error('Error deleting book:', error.message);
            console.log('Deleting book with Title:', bookTitle);
            alert('Failed to delete book. Please try again.');
        });
}


// Function to enable book
function enabledbooks(bookId) {
    const bookRef = ref(database, `books/${bookId}`);

    // Fetch the existing book data
    get(bookRef)
        .then((snapshot) => {
            const bookData = snapshot.val();
            bookData.disabled = false; // Set disabled property to false for enabling book

            // Update book data in the database
            set(bookRef, bookData)
                .then(() => {
                    document.getElementById('enableButton').addEventListener('click', function () {
                        const bookId = prompt('Enter the title of the book to enable:');
                        enableBook(bookId);
                    });

                    console.log('Book enabled successfully');
                    alert('Book has been enabled successfully.');

                })
                .catch((error) => {
                    console.error('Error enabling book:', error.message);
                    alert('Failed to enable book. Please try again.');
                });
        })
        .catch((error) => {
            console.error('Error fetching book data:', error.message);
            alert('Failed to fetch book data. Please try again.');
        });
}

// Function to disable book
function disabledbooks(bookId) {
    const bookRef = ref(database, `books/${bookId}`);

    // Fetch the existing book data
    get(bookRef)
        .then((snapshot) => {
            const bookData = snapshot.val();
            bookData.disabled = true; // Set disabled property to true for disabling book

            // Update book data in the database
            set(bookRef, bookData)
                .then(() => {
                    document.getElementById('disableButton').addEventListener('click', function () {
                        const bookId = prompt('Enter the title of the book to disable:');
                        disableBook(bookId);
                    });

                    console.log('Book disabled successfully');
                    alert('Book has been disabled successfully.');

                    // Refresh book list
                    fetchBooks();
                })
                .catch((error) => {
                    console.error('Error disabling book:', error.message);
                    alert('Failed to disable book. Please try again.');
                });
        })
        .catch((error) => {
            console.error('Error fetching book data:', error.message);
            alert('Failed to fetch book data. Please try again.');
        });
}
