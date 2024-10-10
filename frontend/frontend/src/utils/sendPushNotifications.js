import axios from "axios";
const IMAGE_URL = process.env.REACT_APP_MAIN_API;
const sendPushNotification = async (session, title, body, transactionData) => {
  // Prepare the message payload
  console.log(
    `Pushing Notifications session ${session} , title ${title} , body ${body} , transactions ${transactionData}`
  );

  const message = {
    session,
    title,
    body,
    data: transactionData,
  };

  try {
    const response = await axios.post(
      `${IMAGE_URL}/api/notifications`,
      message,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`pushed Notifications Successfully`);

    if (response.status === 200) {
      alert("Notification sent successfully:");
    }
  } catch (error) {
    console.error(
      "Error sending notification:",
      error.response ? error.response.data : error.message
    );
  }
};

export default sendPushNotification;
