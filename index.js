const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

//middle wear
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aimii.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
        const database = client.db("geniusCarMechanics");
        const servicesCollection = database.collection("sercices");
      
      //get api
      app.get('/services', async (req, res) => {
        const services = servicesCollection.find({});
        const result = await services.toArray();
        res.send(result)
      })

        //post api
        app.post('/services', async (req, res) => {
            console.log('post hitted')
            const newService = req.body;
            console.log(newService);
            const result = await servicesCollection.insertOne(newService);
            console.log(result);
            res.json(result);
        })
      
      //dynamic api
      app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await servicesCollection.findOne(query);
        res.json(service);
      })

      //delete api
      app.delete('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await servicesCollection.deleteOne(query);
        res.json(result);
      })


      app.get('/hello', (req, res) => {
        res.send('hello updated')
      })
        
     
        
    } finally {
    //   await client.close();
    }
  }
run().catch(console.dir);
  
app.get('/', (req, res) => res.send('Hello world'));
app.listen(port, () => console.log("Running server on port", port));
