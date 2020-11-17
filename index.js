const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l47bs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('apartment'));
app.use(fileUpload());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const apartmentsCollection = client.db(`${process.env.DB_NAME}`).collection("AllAppertments");
  const bookingsCollection = client.db(`${process.env.DB_NAME}`).collection("AllBookings");
  
  //Post rent house data in mongodb
  app.post('/addRentHouse', (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const location = req.body.location;
    const bathroom = req.body.bathroom;
    const price = req.body.price;
    const bedroom = req.body.bedroom;
     const newImage = file.data;
     const encImage = newImage.toString('base64');
      
      var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImage, 'base64')
      };

      apartmentsCollection.insertOne({title, location, bathroom, price, bedroom, image})
      .then(result => {
          res.send(result.insertedCount > 0);
      })
 })

    // Get all apartment and Show in Home page
    app.get('/apartments', (req, res) => {
      apartmentsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
     })


     //Post booking data
      app.post('/addBooking', (req, res) => {
         const newBooking = req.body;
         bookingsCollection.insertOne(newBooking)
         .then(result => {
           res.send(result.insertedCount > 0)
         })
      })

      //Get all customers bookings data
      app.get('/allUsersBooking', (req, res) => {
        bookingsCollection.find({})
        .toArray((err, documents) => {
          res.send(documents);
        })
      })

      // Get specific user's booking data 
     app.post('/specificUserBooking', (req, res) => {
      bookingsCollection.find({email: req.body.email})
      .toArray((err, documents) => {
        res.send(documents);
      })
    })


});


app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(process.env.PORT || 5000)