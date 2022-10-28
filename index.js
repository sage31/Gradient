function handleCredentialResponse(response) {
    //document.getElementById("credents").innerHTML = response.credential;
    const dataToken = JSON.parse(atob(response.credential.split('.')[1]));
    document.getElementById("credents").innerHTML = dataToken.email + " " + dataToken.given_name
        + " " + dataToken.family_name;

    createAccount(dataToken.email);
    // decodeJwtResponse() is a custom function defined by you
    // to decode the credential response.
    /*const responsePayload = decodeJwtResponse(response.credential);

    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email);
    */
}

function createAccount(email) {
    document.getElementById("accountForm").visibility = visible;
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