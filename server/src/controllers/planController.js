const Plan = require('../models/Plan');

//-----------------
const getPlans = async (req, res)=>{
    const plans = await Plan.find();
    res.status(200).json({mas:'Success',plans});
}
//-----------------
const createPlan = async (req, res)=>{
    const plan = await new Plan({
        title: req.body.title,
        days:  req.body.days,
        amount:req.body.amount,
        desc:  req.body.desc,
    });
    await plan.save().then((result) => {
        res.status(201).json({msg:"Plan created successfully",result});
    }).catch((err) => {
        res.status(500).json({msg:"Something went wrong",err});   
    });
}
//------------------
const updatePlan = async (req, res)=>{
    const plan = await Plan.findOneAndUpdate(
        {_id:req.params.planId},
        {
            title: req.body.title,
            days:  req.body.days,
            amount:req.body.amount,
            desc:  req.body.desc,
        }
    );
    await plan.save().then((result) => {
        res.status(200).json({msg:"Plan updated successfully",result});
    }).catch((err) => {
        res.status(500).json({msg:"Something went wrong",err});
    });
}
//-------------------
const deletePlan = async (req, res)=>{
    await Plan.deleteOne({_id:req.params.planId});
    res.status(200)("Successfully deleted");
}
//-------------------
module.exports = {
    getPlans,
    createPlan,
    updatePlan,
    deletePlan
}