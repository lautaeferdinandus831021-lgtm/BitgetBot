let current = null;

module.exports = {
    open: (pos) => current = pos,
    close: () => current = null,
    get: () => current
};
