const express = require("express");
var cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.PASS}@emajohn.mplz2sn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Establish and verify connection
    const productCollection = client.db("johon1").collection("product");
    console.log("Connected successfully to server");
    app.get("/product", async (req, res) => {
      console.log(req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
       const cursor = productCollection.find(query);
      let products;
      if (page|| size) {
        products = await cursor.skip(page*size).limit(size).toArray();
      }else{
        products = await cursor.toArray();
      } 
      res.send(products);
    });

    app.get("/productCount", async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
