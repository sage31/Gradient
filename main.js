window.database; // reference to the database
window.moduleSet; // function to set data
window.moduleRef; // function to read data

//onload call opendata
window.onload = keeploggedin;

function keeploggedin() {
  //Store the string "hello" in the local storage
  localStorage.setItem("UUID", "4848484848");
  //Retrieve the string "hello" from the local storage
  var x = localStorage.getItem("UUID");
  alert(x);
}

function opendata() {
  x = "Opened main";
  fetch("https://Server-Test.ethancl.repl.co/opendata", {
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

/*
 
 window.moduleSet(window.moduleRef(window.database, 'users/' + id), {
        userEmail: email,
        firstName: fName,
        lastName: lName,
        year: userYear
    }); 

 */

//https://stackoverflow.com/questions/1354999/keep-me-logged-in-the-best-approach
