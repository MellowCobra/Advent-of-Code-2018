if (process.argv.length < 3) {
    console.log('usage: node 2-1.js [filename]')
    process.exit(1)
}

const filename = process.argv[2]
const fs = require('fs')

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) {
        console.error(err)
        process.exit(9)
    }

    const { twice, thrice } = data.split('\n').reduce(
        (n, src) => {
            const { hasTwo, hasThree } = Object.values(
                src.split('').reduce((counts, char) => {
                    counts[char] = (counts[char] || 0) + 1
                    return counts
                }, {})
            ).reduce(
                (acc, count) => {
                    if (count === 2) acc.hasTwo = true
                    if (count === 3) acc.hasThree = true
                    return acc
                },
                { hasTwo: false, hasThree: false }
            )

            n.twice = n.twice + (hasTwo ? 1 : 0)
            n.thrice = n.thrice + (hasThree ? 1 : 0)

            return n
        },
        { twice: 0, thrice: 0 }
    )

    const result = twice * thrice
    console.log(result)
})
