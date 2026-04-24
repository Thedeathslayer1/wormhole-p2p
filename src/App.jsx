import React, { useState, useEffect, useRef } from 'react';
import Peer from 'peerjs';
import { QRCodeSVG } from 'qrcode.react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, CheckCircle, Smartphone, Monitor, ShieldCheck, Zap } from 'lucide-react';

const App = () => {
  const [peer, setPeer] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [connection, setConnection] = useState(null);
  const [connected, setConnected] = useState(false);
  const [files, setFiles] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [roomUrl, setRoomUrl] = useState('');
  
  const connRef = useRef(null);

  useEffect(() => {
    // Detect if we are on a mobile device or if room is in URL
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    
    const isMob = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || !!room;
    setIsMobile(isMob);

    const newPeer = new Peer();
    
    newPeer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      setPeerId(id);
      
      if (room) {
        // We are the sender (mobile)
        const conn = newPeer.connect(room);
        setupConnection(conn);
      } else {
        // We are the receiver (PC)
        const host = params.get('ip') || window.location.hostname;
        const currentUrl = `http://${host}:5173?room=${id}`;
        setRoomUrl(currentUrl);
      }
    });

    newPeer.on('connection', (conn) => {
      // Receiver side gets a connection
      setupConnection(conn);
    });

    setPeer(newPeer);

    return () => {
      if (newPeer) newPeer.destroy();
    };
  }, []);

  const setupConnection = (conn) => {
    conn.on('open', () => {
      setConnected(true);
      setConnection(conn);
      connRef.current = conn;
    });

    conn.on('data', (data) => {
      if (data.type === 'file') {
        const blob = new Blob([data.file], { type: data.fileType });
        const url = URL.createObjectURL(blob);
        
        // Auto-download on PC
        const a = document.createElement('a');
        a.href = url;
        a.download = data.fileName;
        a.click();
        
        setFiles(prev => [{
          name: data.fileName,
          size: data.fileSize,
          status: 'received',
          time: new Date().toLocaleTimeString()
        }, ...prev]);
      }
    });

    conn.on('close', () => {
      setConnected(false);
      setConnection(null);
    });
  };

  const onDrop = (acceptedFiles) => {
    if (!connRef.current || !connected) return;

    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        connRef.current.send({
          type: 'file',
          file: reader.result,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        });
        
        setFiles(prev => [{
          name: file.name,
          size: file.size,
          status: 'sent',
          time: new Date().toLocaleTimeString()
        }, ...prev]);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="app-container">
      <div className="stars">
        {[...Array(50)].map((_, i) => (
          <div 
            key={i} 
            className="star" 
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              '--duration': `${2 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="glass-card">
        <h1>Wormhole</h1>
        <p className="subtitle">Instant P2P File Transfer</p>

        {!connected ? (
          <>
            {!isMobile ? (
              <div className="pc-view">
                <div className="qr-container">
                  {roomUrl ? (
                    <QRCodeSVG value={roomUrl} size={200} />
                  ) : (
                    <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Zap className="animate-pulse" size={48} color="#8b5cf6" />
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                    Scan with your phone to start beaming files
                  </p>
                </div>
                <div className="status-indicator">
                  <div className="dot"></div>
                  <span>Waiting for connection...</span>
                </div>
              </div>
            ) : (
              <div className="mobile-view" style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem' }}>
                  <Smartphone size={64} color="#8b5cf6" style={{ marginBottom: '1rem' }} />
                  <h3>Connecting to PC...</h3>
                </div>
                <div className="status-indicator">
                  <div className="dot"></div>
                  <span>Searching for Wormhole...</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="transfer-view">
            <div className="status-indicator" style={{ marginBottom: '2rem' }}>
              <div className="dot connected"></div>
              <span>Connected to {isMobile ? 'PC' : 'Mobile'}</span>
            </div>

            <div {...getRootProps()} className={`drop-zone ${isDragActive ? 'active' : ''}`}>
              <input {...getInputProps()} />
              <Upload size={32} style={{ marginBottom: '1rem', color: '#8b5cf6' }} />
              <p>{isMobile ? 'Tap to select photos' : 'Drop files here or click'}</p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>
                Files are transferred directly via WebRTC
              </p>
            </div>

            <div className="file-list">
              {files.map((f, i) => (
                <div key={i} className="file-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <File size={18} color="#8b5cf6" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{f.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {(f.size / 1024 / 1024).toFixed(2)} MB • {f.time}
                      </div>
                    </div>
                  </div>
                  <CheckCircle size={18} color="#10b981" />
                </div>
              ))}
              {files.length === 0 && (
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', marginTop: '1rem' }}>
                  No files transferred yet
                </p>
              )}
            </div>
          </div>
        )}
        
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
            <ShieldCheck size={14} /> E2E Encrypted
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
            <Zap size={14} /> P2P Direct
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
