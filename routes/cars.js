const express = require('express');
const Car = require('../models/Car');
const router = express.Router();

const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    next();
};

router.get('/', requireAuth, async (req, res) => {
    try {
        const cars = await Car.find({ userId: req.session.user.username });
        res.json({ success: true, data: cars });
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cars'
        });
    }
});

router.post('/', requireAuth, async (req, res) => {
    try {
        const { model, year, mpg } = req.body;

        if (!model || !year || !mpg) {
            return res.status(400).json({
                success: false,
                message: 'Model, year, and MPG are required'
            });
        }

        const car = new Car({
            model,
            year: parseInt(year),
            mpg: parseFloat(mpg),
            userId: req.session.user.username
        });

        await car.save();
        const cars = await Car.find({ userId: req.session.user.username });

        res.json({
            success: true,
            data: cars,
            message: 'Car added successfully'
        });

    } catch (error) {
        console.error('Error adding car:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding car'
        });
    }
});

router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { model, year, mpg } = req.body;
        const carId = req.params.id;

        const car = await Car.findOne({
            _id: carId,
            userId: req.session.user.username
        });

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        car.model = model;
        car.year = parseInt(year);
        car.mpg = parseFloat(mpg);

        await car.save();
        const cars = await Car.find({ userId: req.session.user.username });

        res.json({
            success: true,
            data: cars,
            message: 'Car updated successfully'
        });

    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating car'
        });
    }
});

router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const carId = req.params.id;

        const car = await Car.findOne({
            _id: carId,
            userId: req.session.user.username
        });

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        await Car.findByIdAndDelete(carId);
        const cars = await Car.find({ userId: req.session.user.username });

        res.json({
            success: true,
            data: cars,
            message: 'Car deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting car'
        });
    }
});

module.exports = router;