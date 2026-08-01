const { defineConfig } = require('vite');

module.exports = defineConfig({
  server: {
    // Allow the Jiro/Modal preview proxy to forward requests to the Vite dev server.
    allowedHosts: ['ta-01kyy2wa6x61e7c1zv940e48js-4173-ra9ahq2z6ng03164122v5g3sy.w.modal.host'],
  },
});
