const validator = require("validator");

const validateSignUpData = (req) => {
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
};

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

const validationProfileUpdateData = (req) => {
  const allowedFieldsToUpdate = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "country",
    "photoUrl",
    "about",
  ];
  const { firstName, skills } = req.body;
  if (!validator.isLength(firstName, { min: 3 })) {
    throw new Error("FirstName should be more than or equal to 3 characters");
  }
  if (skills && !skills.length > 30) {
    throw new Error("Skills should not be more than 30");
  }

  return Object.keys(req.body).every((item) =>
    allowedFieldsToUpdate.includes(item)
  );
};

module.exports = {
  validateSignUpData,
  validateLoginData,
  validationProfileUpdateData,
};
