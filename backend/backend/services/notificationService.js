// const axios = require('axios');

// // Service function to send the push notification
// exports.sendPushNotification = async (session, title, body, data) => {
//     const message = {
//         to: session,  // Use the session (token) provided by the frontend
//         sound: 'default',
//         title: title,
//         body: body,
//         data: data,  // Pass the transaction data (can include additional info)
//     };

//     try {
//         // Sending the notification to the external API (exp.host)
//         const response = await axios.post('https://exp.host/--/api/v2/push/send', message, {
//             headers: {
//                 Accept: "application/json",
//                 "Accept-encoding": "gzip, deflate",
//                 "Content-Type": "application/json",
//             },
//         });

//         // Return the response data if the request is successful
//         if (response.status === 200) {
//             return {
//                 success: true,
//                 data: response.data,
//             };
//         } else {
//             return {
//                 success: false,
//                 error: response.data,
//             };
//         }
//     } catch (error) {
//         console.error('Error in notification service:', error.message);
//         return {
//             success: false,
//             error: error.message,
//         };
//     }
// };

import axios from 'axios'; // Ensure axios is imported

// Service function to send the push notification
export const sendPushNotification = async (session, title, body, data) => {
    const message = {
        to: session,  // Use the session (token) provided by the frontend
        sound: 'default',
        title: title,
        body: body,
        data: data,  // Pass the transaction data (can include additional info)
    };

    try {
        // Sending the notification to the external API (exp.host)
        const response = await axios.post('https://exp.host/--/api/v2/push/send', message, {
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
        });

        // Return the response data if the request is successful
        if (response.status === 200) {
            return {
                success: true,
                data: response.data,
            };
        } else {
            return {
                success: false,
                error: response.data,
            };
        }
    } catch (error) {
        console.error('Error in notification service:', error.message);
        return {
            success: false,
            error: error.message,
        };
    }
};
