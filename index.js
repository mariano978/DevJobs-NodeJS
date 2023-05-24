//database
const mongoose = require("mongoose");
require("./config/db.js");
const MongoStore = require("connect-mongo");

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();

//routes
const crudVacantesRoutes = require("./routes/crudVacantesRoutes.js");
const indexRoutes = require("./routes/indexRoutes.js");

//init express
const app = express();

//habilitar handlebar cono tempalte engine (analogo a pug)
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "layout",
    extname: "hbs",
  })
);

app.set("view engine", "hbs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.DATABASE,
    }),
  })
);

//set router
app.use("/", indexRoutes);
app.use("/vacantes", crudVacantesRoutes);

app.listen(process.env.PORT);
