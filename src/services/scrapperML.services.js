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
    // slowMo: 200,
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

  const lastCount = process.env.TEST_MODE === "ON" ? 1 : LastPage;
  for (let i = 1; i <= lastCount; i++) {
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
      "1/2 DONE"
    )} ${chalk.white("==========================")}`
  );

  await browser.close();

  return result || null;
};

export const scrapperProductPageMLService = async (products) => {
  const browser = await chromium.launch({
    // slowMo: 200,
    // headless: "old",
  });
  try {
    const page = await browser.newPage();

    let result = [];

    const lastCount = process.env.TEST_MODE === "ON" ? 1 : products.length;
    for (let i = 0; i <= lastCount; i++) {
      const urlToSearch = products[i]?.Link;

      if (urlToSearch) {
        await page.goto(urlToSearch, { waitUntil: "domcontentloaded" });

        console.log(
          chalk.gray(
            `Page ${chalk.white(i)} of ${chalk.white(products.length)}`
          )
        );

        /** quantity of products selled in the last 60 days */
        const last60DaysSelsElement = await page.$(
          ".ui-pdp-seller__sales-description"
        );
        let last60DaysSels = await last60DaysSelsElement.textContent();

        if (last60DaysSels.split("+")[1].includes("m")) {
          last60DaysSels =
            Number(last60DaysSels.split("+")[1].split("m")[0]) * 1000;
        } else {
          last60DaysSels = Number(last60DaysSels.split("+")[1]);
        }

        /** quantity of products available */
        const productsAvailableElement = await page.$(
          ".ui-pdp-buybox__quantity__available"
        );
        let productsAvailable = await productsAvailableElement?.textContent();
        if (productsAvailable) {
          productsAvailable = Number(
            productsAvailable.split("(")[1].split(" ")[0]
          );
        }

        /** quantity of products available */
        const productsSelledElement = await page.$(".ui-pdp-subtitle");
        let productsSelled = await productsSelledElement?.textContent();
        if (productsSelled) {
          productsSelled = productsSelled
            .split("|")[1]
            .split(" ")[2]
            .split("+")[1];
          if (productsSelled?.includes("m")) {
            productsSelled = Number(productsSelled.split("m")[0]) * 1000;
          }
        }

        /** Description */
        const productDescriptionElement = await page.$(
          ".ui-pdp-description__content"
        );
        let productDescription = await productDescriptionElement?.textContent();

        /** Description row tables */
        let descriptionTable = [];
        const productRowDescriptionElement = await page.$$(
          ".andes-table__row.ui-vpp-striped-specs__row"
        );

        for (const row of productRowDescriptionElement) {
          const titleElement = await row.$("th");
          const title = await titleElement?.textContent();

          const contentElement = await row.$("td");
          const content = await contentElement?.textContent();

          descriptionTable = [...descriptionTable, { title, content }];
        }

        /** seller website */
        const sellerWebsiteElement = await page.$(
          "a.ui-pdp-media__action.ui-box-component__action"
        );
        let sellerWebsite = await sellerWebsiteElement?.getAttribute("href");

        /** Save data into array */
        result.push({
          ...products[i],
          last60DaysSels,
          productsAvailable: productsAvailable || false,
          productDescription: productDescription || false,
          sellerWebsite: sellerWebsite || false,
          productsSelled: productsSelled || false,
          descriptionTable:
            descriptionTable.length > 1 ? descriptionTable : false,
        });
      } else {
        console.log("##################################");
        console.log(products[i]);
        console.log("##################################");
      }
    }

    return result || null;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    console.log(
      `${chalk.white("==========================")} ${chalk.green(
        "2/2 DONE"
      )} ${chalk.white("==========================")}`
    );
    await browser.close();
  }
};
