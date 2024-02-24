import { Store } from "../Models/model.js";

export const createStore = async (req, res) => {
  try {
    const userId = req._id;
    console.log(userId);
    const { name, type, longitude, latitude } = req.body;
    const logo = `localhost:8000/${req.file.filename}`;
    const storeData = {
      name,
      logo,
      type,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      owner: userId,
    };
    console.log(storeData);
    const result = await Store.create(storeData);

    res.json({
      success: true,
      message: "Store added succesfully!",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};

export const storesNearby = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const { storeName, type } = req.query;

    const coordinates = [parseFloat(longitude), parseFloat(latitude)];
    const pipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates,
          },
          distanceField: "distance",
          maxDistance: 1000,
          spherical: true,
        },
      },
      {
        $sort: {
          distance: 1,
        },
      },
    ];

    if (storeName) {
      pipeline.push({
        $match: {
          name: { $regex: storeName, $options: "i" },
        },
      });
    }
    if (type) {
      pipeline.push({
        $match: {
          type: { $regex: type, $options: "i" },
        },
      });
    }

    const stores = await Store.aggregate(pipeline);

    res.json({
      success: true,
      message: "Store fetched successfully",
      data: stores,
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
    });
  }
};
