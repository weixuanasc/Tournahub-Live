const mongoose = require('mongoose')

const RankingTableSchema = new mongoose.Schema({
    tournamentId: String,
    Winner: String,
    RunnerUp: String,

})

const RankingTableModel= mongoose.model("rankingTable", RankingTableSchema)

module.exports = RankingTableModel;