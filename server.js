const express = require("express");
const app = express();
const cors = require("cors");
const CryptoJS = require("crypto-js");
var admin = require("firebase-admin");
var serviceAccount = require("./scucrushes-a9663-firebase-adminsdk-2sc88-2ff6c09a9c.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://scucrushes-a9663-default-rtdb.firebaseio.com"
});
var database = admin.database();

app.use(cors());
app.listen(4042, () => console.log(`Running on port 4042!`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function encryptStringData(data) {
  return CryptoJS.AES.encrypt(data, "oqi34b").toString();
}

function decryptData(encryptedData) {
  return CryptoJS.AES.decrypt(encryptedData, "oqi34b").toString(CryptoJS.enc.Utf8);
}

app.post("/sendUID", (req, res) => {
  var uid = req.body.uid;
  var verified = false;
  admin.auth().getUser(uid)
    .then(async (userRecord) => {

      var email = userRecord.email;
      if (email.substring(email.length - 4) == ".edu") {
        verified = true;
      }
      var atSymbolIndex = email.indexOf('@');
      var community = (email.substring(atSymbolIndex + 1, email.indexOf('.', atSymbolIndex))).toLowerCase();
      let account = database.ref(`users/${community}/${uid}`).once("value");
      if (account.exists()) {
        res.send(JSON.stringify({ ver: verified, accExists: true, community: community }));
      }
      else {
        res.send(JSON.stringify({ ver: verified, accExists: false, community: community }));
      }
    })
    .catch((error) => {
      console.log('Error fetching user data:', error);
    });
});

app.post("/sendData", (req, res) => {
  var uid = req.body.data.uid;
  var community = req.body.data.community;
  var fName = req.body.data.fName.toLowerCase();
  var lName = req.body.data.lName.toLowerCase();
  var gradYear = req.body.data.gradYear;

  if (community == "" || fName == "" || lName == "" || gradYear == "" || uid == "") {
    res.send(JSON.stringify({ success: false }));
    return;
  }
  else {
    admin.auth().getUser(uid)
      .then(async (userRecord) => {
        var email = userRecord.email;
        if (email.substring(email.length - 4) != ".edu") {
          res.send(JSON.stringify({ success: false }));
          return;
        }
        //add the user to the general database
        database.ref(`users/${community}/${uid}`).set({
          userEmail: email,
          firstName: fName,
          lastName: lName,
          year: gradYear
        });

        // If they have existing admirers, add them to their account.
        let queryString = `${community}/${fName}${lName}${gradYear}`;
        let admirerList = await getAndRemoveAdmirers(queryString);
        // For each existing admirer, make sure to update their crushes so that includes the real ID.
        if (admirerList != null) {
          for (admirer of admirerList) {

            // Add the new ID to the list.
            admirerQuery = await database.ref(`users/${community}/${admirer.uid}`).once('value');
            let admirerInfo = admirerQuery.val();
            let admirerCrushes = admirerInfo.crushes;
            for (crush of admirerCrushes) {
              if (crush != null) {
                if (crush.uid == queryString) {
                  crush.uid = uid;
                  break;
                }
              }
            }
            // Replace old ID with new ID in their list.
            database.ref(`users/${community}/${admirer.uid}`).update({ crushes: admirerCrushes });
          }
          database.ref(`users/${community}/${uid}`).update({ admirers: admirerList });
        }
        //add them to the ID query 
        let existingQuery = await database.ref(`query/${queryString}`).once('value');
        let existingIDs = existingQuery.val();
        let newID = [uid];
        let hasExistingIDs = existingIDs != null;
        database.ref(`query/${queryString}`).set({
          userIDs: (hasExistingIDs ? existingIDs.userIDs.concat(newID) : newID)
        })
        res.send(JSON.stringify({ success: true }));
      })
      .catch((error) => {
        console.log('Error fetching user data:', error);
        res.send(JSON.stringify({ success: false }));
      });
  }
});


async function getAndRemoveAdmirers(queryString) {
  const admirers = await database.ref(`query/${queryString}/admirers`).once('value');
  if (admirers.exists()) {
    let val = admirers.val();
    admirers.remove();
    return val;
  }
  return null;
}

app.post("/checkAccountAndLoadData", async (req, res) => {
  const uid = req.body.uid;
  // Get email and community.
  let userRecord = await admin.auth().getUser(uid);
  let email = userRecord.email;
  let atSymbolIndex = email.indexOf('@');
  let community = (email.substring(atSymbolIndex + 1, email.indexOf('.', atSymbolIndex))).toLowerCase();

  let userData= await database.ref(`users/${community}/${uid}`).once("value");
  if (!userData.exists()) {
    res.send(JSON.stringify({ verified: false }));
    return;
  }
  else {
    userData = userData.val();
    let crushes = userData.crushes == null ? [] : userData.crushes;
    let crushesToSend = [];
    let admirers = userData.admirers == null ? [] : userData.admirers;
    let admirersToSend = [];
    for (admirer of admirers) {
      admirersToSend.push(admirer.year);
    }
    let matches = [];
    for (crush of crushes) {
      let queryString = crush.firstName.toLowerCase() + crush.lastName.toLowerCase() + crush.year
      removeID = crush.uid != queryString ? encryptStringData(crush.uid) : queryString;
      crushesToSend.push({
        firstName: crush.firstName,
        lastName: crush.lastName,
        year: crush.year,
        removeID: removeID
      });
      if (crush.uid != queryString) {
        crushQuery = await database.ref(`users/${community}/${crush.uid}`).once('value');
        crushData = crushQuery.val();
        if (crushData.crushes != null) {
          let match = false;
          for (theirCrush of crushData.crushes) {
            if (theirCrush != null) {
              if (theirCrush.uid == uid)
                match = true;
            }

          }
          if (match) {
            matches.push({
              fName: crushData.firstName,
              lName: crushData.lastName,
              gYear: crushData.year
            })
          }
        }
      }
    }
    // Send back all the necessary data.
    res.send(JSON.stringify({ verified: true, community: community, crushes: crushesToSend, admirers: admirersToSend, matches: matches }));
  }
});

app.post("/removeCrush", async (req, res) => {
  let uid = req.body.uid;
  let community = req.body.community;
  let removeID = decryptData(req.body.removeID);
  let myQuery = await database.ref(`users/${community}/${uid}`).once('value');
  let myData = myQuery.val();
  let match = false;
  if (removeID.length < 1) {
    removeID = req.body.removeID;
    // Locate removeID in crushes.
    let newCrushes = [];
    for (let i = 0; i < myData.crushes.length; i++) {
      if (myData.crushes[i].uid != removeID) {
        newCrushes.push(myData.crushes[i]);
      }
    }

    // Update crushes.
    database.ref(`users/${community}/${uid}`).update({ crushes: newCrushes });

    // Remove it from the temp admirers list.
    let admirerQuery = await database.ref(`query/${community}/${removeID}`).once('value');
    let admirerData = admirerQuery.val();
    let admirerPath = null;
    for (let i = 0; i < admirerData.admirers.length; i++) {
      if (admirerData.admirers[i].uid == uid) {
        admirerPath = database.ref(`query/${community}/${removeID}/admirers/${i}`);
        break;
      }
    }
    if (admirerPath == null) 
      res.send(JSON.stringify({ success: false, match: match }));
    else
      admirerPath.remove();
  }
  else {
    // Process is the same except you remove from the
    // person's admirers, not query.
    // Locate removeID in crushes
    let newCrushes = [];
    for (let i = 0; i < myData.crushes.length; i++) {
      if (myData.crushes[i].uid != removeID) {
        newCrushes.push(myData.crushes[i]);
      }
    }
    // Update crushes.
    database.ref(`users/${community}/${uid}`).update({ crushes: newCrushes });

    // Remove it from the crush's admirers list.
    let admirerQuery = await database.ref(`users/${community}/${removeID}`).once('value');
    let admirerData = admirerQuery.val();
    let admirerPath = null;
    for (let i = 0; i < admirerData.admirers.length; i++) {
      if (admirerData.admirers[i].uid == uid) {
        admirerPath = database.ref(`users/${community}/${removeID}/admirers/${i}`);
        break;
      }
    }
    if (admirerPath == null)
      res.send(JSON.stringify({ success: false, match: match }));
    else
      admirerPath.remove();
    // See if they were a match.
    for (let i = 0; i < admirerData.crushes.length; i++) {
      if (admirerData.crushes[i].uid == uid) {
        match = true;
        break;
      }
    }
  }
  res.send(JSON.stringify({ success: true, match: match }));
});

app.post("/addCrush", async (req, res) => {
  let fName = req.body.firstName.toLowerCase();
  let lName = req.body.lastName.toLowerCase();
  let year = req.body.year;
  let uid = req.body.uid;
  let community = req.body.community;
  let queryString = `${fName}${lName}${year}`;
  let matches = 0;
  let removeIDs = [];
  if (fName == "" || lName == "" || year == "" || year == "GRADUATION YEAR" || uid == "" || community == "") {
    res.send(JSON.stringify({ success: false }));
    return;
  }

  let myData = await database.ref(`users/${community}/${uid}`).once('value');
  myData = myData.val();
  let myYear = myData.year;
  // Check if user exists.
  let userList = await database.ref(`query/${community}/${queryString}/userIDs`).once("value");
  // If user exists, see if they like them back.
  if (userList.exists()) {
    let people = userList.val();
    for (person of people) {
      let personDataQuery = await database.ref(`users/${community}/${person}`).once('value');
      let personData = personDataQuery.val();
      if (personData.crushes != null) {
        // If they do, send back a match.
        for (crush of personData.crushes) {
          if (crush != null) {
            if (crush.uid == uid) {
              matches++;
            }
          }
        }
      }

      // Add them to the other person's admirers.
      let admirerList = personData.admirers != null ? personData.admirers : [];
      let admirerAlreadyExists = false;
      for (admirer of admirerList) {
        if (admirer.uid == uid) {
          admirerAlreadyExists = true;
          break;
        }
      }
      if (!admirerAlreadyExists) {
        // Update the other person's admirers.
        admirerList.push({ uid: uid, year: myYear });
        database.ref(`users/${community}/${person}`).update({ admirers: admirerList })
      }

      // Add to current person's crushes.
      let crushesList = myData.crushes != null ? myData.crushes : [];
      let crushAlreadyExists = false;
      for (crush of crushesList) {
        if (crush.uid == person) {
          crushAlreadyExists = true;
          break;
        }
      }
      if (!crushAlreadyExists) {
        crushesList.push({ uid: person, firstName: fName, lastName: lName, year: year });
        removeIDs.push(encryptStringData(person));
        database.ref(`users/${community}/${uid}`).update({ crushes: crushesList });
      }
    }
  }
  // If the user does not exist, create a temporary admirer list for them and add current uid to it. 
  else {
    // Get current temporary entry, if it exists.
    let tempList = await database.ref(`query/${queryString}/admirers`).once('value');
    tempList = tempList.exists() ? tempList.val() : [];
    let admirerAlreadyExists = false;
    for (admirer of tempList) {
      if (admirer.uid == uid) {
        admirerAlreadyExists = true;
        break;
      }
    }
    if (!admirerAlreadyExists) {
      tempList.push({ uid: uid, year: myYear });
      database.ref(`query/${community}/${queryString}`).update({
        admirers: tempList
      });
    }

    // Add to current person's crushes.
    crushesList = myData.crushes;
    if (crushesList == null)
      crushesList = [];
    let tempCrushExists = false;
    for (crush of crushesList) {
      if (crush.uid == queryString) {
        tempCrushExists = true;
        break;
      }
    }
    if (!tempCrushExists) {
      crushesList.push({ uid: queryString, firstName: fName, lastName: lName, year: year });
      removeIDs.push(queryString);
      database.ref(`users/${community}/${uid}`).update({ crushes: crushesList });
    }

  }
  res.send(JSON.stringify({ success: true, matches: matches, removeIDs: removeIDs }));
});