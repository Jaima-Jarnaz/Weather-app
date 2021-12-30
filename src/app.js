const path = require("path");
const hbs = require("hbs");
const geoCode = require("./utils/geoCode");
const weather = require("./utils/weather");
const express = require("express");
const app = express();

console.log(__dirname);
const publicDir = path.join(__dirname, "../public");
app.use(express.static(publicDir));

//view path
const viewsDir = path.join(__dirname, "../templates");

//partials
const partialPaths = path.join(__dirname, "../templates/partials");
hbs.registerPartials(partialPaths);

app.set("view engine", "hbs");
app.set("views", viewsDir);

app.get("/", (req, res) => {
  res.render("index", { welcome: "Good afternoon", name: "Jaima" });
});

//weather
app.get("/search", (req, res) => {
  const searchData = req.query.search;
  if (!searchData)
    return res.render("error", { error: "Please Provide search item" });
  geoCode(searchData, (error, { lattitude, longgitude }) => {
    if (error) return res.render("error", { error: error });

    weather(lattitude, longgitude, (error, responseData) => {
      if (error) return res.render("error", { error: error });

      console.log(
        "The temprature is " + responseData.temperature + "and feels like ",
        responseData
      );

      res.render("searchlocation", { temperature: responseData.temperature });
    });

    console.log("The result of geocode is ", lattitude, longgitude);
  });
});

//weather
app.get("/weather", (req, res) => {
  res.render("weather", {
    temprature: 100 + " degree",
    condition: "Not good",
  });

  // res.send({
  //   temprature: 100 + " degree",
  //   condition: "Not good",
  // });
});

app.get("/locations", (req, res) => {
  const data = [
    {
      address: "london",
      weather: "Not good",
    },
    {
      address: "japan",
      weather: "good",
    },
  ];
  if (!req.query.address) {
    return res.send({ error: "Please provide search term" });
  } else {
    const filteredData = data.filter((item) => {
      return req.query.address === item.address;
    });

    return res.send(filteredData);
  }
});

app.get("*", (req, res) => {
  res.render("error", {
    error: "Sorry searched page not found!!!try another url.......",
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
