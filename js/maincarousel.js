import { db } from "./firebaseConfig.mjs";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

let slideIndex = 0;

// Fetch book details from Firebase Realtime Database
async function fetchBooks() {
    const slideshowContainer = document.getElementById("slideshow-container");
    try {
        // Get all book IDs
        const snapshot = await get(ref(db, "books"));
        const bookIds = Object.keys(snapshot.val());

        // Select 6 random book IDs
        const randomBookIds = getRandomItems(bookIds, 6);

        // Fetch details for the selected random book IDs
        const bookDetailsPromises = randomBookIds.map(async (bookId) => {
            try {
                const bookSnapshot = await get(ref(db, `books/${bookId}`));
                return bookSnapshot.val();
            } catch (error) {
                console.error(`Error fetching book ${bookId}:`, error);
                return null; // Return null for failed fetches
            }
        });

        // Resolve all promises
        const bookDetails = await Promise.all(bookDetailsPromises);

        // Display book details
        bookDetails.forEach((book) => {
            if (book) {
                const slide = createSlide(book);
                slideshowContainer.appendChild(slide);
            }
        });

        showSlides();

        // Fetch another 6 book details after 10 minutes
        setTimeout(fetchBooks, 600000); // 10 minutes in milliseconds
    } catch (error) {
        console.error("Error fetching books: ", error);
    }
}

// Function to create a slide element
function createSlide(book) {
    const slide = document.createElement("div");
    slide.classList.add("mySlides");
    slide.innerHTML = `
        <div class="content">
            <h3>Genres: <span>${book.genres}</span></h3><br>
            <h2>${book.title}</h2><br>
            <p>${book.description}</p>
        </div>
        <div class="img-container">
            <img class="img" src="${book.imageUrl}" alt="${book.title}">
        </div>
        <div class="btn-slides">
            <a href="#" class="read-now">Read now</a>
            <a href="#" class="carousel-bkmrk"><i class='bx bxs-bookmark'></i></a>
        </div>
    `;
    return slide;
}

// Show slides function
function showSlides() {
    const slides = document.getElementsByClassName("mySlides");
    const dotsContainer = document.querySelector(".slider-dots");

    // Generate 6 dots for the slides
    const dotsHtml = Array.from({ length: 6 }, (_, i) => `<span class="dot" onclick="currentSlide(${i + 1})"></span>`).join("");
    dotsContainer.innerHTML = dotsHtml;

    const dots = document.getElementsByClassName("dot");

    // Hide all slides and remove active class from all dots
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        dots[i].classList.remove("active");
    }

    // Increment slide index
    slideIndex++;

    // Reset slide index if it exceeds the number of slides
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    // Display the current slide and activate its corresponding dot
    slides[slideIndex - 1].style.display = "flex";
    dots[slideIndex - 1].classList.add("active");

    // Schedule the next slide change after 3 seconds
    setTimeout(showSlides, 3000);
}


// Function to set current slide
function currentSlide(index) {
    slideIndex = index;
    showSlides();
}

// Function to get random items from an array
function getRandomItems(array, count) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Call fetchBooks function to start fetching book details and displaying slides
fetchBooks();
