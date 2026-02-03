'use client';

import { useState, useRef } from 'react';

// CMYK Colors
const COLORS = {
  cyan: '#00FFFF',
  magenta: '#FF00FF',
  yellow: '#FFFF00',
  key: '#000000',
  bg: '#1a1a1a',
  surface: '#2a2a2a',
  text: '#FFFFFF',
  textMuted: '#888',
};

type MediaItem = {
  id: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
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
      background: COLORS.bg,
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
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.cyan }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.magenta }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.yellow }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.key, border: '1px solid #444' }} />
          </div>
          <h1 style={{
            fontSize: 14,
            fontWeight: 600,
            color: COLORS.text,
            letterSpacing: 2,
            textTransform: 'uppercase',
            margin: 0,
          }}>
            Photos & Videos
          </h1>
        </div>

        {/* Upload Button */}
        <button
          onClick={() => setShowUpload(true)}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: COLORS.magenta,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${COLORS.magenta}40`,
            transition: 'transform 0.1s',
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
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
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }} onClick={() => setShowUpload(false)}>
          <div style={{
            background: COLORS.surface,
            borderRadius: 24,
            padding: 32,
            width: '90%',
            maxWidth: 500,
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{
              fontSize: 16,
              fontWeight: 600,
              color: COLORS.text,
              margin: '0 0 24px',
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
                  height: 200,
                  borderRadius: 16,
                  background: '#1a1a1a',
                  border: `2px dashed ${COLORS.cyan}`,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={COLORS.cyan} strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span style={{ color: COLORS.textMuted, fontSize: 12 }}>
                  Click to select a photo or video
                </span>
              </button>
            ) : (
              <div style={{
                width: '100%',
                height: 200,
                borderRadius: 16,
                overflow: 'hidden',
                marginBottom: 20,
                position: 'relative',
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
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
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
                padding: 16,
                borderRadius: 12,
                background: '#1a1a1a',
                border: '1px solid #444',
                color: COLORS.text,
                fontSize: 14,
                resize: 'none',
                height: 80,
                marginBottom: 20,
                fontFamily: 'inherit',
              }}
            />

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowUpload(false)}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: 12,
                  background: 'transparent',
                  border: '1px solid #444',
                  color: COLORS.text,
                  fontSize: 14,
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
                  padding: '14px 20px',
                  borderRadius: 12,
                  background: selectedFile && newCaption ? COLORS.cyan : '#444',
                  border: 'none',
                  color: selectedFile && newCaption ? '#000' : '#888',
                  fontSize: 14,
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 16,
      }}>
        {mediaItems.map(item => (
          <div
            key={item.id}
            style={{
              background: COLORS.surface,
              borderRadius: 16,
              overflow: 'hidden',
            }}
          >
            {/* Media */}
            <div style={{
              width: '100%',
              height: 200,
              background: '#1a1a1a',
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
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: 16 }}>
              <p style={{
                fontSize: 13,
                color: COLORS.text,
                margin: '0 0 12px',
                lineHeight: 1.4,
              }}>
                {item.caption}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>
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
                    color: item.liked ? COLORS.magenta : COLORS.textMuted,
                    fontSize: 12,
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={item.liked ? COLORS.magenta : 'none'}
                    stroke={item.liked ? COLORS.magenta : 'currentColor'}
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
            padding: 60,
            color: COLORS.textMuted,
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1" style={{ marginBottom: 16 }}>
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
            <p style={{ fontSize: 14, margin: 0 }}>No photos or videos yet</p>
            <p style={{ fontSize: 12, margin: '8px 0 0' }}>Be the first to share!</p>
          </div>
        )}
      </div>
    </div>
  );
}
