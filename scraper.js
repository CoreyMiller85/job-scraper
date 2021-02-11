const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
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
<<<<<<< HEAD
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
=======
    // get node list of elements and then compile into array
    return (
      Array.from(document.querySelectorAll("div.col-2.layout-results"))
        .map((ele) => {
          return {
            // place the information from eact HTML element, into each like object field
            title: ele.querySelector(".data-results-title.dark-blue-text.b")
              .textContent,
            logo: ele.querySelector(".data-results-img img")
              ? ele.querySelector(".data-results-img img").src
              : null,
            details: {
              company:
                //Needs Refactor
                ele.querySelector(".data-details, span").textContent !== null
                  ? ele.querySelector(".data-details, span").textContent
                  : null,
            },
          };
        })
        //filter out elements that return loading
        .filter((element) => element.title !== "")
    );
>>>>>>> dc64446d159fef7b5767ca01e327c5b61c4ba134
  });
  console.log(listings);
  await browser.close();
})();

//Page scroll function for lazy loading
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
