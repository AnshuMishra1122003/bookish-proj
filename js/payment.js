import { db, auth } from "./firebaseConfig.mjs";
import { set, ref, get } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

// Function to retrieve user details from the users node
async function getUserDetails(userId) {
    try {
        const userRef = ref(db, `users/${userId}`);
        const snapshot = await get(userRef);
        return snapshot.val();
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
}

// Function to handle payment and add user details to "subscribedusers" node
async function handlePayment(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get current user ID
    const user = auth.currentUser;
    if (!user) {
        console.log("User not logged in.");
        return;
    }
    const userId = user.uid;
    console.log("User ID:", userId);

    // Retrieve user details from the users node
    try {
        const userDetails = await getUserDetails(userId);
        if (!userDetails) {
            console.log("User details not found.");
            return;
        }
        console.log("User details:", userDetails);

        // Get form data
        const email = document.getElementById("s-email").value;
        const country = document.getElementById("s-country").value;
        const cardNumber = document.getElementById("s-cardnumber").value;
        const cardholder = document.getElementById("s-cardholder").value;
        const expMonth = document.getElementById("s-expmonth").value;
        const cvv = document.getElementById("s-cvv").value;
        console.log("Form Data:", { email, country, cardNumber, cardholder, expMonth, cvv });

        // Add user details to "subscribedusers" node
        const subscribeUsersRef = ref(db, `subscribedusers/${userId}`);
        await set(subscribeUsersRef, {
            email,
            country,
            cardNumber,
            cardholder,
            expMonth,
            cvv
        });
        console.log("User details added to subscribedusers node:", userDetails);
        alert("Payment successful!");
        window.location.href = "/index.html"; // Redirect to index.html on success
    } catch (error) {
        console.error("Error handling payment:", error);
        alert("An error occurred. Please try again.");
    }
}

// Ensure user is logged in before handling payment
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in.");
        // Add event listener to the payment form submission button
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.addEventListener("submit", handlePayment);
        }
    } else {
        console.log("User not logged in.");
    }
});

// Ensure that the handlePayment function is called only after the DOM has fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // handlePayment();
});
