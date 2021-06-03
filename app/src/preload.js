// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  search: (query) => {
    ipcRenderer.send('search', query);

    return new Promise((resolve) => {
      ipcRenderer.once('search-reply', (event, response) => resolve(response));
    });
  },
});
