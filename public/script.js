import Two from "./assets/plugins/two.module.js"
import { Point, FixedSupport, MobileSupport, Grid, Bar } from "./assets/classes/classes.js"

var fromPoint = null
var toPoint = null
var allBars = []
var allPoints = []
var fixedSupport = null
var mobileSupport = null
var forcePoint = null
var grid = null

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
          allPoints.push(new Point(x, y, intersectionGroup))
        }
      }
      console.log(allPoints);
    }
    two.update();
  })

  $('body').on('click', '.intersection', function (e) {

    switch ($('.draw-option.active').attr('for')) {
      case 'barra':
        if (!fromPoint) {
          fromPoint = e.target
          $(fromPoint).addClass('clicked')
        }
        else if (!toPoint && e.target == fromPoint) {
          $(fromPoint).removeClass('clicked')
          fromPoint = null
        }
        else if (!toPoint && e.target != fromPoint && allBars.length < 15) {
          toPoint = e.target

          allBars.push(new Bar(two, barsGroup, fromPoint, toPoint))
          $(fromPoint).removeClass('clicked')
          $(toPoint).removeClass('clicked')
          fromPoint = null
          toPoint = null
          console.log(allBars);
          return false
        }
        else {
          fromPoint ? $(fromPoint).removeClass('clicked') : false
          toPoint ? $(toPoint).removeClass('clicked') : false
        }
        break;
      case 'apoio-fixo':
        if (!fixedSupport) {
          fixedSupport = new FixedSupport(allPoints.find(p => p.id == e.target.id), two, supportsGroup)
        }
        break;
      case 'apoio-movel':
        if (!mobileSupport) {
          mobileSupport = new MobileSupport(allPoints.find(p => p.id == e.target.id), two, supportsGroup)
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

  document.querySelector('svg').style.overflow = 'inherit'
}

var afterUpdate = function () {
  // let point = new Point(0, 348)
  // let fixedSupportClass = new FixedSupport(point, two, supportsGroup)
  // let moblieSupportClass = new MobileSupport(point, two, supportsGroup)

}
function clearVariables() {
  fromPoint = null
  toPoint = null
  allBars = []
  allPoints = []
  fixedSupport = null
  mobileSupport = null
  forcePoint = null
  grid = null
}

