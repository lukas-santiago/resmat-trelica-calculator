import Popper from 'vue3-popper';

<template>
    <label :for="inputFor">
        <slot />
        <Popper :content="popup" :placement="placement" hover openDelay="200" closeDelay="100">
            <v-icon name="bi-info-circle"></v-icon>
        </Popper>
    </label>
</template>

<script setup lang="ts">
defineProps([
    'popup',
    'placement',
    'inputFor',
])
</script>

<style scoped>
label {
    --popper-theme-background-color: #333333;
    --popper-theme-background-color-hover: #333333;
    --popper-theme-text-color: #ffffff;
    --popper-theme-border-width: 0px;
    --popper-theme-border-style: solid;
    --popper-theme-border-radius: 0.5em;
    --popper-theme-padding: 0.5em;
    --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}
</style>
