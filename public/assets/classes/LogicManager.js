import Two from '../plugins/two.module.js'
import { Grid, Point, Ruler, Bar, Verifier, FixedSupport, MobileSupport, Force, Calculator } from "./classes.js"

window.Two = Two
window.Grid = Grid
window.Point = Point
window.Ruler = Ruler
window.Bar = Bar
window.FixedSupport = FixedSupport
window.MobileSupport = MobileSupport
window.Force = Force
window.Verifier = Verifier
window.Calculator = Calculator

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
    two.bind('render', LogicManager.renderPointSVG)
  }

  static renderPointSVG() {
    if (Point.rendered == false) {
      Point.all.forEach(point => {
        if (typeof point.svg !== point.circle._renderer.elem) {
          point.svg = point.circle._renderer.elem
          Point.rendered = true
        }
      });
    }
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
    window.barsGroup.className = 'bars-group'
    window.supportsGroup = two.makeGroup()
    window.forceGroup = two.makeGroup()
    window.pointGroup = two.makeGroup()
    window.pointGroup.className = 'point-group'
    window.textGroup = two.makeGroup()

    document.querySelector('svg').style.overflow = 'inherit'
  }

  destroy() {

    Point.rendered = false
    two.clear()
    two.update()
    $('#draw-animation').empty()
    delete window.grid
    delete window.gridGroup
    delete window.rulerGroup
    delete window.forceGroup
    delete window.barsGroup
    delete window.supportsGroup
    delete window.pointGroup
    delete window.textGroup
    delete window.two
    delete window.logicManager;

    Point.all = []
    Grid.all = []
    Grid.columns = null
    Grid.rows = null
    Grid.rulerGroup = null
    Grid.gridLinesGroup = null
    Ruler.topRulerGroup
    Ruler.sideRulerGroup
    Ruler.widthDistance
    Ruler.heightDistance
    Bar.all = []
    FixedSupport.fixedSupport = null
    MobileSupport.mobileSupport = null
    Force.all = []
    Force.preview = null

  }

  barMode(e) {
    //* set from
    if (!this.from) {
      this.from = Point.all.find(p => p.id == e.target.id)
      if (!this.from.svg) {
        Point.rendered = false
        LogicManager.renderPointSVG()
      }
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
      // console.info(Bar.all);
      return false
    }
    //* uncaught condition
    else {
      this.from ? $(this.from.svg).removeClass('clicked') : false
      this.to ? $(this.to.svg).removeClass('clicked') : false
    }
  }

  fixedSupportMode(e) {
    //TODO Necessário mover o suporte
    if (!FixedSupport.fixedSupport) {
      new FixedSupport(Point.all.find(p => p.id == e.target.id))
    }
  }

  mobileSupportMode(e) {
    //TODO Necessário mover o suporte
    if (!MobileSupport.mobileSupport) {
      new MobileSupport(Point.all.find(p => p.id == e.target.id))
    }
  }
  forceMode(e) {
    if (Bar.all.some(b => b.from.id == e.target.id || b.to.id == e.target.id)) {
      let forcePoint = Point.all.find(p => p.id == e.target.id)
      $(forcePoint.svg).addClass('force-point')
      Force.preview = new Force(forcePoint)

      function getMousePos(svg, evt) {
        var rect = svg.getBoundingClientRect();
        return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
      }

      function forceMouseUp(e) {
        if (Force.preview) {
          if (Force.setPersistent()) {

            let swallconfig = Swal.fire({
              title: 'Intensidade da força',
              input: 'text',
              inputLabel: 'Digite a quantidade em KiloNewtons que será aplicada.',
              inputPlaceholder: 'Ex: 10',
              showCancelButton: true,
              inputValidator: (value) => {
                try {
                  if (Number(value).toString() != 'NaN')
                    true
                  else
                    throw new Error()
                } catch (e) {
                  return 'É necessário digitar um número.'
                }
              }
            }).then(result => {
              if (result.isConfirmed) {
                // Force.all[Force.all.length - 1].strength = result.value
                Force.all[Force.all.length - 1].drawText(result.value)
              } else {
                Force.all[Force.all.length - 1].destroy()
                Force.all.pop()
              }
            })
          } else {
            let timerInterval
            Swal.fire({
              icon: 'error',
              title: 'Não é possível adicionar uma força acima de outra',
              html: 'Fechamento em <b></b> milisegundos.',
              timer: 3000,
              timerProgressBar: true,
              willOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                  const content = Swal.getContent()
                  if (content) {
                    const b = content.querySelector('b')
                    if (b) {
                      b.textContent = Swal.getTimerLeft()
                    }
                  }
                }, 100)
              },
              willClose: () => {
                clearInterval(timerInterval)
              }
            })
          }
        } else {
          false;
        }

        $('.content').off('pointermove', forceMouseMove)
        $('.content').off('pointerup', forceMouseUp)
        two.update()
      }


      function forceMouseMove(e) {
        Force.preview.drawSelf(getMousePos($('svg').get()[0], e))
        two.update()
      }

      $('.content').on('pointerup', forceMouseUp)
      $('.content').on('pointermove', forceMouseMove)
    }
    else {
      $('label[for="forcas"]').tooltip('show')
      setTimeout(() => $('label[for="forcas"]').tooltip('show'), 7000)
    }
  }
}


export { LogicManager }