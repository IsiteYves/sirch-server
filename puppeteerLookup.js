const router = require("express").Router();
const puppeteer = require("puppeteer");
const { NlpManager } = require("node-nlp");

router.get("/nlp-test", (req, res) => {
  const manager = new NlpManager({ languages: ["en"] });

  // Adds the utterances and intents for the NLP
  manager.addDocument("en", "goodbye for now", "greetings.bye");
  manager.addDocument("en", "bye bye take care", "greetings.bye");

  // Train also the NLG
  manager.addAnswer("en", "greetings.bye", "Till next time");
  manager.addAnswer("en", "greetings.bye", "see you soon!");

  // Train and save the model.
  (async () => {
    await manager.train();
    manager.save();
    const response = await manager.process("en", "I should go now");
    res.send(response);
  })();
});

router.post("/:keyword", (req, res) => {
  const { keyword } = req.params;
  const { url } = req.body;
  (async () => {
    try {
      const delay = (time) => {
        return new Promise((resolve, reject) =>
          setTimeout(() => resolve(), time)
        );
      };
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--autoplay-policy=no-user-gesture-required",
          "--window-size=1920,1080",
        ],
        defaultViewport: null,
      });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await delay(2000);
      // const someTxt = await page.$eval("*", (el) => el.innerText);
      const someTxt = await page.$$eval("*", (el) => {
        console.log("respo..", el);
        return el;
      });
      console.log("resul..");
      // const splits = someTxt.split(" ");
      const splits = [];
      const appearances = splits.filter((word) =>
        word.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      await browser.close();
      res.status(200).send({
        success: true,
        message: `appearances of the word '${keyword}' = ${appearances}`,
      });
      // res.status(200).send({ splits });
    } catch (e) {
      return res.status(500).send({ error: e?.message });
    }
  })();
});

module.exports = router;
