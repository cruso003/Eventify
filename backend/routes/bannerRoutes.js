// bannerRoutes.js
const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");

// Define routes
router.post("/", bannerController.uploadBanner);
router.get("/", bannerController.getBanners);
router.get("/:bannerId", bannerController.getBannerById);
router.put("/:bannerId", bannerController.updateBanner);
router.delete("/:bannerId", bannerController.deleteBanner);

module.exports = router;
