module.exports = {
    name: "test",
    analyze: (price) => {
        if (price > 50000) {
            return { name: "test", signal: "BUY" };
        }
        return null;
    }
};
