/** Models */
import Report from "../models/report.model.js";

export const getReportsService = async () => {
  try {
    const reports = await Report.find().sort({ date: -1 });

    return reports || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createReportService = async ({
  name,
  productsQuantity,
  userId,
}) => {
  try {
    const data = {
      name,
      url: "URL2",
      productsQuantity,
      user: userId,
      date: new Date(),
    };
    const newReport = new Report(data);

    const newReportFinished = await newReport.save();

    return newReportFinished || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateReportService = async (id, url) => {
  try {
    const newReportFinished = await Report.findByIdAndUpdate(id, { url });

    return newReportFinished || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteReportService = async (id) => {
  try {
    const newReportFinished = await Report.findByIdAndRemove(id);

    return newReportFinished || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
