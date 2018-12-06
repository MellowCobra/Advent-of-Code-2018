function findMatches([first, ...rest]) {
    return compareStrings(first, rest) || findMatches(rest)
}

function compareStrings(subject, others) {
    // Return false if no result, or the two strings which are off by only one character
    return others.reduce((foundMatch, cmp) => {
        if (foundMatch != false) return foundMatch
        if (deleteDifferingChars(subject, cmp).length === subject.length - 1)
            return [subject, cmp]
        return false
    }, false)
}

function deleteDifferingChars(a, b) {
    return a.split('').reduce((string, char, i) => {
        return string + (char === b[i] ? char : '')
    }, '')
}

module.exports = function(data) {
    return deleteDifferingChars(...findMatches(data))
}
