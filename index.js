const express = require("express");
const app = express();
let url;
const puppeteer = require("puppeteer");
app.use(express.urlencoded({ extended: true }));
app.post("/display", (req, res) => {
  url = req.body.url;
  trying().then((answer) => res.send(answer));
});
app.listen(3000, () => {
  console.log("hi");
});

const trying = async () => {
  const browser = await puppeteer.launch({ headless: true }); //launch browser be able to see what is being done on screen due to headless being false
  const page = await browser.newPage(); //open new page
  await page.goto(url + "");
  await page.screenshot({ path: "mywebsite.png" }); // take screenshot
  const grabAll = await page.evaluate(() => {
    const times = document.querySelectorAll(
      ".style-scope ytd-thumbnail-overlay-time-status-renderer"
    );
    let timeArray = [];

    times.forEach((number) => {
      if (number.innerText.trim().split(":").length == 3) {
        // hour : minute : second present or not
        let [hours, minutes, seconds] = number.innerText.trim().split(":");
        hours = parseInt(hours) * 60 * 60;
        minutes = parseInt(minutes) * 60;
        seconds = parseInt(seconds) + hours + minutes;
        timeArray.push(seconds);
      } else if (number.innerText.trim().split(":").length == 2) {
        let [minutes, seconds] = number.innerText.trim().split(":");
        minutes = parseInt(minutes) * 60;
        seconds = parseInt(seconds) + minutes;
        timeArray.push(seconds);
      }
    });
    let sum = 0;
    for (let i = 0; i < timeArray.length; i++) {
      sum = sum + timeArray[i];
    }
    let h = Math.floor(sum / 3600);
    let min = Math.floor((sum - h * 3600) / 60);
    let sec = sum - h * 3600 - min * 60;
    return h + ":" + min + ":" + sec;
  });
  const answer = grabAll;
  console.log(answer);
  await browser.close();
  return answer;
};
