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
const bodyParser = require("body-parser");

//routes
const vacantesRoutes = require("./routes/vacantesRoutes.js");
const indexRoutes = require("./routes/indexRoutes.js");
const usuarioRoutes = require("./routes/usuarioRoutes.js");

//init express
const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//habilitar handlebar cono tempalte engine (analogo a pug)
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "layout",
    extname: "hbs",
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: require("./helpers/handlebars.js"),
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
app.use("/vacantes", vacantesRoutes);
app.use("/", usuarioRoutes);

app.listen(process.env.PORT);
