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

    console.log(
        data.split('\n').reduce((res, value) => {
            return res + parseInt(value)
        }, 0)
    )
})
