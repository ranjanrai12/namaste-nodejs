const { subDays, startOfDay, endOfDay } = require("date-fns");
const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("../utils/sendEmail");

const scheduler = cron.schedule("0 10 * * 1,3,5", async () => {
  console.log("running a task every minute", new Date());

  try {
    const yesterday = subDays(new Date(), 0);
    const yesterdayStartDate = startOfDay(yesterday);
    const yesterdayEndDate = endOfDay(yesterday);

    const pendingRequest = await ConnectionRequest.find({
      status: "interested",
      createdAt: { $gte: yesterdayStartDate, $lte: yesterdayEndDate },
    }).populate("toUserId", "email");

    const emailSet = new Set([
      ...pendingRequest.map((req) => req.toUserId.email),
    ]);
    /**
     * Send email
     */
    for (let email of emailSet) {
      try {
        await sendEmail.run();
      } catch (err) {
        console.log(`Failed to send email to ${email}:`, err.message);
      }
      break; // don't have production access working with sandbox, so sender email is hardcoded for now so don't want to send too much to the same email
    }
    console.log(emailSet);
  } catch (err) {
    console.error("Error in cron job:", err.message);
  }
});
