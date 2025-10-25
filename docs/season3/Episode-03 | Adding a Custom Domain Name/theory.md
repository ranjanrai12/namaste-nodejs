# Episode-03 | Adding a Custom Domain Name

## Purchase a Domain Name

purchase a domain name from any domain registrar such as:

- GoDaddy
- Namecheap
- Bluehost
- Hostinger, etc.

## Example (GoDaddy):

- Go to GoDaddy
- Log in or create a new account.
- Search for your desired domain name (e.g., devinder.in).
- If available, add it to your cart.
- Choose a registration duration (e.g., 1 year).
- Proceed to checkout and complete the payment.

Once done, the domain will appear in your GoDaddy Dashboard → My Products section.

## 2. Manage DNS on GoDaddy (Optional)

If you are not using Cloudflare, you can directly manage DNS here:

- Go to **My Products → Manage DNS**
- Add or edit DNS records as needed.

However, in this setup, we will use Cloudflare for DNS management and SSL.

## Create an Account on Cloudflare

- Visit Cloudflare
- Sign up or log in.
- Click Add a Site.
- Enter your purchased domain name (e.g., devinder.in).
- Select the Free Plan and click Continue.

## Change Name Servers to Cloudflare

Cloudflare will display two **nameservers** (e.g.):

- `adi.ns.cloudflare.com`
- `lee.ns.cloudflare.com`

### Now, go back to GoDaddy:

- Open your domain settings (My Products → Manage DNS).
- Find the **Nameservers** section.
- Click **Change Nameservers → Use My Own Nameservers**.
- Enter the two Cloudflare nameservers provided above.
- Save the changes.

**Note**: It may take 10–30 minutes for DNS changes to propagate globally.

## Verify Cloudflare Setup

- Return to the Cloudflare dashboard.
- Wait until the **status changes** from “Pending Nameserver Update” to “Active”.
- Once active, Cloudflare is now managing your DNS.

## Configure DNS Records in Cloudflare

After activation:

- Go to **DNS → Records** in Cloudflare.
- Delete any existing default “A” records.
- Add a new **A Record:**
  - **Type**: A
  - **Name:** @
  - **IPv4 Address:** Your server’s public IP (e.g., AWS EC2 IP)
  - **Proxy Status**: Proxied (orange cloud ON)
  - Click **Save**.

Your domain (devinder.in) now points to your server’s IP.

## Enable SSL in Cloudflare

- Go to **SSL/TLS → Overview.**
- Set **SSL/TLS encryption mode** to **Flexible**.
  - This secures traffic from browser → Cloudflare.
  - No SSL setup needed on your server for now.
- Click **Save**.
  - For advanced security, later switch to **Full SSL** by installing a valid certificate on your server.

## Enable HTTPS Redirects

- Go to **SSL/TLS → Edge Certificates.**
- Turn ON **Automatic HTTPS Rewrites.**
  - This ensures all HTTP requests automatically redirect to HTTPS.

## Test Your Setup

- open your browser and visit:
  - `http://devinder.in`
  - It should automatically redirect to `https://devinder.in`

## Summary of Key Terms

| Term                 | Meaning                                                         |
| -------------------- | --------------------------------------------------------------- |
| **Domain Registrar** | The provider from whom you purchase the domain (e.g., GoDaddy). |
| **Name Servers**     | Servers that direct where DNS is managed (e.g., Cloudflare).    |
| **DNS Records**      | Map your domain to an IP address or another domain.             |
| **A Record**         | Maps your domain to an IPv4 address.                            |
| **CNAME Record**     | Alias that maps one domain to another.                          |
| **SSL Certificate**  | Encrypts communication between browser and server for HTTPS.    |
