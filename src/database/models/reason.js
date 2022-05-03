import mongoose from 'mongoose';

const ReasonSchema = new mongoose.Schema({
	reason: { type: String },
	registeredAt: { type: Number, default: Date.now }, // `Date.now()` returns the current unix timestamp as a number
});

export const ReasonModel = mongoose.model('reason', ReasonSchema);
