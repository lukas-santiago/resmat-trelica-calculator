import Two from "./assets/plugins/two.module.js"
import { LogicManager } from "./assets/classes/LogicManager.js"

window.Two = Two

$(() => {
  $('[data-toggle="tooltip"]').tooltip()

  $(document).on('click', '#gerar-grade', function (e) {

    let parameters = {
      columns: parseInt($('#input-colunas').val()),
      rows: parseInt($('#input-linhas').val()),
      verticalDistance: parseInt($('#input-vertical').val()),
      horizontalDistance: parseInt($('#input-horizontal').val())
    }

    if (parameters.columns > 0 && parameters.rows > 0
      && parameters.verticalDistance > 0 && parameters.horizontalDistance > 0) {

      if (window.logicManager && window.logicManager instanceof LogicManager) {
        logicManager.destroy()
      }

      window.logicManager = new LogicManager(parameters)
      logicManager.generateView(parameters.columns, parameters.rows)
    }

  })

  $(document).on('click', '.intersection', function (e) {
    LogicManager.intersectionHandler(e)
  })
})