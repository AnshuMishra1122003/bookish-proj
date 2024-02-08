import { auth, db } from "./firebaseConfig.mjs";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  push,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Function to handle form submission
async function submitForm(event, bookId) { // Receive the book ID as a parameter
  event.preventDefault();

  try {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user?.email;

        const chapterTitle = document.getElementById("chapterTitle").value;
        const chapterContent = document.getElementById("chapterContent").value;

        // Save chapter details to the database under the /books/{bookId}/chapters node
        const chapterRef = push(ref(db, `books/${bookId}/chapters`), { // Use the provided book ID
          username: email,
          email: email,
          title: chapterTitle,
          content: chapterContent,
          timestamp: new Date().toLocaleString(),
        });

        console.log(chapterRef);

        await set(ref(db, `books/${bookId}/chapters/${chapterRef.key}`), {
          username: email,
          email: email,
          title: chapterTitle,
          content: chapterContent,
          timestamp: new Date().toLocaleString(),
        });

        // Clear form fields after successful submission
        document.getElementById("chapterTitle").value = "";
        document.getElementById("chapterContent").value = "";

        // Display success message or redirect if needed
        alert("Chapter added successfully!");
        window.location.replace("/html/addchapter.html");
      }
    });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    alert("An unexpected error occurred. Please try again.");
  }
}

document
  .getElementById("addChapterBtn")
  .addEventListener("click", function (event) {
    const bookId = "Your_Book_ID"; // Replace with the actual book ID
    submitForm(event, bookId); // Pass the book ID to the submitForm function
  });
