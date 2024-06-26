const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')
require('dotenv').config()
const fs = require('fs')
const imgbbUploader = require("imgbb-uploader");
const port = process.env.PORT || 5000
const multer = require('multer')
const axios = require('axios')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage })
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"]
}))

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3zjxg2.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const database = client.db('3dPrinting')
        const materialCollection = database.collection('materials')

        app.get('/materials', async (req, res) => {
            try {
                const result = await materialCollection.find().toArray()
                res.send(result)
            } catch (error) {
                res.status(500).send({ message: 'Failed to fetch', error: error.message })
            }
        })

        app.get('/materials/:id', async (req, res) => {
            const id = req.params.id
            if (!ObjectId.isValid(id)) {
                return res.status(400).send({ message: 'Invalid ID' })
            }
            const query = { _id: new ObjectId(id) }
            try {
                const result = await materialCollection.findOne(query)
                if (!result) {
                    return res.status(404).send({ message: 'Not found' })
                }
                res.send(result)
            } catch (error) {
                res.status(500).send({ message: 'Failed to fetch', error: error.message })
            }
        })

        app.post('/materials', upload.single('imageUrl'), async (req, res) => {
            const { name, technology, colors, pricePerGram, applicationTypes } = req.body
            if (!name || !technology || !colors || !pricePerGram || !applicationTypes) {
                return res.status(400).send({ message: '* All fields are required' })
            }
            const newData = {
                name: name,
                technology: technology,
                colors: Array.isArray(colors) ? colors : [colors],
                pricePerGram: parseFloat(pricePerGram),
                applicationTypes: Array.isArray(applicationTypes) ? applicationTypes : [applicationTypes],
            }
            const file = req.file
            const filePath = path.resolve(file.path)

            try {
                const response = await imgbbUploader(process.env.IMGBB_API, filePath)
                newData.imageUrl = response.display_url
                const result = await materialCollection.insertOne(newData)
                res.send(result)
            } catch (error) {
                res.status(500).send({ message: 'Failed to upload image', error: error.message })
            }
        })

        app.put('/materials/:id', upload.single('imageUrl'), async (req, res) => {
            const id = req.params.id
            if (!ObjectId.isValid(id)) {
                return res.status(400).send({ message: 'Invalid ID' })
            }
            const { name, technology, colors, pricePerGram, applicationTypes } = req.body
            const updateData = {
                ...(name && { name }),
                ...(technology && { technology }),
                ...(colors && { colors: Array.isArray(colors) ? colors : [colors] }),
                ...(pricePerGram && { pricePerGram: parseFloat(pricePerGram) }),
                ...(applicationTypes && { applicationTypes: Array.isArray(applicationTypes) ? applicationTypes : [applicationTypes] }),
            }
            const query = { _id: new ObjectId(id) }
            try {
                if (req.file) {
                    const filePath = req.file.path
                    const response = await imgbbUploader(process.env.IMGBB_API, filePath)
                    updateData.imageUrl = response.display_url
                }
                const update = { $set: updateData }
                const result = await materialCollection.updateOne(query, update)
                if (result.matchedCount === 0) {
                    return res.status(404).send({ message: 'Not found' })
                }
                res.send(result)
            } catch (error) {
                res.status(500).send({ message: 'Update Failed', error: error.message })
            }
        })

        app.delete('/materials/:id', async (req, res) => {
            const id = req.params.id
            if (!ObjectId.isValid(id)) {
                return res.status(400).send({ message: 'Invalid ID' })
            }
            const query = { _id: new ObjectId(id) }
            try {
                const result = await materialCollection.deleteOne(query)
                if (result.deletedCount === 0) {
                    return res.status(404).send({ message: 'Not found' })
                }
                res.send(result)
            } catch (error) {
                res.status(500).send({ message: 'Delete Failed', error: error.message })
            }
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log("Running on port: ", port);
})
