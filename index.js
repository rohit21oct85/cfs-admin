const dotenv = require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const session = require('express-session')
const Routes = require("./routes/index.js");
const WebRoutes = require("./routes/web-routes.js");
const TutorRoutes = require("./routes/tutor-routes.js");
const cronJob = require('cron').CronJob;
const {cfsCronTask} = require('./cfsCronTask.js');
const responseTime = require('response-time')

const app = express();
app.use(responseTime())
/* Cron Task */
var job = new cronJob({
    cronTime: '10 * * * * *',
    onTick: function() {
        cfsCronTask()
   },
    start: false,
    timeZone: 'Asia/Kolkata'
  });
job.start();


app.use(cors());
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
const flash = require('connect-flash')
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

// express session 
app.use(session({
    secret: 'acadecraft-secerate',
    resave: true,
    saveUninitialized: true
}));
// connect flash session
app.use(flash());

// global vars session
app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg')
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        next();
});

// DB Cofiguration
const options = { 
    useFindAndModify: false, 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
};

const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI, options)
    .then(() => console.log('Mongo DB Connected on Server'))
    .catch(err => console.log(err.message));

var server = app.listen(PORT, () => {
    console.log(`App is running on PORT ${PORT}`);
})

const io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log('Socket Connected',socket.id);

    socket.on('disconnect', () => { 
        console.log("Client disconnected");
    });

    // socket.on('orderCreated', ()=>{
    //     console.log('order created');
    //     io.sockets.emit('refreshOrder');  //emit to everyone
    // })
    // socket.on('firstTimeTableRefresh',()=>{
    //     console.log('first time')
    //     io.sockets.emit('refreshOrder');
    // })
    
});

// login
app.use("/api/v1/admin", Routes.AdminAuthRoutes);
app.use("/api/v1/master-role", Routes.roleRoutes);
app.use("/api/v1/master-module", Routes.moduleRoutes);
app.use("/api/v1/master-role-permission", Routes.rolePermissionRoutes);
app.use("/api/v1/master-user-permission", Routes.userPermissionRoutes);
app.use("/api/v1/master-permission-group", Routes.permissionGroupRoutes);
app.use("/api/v1/master-admin", Routes.adminRoutes);
app.use("/api/v1/master-delete", Routes.removeDataRoutes);
app.use("/api/v1/subject", Routes.subjectRoutes);
app.use("/api/v1/sub-subject", Routes.SubSubjectRoutes);
app.use("/api/v1/chield-subject", Routes.ChieldSubjectRoutes);
app.use("/api/v1/books", Routes.BookRoutes);
app.use("/api/v1/chapter", Routes.ChapterRoutes);
app.use("/api/v1/question", Routes.QuestionRoutes);
app.use("/api/v1/student", Routes.StudentRoutes);
app.use("/api/v1/tutor", Routes.TutorRoutes);
app.use("/api/v1/faq", Routes.FaqRoutes);


app.use("/web/v1/books", WebRoutes.WebBookRoutes);
app.use("/web/v1/reviews", WebRoutes.WebReviewRoutes);
app.use("/web/v1/chapter", WebRoutes.WebChapterRoutes);
app.use("/web/v1/faq", WebRoutes.WebFaqRoutes);
app.use("/web/v1/category", WebRoutes.CategoryRoutes);
app.use("/web/v1/student", WebRoutes.StudentAuthRoutes);
app.use("/web/v1/student", WebRoutes.StudentRoutes);
app.use("/web/v1/payment", WebRoutes.WebPaymentRoutes);
app.use("/web/v1/assignment", WebRoutes.AssignmentRoutes);


// app.use("/web/v1/tutor", WebRoutes.TutorAuthRoutes);
app.use("/web/v1/subject", WebRoutes.WebSubjectRoutes);
app.use("/web/v1/subsubject", WebRoutes.WebSubjectRoutes);

app.use("/tutor/v1/auth", TutorRoutes.TutorAuthRoutes);
app.use("/tutor/v1/books", TutorRoutes.TutorBookRoutes);


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public/build'));
    app.get('/*', (req, res) => {
        const index = path.join(__dirname, 'public', 'build', 'index.html');
        res.sendFile(index);
    });
}
