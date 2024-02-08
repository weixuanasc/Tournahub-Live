const { default: mongoose } = require("mongoose");
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://TournaHub:123qwe@tournahub.ze12x0s.mongodb.net/";
//mongodb+srv://TournaHub:123qwe@tournahub.ze12x0s.mongodb.net/

// Options for the MongoClient
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
// Create a MongoClient and connect to MongoDB Atlas
const client = new MongoClient(uri, options);

async function connect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    // Your application logic goes here
  } finally {
    // Ensure the client is closed when your application terminates
    await client.close();
  }
}

// Call the connect function to establish a connection
connect();

// Connection String is set to connect to the Tournahub Database in MongoDB Atlas
//mongodb+srv://TournaHub:123qwe@tournahub.ze12x0s.mongodb.net/Tournahub
mongoose.connect(
  "mongodb+srv://TournaHub:123qwe@tournahub.ze12x0s.mongodb.net/Tournahub",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
