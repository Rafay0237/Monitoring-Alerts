const express = require('express');
const { createAlert, reportCrash, getAlertStatus, getAllAlerts, deleteAlert, updateAlert, regenerateAlertKey } = require('../controllers/alerts');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create', auth, createAlert);
router.post('/report/:key', reportCrash);
router.get('/:id', auth, getAlertStatus);
router.delete('/:id', auth, deleteAlert);
router.put('/:id', auth, updateAlert);
router.get('/get-all/:userId', auth, getAllAlerts);
router.put("/:id/regenerate-key", auth, regenerateAlertKey);

module.exports = router;
