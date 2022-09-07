const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review cant not be empty!'],
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        tour: {
            type: mongoose.Types.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to Tour'],
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to User'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tour',
        select: 'name',
    }).populate({
        path: 'user',
        select: 'name photo',
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
