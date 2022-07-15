const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This section will help you get a list of all the records.
recordRoutes.route("/listings").get(async function (req, res) {
  // Get records
  const dbConnect = dbo.getDb();
  
  dbConnect
  .collection("listingsAndReviews")
  .find({}).limit(50)
  .toArray(function(err, result){
    if(err){
      res.status(400).send("Error fetching the listings!");
    }else{
      res.json(result);
    }
  });

});

// This section will help you create a new record.
recordRoutes.route("/listings/recordSwipe").post(function (req, res) {
  // Insert swipe informations
 const dbConnect = dbo.getDb();

 const matchDocument ={
  listing_id: req.body.id,
  last_modified: new Date(),
  session_id : req.body.session_id,
  direction: req.body.direction
 }

 dbConnect
 .collection("matches")
 .insertOne(matchDocument, function(err, result){
  if(err){
    res.status(400).send("Error inserting the matches!")
  }else{
    console.log(`Added a new Match with id : ${result.insertedId}`);
    res.status(200).send();
  }
 })


});

// This section will help you update a record by id.
recordRoutes.route("/listings/updateLike").post(function (req, res) {
  // Update likes
  const dbConnect = dbo.getDb();
// TO track the id of requested document that needs to be updated
  const listingQuery ={
    _id:req.body.id
  };

  const updates ={
    $inc: {
      likes: 1
    }
  }

  dbConnect
  .collection("listingsAndReviews")
  .updateOne(listingQuery, updates, function(err, result){
    if(err){
      res.status(400).send(`Error updating the likes with id ${listingQuery.id}`);
    }
    else{
      console.log(`One Document updated successfully!`);
    }
  })
});

// This section will help you delete a record
recordRoutes.route("/listings/delete").delete((req, res) => {
  // Delete documents
  const dbConnect = dbo.getDb();
  const listingQuery={
    listing_id:req.body.id
  };

  dbConnect
  .collection("listingsAndReviews")
  .deleteOne(listingQuery, function(err, result){
    if(err){
      res.status(400).send(`Error deleting with id ${listingQuery.listing_id}`);
    }
    else{
      console.log("One Document is successfully deleted!");
    }
  })

});

module.exports = recordRoutes;
