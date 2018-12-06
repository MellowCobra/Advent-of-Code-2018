module.exports = function(data) {
    const { twice, thrice } = data.reduce(
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

    return twice * thrice
}
