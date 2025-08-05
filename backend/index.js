const app = require("./app.js");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
