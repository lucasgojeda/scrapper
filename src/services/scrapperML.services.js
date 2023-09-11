/** Libraries */
import puppeteer from "puppeteer";
import chalk from "chalk";

const preparePageForTests = async (page) => {
  // Pass the User-Agent Test.
  const userAgent =
    "Mozilla/5.0 (X11; Linux x86_64)" +
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36";
  await page.setUserAgent(userAgent);
};

export const scrapperMLService = async (name) => {
  console.log(
    `${chalk.white("==========================")} ${chalk.green(
      "IN PROGRESS"
    )} ${chalk.white("==========================")}`
  );

  const browser = await puppeteer.launch({
    slowMo: 200,
    headless: false,
    // headless: "old",
  });

  /** Navigate to the website */
  const urlToSearch = `https://listado.mercadolibre.com.ar/${name.replace(
    " ",
    "-"
  )}#D[A:${name.replace(" ", "%20")}]`;

  console.log(chalk.cyan(urlToSearch));
  console.log(".");
  console.log("..");

  const page = await browser.newPage();
  preparePageForTests(page);
  await page.goto(urlToSearch);

  console.log("...");

  /** Select the cards */
  await page.waitForSelector("span.ui-search-item__promise");
  const data = await page.evaluate(() => {
    const cards = document.querySelectorAll(".ui-search-layout__item");

    let data = [];

    cards.forEach(async (product) => {
      const productText = await product.querySelector(".shops__item-title")
        .innerText;
      const productPrice = await product.querySelector(
        ".andes-money-amount__fraction"
      ).innerText;
      const productLink = await product.querySelector("a").href;
      const productStars = await product.querySelector(
        ".ui-search-reviews__rating-number"
      ).innerText;
      const productReviews = await product.querySelector(
        ".ui-search-reviews__amount"
      ).innerText;

      const isFreeSend = await product.querySelector(
        ".ui-search-item__shipping"
      )?.innerText;

      const isFull = await product.querySelector(
        ".ui-search-item__fulfillment"
      );

      data.push([
        {
          Titulo: productText,
          Precio: Number(productPrice.replace(".", "")),
          Link: productLink,
          Stars: Number(productStars),
          Reviews: Number(productReviews.split("(")[1].split(")")[0]),
          "Envio gratis": isFreeSend ? true : false,
          isFull: isFull ? true : false,
        },
      ]);
    });

    return data;
  });

  console.log(data);

  console.log("....");
  console.log(
    `${chalk.white("==========================")} ${chalk.green(
      "DONE"
    )} ${chalk.white("==========================")}`
  );

  await browser.close();

  return data || null;
};
