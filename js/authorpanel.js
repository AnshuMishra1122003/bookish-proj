// Import necessary functions from Firebase SDK
import { auth, db } from "./firebaseConfig.mjs";
import {
  query,
  orderByChild,
  equalTo,
  ref,
  onValue,
  set,
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

  // Add event listener to coverImgContainer
  coverImgContainer.onclick = function () {
    // Redirect to preview page with book ID as URL parameter
    window.location.href = `/html/previewpage.html?bookId=${book.id}`;
  };

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

  // Add event listener to contentContainer
  contentContainer.onclick = function () {
    // Redirect to preview page with book ID as URL parameter
    window.location.href = `/html/previewpage.html?bookId=${book.id}`;
  };
  // Create buttons container
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

  // Create the edit book details button
  const button1 = document.createElement("button");
  button1.id = "editBookDetailsBtn"; // Set the id attribute
  button1.textContent = "Edit Book Details";
  button1.addEventListener("click", function (event) {
    toggleButton(button1);
    editBookDetails(bookId);
  });

  const button2 = document.createElement("button");
  button2.textContent = "Add Chapters";
  button2.addEventListener("click", function () {
    toggleButton(button2);
    // Call the function to display the add chapters form or perform other actions
  });

  const button3 = document.createElement("button");
  button3.textContent = "Edit Chapters";
  button3.addEventListener("click", function () {
    toggleButton(button3);
    // Call the function to display the edit chapters form or perform other actions
  });

  const button4 = document.createElement("button");
  button4.textContent = "Delete Chapters";
  button4.addEventListener("click", function () {
    toggleButton(button4);
    // Call the function to display the delete chapters form or perform other actions
  });

  const button5 = document.createElement("button");
  button5.textContent = "Delete Book";
  button5.addEventListener("click", function () {
    toggleButton(button5);
    // Call the function to display the delete book confirmation or perform other actions
  });

  // Function to toggle button display
  function toggleButton(clickedButton) {
    const buttons = [button1, button2, button3, button4, button5];
    buttons.forEach((button) => {
      if (button === clickedButton) {
        button.classList.toggle("show");
      } else {
        button.classList.remove("show");
      }
    });
  }

  // Append buttons to the container
  buttonsContainer.appendChild(button1, button2, button3, button4, button5);

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

// Function to handle addbooks form submission

async function submitForm(event) {
  event.preventDefault();
  console.log(db);

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
        const imageUrl = document.getElementById("uploadedImage").src || "";

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

        await set(ref(db, `books/${bookTitle.trim()}`), newBook);
        // Clear form fields after successful submission
        document.getElementById("bookTitle").value = "";
        genresInput.value = "";
        tagsInput.value = "";
        document.getElementById("description").value = "";
        document.getElementById("uploadedImage").src = "";

        // Display success message or redirect if needed
        alert("Book added successfully!");
        window.location.replace("/html/addchapter.html");

        // Clear form fields after submission
        document.getElementById("bookTitle").value = "";
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
// event listener for addbooks
document
  .getElementById("addbooks_btn")
  .addEventListener("click", function (event) {
    submitForm(event);
  });

// for image in addbooks
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

// function for save changes
// Function to extract the book ID from the URL parameter
function getBookIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("bookId");
}

// Function to fetch and populate the form fields with book details for editing
async function editBookDetails(bookId) {
  try {
    const bookRef = ref(db, `books/${bookId}`);
    const snapshot = await get(bookRef);
    const book = snapshot.val();

    // Populate the form fields with book details
    document.getElementById("bookTitle").value = book.title;
    document.getElementById("genres").value = book.genres.join(", ");
    document.getElementById("tags").value = book.tags.join(", ");
    document.getElementById("description").value = book.description;
    document.getElementById("uploadedImage").src = book.imageUrl;

    // Show the form for editing
    document.getElementById("editBookForm").style.display = "block";
  } catch (error) {
    console.error("Error editing book details:", error);
    alert("An error occurred while editing book details. Please try again.");
  }
}

// Now that the button is added to the DOM, add event listener for edit book details button
document.getElementById("editBookDetailsBtn").addEventListener("click", function () {
  // Retrieve the book ID from the URL parameter
  const bookId = getBookIdFromURL();
  if (bookId) {
    editBookDetails(bookId);
  } else {
    console.error("No book ID found in URL parameter.");
    alert("No book ID found in URL parameter.");
  }
});

// Function to submit edited book details
async function submitEditedBookDetails(event, bookId) {
  event.preventDefault();

  try {
    const title = document.getElementById("bookTitle").value;
    const genres = document
      .getElementById("genres")
      .value.split(",")
      .map((genre) => genre.trim());
    const tags = document
      .getElementById("tags")
      .value.split(",")
      .map((tag) => tag.trim());
    const description = document.getElementById("description").value;
    const imageUrl = document.getElementById("uploadedImage").src;

    // Update the book details in the database
    await set(ref(db, `books/${bookId}`), {
      title: title,
      genres: genres,
      tags: tags,
      description: description,
      imageUrl: imageUrl,
    });

    // Hide the form after submission
    document.getElementById("editBookForm").style.display = "none";

    // Optionally, you can display a success message
    alert("Book details updated successfully!");
  } catch (error) {
    console.error("Error updating book details:", error);
    alert("An error occurred while updating book details. Please try again.");
  }
}

// Event listener for submitting edited book details
document
  .getElementById("editBookForm")
  .addEventListener("submit", function (event) {
    // Retrieve the book ID from the URL parameter
    const bookId = getBookIdFromURL();
    if (bookId) {
      submitEditedBookDetails(event, bookId);
    } else {
      console.error("No book ID found in URL parameter.");
      alert("No book ID found in URL parameter.");
    }
  });
