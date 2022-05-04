import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	id: { type: String },
	guild: { type: String },
	registeredAt: { type: Number, default: Date.now }, // `Date.now()` returns the current unix timestamp as a number
	reputation: { type: Number, default: 0 },
	reason: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'reason',
		},
	],
});

export const UserModel = mongoose.model('user', UserSchema);
