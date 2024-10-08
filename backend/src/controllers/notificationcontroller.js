// controllers/notificationController.js
const notificationService = require("../../services/notificationService");

// Controller to handle the notification request
const sendNotification = async (req, res) => {
  const { session, title, body, data } = req.body;
  // console.log(req.body)
  try {
    // Call the service function
    const notificationResponse = await notificationService.sendPushNotification(
      session,
      title,
      body,
      data
    );
    const start = session.indexOf("[") + 1;
    const end = session.indexOf("]");
    console.log(session.substring(start, end));

    if (notificationResponse.success) {
      return res.status(200).json({
        success: true,
        message: "Notification sent successfully",
        data: notificationResponse.data,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to send notification",
        error: notificationResponse.error,
      });
    }
  } catch (error) {
    console.error("Error in sending notification:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred while sending notification",
      error: error.message,
    });
  }
};

module.exports = { sendNotification };
