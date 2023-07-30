import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js'
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js'
const firebaseConfig = {
    apiKey: "AIzaSyDQF_w0iISHkuR_2HJUkpQhz5v7LKmhjPo",
    authDomain: "scucrushes-a9663.firebaseapp.com",
    databaseURL: "https://scucrushes-a9663-default-rtdb.firebaseio.com",
    projectId: "scucrushes-a9663",
    storageBucket: "scucrushes-a9663.appspot.com",
    messagingSenderId: "1027917905596",
    appId: "1:1027917905596:web:54c1a478e31f4007c75ab9",
    measurementId: "G-CFJTYX3MYW"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
window.auth = auth;
const provider = new GoogleAuthProvider();
var userID;
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user.uid);
        userID = user.uid;
        sendUID(userID); 
    } else {
        // No user detected
    }
})

let loginButton = document.getElementById("gButton");
loginButton.addEventListener("click", login)

let createButton = document.getElementById("submit");
createButton.addEventListener("click", addUser)

function login() {
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
        })
        .catch((error) => {
            console.log(error);
        });
}
