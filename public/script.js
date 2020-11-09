import Two from "./assets/plugins/two.module.js"
import { LogicManager } from "./assets/classes/LogicManager.js"

window.Two = Two

$(() => {
  $('[data-toggle="tooltip"]').tooltip()

  $(document).on('click', '#gerar-grade', function (e) {

    let columns = parseFloat($('#input-colunas').val()),
      rows = parseFloat($('#input-linhas').val()),
      widthDistance = parseFloat($('#input-horizontal').val()),
      heightDistance = parseFloat($('#input-vertical').val())

    if (1 > columns || columns > 12) {
      $('#input-colunas').tooltip({ title: "Somente de 1 a 12", placement: "top", trigger: 'manual' });
      $('#input-colunas').tooltip('show');
      setTimeout(() => $('#input-colunas').tooltip('hide'), 7000)
      return
    }
    if (1 > rows || rows > 12) {
      $('#input-linhas').tooltip({ title: "Somente de 1 a 12", placement: "top", trigger: 'manual' });
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


  $(document).on('mousedown', '.point-group', function (e) {
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

  $('#input-colunas').val(5)
  $('#input-linhas').val(5)
  $('#input-vertical').val(5)
  $('#input-horizontal').val(5)
  setTimeout(() => {
    $('#gerar-grade').trigger("click")
    two.update()
  }, 500);
})