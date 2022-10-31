var email = "";



function handleCredentialResponse(response) {
    const dataToken = JSON.parse(atob(response.credential.split('.')[1]));
    email = dataToken.email;
    if (email.substring(email.indexOf('@')) != "@scu.edu") {
        document.getElementById("emailErr").innerHTML += "You must use an SCU email to register an account.";
        document.getElementById("emailErr").style.visibility = "visible";
    }
  
    else {
        document.getElementById("emailErr").style.visibility = "hidden";
        const dbref = window.moduleRef(window.database);
        window.moduleGet(window.modChild(dbref, "users/" + email.substring(0, email.indexOf('@')))).then((snapshot) => {
            if (snapshot.exists()) {
                alert("you have an account");
            }
            else {
                document.getElementById("accountForm").style.visibility = "visible";
                createAccount(dataToken.email);
            }
        });
        
    }
}

function createAccount(email) {
    
    
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

function addUserToDataBase() {
   
    
    let id = email.substring(0, email.indexOf('@'));
    alert("id");
    userYear = document.getElementById('year').value;
    fName = document.getElementById('firstName').value;
    lName = document.getElementById('lastName').value;
    window.moduleSet(window.moduleRef(window.database, 'users/' + id), {
        userEmail: email,
        firstName: fName,
        lastName: lName,
        year: userYear
    });
}