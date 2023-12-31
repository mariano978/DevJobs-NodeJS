//database
require("./config/db.js");

const MongoStore = require("connect-mongo");

const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require("dotenv").config();
const flash = require("connect-flash");
//passport
const passport = require("./config/passport.js");

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
    secret: process.env.SESSION_SECRET,
    key: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.DATABASE,
    }),
  })
);
//inicializar passport
app.use(passport.initialize());
app.use(passport.session());

//Alertas y flash menssages
//Flash esta diseñado para redirecciones
//se diseñó específicamente para situaciones como redirecciones,
//donde deseas mostrar un mensaje en la próxima solicitud.
//por ende al redireccionar req.flash() otorgará
//los mensajes que generó la solicitud anterior
app.use(flash());
//midelware
// app.use((req, res, next) => {
//   res.locals.mensajes = req.flash();
//   next();
// });

//set router
app.use("/", indexRoutes);
app.use("/vacantes", vacantesRoutes);
app.use("/", usuarioRoutes);

app.listen(process.env.PORT);
