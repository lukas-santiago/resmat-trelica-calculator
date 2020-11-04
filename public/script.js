import Two from "./assets/plugins/two.module.js"
import { LogicManager } from "./assets/classes/LogicManager.js"

window.Two = Two

$(() => {
  $('[data-toggle="tooltip"]').tooltip()

  $(document).on('click', '#gerar-grade', function (e) {

    let columns = parseInt($('#input-colunas').val()),
      rows = parseInt($('#input-linhas').val()),
      widthDistance = parseInt($('#input-horizontal').val()),
      heightDistance = parseInt($('#input-vertical').val())


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
    switch (mode) {
      case 'barra':
        logicManager.barMode(e)
        break;
      case 'apoio-fixo':
        logicManager.fixedSupportMode(e)
        break;
      case 'apoio-movel':
        logicManager.mobileSupportMode(e)
        break;
      default:
        console.error(mode);
        break;
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