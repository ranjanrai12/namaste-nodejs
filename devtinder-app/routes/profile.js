const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(500).send("Error fetching profile: " + err.message);
  }
});

profileRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const { user } = req;
    res.send(user.firstName + " connection request sent successfully");
  } catch (err) {
    res.status(500).send("Error sending connection request: " + err.message);
  }
});

module.exports = profileRouter;
