var email = "";



function handleCredentialResponse(response) {
    //document.getElementById("credents").innerHTML = response.credential;
    const dataToken = JSON.parse(atob(response.credential.split('.')[1]));
    email = dataToken.email;
    //if the user is not in the database already, create an account
    createAccount(dataToken.email);
}

function createAccount(email) {
    
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

function addUserToDataBase() {
   
    
    
    userYear = document.getElementById('year').value;
    fName = document.getElementById('firstName').value;
    lName = document.getElementById('lastName').value;
    window.moduleSet(ref(database, 'users/' + email), {
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