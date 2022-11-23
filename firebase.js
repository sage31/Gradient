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
const provider = new GoogleAuthProvider();
let userID;
onAuthStateChanged(auth, (user) => {
    if (user) {
        userID = user.uid;
        sendUID(userID);
        console.log(userID);
    } else {
        console.log("No user detected.");
    }
})

let loginButton = document.getElementById("gButton");
loginButton.addEventListener("click", signInWithPopup(auth, provider))

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
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            //const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}

function addUser() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var year = document.getElementById("year").value;

    if (firstName == "" || lastName == "" || year == "Select Year") {
        alert("Please fill out all fields");
    } else {
        let data = {
            uid: userID,
            fName: firstName,
            lName: lastName,
            gradYear: year,
        };
        sendData(data);
    }
}
