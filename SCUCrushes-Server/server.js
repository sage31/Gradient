const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.listen(4042, () => console.log(`Running on port 4040!`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/sendx", (req, res) => {
  console.log(req.body.x);
  const x = "testing";
  res.send({ x });
});
