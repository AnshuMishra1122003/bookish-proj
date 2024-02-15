import { db } from "./firebaseConfig.mjs";
import {
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Function to fetch and display book details
async function displayBookDetails(bookId) {
  const bookDetailsContainer = document.getElementById("bookDetailsContainer");

  try {
    // Fetch book details
    const bookSnapshot = await get(ref(db, `books/${bookId}`));
    const bookData = bookSnapshot.val();

    // Create element to display book title
    const bookTitle = document.createElement("h2");
    bookTitle.textContent = bookData.title;
    bookDetailsContainer.appendChild(bookTitle);

    // Fetch chapters
    const chaptersRef = ref(db, `books/${bookId}/chapters`);
    const chaptersSnapshot = await get(chaptersRef);
    const chapters = chaptersSnapshot.val();

    if (chapters) {
      const chapterIds = Object.keys(chapters);
      let currentChapterIndex = 0;

      // Function to display current chapter content
      function displayCurrentChapter() {
        const currentChapterId = chapterIds[currentChapterIndex];
        const currentChapter = chapters[currentChapterId];

        // Clear previous chapter content
        bookDetailsContainer.innerHTML = "";

        // Display book title
        bookDetailsContainer.appendChild(bookTitle);

        // Display chapter title
        const chapterTitle = document.createElement("h3");
        chapterTitle.textContent = currentChapter.title;
        bookDetailsContainer.appendChild(chapterTitle);

        // Display chapter content
        const chapterContent = document.createElement("p");
        chapterContent.textContent = currentChapter.content;
        bookDetailsContainer.appendChild(chapterContent);

        // Add navigation buttons
        const backButton = document.createElement("button");
        backButton.textContent = "Previous Chapter";
        backButton.addEventListener("click", () => {
          if (currentChapterIndex > 0) {
            currentChapterIndex--;
            displayCurrentChapter();
          }
        });
        bookDetailsContainer.appendChild(backButton);

        const indexButton = document.createElement("button");
        indexButton.textContent = "Index";
        indexButton.addEventListener("click", () => {
          location.href = `/html/previewpage.html?bookId=${bookId}`;
        });
        bookDetailsContainer.appendChild(indexButton);
        
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next Chapter";
        nextButton.addEventListener("click", () => {
          if (currentChapterIndex < chapterIds.length - 1) {
            currentChapterIndex++;
            displayCurrentChapter();
          }
        });
        bookDetailsContainer.appendChild(nextButton);
      }

      // Initial display of the first chapter
      displayCurrentChapter();
    } else {
      console.log("No chapters found for this book.");
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
    alert("An error occurred while fetching book details. Please try again.");
  }
}

// Call the displayBookDetails function when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Extract the book ID from the URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("bookId");

  if (bookId) {
    displayBookDetails(bookId);
  } else {
    // Handle case where book ID is not provided
    console.error("Book ID not found in URL parameters");
  }
});
