const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const compression = require("compression");
const NotFoundMiddleware = require("./Middelwares/NotFoundMW");
const ErrorMiddleware = require("./Middelwares/ErrorMW");
const authenticateMW = require("./Middelwares/authenticateMW");
const contactRouter = require("./routes/contactRoute");
const userRouter = require("./routes/userRoute");

dotenv.config();

const app = express();


//mongoose open connection local mongoDB
mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => {
    console.log("DB Connected");
    // Listening of Server
    app.listen(process.env.PORT || 8080, () => {
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
