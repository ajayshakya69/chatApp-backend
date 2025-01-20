
const jwt = require('jsonwebtoken')
const Now = require('../auths/auth')

const verifyJwt = async (req, res, next) => {

  try {
   

    if (!req.cookies.authToken) {
      res.locals.tokenExist = false;
      next();
    }
    const jwtToken = req.cookies.authToken;

    const verify = jwt.verify(jwtToken, process.env.SECRET_KEY)

    console.log({ verify })

    res.locals.user = verify;
    res.locals.tokenExist = true;
    next()

  } catch (error) {
    req.data = error.message
    next()
  }

}
module.exports = verifyJwt;


