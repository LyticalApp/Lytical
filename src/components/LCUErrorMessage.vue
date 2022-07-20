<template>
    <div class="errorDiv">
      <h1>{{message}}
          <i :title="title" class="icon-question-circle" aria-hidden="true"></i>
      </h1>
    </div>
</template>

<script>
export default {
  name: 'LCUErrorMessage',
  props: {
    message: {
      // The order of the teams is done in MatchHistoryItem
      type: String,
      default: 'LCU Disconnected',
    },
    title: {
      type: String,
      default: 'Unable to connect to League of Legends client (LCU). If it is open run Lytical as Administrator',
    },
  },
};
</script>

<style scoped>
.errorDiv {
  top:42px;
  background-color:#e84057;
  width:100%;
  position:fixed;
  z-index: 999;
}
</style>
