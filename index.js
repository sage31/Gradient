var email = "";
let year1 = new Date().getFullYear();
let year2 = year1 + 1;
let year3 = year2 + 1;
let year4 = year3 + 1;
let year5 = year4 + 1;

sendx();

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
	window.signIn(window.auth, window.provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = window.gap.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;
			if(user.email.substring(user.email.indexOf('@')) != "@scu.edu"){
				document.getElementById("note").style.color = "red";
				document.getElementById("note").style.font-weight = "bold";
				
			}
			else{
				const dbref = window.moduleRef(window.database);
				window
				  .moduleGet(
					window.modChild(
					  dbref,
					  "users/" + user.uid)
					)
				  )
				  .then((snapshot) => {
					if (snapshot.exists()) {
					  //sign them in
					} else {
					  document.getElementById("accountForm").style.visibility = "visible";
					  createAccount(user.uid);
					}
			}
			
			// ...
		}).catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
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

function createAccount(email) {}

function addUserToDataBase() {
  document.getElementById("accountForm").style.visibility = "visible";
  
  //user id/email will be set to a global variable in server
  userYear = document.getElementById("year").value;
  fName = document.getElementById("firstName").value;
  lName = document.getElementById("lastName").value;
  window.moduleSet(window.moduleRef(window.database, "users/" + id), {
    userEmail: email,
    firstName: fName,
    lastName: lName,
    year: userYear,
  });
}

function sendx() {
  var x = "test test test";
  fetch("http://localhost:4042/sendx", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ x }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(JSON.stringify(data));
    });
}
