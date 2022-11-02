const express = require("express");
const app = express();
const puppeteerLookup = require("./puppeteerLookup");
require("dotenv").config();

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", puppeteerLookup);

app.get("/scrape", (req, res) => {
  const browserObject = require("./browser");
  const scraperController = require("./pageController");

  //Start the browser and create a browser instance
  let browserInstance = browserObject.startBrowser();

  // Pass the browser instance to the scraper controller
  scraperController(browserInstance);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
