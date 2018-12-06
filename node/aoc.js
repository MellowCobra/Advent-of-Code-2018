if (process.argv.length < 4) {
    console.log('usage: node aoc.js [day] [filename]')
    process.exit(1)
}

const day = process.argv[2]
const filename = process.argv[3]
const fs = require('fs')
const solution = require(`${__dirname}/${day}.js`)

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) {
        console.error(err)
        process.exit(9)
    }

    console.log(solution(data.split('\n')))
})
