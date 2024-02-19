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
    coverImg.alt = "Cover";
    coverImg.classList.add("cover-img");
    // Set coverImg source dynamically from localhost
    coverImg.src = bookData.imageUrl; 

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
      // Navigate to displaychapters.html with bookId parameter
      window.location.href = `displaychapters.html?bookId=${bookId}`;
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

    const descriptTextContainer = document.createElement("button");
    descriptTextContainer.classList.add("descript-text-container");
    descriptTextContainer.textContent = "Synopsis";

    const chapterTextContainer = document.createElement("button");
    chapterTextContainer.classList.add("chapters-text-container");
    chapterTextContainer.textContent = "Chapters";

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
    bookDetailsContainer.appendChild(descriptTextContainer);
    bookDetailsContainer.appendChild(chapterTextContainer);
    bookDetailsContainer.appendChild(descriptContainer);

    // Display chapters container initially as default
    const chaptersContainer = document.createElement("div");
    chaptersContainer.id = "chaptersContainer";
    chaptersContainer.style.display = "none"; // Hide chapters initially

    bookDetailsContainer.appendChild(chaptersContainer);

    // Function to toggle between showing description and chapters
    function toggleDescriptionAndChapters() {
      if (this === descriptTextContainer) {
        descriptContainer.style.display = "block";
        chaptersContainer.style.display = "none";
        descriptTextContainer.textContent = "Synopsis";
        chapterTextContainer.textContent = "Chapters";
      } else {
        descriptContainer.style.display = "none";
        chaptersContainer.style.display = "block";
        displayChapters();
        descriptTextContainer.textContent = "Synopsis";
      }
    }

    // Function to display chapters
    async function displayChapters() {
      try {
        const chaptersRef = ref(db, `books/${bookId}/chapters`);
        const snapshot = await get(chaptersRef);
        const chapters = snapshot.val();

        chaptersContainer.innerHTML = ""; // Clear previous chapter details

        if (chapters) {
          let serialNumber = 1;
          for (const chapterId in chapters) {
            const chapter = chapters[chapterId];
            const chapterListItem = document.createElement("div");
            chapterListItem.classList.add("chapter-list-item");

            // Create a link to display the chapter details
            const chapterLink = document.createElement("a");
            chapterLink.href = `displaychapters.html?bookId=${bookId}&chapterId=${chapterId}`; // Link to displaychapters.html with bookId and chapterId as URL parameters
            chapterLink.textContent = `${serialNumber}. ${chapter.title}`;
            chapterListItem.appendChild(chapterLink);

            chaptersContainer.appendChild(chapterListItem);
            serialNumber++;
          }
        } else {
          const noChapterMsg = document.createElement("div");
          noChapterMsg.classList.add("no-data");
          noChapterMsg.textContent = "No chapters available.";
          chaptersContainer.appendChild(noChapterMsg);
          console.log("No chapters.");
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
        alert("An error occurred while fetching chapters. Please try again.");
      }
    }
    // Add event listeners to toggle buttons
    descriptTextContainer.addEventListener(
      "click",
      toggleDescriptionAndChapters
    );
    chapterTextContainer.addEventListener(
      "click",
      toggleDescriptionAndChapters
    );
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
