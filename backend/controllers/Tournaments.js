const TournamentModel = require("../models/Tournaments");
const MatchesModel = require("../models/Matches");
const RankingTableModel = require("../models/RankingTable");
const StatisticsModel = require("../models/Statistics");
const mongoose = require("mongoose");

const handleCreateTournament = (req, res) => {
  TournamentModel.create(req.body)
    .then((tournaments) => res.json(tournaments))
    .catch((err) => res.json(err));
};

// const handleGetTournaments = (req, res) => {
//   TournamentModel.find({})
//     .then(function (tournaments) {
//       res.json(tournaments);
//     })
//     .catch(function (err) {
//       console.error("Error fetching tournaments:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//       //res.json(err)
//     });
// };

const handleGetTournaments = async (req, res) => {
  try {
      const { userId } = req.params;
      let tournaments;

      if (req.query.sortBy === 'tournamentStartDate') {
          tournaments = await TournamentModel.find({ userId }).sort({ tournamentStartDate: 1 });
      } else {
          tournaments = await TournamentModel.find({ userId });
      }

      res.json(tournaments);
  } catch (error) {
      console.error('Error fetching tournaments:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};


const handleGetOwnTournaments = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch tournaments where organizerId or collaboratorId matches userId
    const tournaments = await TournamentModel.find({
      $or: [{ organizerId: userId }, { collaboratorId: userId }],
    });

    res.json(tournaments);
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    res.status(500).send("Internal Server Error");
  }
};

const handleGetSingleTournament = (req, res) => {
  const id = req.params.id;
  TournamentModel.findById({ _id: id })
    .then((tournaments) => res.json(tournaments))
    .catch((err) => res.json(err));
};

const handleDeleteTournament = async (req, res) => {
  const tournamentId = req.params.id;

  try {
    // Delete the tournament
    const deletedTournament = await TournamentModel.findByIdAndDelete({
      _id: tournamentId,
    });

    // If the tournament is deleted successfully, delete associated matches and ranking tables
    if (deletedTournament) {
      // Delete matches associated with the tournament
      await MatchesModel.deleteMany({ 
        tournamentId: deletedTournament._id 
      });

      // Delete ranking tables associated with the tournament
      await RankingTableModel.deleteMany({
        tournamentId: deletedTournament._id,
      });

      // Delete statistics associated with the tournament
      await StatisticsModel.deleteMany({
        tournamentId: deletedTournament._id,
      });

      res.json({
        message: "Tournament, matches, and ranking tables deleted successfully",
      });
    } else {
      res.status(404).json({ error: "Tournament not found" });
    }
  } catch (err) {
    console.error("Error deleting tournament and associated data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const handleUpdateTournament = (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  console.log("Updating tournament with ID:", id);
  console.log("Updated data:", updatedData);

  TournamentModel.findByIdAndUpdate(id, updatedData, { new: true })
    .then((updatedTournament) => {
      if (!updatedTournament) {
        console.log("Tournament not found");
        return res.status(404).json({ error: "Tournament not found" });
      }
      console.log("Tournament updated successfully:", updatedTournament);
      res.json(updatedTournament);
    })
    .catch((err) => {
      console.error("Error updating Tournament:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

const handleUpdateTournamentCollaboratorId = async (req, res) => {
  const { tournamentId } = req.params;
  const { collaboratorId } = req.body; // Assuming you send the collaboratorId in the request body

  try {
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      { $push: { collaboratorId: collaboratorId } },
      { new: true }
    );

    res.json(updatedTournament);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const UpdateTournamentStatus = async (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;
    const newStatus = req.body.newStatus;

    // Validate if the new status is provided
    if (!newStatus) {
      return res.Status(400).json({ error: "New status is required" });
    }

    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      tournamentId,
      { Status: newStatus },
      { new: true }
    );

    if (!updatedTournament) {
      return res.Status(404).json({ error: "Tournament not found" });
    }

    res.json(updatedTournament);
  } catch (err) {
    console.error("Error updating tournament status:", err);
    res
      .Status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

const countTournaments = (req, res) => {
  TournamentModel.countDocuments({})
    .then((tournaments) => {
      res.json(tournaments);
    })
    .catch((err) => {
      console.error("Error counting users:", err);
      res.json(err);
    });
};

const handleSearchTournaments = (req, res) => {
  const { tournamentName, id } = req.params;
  TournamentModel.find({
    $and: [
      { tournamentName: { $regex: new RegExp(tournamentName, "i") } },
      {
        $or: [
          { organizerId: id }, 
          { collaboratorId: id }
        ]
      }
    ]
  })
    .then((tournaments) => res.json(tournaments))
    .catch((err) => res.json(err));
};

const handleGetSortedTournamentNonTO = (req, res) => {
  TournamentModel.find({}).sort({ tournamentStartDate: 1 })
    .then(function (tournaments) {
      res.json(tournaments);
    })
    .catch(function (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Internal Server Error" });
      //res.json(err)
    });
};

const handleSearchTournamentNonTO = (req, res) => {
  const { tournamentName } = req.params;
  TournamentModel.find({ tournamentName: { $regex: new RegExp(tournamentName, "i") } })
    .then((tournaments) => res.json(tournaments))
    .catch((err) => res.json(err));
};

//Sponsorship APIs
const handleGetSponsorableTournaments = (req, res) => {
  TournamentModel.find({tournamentSponsor: "None"})
    .then(function (tournaments) {
      res.json(tournaments);
    })
    .catch(function (err) {
      console.error("Error fetching tournaments:", err);
      res.status(500).json({ error: "Internal Server Error" });
      //res.json(err)
    });
};

const sponsorTournament = async (req, res) => {
  const id = req.body.id;
  let icon = "";

  // Check if a file was uploaded
  if (req.file && req.file.filename) {
    icon = req.file.filename;
  }

  try {
    const updatedTournament = await TournamentModel.findByIdAndUpdate(
      { _id: id },
      {
        tournamentSponsor: req.body.tournamentSponsor,
        tournamentSponsorIcon: icon,
      },
      { new: true }
    );

    res.json(updatedTournament);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const applyForTournament = async (req, res) => {
//   console.log("Received request to apply for tournament", req.params);
//   const tournamentId = req.params.tournamentId;
//   console.log("Tournament ID:", tournamentId);
//   const userid = req.params.userId;

//   try {
//     // Check if the tournamentId is not a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
//       return res.status(400).json({ error: "Invalid tournament ID" });
//     }
//     const tournament = await TournamentModel.findById(tournamentId);

//     // Check if the tournament is open for application
//     if (!tournament || tournament.tournamentStatus !== "Open for Application") {
//       return res
//         .status(404)
//         .json({ error: "Tournament not found or not open for application" });
//     }

//     console.log(userid);

//     // Check if the user has already applied for the tournament
//     const userApplied = tournament.applications.some(
//       (application) => application.user && application.user.equals(userid)
//     );

//     if (userApplied) {
//       return res
//         .status(400)
//         .json({ error: "You have already applied for this tournament" });
//     }

//     // // Add the user to the list of tournament applications
//     tournament.applications.push({ user: userid });
//     await tournament.save();

//     res.json({ message: "Application submitted successfully" });
//     console.log("user ID:", userid);
//   } catch (error) {
//     console.error("Error applying for tournament:", error);
//     res
//       .status(500)
//       .json({ error: "Internal Server Error", message: error.message });
//   }
// };
//add new attribute action
// const applyForTournament = async (req, res) => {
//   console.log("Received request to apply for tournament", req.params);
//   const tournamentId = req.params.tournamentId;
//   console.log("Tournament ID:", tournamentId);
//   const userId = req.params.userId;
//   const action = req.body.action || "apply"; // Default to "apply" if no action is provided

//   try {
//     // Check if the tournamentId is not a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
//       return res.status(400).json({ error: "Invalid tournament ID" });
//     }

//     const tournament = await TournamentModel.findById(tournamentId);

//     // Check if the tournament is open for application
//     if (!tournament || tournament.tournamentStatus !== "Open for Application") {
//       return res
//         .status(404)
//         .json({ error: "Tournament not found or not open for application" });
//     }

//     console.log("User ID:", userId);

//     // Check if the user has already applied for the tournament
//     const userApplied = tournament.applications.some(
//       (application) => application.user && application.user.equals(userId)
//     );

//     if (userApplied) {
//       return res
//         .status(400)
//         .json({ error: "You have already applied for this tournament" });
//     }

//     // Add the user to the list of tournament applications
//     tournament.applications.push({ user: userId, action });
//     await tournament.save();

//     res.json({ message: "Application submitted successfully" });
//     console.log("User ID:", userId);
//   } catch (error) {
//     console.error("Error applying for tournament:", error);
//     res
//       .status(500)
//       .json({ error: "Internal Server Error", message: error.message });
//   }
// };

// Get tournaments open for application
// const getOpenTournaments = async (req, res) => {
//   try {
//     const openTournaments = await TournamentModel.find({
//       tournamentStatus: "Open for Application",
//     });
//     res.json(openTournaments);
//   } catch (error) {
//     console.error("Error fetching open tournaments:", error);
//     res
//       .status(500)
//       .json({ error: "Internal Server Error", message: error.message });
//   }
// };

//test code

// Review tournament applications
// const reviewTournamentApplications = async (req, res) => {
//   try {
//     const tournamentId = req.params._id;
//     const applications = req.body?.applications || [];

//     if (applications.length === 0) {
//       return res.status(400).json({ error: "No applications provided" });
//     }

//     for (const application of applications) {
//       const applicationUserId = application?.user?._id || null;
//       const action = application?.action;

//       console.log(
//         "Received request for userId:",
//         applicationUserId,
//         "from body:",
//         req.body
//       );
//       console.log("Received request for tournamentId:", tournamentId);

//       const tournament = await TournamentModel.findById(tournamentId);
//       if (!tournament) {
//         return res.status(404).json({ error: "Tournament not found" });
//       }

//       const applicationIndex = tournament.applications.findIndex((app) =>
//         app.user?._id.equals(applicationUserId)
//       );

//       if (applicationIndex === -1) {
//         return res.status(404).json({ error: "Application not found" });
//       }

//       if (action === "accept") {
//         tournament.applications[applicationIndex].status = "accepted";
//       } else if (action === "reject") {
//         tournament.applications[applicationIndex].status = "rejected";
//       } else {
//         return res.status(400).json({ error: "Invalid action" });
//       }
//     }

//     await tournament.save();

//     res.json({ message: "Applications reviewed successfully" });
//   } catch (error) {
//     console.error("Error reviewing tournament applications:", error);
//     res
//       .status(500)
//       .json({ error: "Internal Server Error", message: error.message });
//   }
// };
// const reviewTournamentApplications = async (req, res) => {
//   try {
//     const tournamentId = req.params.tournamentId;
//     const applications = req.body?.applications || [];

//     if (applications.length === 0) {
//       return res.status(400).json({ error: "No applications provided" });
//     }

//     const applicationUserId = applications[0]?.user?._id || null;
//     const action = applications[0]?.action;

//     console.log(
//       "Received request for userId:",
//       applicationUserId,
//       "from body:",
//       req.body
//     );
//     console.log("Received request for tournamentId:", tournamentId);

//     const tournament = await TournamentModel.findById(tournamentId);
//     if (!tournament) {
//       return res.status(404).json({ error: "Tournament not found" });
//     }

//     const applicationIndex = tournament.applications.findIndex((application) =>
//       application.user?._id.equals(applicationUserId)
//     );

//     if (applicationIndex === -1) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     if (action === "accept") {
//       tournament.applications[applicationIndex].status = "accepted";
//     } else if (action === "reject") {
//       tournament.applications[applicationIndex].status = "rejected";
//     } else {
//       return res.status(400).json({ error: "Invalid action" });
//     }

//     await tournament.save();

//     res.json({ message: "Application reviewed successfully" });
//   } catch (error) {
//     console.error("Error reviewing tournament applications:", error);
//     res
//       .status(500)
//       .json({ error: "Internal Server Error", message: error.message });
//   }
// };

// const reviewTournamentApplications = async (req, res) => {
//   try {
//     console.log("Received request body:", req.body);
//     const tournamentId = req.params.tournamentId;
//     const applicationUserId = req.body.user?._id;
//     console.log("Received request for userId:", applicationUserId);

//     const action = req.body.action; // 'accept' or 'reject'
//     console.log("Received request for tournamentId:", tournamentId);

//     // Check if the tournament exists
//     const tournament = await TournamentModel.findById(tournamentId);
//     if (!tournament) {
//       return res.status(404).json({ error: "Tournament not found" });
//     }
//     // Find the application in the tournament's applications array
//     const applicationIndex = tournament.applications.findIndex((application) =>
//       application.user.equals(applicationUserId)
//     );

//     if (applicationIndex === -1) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     // Update the application status based on the action
//     if (action === "accept") {
//       tournament.applications[applicationIndex].status = "accepted";
//     } else if (action === "reject") {
//       tournament.applications[applicationIndex].status = "rejected";
//     } else {
//       return res.status(400).json({ error: "Invalid action" });
//     }

//     await tournament.save();

//     res.json({ message: "Application reviewed successfully" });
//   } catch (error) {
//     console.error("Error reviewing tournament applications:", error);
//     res
//       .status(500)
//       .json({ error: "Internal Server Error", message: error.message });
//   }
// };

//================================
// Review tournament applications
// const reviewTournamentApplications = async (req, res) => {
//   try {
//     const tournamentId = req.params.tournamentId;
//     const applicationUserId = req.body.applicationUserId;
//     const action = req.body.action; // 'accept' or 'reject'
//     console.log(
//       "Received request to review applications for tournament with ID:",
//       tournamentId
//     );
//     // Check if the tournament exists
//     const tournament = await TournamentModel.findById(tournamentId);
//     if (!tournament) {
//       return res.status(404).json({ error: "Tournament not found" });
//     }

//     // Find the application in the tournament's applications array
//     const applicationIndex = tournament.applications.findIndex((application) =>
//       application.user.equals(applicationUserId)
//     );

//     if (applicationIndex === -1) {
//       return res.status(404).json({ error: "Application not found" });
//     }

//     // Update the application status based on the action
//     if (action === "accept") {
//       tournament.applications[applicationIndex].status = "accepted";
//     } else if (action === "reject") {
//       tournament.applications[applicationIndex].status = "rejected";
//     } else {
//       return res.status(400).json({ error: "Invalid action" });
//     }

//     // Save the updated tournament
//     await tournament.save();

//     // Fetch all users whose IDs are in the applications array
//     const userIds = tournament.applications.map(
//       (application) => application.user
//     );

//     const users = await UserModel.find({ _id: { $in: userIds } });

//     res.json({
//       message: "Application reviewed successfully",
//       users: users,
//     });
//   } catch (error) {
//     console.error("Error reviewing tournament applications:", error);
//     res
//       .status(500)
//       .json({ error: "Internal Server Error", message: error.message });
//   }
// };

module.exports = {
  handleGetTournaments,
  handleGetOwnTournaments,
  UpdateTournamentStatus,
  handleCreateTournament,
  handleGetSingleTournament,
  handleDeleteTournament,
  handleUpdateTournamentCollaboratorId,
  handleUpdateTournament,
  countTournaments,
  handleSearchTournaments,
  handleSearchTournamentNonTO,
  handleGetSortedTournamentNonTO,
  handleGetSponsorableTournaments,
  sponsorTournament,
};
