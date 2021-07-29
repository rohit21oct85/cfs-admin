const Admin = require('../../models/admin/Admin.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let refreshTokens = [];

const Register = async (req, res) => {
    const body = req.body;
    try {
        const newAdmin = new Admin(body);
        await newAdmin.save();
        return res.status(200).json({ 
            message: "Registered Sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message : error.message
        })
    }
}

const Login = async (req, res) => {
    try {
         
        await Admin.findOne({email: req.body.email},{__v: 0}).then( admin => {
            if(admin){
                bcrypt.compare(req.body.password, admin.password,async function(err,response){
                    if(err){
                        return res.status(409).json({ 
                            message: "Password does not match"
                        });
                    }
                    else{
                        if(response){
                            if(admin.isActive === false){
                                await Admin.findByIdAndUpdate({
                                    _id: admin?._id
                                },{
                                    isActive: true
                                });
                                let adminData = await Admin.findOne({
                                    _id: admin?._id
                                })
                                const accessToken = generateAccessToken(adminData);
                                const refreshToken = generateRefreshToken(adminData);
                                refreshTokens.push(refreshToken);
                                
                                res.status(200).json({ 
                                    accessToken, 
                                    refreshToken,
                                    admin: adminData
                                });
                            }else{
                                res.status(203).json({ 
                                    message: "your account is already loggedIn !!!"
                                });
                            }
                        } else {
                            res.status(203).json({ 
                                message: "Password does not match"
                            });
                        }                      
                    }
                });
            }else{
                res.status(203).json({ 
                    message: "Email or Password doesnot matched"
                })
            }
        }).catch(error => {
            res.status(203).json({
                message: "Email Does not exists in our database",
                errors: error.message
            });     
        })
        
    } catch (error) {
        res.status(203).json({
            message: error.message
        });  
    }
}
const generateAccessToken = (user) => {
    const accessTokenSecret = 'CFSAT2021';
    return jwt.sign({ 
        id: user._id,  
        role: user.role 
    }, accessTokenSecret, {expiresIn: '30d'})
}
const generateRefreshToken = (user) => {
    const refreshTokenSecret = 'CFSRT2021';
    return jwt.sign({
        id: user._id,   
        role: user.role
    },refreshTokenSecret);
}

const RefreshToken = async (req,res) => {
    
    const refreshTokenSecret = 'CFSRT2021';
    const refreshToken = req.body.token;
    if(refreshToken === null) return res.status(401).json({message: 'Invalid refresh token'});
    if(!refreshTokens.includes(refreshToken)) return res.status(401).json({message: 'Invalid refresh token'});
    jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
        if(err) return res.status(err).json({message: "Error found"});
        const accessToken = generateAccessToken({email: user.email,role: user.role });
        return res.status(200).json({ 
            accessToken
        });
    })
}

const Logout = async (req, res) => {
    // console.log(req); return;
    const accessTokenSecret = 'CFSAT2021';
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader){
        const accessToken = req.headers.authorization.split(' ')[1];  
        const decode = await jwt.verify(accessToken, accessTokenSecret);
        // console.log(decode); return;
        const UserData = {id: decode.id, role: decode.role};
        await Admin.findByIdAndUpdate({_id: decode.id},{isActive: false});
        let newAccessToken = await jwt.sign(UserData, 'sasdasd', {expiresIn: '0s'});
        res.status(201).json({
            message: "successfully loggedout",
            accessToken: newAccessToken
        });    
    }
}

const ForgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        const data = await User.findOne({email: email});
        if(data){
            res.status(201).json(data)
        }else{
            res.status(402).json({message: "Email does not belongs to our Database"})    
        }
    } catch (error) {
        res.status(502).json({message: "Somethign went wrong!"})
    }

}
const AddField = async (req, res) => {
    try {
        await Admin.updateMany({},{isActive: false});
        res.status(201).json({message: "Updated"})
    } catch (error) {
        res.status(502).json({message: "Somethign went wrong!"})
    }
}
module.exports = {
    AddField,
    Register,
    Login,
    Logout,
    generateAccessToken,
    generateRefreshToken,
    RefreshToken,
    ForgotPassword,
}