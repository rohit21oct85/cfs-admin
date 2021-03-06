const Student = require('../../models/student/Student.js');
const Token = require('../../models/student/Token.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var randomBytes = require('randombytes');

let refreshTokens = [];


const Register = async(req, res) => {
    const body = req.body;
    try {
        let student = await Student.countDocuments(Student.findOne({ email: body.email }));
        if (student) {
            return res.status(409).send('User with the same email already registered');
        }
        const newStudent = new Student(body);
        const saved = await newStudent.save();
        if (!saved) return res.status(500).send("Error in saving Student");

        var token = new Token({ _userId: saved._id, token: randomBytes(16).toString('hex') });
        const tsaved = await token.save();
        if (!tsaved) return res.status(500).send("Error in saving Token");

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.email,
                pass: process.env.password
            }
        });

        const link = `http:\/\/${req.headers.host}\/student/verify\/${saved.email}\/${token.token}`;
        var mailOptions = {
            from: process.env.email,
            to: newStudent.email,
            subject: 'Verify your email address',
            html: `<h1>Welcome</h1><p><a href=${link}>Click here to verify</a></p>`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.status(200).json({
            message: "Registered Sucessfully"
        });
    } catch (error) {
        res.status(502).json({
            message: error.message
        })
    }
}

const Verify = async(req, res) => {
    try {
        const token = await Token.findOne({ token: req.params.token });
        // token is not found into database i.e. token may have expired 
        if (!token) {
            return res.status(400).send({ msg: 'Your verification link may have expired. Please click on resend for verify your Email.' });
        }
        const stud = await Student.findOneAndUpdate({ _id: token._userId, email: req.params.email }, { $set: { 'status': true } })
        if (stud) {
            await Token.deleteOne({ token: req.params.token });
            return res.status(200).send({ msg: 'Your account has been successfully verified!' });
        } else {
            return res.status(401).send({ msg: 'We were unable to find a user for this verification. Please SignUp!' });
        }
    } catch (error) {
        return res.status(402).json({
            message: error.message
        });
    }
}

const Login = async(req, res) => {
    try {
        let student = await Student.findOne({ email: req.body.email }, { __v: 0 });
        if (!student) return res.status(401).send('Invalid email or password');

        const validPassword = await bcrypt.compare(req.body.password, student.password);
        if (!validPassword) return res.status(401).send("Invalid email or password");

        const accessToken = generateAccessToken(student);
        const refreshToken = generateRefreshToken(student);
        refreshTokens.push(refreshToken);

        return res.status(200).json({
            accessToken,
            refreshToken,
            student
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
        const data = await Student.findOne({ email: email });
        if (data) {
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
    Verify,
}