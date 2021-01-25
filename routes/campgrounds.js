const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(campgrounds.index)
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    campgrounds.createCampground
  );

router
  .route("/:id/edit")
  .get(isLoggedIn, isAuthor, campgrounds.showEdit)
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    campgrounds.updateCampground
  );
router.get("/new", isLoggedIn, campgrounds.new);
router.get("/:id", campgrounds.getCampground);
router.delete(
  "/:id/delete",
  isLoggedIn,
  isAuthor,
  campgrounds.deleteCampground
);

module.exports = router;
