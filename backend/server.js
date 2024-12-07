const env = require("dotenv");
env.config({ path: "./.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { invreq } = require("./models/other");

const userRoutes = require("./routes/user");
const userRoutess = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const stuRoutes = require("./routes/stuRoutes");
const entRoutes = require("./routes/entRoutes");
const angelRoutes = require("./routes/angelRoutes");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({ origin: "*", credentials: true }));

app.use("/api/user", [userRoutes, userRoutess]);
app.use("/", [postRoutes, stuRoutes, entRoutes]);
app.use("/api", angelRoutes);

app.get("/", (req, res) => res.send("express is here"));

invreq.updateMany(
  { $or: [{ status: { $exists: false } }, { status: null }, { status: "" }] },
  { $set: { status: "pending" } }
);

invreq.updateMany(
  { $or: [{ amount: { $exists: false } }, { amount: null }, { amount: "" }] },
  { $set: { amount: "0" } }
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(process.env.PORT || 4000, () =>
      console.log("connected to db & listening on port", process.env.PORT)
    )
  )
  .catch((error) => console.log(error));
