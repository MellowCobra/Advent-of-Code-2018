const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
const findNearestCoord = (p, coords) =>
    coords.reduce((nearest, { id, x, y }) => {
        const d = distance(p, { x, y })
        return nearest && nearest.d < d
            ? nearest
            : { id, x, y, d, tie: nearest && nearest.d === d }
    }, null)

const findTotalDistance = (p, coords) =>
    coords.reduce((sum, c) => sum + distance(p, c), 0)

const range = (s, e) => [...Array(e - s).keys()].map(i => i + s)
const touchesEdge = ({ x, y }, max) =>
    x == 0 || y == 0 || x >= max - 1 || y >= max - 1

module.exports = function(data) {
    const coords = data
        .map(d => d.split(', '))
        .map(([x, y]) => {
            return { x: parseInt(x), y: parseInt(y), id: `${x}-${y}` }
        })

    const max = coords.reduce((max, { x, y }) => Math.max(max, x, y), 0)

    const world = []
    for (let x in range(0, max + 1)) {
        for (let y in range(0, max + 1)) {
            world.push({
                x,
                y,
                nc: findNearestCoord({ x, y }, coords),
                td: findTotalDistance({ x, y }, coords),
            })
        }
    }

    const largestArea = Object.values(
        world.reduce((acc, { x, y, nc }) => {
            if (nc.tie) return acc // Skip those equidistance from two coords

            acc[nc.id] = Array.from(acc[nc.id] || []).concat({ x, y })
            return acc
        }, {})
    )
        .filter(points => points.every(p => !touchesEdge(p, max, max)))
        .reduce((max, points) => (max > points.length ? max : points.length), 0)

    const safeRegion = world.filter(p => p.td < 10000)

    return [largestArea, safeRegion.length]
}
