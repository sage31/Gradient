var email = "";
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
      
      sendx(result);
      /*
      
      if (user.email.substring(user.email.indexOf("@")) != "@scu.edu") {
        document.getElementById("note").style.color = "red";
        alert("You must use your SCU email");
      } else {
        sendx(result);
        const dbref = window.moduleRef(window.database);
        window
          .moduleGet(window.modChild(dbref, "users/" + user.uid))
          .then((snapshot) => {
            if (snapshot.exists()) {
              //sign them in
            } else {
              document.getElementById("accountForm").style.display = "block";
              document.getElementById("gButton").style.display = "none";
              document.getElementById("note").style.display = "none";
            }
          });

        // ...
      }
      */
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

function handleCredentialResponse(response) {
  const dataToken = JSON.parse(atob(response.credential.split(".")[1]));
  email = dataToken.email;
  if (email.substring(email.indexOf("@")) != "@scu.edu") {
    document.getElementById("emailErr").innerHTML +=
      "You must use an SCU email to register an account.";
    document.getElementById("emailErr").style.visibility = "visible";
  } else {
    document.getElementById("emailErr").style.visibility = "hidden";
    const dbref = window.moduleRef(window.database);
    window
      .moduleGet(
        window.modChild(
          dbref,
          "users/" + email.substring(0, email.indexOf("@"))
        )
      )
      .then((snapshot) => {
        if (snapshot.exists()) {
          alert("You have an account");
          //sign them in
        } else {
          document.getElementById("accountForm").style.display = "block";
          document.getElementById("gButton").style.display = "none";
          document.getElementById("note").style.display = "none";
        }
      });
  }
}


function addUser() {
  //user id/email will be set to a global variable in server
  var firstName = document.getElementById("firstName").value;
  var lastName = document.getElementById("lastName").value;
  var year = document.getElementById("year").value;

  if(firstName == "" || lastName == "" || year == "Select Year"){
    alert("Please fill out all fields");
  }else{
      //send data here
      let data = {
        fName : firstName,
        lName : lastName,
        gradYear : year
      };
      sendData(data);
  window.moduleSet(window.moduleRef(window.database, "users/" + id), {
    userEmail: email,
    firstName: fName,
    lastName: lName,
    year: userYear,
  });
  }
  
}

function sendData(data){
  fetch("https://Server-Test.ethancl.repl.co/sendData", {
    //"channel it is being sent to"

    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({data}),
    //What is being sent
    })
    .then((response) => response.json())
    .then((data) => {
      //alert(JSON.stringify(data));
      alert(data);

      //Alerting the response from server.js
    });
}

function sendx(x) {
  //variable that is being sent
  fetch("https://Server-Test.ethancl.repl.co/sendx", {
    //"channel it is being sent to"

    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({x}),
    //What is being sent
  })
    .then((response) => response.json())
    .then((data) => {
      //alert(JSON.stringify(data));
      if(!data.ver){
        alert("Account cannot be created. You must use your SCU email address.");
      }

      else{
        if(!data.accExists){
          document.getElementById("accountForm").style.display = "block"; //also change padding top 1-px;
          document.getElementById("gButton").style.display = "none";
          document.getElementById("note").style.display = "none";
          document.getElementById("loginHeader").style.display = "none";
        }
        else alert("Account already exists");
      }


      //Alerting the response from server.js
    });
}
