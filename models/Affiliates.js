import mongoose from "mongoose";

const AffiliatesSchema = new mongoose.Schema(
  {
    affiliate: {
      type: String,
      required: true,
      unique: true,
    },
    balance: Number,
    playersBalance: Number,
    weeklyRake: Number,
    percentage: Number,
    codeInvite: String, 
    fullName: String,
    password: String,
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Affiliates", AffiliatesSchema);
