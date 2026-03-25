import Team from "../models/Team.js";

export const createTeam = async (req, res) => {
  try {
    const { name, members } = req.body;
    const newTeam = await Team.create({
      name,
      members,
      employerId: req.user._id,
    });
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: "Error creating team", error: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ employerId: req.user._id }).populate("members", "name email");
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teams", error: error.message });
  }
};
