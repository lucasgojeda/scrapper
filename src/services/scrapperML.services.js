/** Libraries */
import { chromium } from "playwright";
import chalk from "chalk";
import { createExcelFile } from "./excelCreator.services.js";

export const scrapperMLService = async (name) => {
  console.log(
    `${chalk.white("==========================")} ${chalk.green(
      "IN PROGRESS"
    )} ${chalk.white("==========================")}`
  );

  const browser = await chromium.launch({
    slowMo: 200,
    headless: false,
    // headless: "old",
  });

  /** Navigate to the website */
  const urlToSearch = `https://listado.mercadolibre.com.ar/${name
    .trim()
    .replace(" ", "-")}_NoIndex_True`;

  console.log(chalk.cyan(urlToSearch));
  console.log(".");
  console.log("..");

  const page = await browser.newPage();
  await page.goto(urlToSearch);

  console.log("...");

  /** Last page */
  const LastPage = await page.evaluate(() =>
    Number(
      document
        .querySelector(".andes-pagination__page-count")
        .innerText.split(" ")[1]
    )
  );

  let result = [];

  for (let i = 1; i <= 2; i++) {
    const newUrlToSearch = `https://listado.mercadolibre.com.ar/${name
      .trim()
      .replace(" ", "-")}_Desde_${1 + i * 50}_NoIndex_True`;

    const finalURL = i > 1 ? newUrlToSearch : urlToSearch;

    await page.goto(finalURL, { waitUntil: "domcontentloaded" });

    console.log(chalk.gray(finalURL));
    console.log(
      chalk.gray(`Page ${chalk.white(i)} of ${chalk.white(LastPage)}`)
    );

    const cards = await page.$$(".ui-search-layout__item");

    let data = [];

    for (const product of cards) {
      /** Title */
      const productTextElement = await product.$(".shops__item-title");
      const productText = await productTextElement.innerText();

      /** Price */
      const productPriceElement = await product.$(
        ".andes-money-amount__fraction"
      );
      const productPrice = await productPriceElement.innerText();

      /** Link */
      const productLinkElement = await product.$("a");
      const productLink = await productLinkElement.getAttribute("href");

      /** Stars */
      const productStarsElement = await product.$(
        ".ui-search-reviews__rating-number"
      );
      const productStars = await productStarsElement?.textContent();

      /** Reviews */
      const productReviewsElement = await product.$(
        ".ui-search-reviews__amount"
      );
      const productReviews = await productReviewsElement?.textContent();

      /** It comes tomorrow */
      const shippingTypeElement = await product.$(
        ".ui-search-item__promise__text"
      );
      const shippingType = await shippingTypeElement?.textContent();

      /** Free send */
      const isFreeSendElement = await product.$(".ui-search-item__shipping");
      const isFreeSend = await isFreeSendElement?.textContent();

      /** Full */
      const isFullElement = await product.$(".ui-search-item__fulfillment");
      const isFull = isFullElement ? true : false;

      /** Same price in installments */
      const priceInInstallmentsElement = await product.$(
        "span.ui-search-item__group__element.shops__items-group-details.ui-search-installments.ui-search-color--LIGHT_GREEN"
      );
      const priceInInstallments =
        await priceInInstallmentsElement?.textContent();

      /** Best selled */
      const bestSelledElement = await product.$(
        "div.ui-search-item__highlight-label.ui-search-item__highlight-label--best_seller"
      );
      const bestSelled = await bestSelledElement?.textContent();

      /** Discounts */
      const discountsElement = await product.$(
        "span.ui-search-price__discount"
      );
      const discountsText = await discountsElement?.textContent();
      const discounts = discountsText
        ? discountsText.split("%")[0] / 100
        : false;

      /** Save data into array */
      data.push({
        Titulo: productText,
        Precio: Number(productPrice.replace(".", "")),
        Link: productLink,
        Stars: productStars ? Number(productStars) : false,
        Reviews: productReviews
          ? Number(productReviews.split("(")[1].split(")")[0])
          : false,
        shippingType: shippingType ?? false,
        isFreeSend: isFreeSend ?? false,
        isFull: isFull,
        priceInInstallments: priceInInstallments ?? false,
        bestSelled: bestSelled ?? false,
        discounts: discounts,
      });
    }

    console.log(
      chalk.gray(`Products on this page: ${chalk.white(data.length)}`)
    );

    result = [...result, ...data];
  }

  console.log("....");
  console.log(
    `${chalk.white("==========================")} ${chalk.green(
      "DONE"
    )} ${chalk.white("==========================")}`
  );

  await browser.close();

  return result || null;
};
