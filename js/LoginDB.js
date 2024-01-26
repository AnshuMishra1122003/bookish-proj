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

console.log(db);
async function login(event) {
  const email = document.getElementById("Email_TextBox").value;
  const password = document.getElementById("Password_TextBox").value;
  //   const username = document.getElementById("Username_TextBox").value;
  event.preventDefault();
  //   const email = e.value;

  //   const password = p.value;

  console.log(email, password);

  await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("LOGIN SUCCESSFUL");
      window.location.href = "/index.html";
    })
    .catch((error) => {
      console.log({ message: error.message });
      alert(error.code);
      //   const errorCode = error.code;
      //   const errorMessage = error.message;
    });
}

document
  .getElementById("Login_Btn")
  .addEventListener("click", function (event) {
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

      await set(ref(db, `users/${user.uid}`), {
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
