import Two from "./../../assets/plugins/two.module.js"
import { LogicManager } from "./../../assets/classes/LogicManager.js"

window.Two = Two

$(() => {
  $('[data-toggle="tooltip"]').tooltip()

  $(document).on('click', '#gerar-grade', function (e) {

    let columns = parseFloat($('#input-colunas').val()) - 1,
      rows = parseFloat($('#input-linhas').val()) -1,
      widthDistance = parseFloat($('#input-horizontal').val()),
      heightDistance = parseFloat($('#input-vertical').val())

    if (1 > columns || columns > 13) {
      $('#input-colunas').tooltip({ title: "Somente de 2 a 13", placement: "top", trigger: 'manual' });
      $('#input-colunas').tooltip('show');
      setTimeout(() => $('#input-colunas').tooltip('hide'), 7000)
      return
    }
    if (1 > rows || rows > 12) {
      $('#input-linhas').tooltip({ title: "Somente de 2 a 13", placement: "top", trigger: 'manual' });
      $('#input-linhas').tooltip('show');
      setTimeout(() => $('#input-linhas').tooltip('hide'), 7000)
      return
    }
    $('#input-colunas').tooltip('hide')
    $('#input-linhas').tooltip('hide')



    if (columns > 0 && rows > 0
      && heightDistance > 0 && widthDistance > 0) {

      if (window.logicManager && window.logicManager instanceof LogicManager) {
        logicManager.destroy()
        delete window.logicManager
      }

      window.logicManager = new LogicManager()
      logicManager.generateView(columns, rows,
        widthDistance, heightDistance)
    }

  })

  $(document).on('click', '.point-group', function (e) {
    let mode = $('.draw-option.active').attr('for')

    function cleanBarState() {
      logicManager.from ? $(logicManager.from.svg).removeClass('clicked') : false
      logicManager.from = null
    }

    switch (mode) {
      case 'barra':
        logicManager.barMode(e)
        break;
      case 'apoio-fixo':
        cleanBarState()
        logicManager.fixedSupportMode(e)
        break;
      case 'apoio-movel':
        cleanBarState()
        logicManager.mobileSupportMode(e)
        break;
      case 'forcas':
        //cleanBarState()
        //logicManager.forceMode(e)
        break;
      default:
        cleanBarState()
        console.error(mode);
        break;
    }
  })

  $(document).on('contextmenu', '.bars-group path', function (e) {
    e.preventDefault()
    let bar = Bar.all.find(b => b.svg.id == e.target.id)
    bar.destroy()

  })


  $(document).on('pointerdown', '.point-group', function (e) {
    let mode = $('.draw-option.active').attr('for')

    function cleanBarState() {
      logicManager.from ? $(logicManager.from.svg).removeClass('clicked') : false
      logicManager.from = null
    }

    if (mode == 'forcas') {
      cleanBarState()
      logicManager.forceMode(e)
    }

  })

  $('#input-colunas').val(3)
  $('#input-linhas').val(2)
  $('#input-vertical').val(2)
  $('#input-horizontal').val(4)
  setTimeout(() => {
    $('#gerar-grade').trigger("click")
    two.update()
    two.render()

    function createBarAux(from, to) {
    $('#' + Point.all[from].id).click()
    $('#' + Point.all[to].id).click()
    }

    createBarAux(1,0)
    createBarAux(0,2)
    createBarAux(2,4)
    createBarAux(4,5)
    createBarAux(5,3)
    createBarAux(3,1)
    createBarAux(3,0)
    createBarAux(3,2)
    createBarAux(3,4)

    $('label[for="apoio-movel"] > input').click()
    $('#' + Point.all[1].id).click()
    $('label[for="apoio-fixo"] > input').click()
    $('#' + Point.all[5].id).click()

  }, 500);
})
