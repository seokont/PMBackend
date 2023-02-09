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

// ----- GetPlayers -----
export const getAllPlayers = async (req, res) => {
  try {
    pm.AccountsList({
      Fields: "Player",
    })
      .then((data) => {
        let arrayPlayers = [];
        data.forEach((i) => {
          pm.AccountsGet({
            Player: i.Player,
          })
            .then((result) => {
              arrayPlayers.push(result);
            })
            .catch((err) => {
              console.log(err);
            });
        });

        setTimeout(() => {
          // res.json({
          //   arrayPlayers,
          // });

          arrayPlayers.forEach((result) => {
            const doc = new PlayersModel({
              email: result.Email,
              player: result.Player,
              realName: result.RealName,
              pWHash: result.PWHash,
              gender: result.Gender,
              location: result.Location,
              balance: result.Balance,
              balance2: result.Balance2,
              eRake: result.ERake,
              eRake2: result.ERake2,
              pRake: result.PRake,
              pRake2: result.PRake2,
              tFees: result.TFees,
              tFees2: result.TFees2,
              ringChips: result.RingChips,
              ringChips2: result.RingChips2,
              regChips: result.RegChips,
              regChips2: result.RegChips2,
              sessionID: result.SessionID,
            });

            try {
              doc.save(function (err, result) {
                if (err) console.log(err);
                else {
                  console.log(result);
                }
              });
            } catch (error) {
              if (error.message.indexOf("11000") != -1) {
                // run some code here //
                Spark.setScriptError("ERROR", "ID already taken");
              }
            }
          });
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });

    const arrayPlayers = await PlayersModel.find();

    res.json({ arrayPlayers });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить играков",
    });
  }
};

// ----- UpdatePlayers -----
export const updateAllPlayers = async (req, res) => {
  try {
    pm.AccountsList({
      Fields: "Player",
    })
      .then((data) => {
        let arrayPlayers = [];
        data.forEach((i) => {
          pm.AccountsGet({
            Player: i.Player,
          })
            .then((result) => {
              arrayPlayers.push(result);
            })
            .catch((err) => {
              console.log(err);
            });
        });

        setTimeout(() => {
          res.json({
            arrayPlayers,
          });

          arrayPlayers.forEach(async(result) => {
           await PlayersModel.findOneAndUpdate(
              { player: result.Player },
              {
                email: result.Email,
                player: result.Player,
                realName: result.RealName,
                pWHash: result.PWHash,
                gender: result.Gender,
                location: result.Location,
                balance: result.Balance,
                balance2: result.Balance2,
                eRake: result.ERake,
                eRake2: result.ERake2,
                pRake: result.PRake,
                pRake2: result.PRake2,
                tFees: result.TFees,
                tFees2: result.TFees2,
                ringChips: result.RingChips,
                ringChips2: result.RingChips2,
                regChips: result.RegChips,
                regChips2: result.RegChips2,
                sessionID: result.SessionID,
              }
            );

            try {
              doc.save(function (err, result) {
                if (err) console.log(err);
                else {
                  console.log(result);
                }
              });
            } catch (error) {
              if (error.message.indexOf("11000") != -1) {
                Spark.setScriptError("ERROR", "ID already taken");
              }
            }
          });
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });

    // const arrayPlayers = await PlayersModel.find();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить играков",
    });
  }
};

// ---- Decrement Increment -----

export const decrementPlayerId = async (req, res) => {
  await PlayersModel.findById(req.body.id)
    .then((player) => {
      (req.body.decInc === "increment"
        ? pm.AccountsIncBalance({
            Player: player.player,
            Amount: req.body.amount,
          })
        : pm.AccountsDecBalance({
            Player: player.player,
            Amount: req.body.amount,
          })
      )
        .then((result) => {
          PlayersModel.findByIdAndUpdate(
            { _id: req.body.id },
            {
              $set: {
                balance: result.Balance,
              },
            },
            function (err, curPari) {
              console.log(curPari);
            }
          );

          res.status(200).json({
            message: "ok",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
// ---- Edit -----
export const editPlayer = async (req, res) => {
  console.log(req.body);
  await PlayersModel.findById(req.body.id)
    .then((player) => {
      pm.AccountsEdit({
        Player: player.player,
        RealName: req.body.realName,
        Email: req.body.email,
        Location: req.body.location,
      }).then((result) => {
        if (result.Result === "Ok") {
          PlayersModel.findByIdAndUpdate(
            { _id: req.body.id },
            {
              $set: {
                email: req.body.email,
                location: req.body.location,
                realName: req.body.realName,
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
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// ----- Delete Player ------
export const deletePlayer = async (req, res) => {
  const { id } = req.params;

  await PlayersModel.findById(id)
    .then((player) => {
      pm.AccountsDelete({
        Player: player.player,
      })
        .then((result) => {
          if (result.Result === "Ok") {
            PlayersModel.findOneAndRemove(
              { _id: id },

              function (err, curPari) {
                console.log(curPari);
              }
            );

            res.status(200).json({
              message: "ok",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
