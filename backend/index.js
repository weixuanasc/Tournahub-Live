const express = require("express");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const multer = require("multer");

const {
  handleRegister,
  getCurrentUser,
  handleLogin,
  forgetPassword,
  resetPassword,
} = require("./controllers/Auth");
const {
  handleManageSports,
  handleGetSingleSport,
  handleGetSports,
  handleUpdateSport,
  handleDeleteSport,
  handleSearchSport,
  handleCreateSport,
} = require("./controllers/sports");
const {
  handleGetAllUser,
  handleManageUser,
  getPendingUsers,
  getSingleUser,
  updateUser,
  suspendedUsers,
  approveUser,
  searchUsers,
  verifySponsor,
  verifyTournamentOrganizer,
  verifyUser,
  verifySysAdmin,
  countUsers,
  updateProfile,
} = require("./controllers/Users");
const {
  handleGetTournaments,
  handleGetOwnTournaments,
  handleUpdateTournament,
  handleUpdateTournamentCollaboratorId,
  UpdateTournamentStatus,
  handleCreateTournament,
  handleGetSingleTournament,
  handleDeleteTournament,
  countTournaments,
  handleSearchTournaments,
  handleSearchTournamentNonTO,
  handleGetSortedTournamentNonTO,
  handleGetSponsorableTournaments,
  sponsorTournament,
} = require("./controllers/Tournaments");
const {
  handleCreateMatches,
  handleGetMatches,
  handleUpdateMatches,
} = require("./controllers/Matches");
const {
  handleCreateStatistics,
  handleGetStatistics,
  handleUpdateStatistics,
} = require("./controllers/Statistics");
const {
  handleCreateRankingTable,
  handleGetRankingTable,
} = require("./controllers/RankingTable");
const {
  IconPayment,
  ArticlePayment,
  TournamentPayment,
  UploadSponsorIcon,
  fetchSponsorIconsHomePage,
} = require("./controllers/Sponsor");
const {
  handleCreateStatus,
  handleUpdateStatus,
  handleGetStatus,
} = require("./controllers/Status");

const app = express();
const PORT = 3001;
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://tournahub-frontend.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

// setup db
require("./utils/db");

// Used for getting the PDF files for verification
app.use("/verify", express.static("verify"));
// Used for getting the Sponsor Icon images
app.use("/sponsoricon", express.static("sponsoricon"));
// Used for getting scoresheets
app.use("/scoresheet", express.static("scoresheet"));
//Used for storing tournament sponsor icons images
app.use("/tournamentsponsor", express.static("tournamentsponsor"))

//Reviews API
app.use("/api/reviews", require("./routes/Reviews"));
app.use("/api/news", require("./routes/News"));
app.use("/images", express.static("images"));

//ApplicationStatus API
app.use("/api/applicationstatus", require("./controllers/ApplicationStatus"));

// Middlewares
// Multer file upload locations
//For verification
const verifyStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./verify");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const verifyUpload = multer({ storage: verifyStorage });
//For sponsor icons
const sponsorIconStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./sponsoricon");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const sponsorIconUpload = multer({ storage: sponsorIconStorage });
//For scoresheets
const scoresheetStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./scoresheet");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const scoresheetUpload = multer({ storage: scoresheetStorage });
//For tournament sponsor icons
const tournamentSponsorStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./tournamentsponsor");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const tournamentSponsorUpload = multer({ storage: tournamentSponsorStorage });
//

//APIs

//Login APIs
app.get("/DashboardSA", verifySysAdmin, (req, res) => {
  res.json("Login is successful");
});

app.get("/home", verifyUser, (req, res) => {
  res.json("Login is successful");
});

app.get("/DashboardTO", verifyTournamentOrganizer, (req, res) => {
  res.json("Login is successful");
});

app.get("/DashboardS", verifySponsor, (req, res) => {
  res.json("Login is successful");
});

app.post("/login", handleLogin);

// Register API
app.post("/register", verifyUpload.single("verification"), handleRegister);
// Retrieve current user information
app.get("/getCurrentUser", getCurrentUser);
// Forget/Reset Password
app.post("/forgetPassword", forgetPassword);
app.post("/resetPassword/:id/:token", resetPassword);

// System Administrator APis
// Manage Sports APIs
app.get("/ManageSports", handleManageSports);

app.get("/getSport/:id", handleGetSingleSport);
app.get("/getSports", handleGetSports);

app.put("/updateSport/:id", handleUpdateSport);
app.delete("/deleteSport/:id", handleDeleteSport);

app.get("/searchSports/:name", handleSearchSport);
app.post("/CreateSport", handleCreateSport);
// Manage Users APIs
app.get("/ManageUsers", handleManageUser);
app.get("/PendingUsers", getPendingUsers);

app.get("/getUser/:id", getSingleUser);

app.put("/updateUser/:id", updateUser);

app.put("/suspendUser/:id", suspendedUsers);

app.put("/approveUser/:id", approveUser);
app.get("/searchUsers/:name", searchUsers);

app.get("/getAllUser", handleGetAllUser);

app.put("/updateProfile", updateProfile);

//upload scoresheet API
app.post(
  "/AddScoresheet",
  scoresheetUpload.single("scoresheet"),
  (req, res) => {
    res.send("Scoresheet uploaded successfully!");
  }
);

// app.get('/getTournaments', (req, res) => {
//     res.send('Hello, this is the tournaments endpoint!');
// });

app.post("/CreateTournament", handleCreateTournament);
app.get("/getTournaments", handleGetTournaments);
app.get("/getTournaments/:userId", handleGetOwnTournaments);
app.get("/getTournamentsNonTO", handleGetSortedTournamentNonTO);

app.get("/getTournamentDetails/:id", handleGetSingleTournament);

app.put("/updateTournament/:id", handleUpdateTournament);
app.delete("/deleteTournament/:id", handleDeleteTournament);

app.get("/searchTournaments/:tournamentName/:id", handleSearchTournaments);
app.get("/searchTournamentsNonTO/:tournamentName", handleSearchTournamentNonTO);


//User: Application API
// app.post("/applyForTournament/:tournamentId/:userId", applyForTournament);
// app.get("/getOpenTournaments", getOpenTournaments);
// app.post(
//   "/reviewTournamentApplications/:tournamentId/:userId",
//   reviewTournamentApplications
// );

app.post("/CreateMatches", handleCreateMatches);
app.get("/getMatches/:tournamentId", handleGetMatches);
app.put("/updateMatches/:id", handleUpdateMatches);

app.post("/CreateStatistics", handleCreateStatistics);
app.get("/getStatistics/:tournamentId", handleGetStatistics);
app.put("/updateStatistics/:id", handleUpdateStatistics);

app.put(
  "/updateTournamentCollaboratorId/:tournamentId",
  handleUpdateTournamentCollaboratorId
);
app.put("/updateTournamentStatus/:tournamentId", UpdateTournamentStatus);

app.get("/getRankingTable/:tournamentId", handleGetRankingTable);
app.post("/CreateRankingTable", handleCreateRankingTable);
//
app.post("/CreateStatus", handleCreateStatus);
app.put("/updateStatus/:id", handleUpdateStatus);
app.get("/getStatus", handleGetStatus);

//Sponsor API
app.post("/create-checkout-session-icon", IconPayment);
app.post("/create-checkout-session-tournament", TournamentPayment);
app.post("/create-checkout-session-article", ArticlePayment);
app.post(
  "/upload-sponsor-icon",
  sponsorIconUpload.single("icon"),
  UploadSponsorIcon
);

//Homepage API
app.get("/count-user", countUsers);
app.get("/count-tournaments", countTournaments);
//
app.get("/fetch-sponsor-icons", fetchSponsorIconsHomePage);
app.get("/getSponsorableTournaments", handleGetSponsorableTournaments);
app.post("/sponsorTournament",
tournamentSponsorUpload.single("icon"), 
sponsorTournament);

//Validation message to see if connection is successful
app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});
