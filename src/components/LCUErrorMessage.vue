<template>
    <div class="errorDiv">
      <h1>{{message}}
          <i :title="title" class="icon-question-circle" aria-hidden="true"></i>
        <span v-if="isAdmin">✔️</span>
        <span v-else>❌</span>
      </h1>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron');

export default {
  name: 'LCUErrorMessage',
  props: {
    message: {
      type: String,
      default: 'LCU Disconnected',
    },
    title: {
      type: String,
      default: 'Unable to connect to League of Legends client (LCU). If it is open run Lytical as Administrator',
    },
  },
  data() {
    return {
      isAdmin: false,
    };
  },
  created() {
    ipcRenderer.on('asynchronous-reply', (event, data) => {
      if (data.reply_type === 'runLevel') {
        this.isAdmin = data.isAdmin;
      }
    });
    ipcRenderer.send('asynchronous-message', {
      id: 'getRunLevel',
    });
  },
};
</script>

<style scoped>
.errorDiv {
  top:42px;
  background-color: var(--error-background);
  width:100%;
  position:fixed;
  z-index: 999;
}
</style>
