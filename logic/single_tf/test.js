module.exports = {
    analyze: (price) => {
        if (price > 50000) {
            return { signal: "BUY" };
        }
        return null;
    }
};
