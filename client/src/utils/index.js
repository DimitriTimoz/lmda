function trimMatchesFromEnd(inputString, pattern) {
    const regex = new RegExp(`${pattern}+$`);
    return inputString.replace(regex, '');
}

function countOccurrences(mainString, subString) {
    // Use a regular expression with the global flag to match all occurrences
    const regex = new RegExp(subString, 'g');
    const matches = mainString.match(regex);

    // Check if matches is not null, and return the count
    return matches ? matches.length : 0;
}

function toState(state) {
    switch (state) {
        case 1: 
            return 'neuf';
        case 2:
            return 'très bon';
        case 3:
            return 'bon';
        case 4:
            return 'correct';
        case 5:
            return 'mauvais';
        case 6:
            return 'très mauvais';
        default:
            return 'inconnu';
    }
}

module.exports = {
    trimMatchesFromEnd,
    countOccurrences,
    toState,
}
