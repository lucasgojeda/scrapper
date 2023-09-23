/** Services */
import { createExcelFile } from "../services/excelCreator.services.js";
import {
  createReportService,
  deleteReportService,
} from "../services/report.services.js";
import { scrapperMLService } from "../services/scrapperML.services.js";

export const scrapperMLController = async (req, res) => {
  const { name } = req.body;
  const data = await scrapperMLService(name);
  if (!data) {
    handleError(res, "Scrapping failed", {}, 403);
    return;
  }

  /** Create report */
  const report = await createReportService({
    name,
    productsQuantity: data.length,
    userId: req.id,
  });
  if (!report) {
    handleError(res, "Report Creation failed", {}, 403);
    return;
  }

  /** Create excel file */
  const url = await createExcelFile(data, name, report);
  if (!url) {
    await deleteReportService(report._id);
    handleError(res, "Report Creation failed", {}, 403);
    return;
  }

  const reportFinished = {
    _id: report._id,
    name: report.name,
    productsQuantity: report.productsQuantity,
    user: report.user,
    date: report.date,
  };

  res.status(200).json({
    report: reportFinished,
  });
};
