import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js'
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js'
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";



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
const analytics = getAnalytics(app);
const database = getDatabase(app);

var email = "";


export function handleCredentialResponse(response) {
    //document.getElementById("credents").innerHTML = response.credential;
    const dataToken = JSON.parse(atob(response.credential.split('.')[1]));
    email = dataToken.email;
    //if the user is not in the database already, create an account
    createAccount(dataToken.email);


}

export function createAccount(email) {
    
    document.getElementById("accountForm").style.visibility = "visible";
    let year1 = new Date().getFullYear();
    let year2 = year1 + 1;
    let year3 = year2 + 1;
    let year4 = year3 + 1;
    let year5 = year4 + 1;

    y1 = document.getElementById("y1");
    y1.innerHTML = year1;
    y2 = document.getElementById("y2");
    y2.innerHTML = year2;
    y3 = document.getElementById("y3");
    y3.innerHTML = year3;
    y4 = document.getElementById("y4");
    y4.innerHTML = year4;
    y5 = document.getElementById("y5");
    y5.innerHTML = year5;

}

export function addUserToDataBase() {
    // Import the functions you need from the SDKs you need
  
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    
    // Initialize Firebase
    

    
    
    
    userYear = document.getElementById('year').value;
    fName = document.getElementById('firstName').value;
    lName = document.getElementById('lastName').value;
    set(ref(database, 'users/' + email), {
        firstName: fName,
        lastName: lName,
        year: userYear
    });
    /*
    alert("first name: " + firstName + " year: " + userYear + " lastName: " + lastName + " email: " + email);
    
    fetch("http://localhost:3066/datasend", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({ email: email, firstName: firstName, lastName: lastName, year: year }),
    */
}