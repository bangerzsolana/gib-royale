<script setup>
import { onMounted, onUnmounted } from 'vue'
import { launchGame, destroyGame } from './game/index.js'

onMounted(() => {
  launchGame()
})

onUnmounted(() => {
  destroyGame()
})
</script>

<template>
  <div id="game-container"></div>
</template>

<style scoped>
#game-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
}
</style>
