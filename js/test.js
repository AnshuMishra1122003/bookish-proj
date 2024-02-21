import { db } from "./firebaseConfig.mjs";
import { get, ref, query, limitToLast, orderByKey } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

async function fetchRecentlyAddedBooks() {
    try {
        // Construct the query to fetch the books and limit to last 10
        const booksRef = ref(db, 'books');
        const q = query(booksRef, limitToLast(10), orderByKey());
        
        // Execute the query
        const snapshot = await get(q);
        const books = snapshot.val();

        // Log the fetched books
        console.log('Fetched recently added books:', books);

        // Render the books in the HTML container
        renderBooks(books);
    } catch (error) {
        console.error('Error fetching recently added books:', error);
        // Handle error if necessary
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Fetch recently added books for all genres
    fetchRecentlyAddedBooks();
});

// Function to render the fetched books in the HTML container
function renderBooks(books) {
    const container = document.getElementById('books-container');

    // Clear previous content
    container.innerHTML = '';

    // Render each book
    for (let bookId in books) {
        const book = books[bookId];
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');

        // Add book image
        const imageElement = document.createElement('img');
        imageElement.src = book.imageUrl; // Use book.cover instead of imageUrl
        imageElement.alt = book.title;
        imageElement.classList.add('book-image');
        bookElement.appendChild(imageElement);

        // Add book title
        const titleElement = document.createElement('h3');
        titleElement.textContent = book.title;
        titleElement.classList.add('book-title');
        bookElement.appendChild(titleElement);

        // Append book element to the container
        container.appendChild(bookElement);
    }
}

async function fetchRecentlyAddedBooksByGenre(genre) {
    try {
        // Fetch book IDs from the respective genre node
        const genreRef = ref(db, `genres/${genre}/books`);
        const snapshot = await get(genreRef);
        const bookIdsObject = snapshot.val();

        // Log the fetched book IDs
        console.log(`Fetched book IDs for genre ${genre}:`, bookIdsObject);

        if (!bookIdsObject) {
            console.log('No books found for genre:', genre);
            return;
        }

        // Extract book IDs from the object keys
        const bookIds = Object.keys(bookIdsObject);

        // Fetch book details for the fetched book IDs
        const books = [];
        for (let i = 0; i < Math.min(10, bookIds.length); i++) {
            const bookId = bookIds[i];
            const bookRef = ref(db, `books/${bookId}`);
            const bookSnapshot = await get(bookRef);
            const book = bookSnapshot.val();
            if (book) {
                books.push(book);
            }
        }

        // Log the fetched books
        console.log(`Fetched books for genre ${genre}:`, books);

        // Render the fetched books
        renderBooksByGenre(books);
    } catch (error) {
        console.error('Error fetching books for genre', genre, ':', error);
        // Handle error if necessary
    }
}



// Function to render the fetched books in the HTML container for each genre
function renderBooksByGenre(books) {
    // Clear previous content
    const container = document.getElementById('books-container');
    container.innerHTML = '';

    // Render each book
    books.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');

        // Add book image
        const imageElement = document.createElement('img');
        imageElement.src = book.imageUrl;
        imageElement.alt = book.title;
        imageElement.classList.add('book-image');
        bookElement.appendChild(imageElement);

        // Add book title
        const titleElement = document.createElement('h3');
        titleElement.textContent = book.title;
        titleElement.classList.add('book-title');
        bookElement.appendChild(titleElement);

        // Append book element to the container
        container.appendChild(bookElement);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Fetch recently added books for all genres
    fetchRecentlyAddedBooksByGenre('Action');
    fetchRecentlyAddedBooksByGenre('Adventure');
    fetchRecentlyAddedBooksByGenre('Fantasy');
    fetchRecentlyAddedBooksByGenre('Romance');
    fetchRecentlyAddedBooksByGenre('Game');
    fetchRecentlyAddedBooksByGenre('Urban');
});