function detectTF(strategyType, data) {
    switch (strategyType) {
        case 'single_tf':
            return [data.m1];

        case 'dual_tf':
            return [data.m1, data.m5];

        case 'multi_tf':
            return [data.m1, data.m5, data.m15];

        default:
            return [];
    }
}

module.exports = { detectTF };
