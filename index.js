const express = require("express");
const router = require("./routes");
const exphbs = require("express-handlebars");
const path = require("path");

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

app.use("/", router());

app.listen(3000);
