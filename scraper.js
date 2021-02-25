const puppeteer = require("puppeteer");
const fs = require("fs");

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

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

  const listings = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(".data-results-content-parent.relative")
    ).map((ele) => {
      {
        return {
          title: ele.querySelector(".data-results-title.dark-blue-text.b")
            .textContent,
          logo: ele.querySelector(".data-results-img img")
            ? ele.querySelector(".data-results-img img").src
            : null,
          company: `${ele.querySelector(".data-details span").textContent}`,
          location: `${
            ele.querySelector(".data-details span:nth-child(2)").textContent
          }`,
          jobType: `${
            ele.querySelector(".data-details span:nth-child(3)").textContent
          }`,
          link: ele.querySelector("a.data-results-content").href,
          desc: ele.querySelector(".block.show-mobile").textContent,
        };
      }
    });
  });
  try {
    await Promise.all(
      listings.map(async (l) => {
        try {
          const page2 = await browser.newPage();
          await page2.goto(l.link);
          /*
          Query (".data-display-container.bloc") and store it as test2.
          */
          const test2 = "testing";
          l.fullDesc = test2;
        } catch (err) {
          console.log(err);
        }
      })
    );
  } catch (err) {
    console.log(err);
  }

  storeData(listings, "listings.json");
  await browser.close();
})();

async function getDetails(object) {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto(object.link);
  await page.setViewport({
    width: 800,
    height: 800,
  });
  const details = await page.evaluate(
    () => document.querySelector(".data-display-container.bloc").textContent
  );
  await browser.close();
  return details;
}

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
