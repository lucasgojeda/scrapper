import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import ExcelJS from "exceljs";

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

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
  { header: "Tipo de envío", key: "shippingType" },
  { header: "Envío gratis", key: "isFreeSend" },
  { header: "Full", key: "isFull" },
  { header: "Precio en cuotas", key: "priceInInstallments" },
  { header: "Más vendido", key: "bestSelled" },
  { header: "Descuentos", key: "discounts" },
];

export const createExcelFile = async (data, titleFile, report) => {
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

  const stream = await workbook.xlsx.writeBuffer();

  const params = {
    Bucket: "scrpr-bucket",
    Key: `${report._id}.xlsx`,
    Body: stream,
  };

  try {
    const upload = new Upload({
      client: s3,
      params,
    });

    await upload.done();

    return true;
  } catch (error) {
    console.error("Error al cargar el archivo a S3:", error);
    return null;
  }
};
