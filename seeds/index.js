const cities = require("./cities");
const Campground = require("../models/campgronud");
const { descriptors, places } = require("./seedHelpers");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Guney:guneypass@guneyral.iif16.mongodb.net/yelpCamp?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected To Database."))
  .catch((err) => console.log(err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "5ff5f36e89e5b43aad85d7fc",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: [
        {
          _id: "5ff8e0015cce4628a16b13b9",
          url:
            "https://res.cloudinary.com/dgst2ibny/image/upload/v1610145785/yelpCampTutorial/p9gtfgpokccvcpzuuf81.jpg",
          filename: "yelpCampTutorial/p9gtfgpokccvcpzuuf81",
        },
        {
          _id: "5ff8e0015cce4628a16b13ba",
          url:
            "https://res.cloudinary.com/dgst2ibny/image/upload/v1610145792/yelpCampTutorial/gglk1e8hz9hd2dna95wv.jpg",
          filename: "yelpCampTutorial/gglk1e8hz9hd2dna95wv",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      price,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iusto saepe quia, dignissimos consequuntur totam facere corrupti nulla aliquid recusandae quibusdam culpa, non illum harum soluta perferendis sed veniam, repellendus delectus.",
    });
    await camp.save();
  }
};

seedDb().then(() => mongoose.connection.close());
