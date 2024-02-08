const SportsModel = require("../models/Sports");

const handleManageSports = (req, res) => {
  SportsModel.find({})
    .then((sports) => res.json(sports))
    .catch((err) => res.json(err));
};
const handleGetSingleSport = (req, res) => {
  const id = req.params.id;
  SportsModel.findById({ _id: id })
    .then((sports) => res.json(sports))
    .catch((err) => res.json(err));
};
const handleGetSports = (req, res) => {
  SportsModel.find({})
    .then(function (sports) {
      res.json(sports);
    })
    .catch(function (err) {
      console.error("Error fetching sports:", err);
      res.status(500).json({ error: "Internal Server Error" });
      //res.json(err)
    });
};
const handleUpdateSport = (req, res) => {
  const id = req.params.id;
  SportsModel.findByIdAndUpdate({ _id: id }, { name: req.body.name })
    .then((sports) => res.json(sports))
    .catch((err) => res.json(err));
};
const handleDeleteSport = (req, res) => {
  const id = req.params.id;
  SportsModel.findByIdAndDelete({ _id: id })
    .then((res) => res.json(res))
    .catch((err) => res.json(err));
};
const handleSearchSport = (req, res) => {
  const { name } = req.params;
  SportsModel.find({ name: { $regex: new RegExp(name, "i") } })
    .then((sports) => res.json(sports))
    .catch((err) => res.json(err));
};
const handleCreateSport = (req, res) => {
  SportsModel.create(req.body)
    .then((sports) => res.json(sports))
    .catch((err) => res.json(err));
};
module.exports = {
  handleManageSports,
  handleGetSingleSport,
  handleGetSports,
  handleUpdateSport,
  handleDeleteSport,
  handleCreateSport,
  handleSearchSport,
};
