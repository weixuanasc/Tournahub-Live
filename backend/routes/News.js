const NewsModel = require("../models/News");
const multer = require("multer");
const path = require("path");
const router = require("express").Router();
const CommentModel = require("../models/Comments");

// Multer upload images locations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedfileType = ["image/png", "image/jpg", "image/jpeg"];

  if (allowedfileType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

//create news
router.route("/create").post(upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { user } = req.body;
    const title = req.body.title;
    const author = req.body.author;
    const content = req.body.content;
    const category = req.body.category;
    const photo = req.file.filename;

    // Make sure to include the user name in the newNewsData object
    const newNewsData = {
      title,
      author,
      content,
      category,
      photo,
      user,
      name: req.body.name,
    };

    const newNews = new NewsModel(newNewsData);
    await newNews.save();

    res.json({ message: "New Article Added" });
  } catch (error) {
    console.error("Error in /create route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/rec").get((req, res) => {
  NewsModel.find()
    .then((newss) => res.json(newss))
    .catch((err) => res.status(400).json("Error:" + err));
});

// this endpoint gets all the news from the database
router.get("/all", async (req, res) => {
  try {
    const news = await NewsModel.find().populate("user");
    res.status(200).json({ message: news, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "could not fetch news", success: false });
  }
});

// this endpoint will get all the news of the specific category
router.get("/single/:category", async (req, res) => {
  try {
    const category = req.params.category;

    const news = await NewsModel.find({ category });
    res.status(200).json({ message: news, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "could not fetch news", success: false });
  }
});

router.get("/byid/:id", async (req, res) => {
  try {
    const newsId = req.params.id;
    const news = await NewsModel.findById(newsId);
    res.status(200).json({ message: news, success: true });
  } catch (error) {
    res.status(500).json({ message: "could not fetch news", success: false });
  }
});

// this endpoint gets one news article that matches the search filter by title
router.get("/search/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const news = await NewsModel.find({
      title: { $regex: new RegExp(title, "i") },
    });
    res.status(200).json({ message: news, success: true });
  } catch (error) {
    res.status(500).json({ message: "could not fetch news", success: false });
  }
});

router.delete("/:newsId", async (req, res) => {
  const newsId = req.params.newsId;
  try {
    await NewsModel.findByIdAndDelete(newsId);
    res
      .status(200)
      .json({ message: "news deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "could not delete news", success: false });
  }
});
//Edit article
router.route("/edit/:newsId").put(upload.single("photo"), async (req, res) => {
  const newsId = req.params.newsId;
  const updatedData = req.body;

  console.log("Updating news article with ID:", newsId);
  console.log("Updated data:", updatedData);

  NewsModel.findByIdAndUpdate(newsId, updatedData, { new: true })
    .then((updatedArticle) => {
      if (!updatedArticle) {
        console.log("News article not found");
        return res.status(404).json({ error: "News article not found" });
      }
      console.log("News article updated successfully:", updatedArticle);
      res.json(updatedArticle);
    })
    .catch((err) => {
      console.error("Error updating news article:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// router.route("/edit/:newsId").put(upload.single("photo"), async (req, res) => {
//   console.log(req);
//   try {
//     // Get the article ID from the URL parameters
//     const newsId = req.params.newsId;

//     // Check if the logged-in user is the owner of the article
//     if (req.user._id.toString() !== req.body.user.toString()) {
//       return res.status(403).json({
//         error: "Unauthorized: You are not the owner of this article.",
//       });
//     }

//     // Update the article data
//     const { title, author, content, category } = req.body;
//     const updatedArticle = {
//       title,
//       author,
//       content,
//       category,
//     };

//     if (req.file) {
//       updatedArticle.photo = req.file.filename;
//     }

//     // Update the article in the database
//     const result = await NewsModel.findByIdAndUpdate(newsId, updatedArticle, {
//       new: true,
//     });

//     res.json({
//       message: "Article updated successfully",
//       updatedArticle: result,
//     });
//   } catch (error) {
//     console.error("Error in /edit route:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// Create a comment--------------------------------------------------------------------------
// router.post("/create/:newsId", async (req, res) => {
//   try {
//     const { text, user } = req.body;
//     const newsId = req.params.newsId;

//     const newComment = new CommentModel({
//       comments: text,
//       user,
//     });

//     await newComment.save();

//     // Add the comment to the corresponding news article
//     await NewsModel.findByIdAndUpdate(
//       newsId,
//       { $push: { comments: newComment._id } },
//       { new: true }
//     );

//     res.json({ comment: newComment, message: "Comment added successfully" });
//   } catch (error) {
//     console.error("Error in /create route:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
router.post("/create/:newsId", async (req, res) => {
  try {
    const { text, user } = req.body;
    const newsId = req.params.newsId;

    const newComment = new CommentModel({
      comments: text,
      user,
      news: newsId,
    });

    await newComment.save();

    // Add the comment to the corresponding news article
    await NewsModel.findByIdAndUpdate(
      newsId,
      { $push: { comments: newComment._id } },
      { new: true }
    );

    res.json({ comment: newComment, message: "Comment added successfully" });
  } catch (error) {
    console.error("Error in /create route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get comments for a specific news article
// router.get("/:newsId", async (req, res) => {
//   try {
//     const newsId = req.params.newsId;
//     const news = await NewsModel.findById(newsId).populate(["comments"]);
//     console.log("getting single news", news);
//     res.json({ comments: news.comments });
//   } catch (error) {
//     console.error("Error in /:newsId route:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
router.get("/:newsId", async (req, res) => {
  try {
    const newsId = req.params.newsId;
    const news = await NewsModel.findById(newsId).populate({
      path: "comments",
      populate: { path: "user", select: "name" },
    });

    console.log("getting single news", news);
    res.json({ comments: news.comments });
  } catch (error) {
    console.error("Error in /:newsId route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a comment
router.delete("/comment/:commentId", async (req, res) => {
  const commentId = req.params.commentId;

  try {
    // Find the comment and get its associated newsId
    const comment = await CommentModel.findById(commentId);
    const newsId = comment.news;

    // Remove the comment from CommentModel
    await CommentModel.findByIdAndDelete(commentId);

    // Remove the comment reference from the corresponding news article
    await NewsModel.findByIdAndUpdate(
      newsId,
      { $pull: { comments: commentId } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "comment deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "could not delete comment", success: false });
  }
});

module.exports = router;
