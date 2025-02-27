const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    driver_name: { type: String, required: true },
    driver_department: { type: String, required: true },
    driver_license: { type: String, required: true },
    driver_isActive: { type: Boolean, required: true },
    driver_id: {
        type: String,
        unique: true,
        default: () => `D${Math.floor(Math.random() * 90 + 10)}-33-${String.fromCharCode(...Array(3).fill().map(() => Math.floor(Math.random() * 26) + 65))}`
    },
    driver_createdAt: { type: Date, default: Date.now },
    assigned_packages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Package' }]
}, { collection: 'drivers' });

module.exports = mongoose.model('Driver', driverSchema);
// driver_license: { type: String, required: true, unique: true },