import * as dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import PM from "pokermavens";

const pm = new PM({
  url: process.env.PM_API_URL,
  password: process.env.PM_API_PASSWORD,
});

// ----- Register -----
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
      userName: req.body.userName,
      PokerRoomId: req.body.PokerRoomId,
    });

    pm.AccountsAdd({
      player: req.body.userName,
      pw: req.body.password,
      location: "Newland",
      email: req.body.email,
    })
      .then(function (result) {
        console.log(result);
      })
      .catch(function (err) {
        console.log(err);
      });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret22",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегестрироваться",
    });
  }
};
// ----- Login -----
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "Ничего в базе данных нет",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Пароль неверній",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret22",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось авторизироваться",
    });
  }
};

// ----- Me -----
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Такого пользователя нет!!",
      });
    } else {
      const token = jwt.sign(
        {
          _id: user._id,
        },
        "secret22",
        {
          expiresIn: "30d",
        }
      );

      const { passwordHash, ...userData } = user._doc;
      res.json({
        ...userData,
        token,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Не удалось авторизироваться!!!!",
    });
  }
};
