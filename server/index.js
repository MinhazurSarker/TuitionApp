const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

var path = require('path');
var bp = require('body-parser');

const corsOption = {
  origin: "*",
  methods: ["GET", "POST","PUT","DELETE"]
};
app.use(cors(corsOption))
const dotenv = require("dotenv");
var cookieParser = require('cookie-parser')
app.use(cookieParser())

global.appRoot = path.resolve(__dirname);
dotenv.config();

let URI = process.env.MONGODB_URI;
let user = process.env.MONGODB_USER;
let pass = process.env.MONGODB_PASS;
let Options = { user: user, pass: pass, autoIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(URI, Options)
    .then(() => console.log('DB Connected'))
    .catch(err => console.log(err));


app.use(bp.json({ limit: '100mb' }));
app.use(bp.urlencoded({ extended: true, limit: '100mb' }));

app.use(express.static(path.join(__dirname, 'public')));

app.disable('x-powered-by');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//flash------
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});
//Socket------------------------
//------------------------
let users = [];
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId:userId, socketId:socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  //------------
  io.on("connection", (socket) => {

   
    //take userId and socketId from user
    socket.on("addUser", (userId) => {

      addUser(userId, socket.id);
      console.log(userId, socket.id);
    });
    //send and get message
    socket.on("sendMessage", ({ sender, receiverId,chatId, text ,image }) => {
      const user = getUser(receiverId); 
      if(user){
        io.to(user.socketId).emit("getMessage", {sender,text,chatId,image,});
      }
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      removeUser(socket.id);
      console.log(socket.id);
    });
  });
  
// CornJobs---------------------
// ---------------------
const moment = require('moment');
const User = require('./src/models/User');
const corn = require('node-cron');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
var dashboardDB = new JsonDB(new Config("dashboardData", true, false, '/'));

corn.schedule('0 0 0 1 * *', async () => {
    dashboardDB.push('/login',0 ); 
    dashboardDB.push('/reg',0 ); 
    dashboardDB.push('/upgrade',0 ); 
    dashboardDB.push('/income',0 ); 
});
//-----
corn.schedule('0 0 0 */2 * *', async () => {
    let today = moment(Date.now()).format('YYYY-MM-DD');
    const users = await User.find({ role: 'tutor' });
    if (users) {
        users.forEach(async (user) => {
            let dueDate = moment(user.subEnd).format('YYYY-MM-DD');
            if (today == dueDate) {
                user.role = 'user';
                user.ubEnd = "";
                user.save();
            }
        })
    }
});
// endCornJobs------------------
app.use('/', require('./src/routes/index'));
app.use('/api/', require('./src/routes/api/api'));
app.get('/*', (req, res) => {
    res.status(404).render('404')
})
const PORT = process.env.PORT;
server.listen(5000, function () { console.log('server is running on ' + PORT) });