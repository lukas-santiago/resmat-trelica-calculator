import Two from "./assets/plugins/two.module.js"
import { Point, FixedSupport, MobileSupport, Grid, Bar } from "./assets/classes/classes.js"

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

var fromPoint = null
var toPoint = null
var allBars = []
var supportPoint = null
var forcePoint = null
$(document).on('click', '#gerar-grade', function () {
  let colunas = parseInt($('#input-colunas').val())
  let linhas = parseInt($('#input-linhas').val())

  if (colunas > 0 && linhas > 0) {
    grid = new Grid(two, gridGroup, intersectionGroup, colunas, linhas)
    console.log('dss');
  }
})


document.querySelector('svg').style.overflow = 'inherit'

window.onresize = function (event) {
  two.renderer.setSize(elem.offsetWidth, elem.offsetHeight);
  // grid.reDraw()
  two.update();
  // afterUpdate();
  console.log(elem.offsetWidth, elem.offsetHeight);
};


$(function () {
  two.update();
  afterUpdate();
})


var afterUpdate = function () {
  $('.intersection').on('click', function (e) {

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

      default:
        console.log($('.draw-option.active').attr('for'));
        break;
    }
  })


  // let point = new Point(0, 348)
  // let fixedSupportClass = new FixedSupport(point, two, supportsGroup)
  // let moblieSupportClass = new MobileSupport(point, two, supportsGroup)

}
