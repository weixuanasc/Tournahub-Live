const mongoose = require('mongoose')

const StatisticsSchema = new mongoose.Schema({
    tournamentId: String,
    Participant: String,
    Score: String,
    AverageScore: String,
    TotalScore: String,
})

const StatisticsModel= mongoose.model("statistics", StatisticsSchema)

module.exports = StatisticsModel;