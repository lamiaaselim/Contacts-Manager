const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const socketIo = require("socket.io");
const compression = require("compression");
const NotFoundMiddleware = require("./Middelwares/NotFoundMW");
const ErrorMiddleware = require("./Middelwares/ErrorMW");
const authenticateMW = require("./Middelwares/authenticateMW");
const contactRouter = require("./routes/contactRoute");
const userRouter = require("./routes/userRoute");
const socketController = require('./Controller/socketController');

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200', // Allow requests from this origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  }
});

socketController.init(io);  // Initialize the socketController with the io instance

let lockedContacts = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Send the current locked contacts to the newly connected client
  socket.emit("initial_locked_contacts", lockedContacts);

  // Handle locking a contact
  socket.on("lock_contact", ({ contactId, userId }) => {
    lockedContacts[contactId] = userId;
    socket.broadcast.emit("contact_locked", { contactId, userId });
  });

  // Handle unlocking a contact
  socket.on("unlock_contact", ({ contactId }) => {
    delete lockedContacts[contactId];
    socket.broadcast.emit("contact_unlocked", { contactId });
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Find and unlock contacts locked by this socket
    for (const contactId in lockedContacts) {
      if (lockedContacts[contactId] === socket.id) {
        delete lockedContacts[contactId];
        socket.broadcast.emit('contact_unlocked', { contactId });
      }
    }
  });
});

//mongoose open connection local mongoDB
mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => {
    console.log("DB Connected");
    // Listening of Server
    server.listen(process.env.PORT || 8080, () => {
      console.log(`I am listening ... `);
    });
  })
  .catch(() => {
    console.log("DB connection problem" + error);
  });

//------------- server layers -------------------------
//first MW  logining use morgan for register url ,method

app.use(morgan("dev"));

//********************* routes***********************/
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(userRouter);
app.use(authenticateMW, contactRouter);

/*****************************************************/
//Not Found Handling MW
app.use(NotFoundMiddleware.handle);

// Error Handling MW
app.use(ErrorMiddleware.handle);
