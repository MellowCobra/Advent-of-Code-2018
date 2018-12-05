if (process.argv.length < 3) {
    console.log('usage: node 4.js [filename]')
    process.exit(1)
}

const filename = process.argv[2]
const fs = require('fs')

const makeShift = events =>
    events.reduce(
        (acc, e) => {
            while (acc.currentMin < e.min) {
                acc.shift[acc.currentMin] = acc.asleep
                acc.currentMin++
            }
            acc.asleep = e.msg === 'falls asleep' ? 1 : 0
            return acc
        },
        { currentMin: 0, shift: {}, asleep: 0 }
    ).shift

const findMostSleptMinute = arr =>
    arr.reduce(
        (max, value, i) => (max.value > value ? max : { minute: i, value }),
        { minute: 0, value: 0 }
    )

const daysInMonth = m => [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m] // 1518 is not a leap year

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) {
        console.error(err)
        process.exit(9)
    }

    // Read in lines as events
    const events = data
        .split('\n')
        .map(s => {
            let event
            s.replace(
                /\[(\w+)\-(\w+)\-(\w+) (\w+):(\w+)\] (.+)/g,
                (_, y, m, d, h, min, msg) =>
                    (event = {
                        date: new Date(`${+y}-${+m}-${+d} ${+h}:${+min}`),
                        year: +y,
                        month: +m,
                        day: +d,
                        hour: +h,
                        min: +min,
                        msg,
                    })
            )
            return event
        })
        .sort((a, b) => a.date.getTime() - b.date.getTime()) // Sort by time

    // Group events into shifts by guard and date
    const shifts = events.reduce((acc, event) => {
        if (event.msg === 'falls asleep' || event.msg === 'wakes up') {
            acc[`${event.month}-${event.day}`].events.push(event)
        } else {
            let guardId
            event.msg.replace(/Guard #(\w+)/g, (_, id) => (guardId = id))

            // Stupid shift changes straddling a month change...
            const [month, newMonth] =
                event.hour === 23 && event.day === daysInMonth(event.month - 1)
                    ? [event.month + 1, true]
                    : [event.month, false]
            const day = newMonth
                ? 1
                : event.hour === 0
                ? event.day
                : event.day + 1

            acc[`${month}-${day}`] = {
                date: new Date(event.year, month - 1, day),
                month,
                day: day,
                guardId,
                events: [],
            }
        }
        return acc
    }, {})

    // For each guard, make an array of their shifts,
    //  and each shift a map with the minutes 00-59 as keys
    //  and values of 0 as awake or 1 as asleep
    const guards = Object.values(shifts).reduce((acc, shift) => {
        const prevShifts = acc[shift.guardId] || [...new Array(60)].map(_ => 0)
        const currentShift = Object.values(makeShift(shift.events))

        acc[shift.guardId] = prevShifts.map((value, i) => {
            return (currentShift[i] || 0) + value
        })

        return acc
    }, {})

    // Sum the minutes each guard has spent asleep
    //  and find the guard with the greatest sum
    const sleepiestGuard = Object.entries(guards)
        .map(([id, values]) => {
            return {
                id,
                value: values.reduce((sum, v) => sum + v),
            }
        })
        .reduce((max, current) => (max.value > current.value ? max : current), {
            value: 0,
            id: null,
        }).id

    // For the sleepiestGuard, find the hour with the largest value
    const bestMinute = findMostSleptMinute(guards[sleepiestGuard]).minute

    console.log(parseInt(sleepiestGuard) * bestMinute) // Part one answer

    const { gid, minute } = Object.entries(guards)
        .map(([gid, values]) => {
            const { minute, value } = findMostSleptMinute(values)
            return {
                gid,
                minute,
                value,
            }
        })
        .reduce((max, curr) => (max.value > curr.value ? max : curr), {
            gid: null,
            minute: 0,
        })

    console.log(parseInt(gid) * minute) // Part two answer
})
