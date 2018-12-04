if (process.argv.length < 3) {
    console.log('usage: node 2-2.js [filename]')
    process.exit(1)
}

const filename = process.argv[2]
const fs = require('fs')

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

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) {
        console.error(err)
        process.exit(9)
    }
    console.log(deleteDifferingChars(...findMatches(data.split('\n'))))
})
