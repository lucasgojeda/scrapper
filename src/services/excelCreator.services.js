/** Libraries */
import ExcelJS from "exceljs";
import Stream from "stream";
import AWS from "aws-sdk";

const s3 = new AWS.S3();

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
];

export const createExcelFile = (data, titleFile) => {
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
    };

    worksheet.addRow(formattedItem);
  });

  workbook.xlsx
    .write(stream)
    .then(() => {
      s3.upload({
        Key: `${titleFile}.xlsx`,
        Bucket: "scrpr-bucket",
        Body: stream,
        ContentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }).promise();
    })
    .catch(function (e) {
      console.log(e.message);
    })
    .then(
      function () {
        const params = {
          Bucket: "scrpr-bucket",
          Key: `${titleFile}.xlsx`,
          Expires: null,
          ResponseContentDisposition: `attachment; filename="${titleFile}.xlsx"`,
        };

        console.log(s3.getSignedUrl("getObject", params));
        console.log("Archivo Excel guardado exitosamente");
        console.log("==========================DONE=========================");
      },
      function () {
        console.log("Not fired due to the catch");
      }
    );
};
