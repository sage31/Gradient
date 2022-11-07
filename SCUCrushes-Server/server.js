const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.listen(4042, () => console.log(`Running on port 4040!`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/sendx", (req, res) => {
  console.log(req.body.x);
  //"Printing" the information sent from the web
  const y = "testing";
  res.send({ y });
  //Sending a response to the web
});
