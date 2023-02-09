import * as dotenv from "dotenv";
dotenv.config();
import PM from "pokermavens";

const pm = new PM({
  url: process.env.PM_API_URL,
  password: process.env.PM_API_PASSWORD,
});

export default (req, res, next) => {
  try {
    pm.AccountsList({
      Fields: "Player",
    })
      .then((data) => {
        req.dating = data;
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить играков",
    });
  }
};
