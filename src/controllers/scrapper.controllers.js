/** Services */
import { scrapperMLService } from "../services/scrapperML.services.js";

export const scrapperMLController = async (req, res) => {
  const { name } = req.body;
  const data = await scrapperMLService(name);
  if (data == null) {
    handleError(res, "Request failed", {}, 403);
    return;
  }
  res.status(200).json({
    message: "DONE",
    data,
  });
};
