//onload call opendata
window.onload = keeploggedin;
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


function keeploggedin() {
  //Store the string "hello" in the local storage
  localStorage.setItem("UUID", "4848484848");
  //Retrieve the string "hello" from the local storage
  var x = localStorage.getItem("UUID");
  //alert(x);
}

function formatName(name) {
  //only capitalize first letter of name, rest is lowercase
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}



function removeCrush(removeID, uid) {
  fetch("https://Server-Test.ethancl.repl.co/removeCrush", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ removeID, uid }),
  });


}


function opendata() {
  x = "Opened main html";
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
//https://stackoverflow.com/questions/1354999/keep-me-logged-in-the-best-approach
