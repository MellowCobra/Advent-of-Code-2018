if (process.argv.length < 3) {
    console.log('usage: node 3.js [filename]')
    process.exit(1)
}

const filename = process.argv[2]
const fs = require('fs')

const range = (s, e) => [...Array(e - s).keys()].map(i => i + s)

const findBestClaim = ([first, ...rest], occ) =>
    checkClaim(first, occ) || (rest && findBestClaim(rest, occ))

const checkClaim = ({ id, x, y, w, h }, occupied) => {
    for (i of range(x, x + w))
        for (j of range(y, y + h)) if (occupied[`${i}-${j}`] > 1) return false
    return id
}

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) {
        console.error(err)
        process.exit(9)
    }

    const claims = data.split('\n').map(s => {
        let square
        s.replace(
            /#(\w+) @ (\w+),(\w+): (\w+)x(\w+)/g,
            (_, id, x, y, w, h) => (square = { id, x: +x, y: +y, w: +w, h: +h })
        )
        return square
    })

    const occupied = claims.reduce((map, { x, y, w, h }) => {
        for (i of range(x, x + w))
            for (j of range(y, y + h))
                map[`${i}-${j}`] = (map[`${i}-${j}`] || 0) + 1
        return map
    }, {})

    const overclaimedInches = Object.values(occupied).reduce(
        (s, v) => (s += v > 1 ? 1 : 0),
        0
    )

    console.log('number of overclaimed inches:', overclaimedInches)
    console.log('the best claim is #:', findBestClaim(claims, occupied))
})
