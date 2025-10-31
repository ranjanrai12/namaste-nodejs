# Episode-06 | Scheduling Cron Jobs

## Overview

Build a feature in our app (e.g. DevTinder) that automatically sends an email every day at 8:00 AM to all users who received friend requests on the previous day.

This feature demonstrates how to:

- Schedule periodic jobs in Node.js (Cron Jobs)
- Run background tasks automatically at fixed times
- Work with time ranges (yesterday’s data)
- Send emails programmatically
- Handle scalability (batch processing, queues)

## Use Case

Every morning at 10:00 AM of monday, wednesday & friday, the system should:

- Fetch all friend requests received `yesterday`
- Collect the recipient email addresses.
- Remove duplicates (only one email per user).
- Send reminder emails to those users.

## Installation

```bash
npm install node-cron date-fns
```

## Step-by-Step Implementation

```js
const { subDays, startOfDay, endOfDay } = require("date-fns");
const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("../utils/sendEmail");

const scheduler = cron.schedule("0 10 * * 1,3,5", async () => {
  console.log("running a task every minute", new Date());

  try {
    const yesterday = subDays(new Date(), 1);
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
```

## Trigger Cron on App Start

```js
require("./utils/cronJob");
```

## Play with cron string

https://crontab.guru/

## Scaling the Solution

For **small applications** (hundreds of users), the above approach works fine.

For **large-scale systems**, sending thousands or millions of emails directly in a loop is inefficient.

**Possible Optimizations:**

- **Batch Processing**
  - Send emails in batches (e.g., 100 at a time).
- **Queues (Recommended)**

  - Use job queues like Bull or Bee-Queue.
  - Push each email task into a queue, and workers process them asynchronously.
  - Prevents blocking the main thread and improves reliability.

    Example:

    ```bash
    npm install bull
    ```

    ```js
    const Queue = require("bull");
    const emailQueue = new Queue("emailQueue");

    emailQueue.process(async (job) => {
      const { to, subject, body } = job.data;
      await sendEmail.run({ to, subject, body });
    });

    // Instead of await sendEmail.run(...)
    emailQueue.add({ to: email, subject, body });
    ```

- **Pagination in DB Queries**
  - Use `.limit()` and `.skip()` to avoid loading too many records at once.
