import { db, auth } from "./firebaseConfig.mjs";
import {
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";


async function login(event) {
  event.preventDefault();
  const email = document.getElementById("Email_TextBox").value;
  const password = document.getElementById("Password_TextBox").value;

  if (!email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)) {
      alert("Invalid email format");
      return;
  }

  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      sessionStorage.setItem('user', JSON.stringify(user));
      window.location.href = "/index.html";
  } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your email and password.");
  }
}

document.getElementById("Login_Btn").addEventListener("click", function (event) {
  login(event);
});

function logout() {
 
  sessionStorage.removeItem('user');
  
  auth.signOut().then(() => {
   
    window.location.href = "/login.html";
  }).catch((error) => {
    console.error("Logout error:", error);
    alert("Logout failed.");
  });
}


document.getElementById("Login_Btn").addEventListener("click", function (event) {
  login(event);
});

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  login_hint: "user@example.com",
});
async function loginOAuth() {
  signInWithPopup(auth, provider)
    .then(async (authData) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(authData);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = authData.user;
      console.log(user);

      await set(ref(db,`users/${user.uid}`), {
        username: user?.name ?? "google",
        email: user?.email,
        password: "bookish@123",
      });
      alert("Login successfully");
      window.location.href = "/index.html";
    })
    .catch((error) => {
      // Handle Errors here.
      console.log({ message: error.message });
      alert(error.code);
      // The email of the user's account used.
      //   const email = error.customData.email;
      //   const credential = GoogleAuthProvider.credentialFromError(error);
    });
}

document
  .getElementById("google-login-btn")
  .addEventListener("click", loginOAuth);