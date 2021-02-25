const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const accessTokenSecret = 'CFSAT2021';
    const token = req.headers.authorization?req.headers.authorization.split(" ")[1]:null;
    if (!token) {
        res.status(401).json({
            message: 'you are not authorised!'
        });
    } else {
        jwt.verify(token, accessTokenSecret, (err, decoded) => {

        if (err) {
            res.status(403).json({
                message: 'Authorization failed'
            });
        } else {
            if(decoded.role == 1){
                next()
            }else{
                res.status(403).json({
                    message: 'Not Authorized to access this Resource'
                }); 
            }
        }
        })
    }
}