const { debtsHouse } = require('../models/debtsHouseModels');

const projection = {
  name: 1,
  address: 1,
  phoneNumber: 1,
  remain: 1,
  reminder: 1,
};

exports.getalldebts = async (req, res) => {
  try {
    let queryStr = JSON.stringify(req.query);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt|eq)\b/g, (match) => `$${match}`),
    );
    const objectIdList = req.user.alldebts;
    const query = {
      _id: { $in: objectIdList },
      remain: queryStr.remain,
    };
    const allDebts = await debtsHouse
      .find(query, projection)
      .sort({ time: -1 });
    res.status(200).json({
      status: 'success',
      data: {
        users: allDebts,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getexpired = async (req, res) => {
  try {
    const { search } = req.query;
    const objectIdList = req.user.alldebts;

    const query = {
      _id: { $in: objectIdList },
      reminder: {
        $lte: Date.now(),
      },
      remain: {
        $lt: 0,
      },
    };

    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchConditions = [
        { _id: { $in: objectIdList } },
        {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } },
            { phoneNumber: { $regex: search, $options: 'i' } },
          ],
        },
      ];
      query.$and = searchConditions;
    }

    const expiredDates = await debtsHouse.find(query, projection);
    res.status(200).json({
      status: 'success',
      data: {
        users: expiredDates,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.UserDebts = async (req, res) => {
  try {
    const oneUser = await debtsHouse.findById(req.params.id);
    res.status(201).json({
      status: 'success',
      data: {
        oneUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updateDebts = async (req, res) => {
  try {
    const owner = req.user;

    const qarzdor = await debtsHouse.findById(req.params.id);
    if (req.body.transactions) {
      if (Date.parse(req.body.reminder) > Date.parse(qarzdor.reminder)) {
        qarzdor.reminder = req.body.reminder;
      }
      const prevServiceFee = qarzdor.serviceFee;
      qarzdor.transactions = req.body.transactions;
      let totalServiceFee = 0;
      qarzdor.transactions.forEach((transaction) => {
        if (transaction.serviceFee) {
          totalServiceFee += transaction.serviceFee;
        }
      });

      qarzdor.serviceFee = totalServiceFee;

      owner.serviceFee += qarzdor.serviceFee - prevServiceFee;
      await owner.save();
    }

    // if (req.body.hasOwnProperty('remain')) {
    //   qarzdor.remain = parseFloat(req.body.remain);
    // }

    if ('remain' in req.body) {
      qarzdor.remain = parseFloat(req.body.remain);
    }

    if (req.body.name) {
      qarzdor.name = req.body.name;
    }

    if (req.body.address) {
      qarzdor.address = req.body.address;
    }

    if (req.body.phoneNumber) {
      qarzdor.phoneNumber = req.body.phoneNumber;
    }

    await qarzdor.save();

    res.status(201).json({
      status: 'success',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.createdebts = async (req, res) => {
  try {
    let borrower = req.body;
    const owner = req.user;

    let totalServiceFee = 0;
    borrower.transactions.forEach((transaction) => {
      if (transaction.serviceFee) {
        totalServiceFee += transaction.serviceFee;
      }
    });

    borrower.serviceFee = totalServiceFee;

    borrower = await debtsHouse.create(borrower);

    owner.serviceFee += parseFloat(borrower.serviceFee);

    owner.alldebts.push(borrower._id);
    await owner.save();

    res.status(201).json({
      status: 'success',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.searchingSystem = async (req, res) => {
  try {
    const { search, remain } = req.query;

    const objectIdList = req.user.alldebts;

    const searchConditions = [
      { _id: { $in: objectIdList } },
      {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { address: { $regex: search, $options: 'i' } },
          { phoneNumber: { $regex: search, $options: 'i' } },
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
        status: 'fail',
        message: 'Hech narsa topilmadi ):',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        users: foundedData,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getpayment = async (req, res) => {
  try {
    const owner = req.user;
    // const qarzdor = await user.findById(owner);
    const payment = owner.serviceFee;
    res.status(201).json({
      status: 'success',
      payment,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.setZero = async (req, res) => {
  try {
    const owner = req.user;
    if (owner) {
      owner.serviceFee = 0;
      owner.hasSubscribed = true;
      owner.access = true;
      owner.subscriptionendDate = new Date();
      owner.subscriptionendDate.setDate(
        owner.subscriptionendDate.getDate() + 30,
      );

      await owner.save();
    } else {
      throw new Error('User not found');
    }

    await debtsHouse.updateMany(
      { _id: { $in: owner.alldebts } },
      { $set: { serviceFee: 0 } },
    );
    await debtsHouse.updateMany(
      { _id: { $in: owner.alldebts } },
      { $set: { 'transactions.$[].serviceFee': 0 } },
    );

    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
