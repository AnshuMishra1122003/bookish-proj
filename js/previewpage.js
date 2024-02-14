import { auth, db } from "./firebaseConfig.mjs";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  ref,
  get,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Function to fetch and display book details
function displayBookDetails(bookId) {
  const bookDetailsContainer = document.getElementById("bookDetailsContainer");

  // Assume 'books' is the node where your books are stored in Firebase
  const bookRef = ref(db, `books/${bookId}`);

  onValue(bookRef, (snapshot) => {
    const bookData = snapshot.val();

    const mainbookContainer = document.createElement("div");
    mainbookContainer.classList.add("mainbook-container");

    const coverImg = document.createElement("img");
    coverImg.src = "/assets/slid2.jpg";
    coverImg.alt = "Cover";
    coverImg.classList.add("cover-img");

    // Create title container
    const titleContainer = document.createElement("div");
    titleContainer.classList.add("title-container");

    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = bookData.title;

    // Genres and tags
    const genres = document.createElement("div");
    genres.classList.add("genres");
    genres.textContent = `Genres: ${bookData.genres.join(", ")}`;

    const tags = document.createElement("div");
    tags.classList.add("tags");
    tags.textContent = `Tags: ${bookData.tags.join(", ")}`;

    titleContainer.appendChild(title);
    titleContainer.appendChild(genres);
    titleContainer.appendChild(tags);

    mainbookContainer.appendChild(coverImg);
    mainbookContainer.appendChild(titleContainer);

    // Create button container
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    // Create "Read Now" button
    const readNowButton = document.createElement("button");
    readNowButton.textContent = "Read Now";
    readNowButton.addEventListener("click", () => {
      // Navigate to readnow.html
      window.location.href = "readnow.html?bookId=" + bookId;
    });

    // Create "Bookmark" button
    const bookmarkButton = document.createElement("button");
    bookmarkButton.innerHTML = '<i class="bx bxs-bookmark"></i>';
    bookmarkButton.addEventListener("click", () => {
      // Navigate to bookmark.html
      window.location.href = "bookmark.html?bookId=" + bookId;
    });

    buttonContainer.appendChild(readNowButton);
    buttonContainer.appendChild(bookmarkButton);

    const descriptContainer = document.createElement("div");
    descriptContainer.classList.add("descript-container");

    // Description
    const description = document.createElement("div");
    description.classList.add("description");
    description.textContent = bookData.description;

    descriptContainer.appendChild(description);

    // Append elements to the container
    bookDetailsContainer.innerHTML = ""; // Clear previous content
    bookDetailsContainer.appendChild(mainbookContainer);
    bookDetailsContainer.appendChild(buttonContainer);
    bookDetailsContainer.appendChild(descriptContainer);
  });
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

// Function to extract the book ID from the URL parameter
function getBookIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("bookId");
}

// Function to display chapters
async function displayChapters(bookId) {
  try {
    const chaptersRef = ref(db, `books/${bookId}/chapters`);
    const snapshot = await get(chaptersRef);
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
