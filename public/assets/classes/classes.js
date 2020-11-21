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
            mobileSupport: [],
            fixedSupport: [],
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
        this.circle.stroke = '#545b62'
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

    discardPointFromBar(bar) {
        if (this.objectsIn.bars.length == 1) {
            this.objectsIn.forces.forEach(f => f.destroy())
            this.objectsIn.bars = []
            this.objectsIn.forces = []
            this.circle.fill = 'white'
            this.used = false
            this.text.remove()
        }
        else {
            let barIndex = this.objectsIn.bars.indexOf(bar)
            this.objectsIn.bars.splice(barIndex, 1)
        }
        two.update()
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
            let lineX = two.makeLine(x, 0, x, two.height)
            lineX.linewidth = 1
            lineX.stroke = '#6c757d'
            Grid.gridLinesGroup.add(lineX)
        }
        for (let y = 0; y <= two.height + 1; y += two.height / Grid.rows) {
            let lineY = two.makeLine(0, y, two.width, y)
            lineY.linewidth = 1
            lineY.stroke = '#6c757d'
            Grid.gridLinesGroup.add(lineY)
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

        let mainLine = two.makeLine(two.width + 30, 0, two.width + 30, two.height)
        mainLine.stroke = '#545b62'
        Ruler.sideRulerGroup.add(mainLine)

        for (let y = 0, row = Grid.rows; y <= two.height + 1; y += two.height / Grid.rows, row--) {
            let auxLine = two.makeLine(two.width + 25, y, two.width + 35, y)
            auxLine.stroke = '#545b62'
            Ruler.sideRulerGroup.add(auxLine)

            let textValue = ((Ruler.heightDistance / Grid.rows) * row).toFixed(2)//.replace(/([.,]00)|([.,]\d0)$/, "")
            let textX = two.makeText(textValue == 'Infinity' ? '0' : textValue, two.width + 47, y)
            textX.classList.push('ruler-text')
            Ruler.sideRulerGroup.add(textX)
        }
    }

    drawTopRuler() {
        Ruler.topRulerGroup = two.makeGroup()
        rulerGroup.add(Ruler.topRulerGroup)

        let mainLine = two.makeLine(0, -30, two.width, -30)
        mainLine.stroke = '#545b62'
        Ruler.topRulerGroup.add(mainLine)

        for (let x = 0, col = 0; x <= two.width + 1; x += two.width / Grid.columns, col++) {
            let auxLine = two.makeLine(x, -25, x, -35)
            auxLine.stroke = '#545b62'
            Ruler.topRulerGroup.add(auxLine)

            let textValue = ((Ruler.widthDistance / Grid.columns) * col).toFixed(2)//.replace(/([.,]00)|([.,]\d0)$/, "")
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

    get strength() { return this._strength }
    set strength(value) {
        this._strength = value
        value > 0 ? this._strengthType = 'Tração'
            : value == 0 ? this._strengthType = '-' : this._strengthType = 'Compressão'
    }
    get strengthType() { return this._strengthType }

    constructor(from, to) {
        if (!from instanceof Point && !to instanceof Point)
            throw new error('Cannot Create Bar')

        this._from = from
        this._to = to

        this._strength = 0
        this._strengthType = ''

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

        // console.info(pointsInPath);
        pointsInPath.forEach(p => p.disablePoint())




        Bar.all.push(this)


        this.name = 'N' + from.letra + to.letra
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
        this.line.linewidth = 7

        barsGroup.add(this.line)
    }

    destroy() {
        this.from.discardPointFromBar(this)
        this.to.discardPointFromBar(this)
        this.line.remove()
        Bar.all.splice(Bar.all.indexOf(this), 1)
        two.update()
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

    get angleMath() {
        let diffRow = (this._to.row - this._from.row) * -1
        let diffCol = (this._to.column - this._from.column)

        let diffHeight = (Ruler.heightDistance / Grid.rows) * diffRow
        let diffWidth = (Ruler.widthDistance / Grid.columns) * diffCol

        let main = ((Math.asin(diffHeight / Math.hypot(diffHeight, diffWidth)) * 180 / Math.PI)).toFixed(2)
        if (diffHeight >= 0 && diffWidth >= 0) {
            //console.log('primeiro quadrante');
            return parseFloat(main)
        } else if (diffHeight >= 0 && diffWidth < 0) {
            //console.log('segundo quadrante');
            return (90 - main) + 90
        } else if (diffHeight < 0 && diffWidth <= 0) {
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
        this.fh = null
        this.fv = null
        this.point = point
        this.point.usePoint('red', true, true)
        this.point.objectsIn.fixedSupport.push(this)
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

    get side() {
        let m = MobileSupport.mobileSupport
        if (!m)
            return null
        return m.point.x <= this.point.x ? 'right' : 'left'
    }
}

class MobileSupport {
    constructor(point) {
        if (!point instanceof Point) {
            throw new Error('Construtor inválido')
        }

        this.fv = null
        this.point = point
        this.point.usePoint('red', true, true)
        this.point.objectsIn.mobileSupport.push(this)
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

    get side() {
        let f = FixedSupport.fixedSupport
        if (!f)
            return null
        return f.point.x <= this.point.x ? 'right' : 'left'
    }
}

class Force {
    static all = []
    static preview = null
    get intesity() { return this.direction == 'right' || this.direction == 'up' ? this.strength : this.strength * -1 }


    constructor(from) {
        if (!from instanceof Point) {
            throw new Error('Construtor inválido')
        }
        this.direction = null
        this.text = null
        this.mouseDirection = null
        this.from = from
        this.arrowPath = null
        this.arrowLine = null
        this.strength = 0

        return this
    }

    drawText(strength) {
        this.strength = strength
        let text = this.strength + 'KN'
        switch (this.mouseDirection) {
            case 'up':
                this.text = two.makeText(text, this.from.x + 20, this.from.y - 29)
                this.text.classList.push('svg-force')
                textGroup.add(this.text)
                break;
            case 'down':
                this.text = two.makeText(text, this.from.x + 20, this.from.y + 29)
                this.text.classList.push('svg-force')
                textGroup.add(this.text)
                break;
            case 'left':
                this.text = two.makeText(text, this.from.x - 50, this.from.y + 15)
                this.text.classList.push('svg-force')
                textGroup.add(this.text)
                break;
            case 'right':
                this.text = two.makeText(text, this.from.x + 36, this.from.y + 15)
                this.text.classList.push('svg-force')
                break;

            default:
                break;
        }
        textGroup.add(this.text)
        two.update()
    }

    drawSelf(mousePos) {
        let from = this.from
        let { direction, mouseDirection } = this.findDirection(mousePos)

        let start = { x: from.x, y: from.y },
            radius = 8,
            size = 12,
            lineSize = 40,
            vertices = [0, 0, 0],
            line = { x: from.x, y: from.y }

        switch (mouseDirection) {
            case 'up':
                start.y -= radius
                line.y -= lineSize
                vertices[0] = new Two.Vector(start.x - size, start.y - size)
                vertices[1] = new Two.Vector(start.x, start.y)
                vertices[2] = new Two.Vector(start.x + size, start.y - size)

                break
            case 'down':
                start.y += radius
                line.y += lineSize
                vertices[0] = new Two.Vector(start.x - size, start.y + size)
                vertices[1] = new Two.Vector(start.x, start.y)
                vertices[2] = new Two.Vector(start.x + size, start.y + size)
                break
            case 'left':
                start.x -= radius
                line.x -= lineSize
                vertices[0] = new Two.Vector(start.x - size, start.y + size)
                vertices[1] = new Two.Vector(start.x, start.y)
                vertices[2] = new Two.Vector(start.x - size, start.y - size)
                break
            case 'right':
                start.x += radius
                line.x += lineSize
                vertices[0] = new Two.Vector(start.x + size, start.y + size)
                vertices[1] = new Two.Vector(start.x, start.y)
                vertices[2] = new Two.Vector(start.x + size, start.y - size)
                break
            default:
                break
        }
        if (!this.mouseDirection || mouseDirection != this.mouseDirection) {
            this.arrowPath ? this.arrowPath.remove() : false
            this.arrowPath = null
            this.arrowPath = new Two.Path(vertices, false, false)
            this.arrowPath.fill = 'transparent'
            this.arrowPath.linewidth = 3
            this.arrowPath.stroke = 'rgb(168, 63, 194)'

            this.arrowLine ? this.arrowLine.remove() : false
            this.arrowLine = null
            this.arrowLine = new Two.Line(start.x, start.y, line.x, line.y)
            this.arrowLine.linewidth = 3
            this.arrowLine.stroke = 'rgb(168, 63, 194)'

            forceGroup.add(this.arrowLine)
            forceGroup.add(this.arrowPath)
            this.mouseDirection = mouseDirection
            this.direction = direction
        }
    }

    findDirection(mousePos) {
        let diffVertical = this.from.y - mousePos.y
        let diffHorizontal = this.from.x - mousePos.x
        let direction, mouseDirection
        if (Math.abs(diffVertical) > Math.abs(diffHorizontal)) {
            diffVertical > 0 ? mouseDirection = 'up' : mouseDirection = 'down'
            diffVertical > 0 ? direction = 'down' : direction = 'up'
        } else {
            diffHorizontal > 0 ? mouseDirection = 'left' : mouseDirection = 'right'
            diffHorizontal > 0 ? direction = 'right' : direction = 'left'
        }
        return {
            vertical: diffVertical,
            horizontal: diffHorizontal,
            direction: direction,
            mouseDirection: mouseDirection
        }
    }

    destroy() {
        this.arrowPath.remove()
        this.arrowLine.remove()
        this.text ? this.text.remove() : false
        Force.all.splice(Force.all.indexOf(this), 1)
        two.update()
    }

    static setPersistent() {
        if (!Force.all.some(f => f.from == Force.preview.from && f.direction == Force.preview.direction)) {
            Force.all.push(Force.preview)
            Force.preview.from.objectsIn.forces.push(Force.preview)
            Force.preview = null
            return true
        }
        Force.preview = null
        return false
    }
}

class Verifier {
    constructor() {
        this.messages = []
        this.error = []
        this.infos = []

        this.VerifyBarPoints()
        this.VerifyMobileSupport()
        this.VerifyFixedSupport()
        this.verifyForces()
        this.verifyIsostaticCondition()

        this.messages.forEach(m => console.info('Válido: ' + m))
        this.error.forEach(m => console.error('Inválido: ' + m))

        return this
    }
    verifyForces() {
        if (Force.all.length > 0)
            this.messages.push(`Há a aplicação de forças externas`)

        else
            this.messages.push(`Não há a aplicação de forças externas`)
            this.infos.push(`Não há a aplicação de forças externas`)
    }

    VerifyMobileSupport() {
        if (MobileSupport.mobileSupport != null) {
            if (Bar.all.some(b => b.from == MobileSupport.mobileSupport.point || b.to == MobileSupport.mobileSupport.point)) {
                this.messages.push('Apoio móvel válido')
            } else {
                this.error.push('Apoio móvel inválido por não estar conectado a nenhuma barra')
            }
        } else {
            this.error.push('Não há apoio móvel')
        }
    }

    VerifyFixedSupport() {
        if (FixedSupport.fixedSupport != null) {
            if (Bar.all.some(b => b.from == FixedSupport.fixedSupport.point || b.to == FixedSupport.fixedSupport.point)) {
                this.messages.push('Apoio fixo válido')
            } else {
                this.error.push('Apoio fixo inválido por não estar conectado a nenhuma barra')
            }
        } else {
            this.error.push('Não há apoio fixo')
        }
    }

    VerifyBarPoints() {
        if (Point.all.filter(p => p.used).length > 0
            && Point.all.filter(p => p.used).length == Point.all.filter(p => p.objectsIn.bars.length > 1).length)
            this.messages.push('Todas as barras estão conectadas')

        else
            this.error.push('Há barras desconectadas')
    }

    verifyIsostaticCondition() {
        let p = Point.all.filter(p => p.used).length
        let b = Bar.all.length
        let e = nerdamer('2*p - (b+3)', { p: p, b: b });
        if (e.text() != "0")
            this.error.push('Condição isoestática se mostrou inválida')
        else
            this.messages.push('Condição isoestática aceita')
    }
}

class Calculator {
    static matriz = null
    constructor() {
        let v = new Verifier()
        if (v.error.length > 0) {
            Swal.fire({
                title: 'Erro',
                html: v.error.join('<br>'),
                icon: 'error',
              })
            return null
        }

        Calculator.matriz = null
        Calculator.matriz = this.calculateForce()


        this.CalculaMatrizPorGauss()

        //this.calculateMatriz(Calculator.matriz) <- método também funciona (+-)

        let barras = []
        Bar.all.forEach(b => {
            barras.push(`Barra ${b.name}: ${b.strength.toFixed(3)} - ${b.strengthType}<br>`)
        })
        let stringHtml = `
        <div class="container">
            <div class="row">
                <div class="col">
                    FixedSupport H: ${FixedSupport.fixedSupport.fh.toFixed(3)}
                    <br>
                    FixedSupport V: ${FixedSupport.fixedSupport.fv.toFixed(3)}
                    <br>
                    MobileSupport V: ${MobileSupport.mobileSupport.fv.toFixed(3)}
                    <br>
                    ${barras.join('\n')}
                </div>
            </div>
        </div>
        `

        Swal.fire({
            html: `
            <div class="container">
                <div class="row">
                    <div class="col">
                        <table id="table-resultados" style="width:100%"
                            class="dataTable display no-footer table-bordered table-sm" />
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        ${v.infos.join('<br>')}
                    </div>
                </div>
            </div>`,
            didRender: () => {
                let aux = (value) => value.toString().replace('.',',')
                let table = $('#table-resultados').DataTable({
                    searching: false,
                    paging: false,
                    autoWidth: true,
                    ordering: false,
                    info: false,
                    columns: [
                        { title: 'Barra' },
                        { title: 'Forças em KN' },
                        { title: 'Esforço' },
                    ]
                })

                table.row.add(['Suporte Fixo - FH (←→)', aux(FixedSupport.fixedSupport.fh.toFixed(3)), '-'])
                table.row.add(['Suporte Fixo - FV (↓↑)', aux(FixedSupport.fixedSupport.fv.toFixed(3)), '-'])
                table.row.add(['Suporte Móvel - FV (↓↑)', aux(FixedSupport.fixedSupport.fh.toFixed(3)), '-'])
                Bar.all.forEach(b => {
                    table.row.add([`Barra ${b.name}`, aux(b.strength.toFixed(3)), b.strengthType])
                })
                table.draw(false)
            }
        })

    }

    CalculaMatrizPorGauss() {
        for (let r = 0; r < Calculator.matriz.length; r++) { // Simplica valores da matriz
            for (let c = 0; c < Calculator.matriz[r].length; c++) {
                Calculator.matriz[r][c] = parseFloat(Calculator.matriz[r][c].toFixed(3))
            }
        }

        let A = Calculator.matriz.map((m, i) => { // Pega a matriz menos a ultima coluna (requisito da biblioteca)
            return m.filter((r, j, a) => j < a.length - 1)
        })
        let b = Calculator.matriz.map((m, i, a) => m[a.length]) // Extrai os termos independentes, a ultima coluna (equisito da biblioteca)

        let x = this.gaussSolver(A, b)

        x.forEach((n, i, a) => a[i] = parseFloat(n * -1)) // Inverte sinal dos valores

        let index = 0
        FixedSupport.fixedSupport.fh = x[index++]
        FixedSupport.fixedSupport.fv = x[index++]
        MobileSupport.mobileSupport.fv = x[index++]

        for (let barra of Bar.all) {
            let value = x[index++]
            barra.strength = value
        }
    }

    calculateForce() {
        let Points = Point.all.filter(p => p.used)
        let matrizRows = Points.length * 2
        let matriz = Array.from(Array(matrizRows), () => new Array(matrizRows + 1))

        for (let r = 0; r < matriz.length; r++) { // Inicia matriz com 0
            for (let c = 0; c < matriz[r].length; c++) {
                matriz[r][c] = 0
            }
        }

        let linha = 0, coluna = 0
        Points.forEach(actualPoint => {
            if (FixedSupport.fixedSupport.point == actualPoint) {
                matriz[linha][coluna] = 1
                matriz[linha + 1][++coluna] = 1;
                matriz[linha + 1][++coluna] = 0;
            } else if (MobileSupport.mobileSupport.point == actualPoint) {
                matriz[linha][coluna] = 0;
                matriz[linha + 1][++coluna] = 0;
                matriz[linha + 1][++coluna] = 1;
            } else
                coluna += 2;

            Bar.all.forEach(actualBar => {
                coluna++;
                if (actualBar.from == actualPoint) {
                    matriz[linha][coluna] = Math.cos(actualBar.angleMath * (Math.PI / 180)).toFixed(15) * 1;
                    matriz[linha + 1][coluna] = Math.sin(actualBar.angleMath * (Math.PI / 180)).toFixed(15) * 1;
                } else if (actualBar.to == actualPoint) {
                    // Multiplica-se por -1 pois barras possuem angulos padronizados que vão do ponto inicial para o final
                    matriz[linha][coluna] = Math.cos(actualBar.angleMath * (Math.PI / 180)).toFixed(15) * -1;
                    matriz[linha + 1][coluna] = Math.sin(actualBar.angleMath * (Math.PI / 180)).toFixed(15) * -1;
                }
            });

            coluna++;

            Force.all.forEach(actualForce => {
                if (actualForce.from == actualPoint) {
                    switch (actualForce.direction) {
                        case 'up':
                            matriz[linha + 1][coluna] += Math.abs(actualForce.intesity);
                            break;

                        case 'down':
                            matriz[linha + 1][coluna] -= Math.abs(actualForce.intesity);
                            break;

                        case 'right':
                            matriz[linha][coluna] -= Math.abs(actualForce.intesity);
                            break;

                        default:
                            matriz[linha][coluna] += Math.abs(actualForce.intesity);
                            break;
                    }
                }
            })

            linha += 2;
            coluna = 0
        })

        return matriz;
    }
    calculateForceOld() {
        let matrizRows = (Point.all.filter(p => p.used).length) * 2
        let matriz = Array.from(Array(matrizRows), () => new Array(matrizRows + 1))

        for (let r = 0; r < matriz.length; r++) {
            for (let c = 0; c < matriz[r].length; c++) {
                matriz[r][c] = 0
            }
        }

        let linha = 0, coluna = 0;

        for (let ponto of Point.all.filter(p => p.used)) {

            if (FixedSupport.fixedSupport.point == ponto)// Coloca apoio fixo na matriz
            {
                matriz[linha][coluna] = 1;
                matriz[linha + 1][++coluna] = 1;
                matriz[linha + 1][++coluna] = 0;
            } else if (MobileSupport.mobileSupport.point == ponto)// Coloca apoio móvel na matriz
            {
                matriz[linha][coluna] = 0;
                matriz[linha + 1][++coluna] = 0;
                matriz[linha + 1][++coluna] = 1;
            } else// Se não for apoio deve pular as colunas dos mesmos
            {
                coluna += 2;
            }


            for (let barra of Bar.all) {
                coluna++;
                if (barra.from == ponto) {
                    matriz[linha][coluna] = Math.cos(barra.angleMath * (Math.PI / 180)).toFixed(15) * 1;
                    matriz[linha + 1][coluna] = Math.sin(barra.angleMath * (Math.PI / 180)).toFixed(15) * 1;
                }
                else if (barra.to == ponto) {
                    // Multiplica-se por -1 pois barras possuem angulos padronizados que vão do ponto inicial para o final
                    matriz[linha][coluna] = Math.cos(barra.angleMath * (Math.PI / 180)).toFixed(15) * -1;
                    matriz[linha + 1][coluna] = Math.sin(barra.angleMath * (Math.PI / 180)).toFixed(15) * -1;
                }

            }

            coluna++;

            for (let force of Force.all) {
                if (force.from == ponto) {
                    switch (force.direction) {
                        case 'up':
                            // matriz[linha + 1][coluna] += force.intesity;
                            matriz[linha + 1][coluna] = force.intesity;
                            break;

                        case 'down':
                            // matriz[linha + 1][coluna] -= force.intesity;
                            matriz[linha + 1][coluna] = force.intesity;
                            break;

                        case 'left':
                            // matriz[linha][coluna] -= force.intesity;
                            matriz[linha][coluna] = force.intesity;
                            break;

                        default:
                            // matriz[linha][coluna] += force.intesity;
                            matriz[linha][coluna] = force.intesity;
                            break;
                    }
                }
            }

            linha += 2;
            coluna = 0;

        }
        return matriz;
    }
    calculateMatriz(matriz) {
        let pivo;

        for (let x = 0; x < Point.all.filter(p => p.used).length * 2; x++)// Passa por cada linha pra fazer escalonamento
        {
            if (this.round(matriz[x][x], 10) == 0)// Precisa trocar linha
            {
                this.TrocarLinhasMatriz(matriz, x);
            }

            pivo = matriz[x][x];

            for (let y = 0; y < Point.all.filter(p => p.used).length * 2 + 1; y++)// Tranforma elemento da diagonal principal em 1, divide todos da linha pelo pivô
            {
                matriz[x][y] /= pivo;
            }

            for (let x2 = x + 1; x2 < Point.all.filter(p => p.used).length * 2; x2++) {
                if (this.round(matriz[x2][x], 10) != 0)// Necessário escalonar
                {
                    pivo = matriz[x2][x];

                    for (let y = 0; y < Point.all.filter(p => p.used).length * 2 + 1; y++)// Escalona
                    {
                        matriz[x2][y] = matriz[x2][y] - (pivo * matriz[x][y]);
                    }
                }
            }
        }

        for (let x = Point.all.filter(p => p.used).length * 2 - 1; x >= 0; x--)// Passa por cada linha pra fazer escalonamento inverso
        {
            pivo = matriz[x][x];

            for (let x2 = x - 1; x2 >= 0; x2--) {
                if (Math.round(matriz[x2][x], 10) != 0)// Necessário escalonar inversamente
                {
                    pivo = matriz[x2][x];

                    for (let y = 0; y < Point.all.filter(p => p.used).length * 2 + 1; y++)// Escalona
                    {
                        matriz[x2][y] = matriz[x2][y] - (pivo * matriz[x][y]);
                    }
                }
            }
        }

        let linha = 0;

        FixedSupport.fixedSupport.fh = matriz[linha++][Point.all.filter(p => p.used).length * 2];
        FixedSupport.fixedSupport.fv = matriz[linha++][Point.all.filter(p => p.used).length * 2];
        MobileSupport.mobileSupport.fv = matriz[linha++][Point.all.filter(p => p.used).length * 2];

        for (let barra of Bar.all) {
            let value = matriz[linha++][Point.all.filter(p => p.used).length * 2]
            barra.strength = value
        }
        // for (let barra of Bar.all) {
        //     let value = matriz[linha++][Point.all.filter(p => p.used).length * 2]
        //     if (value > 0) {
        //         barra.strength = value
        //         barra.strengthType = 'Tração'
        //     } else if (value < 0) {
        //         barra.strength = value * -1
        //         barra.strengthType = 'Compressão'
        //     } else {
        //         barra.strength = value
        //         barra.strengthType = 'Não possui'
        //     }
        // }


    }

    round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    TrocarLinhasMatriz(matriz, linha) {
        for (let x = linha + 1; x < Point.all.filter(p => p.used).length * 2; x++)// Procura linha para trocar
        {
            if (this.round(matriz[x][linha], 10) != 0)// Confirma se é válida para fazer troca
            {
                let aux;

                for (let y = 0; y < Point.all.filter(p => p.used).length * 2 + 1; y++)// Troca linha da matriz
                {
                    aux = matriz[x][y];
                    matriz[x][y] = matriz[linha][y];
                    matriz[linha][y] = aux;
                }

                break;
            }
        }
    }
    gaussSolver(A, b) {
        var i, j, k, l, m;
        //ETAPA DE ESCALONAMENTO
        for (k = 0; k < A.length - 1; k++) {
            //procura o maior k-ésimo coeficiente em módulo
            var max = Math.abs(A[k][k]);
            var maxIndex = k;
            for (i = k + 1; i < A.length; i++) {
                if (max < Math.abs(A[i][k])) {
                    max = Math.abs(A[i][k]);
                    maxIndex = i;
                }
            }
            if (maxIndex != k) {
                /*
                troca a equação k pela equação com o
                maior k-ésimo coeficiente em módulo
                */
                for (j = 0; j < A.length; j++) {
                    var temp = A[k][j];
                    A[k][j] = A[maxIndex][j];
                    A[maxIndex][j] = temp;
                }
                var temp = b[k];
                b[k] = b[maxIndex];
                b[maxIndex] = temp;
            }
            //Se A[k][k] é zero, então a matriz dos coeficiente é singular
            //det A = 0
            if (A[k][k] == 0) {
                return null;
            } else {
                //realiza o escalonamento
                for (m = k + 1; m < A.length; m++) {
                    var F = -A[m][k] / A[k][k];
                    A[m][k] = 0; //evita uma iteração
                    b[m] = b[m] + F * b[k];
                    for (l = k + 1; l < A.length; l++) {
                        A[m][l] = A[m][l] + F * A[k][l];
                    }
                }
            }
        }
        //ETAPA DE RESOLUÇÃO DO SISTEMA
        var X = [];
        for (i = A.length - 1; i >= 0; i--) {
            X[i] = b[i];
            for (j = i + 1; j < A.length; j++) {
                X[i] = X[i] - X[j] * A[i][j];
            }
            X[i] = X[i] / A[i][i];
        }
        return X;
    }
}


export { Point, Grid, Ruler, Bar, FixedSupport, MobileSupport, Force, Verifier, Calculator }  