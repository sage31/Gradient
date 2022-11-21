let year1 = new Date().getFullYear();
let year2 = year1 + 1;
let year3 = year2 + 1;
let year4 = year3 + 1;
let year5 = year4 + 1;
var data;

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

function login() {
  window
    .signIn(window.auth, window.provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = window.gap.credentialFromResult(result);
      const token = credential.accessToken;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      //const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = window.gap.credentialFromError(error);
      // ...
    });
}

function addUser() {
  //user id/email will be set to a global variable in server
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var year = document.getElementById("year").value;

  if (firstName == "" || lastName == "" || year == "Select Year") {
    alert("Please fill out all fields");
  } else {
    //send data here
    let data = {
      uid : window.uid,
      fName: firstName,
      lName: lastName,
      gradYear: year,
    };
    sendData(data);
  }
}

function sendData(data) {
  fetch("https://SCUCrushes-Server.ethancl.repl.co/sendData", {
    //"channel it is being sent to"
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
    //What is being sent
  })
    .then((response) => response.json())
    .then((data) => {
      if(data.success){
        window.location.href = "main.html";
      }
      else{
        alert("You must fill in all fields");
      }
    });
}

function sendUID(x) {
  //variable that is being sent
  fetch("https://SCUCrushes-Server.ethancl.repl.co/sendUID", {
    //"channel it is being sent to"
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ x }),
    //What is being sent
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.ver) {
        alert(
          "Account cannot be created. You must use your SCU email address."
        );
      } else {
        if(data.accExists){
          window.location.href="main.html";
        }
        else{
          document.getElementById("accountForm").style.display = "block"; //also change padding top 1-px;
          document.getElementById("gButton").style.display = "none";
          document.getElementById("note").style.display = "none";
          document.getElementById("loginHeader").style.display = "none";
        }
      }
    });
}
