const Campground = require("../models/campgronud");
const catchAsync = require("../utils/catchAsync");
const { cloudinary } = require("../cloudinary");
const mbgGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbgGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find();
  res.render("campgrounds/index", { campgrounds });
};

module.exports.new = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = catchAsync(async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground["location"],
      limit: 1,
    })
    .send();
  const newCampground = new Campground(req.body.campground);
  newCampground.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCampground.geometry = geoData.body.features[0].geometry;
  newCampground.author = req.user._id;
  const savedCamp = await newCampground.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${newCampground._id}`);
});

module.exports.getCampground = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate("reviews")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground, msg: req.flash("success") });
});

module.exports.showEdit = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
});

module.exports.updateCampground = catchAsync(async (req, res) => {
  const campground = await Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground
  );
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.image.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    req.body.deleteImages.forEach((img) => {
      cloudinary.uploader.destroy(img.filename);
    });
    await campground.updateOne({
      $pull: { image: { filename: { $in: [...req.body.deleteImages] } } },
    });
  }
  req.flash("success", "Successfully updated the campground.");
  res.redirect(`/campgrounds/${req.params.id}`);
});

module.exports.deleteCampground = async (req, res) => {
  await Campground.findOneAndDelete({ _id: req.params.id });
  req.flash("success", "Successfully deleted the campground.");
  res.redirect("/campgrounds");
};
