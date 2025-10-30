# Episode-05 | Keeping Our Credentials Safe Using dotenv Files

## Goal

To keep secrets (DB passwords, API keys, JWT secrets, PEMs, etc.) out of your repo using `.env` files and the `dotenv` package. It covers local development, deployment, multiple environments, commands, common mistakes, and recommended security practices.

---

## 1) Why this matters

* Secrets in code or GitHub are easy to leak and let others access your databases, payment gateways, cloud resources, and servers.
* Use environment variables so secrets live outside source code and only exist on machines that need them.
* `dotenv` provides an easy local/deployment pattern for loading env vars into `process.env` in Node.js.

---

## 2) Quick summary

1. Create a `.env` file at project root and keep all secrets there.
2. Add `.env` to `.gitignore` so it is never committed.
3. Install `dotenv` (`npm install dotenv`) and load it early in your app (`require('dotenv').config()`).
4. Use `process.env.MY_SECRET` in your Node/Express code.
5. On production servers, create the `.env` file manually (or use a secrets manager) and restart the service.

---

## 3) Install

```bash
npm install dotenv
```

Add the package to `package.json`. (If deploying on server, run `npm install` there too after pulling code.)

---

## 4) `.env` file format

* Plain text file, key-value pairs, one per line.
* No `const` / `let` / JS syntax — just `KEY=value`.
* Quotes are optional (use them for readability if a value contains spaces).
* Example:

```
DB_CONNECTION=mongodb+srv://user:superSecret@cluster0.mongodb.net/mydb
PORT=7777
JWT_SECRET="myjwtsecret123"
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=abc123
```

* Comments: use `#` to comment lines.

---

## 5) Using dotenv in Node (example)

Create `.env` in project root. Then in your entry file (e.g., `app.js` or `server.js`) load dotenv **as early as possible**:

```js
// app.js (top of file)
require('dotenv').config();

const express = require('express');
const app = express();

const dbConn = process.env.DB_CONNECTION;
const PORT = process.env.PORT || 3000;

// rest of your code
app.listen(PORT, () => console.log(`Server on ${PORT}`));
```

Important: `require('dotenv').config()` must run before you import modules that read `process.env`.

---

## 6) Example: database module using env

```js
// db.js
const mongoose = require('mongoose');

const uri = process.env.DB_CONNECTION;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection failed:', err.message));
```

---

## 7) Frontend note (React / browser)

* Browser code cannot read server-side `process.env` at runtime. If using a frontend framework:

  * For React (Create React App), prefix build-time envs with `REACT_APP_` and set them before `npm run build` (or use `.env.production`).
  * For other bundlers, inject env vars at build time or use a separate configuration endpoint.
* **Never** embed production secrets (DB passwords, private keys) in client-side build.

---

## 8) `.gitignore` (never commit your .env)

Add to `.gitignore`:

```
# Local env files
.env
.env.*.local
```

Check `git status` before committing to ensure `.env` is not tracked. If you accidentally committed it, rotate the secrets immediately and remove from history.

---

## 9) Deployment — how to deploy with .env

Typical steps (example using a Linux server + PM2):

1. On server: `git pull` to fetch latest code (repo does NOT contain `.env`).
2. Install dependencies: `npm install`.
3. Create `.env` manually on server:

   ```bash
   sudo nano /path/to/project/.env
   # paste the key=value lines and save
   ```
4. Start/restart app with PM2:

   ```bash
   pm2 start app.js --name backend
   # or restart
   pm2 restart backend
   pm2 logs backend
   ```
5. Check `pm2 logs` or application logs for `DB connected` messages.

If your server uses environment variable injection (hosting provider UI, Docker, systemd), set envs there instead of a file.

---

## 10) Using multiple env files (dev / staging / production)

Approaches:

* Create `.env.development`, `.env.staging`, `.env.production` and explicitly load the correct file:

  ```js
  require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
  ```
* Or use dotenv CLI or cross-env when starting the app:

  ```bash
  NODE_ENV=production node -r dotenv/config server.js dotenv_config_path=.env.production
  ```
* Many hosting providers handle envs for you — prefer platform secrets for production.

---

## 11) Common mistakes & troubleshooting

* `undefined` values: ensure `require('dotenv').config()` runs before modules that access `process.env`.
* `.env` still tracked by Git: remove it from the index (`git rm --cached .env`), add to `.gitignore`, rotate secrets.
* 502 / DB connection fails in production: likely `.env` not present on server or wrong values — confirm file and restart service.
* Forgetting `npm install` on server after adding `dotenv` will throw `Cannot find module 'dotenv'`.

---

## 12) Commands cheat-sheet

```bash
# local
npm install dotenv
# run
node -r dotenv/config app.js
# or in code
require('dotenv').config()

# save .env out of git
echo ".env" >> .gitignore

# server (deploy)
git pull
npm install
# create .env manually
sudo nano .env
# restart
pm2 restart backend
pm2 logs backend

# copy frontend build to server (example)
npm run build
scp -r dist/* user@server:/var/www/html/
```

---

## 13) Security best practices (production-grade)

* Do **not** store PEM, private keys, or long-term credentials in your repo.
* Use a managed secrets store when possible (AWS Secrets Manager, Parameter Store, HashiCorp Vault, Azure Key Vault).
* Grant least-privilege: DB users should have only required permissions (no full admin unless needed).
* Rotate credentials regularly and after any accidental exposure.
* Protect servers: use SSH keys, firewall rules, and monitoring.
* Audit logs and alerts for suspicious activity.
* Use HTTPS and secure cookies, and set proper CORS policies.

---

## 14) If a secret was leaked (immediate steps)

1. Rotate the exposed secret immediately (change DB password, regenerate API key).
2. Revoke old credentials if possible.
3. Check logs for unauthorized access and contain the incident.
4. If `.env` was committed to GitHub, remove it from history and force-push (but still rotate secrets — treat GitHub as already leaked).

---

## 15) Example checklist before pushing code

* [ ] `.env` is in `.gitignore`.
* [ ] No secret values are in source files or committed history.
* [ ] `dotenv` is loaded at the very top of entry file.
* [ ] Passwords/keys needed in production are available on the server (or in secrets manager).
* [ ] `npm install` run on server and `pm2` or service restarted.

---

## 16) Further reading / homework

* Read the `dotenv` docs on npm for advanced features (multi envs, path option).
* Learn about production secrets managers (AWS Secrets Manager, Vault).
* Homework: set up `.env.development` and `.env.production` and demonstrate switching between them.

---

## 17) Appendix — short example files

**.env**

```
PORT=7777
DB_CONNECTION=mongodb+srv://user:NewStrongPassword@cluster0.mongodb.net/mydb
JWT_SECRET=something_super_secret
```

**app.js**

```js
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// rest of the app
app.listen(PORT, () => console.log('Server running on', PORT));
```
