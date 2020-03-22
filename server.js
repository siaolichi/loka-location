const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");

app.use(express.json());

const connectDB = require("./config/db");
connectDB();

// app.get('/',(req, res)=>{
//     res.send('API Running')
// })

//Define routes
app.use("/api/user", require("./routes/api/user"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/post", require("./routes/api/post"));

//Serve static asset for production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
