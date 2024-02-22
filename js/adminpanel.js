import { db } from "./firebaseConfig.mjs";
import {
  ref,
  set,
  get,
  remove,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Function to fetch and display books
function displayBooks() {
  const bookContainer = document.getElementById("bookContainer");

  // Assume 'books' is the node where your books are stored in Firebase
  const booksRef = ref(db, "books/");

  onValue(booksRef, (snapshot) => {
    bookContainer.innerHTML = ""; // Clear previous content

    snapshot.forEach((childSnapshot) => {
      const bookData = childSnapshot.val();
      const bookId = childSnapshot.key;

      // Create book element
      const bookElement = createBookElement(bookData, bookId);
      bookContainer.appendChild(bookElement);
    });
  });
}

// Function to create a book element
function createBookElement(bookData, bookId) {
  const containerCard = document.createElement("div");
  containerCard.classList.add("container-card");

  const bookElement = document.createElement("div");
  bookElement.classList.add("book");

  // Left side - Cover image
  const coverImg = document.createElement("img");
  coverImg.src = bookData.imageUrl;
  coverImg.alt = "Cover";
  coverImg.classList.add("cover-img");
  bookElement.appendChild(coverImg);

  // Center part - Title and Description
  const infoContainer = document.createElement("div");
  infoContainer.classList.add("info-container");

  const title = document.createElement("div");
  title.classList.add("title");
  title.textContent = bookData.title;
  infoContainer.appendChild(title);

  const description = document.createElement("div");
  description.classList.add("description");
  description.textContent = bookData.description;
  infoContainer.appendChild(description);

  // Border line
  const borderLine = document.createElement("div");
  borderLine.classList.add("border-line");
  infoContainer.appendChild(borderLine);

  bookElement.appendChild(infoContainer);

  // Trash icon for deleting the book
  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fas", "fa-trash", "delete-icon");
  trashIcon.setAttribute("title", "Delete");
  trashIcon.addEventListener("click", () => {
    deleteBook(bookId);
  });

  // Right side - Genres and Tags
  const genreTagsContainer = document.createElement("div");
  genreTagsContainer.appendChild(trashIcon);
  genreTagsContainer.classList.add("genre-tags-container");

  const genres = document.createElement("div");
  genres.classList.add("genres");
  genres.textContent = "Genres: " + bookData.genres.join(", ");
  genreTagsContainer.appendChild(genres);

  const tags = document.createElement("div");
  tags.classList.add("tags");
  tags.textContent = "Tags: " + bookData.tags.join(", ");
  genreTagsContainer.appendChild(tags);
  bookElement.appendChild(genreTagsContainer);

  containerCard.appendChild(bookElement);
  return containerCard;
}

// Function to delete a book from Firebase Realtime Database
function deleteBook(bookId) {
  const bookRef = ref(db, `books/${bookId}`);

  // Fetch the book data to display in the confirmation message
  get(bookRef)
    .then((snapshot) => {
      const bookData = snapshot.val();
      const bookName = bookData.title;

      // Display a confirmation alert before deleting the book
      const confirmation = confirm(
        `Are you sure you want to delete the book "${bookName}"?`
      );

      // Proceed with deletion only if the user confirms
      if (confirmation) {
        // Remove the book from the Firebase Realtime Database
        remove(bookRef)
          .then(() => {
            console.log("Book deleted successfully");
            // Display a success message after deleting the book
            alert(`Book "${bookName}" deleted successfully`);
            // Fetch and display updated books
            displayBooks();
          })
          .catch((error) => {
            console.error("Error deleting book:", error.message);
            alert("Error deleting book. Please try again later.");
          });
      } else {
        // If the user cancels, display a message or perform any other action
        console.log("Deletion cancelled by user");
      }
    })
    .catch((error) => {
      console.error("Error fetching book data:", error.message);
      alert("Error fetching book data. Please try again later.");
    });
}


// Call the displayBooks function when the page loads
document.addEventListener("DOMContentLoaded", () => {
  displayBooks();
});

// Function to fetch users from Firebase Realtime db
var tableBody = document.getElementById("tableBody");
function fetchUsers() {
  // Clear existing content
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }

  // Assuming your users are stored in a "users" node
  const usersRef = ref(db, "users");

  get(usersRef).then((snapshot) => {
    let serialNumber = 1; // Initialize serial number

    snapshot.forEach((userSnapshot) => {
      const userData = userSnapshot.val();

      const username = userData.username;
      const email = userData.email;

      // Create a table row for each user
      const row = document.createElement("tr");

      // Create the table cells
      const cellSerialNumber = document.createElement("td");
      cellSerialNumber.textContent = serialNumber++;

      const cellUsername = document.createElement("td");
      cellUsername.textContent = username;

      const cellEmail = document.createElement("td");
      cellEmail.textContent = email;

      const cellActions = document.createElement("td");

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", function () {
        editUser(userSnapshot.key);
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        deleteUser(userSnapshot.key);
      });

      const enableButton = document.createElement("button");
      enableButton.textContent = "Enable";
      enableButton.style.display = userData.disabled ? "inline-block" : "none";
      enableButton.addEventListener("click", function () {
        enableUser(userSnapshot.key);
      });

      const disableButton = document.createElement("button");
      disableButton.textContent = "Disable";
      disableButton.style.display = userData.disabled ? "none" : "inline-block";
      disableButton.addEventListener("click", function () {
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
      tableBody.appendChild(row);
    });
  });
}

fetchUsers();

function searchUsers() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.trim().toLowerCase();
  const tableBody = document.getElementById("tableBody");

  const usersRef = ref(db, "users");
  get(usersRef).then((snapshot) => {
    // Clear previous table content
    tableBody.innerHTML = "";

    let serialNumber = 1; // Initialize serial number

    snapshot.forEach((userSnapshot) => {
      const userData = userSnapshot.val();
      const username = userData.username.toLowerCase();
      const email = userData.email.toLowerCase();

      // Check if search term matches username or email
      if (username.includes(searchTerm) || email.includes(searchTerm)) {
        // Create table row
        const row = document.createElement("tr");

        // Create and append table cells
        const cellSerialNumber = document.createElement("td");
        cellSerialNumber.textContent = serialNumber++;

        const cellUsername = document.createElement("td");
        cellUsername.textContent = userData.username;

        const cellEmail = document.createElement("td");
        cellEmail.textContent = userData.email;

        const cellActions = document.createElement("td");

        // Create edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function () {
          editUser(userSnapshot.key);
        });

        // Create delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
          deleteUser(userSnapshot.key);
        });

        // Create enable button
        const enableButton = document.createElement("button");
        enableButton.textContent = "Enable";
        enableButton.style.display = userData.disabled
          ? "inline-block"
          : "none";
        enableButton.addEventListener("click", function () {
          enableUser(userSnapshot.key);
        });

        // Create disable button
        const disableButton = document.createElement("button");
        disableButton.textContent = "Disable";
        disableButton.style.display = userData.disabled
          ? "none"
          : "inline-block";
        disableButton.addEventListener("click", function () {
          disableUser(userSnapshot.key);
        });

        // Append buttons to cellActions
        cellActions.appendChild(editButton);
        cellActions.appendChild(deleteButton);
        cellActions.appendChild(enableButton);
        cellActions.appendChild(disableButton);

        // Append cells to row
        row.appendChild(cellSerialNumber);
        row.appendChild(cellUsername);
        row.appendChild(cellEmail);
        row.appendChild(cellActions);

        // Append row to table body
        tableBody.appendChild(row);
      }
    });
  });
}

// Attach the searchUsers function to the input event
searchInput.addEventListener("input", searchUsers);
// Assuming your Firebase database reference is defined as `database`

function editUser(userId) {
  // Assuming your users are stored in a "users" node
  const userRef = ref(db, `users/${userId}`);

  // Fetch the existing user data using get
  get(userRef)
    .then((snapshot) => {
      const userData = snapshot.val();

      // Get the updated user details from the admin
      const newName = prompt("Enter the new name:", userData.username);
      const newEmail = prompt("Enter the new email:", userData.email);

      // Create an object to store updated fields
      const updatedFields = {};

      // Update only the specified fields
      if (newName !== null && newName !== "") {
        updatedFields.username = newName;
      } else {
        // Keep the existing value if not provided
        updatedFields.username = userData.username;
      }

      if (newEmail !== null && newEmail !== "") {
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
      console.error("Error fetching user data:", error.message);
      // Handle the error if needed
    });
}

function deleteUser(userId) {
  // Assuming your users are stored in a "users" node
  const userRef = ref(db, `users/${userId}`);

  // Fetch user data to display in the confirmation message
  get(userRef)
    .then((snapshot) => {
      const userData = snapshot.val();
      const username = userData.username;
      const email = userData.email;

      // Display a confirmation alert before deleting the user
      const confirmation = confirm(
        `Are you sure you want to delete the following user?\n\nUsername: ${username}\nEmail: ${email}`
      );

      // If the user confirms, proceed with deletion
      if (confirmation) {
        // Remove the user from the Firebase Realtime Database
        remove(userRef)
          .then(() => {
            // Fetch updated users to refresh the table
            fetchUsers();
            // User deleted successfully
            alert(
              `User deleted successfully!\n\nUsername: ${username}\nEmail: ${email}`
            );
          })
          .catch((error) => {
            console.error("Error deleting user:", error.message);
            alert("Error deleting user. Please try again later.");
          });
      }
    })
    .catch((error) => {
      console.error("Error fetching user data:", error.message);
      alert("Error fetching user data. Please try again later.");
    });
}
