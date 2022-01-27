const express = require("express");
const cors = require("cors");

const app = express();
// const port = 5000;
const port = process.env.PORT || 5000;
require("dotenv").config();


app.use(cors());
app.use(express.json());
const { MongoClient } = require("mongodb");

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}KlAcunVMDY1MdJm1@cluster0.gukqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("TravelBD");
    const blogs = database.collection("TravellerEXP");
    // query for movies that have a runtime less than 15 minutes
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running travel BD SERVER");
});

app.listen(port, () => {
  console.log("running server on port", port);
});
