/** Services */
import { getReportsService } from "../services/report.services.js";

export const getReportsController = async (req, res) => {
  const reports = await getReportsService(req.body);
  if (!reports) {
    return handleError(res, "Something Went Wrong", {}, 400);
  }

  res.status(200).json({
    reports,
  });
};
