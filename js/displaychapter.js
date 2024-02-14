import { db } from "./firebaseConfig.mjs";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  push,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Function to extract the book ID from the URL parameter
function getBookIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("bookId");
}

// Function to display chapters
async function displayChapters(bookId) {
  try {
    const chaptersRef = db.ref(`books/${bookId}/chapters`);
    const snapshot = await chaptersRef.once("value");
    const chapters = snapshot.val();

    if (chapters) {
      const chaptersContainer = document.getElementById("chaptersContainer");

      for (const chapterId in chapters) {
        const chapter = chapters[chapterId];
        const chapterBox = document.createElement("div");
        chapterBox.classList.add("chapter-box");

        const chapterTitle = document.createElement("div");
        chapterTitle.classList.add("chapter-title");
        chapterTitle.textContent = chapter.title;

        const timestamp = document.createElement("div");
        timestamp.classList.add("timestamp");
        timestamp.textContent = chapter.timestamp;

        // Create a link to contentpage.html with the chapter content as a query parameter
        const contentLink = document.createElement("a");
        contentLink.textContent = "Read";
        contentLink.href = `/html/contentpage.html?bookId=${bookId}&chapterId=${chapterId}`;

        chapterBox.appendChild(chapterTitle);
        chapterBox.appendChild(timestamp);
        chapterBox.appendChild(contentLink);

        chaptersContainer.appendChild(chapterBox);
      }
    } else {
      console.log("No chapters found for this book.");
    }
  } catch (error) {
    console.error("Error fetching chapters:", error);
    alert("An error occurred while fetching chapters. Please try again.");
  }
}

// Call displayChapters function when the page loads
window.onload = function () {
  const bookId = getBookIdFromURL();
  if (bookId) {
    displayChapters(bookId);
  } else {
    console.error("No book ID found in URL parameter.");
    alert("No book ID found in URL parameter.");
  }
};
