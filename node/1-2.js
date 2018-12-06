module.exports = function(data) {
    const frequencyMap = {}
    const changes = data.map(d => parseInt(d.trim()))

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

    return result
}
