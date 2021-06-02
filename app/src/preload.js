// eslint-disable-next-line @typescript-eslint/no-var-requires
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  search: (pattern) => {
    ipcRenderer.send('search', pattern);

    return new Promise((resolve) => {
      ipcRenderer.once('search-reply', (event, response) => resolve(response));
    });
  },
});
