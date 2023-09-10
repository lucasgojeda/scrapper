import ExcelJS from "exceljs";
import puppeteer from "puppeteer";

// Crear un nuevo libro de Excel
const workbook = new ExcelJS.Workbook();

// Agregar una hoja de trabajo al libro
const worksheet = workbook.addWorksheet("MiHoja");

// Definir encabezados para las columnas
worksheet.columns = [
  { header: "Título", key: "Titulo" },
  { header: "Precio", key: "Precio" },
  { header: "Link", key: "Link" },
  { header: "Estrellas", key: "Stars" },
  { header: "Reseñas", key: "Reviews" },
];

const createExcelFile = (data, titleFile) => {
  // Agregar los datos a la hoja de trabajo
  data.forEach((item) => {
    const formattedItem = {
      Titulo: item[0].Titulo,
      Precio: item[0].Precio,
      Link: item[0].Link,
      Stars: item[0].Stars,
      Reviews: item[0].Reviews,
    };

    worksheet.addRow(formattedItem);
  });

  // Guardar el archivo Excel en disco
  workbook.xlsx
    .writeFile(`./csv/${titleFile}.xlsx`)
    .then(() => {
      console.log("Archivo Excel guardado exitosamente");
      console.log("==========================DONE=========================");
    })
    .catch((error) => {
      console.error("Error al guardar el archivo Excel:", error);
    });
};

async function scrappingFunction() {
  const browser = await puppeteer.launch({
    slowMo: 200,
    headless: false,
  });

  /** Navigate to the website */
  const textToSearch = "Parlantes";
  const urlToSearch = `https://listado.mercadolibre.com.ar/${textToSearch.replace(
    " ",
    "-"
  )}#D[A:${textToSearch.replace(" ", "%20")}]`;

  console.log("\x1b[32m", "URL to Search: " + urlToSearch, "\x1b[0m");
  console.log("In progress...");

  const page = await browser.newPage();
  await page.goto(urlToSearch);

  /** Select the cards */
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

      //   const productLlegaMañana = await product.querySelector(
      //     ".ui-search-item__promise__text"
      //   )?.innerText;

      data.push([
        {
          Titulo: productText,
          Precio: Number(productPrice.replace(".", "")),
          Link: productLink,
          Stars: Number(productStars),
          Reviews: Number(productReviews.split("(")[1].split(")")[0]),
          // { productLlegaMañana: productLlegaMañana ? productLlegaMañana : "" },
        },
      ]);
    });

    return data;
  });

  console.log(data);

  /** Create excel file */
  createExcelFile(data, textToSearch);

  await browser.close();
}
scrappingFunction();
