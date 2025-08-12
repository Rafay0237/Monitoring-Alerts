const crypto = require("crypto");
const Alert = require("../models/alerts");
const sendAlertEmail = require("../config/nodemailer");

// 1. Create Alert Settings
const createAlert = async (req, res) => {
  const { projectName, email, limit } = req.body;

  if (!projectName || !email || !limit) {
    return res
      .status(400)
      .json({ message: "projectName, email, and limit are required" });
  }

  const key = crypto.randomBytes(4).toString("hex");

  try {
    const alert = await Alert.create({
      userId: req.userId,
      projectName,
      email,
      limit,
      key,
    });

    res.status(201).json({ message: "Alert created", key: alert.key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Report Crash
const reportCrash = async (req, res) => {
  if (!req.params.key)
    return res.status(400).json({ message: "Cannot Report Alert without key" });
  try {
    const alert = await Alert.findOne({ key: req.params.key });
    if (!alert) return res.status(404).json({ message: "Key not found" });

    let emailSendMessage = "Email Sent Successfully!";
    alert.count += 1;

    if (alert.count >= alert.limit) {
      const isEmailSent = await sendAlertEmail(
        alert.email,
        alert.projectName,
        alert.count
      );
      if (!isEmailSent)
        emailSendMessage = "Some error occured while sending email";
    }

    await alert.save();
    res.json({
      message: "Crash recorded. " + emailSendMessage,
      count: alert.count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Alert Status
const getAlertStatus = async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ message: "Cannot Get Alert without id" });
  try {
    const alert = await Alert.findOne({ _id: req.params.id });
    if (!alert) return res.status(404).json({ message: "id not found" });

    res.json({
      _id:alert._id,
      projectName: alert.projectName,
      email: alert.email,
      count: alert.count,
      limit: alert.limit,
      createdAt: alert.createdAt,
      key: alert.key,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Get All Alerts for a User
const getAllAlerts = async (req, res) => {
  if (!req.params.userId)
    return res
      .status(400)
      .json({ message: "Cannot get status without user id" });

  try {
    const alerts = await Alert.find({ userId: req.params.userId });
    if (!alerts || alerts.length === 0)
      return res.status(404).json({ message: "Alerts not found" });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Update Alert
const updateAlert = async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ message: "Cannot update without id" });

  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!alert) return res.status(404).json({ message: "Alert not found" });

    res.json({ message: "Alert updated successfully", alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Delete Alert
const deleteAlert = async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ message: "Cannot delete without id" });

  try {
    const alert = await Alert.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!alert) return res.status(404).json({ message: "Alert not found" });

    res.json({ message: "Alert deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const regenerateAlertKey = async (req, res) => {
  if (!req.params.id) {
    return res
      .status(400)
      .json({ message: "Cannot regenerate key without id" });
  }

  try {
    const newKey = crypto.randomBytes(4).toString("hex");

    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { key: newKey },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json({ message: "Key regenerated successfully", alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createAlert,
  reportCrash,
  getAlertStatus,
  getAllAlerts,
  updateAlert,
  deleteAlert,
  regenerateAlertKey,
};
