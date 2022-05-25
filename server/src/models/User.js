const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    phone:      { type: String, required: true,unique: true },
    role:       { type: String, required: true, default: 'user'},
    email:      { type: String, default: ''},
    avatarImg:  { type: String, default: ''},
    coverImg:   { type: String, default: ''},
    name:       { type: String, default: ''},
    age:        { type: String, default: ''},
    gender:     { type: String, default: ''},
    bio:        { type: String, default: ''},
    divission:  { type: String, default: ''},
    district:   { type: String, default: ''},
    upozilla:   { type: String, default: ''},
    union:      { type: String, default: ''},
    subjects:   { type: String, default: ''},
    class:      { type: String, default: ''},
    institute:  { type: String, default: ''},
    department: { type: String, default: ''},
    days:       { type: String, default: ''},
    subEnd:     { type: String, default: ''},
    refs:       { type: Number, default: 0},
    followers:  [],
    followings: [],
    education:  [],
  },{timestamps:true}
);


const User = mongoose.model("User", UserSchema);

module.exports = User;

