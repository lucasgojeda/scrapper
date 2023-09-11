import ExcelJS from "exceljs";
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

export const createExcelFile = (data, titleFile) => {
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
