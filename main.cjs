const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const address = require('address');
const server = express();
const PORT = 5173;

const isDev = process.env.NODE_ENV === 'development';
const localIP = address.ip();

// Start a local server to serve the app to the network
if (!isDev) {
  server.use(express.static(path.join(__dirname, 'dist')));
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 480,
    height: 780,
    title: "Wormhole",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    backgroundColor: '#050508',
  });

  // Pass the local IP to the frontend via a global variable or custom protocol
  // Or just let the frontend detect it if it's being served from that IP
  if (isDev) {
    win.loadURL(`http://localhost:${PORT}`);
  } else {
    win.loadURL(`http://localhost:${PORT}?ip=${localIP}`);
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
