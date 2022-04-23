/**
 * Dependencies
 */
const express = require('express');
const fs = require('fs');

/**
 * Create Application
 */
const app = express();

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours.json`)
);

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'Success',
        result: tours.length,
        data: {
            tours,
        },
    });
});

const port = 4000;

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
