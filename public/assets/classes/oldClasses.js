import Two from '../plugins/two.module.js'
// ! descobrir os pontos embaixo das barras por posição
// ! nesses pontos, pintar de amarelo
// ! implementar a descoberta do seno e cosseno das barras direto na classe
class Point {
    constructor(x, y, intersectionGroup, textGroup) {
        //* Variables declaration
        this._x = x
        this._y = y
        this._intersectionGroup = intersectionGroup
        this._textGroup = textGroup
        this._isUsed = false
        this._isFreezed = false

        //* Static Variables declaration
        Point.quantity++
        Point.allPoints.push(this)

        //* Drawing
        this.drawSelf()

        return this
    }

    //* Getters
    get x() { return this._x }
    get y() { return this._y }
    get isUsed() { return this._isUsed }
    get isFreezed() { return this._isUsed }

    //* Static
    static quantity = 0
    static usedQuantity = 0
    static allPoints = []

    drawSelf() {
        this.circle = two.makeCircle(this._x, this._y, 6)
        this.id = this.circle.id
        this._intersectionGroup.add(this.circle)
        this.svg = this.circle._renderer.elem
        return this.circle
    }
    drawText() {
        this._tag = 'a'
        //* Pula uma letra a frente baseado em quanto pontos existem
        for (let i = 0; i < Point.usedQuantity; i++) {
            this._tag = ((parseInt(this._tag, 36) + 1).toString(36)).replace(/0/g, 'a')
        }

        Point.usedQuantity++

        this.text = two.makeText(this._tag.toLocaleUpperCase(), this.x - 15, this.y - 12)
        this.text.classList.push('svg-text')
        this._textGroup.add(this.text)
    }
    usePoint() {
        if (!this._isUsed && !this.isFreezed) {
            this._isUsed = true
            this.drawText()

            this.circle.fill = 'red'

            two.update()
        }
    }
    freezePoint() {
        if (!this._isUsed && !this._isFreezed) {
            this._isFreezed = true

            this.circle.fill = 'yellow'

            two.update()
        }
    }
}

class FixedSupport {
    constructor(point, two, supportsGroup) {
        //* Parameter Validation
        if (!point instanceof Point && !two instanceof Two) {
            throw new Error('Construtor inválido')
        }

        //* Variables declaration
        this.point = point
        this.drawSelf(two, supportsGroup)

        //* Static Variables declaration
        FixedSupport.fixedSupport = this

        return this
    }
    drawSelf(two, supportsGroup) {
        this.fixedSupportGroup = supportsGroup.add(two.makeGroup())
        this.graphics = {}

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
    constructor(point, two, supportsGroup) {
        if (!point instanceof Point && !two instanceof Two) {
            throw new Error('Construtor inválido')
        }
        this.point = point
        this.drawSelf(two, supportsGroup)

        MobileSupport.fixedSupport = this
        return this
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

    static mobileSupport = null
}

class Grid {
    constructor(two, gridGroup, intersectionGroup, columns, lines) {
        this.two = two
        this.gridGroup = gridGroup
        this.intersectionGroup = intersectionGroup
        this.columns = columns
        this.lines = lines
        this.draw(two, gridGroup, intersectionGroup)

        Grid.columns = this.columns
        Grid.lines = this.lines
        Grid.grid = this

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

    static colunas = 0
    static linhas = 0
    static grid = null
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

        this.freezeInsideBarPoints(two)

        Bar.allBars.push(this)
        return this
    }

    freezeInsideBarPoints(two) {
        let fp = this.fromPoint.circle.position
        let tp = this.toPoint.circle.position
        let apx = fp.x
        let apy = fp.y
        // this.getDirection(fp, tp)

        let widthDistance = two.width / Grid.columns
        let heightDistance = two.height / Grid.lines

        while (apx == tp.x && apy == tp) {
            if (apx != tp.x)
                apx < tp.x ? apx += widthDistance : apx -= widthDistance
            if (apy != tp.y)
                apy < tp.y ? apy += heightDistance : apy -= heightDistance
            let point = Point.allPoints.find(p => p.x === apx && p.y === apy)
            console.log(point);
            point.freezePoint()
        }

        // console.log(fp, tp)
        // console.log(two.width / Grid.columns, two.height / Grid.lines)
        // //! ESSE FOR SOMENTE LÊ PARA O LADO DIRETO
        // for (let x = fp.x; x <= tp.x; x += two.width / Grid.columns) {
        //     for (let y = fp.y; y <= tp.y; y += two.height / Grid.lines) {
        //         // Point.allPoints.find(p => p.x === x && p.y === y).freezePoint()
        //         // console.log(x, y)
        //     }
        // }
    }

    getDirection(fp, tp) {
        if (fp.x < tp.x && fp.y == tp.y) {
            console.log('para direita');
        } else if (fp.x > tp.x && fp.y == tp.y) {
            console.log('para esquerda');
        } else if (fp.x == tp.x && fp.y > tp.y) {
            console.log('para cima');
        } else if (fp.x == tp.x && fp.y < tp.y)
            console.log('para baixo');

        // debugger
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

    static allBars = []
}

export { Point, FixedSupport, MobileSupport, Grid, Bar }