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
    const reviewCollection = client.db('bike-martDb').collection('reviews');
    const adminCollection = client.db('bike-martDb').collection('admins');

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

    //my Booked order
    app.get('/myOrders/:email', async (req, res) => {
        // console.log(req.params.email);
        const result = await bookingCollection.find({ email: req.params.email }).toArray();
        // console.log(result);
        res.send(result);
    })

    // delete order from booked
    app.delete('/deleteOrder/:id', async (req, res) => {
        const result = await bookingCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        // console.log(result);
        res.send(result);
    })

    //Add review to database
    app.post('/addReview', async (req, res) => {
        const result = await reviewCollection.insertOne(req.body);
        // console.log(result);
        res.send(result);
    })

    //get all products for admin
    app.get('/products', async (req, res) => {
        const result = await productCollection.find({}).toArray();
        res.send(result);
    })

    // delete any product by admin
    app.delete('/deleteProduct/:id', async (req, res) => {
        const result = await productCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        // console.log(result);
        res.send(result);
    })

    //All Booking for admin to set the pending status to approved
    app.get('/allOrders', async (req, res) => {
        const result = await bookingCollection.find({}).toArray();
        res.send(result);
    })

    //Updating the status
    app.put('/updateStatus/:id', (req, res) => {
        const id = req.params.id;
        const updatedStatus = req.body.status;
        const filter = { _id: ObjectId(id) }
        // console.log(updatedStatus);
        const result = bookingCollection.updateOne(filter, {
            $set: { status: updatedStatus }
        })
            .then(result => {
                // console.log(result);
                res.send(result);
            })
    })

    //Add new Email in admin list 
    app.post('/addAdmin', async (req, res) => {
        const result = await adminCollection.insertOne(req.body);
        // console.log(result);
        res.send(result);
    })

    app.get('/isAdmin', async (req, res) => {
        const email = req.query.email;
        if (email) {
            const cursor = adminCollection.find({ email: email })
            const isAdmin = await cursor.toArray();
            res.send(isAdmin.length > 0);
        }
        // console.log(isAdmin)

    })


});

app.listen(port, () => {
    console.log('Server Running on PORT', port);
})