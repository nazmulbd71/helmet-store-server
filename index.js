const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// new-user_1 y3o2CnNieZv0vZVu


// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Helmet server is running')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qula8m7.mongodb.net/?retryWrites=true&w=majority`;


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

        const helmetCollection = client.db("helmetDB").collection('helmet')

        app.get("/helmet", async (req, res) => {
            const cursor = helmetCollection.find()
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/helmet/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await helmetCollection.findOne(query)
            res.send(result)
        })

        app.put('/helmet/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedHelmet = req.body
            const helmet = {
                $set: {
                    name: updatedHelmet.name,
                    model: updatedHelmet.model,
                    supplier: updatedHelmet.supplier,
                    color: updatedHelmet.color,
                    category: updatedHelmet.category,
                    details: updatedHelmet.details,
                    photo: updatedHelmet.photo,
                }
            }

            const result = await helmetCollection.updateOne(filter, helmet, options)
            res.send(result)
        })


        app.post('/helmet', async (req, res) => {
            const newHelmet = req.body
            console.log(newHelmet)
            const result = await helmetCollection.insertOne(newHelmet)
            res.send(result)
        })

        app.delete('/helmet/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            console.log(query)
            const result = await helmetCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`this helmet server running on this: ${port}`)
})