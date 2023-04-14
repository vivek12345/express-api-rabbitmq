// controllers/NotificationController.js

const { successResponse, sendErrorResponse } = require('../helper/responseHelper');
const HTTP_STATUS_CODES = require('../constants/httpStatusCodes');
const Notification = require('../models/Notification');
const { saveNotification } = require('../database/db');
const sendNotification = require('../producers/notificationProducer');

async function createNotification(req, res) {
  try {
    const { type, recipient, subject, content } = req.body;
    const notification = new Notification(type, recipient, subject, content);

    const id = await saveNotification(notification);

    sendNotification('email_notifications', notification);

    res.status(201).json({ id });

    const response = successResponse(notification, HTTP_STATUS_CODES.CREATED);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error('Error processing notification request:', error);
    const errors = [{ code: 'internal_server_error', message: 'Internal server error' }];
    sendErrorResponse(res, errors, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  createNotification,
};
