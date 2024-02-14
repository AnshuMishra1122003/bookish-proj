import { auth, db } from "./firebaseConfig.mjs";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Function to extract the book ID from the URL parameter
function getBookIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("bookId");
}

// Function to edit book details
async function editBookDetails() {
  try {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const bookId = getBookIdFromURL();
        if (bookId) {
          const bookRef = ref(db, `books/${bookId}`);
          const snapshot = await get(bookRef);

          if (snapshot.exists()) {
            const book = snapshot.val();
            // Populate the form fields with book details
            document.getElementById("editbookTitle").value = book.title;
            document.getElementById("editgenres").value = book.genres.join(", ");
            document.getElementById("edittags").value = book.tags.join(", ");
            document.getElementById("editdescription").value = book.description;
            document.getElementById("edituploadedImage").src = book.imageUrl;

            // Show the form for editing
            document.getElementById("editBookForm").style.display = "block";
          } else {
            console.error("Book not found.");
            alert("Book not found. Please try again.");
          }
        } else {
          console.error("No book ID found in URL parameter.");
          alert("No book ID found in URL parameter.");
        }
      } else {
        console.log("User not authenticated.");
        // Handle the case where the user is not authenticated
        // For example, show a login prompt or redirect to the login page
      }
    });
  } catch (error) {
    console.error("Error editing book details:", error);
    alert("An error occurred while editing book details. Please try again.");
  }
}

// Event listener for submitting edited book details
document.getElementById("saveChangesBookBtn").addEventListener("click", async function (event) {
  event.preventDefault();
  // Retrieve the book ID from the URL parameter
  const bookId = getBookIdFromURL();
  if (bookId) {
    await submitEditedBookDetails(bookId);
  } else {
    console.error("No book ID found in URL parameter.");
    alert("No book ID found in URL parameter.");
  }
});

// Function to submit edited book details
async function submitEditedBookDetails(bookId) {
  try {
    const title = document.getElementById("editbookTitle").value;
    const genres = document.getElementById("editgenres").value.split(",").map((genre) => genre.trim());
    const tags = document.getElementById("edittags").value.split(",").map((tag) => tag.trim());
    const description = document.getElementById("editdescription").value;
    const imageUrl = document.getElementById("edituploadedImage").src;

    // Get the current user's email
    const currentUser = auth.currentUser;
    const email = currentUser ? currentUser.email : null;

    // Update the book details in the database
    await set(ref(db, `books/${bookId}`), {
      title: title,
      genres: genres,
      tags: tags,
      description: description,
      imageUrl: imageUrl,
      email: email, // Add user's email to the database
    });

    // Hide the form after submission
    document.getElementById("editBookForm").style.display = "none";

    // Optionally, you can display a success message
    alert("Book details updated successfully!");
    window.location.href = "/html/authordashboard.html";
  } catch (error) {
    console.error("Error updating book details:", error);
    alert("An error occurred while updating book details. Please try again.");
  }
}
