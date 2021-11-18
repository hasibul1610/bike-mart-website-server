const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ernke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



app.get('/', (req, res) => {
    res.send("Bike Mart Backend Running");
})


client.connect(err => {
    // console.log("DB Connected")

    const productCollection = client.db('bike-martDb').collection('products');
    const bookingCollection = client.db('bike-martDb').collection('bookings');

    //Add product to database
    app.post('/addProduct', async (req, res) => {
        const result = await productCollection.insertOne(req.body);
        // console.log(result);
        res.send(result);
    })

    //get all products to display 
    app.get('/allProducts', async (req, res) => {
        const result = await productCollection.find({}).toArray();
        res.send(result);
    })

    //get single product
    app.get('/singleProduct/:id', async (req, res) => {
        // console.log(req.params.id);
        const result = await productCollection.
            find({ _id: ObjectId(req.params.id) })
            .toArray();
        // console.log(result);
        res.send(result[0]);
    })

    //Confirm Booking
    app.post('/confirmBooking', async (req, res) => {
        const result = await bookingCollection.insertOne(req.body);
        // console.log(result);
        res.send(result);
    })

});

app.listen(port, () => {
    console.log('Server Running on PORT', port);
})