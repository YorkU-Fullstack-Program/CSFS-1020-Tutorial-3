const express = require("express");
const { User } = require("../models");

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send("User not found.");
  }

  return res.send(user.toJSON());
});


router.delete("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const user = await User.findOne({ id: userId });

  if (!user) {
    return res.status(404).send("User not found.");
  }

  await user.delete();
  res.status(204).send("User deleted successfully.");
});

router.patch("/", async (req, res) => {
  const user = req.currentUser;

  if (req.body.name) {
    user.name = req.body.name;
  }

  if (req.body.age) {
    user.age = parseInt(req.body.age);
  }

  await user.update();

  return res.send(user.toJSON());
});


router.patch("/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send("User not found.");
  }

  if (user.id !== req.currentUser.id) {
      return res.status(403).send('Forbidden');
  }

  if (req.body.name) {
    user.name = req.body.name;
  }

  if (req.body.age) {
    user.age = parseInt(req.body.age);
  }

  await user.update();

  return res.send(user.toJSON());
});

module.exports = router;
