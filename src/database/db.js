const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});

async function updateNotificationStatus(id, status) {
  try {
    await pool.query('UPDATE notifications SET status = $1 WHERE id = $2', [status, id]);
    console.log('Notification status updated:', id, status);
  } catch (error) {
    console.error('Error updating notification status:', error);
  }
}

async function getNotificationStatus(id) {
  try {
    const result = await pool.query('SELECT status FROM notifications WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return null;
    }

    return result.rows[0].status;
  } catch (error) {
    console.error('Error fetching notification status:', error);
    throw error;
  }
}

async function saveNotification(type, recipient, subject, content) {
  try {
    const result = await pool.query(
      'INSERT INTO notifications (type, recipient, subject, content, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [type, recipient, subject, content, 'pending']
    );

    return result.rows[0].id;
  } catch (error) {
    console.error('Error saving notification:', error);
    throw error;
  }
}

module.exports = {
  updateNotificationStatus,
  getNotificationStatus,
  saveNotification,
};
