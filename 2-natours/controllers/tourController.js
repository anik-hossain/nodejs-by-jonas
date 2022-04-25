const fs = require('fs');

const file = `${__dirname}/../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(file));

exports.checkID = (req, res, next) => {
    if (parseInt(req.params.id) > tours.length) {
        return res.status(404).json({
            status: 'Invalid id',
        });
    }
    next();
};

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price',
        });
    }
    next();
};

// Get all tours
exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'Success',
        result: tours.length,
        data: {
            tours,
        },
    });
};

// Get tour by id
exports.getTour = (req, res) => {
    const id = parseInt(req.params.id);
    const tour = tours.find((el) => el.id === id);
    if (tour) {
        res.status(200).json({
            status: 'Success',
            data: {
                tour,
            },
        });
    } else {
        res.status(404).json({
            status: 'Not found',
        });
    }
};

// Create new tour
exports.createTour = (req, res) => {
    const id = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id }, req.body);

    tours.push(newTour);
    fs.writeFile(file, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'Success',
            data: {
                tour: newTour,
            },
        });
    });
};

// Update tour
exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'Success',
        message: 'Updated successfully',
    });
};

// Delete tour
exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'Success',
        data: null,
        message: 'Successfully Deleted',
    });
};
