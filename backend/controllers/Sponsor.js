const SponsorIconModel = require("../models/SponsorIcon");

// Replace with actual Stripe secret key
const stripe = require('stripe')('sk_test_51OZDZ5GNBcwxwaFCOENvyhDKeoiDMDcSytJ0MefI3qZxnmNbgCr8vU3DWE5lglPbxXCvjNF0HHqSvAWREBDUkQBS00mDNi8TsS');
const SESSION_URL = "http://localhost:5173"


const IconPayment = async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "sgd",
              product_data: {
                name: "Sponsor TournaHub",
                images: ["https://i.imgur.com/yE1M01n.png"],
              },
              unit_amount: 2000, // Adjust amount (in cents) as needed
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${SESSION_URL}/UploadSponsorIcon`,
        cancel_url: `${SESSION_URL}/SponsorshipModels`,
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating Checkout session:", error.message);
      res.status(500).send("Internal Server Error");
    }
  };
  
  const ArticlePayment = async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "sgd",
              product_data: {
                name: "Sponsored Article",
                images: ["https://i.imgur.com/yE1M01n.png"],
              },
              unit_amount: 5000, // Adjust amount (in cents) as needed
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${SESSION_URL}/PaymentSuccess`,
        cancel_url: `${SESSION_URL}/SponsorshipModels`,
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating Checkout session:", error.message);
      res.status(500).send("Internal Server Error");
    }
  };

  const TournamentPayment = async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "sgd",
              product_data: {
                name: "Sponsor a Tournament",
                images: ["https://i.imgur.com/yE1M01n.png"],
              },
              unit_amount: 5000, // Adjust amount (in cents) as needed
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${SESSION_URL}/SponsorTournament`,
        cancel_url: `${SESSION_URL}/SponsorshipModels`,
      });
  
      res.json({ sessionId: session.id });
    } catch (error) {
      console.error("Error creating Checkout session:", error.message);
      res.status(500).send("Internal Server Error");
    }
  };

  const UploadSponsorIcon = (req, res) => {
    const { urlLink } = req.body;
    let icon = "";
  
    // Check if a file was uploaded
    if (req.file && req.file.filename) {
      icon = req.file.filename;
    }
  
    SponsorIconModel.create({ urlLink, icon })
      .then((sponsoricon) => res.json(sponsoricon))
      .catch((err) => res.json(err));
  };

  
  const fetchSponsorIconsHomePage = async (req, res) => {
    try {
      const sponsorIcons = await SponsorIconModel.aggregate([{ $sample: { size: 3 } }]);
      res.json(sponsorIcons);
    } catch (error) {
      console.error('Error fetching sponsor icons:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  module.exports = { IconPayment, ArticlePayment, TournamentPayment, UploadSponsorIcon, fetchSponsorIconsHomePage};