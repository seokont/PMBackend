import mongoose from "mongoose";

const JackpotSchema = new mongoose.Schema({
rakePercent: Number,
initialAmount: Number,
badBeatJackpot: Number,
games: Array
}, {
    timestamps: true
});
export default mongoose.model('Jackpot', JackpotSchema)
