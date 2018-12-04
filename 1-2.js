if (process.argv.length < 3) {
    console.log('usage: node 1-2.js [filename]')
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
    const changes = data.split('\n').map(d => parseInt(d.trim()))

    let result = null
    let frequency = 0
    while (result == null) {
        const foundResult = changes.some(value => {
            frequency += value
            frequencyMap[frequency] = (frequencyMap[frequency] || 0) + 1
            return frequencyMap[frequency] > 1
        })

        if (foundResult) result = frequency
    }

    console.log(result)
})
