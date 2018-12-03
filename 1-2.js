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

    const frequencyMap = {}
    const changes = data // '+1, -1, +2'
        .split('\n') // ['+1', ' -1', ' +2']
        .map(d => {
            d = d.trim()
            return { sign: d[0], value: parseInt(d.substring(1)) }
        }) // [{sign: '+', value: 1}, {sign: '-', value: 1}, {sign: '+', value: 2}]

    let result = null
    let frequency = 0
    while (result == null) {
        const foundResult = changes.some(({ sign, value }) => {
            if (sign === '+') frequency += value
            else if (sign === '-') frequency -= value
            else {
                console.error(`Error in input: unexpected token ${sign}`)
                process.exit(9)
            }

            // Save the current frequency in a map
            frequencyMap[frequency] = (frequencyMap[frequency] || 0) + 1

            // If we have seen this frequency before, short circuit
            return frequencyMap[frequency] > 1
        })

        if (foundResult) result = frequency
    }

    console.log(result)
})
