import Two from '../plugins/two.module.js'
import { Grid, Point } from "./classes.js"

window.Two = Two
window.Grid = Grid
window.Point = Point


class LogicManager {
    constructor(parameters) {
        LogicManager.verticalDistance = parameters.verticalDistance
        LogicManager.horizontalDistance = parameters.horizontalDistance

        return this
    }
    generateView(columns, rows) {
        this.initializeTwo()

        window.grid = new Grid(columns, rows)

        for (let col = 1; col <= columns + 1; col++) {
            for (let row = 1; row <= rows + 1; row++) {
                new Point(col, row)
            }
        }

        two.update()

        two.bind('render', function () {
            if (Point.rendered == false) {
                Point.all.forEach(point => {
                    if (typeof point.svg !== point._twoCircle._renderer.elem) {
                        point.svg = point._twoCircle._renderer.elem
                        Point.rendered = true
                    }
                });
            }
        })
    }

    initializeTwo() {
        let elem = document.getElementById('draw-animation')

        window.two = new Two({
            width: elem.offsetWidth,
            height: elem.offsetHeight
        }).appendTo(elem)

        window.grid = null
        window.gridGroup = two.makeGroup()
        window.barsGroup = two.makeGroup()
        window.supportsGroup = two.makeGroup()
        window.pointGroup = two.makeGroup()
        window.pointGroup.className = 'point-group'
        window.textGroup = two.makeGroup()

        document.querySelector('svg').style.overflow = 'inherit'
    }

    destroy() {
        two.clear()
        two.update()
        $('#draw-animation').empty()
        delete window.grid
        delete window.gridGroup
        delete window.barsGroup
        delete window.supportsGroup
        delete window.pointGroup
        delete window.textGroup
        delete window.two
        delete window.logicManager;
    }

    static verticalDistance
    static horizontalDistance
}


export { LogicManager }