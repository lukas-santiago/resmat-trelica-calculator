class Point {
    static all = []
    static rendered = false
    get x() { return (two.width / Grid.columns) * (this.column - 1) }
    get y() { return (two.height / Grid.rows) * (this.row - 1) }

    constructor(column, row) {
        if (!window.pointGroup instanceof Two.Group
            && !window.textGroup instanceof Two.Group)
            throw new Error('classe inválida')

        this.column = column
        this.row = row

        this.svg = null
        this.used = false

        this.drawSelf()

        Point.all.push(this)
        return this
    }

    drawSelf() {
        this.circle = two.makeCircle(this.x, this.y, 8)
        this.id = this.circle.id
        window.pointGroup.add(this.circle)
        return this.circle
    }

    usePoint(color, text, used) {
        if (this.used !== true) {
            this.circle.fill = color
            text ? this.drawText() : false
            this.used = used
            two.update()
        }
    }

    drawText() {
        //* Pula uma letra a frente baseado em quanto pontos existem
        let tag = 'a'
        let usedQuantity = Point.all.filter(p => p.used === true).length
        for (let i = 0; i < usedQuantity; i++) {
            tag = ((parseInt(tag, 36) + 1).toString(36)).replace(/0/g, 'a')
        }
        this.letra = tag.toLocaleUpperCase()
        this.text = two.makeText(this.letra, this.x - 15, this.y - 12)
        this.text.classList.push('svg-text')
        textGroup.add(this.text)
    }

    static allToString() {
        let string = ''
        for (let row = 1; row <= Grid.rows + 1; row++) {
            let inThisRow = Point.all.filter(p => p.row == row)
            inThisRow.forEach(p =>
                string += `(${p.used === true ? 'T' : 'F'}) `
            )
            string += '\n'
        }
        return string

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
        Grid.gridLinesGroup = two.makeGroup()
        Grid.gridLinesGroup.className = 'grid-group'
        gridGroup.add(Grid.gridLinesGroup)
        this.drawGrid()
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

class Ruler {
    static topRulerGroup
    static sideRulerGroup
    static widthDistance
    static heightDistance

    constructor(widthDistance, heightDistance) {
        Ruler.widthDistance = widthDistance
        Ruler.heightDistance = heightDistance
        this.drawSelf()
        return this
    }


    drawSelf() {
        this.drawTopRuler()
        this.drawSideRuler()
    }

    drawSideRuler() {
        Ruler.sideRulerGroup = two.makeGroup()
        rulerGroup.add(Ruler.sideRulerGroup)

        Ruler.sideRulerGroup.add(two.makeLine(two.width + 30, 0, two.width + 30, two.height))

        for (let y = 0, row = Grid.rows; y <= two.height + 1; y += two.height / Grid.rows, row--) {
            Ruler.sideRulerGroup.add(two.makeLine(two.width + 25, y, two.width + 35, y))

            let textValue = ((Ruler.heightDistance / Grid.rows) * row).toFixed(2).replace(/([.,]00)|([.,]\d0)$/, "")
            let textX = two.makeText(textValue == 'Infinity' ? '0' : textValue, two.width + 45, y)
            textX.classList.push('ruler-text')
            Ruler.sideRulerGroup.add(textX)
        }
    }

    drawTopRuler() {
        Ruler.topRulerGroup = two.makeGroup()
        rulerGroup.add(Ruler.topRulerGroup)

        Ruler.topRulerGroup.add(two.makeLine(0, -30, two.width, -30))

        for (let x = 0, col = 0; x <= two.width + 1; x += two.width / Grid.columns, col++) {
            Ruler.topRulerGroup.add(two.makeLine(x, -25, x, -35))

            let textValue = ((Ruler.widthDistance / Grid.columns) * col).toFixed(2).replace(/([.,]00)|([.,]\d0)$/, "")
            let textX = two.makeText(textValue == 'Infinity' ? '0' : textValue, x, -45)
            textX.classList.push('ruler-text')
            Ruler.topRulerGroup.add(textX)
        }
    }
}

class Bar {
    static all = []
    get from() { return this._from }
    get to() { return this._to }

    constructor(from, to) {
        if (!from instanceof Point && !to instanceof Point)
            throw new error('Cannot Create Bar')

        this._from = from
        this._to = to

        //TODO UsePoints
        from.usePoint('red', true, true)
        to.usePoint('red', true, true)
        //TODO trackPointsInPath
        this.trackPointsInPath()
        this.drawSelf()
        two.update()

        Bar.all.push(this)
        return this
    }

    drawSelf() {
        let from = this.from.circle.position
        let to = this.to.circle.position

        this.line = two.makeLine(from.x, from.y, to.x, to.y)
        this.line.stroke = '#333333EE'
        // this.line.opacity = 0.75
        this.line.linewidth = 10

        barsGroup.add(this.line)
    }

    trackPointsInPath() {
        let from = this.from.circle.position
        let to = this.to.circle.position


    }
}

export { Point, Grid, Ruler, Bar }