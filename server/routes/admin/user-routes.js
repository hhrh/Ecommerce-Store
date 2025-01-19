const express = require("express");
const { getUserCount } = require("../../controllers/admin/users-controller");

const router = express.Router();

router.get("/user-count", getUserCount);

module.exports = router;
