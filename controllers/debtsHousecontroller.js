const { debtsHouse } = require("../models/debtsHouseModels");

const projection = {
  name: 1, // Include 'name' field
  address: 1, // Include 'address' field
  phoneNumber: 1, // Include 'phoneNumber' field
  remain: 1, // Include 'remain' field
  reminder: 1,
};

exports.getalldebts = async (req, res) => {
  try {
    let queryStr = JSON.stringify(req.query);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt|eq)\b/g, (match) => `$${match}`)
    );

    const objectIdList = req.user.alldebts;

    // Define the query conditions
    const query = {
      _id: { $in: objectIdList }, // Find documents with IDs in the objectIdList
      remain: queryStr.remain,
    };

    const pipeline = [
      { $match: query }, // Match documents based on your query conditions
      { $unwind: "$transactions" }, // Unwind the transactions array
      {
        $sort: {
          "transactions.object.time": -1, // Sort in descending order of time
        },
      },
      {
        $group: {
          _id: "$_id", // Group by the debt's ID
          data: { $first: "$$ROOT" }, // Keep the first document (which has the latest transaction)
        },
      },
      { $replaceRoot: { newRoot: "$data" } }, // Replace the root with the selected document
    ];

    // Execute the aggregation pipeline
    const allDebts = await debtsHouse.aggregate(pipeline).project(projection);

    res.status(200).json({
      status: "success",
      data: {
        allDebts,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};






exports.UserDebts = async (req, res) => {
  try {
    const oneUser = await debtsHouse.findById(req.params.id);

    res.status(201).json({
      status: "success",
      data: {
        oneUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateDebts = async (req, res) => {
  try {
    const oneUser = await debtsHouse.findById(req.params.id);

    if (req.body.transactions) {
      oneUser.transactions = req.body.transactions;
    }

    if(req.body.remain) {
      oneUser.remain = req.body.remain;
    }

    if (req.body.name) {
      oneUser.name = req.body.name;
    }
    
    if (req.body.address) {
      oneUser.address = req.body.address;
    }
    
    if (req.body.phoneNumber) {
      oneUser.phoneNumber = req.body.phoneNumber;
    }

    await oneUser.save();
    res.status(201).json({
      status: "success",
      // data: {
      //   oneUser,
      // },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.createdebts = async (req, res) => {
  try {
    const currentUser = req.user;
    const borrower = await debtsHouse.create(req.body);
   
    currentUser.alldebts.push(borrower._id);

    // const currentUser = await user.findById(req.user._id);
  
    // currentUser.alldebts.push(req.body);
    await currentUser.save();

    res.status(201).json({
      status: "success",
      // data: {
      //   debt: currentUser.alldebts,
      // },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};



exports.searchingSystem = async (req, res) => {
  try {
    const { search, remain } = req.query;
    
    // console.log("Request body:", req.query);

    const objectIdList = req.user.alldebts;

    const searchConditions = [
      { _id: { $in: objectIdList } },
      {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
          { phoneNumber: { $regex: search, $options: "i" } },
        ],
      },
    ];

    if (remain !== undefined) {
      searchConditions.push({ remain });
    }

    const foundedData =
      searchConditions.length > 1
        ? await debtsHouse.find({ $and: searchConditions }, projection)
        : await debtsHouse.find(searchConditions[0], projection);
    
    if (foundedData.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Hech narsa topilmadi ):",
      });
    }
    
    
    res.status(200).json({
      status: "success",
      data: {
        foundedData,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
