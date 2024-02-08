const MatchesModel = require("../models/Matches");

const handleCreateMatches = (req, res) => {
    MatchesModel.create(req.body)
      .then((matches) => res.json(matches))
      .catch((err) => res.json(err));
  };

  const handleGetMatches = (req, res) => {
    const tournamentId = req.params.tournamentId;
  
    MatchesModel.find({ tournamentId: tournamentId })
      .then(function (matches) {
        res.json(matches);
      })
      .catch(function (err) {
        console.error("Error fetching matches:", err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  };

  const handleUpdateMatches = (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
  
    console.log('Updating match with ID:', id);
    console.log('Updated data:', updatedData);
  
    MatchesModel.findByIdAndUpdate(id, updatedData, { new: true })
      .then((updatedMatch) => {
        if (!updatedMatch) {
          console.log('Match not found');
          return res.status(404).json({ error: 'Match not found' });
        }
        console.log('Match updated successfully:', updatedMatch);
        res.json(updatedMatch);

      })
      .catch((err) => {
        console.error('Error updating match:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  };
  
  
  module.exports = { 
    handleCreateMatches,
    handleGetMatches,
    handleUpdateMatches,
  };