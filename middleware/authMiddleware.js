const jwt = require("jsonwebtoken");

// user authentication middleware
module.exports = (req, res, next) => {
  const { token } = req.cookies;
  try {
    // check if user is logedIn
    if (!token) {
      return res.status(401).send(`Unauthorized`);
    }

    // get id of the user
    const { userId } = jwt.verify(token, process.env.jwtSecret);
    req.body.userId = userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send(`Unauthorized`);
  }
};
