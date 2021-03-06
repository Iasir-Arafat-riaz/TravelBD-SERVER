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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gukqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("TravelBD");
    const blogs = database.collection("TravellerEXP");
    const reviewCollection = database.collection("reviewCollection");
    const users = database.collection("users");

    app.get("/travellerExperience", async (req, res) => {
      const travellerExp = blogs.find({});
      const result = await travellerExp.toArray();
      res.json(result);
    });

    // get singleBlog details

    app.get("/travellerExperience/:id", async (req, res) => {
      //  console.log(req.params.id);
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogs.findOne(query);
      res.json(result);
    });

    // delete blog api
    app.delete('/deleteblog/:blogId', async (req, res) => {
      const blogId = req.params.blogId;
      const query = { _id: ObjectId(blogId) };
      res.send(await blogs.deleteOne(query))
  })

  // update post status
  app.put('/blog/:id', async (req, res) => {
      const id = req.params.id;
      const updateSatus = req.body.status;
      const filter = { _id: ObjectId(id) };
      const result = await blogs.updateOne(filter, {
          $set: { status: updateSatus }
      });
      res.send(result);
  });

  //BLOG POST
  app.post("/blog", async(req,res)=>{
    const query =req.body
    const result = await blogs.insertOne(query);
    res.json(result)
  })

    //User REVIEWS
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.json(result);
    });

    app.get("/webreviews", async (req, res) => {
      res.send(await reviewCollection.find({}).toArray());
    });

    //post operation for all user
    app.post("/users", async (req, res) => {
      const user = req.body;

      const result = await users.insertOne(user);
      console.log(result);
      res.json(result);
    });

    //update operation fro users (Upsert)
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const option = { upsert: true };
      const updateDoc = { $set: user };
      const result = await users.updateOne(filter, updateDoc, option);
      res.json(result);
    });

    //Set Admin Role
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      console.log(user);
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await users.updateOne(filter, updateDoc);
      res.json(result);
    });

    // check admin for website access (get operation)
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await users.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
      console.log(email, isAdmin);
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
