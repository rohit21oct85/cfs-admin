const Tutor = require('../../models/tutor/Tutor.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let refreshTokens = [];

const Register = async(req, res) => {
    const body = req.body;
    try {
        let tutor = await Tutor.countDocuments(Tutor.findOne({ email: body.email }));
        if (tutor) {
            return res.status(409).send('User with the same email already registered');
        }
        const newTutor = new Tutor(body);
        await newTutor.save();
        return res.status(200).json({
            message: "Registered Sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message: error.message
        })
    }
}

const Login = async(req, res) => {
    try {
        let tutor = await Tutor.findOne({ email: req.body.email }, { __v: 0 });
        if (!tutor) return res.status(401).send('Invalid email or password');

        const validPassword = await bcrypt.compare(req.body.password, tutor.password);
        if (!validPassword) return res.status(401).send("Invalid email or password");

        const accessToken = generateAccessToken(tutor);
        const refreshToken = generateRefreshToken(tutor);
        refreshTokens.push(refreshToken);

        return res.status(200).json({
            accessToken,
            refreshToken,
            tutor
        });
    } catch (error) {
        return res.status(402).json({
            message: error.message
        });
    }
}

const generateAccessToken = (user) => {
    const accessTokenSecret = 'CFSAT2021';
    return jwt.sign({
        id: user._id,
        role: user.role
    }, accessTokenSecret, { expiresIn: '30d' })
}

const generateRefreshToken = (user) => {
    const refreshTokenSecret = 'CFSRT2021';
    return jwt.sign({
        id: user._id,
        role: user.role
    }, refreshTokenSecret);
}

const ForgotPassword = async(req, res) => {
    try {
        const email = req.body.email;
        const data = await Tutor.findOne({ email: email });
        if (data) {
            console.log(data);
            return res.status(201).json(data)
        } else {
            return res.status(402).json({ message: "Email does not exist in our records" })
        }
    } catch (error) {
        return res.status(502).json({ message: "Somethign went wrong!" })
    }
}

const Logout = async(req, res) => {
    const accessTokenSecret = 'CFSAT2021';
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const accessToken = req.headers.authorization.split(' ')[1];
        const decode = await jwt.verify(accessToken, accessTokenSecret);
        const UserData = { id: decode.id, role: decode.role };
        let newAccessToken = await jwt.sign(UserData, 'sasdasd', { expiresIn: '0s' });
        return res.status(402).json({
            message: "successfully loggedout",
            accessToken: newAccessToken
        });
    }
}

const RefreshToken = async(req, res) => {
    const refreshTokenSecret = 'CFSRT2021';
    const refreshToken = req.body.token;
    if (refreshToken === null) return res.status(401).json({ message: 'Invalid refresh token' });
    if (!refreshTokens.includes(refreshToken)) return res.status(401).json({ message: 'Invalid refresh token' });
    jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
        if (err) return res.status(err).json({ message: "Error found" });
        const accessToken = generateAccessToken({ email: user.email, role: user.role });
        return res.status(200).json({
            accessToken
        });
    })
}


module.exports = {
    Register,
    Login,
    ForgotPassword,
    RefreshToken,
    Logout,
}