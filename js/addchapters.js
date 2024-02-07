import { auth, db } from "./firebaseConfig.mjs";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  push,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Function to handle form submission
async function submitForm(event) {
  event.preventDefault();

  try {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user?.email;

        const bookTitle = "Your_Book_Title";
        const chapterTitle = document.getElementById("chapterTitle").value;
        const chapterContent = document.getElementById("chapterContent").value;

        // Save chapter details to the database under the /chapters node
        const chapterRef = push(ref(db, `chapters`), {
          username: email, // Assuming you want to use the email as the username
          email: email,
          bookTitle: bookTitle,
          title: chapterTitle,
          content: chapterContent,
          timestamp: new Date().toLocaleString(),
        });

        console.log(chapterRef);

        await set(ref(db, `chapters/${chapterRef.key}`), {
          // Instead of storing the reference, store the actual chapter data
          username: email,
          email: email,
          bookTitle: bookTitle,
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
    submitForm(event);
  });

