/** Libraries */
import ExcelJS from "exceljs";
import Stream from "stream";

const stream = new Stream.PassThrough();

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
  { header: "Tipo de envio", key: "shippingType" },
  { header: "Envio gratis", key: "isFreeSend" },
  { header: "Full", key: "isFull" },
  { header: "Precio en cuotas", key: "priceInInstallments" },
  { header: "Más vendido", key: "bestSelled" },
  { header: "Descuentos", key: "discounts" },

  { header: "Ventas de los ultimo 60 dias (más de)", key: "last60DaysSels" },
  { header: "Productos disponibles", key: "productsAvailable" },
  { header: "Descripcion", key: "productDescription" },
  { header: "Pagina del vendedor", key: "sellerWebsite" },
  { header: "Productos vendidos", key: "productsSelled" },
  { header: "Tabla de detalles", key: "descriptionTable" },
];

export const createExcelFile = async (data, titleFile) => {
  // Agregar los datos a la hoja de trabajo
  data.forEach((item) => {
    const formattedItem = {
      Titulo: item.Titulo,
      Precio: item.Precio,
      Link: item.Link,
      Stars: item.Stars,
      Reviews: item.Reviews,
      shippingType: item.shippingType,
      isFreeSend: item.isFreeSend,
      isFull: item.isFull,
      priceInInstallments: item.priceInInstallments,
      bestSelled: item.bestSelled,
      discounts: item.discounts,
      last60DaysSels: item.last60DaysSels,
      productsAvailable: item.productsAvailable,
      productDescription: item.productDescription,
      sellerWebsite: item.sellerWebsite,
      productsSelled: item.productsSelled,
      descriptionTable: item.descriptionTable,
    };

    worksheet.addRow(formattedItem);
  });

  try {
    await workbook.xlsx.writeFile(`./csv/${titleFile}.xlsx`);
    console.log("Archivo Excel guardado exitosamente");
    console.log("==========================DONE=========================");
  } catch (error) {
    console.error("Error al guardar el archivo Excel:", error);
  }
};
