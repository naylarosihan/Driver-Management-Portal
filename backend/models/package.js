const mongoose = require('mongoose');

let packageSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    package_title: { type: String, required: true },
    package_weight: { type: Number, required: true },
    package_destination: { type: String, required: true },
    package_description: { type: String },
    isAllocated: { type: Boolean, required: true },
    driverID: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    package_id: {
        type: String,
        unique: true,
        default: () => `P${Math.floor(Math.random() * 10000)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`
    },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'packages' });

module.exports = mongoose.model('Package', packageSchema);

