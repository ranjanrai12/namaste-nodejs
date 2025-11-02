# Episode-07 | Payment Gateway Integration ft. Razorpay

## Overview

To integrate **Razorpay**, a popular Indian payment gateway, into the application

You’ll learn how to securely handle payments, store payment details, and ensure end-to-end consistency between Razorpay and your database.

Payment gateway integration is a **critical and security-sensitive process**. Improper setup can cause:

- Missing or unverified payments
- Inconsistent data between your app and Razorpay
- Security risks (e.g., exposing secret keys)

## Payment Flow Overview

Every online payment follows **two main steps:**

- **Create Order**
  - When the user clicks Pay Now, an order is created on the backend.
  - The backend communicates with Razorpay using a **secret key** to generate this order.
  - The frontend then uses the order details to open the Razorpay payment popup.
- **Verify Payment**
  - Once the user completes the payment, Razorpay sends payment information back to your app.
  - Your backend must verify whether the payment was successful.
  - After verification, update the database accordingly (mark as paid, issue receipt, upgrade user status, etc.).

## Important Note

- All sensitive communication (order creation and payment verification) must happen through the **backend** only.
- Never expose your Razorpay secret key to the frontend.

## Required APIs

Need to build **two backend APIs:**

| API Name               | Description                                                                   |
| ---------------------- | ----------------------------------------------------------------------------- |
| **Create Order API**   | Creates an order in Razorpay and returns order details to the frontend.       |
| **Verify Payment API** | Verifies the payment signature received from Razorpay to ensure authenticity. |

## Security Guidelines

- Store your Razorpay **Secret Key** securely (e.g., in environment variables using `.env`).

- Never commit the **secret key** to your Git repository.

- Always perform **server-side verification** of payments.

- Use HTTPS for all frontend-backend communication.

## Razorpay Account Setup

- Visit https://razorpay.com/ and click **Sign Up**.
- Provide the following information:
  - Phone number
  - Aadhaar or other government ID
  - Bank account details (for receiving payments)
  - Website URL
- Ensure your website has the following pages:
  - **Privacy Policy**
  - **Terms of Service**
  - **Refund Policy**
  - **Contact Us**

These URLs are mandatory for verification.

- Complete KYC (Know Your Customer) verification.
  Approval can take 3–5 days.
- If there are issues, contact Razorpay customer support — they are generally responsive.

## Dashboard Access

Once approved, you’ll get access to the **Razorpay Dashboard:**

- Two modes are available:
  - **Test Mode** – for development (dummy payments).
  - **Live Mode** – for production (real payments)

Start integration in **Test Mode**.

**TODO**: Needs to continue once account is activated
