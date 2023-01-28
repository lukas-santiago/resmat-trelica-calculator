import Two from 'two.js'
import { Grid, Point, Ruler, VectorComponentsGroups } from './VectorComponents'

type ViewPortOptions = {
    colunas: number
    linhas: number
    widthDistance: number
    heightDistance: number
    containerElement: HTMLDivElement
}

export default class VectorProcessor {
    static two: Two
    static groups: VectorComponentsGroups
    grid: any
    ruler: any

    constructor(private viewPort: ViewPortOptions) {
        viewPort.colunas--
        viewPort.linhas--

        this.initialize()
        this.generateView()
    }

    private initialize() {
        let elem = this.viewPort.containerElement
        let size = elem.offsetWidth < elem.offsetHeight ? elem.offsetWidth : elem.offsetHeight

        VectorProcessor.two = new Two({
            width: size,
            height: size
        }).appendTo(elem)

        VectorProcessor.groups = {
            grid: VectorProcessor.two.makeGroup(),
            ruler: VectorProcessor.two.makeGroup(),
            bars: VectorProcessor.two.makeGroup(),
            supports: VectorProcessor.two.makeGroup(),
            force: VectorProcessor.two.makeGroup(),
            point: VectorProcessor.two.makeGroup(),
            text: VectorProcessor.two.makeGroup()
        }

        VectorProcessor.groups.ruler._className = 'ruler-group'
        VectorProcessor.groups.bars._className = 'bars-group'
        VectorProcessor.groups.point._className = 'point-group'

        this.viewPort.containerElement.querySelector('svg')!.style.overflow = 'inherit'
    }

    private generateView() {
        this.grid = new Grid(this.viewPort.colunas, this.viewPort.linhas)
        this.ruler = new Ruler(this.viewPort.widthDistance, this.viewPort.heightDistance)

        for (let col = 1; col <= this.viewPort.colunas + 1; col++) {
            for (let row = 1; row <= this.viewPort.linhas + 1; row++) {
                new Point(col, row)
            }
        }

        VectorProcessor.two.update()
        VectorProcessor.two.bind('render', VectorProcessor.renderPointSVG)
    }

    static renderPointSVG() {
        if (Point.rendered == false) {
            Point.all.forEach((point: any) => {
                if (typeof point.svg !== point.circle._renderer.elem) {
                    point.svg = point.circle._renderer.elem
                    Point.rendered = true
                }
            });
        }
    }
}