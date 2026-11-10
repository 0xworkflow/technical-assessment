const { body, query } = require("express-validator");
const { parseDate, today } = require("../services/dates");

function dateField(location, name, label) {
  return location(name).custom((value) => {
    if (!parseDate(value)) throw new Error(`${label} must be a real YYYY-MM-DD date.`);
    return true;
  });
}

const stayBody = [
  body("villaId").isInt({ min: 1 }).withMessage("Choose a villa.").toInt(),
  dateField(body, "startDate", "Check-in"),
  dateField(body, "endDate", "Check-out"),
  body("startDate").custom((value) => {
    if (parseDate(value) && value < today()) throw new Error("Check-in cannot be in the past.");
    return true;
  }),
  body("endDate").custom((value, { req }) => {
    if (parseDate(value) && parseDate(req.body.startDate) && value <= req.body.startDate) {
      throw new Error("Check-out must be after check-in.");
    }
    return true;
  }),
  body("guests").isInt({ min: 1, max: 40 }).withMessage("Guests must be between 1 and 40.").toInt(),
];

const stayQuery = [
  dateField(query, "startDate", "Check-in"),
  dateField(query, "endDate", "Check-out"),
  query("startDate").custom((value) => {
    if (parseDate(value) && value < today()) throw new Error("Check-in cannot be in the past.");
    return true;
  }),
  query("endDate").custom((value, { req }) => {
    if (parseDate(value) && parseDate(req.query.startDate) && value <= req.query.startDate) {
      throw new Error("Check-out must be after check-in.");
    }
    return true;
  }),
  query("guests").optional({ values: "falsy" }).isInt({ min: 1, max: 40 }).withMessage("Guests must be between 1 and 40.").toInt(),
];

const blockBody = [
  body("villaId").isInt({ min: 1 }).withMessage("Choose a villa.").toInt(),
  dateField(body, "startDate", "Start date"),
  dateField(body, "endDate", "End date"),
  body("endDate").custom((value, { req }) => {
    if (parseDate(value) && parseDate(req.body.startDate) && value <= req.body.startDate) {
      throw new Error("End date must be after the start date.");
    }
    return true;
  }),
  body("reason").optional({ values: "falsy" }).trim().isLength({ max: 120 }).withMessage("Reason must be 120 characters or fewer."),
];

module.exports = { stayBody, stayQuery, blockBody };
