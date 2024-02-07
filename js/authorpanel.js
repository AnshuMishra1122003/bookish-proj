// Import necessary functions from Firebase SDK
import { auth, db } from "./firebaseConfig.mjs";
import {
  query,
  orderByChild,
  equalTo,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";





// Function to create a book container for displaying on UI
function createBookContainer(book) {
  const bookContainer = document.createElement("div");
  bookContainer.classList.add("book-container");

  const authorbookContainer = document.createElement("div");
  authorbookContainer.classList.add("book");

  // Create cover image container
  const coverImgContainer = document.createElement("div");
  coverImgContainer.classList.add("cover-img-container");

  const coverImg = document.createElement("img");
  coverImg.src = book.imageUrl;
  coverImg.alt = "Book Cover";
  coverImgContainer.appendChild(coverImg);

  // Create title and description container
  const contentContainer = document.createElement("div");
  contentContainer.classList.add("content-container");

  const titleContainer = document.createElement("div");
  titleContainer.classList.add("title");
  titleContainer.textContent = `${book.title}`;

  const descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("description");
  descriptionContainer.innerHTML = `<p>${book.description}</p>`;

  contentContainer.append(titleContainer, descriptionContainer);

  // Create buttons container
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

  // Create three buttons
  const button1 = document.createElement("button");
  button1.textContent = "Edit Book Details";
  const button2 = document.createElement("button");
  button2.textContent = "Add Chapters";
  const button3 = document.createElement("button");
  button3.textContent = "Delete Chapters";
  const button4 = document.createElement("button");
  button4.textContent = "Delete Book";

  // Append buttons to the container
  buttonsContainer.append(button1, button2, button3, button4);

  // Append everything to the book container
  bookContainer.appendChild(coverImgContainer);
  bookContainer.appendChild(contentContainer);
  bookContainer.appendChild(buttonsContainer);
  authorbookContainer.appendChild(bookContainer);

  return bookContainer;
}


// Function to display books in the UI
function displayBooksUI(books) {
  const content = document.getElementById("displayUserBooks");
  content.innerHTML = "";

  Object.keys(books).forEach((key) => {
    const book = books[key];

    // Create book container
    const bookElement = createBookContainer(book);

    // Append the book container to the content
    content.appendChild(bookElement);

    console.log("Books displayed for the user");
  });
}

// Function to handle changes in book data
function handleBookDataChange(snapshot) {
  if (snapshot.exists()) {
    const books = snapshot.val();
    displayBooksUI(books);
  } else {
    // No books found
    const content = document.getElementById("displayUserBooks");
    content.innerHTML += "<p>No books found.</p>";
  }
}

// Function to set up the onValue listener
function setBooksListener(userEmail) {
  const booksRef = ref(db, "books");
  const userBooksQuery = query(
    booksRef,
    orderByChild("email"),
    equalTo(userEmail)
  );

  onValue(userBooksQuery, handleBookDataChange);
}

// Function to display user books
function displayUserBooks(userEmail) {
  setBooksListener(userEmail);
}

// Assume this is called when the page loads or whenever appropriate
function initialize() {
  // Attach an observer to watch for changes in authentication state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // If a user is signed in, display their books
      displayUserBooks(user.email);
    } else {
      // If no user is signed in, you can handle it accordingly
      console.log("No user is signed in.");
      // You might want to clear the book display or show a login prompt
    }
  });
}

// Call the initialize function to set up the observer
initialize();

document
  .getElementById("displayUserBooks")
  .addEventListener("click", function () {
    displayUserBooks();
  });



  