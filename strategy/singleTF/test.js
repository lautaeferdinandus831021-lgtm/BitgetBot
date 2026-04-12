module.exports = {
    name: 'test',

    run(price) {
        if (Math.floor(price) % 2 === 0) return 'BUY';
        if (Math.floor(price) % 3 === 0) return 'SELL';
        return null;
    }
};
