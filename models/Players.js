import mongoose from "mongoose";

const PlayersSchema = new mongoose.Schema({
  player: String,
  adminProfile: String,
  title: String,
  level: String,
  realName: String,
  pWHash: String,
  gender: String,
  location: String,
  balance: Number,
  balance2: Number,
  lastReset: String,
  lastReset2: String,
  permissions: String,
  tickets: String,
  chipsTransfer: String,
  chipsTransfer2: String,
  chipsAccept: String,
  chipsAccept2: String,
  chat: String,
  chatColor1: String,
  chatColor2: String,
  firstLogin: String,
  lastLogin: String,
  logins: Number,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  valCode: String,
  avatar: Number,
  avatarFile: String,
  custom: String,
  note: String,
  eRake: Number,
  eRake2: Number,
  pRake: Number,
  pRake2: Number,
  tFees: Number,
  tFees2: Number,
  ringChips: Number,
  ringChips2: Number,
  regChips: Number,
  regChips2: Number,
  sessionID: String
}, {
    timestamps: true
});
export default mongoose.model('Players', PlayersSchema)