import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, "secret22");
      req.userId = decoded._id;

      next();
    } catch (e) {
      return res.status(405).json({
        message: "Нет доступа дАП",
      });
    }
  } else {
    return res.status(403).json({
      message: "Нет доступа нет токена",
    });
  }
};
