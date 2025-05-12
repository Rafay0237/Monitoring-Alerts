const express = require('express');
const { createAlert, reportCrash, getAlertStatus, getAllAlerts } = require('../controllers/alerts');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create', auth, createAlert);
router.post('/report/:key', reportCrash);
router.get('/:key', auth, getAlertStatus);
router.get('/get-all/:userId', auth, getAllAlerts);

module.exports = router;
