import * as dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import AffiliatesModel from "../models/Affiliates.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import PM from "pokermavens";

const pm = new PM({
  url: process.env.PM_API_URL,
  password: process.env.PM_API_PASSWORD,
});

// ----- Get All Affiliates -----
export const getAllAffiliates = async (req, res) => {
  try {
    let affilii = await AffiliatesModel.find({}).select([
      "affiliate",
      "fullName",
      "percentage",
      "codeInvite",
      "playersBalance",
      "weeklyRake",
      "balance",
    ]);

    res.json({
      affilii,
    });
  } catch {
    (err) => {
      console.log(err);
    }
  }
};

// ----- Add Affiliates -----
export const addAffiliates = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const doc = new AffiliatesModel({
      affiliate: req.body.player,
      balance: 111,
      playersBalance: 1111,
      weeklyRake: 3333,
      percentage: req.body.percentage,
      codeInvite: req.body.codeInvite,
      fullName: req.body.fullName,
      password: hash,
    });

    try {
      doc.save(function (err, result) {
        if (err) console.log(err);
        else {
          res.json({
            mesage: "ok",
          });
        }
      });
    } catch (error) {
      if (error.message.indexOf("11000") != -1) {
        Spark.setScriptError("ERROR", "ID already taken");
      }
    }
  } catch {}
};
