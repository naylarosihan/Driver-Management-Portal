const express = require('express');
const mongoose = require('mongoose');
const Package = require('../models/package');
const Driver = require('../models/driver');
const router = express.Router();
// Route to display form to add a new package
router.get('/package-list', async (req, res) => {
    try {
        const packages = await Package.find().populate('driverID'); // Fetch all drivers
        res.status(201).send(packages);
    } catch (err) {
        res.status(500).send('Error loading the form');
    }
});



// Route to handle form submission for adding a new package
router.post('/add', async (req, res) => {
    try {
        const body = {
            ...req.body,
            _id: new mongoose.Types.ObjectId()
        };
        const newPackage = new Package(body);
        const savePackage = await newPackage.save();
        await Driver.updateOne( { _id: req.body.driverID },
            { $push: { assigned_packages: savePackage._id } });
        res.status(201).json({ id: savePackage._id, package_id: savePackage.package_id });
    } catch (error) {
        console.log('Failed to add package:', error);
        res.status(500).json({ message: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const result = await Package.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
        if(req.body.old_driver_id){
            await Driver.updateOne(
                { _id: req.body.old_driver_id },
                { $pull: { assigned_packages: result._id } }
            );
        }
        await Driver.updateOne( { _id: req.body.driverID },
            { $push: { assigned_packages: result._id } });

        if (!result) {
            return res.status(404).json({ status: "ID not found" });
        }
        res.json({ status: "Driver updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to list all packages
router.get('/', async (req, res) => {
    try {
        const packages = await Package.find().populate('driverID').lean();
        res.render('getpackages', { packages });
    } catch (error) {
        console.error('Failed to fetch packages:', error);
        res.status(500).send('Error listing packages');
    }
});


// Route to delete a package using AJAX and DELETE HTTP method
router.delete('/delete/:id', async (req, res) => {
    try { 
        
        const packageToDelete = await Package.findById(req.params.id);

        if (!packageToDelete) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // Delete the package
        const result = await Package.findByIdAndDelete(req.params.id);

        // Update drivers to remove the package ID from their assigned_packages
        await Driver.updateMany(
            { assigned_packages: req.params.id },
            { $pull: { assigned_packages: req.params.id } }
        );
        
        if (result) {
            res.status(200).json({ message: "Package deleted successfully" });
        } else {
            res.status(404).json({ message: "Package not found" });
        }
    } catch (error) {
        console.error('Failed to delete package:', error);
        res.status(500).json({ message: "Error deleting package" });
    }
});
router.get('/delete', async (req, res) => {
    res.render('deletepackage', function(err, html) {
        if (err) {
            console.log('Error rendering page:', err);
            res.status(500).send('Error rendering page');
        } else {
            res.send(html);
        }
    });
});

module.exports = router;