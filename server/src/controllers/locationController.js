const { JsonDB } =require('node-json-db') ;
const { Config } =require('node-json-db/dist/lib/JsonDBConfig'); 

const divissionDB = new JsonDB(new Config("divissions", true, false, '/'));
const districtDB = new JsonDB(new Config("districts", true, false, '/'));
const upazillaDB = new JsonDB(new Config("upazillas", true, false, '/'));
const unionDB = new JsonDB(new Config("unions", true, false, '/'));





const getDivissions = async (req, res)=>{
    const divissionsArray = divissionDB.getData("/divissions");
    res.status(200).json({divissions:divissionsArray});
}
const getDistricts = async (req, res)=>{
    const districtsArray = districtDB.getData("/districts");
    res.status(200).json({districts:districtsArray});
}
const getUpozillas = async (req, res)=>{
    const upazillasArray = upazillaDB.getData("/upazillas");
    res.status(200).json({upazillas:upazillasArray});
}
const getUnions = async (req, res)=>{
    const unionsArray = unionDB.getData("/unions");
    res.status(200).json({unions:unionsArray});
}


//-----------------
// const createDivission = async (req, res)=>{
//     res.status(500).json({msg:"Something went wrong",});   
// }
// const createDistrict = async (req, res)=>{
//     res.status(500).json({msg:"Something went wrong",});   
// }
// const createUpozilla = async (req, res)=>{
//     res.status(500).json({msg:"Something went wrong",});   
// }
// const createUnion = async (req, res)=>{
//     res.status(500).json({msg:"Something went wrong",});   
// }

// const deletePlan = async (req, res)=>{
//     res.status(200)("Successfully deleted");
// }
//-------------------
module.exports = {
    getDivissions,
    getDistricts,
    getUpozillas,
    getUnions
}