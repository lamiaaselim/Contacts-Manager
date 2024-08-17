const express = require("express");
const controller = require("./../Controller/contactController");
const router = express.Router();

router
  .route("/contact")
  .get(controller.getAllContacts)
  .post(controller.addContact)

router
  .route("/contact/:id")
  .get(controller.getContactById)
  .delete(controller.deleteContact)
  .patch(controller.updateContact);

module.exports = router;
