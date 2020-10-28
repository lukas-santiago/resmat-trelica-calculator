class Point {
    static all = []

    constructor(column, row) {
        if (!window.intersectionGroup instanceof Two.Group
            && !window.textGroup instanceof Two.Group) {
            throw new Error('classe inválida')
        }

        this.column = column
        this.row = row
        Point.all.push(this)
        return this
    }

    get x() {
        return (two.width / Grid.columns) * this.row
    }
    get y() {
        return (two.height / Grid.rows) * this.row
    }

}

class Grid {
    static columns
    static rows
    static rulerGroup
    static gridLinesGroup

    get() { return this }

    constructor(columns, rows) {
        Grid.columns = columns
        Grid.rows = rows

        this.drawSelf()
    }

    drawSelf() {
        Grid.rulerGroup = two.makeGroup()
        gridGroup.add(Grid.rulerGroup)
        this.drawRuler()

        Grid.gridLinesGroup = two.makeGroup()
        gridGroup.add(Grid.gridLinesGroup)
        this.drawGrid()
    }

    drawRuler() {
        Grid.rulerGroup.add(two.makeLine(0, -30, two.width, -30))

        for (let x = 0, col = 0; x <= two.width + 1; x += two.width / Grid.columns, col++) {
            Grid.rulerGroup.add(two.makeLine(x, -25, x, -35))

            let textX = two.makeText(col.toString(), x, -45)
            textX.classList.push('ruler-text')
            Grid.rulerGroup.add(textX)
        }

        Grid.rulerGroup.add(two.makeLine(two.width + 30, 0, two.width + 30, two.height))

        for (let y = 0, row = Grid.rows; y <= two.height + 1; y += two.height / Grid.rows, row--) {
            Grid.rulerGroup.add(two.makeLine(two.width + 25, y, two.width + 35, y))

            let textX = two.makeText(row.toString(), two.width + 45, y)
            textX.classList.push('ruler-text')
            Grid.rulerGroup.add(textX)
        }
    }

    drawGrid() {
        for (let x = 0; x <= two.width + 1; x += two.width / Grid.columns) {
            Grid.gridLinesGroup.add(two.makeLine(x, 0, x, two.height))
        }
        for (let y = 0; y <= two.height + 1; y += two.height / Grid.rows) {
            Grid.gridLinesGroup.add(two.makeLine(0, y, two.width, y))
        }
    }

}

export { Point, Grid }