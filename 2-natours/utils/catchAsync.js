function catchAsync(clbk) {
    return (req, res, next) => {
        clbk(req, res, next).catch(next);
    };
}

module.exports = catchAsync;
