const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');


const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) =>{
    res.send("Toy Marketplace server is ready for providing data");
});

/***
 * _______________________________________________
 * 
 * Database connection and task section start here
 * ________________________________________________
 */



const uri = `mongodb+srv://${process.env.dbUSER}:${process.env.dbPassword}@cluster0.qibhtxb.mongodb.net/?retryWrites=true&w=majority`;

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
    // client.connect();
    const toyCollection = client.db('toysDB').collection('toy');
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get("/:type", async(req, res)=>{
      const toyType = req.params.type;
      const query = {subCategoryType: toyType}

      const options = {

      projection: { quantity: 1,rating: 1, price: 1, name: 1,picture:1, _id: 1 },
    };

      const sameType = await toyCollection.find(query,options).limit(3)
      const items = await sameType.toArray()
      res.send(items)
    });


    app.get("/allToys/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const singleItem = await toyCollection.findOne(query);
      res.send(singleItem)
    })




    
    const result = await toyCollection.createIndex({name:1});

    app.get("/allToy/search/:text", async(req, res) =>{

      const searchText = req.params.text;

      const result = await toyCollection.find({ name: { $regex: searchText, $options: "i" } }).toArray()
      res.send(result)
    })


    const myToys = await toyCollection.createIndex({sellerName: 1});

    app.get("/myToys/:specificSeller", async(req, res)=>{
      const specificSeller = req.params.specificSeller;
      const result = await toyCollection.find({sellerName: {$regex: specificSeller, $options:"i"} }).toArray()
      res.send(result)
    })

    app.delete("/myToys/:id", async(req, res)=>{
      const id = req.params.id;
      
      console.log(id)
    })

    app.post("/addAToy",async(req, res)=>{
      const toyItem = req.body;
      // console.log(toyItem)
      const item = await toyCollection.insertOne(toyItem);
      res.send(item);
    });

    

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







/***
 * _______________________________________________
 * 
 * Database connection and task section End here
 * ________________________________________________
 */

app.listen(port, () => {
  console.log(`Toy marketplace server is running on port: ${port}`)
});
