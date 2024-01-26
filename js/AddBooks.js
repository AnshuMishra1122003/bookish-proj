import { auth, db } from "./firebaseConfig.mjs";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";
import {
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";

// Function to handle form submission
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
        const imageUrl =
          document.getElementById("uploadedImage").src || "/assets/slid2.jpg";

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

document
  .getElementById("addbooks_btn")
  .addEventListener("click", function (event) {
    submitForm(event);
  });

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
