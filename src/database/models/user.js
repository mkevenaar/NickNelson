import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	id: { type: String },
	registeredAt: { type: Number, default: Date.now() },
	reputation: { type: Number, default: 0 },
});

export const UserModel = mongoose.model('user', UserSchema);
