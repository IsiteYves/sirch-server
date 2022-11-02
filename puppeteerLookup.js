const router = require("express").Router();
const puppeteer = require("puppeteer");

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
      const someTxt = await page.$eval("*", (el) => el.innerText);
      const splits = someTxt.split(" ");
      const appearances = splits.filter((word) =>
        word.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      console.log(`appearances of the word '${keyword}' = `, appearances);
      await browser.close();
      res.status(200).send({ splits });
    } catch (e) {
      return res.status(500).send({ error: e?.message });
    }
  })();
});

module.exports = router;
