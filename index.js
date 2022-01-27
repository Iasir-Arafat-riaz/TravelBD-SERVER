const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
// const port = 5000;
const port = process.env.PORT || 5000;
require("dotenv").config();


app.use(cors());
app.use(express.json());
const { MongoClient } = require("mongodb");

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gukqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("TravelBD");
    const blogs = database.collection("TravellerEXP");
    const reviewCollection=database.collection("reviewCollection")
    const usersCollection = database.collection('users');
    
app.get("/travellerExperience", async(req,res)=>{
    const travellerExp = blogs.find({})
  const result = await travellerExp.toArray()
  res.json(result)
})

// get singleBlog details

app.get("/travellerExperience/:id", async(req,res)=>{
    //  console.log(req.params.id);
     const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await blogs.findOne(query);
        res.json(result);
   })

app.get('/webreviews', async (req, res) => {
    res.send(await reviewCollection.find({}).toArray());
});


// make admin
app.put('/users/admin', async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const updateDoc = { $set: { role: "admin" } };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.json(result);
});

// get admin status
app.get('/users/:email', async (req, res) => {
    const user = await usersCollection.findOne({ email: req.params.email });
    let Admin = false;
    if (user?.role === 'admin') {
        Admin = true;
    };
    res.json({ Admin: Admin });
});

    
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
