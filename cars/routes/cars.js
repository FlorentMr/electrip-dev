const express = require('express');
const router = express.Router();

const cars = require('../controllers/cars');

const auth = require('../middleware/auth');

router.get('/:id', cars.getCar);
router.get('/user/:userId', cars.getCars);
router.post('/create', cars.createCar);
router.put('/:id', cars.modifyCar);
router.delete('/:id', cars.deleteCar);

module.exports = router;