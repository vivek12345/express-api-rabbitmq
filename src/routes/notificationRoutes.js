const express = require('express');
const rateLimit = require('express-rate-limit');
const { createNotification } = require('../controllers/NotificationController');
const { notificationSchema } = require('../validations/notifications');
const HTTP_STATUS_CODES = require('../constants/httpStatusCodes');

const router = express.Router();

// Configure the rate limit middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

router.post('/', apiLimiter, async (req, res) => {
  const { error, value } = notificationSchema.validate(req.body);

  if (error) {
    const errors = error.details.map((detail) => ({
      code: detail.type,
      message: detail.message,
    }));
    return sendErrorResponse(res, errors, HTTP_STATUS_CODES.BAD_REQUEST);
  }

  req.body = value;
  createNotification(req, res);
});

module.exports = router;
