const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      return res.status(401).send(`Unauthorized`);
    }
    const { userId } = jwt.verify(token, process.env.jwtSecret);
    req.body.userId = userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send(`Unauthorized`);
  }
};
