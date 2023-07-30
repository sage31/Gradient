import { initializeApp } from " https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyDQF_w0iISHkuR_2HJUkpQhz5v7LKmhjPo", authDomain: "scucrushes-a9663.firebaseapp.com",
    databaseURL: "https://scucrushes-a9663-default-rtdb.firebaseio.com", projectId: "scucrushes-a9663",
    storageBucket: "scucrushes-a9663.appspot.com", messagingSenderId: "1027917905596",
    appId: "1:1027917905596:web:54c1a478e31f4007c75ab9", measurementId: "G-CFJTYX3MYW",
};
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let status = "crushes";
const crushBtn = document.getElementById("status-crushes");
const admirerBtn = document.getElementById("status-admirers");
const matchBtn = document.getElementById("status-matches");

crushBtn.addEventListener("click", () => {
    if (status != "crushes") {
        status = "crushes";
        document.getElementById("crushesHTML").style.display = "flex";
        document.getElementById("admirersHTML").style.display = "none";
        document.getElementById("matchesHTML").style.display = "none";
    }
});
admirerBtn.addEventListener("click", () => {
    if (status != "admirers") {
        status = "admirers";
        document.getElementById("admirersHTML").style.display = "flex";
        document.getElementById("crushesHTML").style.display = "none";
        document.getElementById("matchesHTML").style.display = "none";
    }
});
matchBtn.addEventListener("click", () => {
    if (status != "matches") {
        status = "matches";
        document.getElementById("matchesHTML").style.display = "flex";
        document.getElementById("crushesHTML").style.display = "none";
        document.getElementById("admirersHTML").style.display = "none";
    }
});
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        fetch("https://SCUCrushes-Server.ethancl.repl.co/checkAccountAndLoadData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ uid: uid, community: localStorage.getItem("community"), }),
        }).then((response) => response.json())
            .then((data) => {
                if (!data.verified) {
                    alert("You must finish setting up your account before accessing this page.")
                    window.location.href = "index.html";
                }
                else {
                    localStorage.setItem("community", data.community);
                    // Add in the crushes.
                    for (let crush of data.crushes) {
                        document.getElementById("crushesHTML").innerHTML +=
                            `<div style="cursor:pointer" class="list-item" onclick="openPopup(this.childNodes[1])">
                                        <div class="list-item-info">
                                        <div class="title-wrapper section">
                                            <span class="name">` + formatName(crush.firstName) + " " + formatName(crush.lastName) + `</span>
                                            <span class="dot"> · </span>
                                            <span class="year">` + crush.year + `</span>
                                        </div>
                                        <div class="tags section">
                                            <span class="tag">Crush</span>
                                        </div>
                                        <div class="numbers section">
                                            <span style="display:none" class="removeID">`+ crush.removeID + `</span>
                                        </div>
                                        </div>
                                    </div>`;
                    }
                    document.getElementById("crushesNum").innerHTML = data.crushes.length;
                    if (document.getElementById("crushesNum").innerHTML == 1) {
                        document.getElementById("crushText").innerHTML = "Crush";
                    }

                    // Add in admirers.

                    for (let admirer of data.admirers) {
                        document.getElementById("admirersHTML").innerHTML +=
                            `<div class="list-item">
                                        <div class="list-item-info">
                                        <div class="title-wrapper section">
                                            <span class="name">???</span>
                                            <span class="dot"> · </span>
                                            <span class="year">` + admirer + `</span>
                                        </div>
                                        <div class="tags section">
                                            <span class="tag">Secret Admirer</span>
                                        </div>
                                        <div class="numbers section">

                                        </div>
                                        </div>
                                    </div>`;
                    }
                    document.getElementById("admirerNum").innerHTML = data.admirers.length;
                    if (document.getElementById("admirerNum").innerHTML == 1) {
                        document.getElementById("admirerText").innerHTML = "Secret Admirer";
                    }

                    // Add in any matches.

                    for (let match of data.matches) {
                        document.getElementById("matchesHTML").innerHTML +=
                            `<div class="list-item">
                                        <div class="list-item-info">
                                        <div class="title-wrapper section">
                                            <span class="name">` + formatName(match.fName) + " " + formatName(match.lName) + `</span>
                                            <span class="dot"> · </span>
                                            <span class="year">` + match.gYear + `</span>
                                        </div>
                                        <div class="tags section">
                                            <span class="tag">Match</span>
                                        </div>
                                        <div class="numbers section">
                                        </div>
                                        </div>
                                    </div>`;
                    }
                    document.getElementById("matchesNum").innerHTML = data.matches.length;
                    if (data.matches.length == 1) {
                        document.getElementById("matchText").innerHTML = "Match";
                    }
                }
            });
    } else {
        // Redirect to login page.
        window.location.href = "index.html";
    }
})

const logoutBtn = document.getElementById('logout');
logoutBtn.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut();
});

const crushButton = document.getElementById('addCrush');
crushButton.addEventListener('click', e => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const year = document.getElementById('year').value;
    // Clear values once received.
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("year").value = "GRADUATION YEAR";
    const uid = auth.currentUser.uid;
    const community = localStorage.getItem("community");
    fetch("https://SCUCrushes-Server.ethancl.repl.co/addCrush", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, year, uid, community }),
    }).then((response) => response.json())
        .then((data) => {
            if (data.success) {
                for (let crush of data.removeIDs) {
                    document.getElementById("crushesHTML").innerHTML +=
                        `<div style="cursor:pointer" class="list-item" onclick="openPopup(this.childNodes[1])">
                            <div class="list-item-info">
                            <div class="title-wrapper section">
                                <span class="name">` + formatName(firstName) + " " + formatName(lastName) + `</span>
                                <span class="dot"> · </span>
                                <span class="year">` + year + `</span>
                            </div>
                            <div class="tags section">
                                <span class="tag">Crush</span>
                            </div>
                            <div class="numbers section">
                                <span style="display:none" class="removeID">`+ crush + `</span>
                            </div>
                            </div>
                        </div>`;
                }
                document.getElementById("crushesNum").innerHTML = parseInt(document.getElementById("crushesNum").innerHTML) +
                    data.removeIDs.length;
                if (document.getElementById("crushesNum").innerHTML == 1) {
                    document.getElementById("crushText").innerHTML = "Crush";
                }
                else {
                    document.getElementById("crushText").innerHTML = "Crushes";
                }
                if (data.removeIDs.length == 0) {
                    alert("You already have this crush.");
                }
                else {
                    if (data.removeIDs[0] == (firstName.toLowerCase() + lastName.toLowerCase() + year))
                        alert("Note: crush has not yet made an account.");
                }
                for (let i = 0; i < data.matches; i++) {
                    document.getElementById("matchesHTML").innerHTML +=
                        `<div class="list-item">
                        <div class="list-item-info">
                        <div class="title-wrapper section">
                            <span class="name">` + formatName(firstName) + " " + formatName(lastName) + `</span>
                            <span class="dot"> · </span>
                            <span class="year">` + year + `</span>
                        </div>
                        <div class="tags section">
                            <span class="tag">Match</span>
                        </div>
                        <div class="numbers section">
                        </div>
                        </div>
                    </div>`;
                }
                document.getElementById("matchesNum").innerHTML = parseInt(document.getElementById("matchesNum").innerHTML)
                    + parseFloat(data.matches);
                if (document.getElementById("matchesNum").innerHTML == 1) {
                    document.getElementById("matchText").innerHTML = "Match";
                }
                else {
                    document.getElementById("matchText").innerHTML = "Matches";
                }
            }
            else {
                alert("Error adding crush. Did you enter in all the fields?");
            }
        });
});
