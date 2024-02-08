const StatusModel = require("../models/Status");

const handleCreateStatus = (req, res) => {
    const { tournamentId, userId, collaboratorStatus } = req.body;

    // Assuming your StatusModel has a field named tournamentId
    StatusModel.create({ tournamentId, userId, collaboratorStatus })
        .then((status) => res.json(status))
        .catch((err) => res.status(500).json({ error: err.message }));
};

const handleUpdateStatus = (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;

  console.log("Updating status with ID:", id);
  console.log("Updated data:", updatedData);

  StatusModel.findByIdAndUpdate(id, updatedData, { new: true })
    .then((updatedStatus) => {
      if (!updatedStatus) {
        console.log("Status not found");
        return res.status(404).json({ error: "Status not found" });
      }
      console.log("Status updated successfully:", updatedStatus);
      res.json(updatedStatus);
    })
    .catch((err) => {
      console.error("Error updating Status:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

const handleGetStatus = (req, res) => {
  StatusModel.find({})
    .then(function (status) {
      res.json(status);
    })
    .catch(function (err) {
      console.error("Error fetching status:", err);
      res.status(500).json({ error: "Internal Server Error" });
      //res.json(err)
    });
};

module.exports = { 
    handleCreateStatus,
    handleUpdateStatus,
    handleGetStatus,
};
