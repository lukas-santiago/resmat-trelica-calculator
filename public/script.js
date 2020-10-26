import Two from "./assets/plugins/two.module.js"
import { Point, FixedSupport, MobileSupport, Grid, Bar } from "./assets/classes/classes.js"

window.Point = Point
window.FixedSupport = FixedSupport
window.MobileSupport = MobileSupport
window.Grid = Grid
window.Bar = Bar


var fromPoint = null
var toPoint = null


// var allBars = [] //! --> static
var allPoints = [] //! --> static
var allForces = null //! --> static
var fixedSupport = null //! --> static
var mobileSupport = null //! --> static
var grid = null //! --> static

window.onresize = function (event) {

  if (window.two instanceof Two) {
    var elem = document.getElementById('draw-animation');
    two.renderer.setSize(elem.offsetWidth, elem.offsetHeight);
    // grid.reDraw()
    two.update();
    // afterUpdate();
    console.log(elem.offsetWidth, elem.offsetHeight);
  }
  //! implementar redraw

};


$(function () {
  $('[data-toggle="tooltip"]').tooltip()

  $(document).on('click', '#gerar-grade', function () {
    clearVariables()
    initializeTwo()
    let colunas = parseInt($('#input-colunas').val())
    let linhas = parseInt($('#input-linhas').val())

    if (colunas > 0 && linhas > 0) {
      grid = new Grid(two, gridGroup, intersectionGroup, colunas, linhas)
      for (let x = 0; x <= two.width; x += two.width / colunas) {
        for (let y = 0; y <= two.height; y += two.height / linhas) {
          new Point(x, y, intersectionGroup, textGroup)
        }
      }
      console.log(Point.allPoints);
    }
    two.bind('render', function (a, b) {
      Point.allPoints.forEach(point => {
        if (typeof point.svg !== point.circle._renderer.elem) {
          point.svg = point.circle._renderer.elem
        }
      });
    })
    two.update();
  })

  $(document).on('click', '.intersection', function (e) {

    switch ($('.draw-option.active').attr('for')) {
      case 'barra':
        if (!fromPoint) {
          fromPoint = Point.allPoints.find(p => p.id == e.target.id)
          $(fromPoint.svg).addClass('clicked')
        }
        else if (!toPoint && e.target.id == fromPoint.id) {
          $(fromPoint.svg).removeClass('clicked')
          fromPoint = null
        }
        else if (!toPoint && e.target.id != fromPoint.id && Bar.allBars.length < 15) {
          toPoint = Point.allPoints.find(p => p.id == e.target.id)
          if (!Bar.allBars.find(p => p.fromPoint == fromPoint && p.toPoint == toPoint)) {
            new Bar(two, barsGroup, fromPoint, toPoint)
          }
          $(fromPoint.svg).removeClass('clicked')
          $(toPoint.svg).removeClass('clicked')
          fromPoint = null
          toPoint = null
          console.log(Bar.allBars);
          return false
        }
        else {
          fromPoint ? $(fromPoint.svg).removeClass('clicked') : false
          toPoint ? $(toPoint.svg).removeClass('clicked') : false
        }
        break;
      case 'apoio-fixo':
        if (!fixedSupport) {
          fixedSupport = new FixedSupport(Point.allPoints.find(p => p.id == e.target.id), two, supportsGroup)
        } 
        // else {
        //   fixedSupport.moveTo(Point.allPoints.find(p => p.id == e.target.id))
        // }
        break;
      case 'apoio-movel':
        if (!mobileSupport) {
          mobileSupport = new MobileSupport(Point.allPoints.find(p => p.id == e.target.id), two, supportsGroup)
        }
        break;
      default:
        console.log($('.draw-option.active').attr('for'));
        break;
    }
  })

})


var initializeTwo = function () {

  if (window.two instanceof Two) {
    two.clear()
    window.two = null
    $('#draw-animation').empty()
  }

  var elem = document.getElementById('draw-animation');

  window.two = new Two({
    width: elem.offsetWidth,
    height: elem.offsetHeight
  }).appendTo(elem);

  window.grid = null
  window.gridGroup = two.makeGroup()
  window.barsGroup = two.makeGroup()
  window.supportsGroup = two.makeGroup()
  window.intersectionGroup = two.makeGroup()
  intersectionGroup.className = "intersection"
  window.textGroup = two.makeGroup()

  document.querySelector('svg').style.overflow = 'inherit'
}

function clearVariables() {
  fromPoint = null
  toPoint = null
  Bar.allBars = []
  Point.allPoints = []
  fixedSupport = null
  mobileSupport = null
  allForces = null
  grid = null
}

