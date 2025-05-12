const crypto = require("crypto");
const Alert = require("../models/alerts");
const sendAlertEmail = require("../config/nodemailer");

// 1. Create Alert
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
    
    let emailSendMessage = "Email Sent Successfully!"
    alert.count += 1;

    if (alert.count >= alert.limit) {
      const isEmailSent = await sendAlertEmail(alert.email, alert.projectName, alert.count);
      if(!isEmailSent)
      emailSendMessage = "Some error occured while sending email"
    }

    await alert.save();
    res.json({ message: "Crash recorded. "+emailSendMessage, count: alert.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Alert Status
const getAlertStatus = async (req, res) => {
   if (!req.params.key)
    return res.status(400).json({ message: "Cannot Report Alert without key" });
  try {
    const alert = await Alert.findOne({ key: req.params.key });
    if (!alert) return res.status(404).json({ message: "Key not found" });

    res.json({
      projectName: alert.projectName,
      email: alert.email,
      count: alert.count,
      limit: alert.limit,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllAlerts = async (req, res) => {
  if (!req.params.userId)
    return res.status(400).json({ message: "Cannot get status without user id" });

  try {
    const alerts = await Alert.find({ userId: req.params.userId });
    if (!alerts || alerts.length === 0)
      return res.status(404).json({ message: "Alerts not found" });

    res.json(alerts); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = { createAlert, reportCrash, getAlertStatus, getAllAlerts };
