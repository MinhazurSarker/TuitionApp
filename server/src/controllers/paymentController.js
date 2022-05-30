const User = require('./../models/User');
const TRX = require('./../models/TRX');
const Plan = require('../models/Plan');

//------------------
const axios = require("axios").default;
const dotenv = require("dotenv");
const moment = require('moment');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');


dotenv.config();
const appUrl = process.env.APP_URL;

const jsonDB = new JsonDB(new Config("settingsData", true, false, '/'));
const signature_key = jsonDB.getData("/payKeys/signKey")
const store_id = jsonDB.getData("/payKeys/storeId");
const mode = jsonDB.getData("/payKeys/mode");

//------------------
const payment = async (req, res) => {
  const { userId, planId } = req.body;
  let amarPayUrl;
  if (mode == 'secure') {
    amarPayUrl = 'https://secure.aamarpay.com/index.php'
  } else if (mode == 'test') {
    amarPayUrl = 'https://sandbox.aamarpay.com/jsonpost.php'
  }
  try {
    const user = await User.findOne({ _id: userId });
    if (user.role == 'admin' || user.role == 'super') {
      res.status(200).json({ status: 'failed', msg: "You are an author.you can not be a tutor" })
    } else {
      if (
        user.name.length == 0
        || user.email.length == 0
        || user.phone.length == 0
        || user.phone.union == 0
        || user.upozilla.length == 0
        || user.district.length == 0
        || user.divission.length == 0
      ) {
        res.status(200).json({ status: 'failed', msg: "Fill up your details first" })
      } else {
        try {
          const plan = await Plan.findOne({ _id: planId });
          const newTRX = await new TRX({
            userId: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            plan: plan.title,
            days: plan.days,
            amount: plan.amount
          })
          await newTRX.save();
          const formData = {
            cus_name: user.name,
            cus_email: user.email,
            cus_phone: user.phone,
            amount: newTRX.amount,
            tran_id: newTRX._id,
            signature_key: signature_key,
            store_id: store_id,
            currency: "BDT",
            desc: plan.desc,
            cus_add1: `${user.union}, ${user.upozilla}, ${user.district}, ${user.divission}`,
            cus_add2: `${user.union}, ${user.upozilla}, ${user.district}, ${user.divission}`,
            cus_city: user.district,
            cus_country: "Bangladesh",
            success_url: `${appUrl}/api/callback`,
            fail_url: `${appUrl}/api/callback`,
            cancel_url: jsonDB.getData("/payKeys/returnUrl"),
            type: "json"
          };
          const { data } = await axios.post(
            amarPayUrl,
            formData
          );
          if (data.result !== "true") {
            let errorMessage = "";
            for (let key in data) {
              errorMessage += data[key] + ',';
            }
            return res.status(200).json({ status: 'failed', msg: errorMessage });
          } else {
            res.status(200).json({ url: data.payment_url });
            // res.status(301).redirect(data.payment_url);
          }
        } catch (error) {
          res.status(200).json({ status: 'failed', msg: "Please try again" })
        }
      }
    }
  } catch (error) {
    res.status(200).json({ status: 'failed', msg: "Please login again" })
  }
}
//---------------------

var dashboardDB = new JsonDB(new Config("dashboardData", true, false, '/'));
const callBack = async (req, res) => {
  const { pay_status, mer_txnid } = req.body;
  try {
    const trx = await TRX.findOne({ _id: mer_txnid });
    if (pay_status == "Successful") {
      const expDate = moment(Date.now()).add(trx.days, 'days').format('YYYY-MM-DD');
      try {
        const user = await User.findOne({ _id: trx.userId });
        user.role = 'tutor';
        user.subEnd = expDate;
        trx.status = 'Successful';
        await trx.save();
        await user.save();
        const totalIncome = dashboardDB.getData("/income");
        dashboardDB.push('/income', Number(totalIncome) + Number(trx.amount));
        res.redirect(jsonDB.getData("/payKeys/returnUrl"));
      } catch (error) {
        trx.status = 'Failed';
        trx.save();
        res.redirect(jsonDB.getData("/payKeys/returnUrl"));
      }
    } else {
      trx.status = 'Failed';
      trx.save();
      res.redirect(jsonDB.getData("/payKeys/returnUrl"));
    }
  } catch (error) {
    res.redirect(jsonDB.getData("/payKeys/returnUrl"));
  }

}
//---------------------
module.exports = {
  payment,
  callBack
}  