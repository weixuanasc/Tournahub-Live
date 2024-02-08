const RankingTableModel = require("../models/RankingTable");

const handleCreateRankingTable = (req, res) => {
  RankingTableModel.create(req.body)
    .then((rankingTable) => {
      res.status(201).json({ success: true, data: rankingTable });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    });
};

const handleGetRankingTable = (req, res) => {
  const tournamentId = req.params.tournamentId;
  console.log('Received request for tournamentId:', tournamentId);

  RankingTableModel.find({ tournamentId: tournamentId })
    .then(function (rankingTable) {
      console.log('Found ranking table:', rankingTable);
      res.json(rankingTable);
    })
    .catch(function (err) {
      console.error("Error fetching ranking table:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
};
module.exports = { 
  handleCreateRankingTable,
  handleGetRankingTable,
};
