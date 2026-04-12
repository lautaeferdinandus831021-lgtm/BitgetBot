let win = 0;
let loss = 0;

module.exports = {
    win: () => win++,
    loss: () => loss++,
    get: () => ({
        winrate: win + loss === 0 ? 0 : win / (win + loss),
        win,
        loss
    })
};
