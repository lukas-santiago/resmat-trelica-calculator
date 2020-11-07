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

        this.svgPoint = null
        this.svg = null
        this.objectsIn = {
            bars: [],
            support: [],
            forces: [],
        }
        this.used = false
        this.disabled = false
        this.letra = null

        this.drawSelf()
        this.setSvgPoint()

        Point.all.push(this)
        return this
    }

    setSvgPoint() {
        this.svgPoint = document.getElementsByTagName('svg')[0].createSVGPoint()
        this.svgPoint.x = this.x
        this.svgPoint.y = this.y
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

    disablePoint() {
        if (this.used !== true) {
            // this.circle.fill = color
            this.circle.remove()
            this.disabled = true
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
                string += `(${p.used === true ? p.letra : ' '}) `
            )
            string += '\n'
        }
        return string

    }

    static possiblePointsInPath(from, to, returnArray = []) {
        if (from.column != to.column || from.row != to.row) {
            console.log(`(${from.row}, ${from.column}) (${to.row}, ${to.column})`);

            let point = Point.get(from.row, from.column)

            let svgPoint = document.getElementsByTagName('svg')[0].createSVGPoint();
            svgPoint.x = point.x;
            svgPoint.y = point.y;
            returnArray.push(svgPoint)

            // Bar.all[0].line._renderer.elem.isPointInStroke(svgPoint);

            // //TODO verificar se a barra está no real lugar
            // point.disablePoint()

            Point.possiblePointsInPath(Point.pickOne(from, to), to, returnArray)
        }
        // returnArray.shift()
        return returnArray
    }
    static pickOne(from, to) {
        let p = {}
        if (from.column != to.column) {
            if (from.column < to.column) {
                p.column = from.column + 1
            }
            else {
                p.column = from.column - 1
            }
        }
        else {
            p.column = to.column
        }
        if (from.row != to.row) {
            if (from.row < to.row) {
                p.row = from.row + 1
            }
            else {
                p.row = from.row - 1
            }
        }
        else {
            p.row = to.row
        }
        return p
    }

    static get(row, column) { return Point.all.find(p => p.row == row && p.column == column) }
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

        this.usePoints(from, to)
        from.objectsIn.bars.push(this)
        to.objectsIn.bars.push(this)

        //TODO possiblePointsInPath
        // let pointsThatCanBeInPath = Point.possiblePointsInPath(this._from, this._to)

        this.drawSelf()
        this.setBarSVG()


        // console.log(pointsThatCanBeInPath);
        // pointsThatCanBeInPath.shift()
        let pointsInPath = Point.all.filter(p => this.svg.isPointInStroke(p.svgPoint))

        console.log(pointsInPath);
        pointsInPath.forEach(p => p.disablePoint())




        Bar.all.push(this)



        return this
    }

    setBarSVG() {
        two.update()
        let bar = this
        let barRenderEvent = function () {
            bar.svg = bar.line._renderer.elem
        }

        two.bind('render', barRenderEvent)
        two.render()
        two.unbind('render', barRenderEvent)
    }

    usePoints(from, to) {
        from.usePoint('red', true, true)
        to.usePoint('red', true, true)
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


    get angle() {
        let diffRow = (this._to.row - this._from.row) * -1
        let diffCol = (this._to.column - this._from.column)

        let main = ((Math.asin(diffRow / Math.hypot(diffRow, diffCol)) * 180 / Math.PI)).toFixed(2)
        if (diffRow >= 0 && diffCol >= 0) {
            //console.log('primeiro quadrante');
            return main
        } else if (diffRow >= 0 && diffCol < 0) {
            //console.log('segundo quadrante');
            return (90 - main) + 90
        } else if (diffRow < 0 && diffCol <= 0) {
            //console.log('terceiro quadrante');
            return (90 - main) + 90
        } else {
            //console.log('quarto quadrante');
            return (90 - main) + 180
        }
    }
}

class FixedSupport {
    constructor(point) {
        //* Parameter Validation
        if (!point instanceof Point) {
            throw new Error('Construtor inválido')
        }

        //* Variables declaration
        this.point = point
        this.drawSelf()

        //* Static Variables declaration
        FixedSupport.fixedSupport = this
        return this
    }
    drawSelf() {
        this.fixedSupportGroup = supportsGroup.add(two.makeGroup())

        this.graphics = {
            path: null
        }
        let px = this.point.x, py = this.point.y

        this.graphics.path = two.makePath(px, py, px + 15, py + 15, px - 15, py + 15, false)
        this.graphics.path.fill = '#CCC'
        this.graphics.lines = []
        for (let x = px; x <= px + 30; x += 3) {
            let line = two.makeLine(x - 15, py + 15, x - 18, py + 23)
            this.fixedSupportGroup.add(line)
            this.graphics.lines.push(line)
        }
        this.fixedSupportGroup.add(this.graphics.path)
        two.update()
    }
    moveTo(point) {
        //! QUEBRADO
        if (!point instanceof Point) {
            throw new Error('Parâmetro inválido')
        }
        FixedSupport.fixedSupport.graphics.path.translation.set(point.x, point.y)
        FixedSupport.fixedSupport.graphics.lines.forEach(line => {
            line.translation.set(point.x, point.y)
        });
        two.update()
    }
    static fixedSupport = null
}

class MobileSupport {
    constructor(point) {
        if (!point instanceof Point) {
            throw new Error('Construtor inválido')
        }
        this.point = point
        this.drawSelf()

        MobileSupport.mobileSupport = this
        return this
    }
    drawSelf() {
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

    static mobileSupport = null
}

class Verifier {
    constructor() {
        if (Point.all.filter(p => p.used).length
            == Point.all.filter(p => p.objectsIn.bars.length > 1).length)
            console.log('Todas as barras estão conectadas')
        else
            console.log('Há barras desconectadas');

    }
    static getValuesToMath() {

    }
}

export { Point, Grid, Ruler, Bar, FixedSupport, MobileSupport, Verifier }  