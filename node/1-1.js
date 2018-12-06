module.exports = function(data) {
    return data.reduce((sum, val) => sum + parseInt(val), 0)
}
