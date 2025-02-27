const express = require('express');
const Driver = require('../models/driver');
const Package = require('../models/package');
const router = express.Router();
const mongoose = require("mongoose");
router.post('/api/v1/drivers/add', async (req, res) => {
    try {
        const newDriver = new Driver({
            ...req.body,
            _id: new mongoose.Types.ObjectId()
        });
        const savedDriver = await newDriver.save();
        console.log(savedDriver);
        res.status(201).json({ id: savedDriver._id, driver_id: savedDriver.driver_id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/add', async (req, res) => {
    try {
        const newDriver = new Driver({
            ...req.body,
            
            _id: new mongoose.Types.ObjectId()
        });
        const savedDriver = await newDriver.save();
        res.status(201).json({ id: savedDriver._id, driver_id: savedDriver.driver_id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/driver-list', async (req, res) =>  {
    try {
        const getAllDrivers = await Driver.find().populate('assigned_packages')
        res.status(201).send(getAllDrivers);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

router.get('/drivers/add', async (req, res) => {
    res.render('adddriver');
});

router.post('/drivers/add', async (req, res) => {
    try {
        const newDriver = new Driver({
            ...req.body,
            _id: new mongoose.Types.ObjectId(),
            driver_isActive: req.body.driver_isActive === "on"
        });
        await newDriver.save();
        res.redirect('/33173273/Nayla/api/v1/drivers');
    } catch (error) {
        console.log('Failed to add driver:', error);
        res.status(500).json({ message: error.message });
    }
});


router.get('/driver', (req, res) => {
    res.render('getdriver', async function(err, html) {
        if (err) {
            console.log('Error rendering page:', err);
            res.status(500).send('Error rendering page');
        } else {
            const drivers = await Driver.find()
            console.log("drivers =>>>>>>>>>>>");
            
            res.render('getdriver', { drivers });
        }
    });
});


router.get('/add', (req, res) => {
    res.render('adddriver', function(err, html) {
        if (err) {
            console.log('Error rendering page:', err);
            res.status(500).send('Error rendering page');
        } else {
            res.send(html);
        }
    });
});

router.get('/delete', (req, res) => {
    res.render('deletedriver', function(err, html) {
        if (err) {
            console.log('Error rendering page:', err);
            res.status(500).send('Error rendering page');
        } else {
            res.send(html);
        }
    });
});


// Route to list all packages
router.get('/', async (req, res) => {
    try {
        const drivers = await Driver.find()
        res.render('getdrivers', { drivers });
    } catch (error) {
        console.error('Failed to fetch drivers:', error);
        res.status(500).send('Error listing drivers');
    }
});
router.get('/by-department', async (req, res) => {
    try {
        const drivers = await Driver.find()
        res.render('getdrivers', { drivers });
    } catch (error) {
        console.error('Failed to fetch drivers:', error);
        res.status(500).send('Error listing drivers');
    }
});

// Endpoint to list all drivers
router.get('/api/v1/drivers/', async (req, res) => {
    try {
        const drivers = await Driver.find().populate("assigned_packages").lean();
        res.json(drivers);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        console.log(req.body)
        const { id } = req.params;
      
        
        const driver = await Driver.findById(id);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        // Extract assigned package IDs
        const packageIds = driver.assigned_packages;

        // Delete all associated packages
        if (packageIds.length > 0) {
            // await Package.deleteMany({ _id: { $in: packageIds } });
            await Package.updateMany(
                { _id: { $in: packageIds } },
                { $set: { driverID: null } } // or use '' if you prefer an empty string
            );
        }

        // Delete the driver
       const result = await Driver.findByIdAndDelete(id);


        if (!result) {
            return res.status(404).json({ message: "Driver not found" });
        }
        res.json({ acknowledged: true, deletedCount: 1 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 

router.delete('/api/v1/drivers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Package.deleteMany({ driverID: id }); // Delete referenced packages
        const result = await Driver.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Driver not found" });
        }
        res.json({ acknowledged: true, deletedCount: 1 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 

router.put('/:id', async (req, res) => {
    const { driver_licence, driver_department, driver_name, driver_isActive} = req.body;
    try {
        const result = await Driver.findByIdAndUpdate(req.params.id, { driver_license: driver_licence, driver_department: driver_department, driver_name: driver_name, driver_isActive: driver_isActive }, { new: true });
        if (!result) {
            return res.status(404).json({ status: "ID not found" });
        }
        res.json({ status: "Driver updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;