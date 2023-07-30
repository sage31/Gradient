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
      let snapshotQuery = database.ref(`users/${community}/${uid}`);
      let snapshot = await snapshotQuery.once("value");
      if (snapshot.exists()) {
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

        //if they have existing admirers, add them to their user 
        let queryString = `${community}/${fName}${lName}${gradYear}`;
        let adList = await getAndRemoveAdmirers(queryString);
        //for each existing admirer, make sure to update their crushes so that includes the real ID
        if (adList != null) {
          for (admirer of adList) {

            //add the new ID to the list
            admirerQuery = database.ref(`users/${community}/${admirer.uid}`);
            data = await admirerQuery.once('value');
            let userInfo = await data.val();
            let currentCrushes = userInfo.crushes;
            for (crush of currentCrushes) {
              if (crush != null) {
                if (crush.uid == queryString) {
                  crush.uid = uid;
                  break;
                }
              }
            }
            //remove old ID from their list
            await database.ref(`users/${community}/${admirer.uid}`).update({ crushes: currentCrushes });

          }
          await database.ref(`users/${community}/${uid}`).update({ admirers: adList });
        }
        //add them to the ID query 
        let existingQuery = await database.ref(`query/${queryString}`).once('value');
        let existingIDs = await existingQuery.val();
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
  const admirersRef = database.ref(`query/${queryString}/admirers`);
  let data = await admirersRef.once('value');
  if (data.exists()) {
    let val = await data.val();
    admirersRef.remove()
    return val;
  }
  return null;
}

app.post("/checkAC", async (req, res) => {
  const uid = req.body.uid;
  const community = req.body.community;
  let acQuery = database.ref('users/' + uid);
  let acData = await acQuery.once("value");
  if (acData.exists()) {
    res.send(JSON.stringify({ verified: true }));
  }
  else {
    res.send(JSON.stringify({ verified: false }));
  }

});

app.post("/loadData", async (req, res) => {
  uid = req.body.uid;
  let userQuery = await database.ref('users/' + uid).once('value');
  let userData = await userQuery.val();
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
      crushQuery = await database.ref('users/' + crush.uid).once('value');
      crushData = await crushQuery.val();
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
  res.send(JSON.stringify({ crushes: crushesToSend, admirers: admirersToSend, matches: matches }));
  //send back all the necessary data
})

app.post("/removeCrush", async (req, res) => {
  let uid = req.body.uid;
  let removeID = decryptData(req.body.removeID);
  let myQuery = await database.ref('users/' + uid).once('value');
  let myData = await myQuery.val();
  let match = false;
  if (removeID.length < 1) {
    removeID = req.body.removeID;
    //locate removeID in crushes

    let newCrushes = [];
    for (let i = 0; i < myData.crushes.length; i++) {
      if (myData.crushes[i].uid != removeID) {
        newCrushes.push(myData.crushes[i]);
      }
    }

    //update crushes
    await database.ref('users/' + uid).update({ crushes: newCrushes });


    //remove it from the query admirers
    let admirerQuery = await database.ref('query/' + removeID).once('value');
    let admirerData = admirerQuery.val();
    let adPath = null;
    for (let i = 0; i < admirerData.admirers.length; i++) {
      if (admirerData.admirers[i].uid == uid) {
        adPath = database.ref('query/' + removeID + '/admirers/' + i);
        break;
      }
    }
    if (adPath == null) {
      res.send(JSON.stringify({ success: false, match: match }));
    }
    else
      adPath.remove();
  }
  else {
    //process is the same except you remove from the
    //person's admirers, not query
    //locate removeID in crushes
    let newCrushes = [];
    for (let i = 0; i < myData.crushes.length; i++) {
      if (myData.crushes[i].uid != removeID) {
        newCrushes.push(myData.crushes[i]);
      }
    }

    //update crushes
    await database.ref('users/' + uid).update({ crushes: newCrushes });

    //remove it from the crush's admirers
    let admirerQuery = await database.ref('users/' + removeID).once('value');
    let admirerData = admirerQuery.val();
    let adPath = null;
    for (let i = 0; i < admirerData.admirers.length; i++) {
      if (admirerData.admirers[i].uid == uid) {
        adPath = database.ref('users/' + removeID + '/admirers/' + i);
        break;
      }
    }
    if (adPath == null) {
      res.send(JSON.stringify({ success: false, match: match }));
    }
    else
      adPath.remove();
    //see if they were a match
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
  let queryString = fName + lName + year;
  let matches = 0;
  let userExists = false;
  let removeIDs = [];
  if (fName == "" || lName == "" || year == "" || year == "GRADUATION YEAR" || uid == "") {
    res.send(JSON.stringify({ success: false }));
    return;
  }
  // check if user exists
  let userQuery = database.ref('query/' + queryString + '/userIDs');
  let userData = await userQuery.once("value");
  // if user exists, see if they like them back
  if (userData.exists()) {
    userExists = true;
    let people = await userData.val();
    for (person of people) {
      let personDataQuery = database.ref('users/' + person);
      let theirSnapshot = await personDataQuery.once('value');
      let personData = await theirSnapshot.val();
      if (personData.crushes != null) {
        // if they do, send back a match
        for (crush of personData.crushes) {
          if (crush != null) {
            if (crush.uid == uid) {
              matches++;
              break;
            }
          }
        }
      }
      // add them to the other persons admirers
      let adList;
      let myData = await database.ref('users/' + uid).once('value');
      let myYear = myData.val().year;
      if (personData.admirers != null) {
        adList = personData.admirers;
        let includes = false
        for (admirer of adList) {
          if (admirer.uid == uid) {
            includes = true;
            break;
          }
        }
        if (!includes)
          adList.push({ uid: uid, year: myYear });
      }
      else {
        adList = [{ uid: uid, year: myYear }];
      }
      //update the other persons admirers
      database.ref('users/' + person).update({ admirers: adList })
      //add to current persons crushes
      let crushesQuery = database.ref('users/' + uid);
      let crushData = await crushesQuery.once('value');
      let me = await crushData.val();
      if (me.crushes != null) {
        crushesList = me.crushes;
        let includes = false;
        for (crush of crushesList) {
          if (crush.uid == person) {
            includes = true;
            break;
          }
        }
        if (!includes) {
          crushesList.push({ uid: person, firstName: personData.firstName, lastName: personData.lastName, year: personData.year });
          removeIDs.push(encryptStringData(person));
        }
      }
      else {
        crushesList = [{ uid: person, firstName: personData.firstName, lastName: personData.lastName, year: personData.year }];
        removeIDs.push(encryptStringData(person));
      }

      await database.ref('users/' + uid).update({ crushes: crushesList });
    }
  }
  //else, add userID to temp admirers
  else {
    //get current temp list
    let adQuery = database.ref('query/' + queryString + '/admirers');
    let list;
    let tempList = await adQuery.once('value');
    let myData = await database.ref('users/' + uid).once('value');
    let myYear = myData.val().year;
    if (tempList.exists()) {
      list = await tempList.val();
      let includes = false;
      for (admirer of list) {
        if (admirer.uid == uid) {
          includes = true;
          break;
        }
      }
      if (!includes) {
        list.push({ uid: uid, year: myYear });
      }
    }
    else {
      list = [{ uid: uid, year: myYear }];
    }
    await database.ref('query/' + queryString).update({
      admirers: list
    })

    let crushesQuery = database.ref('users/' + uid);
    let crushData = await crushesQuery.once('value');
    let me = crushData.val();
    if (me.crushes != null) {
      crushesList = me.crushes;
      let tempExists = false;
      for (crush of crushesList) {
        if (crush.uid == queryString) {
          tempExists = true;
          break;
        }
      }
      if (!tempExists) {
        crushesList.push({ uid: queryString, firstName: fName, lastName: lName, year: year });
        removeIDs.push(queryString);
      }
    }
    else {
      crushesList = [{ uid: queryString, firstName: personData.firstName, lastName: personData.lastName, year: personData.year }];
      removeIDs.push(queryString);
    }
    await database.ref('users/' + uid).update({ crushes: crushesList });
  }
  res.send(JSON.stringify({ success: true, matches: matches, removeIDs: removeIDs }));
});