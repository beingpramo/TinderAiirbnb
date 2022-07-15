
const { MongoClient } = require("mongodb");
const connectionString = process.env.ATLAS_URI;
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    // Implement Database connection
    client.connect(function(err, db){
      if(err || !db){
        return callback(err);
      }
    dbConnection = db.db("sample_airbnb");
    console.log("The DB is connected successfully!");

    return callback();

    })
  },

  getDb: function () {
    return dbConnection;
  },
};
