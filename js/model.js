import { storage } from "./firebaseConfig.mjs";

const pdfInput = document.getElementById("pdfInput");

pdfInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    
    // Make sure 'storage' is the correct object in your firebaseConfig.mjs
    const storageRef = storage.ref();  

    const pdfRef = storageRef.child(`pdfs/${file.name}`);

    pdfRef.put(file).then((snapshot) => {
        console.log("PDF uploaded successfully");
    }).catch((error) => {
        console.error("Error uploading PDF", error);
    });
});
