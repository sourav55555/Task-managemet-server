const express = require('express');
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 7000;

// setup middlewares 
app.use(cors())
app.use(express.json());


// rout setup 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clustersorav.tqapkj6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // connect with database 
    const taskCollection = client.db("task-management").collection("task-list");

    // create a task 
    app.post("/task-list", async(req, res)=>{

        const task = req.body;
        console.log(task);
        const result = await taskCollection.insertOne(task);
        res.send(result);

    })

    // get task list 
    app.get("/task-list", async (req,res) => {

        const result = await taskCollection.find().toArray();
        res.send(result);

    })

    // delete a task 
    app.delete("/task-list/:id", async (req, res) => {

        const taskId = req.params.id;
        console.log(taskId);
        const query = { _id: new ObjectId(taskId)};
        const result = await taskCollection.deleteOne(query);
        res.send(result);

    })

    // update status of a task
    app.patch("/task-list/:id", async (req, res)=>{

        const id = req.params.id;
        const status = req.body;
        console.log(id, status.status);
        const filter = {_id: new ObjectId(id)};
        const query = { $set : {"status" : status.status}}
        const result = await taskCollection.updateOne(filter, query);
        res.send(result);

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);




app.get("/", (req,res)=>{
    res.send("task management server online")
})


app.listen(port, ()=>{
    console.log("server online")
})