import Two from '../plugins/two.module.js'

class Point {
    constructor(x, y, intersectionGroup, textGroup) {
        this._x = x
        this._y = y
        this._intersectionGroup = intersectionGroup
        this._textGroup = textGroup
        this._isUsed = false
        this.drawSelf()

        Point.quantity++
        return this
    }
    get x() { return this._x }
    get y() { return this._y }
    get isUsed() { return this._isUsed }

    static quantity = 0
    static usedQuantity = 0

    drawSelf() {
        this.circle = two.makeCircle(this._x, this._y, 6)
        this.id = this.circle.id
        this._intersectionGroup.add(this.circle)
        this.svg = this.circle._renderer.elem
        return this.circle
    }

    usePoint() {
        if (!this._isUsed) {
            this._isUsed = true
            this.drawText()

            this.circle.fill = 'red'

            two.update()
        }
    }

    drawText() {
        this._tag = 'a'

        for (let i = 0; i < Point.usedQuantity; i++) {
            this._tag = ((parseInt(this._tag, 36) + 1).toString(36)).replace(/0/g, 'a')
        }

        Point.usedQuantity++

        this.text = two.makeText(this._tag.toLocaleUpperCase(), this.x - 15, this.y - 12)
        this.text.classList.push('svg-text')
        this._textGroup.add(this.text)
    }
}

class FixedSupport {
    constructor(point, two, supportsGroup) {
        if (point instanceof Point && two instanceof Two) {
            this.point = point
            this.drawSelf(two, supportsGroup)
        }
    }
    drawSelf(two, supportsGroup) {
        this.fixedSupport = supportsGroup.add(two.makeGroup())
        let px = this.point.x
        let py = this.point.y

        let path1 = two.makePath(px, py, px + 15, py + 15, px - 15, py + 15, false)
        path1.fill = '#CCC'

        for (let x = px; x <= px + 30; x += 3) {
            let line = two.makeLine(x - 15, py + 15, x - 18, py + 23)
            this.fixedSupport.add(line)
        }
        this.fixedSupport.add(path1)
        two.update()
    }
    moveTo(point) {
        
    }
}

class MobileSupport {
    constructor(point, two, supportsGroup) {
        if (point instanceof Point && two instanceof Two) {
            this.point = point
            this.drawSelf(two, supportsGroup)
        }
    }
    drawSelf(two, supportsGroup) {
        this.mobileSupport = supportsGroup.add(two.makeGroup())
        let px = this.point.x
        let py = this.point.y

        let path1 = two.makePath(px, py, px + 15, py + 15, px - 15, py + 15, false)
        path1.fill = '#CCC'

        let circle1 = two.makeCircle(px - 9, py + 19, 4)
        circle1.fill = '#CCC'

        let circle2 = two.makeCircle(px + 9, py + 19, 4)
        circle2.fill = '#CCC'

        this.mobileSupport.add(path1)
        this.mobileSupport.add(circle1)
        this.mobileSupport.add(circle2)
        two.update()
    }
}

class Grid {
    constructor(two, gridGroup, intersectionGroup, columns, lines) {
        this.two = two
        this.gridGroup = gridGroup
        this.intersectionGroup = intersectionGroup
        this.columns = columns
        this.lines = lines
        this.draw(two, gridGroup, intersectionGroup)
        two.update()
    }
    draw(two, gridGroup, intersectionGroup) {
        this.rulerGroup = two.makeGroup()
        this.gridLinesGroup = two.makeGroup()
        gridGroup.add(this.rulerGroup)
        gridGroup.add(this.gridLinesGroup)

        this.drawGrid(two, intersectionGroup)


        this.drawRuller(two)
    }
    drawRuller(two) {
        this.rulerGroup.add(two.makeLine(0, -30, two.width, -30))

        for (let x = 0; x <= two.width; x += two.width / this.columns) {
            this.rulerGroup.add(two.makeLine(x, -25, x, -35))
        }

        this.rulerGroup.add(two.makeLine(two.width + 30, 0, two.width + 30, two.height))

        for (let y = 0; y <= two.height; y += two.height / this.lines) {
            this.rulerGroup.add(two.makeLine(two.width + 25, y, two.width + 35, y))
        }

    }

    drawGrid(two, intersectionGroup) {
        for (let x = 0; x <= two.width; x += two.width / this.columns) {
            this.gridLinesGroup.add(two.makeLine(x, 0, x, two.height))
        }
        for (let y = 0; y <= two.height; y += two.height / this.lines) {
            this.gridLinesGroup.add(two.makeLine(0, y, two.width, y))
        }
    }

    destroy() {
        this.two.remove(this.gridGroup.children)
        this.two.remove(this.intersectionGroup.children)
    }
    reDraw() {
        this.destroy()
        this.drawGrid(this.two, this.gridGroup, this.intersectionGroup)
    }
}

class Bar {
    constructor(two, barsGroup, fromPoint, toPoint) {
        if (!fromPoint instanceof Point && !toPoint instanceof Point)
            throw new error('Cannot Create Bar')

        this.fromPoint = fromPoint
        this.toPoint = toPoint
        this.drawBar(two, barsGroup)
        two.update()

        this.fromPoint.usePoint()
        this.toPoint.usePoint()

        return this
    }

    drawBar(two, barsGroup) {
        let from = this.fromPoint.circle.position
        let to = this.toPoint.circle.position

        this.line = two.makeLine(from.x, from.y, to.x, to.y)
        this.line.stroke = '#333333EE'
        // this.line.opacity = 0.75
        this.line.linewidth = 10

        barsGroup.add(this.line)
    }
}

export { Point, FixedSupport, MobileSupport, Grid, Bar }