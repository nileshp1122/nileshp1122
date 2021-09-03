const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyUser = await jwt.verify(token, process.env.SECRET_KEY );
        console.log(verifyUser);
        next();
    } catch (err) {
        res.redirect("/login");  
    }
}
module.exports = auth;
