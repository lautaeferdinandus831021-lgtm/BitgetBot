let balance = 1000;

module.exports = {
    get: () => balance,
    update: (val) => balance += val
};
