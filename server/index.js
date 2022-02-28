const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const auctionsRouter = require("./routes/Auctions");
app.use("/auctions", auctionsRouter);

const bidsRouter = require("./routes/Bids");
app.use("/bids", bidsRouter);

const offersRouter = require("./routes/Offers");
app.use("/offers", offersRouter);

const tradesRouter = require("./routes/Trades");
app.use("/trades", tradesRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server running on port 3001");
  });
});