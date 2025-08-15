# Episode-08 | Data Sanitization & Schema Validations

## Adding Validations in Mongoose Schema

### Required Fields

If a required field is missing, Mongoose will reject the insert and return a validation error.

```js
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
```

### Unique Fields

This will trigger a duplicate key error if an insert attempts to reuse an existing value.

```js
email: { type: String, required: true, unique: true }
```

### Lowercase & Trim

```js
email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,  // store in lowercase
  trim: true        // remove extra spaces
}

```

Prevents issues where " user@example.com " and "user@example.com" would be treated differently.

### Length Validations

**For strings:**

```js
firstName: { type: String, minlength: 4, maxlength: 50 }
```

**For numbers:**

```js
age: { type: Number, min: 18, max: 100 }

```

### Default Values

If a field is not provided, Mongoose can assign a default value:

```js
about: { type: String, default: "This is a default description." },
photoUrl: {
  type: String,
  default: "https://example.com/default-profile.jpg"
}

```

### Arrays

For storing multiple values, This creates an empty array by default if no skills are provided.

```js
skills: { type: [String], default: [] }

```

### Custom Validators

```js
gender: {
  type: String,
  validate: {
    validator: function(value) {
      return ["male", "female", "others"].includes(value);
    },
    message: "Gender is not valid"
  }
}

```

### Running Validators on Update

By default, validators run **only on document creation**. When updating with findByIdAndUpdate or similar enable with `runValidators`.

```js
User.findByIdAndUpdate(id, updateData, { runValidators: true });
```

### Adding Automatic Timestamps

- **createdAt** — when the document was first created.

- **updatedAt** — when the document was last modified.

```js
const userSchema = new mongoose.Schema(
  {
    // fields...
  },
  { timestamps: true }
);
```

**Key Points**

[For More Details of Schema type please refer mongoose documentation.](https://mongoosejs.com/docs/schematypes.html)

## API-Level Validation Is Necessary

Even if you have UI validations, attackers can:

- Send direct API calls via tools like Postman.
- Inject unwanted or malicious data into your database.
- Overwrite sensitive fields like email, userId, etc.

### Example Risks:

- Changing email after signup (identity spoofing)
- Adding extremely large arrays.
- Inserting invalid URLs, numbers, or formats.

### Rule

**Never trust `req.body` directly** — validate and sanitize before storing.

### Example: Restricting Updatable Fields in PATCH API

Allow users to update only certain fields (e.g., `photoURL`, `about`, `gender`, `age`, `skills`)

```js
const allowedUpdates = ["photoURL", "about", "gender", "age", "skills"];

const isUpdateAllowed = (data) => {
  return Object.keys(data).every((key) => allowedUpdates.includes(key));
};

app.patch("/users/:userId", async (req, res) => {
  try {
    if (!isUpdateAllowed(req.body)) {
      throw new Error("Update not allowed");
    }

    // Example extra validation for skills length
    if (req.body.skills && req.body.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );

    res.status(200).send({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
```

### Schema-Level Validation with `validator` Library.

**Install**

```bash
npm install validator
```

```js
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address");
      }
    },
  },
  photoURL: {
    type: String,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error("Invalid photo URL");
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Enter a strong password");
      }
    },
  },
});
```

### Using the validator Library

**Few Example of validator library Functions**

- `validator.isEmail(value)` → checks for valid email format

- `validator.isURL(value)` → checks for valid URL

- `validator.isStrongPassword(value, options)` → checks for password strength

- `validator.isMobilePhone(value, locale)` → checks for valid phone number

- `validator.isNumeric(value)` → checks for numeric strings

```js
if (!validator.isStrongPassword(password)) {
  throw new Error(
    "Password must have at least 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 symbol"
  );
}
```
