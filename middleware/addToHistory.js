import ActionHistory from "../Models/History.js";  // Changed to English
import onFinished from "on-finished";

const ActionTypes = {
  CREATE: "Create",  // Changed to uppercase and more descriptive names
  UPDATE: "Update",
  DELETE: "Delete",
  READ: "Read",
};

export const responseHandler = (req, res, next) => {
  onFinished(res, (err, data) => {
    const resourceId =
      req.params.idP || req.params.idR || req.params.id || req.userId;
    if (!resourceId) return;
    
    const resourceName = req.baseUrl.split("/")[1];  // Changed to English
    if (!resourceName) return;
    
    const actionType =
      req.method === "POST"
        ? ActionTypes.CREATE
        : req.method === "PUT"
        ? ActionTypes.UPDATE
        : req.method === "DELETE"
        ? ActionTypes.DELETE
        : ActionTypes.READ;

    // Add a record to the ActionHistory collection
    ActionHistory.create({
      ResourceId: resourceId,  // Changed to English
      ResourceName: resourceName,  // Changed to English
      actionType,
    });
  });
  next();
};

export default responseHandler;
