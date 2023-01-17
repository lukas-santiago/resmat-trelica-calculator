<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Popper from "vue3-popper";
import LabelInfo from "@/components/LabelInfo.vue";


let colunas = ref<number | null>(null),
  linhas = ref<number | null>(null),
  widthDistance = ref<number | null>(null),
  heightDistance = ref<number | null>(null),
  tool = ref<'barra' | 'apoio-fixo' | 'apoio-movel' | 'forcas' | null>(null)

onMounted(() => {
  colunas.value = 3
  linhas.value = 2
  widthDistance.value = 4
  heightDistance.value = 2
  tool.value = null
})

const calculate = () => {
  console.table({
    colunas: colunas.value,
    linhas: linhas.value,
    widthDistance: widthDistance.value,
    heightDistance: heightDistance.value,
    tool: tool.value,
  })
}
</script>

<template>
  <div class="wrapper">
    <div class="container-app">
      <div class="row h-100">
        <div class="col-sm-12 col-md-4 col-lg-3 sidebar">
          <div class="row">
            <div class="col-sm-6 col-md-12">
              <div class="row">
                <div class="col pr-1">
                  <div class="form-group">
                    <label for="input-colunas">Colunas</label>
                    <input id="input-colunas" class="form-control" type="number" name="Colunas" placeholder="Ex: 5"
                      aria-label="Colunas" aria-describedby="input-colunas" min="2" max="13" v-model="colunas">
                  </div>
                </div>
                <div class="col pl-1">
                  <div class="form-group">
                    <label for="input-linhas">Linhas</label>
                    <input id="input-linhas" class="form-control" type="number" name="Linhas" placeholder="Ex: 5"
                      aria-label="Ex: 5" aria-describedby="input-linhas" min="2" max="13" v-model="linhas">
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col pr-1">
                  <div class="form-group">
                    <label-info input-for="input-horizontal" text="Dist. X (m)"
                      popup="Máximo tamanho na horizontal em metros (m)" placement="top"></label-info>
                    <input id="input-horizontal" class="form-control" type="number" name="Linhas" data-toggle="tooltip"
                      data-placement="top" title="" placeholder="Ex: 5" v-model="widthDistance">
                  </div>
                </div>
                <div class="col pl-1">
                  <div class="form-group">
                    <label-info input-for="input-vertical" text="Dist. Y (m)"
                      popup="Máximo tamanho na vertical em metros (m)" placement="top"></label-info>
                    <input id="input-vertical" class="form-control" type="number" name="Linhas" placeholder="Ex: 5"
                      v-model="heightDistance">
                  </div>
                </div>
              </div>
              <small class="text-dark">*Ao gerar a grade, a tela será resetada.</small>
              <button id="gerar-grade" class="btn btn-info" type="button">Gerar Grade</button>
              <hr class="d-sm-none d-md-block">
            </div>
            <div class="col-sm-6 col-md-12 align-self-sm-end">
              <div class="list-group btn-group-toggle" data-toggle="buttons">
                <label class="btn btn-secondary mb-1 draw-option" for="barra" data-toggle="tooltip" data-placement="top"
                  title="Escolha dois pontos na grade para gerar a barra. Para excluir, clique com o botão direito na barra desejada.">
                  <input type="radio" name="draw-option" id="barra" autocomplete="off" checked> Barra
                </label>
                <label class="btn btn-secondary mb-1 draw-option" for="apoio-movel" data-toggle="tooltip"
                  data-placement="top"
                  title="Escolha um ponto na grade para gerar o apoio, somente um poderá ser criado">
                  <input type="radio" name="draw-option" id="apoio-movel" autocomplete="off">
                  Apoio Móvel
                </label>
                <label class="btn btn-secondary mb-1 draw-option" for="apoio-fixo" data-toggle="tooltip"
                  data-placement="top"
                  title="Escolha um ponto na grade para gerar o apoio, somente um poderá ser criado">
                  <input type="radio" name="draw-option" id="apoio-fixo" autocomplete="off">
                  Apoio Fixo
                </label>
                <label class="btn btn-secondary mb-1 draw-option" for="forcas" data-toggle="tooltip"
                  data-placement="top" title="Clique e arraste para adicionar uma força a extremidade de uma barra">
                  <input type="radio" name="draw-option" id="forcas" autocomplete="off"> Forças
                </label>
              </div>
              <hr class="d-sm-none d-md-block">
              <button class="btn btn-danger" type="button" @click="calculate()">Calcular</button>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-8 col-lg-9 mb-sm-5 mb-md-0 mb-lg-0 content">
          <div id="draw-animation" style="touch-action: none;"></div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>

</style>
