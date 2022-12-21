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



function removeCrush(removeID, uid, parent, name, year) {
  fetch("https://Server-Test.ethancl.repl.co/removeCrush", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ removeID, uid }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.success) {
        /*
        if (data.match) {
          //find match in HTML table and remove it

          let firstName = name.substring(0, name.indexOf(" ")));
          let lastName = name.substring(name.indexOf(" ") + 1);

          console.log(firstName + " " + lastName + " " + year);
          let matches = document.getElementById("matchesTable").getElementsByTagName("tbody")[0];

          for (let i = 0; i < matches.rows.length; i++) {
            let match = matches.rows[i];
            if (match.cells[1].innerHTML == firstName && match.cells[2].innerHTML == lastName && match.cells[3].innerHTML == year) {
              match.remove();
              break;
            }
          }
          //decrement matchesNum
          let matchesNum = document.getElementById("matchesNum");
          matchesNum.innerHTML = parseInt(matchesNum.innerHTML) - 1;
        }*/
        //remove crush from HTML table using removeID
        parent.remove();
        //decrement crushesNum
        let crushesNum = document.getElementById("crushesNum");
        crushesNum.innerHTML = parseInt(crushesNum.innerHTML)--;


      }
      else {
        alert("Error removing crush.");
      }
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

function openPopup(node) {
  var firstName = node.children[0].children[0].innerHTML;
  var removeID = node.children[2].children[0].innerHTML;
  var year = node.children[0].children[2].innerHTML;

  document.getElementById("popup").style.display = "flex";
  document.getElementById("popup-name").innerHTML = firstName;
  document.getElementById("popup-delete").addEventListener("click", () => {
    removeCrush(removeID,window.uid,node.parentNode,firstName, year)
    closePopup();
  });
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}
