'use client';

import { useState, useRef } from 'react';

// CMYK accent colors
const CMYK = {
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  yellow: '#FFFF00',
  key: '#1a1f3c',
};

type MediaItem = {
  id: string;
  type: 'photo' | 'video';
  url: string;
  caption: string;
  author: string;
  timestamp: Date;
  likes: number;
  liked: boolean;
};

export default function PhotosPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      type: 'photo',
      url: '',
      caption: 'Student artwork from today\'s critique session',
      author: 'Ms. Johnson',
      timestamp: new Date(),
      likes: 5,
      liked: false,
    },
  ]);
  const [showUpload, setShowUpload] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = () => {
    if (selectedFile && newCaption) {
      const newItem: MediaItem = {
        id: Date.now().toString(),
        type: selectedFile.type.startsWith('video') ? 'video' : 'photo',
        url: previewUrl,
        caption: newCaption,
        author: 'You',
        timestamp: new Date(),
        likes: 0,
        liked: false,
      };
      setMediaItems([newItem, ...mediaItems]);
      setShowUpload(false);
      setNewCaption('');
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  const toggleLike = (id: string) => {
    setMediaItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 }
          : item
      )
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAFAFA',
      fontFamily: "Helvetica, Arial, sans-serif",
      padding: 20,
    }}>
      {/* Header */}
      <div style={{
        maxWidth: 800,
        margin: '0 auto 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* CMYK dots */}
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', border: `2px solid ${CMYK.cyan}`, background: '#FFF' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', border: `2px solid ${CMYK.magenta}`, background: '#FFF' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', border: `2px solid ${CMYK.yellow}`, background: '#FFF' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', border: `2px solid ${CMYK.key}`, background: '#FFF' }} />
          </div>
          <h1 style={{
            fontSize: 14,
            fontWeight: 600,
            color: CMYK.key,
            letterSpacing: 2,
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Photos & Videos
          </h1>
        </div>

        {/* Upload Button - Magenta accent knob */}
        <button
          onClick={() => setShowUpload(true)}
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: '#FFFFFF',
            border: `2px solid ${CMYK.magenta}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 12px rgba(255,0,255,0.2)`,
            transition: 'transform 0.1s',
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CMYK.magenta} strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setShowUpload(false)}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: 28,
            width: '90%',
            maxWidth: 480,
            border: `1px solid ${CMYK.magenta}`,
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{
              fontSize: 15,
              fontWeight: 600,
              color: CMYK.key,
              margin: '0 0 20px',
              textAlign: 'center',
            }}>
              Share a Photo or Video
            </h2>

            {/* File Selection */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {!previewUrl ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%',
                  height: 180,
                  borderRadius: 16,
                  background: '#FAFAFA',
                  border: `2px dashed ${CMYK.cyan}`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={CMYK.cyan} strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span style={{ color: '#888', fontSize: 12 }}>
                  Click to select a photo or video
                </span>
              </button>
            ) : (
              <div style={{
                width: '100%',
                height: 180,
                borderRadius: 16,
                overflow: 'hidden',
                marginBottom: 16,
                position: 'relative',
                border: `1px solid #E8E8E8`,
              }}>
                {selectedFile?.type.startsWith('video') ? (
                  <video
                    src={previewUrl}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    controls
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl('');
                  }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: '#FFF',
                    border: `1px solid #E8E8E8`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Caption */}
            <textarea
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="Add a caption..."
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 12,
                background: '#FAFAFA',
                border: '1px solid #E8E8E8',
                color: CMYK.key,
                fontSize: 13,
                resize: 'none',
                height: 70,
                marginBottom: 16,
                fontFamily: 'inherit',
              }}
            />

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowUpload(false)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: '#FFFFFF',
                  border: '1px solid #E8E8E8',
                  color: CMYK.key,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !newCaption}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: '#FFFFFF',
                  border: selectedFile && newCaption ? `2px solid ${CMYK.cyan}` : '1px solid #E8E8E8',
                  color: selectedFile && newCaption ? CMYK.key : '#AAA',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: selectedFile && newCaption ? 'pointer' : 'not-allowed',
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16,
      }}>
        {mediaItems.map(item => (
          <div
            key={item.id}
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid #E8E8E8',
            }}
          >
            {/* Media */}
            <div style={{
              width: '100%',
              height: 180,
              background: '#F5F5F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {item.url ? (
                item.type === 'video' ? (
                  <video
                    src={item.url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    controls
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.caption}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DDD" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: 14 }}>
              <p style={{
                fontSize: 12,
                color: CMYK.key,
                margin: '0 0 10px',
                lineHeight: 1.4,
              }}>
                {item.caption}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 10, color: '#888' }}>
                  {item.author}
                </span>

                <button
                  onClick={() => toggleLike(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: item.liked ? CMYK.magenta : '#888',
                    fontSize: 11,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={item.liked ? CMYK.magenta : 'none'}
                    stroke={item.liked ? CMYK.magenta : 'currentColor'}
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {item.likes}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {mediaItems.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: 50,
            color: '#888',
          }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#DDD" strokeWidth="1" style={{ marginBottom: 12 }}>
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
            <p style={{ fontSize: 13, margin: 0 }}>No photos or videos yet</p>
            <p style={{ fontSize: 11, margin: '6px 0 0' }}>Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  );
}
