import * as dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import PlayersModel from "../models/Players.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import JackpotModel from "../models/JackpotConfig.js";
import PM from "pokermavens";

const pm = new PM({
  url: process.env.PM_API_URL,
  password: process.env.PM_API_PASSWORD,
});

//---Get all jackpot-----

export const getAllJackpots = async (req, res) => {
  try {
    const result = await JackpotModel.find();

    res.status(200).json({
      result,
    });
  } catch (err) {
    console.log(err);
  }
};

//---Edit jackpot-----

export const editJackpots = async (req, res) => {
  const { id } = req.params;

  try {
    JackpotModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          rakePercent: req.body.rakePercent,
          initialAmount: req.body.initialAmount,
          badBeatJackpot: req.body.badBeatJackpot,
          games: req.body.games,
        },
      },
      function (err, curPari) {
        if (curPari) {
          res.status(200).json({
            message: "ok",
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};

//---Create jackpot-----

export const createJackpots = async (req, res) => {
  try {
    const doc = new JackpotModel({
      rakePercent: req.body.rakePercent,
      initialAmount: req.body.initialAmount,
      badBeatJackpot: req.body.badBeatJackpot,
      games: req.body.games,
    });
    doc.save();
    res.status(200).json({
      message: "ok",
    });
  } catch (err) {
    console.log(err);
  }
};

//---Delete jackpot-----

export const deleteJackpots = async (req, res) => {
  const { id } = req.params;
  try {
    JackpotModel.findOneAndRemove(
      { _id: id },

      function (err, curPari) {
        console.log(curPari);
      }
    );

    res.status(200).json({
      message: "ok",
    });
  } catch (err) {
    console.log(err);
  }
};
