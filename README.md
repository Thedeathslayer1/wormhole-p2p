# 🌀 Wormhole P2P

A premium, high-speed peer-to-peer file transfer application designed for instant sharing between your phone and PC. No more sending photos to yourself on WhatsApp—just beam them directly.

## ✨ Features

- **Direct P2P**: Files are transferred directly between devices using WebRTC. Your data never touches a central storage server.
- **Instant Pairing**: Just scan the QR code on your PC with your phone to establish a secure link.
- **E2E Encrypted**: Transfers are encrypted end-to-end by default.
- **Cosmic UI**: A beautiful, space-themed interface with smooth glassmorphism and animations.
- **Desktop Ready**: Runs as a standalone desktop application on Windows.

## 🚀 How to Use

### 1. On your PC
- Open the project folder and double-click **`Launch-Wormhole.bat`**.
- This will open the Wormhole desktop window.
- You will see a **QR Code** and a "Waiting for connection" status.

### 2. On your Phone
- Scan the QR code displayed on your PC screen using your phone's camera or a QR scanner.
- Open the link in your mobile browser.
- *Note: Your phone and PC must be on the same Wi-Fi network.*

### 3. Beaming Files
- Once the status turns green (**Connected**), you can start sharing!
- **On Phone**: Tap the upload area to pick photos or files. They will instantly appear on your PC.
- **On PC**: You can also drag and drop files into the window to send them to your phone.

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Real-time**: PeerJS (WebRTC)
- **Desktop**: Electron
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Custom Glassmorphism)

## 📦 Developer Setup

If you want to run or modify the code manually:

```bash
# Install dependencies
npm install

# Run in development mode
npm run electron:dev

# Build for production (Windows Portable)
npm run electron:build
```

---
Built with ❤️ for instant sharing.
