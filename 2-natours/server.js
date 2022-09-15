const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION 🔥 Shutting down...');
    process.exit(1);
});

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Database connected successfully'));

const app = require('./app');

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`App is running on port ${port}`);
    console.log(`http://localhost:${port}`.green);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION 🔥 Shutting down...');
    server.close(() => {
        process.exit(1);
    });
});
