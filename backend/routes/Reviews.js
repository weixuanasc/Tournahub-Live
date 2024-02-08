const ReviewModel = require("../models/Reviews");

const router = require("express").Router();

// this endpint will create the new review
router.post("/create", async (req, res) => {
  try {
    await ReviewModel.create(req.body);
    res
      .status(200)
      .json({ message: "Review added successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding review", success: false });
  }
});

// this endpoint gets all the reviews from the database
router.get("/all", async (req, res) => {
  try {
    const reviews = await ReviewModel.find().populate("user");
    res.status(200).json({ message: reviews, success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "could not fetch reviews", success: false });
  }
});

// this endpoint will get all the reviews of the specific user
router.get("/single/:userid", async (req, res) => {
  try {
    const userid = req.params.userid;

    const reviews = await ReviewModel.find({ user: userid }).populate("user");
    res.status(200).json({ message: reviews, success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "could not fetch reviews", success: false });
  }
});

router.delete("/:reviewsId", async (req, res) => {
  const reviewsId = req.params.reviewsId;
  try {
    await ReviewModel.findByIdAndDelete(reviewsId);
    res
      .status(200)
      .json({ message: "review deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "could not delete reviews", success: false });
  }
});

// this endpoint will get 3 random review for the homepage
router.get('/fetch-reviews-homepage', async (req, res) => {
  try {
    const reviews = await ReviewModel.aggregate([{ $sample: { size: 3 } }]);
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
