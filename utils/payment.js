// const cron = require('node-cron');
// const mongoose = require('mongoose');
// const User = require('./models/user'); // Import your user model
// const PaymentGateway = require('./paymentGateway'); // Import your payment gateway

// // Schedule the task to run every 30 days
// cron.schedule('0 0 */30 * *', async () => {
//   try {
//     // Find users who need to be charged
//     const usersToCharge = await User.find({
//       subscriptionPaid: true, // Users with an active subscription
//       lastPaymentDate: { $lt: new Date().setDate(new Date().getDate() - 30) }, // Last payment was 30 days ago
//     });

//     // Charge each user
//     for (const user of usersToCharge) {
//       // Calculate the subscription fee as described in the previous answer
//       const subscriptionFee = calculateSubscriptionFee(user);

//       // Charge the user with the subscription fee using your payment gateway
//       const paymentResult = await PaymentGateway.charge(user, subscriptionFee);

//       if (paymentResult.success) {
//         // Update the last payment date
//         user.lastPaymentDate = new Date();
//         await user.save();
//       } else {
//         // Handle payment failure
//         console.error(`Payment failed for user ${user._id}:`, paymentResult.error);
//       }
//     }
//   } catch (error) {
//     console.error('Error charging subscription fees:', error);
//   }
// });

