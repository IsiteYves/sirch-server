const express = require("express");
const app = express();
const Crawler = require("Crawler");
require("dotenv").config();

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  var c = new Crawler({
    address: "http://www.example.com",
    term: "example",
  });
  c.start();
});

app.get("/scrape", (req, res) => {
  const browserObject = require("./browser");
  const scraperController = require("./pageController");

  //Start the browser and create a browser instance
  let browserInstance = browserObject.startBrowser();

  // Pass the browser instance to the scraper controller
  scraperController(browserInstance);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
