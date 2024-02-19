import { db } from "./firebaseConfig.mjs";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Function to fetch and display 10 recently added books
async function showGenreAll() {
    // Get a reference to the 'books' node in the Firebase database
    const booksRef = ref(db, 'books');

    try {
        // Get the snapshot of the 'books' node
        const snapshot = await get(booksRef);

        // Check if data exists
        if (snapshot.exists()) {
            // Get the data from the snapshot
            const booksData = snapshot.val();

            // Convert object to array
            const booksArray = Object.values(booksData);

            // Sort books by last_updated timestamp in descending order
            booksArray.sort((a, b) => b.last_updated - a.last_updated);

            // Take the first 10 books
            const recentBooks = booksArray.slice(0, 10);

            // Display each recent book
            recentBooks.forEach(book => {
                displayBook(book);
            });
        } else {
            console.log('No data available');
        }
    } catch (error) {
        console.error('Error fetching books:', error.message);
    }
}

// Function to display a book
function displayBook(book) {
    // Create a div element for the book
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book');

    // Create an image element for the book cover
    const img = document.createElement('img');
    img.classList.add('book-cover');
    img.src = book.imageUrl;
    img.alt = book.title;

    // Create a paragraph element for the book title
    const titlePara = document.createElement('p');
    titlePara.classList.add('book-title');
    titlePara.textContent = book.title;

    // Append the image and title to the book div
    bookDiv.appendChild(img);
    bookDiv.appendChild(titlePara);

    // Append the book div to the container
    const container = document.querySelector('.recently-added-books');
    container.appendChild(bookDiv);
}


  // Add an event listener to call showGenreAll when the "genre-all" link is clicked
  document.getElementById("genre-all").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default action of the anchor tag
    showGenreAll(); // Call the showGenreAll function
});



// Function to fetch and display 10 recently added books with genre "Action"
async function showGenreAction() {
    // Get a reference to the 'books' node in the Firebase database
    const booksRef = ref(db, 'books');

    try {
        // Get the snapshot of the 'books' node
        const snapshot = await get(booksRef);

        // Check if data exists
        if (snapshot.exists()) {
            // Get the data from the snapshot
            const booksData = snapshot.val();

            // Convert object to array
            const booksArray = Object.values(booksData);

            // Filter books by genre "Action"
            const actionBooks = booksArray.filter(book => book.genres && book.genres.includes("Action"));

            // Sort action books by last_updated timestamp in descending order
            actionBooks.sort((a, b) => b.last_updated - a.last_updated);

            // Take the first 10 action books
            const recentActionBooks = actionBooks.slice(0, 10);

            // Display each recent action book
            recentActionBooks.forEach(book => {
                displayActionBook(book);
            });
        } else {
            console.log('No data available');
        }
    } catch (error) {
        console.error('Error fetching action books:', error.message);
    }
}

// Function to display a book
function displayActionBook(book) {
    // Create a div element for the book
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book');

    // Create an image element for the book cover
    const img = document.createElement('img');
    img.classList.add('book-cover');
    img.src = book.imageUrl;
    img.alt = book.title;

    // Create a paragraph element for the book title
    const titlePara = document.createElement('p');
    titlePara.classList.add('book-title');
    titlePara.textContent = book.title;

    // Append the image and title to the book div
    bookDiv.appendChild(img);
    bookDiv.appendChild(titlePara);

    // Append the book div to the container
    const container = document.querySelector('.recently-added-books');
    container.appendChild(bookDiv);
}

// Call the function to display recent action books when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    showGenreAction();
});
