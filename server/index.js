require("dotenv").config();

const app = require("./app");
const env = require("./config/env");
const userModel = require("./models/user.model");

userModel.getDemo();
userModel
  .ensureDemoUser()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
