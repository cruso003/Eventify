// bannerController.js
const cloudinary = require("cloudinary").v2;
const Banner = require("../model/Banner");
// Configure Cloudinary
cloudinary.config({
  cloud_name: "dl43pywkr",
  api_key: "541348946389798",
  api_secret: "v3V36QAwudb1yX-MwBypg5xBowQ",
});

exports.uploadBanner = async (req, res) => {
  try {
    // Logic to save uploaded banner image to the database
    const { name, linkedProducts } = req.body;
    const file = req.file;

    // Upload image to Cloudinary
    const cloudinaryUpload = await cloudinary.uploader.upload(file.path, {
      folder: "banner_images",
    });

    const banner = new Banner({
      name,
      imageUrl: cloudinaryUpload.secure_url,
      linkedProducts,
    });
    const savedBanner = await banner.save();

    res.status(201).json(savedBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBanners = async (req, res) => {
  const bannerId = req.params.id;
  try {
    // Logic to retrieve all banners from the database
    const banners = await Banner.find(bannerId).populate("linkedProducts");
    res.json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBannerById = async (req, res) => {
  const bannerId = req.params.id;
  try {
    const banner = await Banner.findById(bannerId).populate("linkedProducts");
    res.json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    // Logic to update banner details, including image if provided
    const updatedBanner = await Banner.findByIdAndUpdate(bannerId, req.body, {
      new: true,
    });

    res.json(updatedBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteBanner = async (req, res) => {
  const bannerId = req.params.id;

  try {
    const banner = await Banner.findById(bannerId);

    //Delete the image from Cloudinary
    if (banner.imageUrl) {
      const publicId = banner.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    await Banner.findByIdAndDelete(bannerId);
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
