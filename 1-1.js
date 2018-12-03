if (process.argv.length < 3) {
    console.log('usage: node 1-1.js [filename]')
    process.exit(1)
}

const filename = process.argv[2]
const fs = require('fs')

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) {
        console.error(err)
        process.exit(9)
    }

    const result = data // '+1, -1, +2'
        .split('\n') // ['+1', ' -1', ' +2']
        .map(d => {
            d = d.trim()
            return { sign: d[0], value: parseInt(d.substring(1)) }
        }) // [{sign: '+', value: 1}, {sign: '-', value: 1}, {sign: '+', value: 2}]
        .reduce((res, { sign, value }) => {
            if (sign === '+') return res + value
            else if (sign === '-') return res - value
            else {
                console.error(`Error in input: unexpected token ${sign}`)
            }
        }, 0)

    console.log(result)
})
