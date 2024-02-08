const mongoose = require('mongoose')

const SponsorIconSchema = new mongoose.Schema({
    urlLink: String,
    icon: String
})

const SponsorIconModel= mongoose.model("sponsoricon", SponsorIconSchema)

module.exports = SponsorIconModel;