if (process.argv.length < 3) {
    console.log('usage: node 5.js [filename]')
    process.exit(1)
}

const filename = process.argv[2]
const fs = require('fs')

const polarity = u => (u === u.toLowerCase() ? 1 : 2)
const polaritiesMatch = (a, b) => (polarity(a) + polarity(b)) % 2 === 0
const sameUnit = (a, b) => a.toLowerCase() === b.toLowerCase()
const unitsHostile = (a, b) => sameUnit(a, b) && !polaritiesMatch(a, b)

const parsePolymer = (head, [u1, u2, ...tail]) => {
    console.log('considering:', u1, u2)
    if (unitsHostile(u1, u2)) {
        console.log('DELETING:', u1, u2)
        const newU1 = head.length > 0 ? head[head.length - 1] : null
        const newHead = head.length > 0 ? head.splice(0, head.length - 1) : []
        const newTail = newU1 == null ? tail : [newU1, ...tail]

        return newTail.length > 1
            ? parsePolymer(newHead, newTail)
            : [...newHead, ...newTail]
    }

    return tail.length > 0
        ? parsePolymer([...head, u1], [u2, ...tail])
        : [...head, u1, u2]
}

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) {
        console.error(err)
        process.exit(9)
    }

    const inputPolymer = data.trim().split('')
    const finalPolymer = parsePolymer([], inputPolymer)

    console.log(finalPolymer.join(''))
    console.log(finalPolymer.length)
})
