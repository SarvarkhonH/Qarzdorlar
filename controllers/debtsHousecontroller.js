const { debtsHouse } = require("../models/debtsHouseModels");

exports.getalldebts = async (req,res) =>{
  try {
    const allDebts = await debtsHouse.find();
    res.status(200).json({
      status: "succes",
      data: {
        allDebts
      },
    });
  } catch (error) {
    res.status(201).json({
      status: "fail",
      message: error.message,
    });
  }
}
exports.createdebts = async (req, res) => {
  try {

    const newDebts = await debtsHouse.create(req.body);
 

    res.status(201).json({
      status: "succes",
      data: {
        debt: newDebts,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.updatedebts = async(req,res) => {
  try {
    const searchByNumber = req.body.phoneNumber
    const foundedData = await debtsHouse.findOne({ phoneNumber: searchByNumber })
    if (!foundedData) {
      return res.status(404).json({
        status: "fail",
        message: "Ushbu raqamga tegishli mijoz malumotlar bazasida mavjud emas.",
      });
    }
    if(req.body.products){
       foundedData.products.push(req.body.products[0]);
       await foundedData.save();
       await foundedData.updateDebtsAndRemaining();
    } else if(req.body.payment){
       foundedData.payment.push({payment: req.body.payment, time: Date.now()})
       await foundedData.save()
       await foundedData.updateDebtsAndRemaining();
    }
   
    
    res.status(202).json({
      status: "succes",
      data: {
        debt: foundedData,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
}

// exports.addpayment =async(req,res) => {
//   try {
//     const searchByNumber = req.body.phoneNumber
//     const foundedData = await debtsHouse.findOne({ phoneNumber: searchByNumber })
  
//       if (!foundedData) {
//         return res.status(404).json({
//           status: "fail",
//           message: "Ushbu raqamga tegishli mijoz malumotlar bazasida mavjud emas.",
//         });}
//         foundedData.payment.push(req.body.payment[0])
//         await foundedData.save()
//         res.status(202).json({
//           status: "succes",
//         })
//     } catch (error) {
//        res.status(404).json({
//        status: "fail",
//        message: error.message,
//     });
//   }
 

// }
 
