const User = require("../models/User");
const Admin = require("../models/Admin");

const ensureAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: "LeniDeni Admin",
      email,
      password,
      role: "admin",
    });
  } else if (user.role !== "admin") {
    user.role = "admin";
    await user.save();
  }

  const existingAdmin = await Admin.findOne({ user: user._id });
  if (!existingAdmin) {
    await Admin.create({ user: user._id });
  }
};

module.exports = ensureAdmin;
