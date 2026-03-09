const dotenv = require("dotenv");
const dns = require("dns");
const app = require("./app");
const connectDb = require("./config/db");
const ensureAdmin = require("./utils/ensureAdmin");

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDb();
  await ensureAdmin();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
