const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const accessTokenSecret = 'CFSAT2021';
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
    if (!token) {
        return res.status(401).json({
            message: 'you are not authorised!'
        });
    }

    jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: 'Authorization failed'
            });
        } else {
            
            if (decoded.role === "tutor") {
                req.body.user_Id = decoded.id;
                req.body.user_role = decoded.role;
                next()
            } else {
                res.status(403).json({
                    message: 'Not Authorized to access this Resource'
                });
            }
        }
    })
}