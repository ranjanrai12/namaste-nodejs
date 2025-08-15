# Episode-09 | Encrypting Passwords

## Why Secure Authentication Matters

- **Plain text passwords are unsafe**: Storing passwords as-is allows attackers to read them directly from the database.
- **Hashing**: Converts passwords into irreversible encrypted strings using algorithms like bcrypt.
- **Salting**: Adds random data to passwords before hashing to prevent rainbow table attacks.

## Sign Up

- Validate input (`firstName`, `lastName`, `email`, `password`).
- `Hash password` using bcrypt (salt rounds = 10).
- Save hashed password to DB.

**Validation Utility**

```js
// utils/validation.js
const validator = require("validator");

function validateSignUpData(req) {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || firstName.length < 3 || firstName.length > 50) {
    throw new Error("First name must be between 3 and 50 characters long.");
  }
  if (!lastName || lastName.length < 3 || lastName.length > 10) {
    throw new Error("Last name must be between 3 and 10 characters long.");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format.");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 6 characters long and contain a mix of letters, numbers, and symbols."
    );
  }
}

module.exports = { validateSignUpData };
```

**signUp API**

```js
const bcrypt = require("bcrypt");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // Validate the signup data before saving
    validateSignUpData(req);
    const bcryptPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", bcryptPassword);
    const user = new User({
      firstName,
      lastName,
      email,
      password: bcryptPassword,
    });
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});
```

## Login

- Prepare the loginValidation
- Find user in DB.
- Compare plain `password` with `hashed password` (bcrypt.compare).
- If valid → return success; else → Invalid credentials.

**Login validation Util**

```js
const validateLoginData = (req) => {
  const { email, password } = req.body;
  if (!email) {
    throw new Error("Email is required.");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format.");
  }
  if (!password) {
    throw new Error("Password is required.");
  }
};
module.exports = {
  validateLoginData,
};
```

**Login API**

```js
app.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLoginData(req);

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Invalid email or password");
    }
    res.send("Login successful");
  } catch (err) {
    res.status(500).send("Error logging in: " + err.message);
  }
});
```

### Best Practices

- `Hash passwords`: Always use `bcrypt` or similar libraries.
- `Use salting`: Default to saltRounds=10 for a balance of security and performance.
- `Validate strictly`: Reject invalid emails/weak passwords upfront and keep validation in separate utils.
