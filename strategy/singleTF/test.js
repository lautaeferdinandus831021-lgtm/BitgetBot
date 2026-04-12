module.exports = {
    name: 'test',

    run(price) {
        if (price % 2 === 0) return 'BUY';
        if (price % 3 === 0) return 'SELL';
        return null;
    }
};
