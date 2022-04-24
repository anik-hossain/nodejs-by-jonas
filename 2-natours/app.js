/**
 * Dependencies
 */
const express = require('express');
const fs = require('fs');

/**
 * Create Application
 */
const app = express();
app.use(express.json());

const file = `${__dirname}/dev-data/data/tours-simple.json`;

const tours = JSON.parse(fs.readFileSync(file));

// Get all tours
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'Success',
        result: tours.length,
        data: {
            tours,
        },
    });
});

// Get tour by id
app.get('/api/v1/tours/:id', (req, res) => {
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
});

// Create new tour
app.post('/api/v1/tours', (req, res) => {
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
});

//Update tour
app.patch('/api/v1/tours/:id', (req, res) => {
    if (parseInt(req.params.id) > tours.length) {
        res.status(404).json({
            status: 'Invalid id',
        });
        return;
    }
    res.status(200).json({
        status: 'Success',
        message: 'Updated successfully',
    });
});

//Delete tour
app.delete('/api/v1/tours/:id', (req, res) => {
    if (parseInt(req.params.id) > tours.length) {
        res.status(404).json({
            status: 'Invalid id',
        });
        return;
    }
    res.status(204).json({
        status: 'Success',
        data: null,
        message: 'Successfully Deleted',
    });
});

const port = 4000;

app.listen(port || port++, () => {
    console.log(`App is running on port ${port}`);
});
