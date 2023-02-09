import * as dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import PlayersModel from "../models/Players.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import PM from "pokermavens";

const pm = new PM({
  url: process.env.PM_API_URL,
  password: process.env.PM_API_PASSWORD,
});

//---Get all ring games-----

export const getAllRingGames = async (req, res) => {
  pm.RingGamesList({
    Fields: "Name",
  }).then((result) => {
    let array = []
    result.map((element) => {
      pm.RingGamesGet({
        Name: element.Name,
      }).then((result) => {
        array.push(result);
      });
    });

    setTimeout(() => {
      res.json({
        array,
      });
    }, 1000);
  });
};
export const sendMessageRingGames = async (req, res) => {
  pm.RingGamesMessage({
    Name: req.body.name,
    Message: req.body.message,
  }).then((result) => {
    res.status(200).json({
      result
    })
  }).catch((err)=>{
    console.log(err)
    
  });
};
