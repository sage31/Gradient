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

function formatName(name) {
  //only capitalize first letter of name, rest is lowercase
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function removeCrush(removeID, uid, parent, name, year) {
  fetch("https://SCUCrushes-Server.ethancl.repl.co/removeCrush", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ removeID: removeID, uid: uid }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        if (data.match) {
          //find match in matchesHTML and delete it 
          let matchesHTML = document.getElementById("matchesHTML");
          let matches = matchesHTML.children;
          for (let i = 0; i < matches.length; i++) {
            if (matches[i].children[0].children[0].children[0].innerHTML == name && matches[i].children[0].children[0].children[2].innerHTML == year) {
              matches[i].remove();
              break;
            }
          }

          //decrement matchesNum
          let matchesNum = document.getElementById("matchesNum");
          matchesNum.innerHTML = parseInt(matchesNum.innerHTML) - 1;
          if (document.getElementById("matchesNum").innerHTML == 1) {
            document.getElementById("matchText").innerHTML = "Match";
          }
          else {
            document.getElementById("matchText").innerHTML = "Matches";
          }
        }
        //remove crush from HTML
        parent.remove();
        //decrement crushesNum
        let crushesNum = document.getElementById("crushesNum");
        crushesNum.innerHTML = parseInt(crushesNum.innerHTML) - 1;
        if (document.getElementById("crushesNum").innerHTML == 1) {
          document.getElementById("crushText").innerHTML = "Crush";
        }
        else {
          document.getElementById("crushText").innerHTML = "Crushes";
        }


      }
      else {
        alert("Error removing crush.");
      }
    });


}

function openPopup(node) {
  var firstName = node.children[0].children[0].innerHTML;
  var removeID = node.children[2].children[0].innerHTML;
  var year = node.children[0].children[2].innerHTML;

  document.getElementById("popup").style.display = "flex";
  document.getElementById("popup-name").innerHTML = firstName;
  //if they press popup-delete, remove crush
  document.getElementById("popup-delete").onclick = function () {
    removeCrush(removeID, window.userID, node.parentNode, firstName, year);
    closePopup();
  }

}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}
