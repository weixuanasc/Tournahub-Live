const mongoose = require('mongoose')

const StatusSchema = new mongoose.Schema({

    tournamentId: String,
    userId: String,
    collaboratorStatus: String,


})

const StatusModel= mongoose.model("status", StatusSchema)

module.exports = StatusModel;