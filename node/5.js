const polarity = u => (u === u.toLowerCase() ? 1 : 2)
const polaritiesMatch = (a, b) => (polarity(a) + polarity(b)) % 2 === 0
const sameUnit = (a, b) => a.toLowerCase() === b.toLowerCase()
const unitsHostile = (a, b) => sameUnit(a, b) && !polaritiesMatch(a, b)

const reactPolymer = polymer => {
    let done = true
    polymer = polymer || []
    do {
        if (polymer.length < 2) return polymer
        const tempString = []
        done = true
        for (let i = 0; i < polymer.length - 1; i++) {
            const u1 = polymer[i]
            const u2 = polymer[i + 1]
            if (unitsHostile(u1, u2)) {
                done = false
                i++
                if (i === polymer.length - 2) tempString.push(polymer[i + 1])
            } else {
                tempString.push(u1)
                if (i === polymer.length - 2) tempString.push(u2)
            }
        }
        polymer = tempString
    } while (!done)

    return polymer
}

const cleanPolymer = polymer => {
    const bestChoice = Object.keys(
        polymer.reduce((uniq, c) => {
            uniq[c.toLowerCase()] = true
            return uniq
        }, {})
    ).reduce(
        (best, char) => {
            const length = reactPolymer(
                polymer
                    .join('')
                    .replace(new RegExp(char, 'gi'), '')
                    .split('')
            ).length

            if (best.length == null || length <= best.length) {
                return { char, length }
            }

            return best
        },
        { char: null, length: null }
    )

    return polymer.join('').replace(new RegExp(bestChoice.char, 'gi'), '')
}

module.exports = function([data]) {
    return [
        reactPolymer(data.trim().split('')).length,
        reactPolymer(cleanPolymer(data.trim().split(''))).length,
    ]
}
