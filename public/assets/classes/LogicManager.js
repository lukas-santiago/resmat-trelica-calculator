import Two from '../plugins/two.module.js'
import { Grid, Point, Ruler, Bar } from "./classes.js"

window.Two = Two
window.Grid = Grid
window.Point = Point
window.Ruler = Ruler
window.Bar = Bar

class LogicManager {
  constructor() {
    this.from = null
    this.to = null
    return this
  }
  generateView(columns, rows, widthDistance, heightDistance) {
    this.initializeTwo()
    // create grid and ruler
    window.grid = new Grid(columns, rows)
    window.ruler = new Ruler(widthDistance, heightDistance)
    // create all lines
    for (let col = 1; col <= columns + 1; col++) {
      for (let row = 1; row <= rows + 1; row++) {
        new Point(col, row)
      }
    }

    two.update()
    // simplify to get DOM elements of Point's SVG
    two.bind('render', function (e) {
      if (Point.rendered == false) {
        Point.all.forEach(point => {
          if (typeof point.svg !== point.circle._renderer.elem) {
            point.svg = point.circle._renderer.elem
            Point.rendered = true
          }
        });
      }
    })
  }

  initializeTwo() {
    let elem = document.getElementById('draw-animation')

    let size = elem.offsetWidth < elem.offsetHeight ? elem.offsetWidth : elem.offsetHeight

    window.two = new Two({
      width: size,
      height: size
    }).appendTo(elem)

    window.grid = null
    window.gridGroup = two.makeGroup()
    window.rulerGroup = two.makeGroup()
    window.rulerGroup.className = 'ruler-group'
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
    delete window.rulerGroup
    delete window.barsGroup
    delete window.supportsGroup
    delete window.pointGroup
    delete window.textGroup
    delete window.two
    delete window.logicManager;

    Grid.all = []
    Point.all = []
    Bar.all = []

  }

  barMode(e) {
    //* set from
    if (!this.from) {
      this.from = Point.all.find(p => p.id == e.target.id)
      $(this.from.svg).addClass('clicked')
    }
    //* unset from
    else if (!this.to && e.target.id == this.from.id) {
      $(this.from.svg).removeClass('clicked')
      this.from = null
    }
    //* set to and create bar then unset from and to
    else if (!this.to && e.target.id != this.from.id) {
      this.to = Point.all.find(p => p.id == e.target.id)

      if (!Bar.all.find(b => b.from == this.from && b.to == this.to)) {
        new Bar(this.from, this.to)
      }

      $(this.from.svg).removeClass('clicked')
      $(this.to.svg).removeClass('clicked')
      this.from = null
      this.to = null
      console.log(Bar.all);
      return false
    }
    //* uncaught condition
    else {
      this.from ? $(this.from.svg).removeClass('clicked') : false
      this.to ? $(this.to.svg).removeClass('clicked') : false
    }
  }

  fixedSupportMode(e) {
    console.log('fixed');
  }

  mobileSupportMode(e) {
    console.log('mobile');
  }
}


export { LogicManager }