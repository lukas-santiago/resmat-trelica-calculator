class Point {
    constructor(x, y, intersectionGroup) {
        this._x = x
        this._y = y
        this._intersectionGroup = intersectionGroup
        this._isUsed = false
        this.drawSelf()
        return this
    }
    get x() { return this._x }
    get y() { return this._y }
    get isUsed() { return this._isUsed }

    drawSelf() { 
        this.circle = two.makeCircle(this._x, this._y, 6)
        this.id = this.circle.id
        this._intersectionGroup.add(this.circle)
        return this.circle
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
        this.fromPoint = fromPoint
        this.toPoint = toPoint

        let from = two.scene.getById(fromPoint.id)
        let to = two.scene.getById(toPoint.id)

        var line = two.makeLine(from.position.x, from.position.y, to.position.x, to.position.y)

        line.fill = 'rgb(0, 200, 255)'
        line.opacity = 0.75
        line.linewidth = 10

        barsGroup.add(line)
        two.update()

        return line
    }
}

export { Point, FixedSupport, MobileSupport, Grid, Bar }