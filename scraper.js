const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(
    "https://www.careerbuilder.com/jobs?keywords=junior+web+developer&location=Charlotte%2C+NC&page_number=1"
  );
  await page.setViewport({
    width: 800,
    height: 800,
  });

  await autoScroll(page);

  await page.screenshot({
    path: "yoursite.png",
    fullPage: true,
  });

  const listings = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll("div.col-2.layout-results")
    ).map((ele) => {
      //Needs to get rid of /n's from array
      let details = Array.from(ele.querySelectorAll(".data-details"))
        .map((details) => details.textContent)
        .map((word) => word);
      if (
        ele.querySelector(".data-results-title.dark-blue-text.b")
          .textContent !== ""
      ) {
        return {
          title: ele.querySelector(".data-results-title.dark-blue-text.b")
            .textContent,
          logo: ele.querySelector(".data-results-img img")
            ? ele.querySelector(".data-results-img img").src
            : null,
          description: details,
        };
      }
    });
  });
  console.log(listings);
  await browser.close();
})();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
