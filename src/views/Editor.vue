<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Two from "two.js";
import VectorProcessor from '../assets/classes/VectorProcessor'
import LabelInfo from "../components/LabelInfo.vue";

const colunas = ref<number | null>(null)
const linhas = ref<number | null>(null)
const widthDistance = ref<number | null>(null)
const heightDistance = ref<number | null>(null)
const tool = ref<'barra' | 'apoio-fixo' | 'apoio-movel' | 'forcas' | null>(null)
const svgContainer = ref<HTMLDivElement>()

let VectorProcessorInstance: VectorProcessor

onMounted(() => {
  colunas.value = 3
  linhas.value = 2
  widthDistance.value = 4
  heightDistance.value = 2
  tool.value = null
})

const gerarGrade = () => {
  console.table({
    colunas: colunas.value,
    linhas: linhas.value,
    widthDistance: widthDistance.value,
    heightDistance: heightDistance.value,
    tool: tool.value,
  });

  VectorProcessorInstance = new VectorProcessor({
    colunas: colunas.value!,
    linhas: linhas.value!,
    widthDistance: widthDistance.value!,
    heightDistance: heightDistance.value!,
    containerElement: svgContainer.value!
  })

}
</script>

<style scoped>

</style>

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
                    <label-info input-for="input-horizontal" popup="Máximo tamanho na horizontal em metros (m)"
                      placement="top">
                      Dist. X (m)
                    </label-info>
                    <input id="input-horizontal" class="form-control" type="number" name="Linhas" data-toggle="tooltip"
                      data-placement="top" title="" placeholder="Ex: 5" v-model="widthDistance">
                  </div>
                </div>
                <div class="col pl-1">
                  <div class="form-group">
                    <label-info input-for="input-vertical" popup="Máximo tamanho na vertical em metros (m)"
                      placement="top">
                      Dist. Y (m)
                    </label-info>
                    <input id="input-vertical" class="form-control" type="number" name="Linhas" placeholder="Ex: 5"
                      v-model="heightDistance">
                  </div>
                </div>
              </div>
              <small class="text-dark">*Ao gerar a grade, a tela será resetada.</small>
              <button id="gerar-grade" class="btn btn-info" type="button" @click="gerarGrade">Gerar Grade</button>
              <hr class="d-sm-none d-md-block">
            </div>
            <div class="col-sm-6 col-md-12 align-self-sm-end">
              <div class="list-group btn-group-toggle" data-toggle="buttons">
                <label-info class="btn btn-secondary mb-1 draw-option" input-for="barra" placement="top"
                  popup="Escolha dois pontos na grade para gerar a barra. Para excluir, clique com o botão direito na barra desejada.">
                  <input type="radio" name="draw-option" id="barra" autocomplete="off" checked>
                  Barra
                </label-info>
                <label-info class="btn btn-secondary mb-1 draw-option" input-for="apoio-movel" placement="top"
                  popup="Escolha um ponto na grade para gerar o apoio, somente um poderá ser criado">
                  <input type="radio" name="draw-option" id="apoio-movel" autocomplete="off">
                  Apoio Móvel
                </label-info>
                <label-info class="btn btn-secondary mb-1 draw-option" input-for="apoio-fixo" placement="top"
                  popup="Escolha um ponto na grade para gerar o apoio, somente um poderá ser criado">
                  <input type="radio" name="draw-option" id="apoio-fixo" autocomplete="off">
                  Apoio Fixo
                </label-info>
                <label-info class="btn btn-secondary mb-1 draw-option" input-for="forcas" placement="top"
                  popup="Clique e arraste para adicionar uma força a extremidade de uma barra">
                  <input type="radio" name="draw-option" id="forcas" autocomplete="off"> Forças
                </label-info>
              </div>
              <hr class="d-sm-none d-md-block">
              <button class="btn btn-danger" type="button">Calcular</button>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-8 col-lg-9 mb-sm-5 mb-md-0 mb-lg-0 content">
          <div id="draw-animation" style="touch-action: none;" ref="svgContainer"></div>
        </div>
      </div>
    </div>
  </div>
</template>



