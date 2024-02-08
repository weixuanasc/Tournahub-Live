const mongoose = require('mongoose')

const MatchesSchema = new mongoose.Schema({
    tournamentId: String,
    MatchNumber: String,
    MatchName: String,
    MatchDate: Date,
    MatchTime: String,
    Player1: String,
    Player2: String,
    Player1_Score: String,
    Player2_Score: String,
    Winner: String,
})

const MatchesModel= mongoose.model("matches", MatchesSchema)

module.exports = MatchesModel;