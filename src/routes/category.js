const express = require("express");
const { determineCategory } = require("../controllers/categoryController");

const router = express.Router();

router.post("/category", determineCategory);

module.exports = router;
