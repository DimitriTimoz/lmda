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

module.exports = {
    trimMatchesFromEnd,
    countOccurrences
}
