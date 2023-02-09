import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import checkAuth from "./utils/checkAuth.js";

import allPlayers from "./utils/allPlayers.js";
import { registerValidation } from "./validation/auth.js";

import { register, login, getMe } from "./controllers/UserController.js";
import {getAllRingGames, sendMessageRingGames} from "./controllers/RingGamesController.js"
import { getAllPlayers, decrementPlayerId, editPlayer, deletePlayer, updateAllPlayers } from "./controllers/PlayersController.js";
import {getAllJackpots, editJackpots, createJackpots, deleteJackpots} from "./controllers/JackpotController.js"
import {addAffiliates, getAllAffiliates} from "./controllers/AffiliatesController.js"

const app = express();
app.use(cors());
mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://dizainzt:Maqim1981!@cluster0.yamoyz7.mongodb.net/poker?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Db ok");
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-with, content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  return next();
});

app.use(express.json());

app.post("/auth/login", login);

app.post("/auth/register", registerValidation, register);

app.get("/auth/me", checkAuth, getMe);

app.get("/auth/allplayers", getAllPlayers);

app.post("/player/decrementplayerid", decrementPlayerId);

app.post("/player/playeredit", editPlayer);

app.get("/player/update", updateAllPlayers);

app.delete("/player/:id", deletePlayer);

app.get("/ringgames/all", getAllRingGames);

app.post("/ringgames/messages", sendMessageRingGames);

app.get("/jackpot/alljackpot", getAllJackpots);

app.put("/jackpot/:id", editJackpots);

app.post("/jackpot/createjackpot", createJackpots);

app.delete("/jackpot/:id", deleteJackpots);

app.post("/affiliates/add", addAffiliates);

app.get("/affiliates/getallaffilii", getAllAffiliates);

app.listen(5555, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Ok server");
});
