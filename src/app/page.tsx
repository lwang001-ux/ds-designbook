'use client';

import { useState, useEffect, useRef } from 'react';

// Clean white with CMYK accents - lighter borders, more rounded
const COLORS = {
  bg: '#FFFFFF',
  bgLight: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceLight: '#F5F5F5',
  border: '#E8E8E8',
  borderLight: '#D0D0D0',
  text: '#1a1f3c',
  textMuted: '#888888',
  accent: '#00D4FF',
  accentGlow: 'rgba(0, 212, 255, 0.2)',
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  dotGrid: 'rgba(0, 212, 255, 0.15)',
  shadow: 'rgba(0,0,0,0.05)',
  online: '#2ECC71',
  whatsapp: '#25D366',
  facetime: '#34C759',
  voice: '#E74C3C',
  // CMYK for accents
  cyan: '#00D4FF',
  magenta: '#EC008C',
  yellow: '#FFE500',
  key: '#1a1f3c',
}

// Avatar style types
type AvatarStyle = 'block' | 'manga' | 'bird' | 'animal' | 'robot';

// Avatar Editor Component - multiple styles for teachers
function AvatarEditor({ onClose, onSave }: { onClose: () => void; onSave: (config: AvatarConfig) => void }) {
  const [style, setStyle] = useState<AvatarStyle>('block');
  const [hair, setHair] = useState('short');
  const [accessory, setAccessory] = useState('none');
  const [color, setColor] = useState<'cyan' | 'magenta' | 'yellow' | 'key'>('cyan');

  const styleOptions: AvatarStyle[] = ['block', 'manga', 'bird', 'animal', 'robot'];
  const hairOptions = ['none', 'short', 'long', 'bangs', 'bob', 'curly', 'afro', 'punk', 'bun'];
  const accessoryOptions = ['none', 'glasses', 'baseball', 'hat', 'earrings', 'headphones'];
  const colorOptions: Array<'cyan' | 'magenta' | 'yellow' | 'key'> = ['cyan', 'magenta', 'yellow', 'key'];
  const animalOptions = ['cat', 'dog', 'owl', 'fox', 'bear', 'bunny'];
  const robotOptions = ['classic', 'android', 'retro', 'cute'];
  const birdOptions = ['sparrow', 'parrot', 'penguin', 'flamingo', 'toucan', 'peacock'];

  const colorMap = {
    cyan: '#00D4FF',
    magenta: '#EC008C',
    yellow: '#FFE500',
    key: '#1a1f3c',
  };

  // Render avatar preview based on style
  const renderAvatarPreview = () => {
    switch(style) {
      case 'manga':
        return <MangaAvatar color={colorMap[color]} size={100} />;
      case 'bird':
        return <BirdAvatar bird={hair} color={colorMap[color]} size={100} />;
      case 'animal':
        return <AnimalAvatar animal={hair} color={colorMap[color]} size={100} />;
      case 'robot':
        return <RobotAvatar variant={accessory} color={colorMap[color]} size={100} />;
      default:
        return <BlockAvatarCustom hair={hair} accessory={accessory} size={100} />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        minWidth: 380,
        maxWidth: 420,
        border: `1px solid ${colorMap[color]}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{ color: '#1a1f3c', fontSize: 15, margin: '0 0 20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colorMap[color]} strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Create Your Avatar
        </h3>

        {/* Style Selection */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: '#888', display: 'block', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>Avatar Style</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {styleOptions.map(s => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                style={{
                  flex: 1,
                  padding: '8px 6px',
                  background: style === s ? '#FAFAFA' : '#FFFFFF',
                  border: style === s ? `1px solid ${colorMap[color]}` : '1px solid #E8E8E8',
                  borderRadius: 8,
                  fontSize: 9,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  color: style === s ? colorMap[color] : '#888',
                  fontWeight: style === s ? 600 : 400,
                  borderBottom: style === s ? `2px dotted ${colorMap[color]}` : undefined,
                  transition: 'all 0.15s ease',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: '#FAFAFA',
            border: `1px solid ${colorMap[color]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            {renderAvatarPreview()}
            {/* CMYK accent ring */}
            <div style={{
              position: 'absolute',
              inset: -4,
              borderRadius: '50%',
              border: `1px dashed ${colorMap[color]}`,
              opacity: 0.5,
            }} />
          </div>
        </div>

        {/* Color Selection */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 10, fontWeight: 600, color: '#888', display: 'block', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>Accent Color</label>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            {colorOptions.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: color === c ? `2px solid ${colorMap[c]}` : `1px solid ${colorMap[c]}`,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 4,
                  borderRadius: '50%',
                  border: `2px solid ${colorMap[c]}`,
                }} />
              </button>
            ))}
          </div>
        </div>

        {/* Style-specific options */}
        {style === 'block' && (
          <>
            {/* Hair Style */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: '#888', display: 'block', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>Hair Style</label>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {hairOptions.map(h => (
                  <button
                    key={h}
                    onClick={() => setHair(h)}
                    style={{
                      padding: '5px 10px',
                      background: hair === h ? '#FAFAFA' : '#FFFFFF',
                      border: hair === h ? `1px solid ${colorMap[color]}` : '1px solid #E8E8E8',
                      borderRadius: 12,
                      fontSize: 9,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      color: hair === h ? colorMap[color] : '#888',
                      fontWeight: hair === h ? 500 : 400,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessory */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 10, fontWeight: 600, color: '#888', display: 'block', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>Accessory</label>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {accessoryOptions.map(a => (
                  <button
                    key={a}
                    onClick={() => setAccessory(a)}
                    style={{
                      padding: '5px 10px',
                      background: accessory === a ? '#FAFAFA' : '#FFFFFF',
                      border: accessory === a ? `1px solid ${colorMap[color]}` : '1px solid #E8E8E8',
                      borderRadius: 12,
                      fontSize: 9,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      color: accessory === a ? colorMap[color] : '#888',
                      fontWeight: accessory === a ? 500 : 400,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {style === 'animal' && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: '#888', display: 'block', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>Animal Type</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {animalOptions.map(a => (
                <button
                  key={a}
                  onClick={() => setHair(a)}
                  style={{
                    padding: '5px 10px',
                    background: hair === a ? '#FAFAFA' : '#FFFFFF',
                    border: hair === a ? `1px solid ${colorMap[color]}` : '1px solid #E8E8E8',
                    borderRadius: 12,
                    fontSize: 9,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    color: hair === a ? colorMap[color] : '#888',
                    fontWeight: hair === a ? 500 : 400,
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        )}

        {style === 'robot' && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: '#888', display: 'block', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>Robot Type</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {robotOptions.map(r => (
                <button
                  key={r}
                  onClick={() => setAccessory(r)}
                  style={{
                    padding: '5px 10px',
                    background: accessory === r ? '#FAFAFA' : '#FFFFFF',
                    border: accessory === r ? `1px solid ${colorMap[color]}` : '1px solid #E8E8E8',
                    borderRadius: 12,
                    fontSize: 9,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    color: accessory === r ? colorMap[color] : '#888',
                    fontWeight: accessory === r ? 500 : 400,
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {style === 'bird' && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 10, fontWeight: 600, color: '#888', display: 'block', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>Bird Type</label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {birdOptions.map(b => (
                <button
                  key={b}
                  onClick={() => setHair(b)}
                  style={{
                    padding: '5px 10px',
                    background: hair === b ? '#FAFAFA' : '#FFFFFF',
                    border: hair === b ? `1px solid ${colorMap[color]}` : '1px solid #E8E8E8',
                    borderRadius: 12,
                    fontSize: 9,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    color: hair === b ? colorMap[color] : '#888',
                    fontWeight: hair === b ? 500 : 400,
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Photo Upload Concept */}
        <div style={{
          marginBottom: 20,
          padding: 12,
          background: '#FAFAFA',
          borderRadius: 12,
          border: '1px dashed #D0D0D0',
          textAlign: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{ marginBottom: 6 }}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p style={{ fontSize: 10, color: '#888', margin: '0 0 8px', lineHeight: 1.4 }}>
            Upload your photo and we'll create a cartoon version
          </p>
          <button style={{
            padding: '6px 14px',
            background: '#FFFFFF',
            border: `1px solid ${colorMap[color]}`,
            borderRadius: 16,
            color: colorMap[color],
            fontSize: 9,
            fontWeight: 500,
            cursor: 'pointer',
          }}>
            Upload Photo (Coming Soon)
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px',
              background: '#FFFFFF',
              border: '1px solid #E8E8E8',
              borderRadius: 12,
              color: '#888',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ style, hair, accessory, color })}
            style={{
              flex: 1,
              padding: '10px',
              background: '#FFFFFF',
              border: `1px solid ${colorMap[color]}`,
              borderRadius: 12,
              color: colorMap[color],
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save Avatar
          </button>
        </div>
      </div>
    </div>
  );
}

// Manga style avatar - Noun Project style minimal line icon
function MangaAvatar({ color, size = 32 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Simple face outline */}
      <circle cx="20" cy="20" r="14" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Big anime eyes - simple */}
      <ellipse cx="14" cy="18" rx="3" ry="4" stroke={color} strokeWidth="1.5" fill="none" />
      <ellipse cx="26" cy="18" rx="3" ry="4" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Eye highlights */}
      <circle cx="14" cy="17" r="1" fill={color} />
      <circle cx="26" cy="17" r="1" fill={color} />
      {/* Simple smile */}
      <path d="M15 26c2.5 2 7.5 2 10 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Hair bangs - simple lines */}
      <path d="M10 12c2-4 6-6 10-6s8 2 10 6" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M12 14l2-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 14l-2-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Bird avatars - Noun Project style minimal line icons
function BirdAvatar({ bird, color, size = 32 }: { bird: string; color: string; size?: number }) {
  const renderBird = () => {
    switch(bird) {
      case 'parrot':
        return (
          <>
            {/* Simple body */}
            <ellipse cx="20" cy="26" rx="8" ry="10" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Head */}
            <circle cx="20" cy="12" r="7" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Curved beak */}
            <path d="M27 12c3 0 4 2 3 4" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Eye */}
            <circle cx="22" cy="11" r="1.5" fill={color} />
            {/* Crest */}
            <path d="M15 7c-1-3 1-5 3-3" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        );
      case 'penguin':
        return (
          <>
            {/* Body */}
            <ellipse cx="20" cy="22" rx="10" ry="14" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Belly */}
            <ellipse cx="20" cy="24" rx="6" ry="9" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Eyes */}
            <circle cx="16" cy="14" r="1.5" fill={color} />
            <circle cx="24" cy="14" r="1.5" fill={color} />
            {/* Beak */}
            <path d="M18 18l2 4 2-4" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          </>
        );
      case 'flamingo':
        return (
          <>
            {/* S-curved neck */}
            <path d="M20 36c0-6-4-10-4-18c0-5 3-8 6-8" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Head */}
            <circle cx="24" cy="10" r="5" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Bent beak */}
            <path d="M29 11c2 0 3 1 2 3" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Eye */}
            <circle cx="25" cy="9" r="1" fill={color} />
            {/* Long leg */}
            <line x1="20" y1="36" x2="20" y2="40" stroke={color} strokeWidth="1.5" />
          </>
        );
      case 'toucan':
        return (
          <>
            {/* Body */}
            <ellipse cx="16" cy="26" rx="8" ry="8" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Head */}
            <circle cx="22" cy="14" r="6" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Large beak */}
            <path d="M28 14c6 0 8 3 6 5c-2 2-8 1-6-2" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Eye */}
            <circle cx="24" cy="13" r="1.5" fill={color} />
          </>
        );
      case 'peacock':
        return (
          <>
            {/* Body */}
            <ellipse cx="20" cy="32" rx="5" ry="5" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Neck and head */}
            <circle cx="20" cy="18" r="4" stroke={color} strokeWidth="1.5" fill="none" />
            <line x1="20" y1="22" x2="20" y2="27" stroke={color} strokeWidth="1.5" />
            {/* Crown */}
            <line x1="18" y1="14" x2="16" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="14" x2="20" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="22" y1="14" x2="24" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            {/* Eye */}
            <circle cx="21" cy="17" r="1" fill={color} />
            {/* Tail fan - simple arcs */}
            <path d="M10 28c-2-8 2-16 10-20" stroke={color} strokeWidth="1.5" fill="none" />
            <path d="M30 28c2-8-2-16-10-20" stroke={color} strokeWidth="1.5" fill="none" />
          </>
        );
      default: // sparrow
        return (
          <>
            {/* Body */}
            <ellipse cx="18" cy="24" rx="10" ry="7" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Head */}
            <circle cx="26" cy="16" r="6" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Eye */}
            <circle cx="28" cy="15" r="1.5" fill={color} />
            {/* Beak */}
            <path d="M32 16l4 1-4 1" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            {/* Wing */}
            <path d="M12 22c4-2 8-2 10 2" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Tail */}
            <path d="M8 24l-4-2v6z" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          </>
        );
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {renderBird()}
    </svg>
  );
}

// Animal avatars - Noun Project style minimal line icons
function AnimalAvatar({ animal, color, size = 32 }: { animal: string; color: string; size?: number }) {
  const renderAnimal = () => {
    switch(animal) {
      case 'cat':
        return (
          <>
            {/* Face */}
            <circle cx="20" cy="22" r="12" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Pointed ears */}
            <path d="M10 14L8 4L16 12" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            <path d="M30 14L32 4L24 12" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            {/* Eyes */}
            <line x1="14" y1="18" x2="14" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="18" x2="26" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
            {/* Nose and mouth */}
            <path d="M20 24l-2 3h4l-2-3" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Whiskers */}
            <line x1="6" y1="24" x2="14" y2="25" stroke={color} strokeWidth="1.5" />
            <line x1="34" y1="24" x2="26" y2="25" stroke={color} strokeWidth="1.5" />
          </>
        );
      case 'owl':
        return (
          <>
            {/* Body */}
            <ellipse cx="20" cy="24" rx="12" ry="12" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Ear tufts */}
            <path d="M10 16L8 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M30 16L32 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            {/* Big eyes */}
            <circle cx="14" cy="20" r="5" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="26" cy="20" r="5" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="14" cy="20" r="2" fill={color} />
            <circle cx="26" cy="20" r="2" fill={color} />
            {/* Beak */}
            <path d="M18 26l2 4 2-4" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          </>
        );
      case 'fox':
        return (
          <>
            {/* Pointed face */}
            <path d="M20 34L8 18L12 8h16l4 10z" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            {/* Ears */}
            <path d="M12 8L10 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M28 8L30 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="14" cy="18" r="1.5" fill={color} />
            <circle cx="26" cy="18" r="1.5" fill={color} />
            {/* Nose */}
            <circle cx="20" cy="28" r="2" fill={color} />
          </>
        );
      case 'bunny':
        return (
          <>
            {/* Face */}
            <ellipse cx="20" cy="26" rx="10" ry="10" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Long ears */}
            <ellipse cx="14" cy="8" rx="3" ry="10" stroke={color} strokeWidth="1.5" fill="none" />
            <ellipse cx="26" cy="8" rx="3" ry="10" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Eyes */}
            <circle cx="15" cy="24" r="1.5" fill={color} />
            <circle cx="25" cy="24" r="1.5" fill={color} />
            {/* Nose */}
            <ellipse cx="20" cy="29" rx="1.5" ry="1" fill={color} />
            {/* Mouth */}
            <path d="M18 31c1 2 3 2 4 0" stroke={color} strokeWidth="1.5" fill="none" />
          </>
        );
      case 'bear':
        return (
          <>
            {/* Face */}
            <circle cx="20" cy="22" r="14" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Round ears */}
            <circle cx="8" cy="12" r="4" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="32" cy="12" r="4" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Eyes */}
            <circle cx="14" cy="20" r="2" fill={color} />
            <circle cx="26" cy="20" r="2" fill={color} />
            {/* Snout */}
            <ellipse cx="20" cy="28" rx="5" ry="4" stroke={color} strokeWidth="1.5" fill="none" />
            <ellipse cx="20" cy="26" rx="2" ry="1.5" fill={color} />
          </>
        );
      default: // dog
        return (
          <>
            {/* Face */}
            <circle cx="20" cy="22" r="12" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Floppy ears */}
            <ellipse cx="6" cy="20" rx="4" ry="8" stroke={color} strokeWidth="1.5" fill="none" />
            <ellipse cx="34" cy="20" rx="4" ry="8" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Eyes */}
            <circle cx="14" cy="20" r="2" fill={color} />
            <circle cx="26" cy="20" r="2" fill={color} />
            {/* Nose */}
            <ellipse cx="20" cy="26" rx="3" ry="2" fill={color} />
            {/* Tongue */}
            <path d="M18 30c1 3 3 3 4 0" stroke={color} strokeWidth="1.5" fill="none" />
          </>
        );
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {renderAnimal()}
    </svg>
  );
}

// Robot avatars - Noun Project style minimal line icons
function RobotAvatar({ variant, color, size = 32 }: { variant: string; color: string; size?: number }) {
  const renderRobot = () => {
    switch(variant) {
      case 'android':
        return (
          <>
            {/* Head */}
            <rect x="8" y="10" width="24" height="22" rx="4" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Antenna */}
            <line x1="20" y1="10" x2="20" y2="4" stroke={color} strokeWidth="1.5" />
            <circle cx="20" cy="3" r="2" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Eyes - LED style */}
            <rect x="12" y="18" width="4" height="2" rx="1" fill={color} />
            <rect x="24" y="18" width="4" height="2" rx="1" fill={color} />
            {/* Mouth - speaker */}
            <rect x="14" y="26" width="12" height="3" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
          </>
        );
      case 'retro':
        return (
          <>
            {/* Boxy head */}
            <rect x="6" y="8" width="28" height="26" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Antenna */}
            <line x1="14" y1="8" x2="14" y2="2" stroke={color} strokeWidth="1.5" />
            <line x1="26" y1="8" x2="26" y2="2" stroke={color} strokeWidth="1.5" />
            <circle cx="14" cy="2" r="1.5" fill={color} />
            <circle cx="26" cy="2" r="1.5" fill={color} />
            {/* Screen */}
            <rect x="10" y="12" width="20" height="16" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Pixel eyes */}
            <rect x="14" y="16" width="3" height="3" fill={color} />
            <rect x="23" y="16" width="3" height="3" fill={color} />
            {/* Pixel smile */}
            <path d="M14 24h2v2h6v-2h2" stroke={color} strokeWidth="1.5" fill="none" />
          </>
        );
      case 'cute':
        return (
          <>
            {/* Round head */}
            <circle cx="20" cy="20" r="14" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Ear bolts */}
            <circle cx="6" cy="20" r="3" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="34" cy="20" r="3" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Antenna */}
            <line x1="20" y1="6" x2="20" y2="2" stroke={color} strokeWidth="1.5" />
            <circle cx="20" cy="1" r="2" fill={color} />
            {/* Eyes */}
            <circle cx="14" cy="18" r="4" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="26" cy="18" r="4" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="14" cy="18" r="1.5" fill={color} />
            <circle cx="26" cy="18" r="1.5" fill={color} />
            {/* Smile */}
            <path d="M14 26c3 4 9 4 12 0" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        );
      default: // classic
        return (
          <>
            {/* Head */}
            <rect x="8" y="8" width="24" height="28" rx="3" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Antenna */}
            <line x1="20" y1="8" x2="20" y2="2" stroke={color} strokeWidth="1.5" />
            <circle cx="20" cy="2" r="2" stroke={color} strokeWidth="1.5" fill="none" />
            {/* Eyes */}
            <circle cx="14" cy="18" r="3" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="26" cy="18" r="3" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="14" cy="18" r="1.5" fill={color} />
            <circle cx="26" cy="18" r="1.5" fill={color} />
            {/* Mouth */}
            <line x1="14" y1="28" x2="26" y2="28" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {renderRobot()}
    </svg>
  );
}

// Custom Block Avatar with explicit hair/accessory props
function BlockAvatarCustom({ hair, accessory, size = 32 }: { hair: string; accessory: string; size?: number }) {
  // Render hair based on selection
  const renderHair = () => {
    switch(hair) {
      case 'short':
        return <path d="M12 14c0-4 16-4 16 0v2H12v-2z" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />;
      case 'long':
        return (
          <g>
            <path d="M10 14c0-6 20-6 20 0v3H10v-3z" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <path d="M10 17v8" stroke="#1a1f3c" strokeWidth="0.5" />
            <path d="M30 17v8" stroke="#1a1f3c" strokeWidth="0.5" />
          </g>
        );
      case 'curly':
        return (
          <g>
            <path d="M11 14c0-5 18-5 18 0v2H11v-2z" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <circle cx="12" cy="12" r="2.5" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <circle cx="17" cy="10" r="2" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <circle cx="23" cy="10" r="2" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <circle cx="28" cy="12" r="2.5" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
          </g>
        );
      case 'punk':
        // Punk rock mohawk - pointed swoops
        return (
          <g>
            <path d="M14 14c0-3 12-3 12 0" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <path d="M16 14c-2-4-4-8 0-10c2 4 1 8 0 10" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <path d="M20 14c-1-5-2-10 0-12c2 5 1 10 0 12" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <path d="M24 14c0-4 2-8 0-10c-2 4-1 8 0 10" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
          </g>
        );
      case 'afro':
        // Full round afro
        return (
          <g>
            <circle cx="20" cy="10" r="10" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <path d="M12 14c0-2 16-2 16 0" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <circle cx="13" cy="8" r="2" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <circle cx="27" cy="8" r="2" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <circle cx="20" cy="3" r="2" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
          </g>
        );
      case 'bangs':
        // Straight bangs with side hair
        return (
          <g>
            <path d="M10 14c0-6 20-6 20 0v2H10v-2z" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <line x1="12" y1="16" x2="28" y2="16" stroke="#1a1f3c" strokeWidth="0.5" />
            <line x1="14" y1="14" x2="14" y2="18" stroke="#1a1f3c" strokeWidth="0.5" />
            <line x1="18" y1="14" x2="18" y2="18" stroke="#1a1f3c" strokeWidth="0.5" />
            <line x1="22" y1="14" x2="22" y2="18" stroke="#1a1f3c" strokeWidth="0.5" />
            <line x1="26" y1="14" x2="26" y2="18" stroke="#1a1f3c" strokeWidth="0.5" />
          </g>
        );
      case 'bob':
        // Bob haircut - rounded ends at chin level
        return (
          <g>
            <path d="M8 14c0-7 24-7 24 0v10c0 3-4 4-6 3" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <path d="M32 24c-2 1-4 0-4-3" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <path d="M8 24c2 1 4 0 4-3" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <path d="M10 14h20" stroke="#1a1f3c" strokeWidth="0.5" />
          </g>
        );
      case 'bun':
        // Top knot bun
        return (
          <g>
            <path d="M12 14c0-4 16-4 16 0v2H12v-2z" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <ellipse cx="20" cy="7" rx="5" ry="4" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <path d="M17 10c1-2 5-2 6 0" stroke="#1a1f3c" strokeWidth="0.5" />
          </g>
        );
      default:
        return null;
    }
  };

  // Render accessory based on selection
  const renderAccessory = () => {
    switch(accessory) {
      case 'glasses':
        return (
          <g>
            <circle cx="14" cy="21" r="3.5" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <circle cx="26" cy="21" r="3.5" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <line x1="17.5" y1="21" x2="22.5" y2="21" stroke="#1a1f3c" strokeWidth="0.5" />
            <line x1="10" y1="21" x2="10.5" y2="21" stroke="#1a1f3c" strokeWidth="0.5" />
            <line x1="29.5" y1="21" x2="30" y2="21" stroke="#1a1f3c" strokeWidth="0.5" />
          </g>
        );
      case 'hat':
        // Generic beanie/cap
        return (
          <g>
            <rect x="8" y="11" width="24" height="3" rx="1" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <path d="M10 11c0-6 20-6 20 0" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
          </g>
        );
      case 'baseball':
        // Baseball cap with curved brim
        return (
          <g>
            <path d="M8 14c0-7 24-7 24 0" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <path d="M8 14h24" stroke="#1a1f3c" strokeWidth="0.5" />
            <path d="M6 14c0 0 -2 1 -2 3c0 2 4 2 6 1" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <circle cx="20" cy="8" r="1" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
          </g>
        );
      case 'earrings':
        return (
          <g>
            <circle cx="9" cy="25" r="2" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <circle cx="31" cy="25" r="2" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
          </g>
        );
      case 'headphones':
        return (
          <g>
            <path d="M10 14c0-8 20-8 20 0" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <ellipse cx="8" cy="22" rx="2" ry="4" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
            <ellipse cx="32" cy="22" rx="2" ry="4" fill="none" stroke="#1a1f3c" strokeWidth="0.5" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Head */}
      <rect x="10" y="14" width="20" height="18" rx="3" fill="#FFFFFF" stroke="#1a1f3c" strokeWidth="0.5" />
      {/* Hair */}
      {renderHair()}
      {/* Eyes */}
      <circle cx="15" cy="22" r="1.5" fill="#1a1f3c" />
      <circle cx="25" cy="22" r="1.5" fill="#1a1f3c" />
      {/* Smile */}
      <path d="M15 27c2.5 2 7.5 2 10 0" stroke="#1a1f3c" strokeWidth="0.5" strokeLinecap="round" fill="none" />
      {/* Head stud */}
      <rect x="17" y="10" width="6" height="4" rx="1" fill="#FFFFFF" stroke="#1a1f3c" strokeWidth="0.5" />
      {/* Accessory */}
      {renderAccessory()}
    </svg>
  );
}

interface AvatarConfig {
  style: AvatarStyle;
  hair: string;
  accessory: string;
  color: string;
}

// Design teachers with block avatars, grade/subject
const TEAM = [
  { id: 1, name: 'Sarah M.', avatar: 'female1', grades: '9-12', classes: 'Digital Design, AP Design', online: true, phone: '+1234567890' },
  { id: 2, name: 'Mike R.', avatar: 'male1', grades: '6-8', classes: 'UX Design, Web Design', online: true, phone: '+1234567891' },
  { id: 3, name: 'Alex K.', avatar: 'neutral1', grades: 'K-5', classes: 'Design Thinking', online: false, phone: '+1234567892' },
  { id: 4, name: 'Jordan T.', avatar: 'female2', grades: '9-12', classes: 'Motion Design, Video', online: true, phone: '+1234567893' },
  { id: 5, name: 'Taylor S.', avatar: 'male2', grades: '6-8', classes: 'Product Design, 3D Design', online: false, phone: '+1234567894' },
  { id: 6, name: 'Sam W.', avatar: 'neutral2', grades: '6-8', classes: 'Graphic Design, Typography', online: true, phone: '+1234567895' },
];

// Block figure avatars - white with thin black lines, customizable by teachers
// BlockAvatar uses BlockAvatarCustom with preset defaults based on type
const BlockAvatar = ({ type, size = 32 }: { type: string; size?: number }) => {
  // Map type to default hair/accessory combos
  const defaults: Record<string, { hair: string; acc: string }> = {
    female1: { hair: 'long', acc: 'none' },
    female2: { hair: 'curly', acc: 'earrings' },
    male1: { hair: 'short', acc: 'none' },
    male2: { hair: 'punk', acc: 'glasses' },
    neutral1: { hair: 'bun', acc: 'headphones' },
    neutral2: { hair: 'none', acc: 'baseball' },
  };

  const d = defaults[type] || { hair: 'short', acc: 'none' };

  return <BlockAvatarCustom hair={d.hair} accessory={d.acc} size={size} />;
};

// IB Design Lesson Formatter - helps teachers format ideas for IB curriculum
function IBLessonFormatter({ onClose }: { onClose: () => void }) {
  const [lessonIdea, setLessonIdea] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<'MYP' | 'DP'>('MYP');
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [selectedATL, setSelectedATL] = useState<string[]>([]);
  const [selectedContext, setSelectedContext] = useState('');
  const [keyConcept, setKeyConcept] = useState('');
  const [relatedConcepts, setRelatedConcepts] = useState<string[]>([]);
  const [statementOfInquiry, setStatementOfInquiry] = useState('');
  const [exportFormat, setExportFormat] = useState<'managebac' | 'canvas' | 'toddle'>('managebac');
  const [step, setStep] = useState(1);

  // IB MYP Design Criteria
  const mypCriteria = [
    { id: 'A', name: 'Inquiring and Analyzing', desc: 'Research, analysis of existing products, design brief' },
    { id: 'B', name: 'Developing Ideas', desc: 'Design specifications, ideas, detailed planning' },
    { id: 'C', name: 'Creating the Solution', desc: 'Following plans, demonstration of skills, justify changes' },
    { id: 'D', name: 'Evaluating', desc: 'Testing, evaluation against specifications, improvements' },
  ];

  // IB DP Visual Arts assessments
  const dpAssessments = [
    { id: 'CS', name: 'Comparative Study', desc: 'Compare artworks from different contexts' },
    { id: 'PP', name: 'Process Portfolio', desc: 'Document artistic journey and development' },
    { id: 'EX', name: 'Exhibition', desc: 'Curate and present resolved artworks' },
  ];

  // ATL Skills (Approaches to Learning)
  const atlSkills = [
    { id: 'thinking', name: 'Thinking', examples: 'Critical thinking, creative thinking, transfer' },
    { id: 'social', name: 'Social', examples: 'Collaboration, interpersonal relationships' },
    { id: 'communication', name: 'Communication', examples: 'Exchanging information, literacy, ICT' },
    { id: 'self-management', name: 'Self-management', examples: 'Organization, affective skills, reflection' },
    { id: 'research', name: 'Research', examples: 'Information literacy, media literacy' },
  ];

  // Global Contexts
  const globalContexts = [
    { id: 'identities', name: 'Identities and Relationships', focus: 'Who am I? Who are we?' },
    { id: 'orientation', name: 'Orientation in Space and Time', focus: 'What is the meaning of "where" and "when"?' },
    { id: 'expression', name: 'Personal and Cultural Expression', focus: 'What is the nature of creative expression?' },
    { id: 'innovation', name: 'Scientific and Technical Innovation', focus: 'How do we understand the world?' },
    { id: 'globalization', name: 'Globalization and Sustainability', focus: 'How is everything connected?' },
    { id: 'fairness', name: 'Fairness and Development', focus: 'What are the consequences of our actions?' },
  ];

  // Key Concepts for Design
  const keyConcepts = [
    'Aesthetics', 'Change', 'Communication', 'Communities', 'Connections',
    'Creativity', 'Culture', 'Development', 'Form', 'Global Interactions',
    'Identity', 'Logic', 'Perspective', 'Relationships', 'Systems', 'Time/Place/Space'
  ];

  // Related Concepts for Design
  const designRelatedConcepts = [
    'Adaptation', 'Collaboration', 'Ergonomics', 'Evaluation', 'Form',
    'Function', 'Innovation', 'Invention', 'Markets and Trends', 'Perspective',
    'Resources', 'Sustainability', 'Usability', 'User-centered design'
  ];

  const toggleCriteria = (id: string) => {
    setSelectedCriteria(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleATL = (id: string) => {
    setSelectedATL(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleRelatedConcept = (concept: string) => {
    setRelatedConcepts(prev =>
      prev.includes(concept) ? prev.filter(c => c !== concept) : [...prev, concept].slice(0, 3)
    );
  };

  // Generate Statement of Inquiry suggestion
  const generateSOI = () => {
    if (keyConcept && selectedContext && relatedConcepts.length > 0) {
      const context = globalContexts.find(g => g.id === selectedContext);
      const suggestions = [
        `${keyConcept} shapes how ${relatedConcepts[0]?.toLowerCase()} addresses ${context?.name.toLowerCase()}.`,
        `Understanding ${relatedConcepts[0]?.toLowerCase()} through ${keyConcept.toLowerCase()} helps us explore ${context?.name.toLowerCase()}.`,
        `${keyConcept} and ${relatedConcepts[0]?.toLowerCase()} influence design solutions for ${context?.name.toLowerCase()}.`,
      ];
      setStatementOfInquiry(suggestions[Math.floor(Math.random() * suggestions.length)]);
    }
  };

  // Export formatted lesson
  const exportLesson = () => {
    const criteria = selectedGrade === 'MYP' ? mypCriteria : dpAssessments;
    const selectedCriteriaNames = criteria.filter(c => selectedCriteria.includes(c.id)).map(c => c.name);
    const selectedATLNames = atlSkills.filter(a => selectedATL.includes(a.id)).map(a => a.name);
    const contextName = globalContexts.find(g => g.id === selectedContext)?.name || '';

    const lessonData = {
      title: lessonIdea.split('\n')[0] || 'Untitled Lesson',
      description: lessonIdea,
      programme: selectedGrade,
      criteria: selectedCriteriaNames,
      atlSkills: selectedATLNames,
      globalContext: contextName,
      keyConcept,
      relatedConcepts,
      statementOfInquiry,
      format: exportFormat,
    };

    // In production, this would generate actual export files
    console.log('Exporting lesson:', lessonData);
    alert(`Lesson formatted for ${exportFormat.charAt(0).toUpperCase() + exportFormat.slice(1)}!\n\nIn the full version, this would download a ${exportFormat === 'canvas' ? 'QTI/Common Cartridge' : exportFormat === 'toddle' ? 'Toddle CSV' : 'ManageBac'} compatible file.`);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: 0,
        width: '90%',
        maxWidth: 700,
        maxHeight: '90vh',
        overflow: 'hidden',
        border: '1px solid #E8E8E8',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E8E8E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EC008C" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="M12 18v-6"/>
              <path d="M9 15l3 3 3-3"/>
            </svg>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1a1f3c' }}>IB Lesson Formatter</h3>
              <p style={{ margin: 0, fontSize: 10, color: '#888' }}>Turn your idea into an IB-ready lesson plan</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: step >= s ? '#EC008C' : '#E8E8E8',
                transition: 'background 0.2s ease',
              }} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 20, maxHeight: 'calc(90vh - 140px)', overflow: 'auto' }}>
          {step === 1 && (
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 8 }}>
                Your Lesson Idea
              </label>
              <p style={{ fontSize: 10, color: '#888', margin: '0 0 12px', lineHeight: 1.5 }}>
                Describe your lesson concept. What do you want students to learn, create, or explore?
                Don't worry about IB formatting - just share your creative vision.
              </p>
              <textarea
                value={lessonIdea}
                onChange={(e) => setLessonIdea(e.target.value)}
                placeholder="Example: Students will design a sustainable packaging solution for a local business. They'll research existing packaging, interview the business owner, prototype solutions using recycled materials, and present their final design..."
                style={{
                  width: '100%',
                  minHeight: 120,
                  padding: 12,
                  border: '1px solid #E8E8E8',
                  borderRadius: 10,
                  fontSize: 12,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                }}
              />

              <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 8 }}>
                  Programme Level
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['MYP', 'DP'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => {
                        setSelectedGrade(level);
                        setSelectedCriteria([]);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        background: selectedGrade === level ? '#FAFAFA' : '#FFFFFF',
                        border: selectedGrade === level ? '1px solid #EC008C' : '1px solid #E8E8E8',
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: selectedGrade === level ? 600 : 400,
                        color: selectedGrade === level ? '#EC008C' : '#888',
                        cursor: 'pointer',
                      }}
                    >
                      {level === 'MYP' ? 'MYP Design (6-10)' : 'DP Visual Arts (11-12)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              {/* Assessment Criteria */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 4 }}>
                  {selectedGrade === 'MYP' ? 'Design Cycle Criteria' : 'Assessment Components'}
                </label>
                <p style={{ fontSize: 10, color: '#888', margin: '0 0 10px' }}>
                  Select which {selectedGrade === 'MYP' ? 'criteria' : 'components'} your lesson addresses
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(selectedGrade === 'MYP' ? mypCriteria : dpAssessments).map(c => (
                    <button
                      key={c.id}
                      onClick={() => toggleCriteria(c.id)}
                      style={{
                        padding: '10px 12px',
                        background: selectedCriteria.includes(c.id) ? '#FDF2F8' : '#FFFFFF',
                        border: selectedCriteria.includes(c.id) ? '1px solid #EC008C' : '1px solid #E8E8E8',
                        borderRadius: 10,
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 500, color: '#1a1f3c' }}>
                        {selectedGrade === 'MYP' ? `Criterion ${c.id}: ` : ''}{c.name}
                      </div>
                      <div style={{ fontSize: 9, color: '#888', marginTop: 2 }}>{c.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ATL Skills */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 4 }}>
                  ATL Skills (Approaches to Learning)
                </label>
                <p style={{ fontSize: 10, color: '#888', margin: '0 0 10px' }}>
                  Which skills will students develop?
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {atlSkills.map(skill => (
                    <button
                      key={skill.id}
                      onClick={() => toggleATL(skill.id)}
                      title={skill.examples}
                      style={{
                        padding: '6px 12px',
                        background: selectedATL.includes(skill.id) ? '#F0FDFF' : '#FFFFFF',
                        border: selectedATL.includes(skill.id) ? '1px solid #00D4FF' : '1px solid #E8E8E8',
                        borderRadius: 12,
                        fontSize: 10,
                        color: selectedATL.includes(skill.id) ? '#00D4FF' : '#888',
                        fontWeight: selectedATL.includes(skill.id) ? 500 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Global Context */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 4 }}>
                  Global Context
                </label>
                <p style={{ fontSize: 10, color: '#888', margin: '0 0 10px' }}>
                  How does this lesson connect to the wider world?
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {globalContexts.map(ctx => (
                    <button
                      key={ctx.id}
                      onClick={() => setSelectedContext(ctx.id)}
                      style={{
                        padding: '8px 10px',
                        background: selectedContext === ctx.id ? '#FFFEF0' : '#FFFFFF',
                        border: selectedContext === ctx.id ? '1px solid #FFE500' : '1px solid #E8E8E8',
                        borderRadius: 10,
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 500, color: '#1a1f3c' }}>{ctx.name}</div>
                      <div style={{ fontSize: 8, color: '#888', marginTop: 2 }}>{ctx.focus}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              {/* Conceptual Understanding */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 4 }}>
                  Key Concept
                </label>
                <p style={{ fontSize: 10, color: '#888', margin: '0 0 10px' }}>
                  The big idea that anchors your unit
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {keyConcepts.map(concept => (
                    <button
                      key={concept}
                      onClick={() => setKeyConcept(concept)}
                      style={{
                        padding: '5px 10px',
                        background: keyConcept === concept ? '#1a1f3c' : '#FFFFFF',
                        border: '1px solid #E8E8E8',
                        borderRadius: 12,
                        fontSize: 9,
                        color: keyConcept === concept ? '#FFFFFF' : '#888',
                        cursor: 'pointer',
                      }}
                    >
                      {concept}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 4 }}>
                  Related Concepts (select up to 3)
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {designRelatedConcepts.map(concept => (
                    <button
                      key={concept}
                      onClick={() => toggleRelatedConcept(concept)}
                      style={{
                        padding: '5px 10px',
                        background: relatedConcepts.includes(concept) ? '#EC008C' : '#FFFFFF',
                        border: '1px solid #E8E8E8',
                        borderRadius: 12,
                        fontSize: 9,
                        color: relatedConcepts.includes(concept) ? '#FFFFFF' : '#888',
                        cursor: 'pointer',
                        opacity: relatedConcepts.length >= 3 && !relatedConcepts.includes(concept) ? 0.5 : 1,
                      }}
                    >
                      {concept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statement of Inquiry */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c' }}>
                    Statement of Inquiry
                  </label>
                  <button
                    onClick={generateSOI}
                    style={{
                      padding: '4px 10px',
                      background: '#FFFFFF',
                      border: '1px solid #00D4FF',
                      borderRadius: 10,
                      fontSize: 9,
                      color: '#00D4FF',
                      cursor: 'pointer',
                    }}
                  >
                    Suggest SOI
                  </button>
                </div>
                <p style={{ fontSize: 10, color: '#888', margin: '0 0 8px' }}>
                  A meaningful statement combining your concepts and context
                </p>
                <textarea
                  value={statementOfInquiry}
                  onChange={(e) => setStatementOfInquiry(e.target.value)}
                  placeholder="How concepts connect to create understanding..."
                  style={{
                    width: '100%',
                    minHeight: 60,
                    padding: 10,
                    border: '1px solid #E8E8E8',
                    borderRadius: 10,
                    fontSize: 11,
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Export Format */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 8 }}>
                  Export Format
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { id: 'managebac', name: 'ManageBac', color: '#00D4FF' },
                    { id: 'canvas', name: 'Canvas LMS', color: '#EC008C' },
                    { id: 'toddle', name: 'Toddle', color: '#FFE500' },
                  ].map(format => (
                    <button
                      key={format.id}
                      onClick={() => setExportFormat(format.id as typeof exportFormat)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: exportFormat === format.id ? '#FAFAFA' : '#FFFFFF',
                        border: exportFormat === format.id ? `1px solid ${format.color}` : '1px solid #E8E8E8',
                        borderRadius: 10,
                        fontSize: 10,
                        fontWeight: exportFormat === format.id ? 600 : 400,
                        color: exportFormat === format.id ? format.color : '#888',
                        cursor: 'pointer',
                      }}
                    >
                      {format.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #E8E8E8',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <button
            onClick={step > 1 ? () => setStep(step - 1) : onClose}
            style={{
              padding: '10px 20px',
              background: '#FFFFFF',
              border: '1px solid #E8E8E8',
              borderRadius: 10,
              fontSize: 11,
              color: '#888',
              cursor: 'pointer',
            }}
          >
            {step > 1 ? 'Back' : 'Cancel'}
          </button>
          <button
            onClick={step < 3 ? () => setStep(step + 1) : exportLesson}
            disabled={step === 1 && !lessonIdea.trim()}
            style={{
              padding: '10px 20px',
              background: (step === 1 && !lessonIdea.trim()) ? '#E8E8E8' : '#FFFFFF',
              border: (step === 1 && !lessonIdea.trim()) ? '1px solid #E8E8E8' : '1px solid #EC008C',
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 600,
              color: (step === 1 && !lessonIdea.trim()) ? '#888' : '#EC008C',
              cursor: (step === 1 && !lessonIdea.trim()) ? 'not-allowed' : 'pointer',
            }}
          >
            {step < 3 ? 'Next' : `Export to ${exportFormat.charAt(0).toUpperCase() + exportFormat.slice(1)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// Design Rubric Builder - generates rubrics for design classes
function RubricBuilder({ onClose }: { onClose: () => void }) {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [gradeLevel, setGradeLevel] = useState<'elementary' | 'middle' | 'high' | 'ib-myp' | 'ib-dp'>('high');
  const [totalPoints, setTotalPoints] = useState(100);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>(['creativity', 'craftsmanship', 'process', 'presentation']);
  const [outputFormat, setOutputFormat] = useState<'canvas' | 'toddle' | 'google'>('canvas');
  const [generatedRubric, setGeneratedRubric] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [useIBRubric, setUseIBRubric] = useState(true);

  // Design-focused criteria options
  const criteriaOptions = [
    { id: 'creativity', name: 'Creativity & Originality', desc: 'Unique ideas, innovation, risk-taking' },
    { id: 'craftsmanship', name: 'Craftsmanship & Skill', desc: 'Technical execution, attention to detail' },
    { id: 'process', name: 'Design Process', desc: 'Research, iteration, documentation' },
    { id: 'presentation', name: 'Presentation', desc: 'Final presentation, communication of ideas' },
    { id: 'problem-solving', name: 'Problem Solving', desc: 'Addressing design challenges effectively' },
    { id: 'aesthetics', name: 'Visual Aesthetics', desc: 'Composition, color, typography, balance' },
    { id: 'concept', name: 'Concept Development', desc: 'Strength and clarity of central idea' },
    { id: 'research', name: 'Research & Context', desc: 'Understanding of audience, context, precedents' },
    { id: 'collaboration', name: 'Collaboration', desc: 'Teamwork, feedback integration, peer support' },
    { id: 'reflection', name: 'Reflection', desc: 'Self-assessment, growth mindset, learning from critique' },
  ];

  // Grade-level appropriate language
  const gradeLevelDescriptors = {
    elementary: {
      excellent: 'Amazing',
      good: 'Great',
      developing: 'Getting There',
      beginning: 'Just Starting',
    },
    middle: {
      excellent: 'Exceeds Expectations',
      good: 'Meets Expectations',
      developing: 'Approaching Expectations',
      beginning: 'Beginning',
    },
    high: {
      excellent: 'Exemplary',
      good: 'Proficient',
      developing: 'Developing',
      beginning: 'Emerging',
    },
    'ib-myp': {
      excellent: '7-8',
      good: '5-6',
      developing: '3-4',
      beginning: '1-2',
    },
    'ib-dp': {
      excellent: '5-6',
      good: '3-4',
      developing: '2',
      beginning: '1',
    },
  };

  // Official IB MYP Design Criteria (each out of 8 marks)
  const mypDesignCriteria = [
    {
      id: 'myp-a',
      name: 'Criterion A: Inquiring and Analyzing',
      strands: [
        'Explain and justify the need for a solution to a problem',
        'State and prioritize the main points of research needed',
        'Describe the main features of an existing product that inspires a solution',
        'Present the main findings of relevant research',
      ],
      levels: {
        '7-8': 'The student explains and justifies the need for a solution to a problem for a specified client/target audience. The student states and prioritizes the primary and secondary research needed to develop a solution, with excellent justification. The student describes the relevant existing product(s) that inspire(s) a solution in detail. The student presents the research findings in detail.',
        '5-6': 'The student explains the need for a solution to a problem for a specified client/target audience. The student states the research needed to develop a solution, with some prioritization. The student describes the relevant existing product(s) that inspire(s) a solution. The student presents the research findings.',
        '3-4': 'The student outlines the need for a solution to a problem for a client/target audience. The student outlines some of the research needed. The student outlines some existing product(s) that inspire(s) a solution. The student outlines some research findings.',
        '1-2': 'The student states the need for a solution to a problem. The student states some points of research needed. The student states an existing product that inspires a solution. The student states some research findings.',
      },
    },
    {
      id: 'myp-b',
      name: 'Criterion B: Developing Ideas',
      strands: [
        'Develop design specifications',
        'Develop a range of feasible design ideas',
        'Present the final chosen design',
        'Create a detailed planning drawing/diagram',
      ],
      levels: {
        '7-8': 'The student develops a detailed design specification, explaining the success criteria. The student develops a range of feasible design ideas that address the design specification and can be evaluated against it. The student presents the final chosen design and justifies fully its selection. The student develops detailed and accurate planning documents.',
        '5-6': 'The student develops a design specification that identifies the success criteria. The student develops a range of feasible design ideas that address the design specification. The student presents the final chosen design and justifies its selection. The student develops accurate planning documents.',
        '3-4': 'The student develops a design specification that outlines some success criteria. The student develops some feasible design ideas. The student presents the chosen design. The student creates planning documents.',
        '1-2': 'The student lists some success criteria. The student presents one or more design idea(s). The student creates incomplete planning documents.',
      },
    },
    {
      id: 'myp-c',
      name: 'Criterion C: Creating the Solution',
      strands: [
        'Construct a logical plan for the creation of the solution',
        'Demonstrate excellent technical skills when making the solution',
        'Follow the plan to create the solution',
        'Fully justify changes made to the plan when creating the solution',
      ],
      levels: {
        '7-8': 'The student constructs a detailed and logical plan that describes the efficient use of time and resources. The student demonstrates excellent technical skills when making the solution. The student follows the plan to create a solution that functions as intended and is presented appropriately. The student fully justifies changes made to the chosen design and plan.',
        '5-6': 'The student constructs a logical plan that considers time and resources. The student demonstrates competent technical skills when making the solution. The student follows the plan to create a solution that functions as intended. The student explains changes made to the chosen design and plan.',
        '3-4': 'The student constructs a plan that contains some details. The student demonstrates satisfactory technical skills when making the solution. The student creates a solution that partially functions as intended. The student outlines changes made.',
        '1-2': 'The student creates an incomplete plan. The student demonstrates minimal technical skills. The student creates a solution that does not function as intended.',
      },
    },
    {
      id: 'myp-d',
      name: 'Criterion D: Evaluating',
      strands: [
        'Design detailed and relevant testing methods',
        'Critically evaluate the success of the solution',
        'Explain how the solution could be improved',
        'Explain the impact of the solution on the client/target audience',
      ],
      levels: {
        '7-8': 'The student designs detailed and relevant testing methods that generate data to measure the success of the solution. The student critically evaluates the success of the solution against the design specification based on authentic product testing. The student explains how the solution could be improved. The student explains the impact of the solution on the client/target audience.',
        '5-6': 'The student designs relevant testing methods that generate data to measure the success of the solution. The student evaluates the success of the solution against the design specification based on product testing. The student outlines how the solution could be improved. The student outlines the impact on the client/target audience.',
        '3-4': 'The student outlines simple testing methods. The student outlines the success of the solution against the design specification. The student outlines improvements. The student outlines the impact.',
        '1-2': 'The student states a testing method. The student states the success of the solution. The student states an improvement. The student states an impact.',
      },
    },
  ];

  // Official IB DP Design Technology Criteria (Internal Assessment - Design Project)
  const dpDesignCriteria = [
    {
      id: 'dp-a',
      name: 'Criterion A: Analysis of an Opportunity or Problem',
      maxMarks: 6,
      strands: [
        'Identification and analysis of a real opportunity/problem',
        'Research into the nature of the opportunity/problem',
        'Identification of relevant factors',
        'Analysis of relevant existing products',
      ],
      levels: {
        '5-6': 'The student identifies and analyzes an opportunity/problem in depth. Research is thorough and relevant. All relevant factors are identified and prioritized. Existing products are analyzed in detail with excellent connections to the design opportunity.',
        '3-4': 'The student identifies and analyzes an opportunity/problem adequately. Research is adequate and mostly relevant. Most relevant factors are identified. Existing products are analyzed with some connections to the design opportunity.',
        '2': 'The student identifies an opportunity/problem. Research is superficial. Some relevant factors are identified. Existing products are described.',
        '1': 'The student states an opportunity/problem. Research is minimal. Few factors identified. Existing products are listed.',
      },
    },
    {
      id: 'dp-b',
      name: 'Criterion B: Conceptual Design',
      maxMarks: 6,
      strands: [
        'Development of a design brief and specification',
        'Generation and consideration of feasible design concepts',
        'Evaluation of concepts against the specification',
        'Selection and justification of the chosen design',
      ],
      levels: {
        '5-6': 'The design brief and specification are detailed and justified. A range of feasible design concepts are generated and developed. Concepts are evaluated objectively against the specification. The chosen design is fully justified.',
        '3-4': 'The design brief and specification are appropriate. Some feasible design concepts are generated. Concepts are evaluated against the specification. The chosen design is justified.',
        '2': 'The design brief and specification are outlined. Limited design concepts are generated. Some evaluation against specification. Basic justification for chosen design.',
        '1': 'A basic design brief/specification exists. One design concept presented. Minimal evaluation. Little justification.',
      },
    },
    {
      id: 'dp-c',
      name: 'Criterion C: Development of Detailed Design',
      maxMarks: 12,
      strands: [
        'Detailed development of the chosen design',
        'Evidence of iteration based on feedback/testing',
        'Detailed drawings/diagrams/models',
        'Planning for production including materials, tools, processes',
      ],
      levels: {
        '5-6': 'The chosen design is developed in thorough detail with excellent iteration. Comprehensive detailed drawings/diagrams/models. Complete production planning with excellent justification of materials, tools, and processes.',
        '3-4': 'The chosen design is developed in adequate detail with some iteration. Adequate detailed drawings/diagrams/models. Production planning with justification of materials, tools, and processes.',
        '2': 'The chosen design is developed with limited detail. Basic drawings/diagrams. Some production planning.',
        '1': 'Minimal design development. Incomplete drawings/diagrams. Limited production planning.',
      },
    },
    {
      id: 'dp-d',
      name: 'Criterion D: Testing and Evaluation',
      maxMarks: 6,
      strands: [
        'Testing of the prototype against the specification',
        'Objective evaluation of the solution',
        'Recommendations for further development',
        'Impact assessment (social, environmental, economic)',
      ],
      levels: {
        '5-6': 'Thorough testing against all aspects of specification. Objective and insightful evaluation. Detailed recommendations for improvement. Comprehensive impact assessment.',
        '3-4': 'Adequate testing against specification. Sound evaluation. Appropriate recommendations. Impact assessment included.',
        '2': 'Basic testing. Some evaluation. Limited recommendations. Basic impact consideration.',
        '1': 'Minimal testing. Superficial evaluation. Few recommendations. Limited impact consideration.',
      },
    },
    {
      id: 'dp-e',
      name: 'Criterion E: Commercial Production',
      maxMarks: 6,
      strands: [
        'Modifications for commercial manufacture',
        'Scale of production considerations',
        'Quality control measures',
        'Economic viability',
      ],
      levels: {
        '5-6': 'Detailed modifications for commercial production. Thorough consideration of scale. Comprehensive quality control. Detailed economic analysis.',
        '3-4': 'Appropriate modifications for production. Adequate consideration of scale. Quality control addressed. Economic considerations included.',
        '2': 'Basic modifications suggested. Some scale consideration. Basic quality control. Limited economic consideration.',
        '1': 'Minimal modifications. Little consideration of scale or quality. No economic analysis.',
      },
    },
  ];

  // Detailed descriptors for each criterion at each level
  const criteriaDescriptors: Record<string, Record<string, string>> = {
    creativity: {
      excellent: 'Demonstrates exceptional originality and innovation. Takes meaningful creative risks that enhance the work. Ideas are fresh, unexpected, and personally meaningful.',
      good: 'Shows solid creativity with original ideas. Some creative risks are taken. Work demonstrates personal voice and thoughtful choices.',
      developing: 'Some original elements present but relies on common solutions. Limited risk-taking. Beginning to develop personal creative voice.',
      beginning: 'Work lacks originality, relies heavily on copying or basic templates. Little evidence of creative thinking or personal expression.',
    },
    craftsmanship: {
      excellent: 'Outstanding technical execution with meticulous attention to detail. Skillful use of tools/materials. Finished work is polished and professional quality.',
      good: 'Good technical skills demonstrated. Most details are well-executed. Minor refinements would enhance the work.',
      developing: 'Basic technical skills shown. Some areas need more attention to detail. Execution is inconsistent.',
      beginning: 'Technical execution needs significant improvement. Many errors or rough areas. Limited control of tools/materials.',
    },
    process: {
      excellent: 'Thorough design process documented with rich iteration. Multiple concepts explored and refined. Clear evidence of research, sketching, and revision.',
      good: 'Good documentation of design process. Several ideas explored before final direction. Evidence of iteration and improvement.',
      developing: 'Some process documentation but limited exploration. Jumps quickly to final solution. Minimal iteration shown.',
      beginning: 'Little to no process documentation. No evidence of exploration or iteration. Went straight to final without planning.',
    },
    presentation: {
      excellent: 'Presentation is compelling, clear, and professionally executed. Ideas communicated effectively. Visual/verbal presentation enhances understanding.',
      good: 'Presentation is clear and organized. Ideas are communicated well. Minor improvements would strengthen delivery.',
      developing: 'Presentation is somewhat unclear or disorganized. Main ideas present but communication could be stronger.',
      beginning: 'Presentation is confusing or incomplete. Difficult to understand the work or design decisions.',
    },
    'problem-solving': {
      excellent: 'Identifies complex design problems and develops innovative, effective solutions. Considers multiple constraints and user needs.',
      good: 'Identifies design problems and develops workable solutions. Addresses main constraints and considerations.',
      developing: 'Identifies basic problems but solutions are surface-level. Some constraints overlooked.',
      beginning: 'Struggles to identify design problems. Solutions don\'t address core challenges.',
    },
    aesthetics: {
      excellent: 'Exceptional visual design with sophisticated use of composition, color, typography, and visual hierarchy. Creates strong visual impact.',
      good: 'Good visual design choices. Effective use of design elements. Aesthetically pleasing and appropriate.',
      developing: 'Basic visual design. Some effective choices but overall aesthetic needs refinement.',
      beginning: 'Visual design is weak or inappropriate. Poor use of design elements. Lacks visual appeal.',
    },
    concept: {
      excellent: 'Concept is innovative, clearly articulated, and deeply explored. Strong central idea that drives all design decisions.',
      good: 'Concept is clear and well-developed. Central idea is evident throughout the work.',
      developing: 'Concept is present but underdeveloped. Connection between idea and execution is weak.',
      beginning: 'Concept is unclear or missing. Work lacks a central guiding idea.',
    },
    research: {
      excellent: 'Extensive, relevant research that meaningfully informs design decisions. Deep understanding of audience, context, and precedents.',
      good: 'Good research conducted. Shows understanding of context and audience. Research connects to design choices.',
      developing: 'Some research present but superficial. Limited connection between research and final work.',
      beginning: 'Little to no research evident. Design decisions not informed by context or audience understanding.',
    },
    collaboration: {
      excellent: 'Exceptional team contribution. Actively supports peers, integrates feedback thoughtfully, elevates group work.',
      good: 'Good team member. Contributes fairly, accepts and gives constructive feedback.',
      developing: 'Participates in group work but contribution is uneven. Sometimes integrates feedback.',
      beginning: 'Limited collaboration. Difficulty working with others or accepting feedback.',
    },
    reflection: {
      excellent: 'Deep, insightful reflection on process and growth. Identifies specific learnings and applies them. Shows strong growth mindset.',
      good: 'Thoughtful reflection on work and process. Identifies areas for growth.',
      developing: 'Basic reflection present. Surface-level insights about work and learning.',
      beginning: 'Little to no reflection. Unable to articulate learning or areas for growth.',
    },
  };

  const toggleCriteria = (id: string) => {
    setSelectedCriteria(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const pointOptions = [4, 8, 12, 16, 20, 24, 50, 100];

  const generateRubric = () => {
    let rubric = '';

    // Handle IB MYP Rubric
    if (gradeLevel === 'ib-myp') {
      if (outputFormat === 'canvas') {
        rubric = `<h2>${projectName || 'MYP Design Project'} - Assessment Rubric</h2>\n`;
        rubric += `<p><em>${projectDescription || 'IB MYP Design assessment using official criteria'}</em></p>\n`;
        rubric += `<p><strong>Total Marks: 32 (8 marks per criterion)</strong></p>\n\n`;

        mypDesignCriteria.forEach(criterion => {
          rubric += `<h3>${criterion.name}</h3>\n`;
          rubric += `<p><em>Strands: ${criterion.strands.join(' | ')}</em></p>\n`;
          rubric += `<table border="1" cellpadding="8" cellspacing="0" style="width:100%">\n`;
          rubric += `<tr style="background-color: #00D4FF; color: white;">\n`;
          rubric += `  <th>7-8</th><th>5-6</th><th>3-4</th><th>1-2</th>\n`;
          rubric += `</tr>\n<tr>\n`;
          rubric += `  <td>${criterion.levels['7-8']}</td>\n`;
          rubric += `  <td>${criterion.levels['5-6']}</td>\n`;
          rubric += `  <td>${criterion.levels['3-4']}</td>\n`;
          rubric += `  <td>${criterion.levels['1-2']}</td>\n`;
          rubric += `</tr>\n</table>\n<br/>\n`;
        });
      } else if (outputFormat === 'google') {
        rubric = `${projectName || 'MYP Design Project'} - ASSESSMENT RUBRIC\n`;
        rubric += `${'═'.repeat(60)}\n`;
        rubric += `${projectDescription || 'IB MYP Design assessment using official criteria'}\n`;
        rubric += `Total Marks: 32 (8 marks per criterion)\n\n`;

        mypDesignCriteria.forEach(criterion => {
          rubric += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
          rubric += `📐 ${criterion.name.toUpperCase()}\n`;
          rubric += `   Maximum: 8 marks\n\n`;
          rubric += `   Strands:\n`;
          criterion.strands.forEach(strand => {
            rubric += `   • ${strand}\n`;
          });
          rubric += `\n`;
          rubric += `   ⭐ LEVEL 7-8:\n   ${criterion.levels['7-8']}\n\n`;
          rubric += `   ✓ LEVEL 5-6:\n   ${criterion.levels['5-6']}\n\n`;
          rubric += `   ◐ LEVEL 3-4:\n   ${criterion.levels['3-4']}\n\n`;
          rubric += `   ○ LEVEL 1-2:\n   ${criterion.levels['1-2']}\n\n`;
        });
      } else {
        rubric = `Criterion,7-8 (Excellent),5-6 (Good),3-4 (Adequate),1-2 (Limited)\n`;
        mypDesignCriteria.forEach(criterion => {
          rubric += `"${criterion.name}","${criterion.levels['7-8']}","${criterion.levels['5-6']}","${criterion.levels['3-4']}","${criterion.levels['1-2']}"\n`;
        });
      }
    }
    // Handle IB DP Rubric
    else if (gradeLevel === 'ib-dp') {
      if (outputFormat === 'canvas') {
        rubric = `<h2>${projectName || 'DP Design Technology'} - Internal Assessment Rubric</h2>\n`;
        rubric += `<p><em>${projectDescription || 'IB DP Design Technology IA assessment using official criteria'}</em></p>\n`;
        rubric += `<p><strong>Total Marks: 36</strong></p>\n\n`;

        dpDesignCriteria.forEach(criterion => {
          rubric += `<h3>${criterion.name} (${criterion.maxMarks} marks)</h3>\n`;
          rubric += `<p><em>Focus: ${criterion.strands.join(' | ')}</em></p>\n`;
          rubric += `<table border="1" cellpadding="8" cellspacing="0" style="width:100%">\n`;
          rubric += `<tr style="background-color: #EC008C; color: white;">\n`;
          rubric += `  <th>5-6</th><th>3-4</th><th>2</th><th>1</th>\n`;
          rubric += `</tr>\n<tr>\n`;
          rubric += `  <td>${criterion.levels['5-6']}</td>\n`;
          rubric += `  <td>${criterion.levels['3-4']}</td>\n`;
          rubric += `  <td>${criterion.levels['2']}</td>\n`;
          rubric += `  <td>${criterion.levels['1']}</td>\n`;
          rubric += `</tr>\n</table>\n<br/>\n`;
        });
      } else if (outputFormat === 'google') {
        rubric = `${projectName || 'DP Design Technology'} - INTERNAL ASSESSMENT RUBRIC\n`;
        rubric += `${'═'.repeat(60)}\n`;
        rubric += `${projectDescription || 'IB DP Design Technology IA assessment'}\n`;
        rubric += `Total Marks: 36\n\n`;

        dpDesignCriteria.forEach(criterion => {
          rubric += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
          rubric += `📐 ${criterion.name.toUpperCase()}\n`;
          rubric += `   Maximum: ${criterion.maxMarks} marks\n\n`;
          rubric += `   Assessment Focus:\n`;
          criterion.strands.forEach(strand => {
            rubric += `   • ${strand}\n`;
          });
          rubric += `\n`;
          rubric += `   ⭐ LEVEL 5-6:\n   ${criterion.levels['5-6']}\n\n`;
          rubric += `   ✓ LEVEL 3-4:\n   ${criterion.levels['3-4']}\n\n`;
          rubric += `   ◐ LEVEL 2:\n   ${criterion.levels['2']}\n\n`;
          rubric += `   ○ LEVEL 1:\n   ${criterion.levels['1']}\n\n`;
        });
      } else {
        rubric = `Criterion,Max Marks,5-6 (Excellent),3-4 (Good),2 (Adequate),1 (Limited)\n`;
        dpDesignCriteria.forEach(criterion => {
          rubric += `"${criterion.name}",${criterion.maxMarks},"${criterion.levels['5-6']}","${criterion.levels['3-4']}","${criterion.levels['2']}","${criterion.levels['1']}"\n`;
        });
      }
    }
    // Handle standard rubric
    else {
      const pointsPerCriterion = Math.round(totalPoints / selectedCriteria.length);
      const levels = gradeLevelDescriptors[gradeLevel];
      const levelPoints = {
        excellent: pointsPerCriterion,
        good: Math.round(pointsPerCriterion * 0.85),
        developing: Math.round(pointsPerCriterion * 0.70),
        beginning: Math.round(pointsPerCriterion * 0.50),
      };

      if (outputFormat === 'canvas') {
        rubric = `<h2>${projectName || 'Design Project'} Rubric</h2>\n`;
        rubric += `<p><em>${projectDescription || 'Design project assessment rubric'}</em></p>\n`;
        rubric += `<p><strong>Total Points: ${totalPoints}</strong></p>\n\n`;
        rubric += `<table border="1" cellpadding="8" cellspacing="0">\n`;
        rubric += `<tr style="background-color: #f0f0f0;">\n`;
        rubric += `  <th>Criteria</th>\n`;
        rubric += `  <th>${levels.excellent}<br/>(${levelPoints.excellent} pts)</th>\n`;
        rubric += `  <th>${levels.good}<br/>(${levelPoints.good} pts)</th>\n`;
        rubric += `  <th>${levels.developing}<br/>(${levelPoints.developing} pts)</th>\n`;
        rubric += `  <th>${levels.beginning}<br/>(${levelPoints.beginning} pts)</th>\n`;
        rubric += `</tr>\n`;

        selectedCriteria.forEach(criterionId => {
          const criterion = criteriaOptions.find(c => c.id === criterionId);
          const descriptors = criteriaDescriptors[criterionId];
          if (criterion && descriptors) {
            rubric += `<tr>\n`;
            rubric += `  <td><strong>${criterion.name}</strong><br/><em>${criterion.desc}</em></td>\n`;
            rubric += `  <td>${descriptors.excellent}</td>\n`;
            rubric += `  <td>${descriptors.good}</td>\n`;
            rubric += `  <td>${descriptors.developing}</td>\n`;
            rubric += `  <td>${descriptors.beginning}</td>\n`;
            rubric += `</tr>\n`;
          }
        });

        rubric += `</table>`;
      } else if (outputFormat === 'google') {
        rubric = `${projectName || 'Design Project'} RUBRIC\n`;
        rubric += `${'='.repeat(50)}\n`;
        rubric += `${projectDescription || 'Design project assessment rubric'}\n`;
        rubric += `Total Points: ${totalPoints}\n\n`;

        selectedCriteria.forEach(criterionId => {
          const criterion = criteriaOptions.find(c => c.id === criterionId);
          const descriptors = criteriaDescriptors[criterionId];
          if (criterion && descriptors) {
            rubric += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            rubric += `📐 ${criterion.name.toUpperCase()} (${pointsPerCriterion} points)\n`;
            rubric += `   ${criterion.desc}\n\n`;
            rubric += `   ⭐ ${levels.excellent} (${levelPoints.excellent} pts)\n`;
            rubric += `   ${descriptors.excellent}\n\n`;
            rubric += `   ✓ ${levels.good} (${levelPoints.good} pts)\n`;
            rubric += `   ${descriptors.good}\n\n`;
            rubric += `   ◐ ${levels.developing} (${levelPoints.developing} pts)\n`;
            rubric += `   ${descriptors.developing}\n\n`;
            rubric += `   ○ ${levels.beginning} (${levelPoints.beginning} pts)\n`;
            rubric += `   ${descriptors.beginning}\n\n`;
          }
        });
      } else {
        rubric = `Criterion,${levels.excellent} (${levelPoints.excellent}),${levels.good} (${levelPoints.good}),${levels.developing} (${levelPoints.developing}),${levels.beginning} (${levelPoints.beginning})\n`;

        selectedCriteria.forEach(criterionId => {
          const criterion = criteriaOptions.find(c => c.id === criterionId);
          const descriptors = criteriaDescriptors[criterionId];
          if (criterion && descriptors) {
            rubric += `"${criterion.name}","${descriptors.excellent}","${descriptors.good}","${descriptors.developing}","${descriptors.beginning}"\n`;
          }
        });
      }
    }

    setGeneratedRubric(rubric);
    setShowPreview(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedRubric);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }} onClick={onClose}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: 0,
        width: '90%',
        maxWidth: 750,
        maxHeight: '90vh',
        overflow: 'hidden',
        border: '1px solid #E8E8E8',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E8E8E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EC008C" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1a1f3c' }}>Design Rubric Builder</h3>
              <p style={{ margin: 0, fontSize: 10, color: '#888' }}>Create rubrics for Canvas, Toddle, or Google Classroom</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 20, maxHeight: 'calc(90vh - 140px)', overflow: 'auto' }}>
          {!showPreview ? (
            <>
              {/* Project Info */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 6 }}>
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Logo Design Project, Poster Campaign, App Prototype"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #E8E8E8',
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 6 }}>
                  Project Description (optional)
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Brief description of the project requirements..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #E8E8E8',
                    borderRadius: 10,
                    fontSize: 12,
                    minHeight: 60,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Grade Level & Points */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 6 }}>
                    Grade Level / Programme
                  </label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[
                      { id: 'elementary', label: 'K-5' },
                      { id: 'middle', label: '6-8' },
                      { id: 'high', label: '9-12' },
                      { id: 'ib-myp', label: 'IB MYP' },
                      { id: 'ib-dp', label: 'IB DP' },
                    ].map(level => (
                      <button
                        key={level.id}
                        onClick={() => {
                          setGradeLevel(level.id as typeof gradeLevel);
                          // Auto-select IB criteria when IB is selected
                          if (level.id === 'ib-myp') {
                            setSelectedCriteria(['myp-a', 'myp-b', 'myp-c', 'myp-d']);
                            setTotalPoints(32);
                            setUseIBRubric(true);
                          } else if (level.id === 'ib-dp') {
                            setSelectedCriteria(['dp-a', 'dp-b', 'dp-c', 'dp-d', 'dp-e']);
                            setTotalPoints(36);
                            setUseIBRubric(true);
                          } else {
                            setSelectedCriteria(['creativity', 'craftsmanship', 'process', 'presentation']);
                            setUseIBRubric(false);
                          }
                        }}
                        style={{
                          flex: level.id.startsWith('ib') ? '0 0 auto' : 1,
                          padding: '8px 12px',
                          background: gradeLevel === level.id ? '#FAFAFA' : '#FFFFFF',
                          border: gradeLevel === level.id ? '1px solid #00D4FF' : '1px solid #E8E8E8',
                          borderRadius: 8,
                          fontSize: 10,
                          fontWeight: gradeLevel === level.id ? 600 : 400,
                          color: gradeLevel === level.id ? '#00D4FF' : '#888',
                          cursor: 'pointer',
                        }}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {!gradeLevel.startsWith('ib') && (
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 6 }}>
                      Total Points
                    </label>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {pointOptions.map(pts => (
                        <button
                          key={pts}
                          onClick={() => setTotalPoints(pts)}
                          style={{
                            padding: '6px 10px',
                            background: totalPoints === pts ? '#FAFAFA' : '#FFFFFF',
                            border: totalPoints === pts ? '1px solid #FFE500' : '1px solid #E8E8E8',
                            borderRadius: 8,
                            fontSize: 10,
                            fontWeight: totalPoints === pts ? 600 : 400,
                            color: totalPoints === pts ? '#1a1f3c' : '#888',
                            cursor: 'pointer',
                          }}
                        >
                          {pts}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Criteria Selection */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 4 }}>
                  {gradeLevel === 'ib-myp' ? 'MYP Design Criteria (Official IB)' :
                   gradeLevel === 'ib-dp' ? 'DP Design Technology Criteria (Official IB)' :
                   'Assessment Criteria'}
                </label>
                <p style={{ fontSize: 10, color: '#888', margin: '0 0 10px' }}>
                  {gradeLevel === 'ib-myp' ? 'Official IB MYP Design criteria - each criterion is worth 8 marks' :
                   gradeLevel === 'ib-dp' ? 'Official IB DP Design Technology IA criteria' :
                   'Select the criteria to include (points will be divided equally)'}
                </p>

                {/* IB MYP Criteria */}
                {gradeLevel === 'ib-myp' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {mypDesignCriteria.map(criterion => (
                      <div
                        key={criterion.id}
                        style={{
                          padding: '12px 14px',
                          background: selectedCriteria.includes(criterion.id) ? '#F0FDFF' : '#FFFFFF',
                          border: selectedCriteria.includes(criterion.id) ? '1px solid #00D4FF' : '1px solid #E8E8E8',
                          borderRadius: 10,
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                        }}>
                          <div style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#1a1f3c',
                          }}>
                            {criterion.name}
                          </div>
                          <span style={{
                            padding: '2px 8px',
                            background: '#00D4FF',
                            borderRadius: 10,
                            fontSize: 9,
                            fontWeight: 600,
                            color: '#FFFFFF',
                          }}>
                            8 marks
                          </span>
                        </div>
                        <div style={{ fontSize: 10, color: '#666', lineHeight: 1.5 }}>
                          <strong>Strands:</strong>
                          <ul style={{ margin: '4px 0 0 0', paddingLeft: 16 }}>
                            {criterion.strands.map((strand, i) => (
                              <li key={i} style={{ marginBottom: 2 }}>{strand}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* IB DP Criteria */}
                {gradeLevel === 'ib-dp' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {dpDesignCriteria.map(criterion => (
                      <div
                        key={criterion.id}
                        style={{
                          padding: '12px 14px',
                          background: selectedCriteria.includes(criterion.id) ? '#FDF2F8' : '#FFFFFF',
                          border: selectedCriteria.includes(criterion.id) ? '1px solid #EC008C' : '1px solid #E8E8E8',
                          borderRadius: 10,
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 8,
                        }}>
                          <div style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#1a1f3c',
                          }}>
                            {criterion.name}
                          </div>
                          <span style={{
                            padding: '2px 8px',
                            background: '#EC008C',
                            borderRadius: 10,
                            fontSize: 9,
                            fontWeight: 600,
                            color: '#FFFFFF',
                          }}>
                            {criterion.maxMarks} marks
                          </span>
                        </div>
                        <div style={{ fontSize: 10, color: '#666', lineHeight: 1.5 }}>
                          <strong>Assessment focus:</strong>
                          <ul style={{ margin: '4px 0 0 0', paddingLeft: 16 }}>
                            {criterion.strands.map((strand, i) => (
                              <li key={i} style={{ marginBottom: 2 }}>{strand}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Standard Criteria for non-IB */}
                {!gradeLevel.startsWith('ib') && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {criteriaOptions.map(criterion => (
                      <button
                        key={criterion.id}
                        onClick={() => toggleCriteria(criterion.id)}
                        style={{
                          padding: '10px 12px',
                          background: selectedCriteria.includes(criterion.id) ? '#FDF2F8' : '#FFFFFF',
                          border: selectedCriteria.includes(criterion.id) ? '1px solid #EC008C' : '1px solid #E8E8E8',
                          borderRadius: 10,
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: selectedCriteria.includes(criterion.id) ? '#EC008C' : '#1a1f3c',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}>
                          <span style={{
                            width: 14,
                            height: 14,
                            borderRadius: 4,
                            border: selectedCriteria.includes(criterion.id) ? '1px solid #EC008C' : '1px solid #D0D0D0',
                            background: selectedCriteria.includes(criterion.id) ? '#EC008C' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {selectedCriteria.includes(criterion.id) && (
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            )}
                          </span>
                          {criterion.name}
                        </div>
                        <div style={{ fontSize: 9, color: '#888', marginTop: 2, marginLeft: 20 }}>{criterion.desc}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Output Format */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', display: 'block', marginBottom: 6 }}>
                  Output Format
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { id: 'canvas', name: 'Canvas LMS', desc: 'HTML table format', color: '#E74C3C' },
                    { id: 'google', name: 'Google Classroom', desc: 'Plain text format', color: '#4285F4' },
                    { id: 'toddle', name: 'Toddle', desc: 'CSV format', color: '#00D4FF' },
                  ].map(format => (
                    <button
                      key={format.id}
                      onClick={() => setOutputFormat(format.id as typeof outputFormat)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: outputFormat === format.id ? '#FAFAFA' : '#FFFFFF',
                        border: outputFormat === format.id ? `1px solid ${format.color}` : '1px solid #E8E8E8',
                        borderRadius: 10,
                        textAlign: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{
                        fontSize: 11,
                        fontWeight: outputFormat === format.id ? 600 : 400,
                        color: outputFormat === format.id ? format.color : '#1a1f3c'
                      }}>
                        {format.name}
                      </div>
                      <div style={{ fontSize: 9, color: '#888', marginTop: 2 }}>{format.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Points Preview */}
              {selectedCriteria.length > 0 && !gradeLevel.startsWith('ib') && (
                <div style={{
                  padding: 12,
                  background: '#FAFAFA',
                  borderRadius: 10,
                  border: '1px solid #E8E8E8',
                }}>
                  <div style={{ fontSize: 10, color: '#888', marginBottom: 6 }}>Points Distribution</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selectedCriteria.map(id => {
                      const criterion = criteriaOptions.find(c => c.id === id);
                      const points = Math.round(totalPoints / selectedCriteria.length);
                      return (
                        <span key={id} style={{
                          padding: '4px 10px',
                          background: '#FFFFFF',
                          border: '1px solid #E8E8E8',
                          borderRadius: 12,
                          fontSize: 10,
                          color: '#1a1f3c',
                        }}>
                          {criterion?.name}: <strong>{points} pts</strong>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* IB Marks Summary */}
              {gradeLevel === 'ib-myp' && (
                <div style={{
                  padding: 12,
                  background: '#F0FDFF',
                  borderRadius: 10,
                  border: '1px solid #00D4FF',
                }}>
                  <div style={{ fontSize: 10, color: '#00D4FF', fontWeight: 600, marginBottom: 6 }}>IB MYP Design Assessment</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <span style={{ padding: '4px 10px', background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 12, fontSize: 10 }}>
                      Criterion A: <strong>8 marks</strong>
                    </span>
                    <span style={{ padding: '4px 10px', background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 12, fontSize: 10 }}>
                      Criterion B: <strong>8 marks</strong>
                    </span>
                    <span style={{ padding: '4px 10px', background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 12, fontSize: 10 }}>
                      Criterion C: <strong>8 marks</strong>
                    </span>
                    <span style={{ padding: '4px 10px', background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 12, fontSize: 10 }}>
                      Criterion D: <strong>8 marks</strong>
                    </span>
                    <span style={{ padding: '4px 10px', background: '#00D4FF', borderRadius: 12, fontSize: 10, color: '#FFFFFF', fontWeight: 600 }}>
                      Total: 32 marks
                    </span>
                  </div>
                </div>
              )}

              {gradeLevel === 'ib-dp' && (
                <div style={{
                  padding: 12,
                  background: '#FDF2F8',
                  borderRadius: 10,
                  border: '1px solid #EC008C',
                }}>
                  <div style={{ fontSize: 10, color: '#EC008C', fontWeight: 600, marginBottom: 6 }}>IB DP Design Technology IA</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {dpDesignCriteria.map(c => (
                      <span key={c.id} style={{ padding: '4px 10px', background: '#FFFFFF', border: '1px solid #E8E8E8', borderRadius: 12, fontSize: 10 }}>
                        {c.name.split(':')[0]}: <strong>{c.maxMarks}</strong>
                      </span>
                    ))}
                    <span style={{ padding: '4px 10px', background: '#EC008C', borderRadius: 12, fontSize: 10, color: '#FFFFFF', fontWeight: 600 }}>
                      Total: 36 marks
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Preview Mode */
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}>
                <button
                  onClick={() => setShowPreview(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    background: '#FFFFFF',
                    border: '1px solid #E8E8E8',
                    borderRadius: 8,
                    fontSize: 10,
                    color: '#888',
                    cursor: 'pointer',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Back to Edit
                </button>

                <button
                  onClick={copyToClipboard}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    background: copied ? '#2ECC71' : '#FFFFFF',
                    border: copied ? '1px solid #2ECC71' : '1px solid #EC008C',
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 600,
                    color: copied ? '#FFFFFF' : '#EC008C',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {copied ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      Copy to Clipboard
                    </>
                  )}
                </button>
              </div>

              <div style={{
                background: '#1a1f3c',
                borderRadius: 10,
                padding: 16,
                maxHeight: 400,
                overflow: 'auto',
              }}>
                <pre style={{
                  margin: 0,
                  fontSize: 11,
                  color: '#E8E8E8',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'Monaco, Consolas, monospace',
                  lineHeight: 1.5,
                }}>
                  {generatedRubric}
                </pre>
              </div>

              <div style={{
                marginTop: 12,
                padding: 12,
                background: '#F0FDFF',
                borderRadius: 10,
                border: '1px solid #00D4FF',
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#00D4FF', marginBottom: 4 }}>
                  How to use in {outputFormat === 'canvas' ? 'Canvas' : outputFormat === 'google' ? 'Google Classroom' : 'Toddle'}
                </div>
                <div style={{ fontSize: 10, color: '#666', lineHeight: 1.5 }}>
                  {outputFormat === 'canvas' && (
                    <>1. Copy the rubric above<br/>2. In Canvas, go to your assignment → Edit<br/>3. In the Rich Content Editor, click HTML Editor ({"</>"})<br/>4. Paste the HTML code<br/>5. Switch back to Rich Content Editor to preview</>
                  )}
                  {outputFormat === 'google' && (
                    <>1. Copy the rubric above<br/>2. In Google Classroom, create/edit an assignment<br/>3. Paste into the description or attach as a document<br/>4. For a formal rubric, paste into Google Docs and format</>
                  )}
                  {outputFormat === 'toddle' && (
                    <>1. Copy the rubric above<br/>2. Save as a .csv file<br/>3. In Toddle, go to Assessments → Import Rubric<br/>4. Upload the CSV file</>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!showPreview && (
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid #E8E8E8',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                background: '#FFFFFF',
                border: '1px solid #E8E8E8',
                borderRadius: 10,
                fontSize: 11,
                color: '#888',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={generateRubric}
              disabled={selectedCriteria.length === 0}
              style={{
                padding: '10px 20px',
                background: selectedCriteria.length === 0 ? '#E8E8E8' : '#FFFFFF',
                border: selectedCriteria.length === 0 ? '1px solid #E8E8E8' : '1px solid #EC008C',
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 600,
                color: selectedCriteria.length === 0 ? '#888' : '#EC008C',
                cursor: selectedCriteria.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Generate Rubric
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Dieter Rams style knob - minimal, functional
function Knob({ size = 32, active = false, onClick, label }: {
  size?: number; active?: boolean; onClick?: () => void; label?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <button
        onClick={onClick}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#FFFFFF',
          border: `1px solid ${active ? '#1a1f3c' : '#E8E8E8'}`,
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.15s ease',
        }}
      >
        {/* Indicator notch */}
        <div style={{
          position: 'absolute',
          top: 3,
          left: '50%',
          transform: `translateX(-50%) rotate(${active ? 90 : 0}deg)`,
          width: 1.5,
          height: size / 4,
          background: active ? '#1a1f3c' : '#BDBDBD',
          borderRadius: 1,
          transition: 'transform 0.2s ease',
        }} />
      </button>
      {label && (
        <span style={{
          fontSize: 8,
          color: '#1a1f3c',
          fontWeight: 600,
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          borderBottom: active ? '1px dotted #1a1f3c' : 'none',
          paddingBottom: 2,
        }}>
          {label}
        </span>
      )}
    </div>
  );
}

// Dieter Rams style toggle - white background, minimal
function Toggle({ active, onToggle, label }: { active: boolean; onToggle: () => void; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        onClick={onToggle}
        style={{
          width: 36,
          height: 18,
          borderRadius: 9,
          background: '#FFFFFF',
          border: `1px solid ${active ? '#1a1f3c' : '#E8E8E8'}`,
          padding: 2,
          cursor: 'pointer',
          transition: 'border-color 0.2s ease',
        }}
      >
        <div style={{
          width: 11,
          height: 11,
          borderRadius: '50%',
          background: active ? '#1a1f3c' : '#BDBDBD',
          transform: `translateX(${active ? 16 : 0}px)`,
          transition: 'all 0.2s ease',
        }} />
      </button>
      <span style={{
        fontSize: 10,
        color: '#1a1f3c',
        fontWeight: 500,
        borderBottom: active ? '1px dotted #1a1f3c' : 'none',
        paddingBottom: 1,
      }}>
        {label}
      </span>
    </div>
  );
}

// Voice Message Button with recording
function VoiceButton({ onRecordComplete }: { onRecordComplete: (text: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setPulseScale(s => s === 1 ? 1.2 : 1);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const handleClick = () => {
    if (isRecording) {
      setIsRecording(false);
      onRecordComplete("Voice message recorded!");
    } else {
      setIsRecording(true);
      // In production, use Web Speech API here
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: isRecording
          ? `linear-gradient(145deg, ${COLORS.voice}, #C0392B)`
          : `linear-gradient(145deg, ${COLORS.surfaceLight}, ${COLORS.surface})`,
        border: `2px solid ${isRecording ? COLORS.voice : COLORS.border}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        transform: `scale(${isRecording ? pulseScale : 1})`,
        boxShadow: isRecording ? `0 0 20px ${COLORS.voice}50` : '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isRecording ? 'white' : COLORS.textMuted} strokeWidth="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </button>
  );
}

// Quick Connect Panel
function QuickConnect({ member, onClose }: { member: typeof TEAM[0]; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        minWidth: 300,
        border: `1px solid ${COLORS.border}`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: '#F8FAFC',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `3px solid ${member.online ? COLORS.online : '#E2E8F0'}`,
            overflow: 'hidden',
          }}>
            <BlockAvatar type={member.avatar} size={72} />
          </div>
          <h3 style={{ color: '#1a1f3c', fontSize: 18, margin: '0 0 4px' }}>{member.name}</h3>
          <p style={{ color: '#1a1f3c', fontSize: 11, margin: '0 0 4px', fontWeight: 500, borderBottom: '1px dotted #1a1f3c', display: 'inline-block', paddingBottom: 2 }}>Grades {member.grades}</p>
          <p style={{ color: '#757575', fontSize: 10, margin: '4px 0 0' }}>{member.classes}</p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginTop: 10
          }}>
            <div style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: member.online ? '#39FF14' : '#FFFFFF',
              border: '0.5px solid #BDBDBD',
            }} />
            <span style={{ fontSize: 11, color: '#757575' }}>
              {member.online ? 'Online now' : 'Offline'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${member.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: COLORS.whatsapp,
              borderRadius: 10,
              textDecoration: 'none',
              color: 'white',
              fontWeight: 500,
              fontSize: 14,
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Message on WhatsApp
          </a>

          {/* FaceTime */}
          <a
            href={`facetime:${member.phone}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: COLORS.facetime,
              borderRadius: 10,
              textDecoration: 'none',
              color: 'white',
              fontWeight: 500,
              fontSize: 14,
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            FaceTime Call
          </a>

          {/* Voice Message */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 16px',
              background: COLORS.voice,
              borderRadius: 10,
              border: 'none',
              color: 'white',
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
            Send Voice Message
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            width: '100%',
            padding: '10px',
            background: '#F8FAFC',
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            color: '#64748B',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Activity Feed Item
function ActivityItem({ activity }: { activity: { user: string; action: string; target: string; time: string; type: string } }) {
  return (
    <div style={{
      display: 'flex',
      gap: 10,
      padding: '10px 0',
      borderBottom: `1px solid ${COLORS.border}20`,
    }}>
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: COLORS.accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 600,
        color: 'white',
        flexShrink: 0,
      }}>
        {activity.user.split(' ').map(n => n[0]).join('')}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 12, color: COLORS.text, lineHeight: 1.4 }}>
          <strong>{activity.user}</strong> {activity.action} <span style={{ color: COLORS.accent }}>{activity.target}</span>
        </p>
        <span style={{ fontSize: 10, color: COLORS.textMuted }}>{activity.time}</span>
      </div>
    </div>
  );
}

// Dot grid background
function DotGrid() {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
      <defs>
        <pattern id="dotPattern" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.5" fill={COLORS.dotGrid} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotPattern)" />
    </svg>
  );
}

export default function HomePage() {
  const [showGrid, setShowGrid] = useState(true);
  const [viewMode, setViewMode] = useState<'pins' | 'list'>('pins');
  const [selectedMember, setSelectedMember] = useState<typeof TEAM[0] | null>(null);
  const [showActivity, setShowActivity] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [showIBFormatter, setShowIBFormatter] = useState(false);
  const [showRubricBuilder, setShowRubricBuilder] = useState(false);
  const [showResourceLibrary, setShowResourceLibrary] = useState(false);
  const [myAvatar, setMyAvatar] = useState<AvatarConfig>({ style: 'block', hair: 'short', accessory: 'none', color: 'cyan' });
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Post-it notes with push pin colors (CMYK) - stored in state for dragging
  const [postIts, setPostIts] = useState([
    { id: 0, x: 4, y: 6, title: 'Campaign idea', author: 'Sarah', note: 'What if we tried a student-led approach?', pinColor: 'idea' },
    { id: 1, x: 22, y: 4, title: 'Banner draft', author: 'Mike', note: 'Check out this layout concept', pinColor: 'image' },
    { id: 2, x: 42, y: 8, title: 'Brand story', author: 'Alex', note: 'Let\'s incorporate more narrative', pinColor: 'story' },
    { id: 3, x: 62, y: 5, title: 'Intro video', author: 'Jordan', note: 'Motion reference attached', pinColor: 'video' },
    { id: 4, x: 6, y: 35, title: 'Photo shoot', author: 'Taylor', note: 'Location ideas for spring', pinColor: 'image' },
    { id: 5, x: 28, y: 40, title: 'User story', author: 'Sam', note: 'Interview notes from students', pinColor: 'story' },
    { id: 6, x: 50, y: 32, title: 'Pitch deck', author: 'Sarah', note: 'Draft slides for review', pinColor: 'idea' },
    { id: 7, x: 72, y: 38, title: 'App demo', author: 'Mike', note: 'Prototype link inside', pinColor: 'video' },
    { id: 8, x: 10, y: 65, title: 'Rebrand', author: 'Alex', note: 'Color palette explorations', pinColor: 'idea' },
    { id: 9, x: 35, y: 70, title: 'Case study', author: 'Jordan', note: 'Student project documentation', pinColor: 'story' },
    { id: 10, x: 58, y: 62, title: 'Tutorial', author: 'Taylor', note: 'Step-by-step for beginners', pinColor: 'video' },
    { id: 11, x: 78, y: 68, title: 'Mood board', author: 'Sam', note: 'Inspiration collection', pinColor: 'image' },
  ]);

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    const postIt = postIts.find(p => p.id === id);
    if (!postIt || !boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const currentX = (postIt.x / 100) * rect.width;
    const currentY = (postIt.y / 100) * rect.height;

    setDraggingId(id);
    setDragOffset({
      x: e.clientX - rect.left - currentX,
      y: e.clientY - rect.top - currentY
    });
  };

  // Handle drag move
  const handleDragMove = (e: React.MouseEvent) => {
    if (draggingId === null || !boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const newX = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const newY = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;

    // Clamp values to keep post-it on board
    const clampedX = Math.max(0, Math.min(85, newX));
    const clampedY = Math.max(0, Math.min(85, newY));

    setPostIts(prev => prev.map(p =>
      p.id === draggingId ? { ...p, x: clampedX, y: clampedY } : p
    ));
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggingId(null);
  };


  // Pure CMYK colors - brilliant cyan
  const typeColors: Record<string, string> = {
    idea: '#FFE500',    // Yellow (Y)
    image: '#EC008C',   // Magenta (M)
    story: '#00D4FF',   // Brilliant Cyan (C)
    video: '#231F20',   // Key/Black (K)
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Header */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: `1px solid ${COLORS.border}`,
        padding: '10px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <h1 style={{
            fontSize: 20,
            fontWeight: 700,
            margin: 0,
            letterSpacing: -0.5,
          }}>
            <span style={{ color: '#1a1f3c' }}>DS Design</span><span style={{ color: '#00D4FF' }}>a</span><span style={{ color: '#EC008C' }}>g</span><span style={{ color: '#FFE500' }}>r</span><span style={{ color: '#00D4FF' }}>a</span><span style={{ color: '#1a1f3c' }}>m</span>
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Controls - Grid toggle and nav items on same line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 12px', borderRight: `1px solid ${COLORS.border}` }}>
            <Toggle active={showGrid} onToggle={() => setShowGrid(!showGrid)} label="Grid" />
            <Toggle active={showActivity} onToggle={() => setShowActivity(!showActivity)} label="Ideas" />
          </div>

          {/* Nav items */}
          <nav style={{ display: 'flex', gap: 12 }}>
            {['Board', 'Projects', 'Team'].map((item, i) => (
              <button
                key={item}
                style={{
                  padding: '4px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: i === 0 ? '1px dotted #1a1f3c' : '1px dotted transparent',
                  color: '#1a1f3c',
                  fontSize: 11,
                  fontWeight: i === 0 ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {item}
              </button>
            ))}
          </nav>

          <div style={{ width: 1, height: 20, background: COLORS.border }} />

          {/* Time */}
          <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: 'monospace' }}>
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {/* CMYK Accent Knobs */}
          <div style={{ display: 'flex', gap: 8 }}>
            {/* Cyan - Pins */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <button
                onClick={() => setViewMode('pins')}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: viewMode === 'pins' ? '2px solid #00FFFF' : '1px solid #E8E8E8',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                  boxShadow: viewMode === 'pins' ? '0 0 8px rgba(0,255,255,0.3)' : 'none',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 6,
                  background: viewMode === 'pins' ? '#00FFFF' : '#CCC',
                  borderRadius: 1,
                }} />
              </button>
              <span style={{ fontSize: 7, color: viewMode === 'pins' ? '#00CCCC' : '#888', fontWeight: 600, letterSpacing: 0.5 }}>PINS</span>
            </div>

            {/* Magenta - Photos */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <button
                onClick={() => window.open('/photos', 'Photos', 'width=900,height=700,menubar=no,toolbar=no,location=no,status=no')}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '1px solid #FF00FF',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 6,
                  background: '#FF00FF',
                  borderRadius: 1,
                }} />
              </button>
              <span style={{ fontSize: 7, color: '#CC00CC', fontWeight: 600, letterSpacing: 0.5 }}>PHOTO</span>
            </div>

            {/* Yellow - List */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: viewMode === 'list' ? '2px solid #FFD700' : '1px solid #E8E8E8',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                  boxShadow: viewMode === 'list' ? '0 0 8px rgba(255,215,0,0.3)' : 'none',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 6,
                  background: viewMode === 'list' ? '#FFD700' : '#CCC',
                  borderRadius: 1,
                }} />
              </button>
              <span style={{ fontSize: 7, color: viewMode === 'list' ? '#CCB000' : '#888', fontWeight: 600, letterSpacing: 0.5 }}>LIST</span>
            </div>

            {/* Key - Timer */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <button
                onClick={() => window.open('/timer', 'Timer', 'width=800,height=700,menubar=no,toolbar=no,location=no,status=no')}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '1px solid #1a1f3c',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 4,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 2,
                  height: 6,
                  background: '#1a1f3c',
                  borderRadius: 1,
                }} />
              </button>
              <span style={{ fontSize: 7, color: '#1a1f3c', fontWeight: 600, letterSpacing: 0.5 }}>TIME</span>
            </div>
          </div>

          {/* Notifications */}
          <button style={{
            position: 'relative',
            width: 36,
            height: 36,
            borderRadius: 12,
            background: '#FFFFFF',
            border: '1px solid #E8E8E8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1f3c" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notifications > 0 && (
              <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #00D4FF',
                color: '#00D4FF',
                fontSize: 8,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {notifications}
              </span>
            )}
          </button>

          {/* User with Block avatar */}
          <div
            onClick={() => setShowAvatarEditor(true)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #00D4FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
            title="Edit your Avatar"
          >
            <BlockAvatarCustom hair={myAvatar.hair} accessory={myAvatar.accessory} size={32} />
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', height: 'calc(100vh - 57px)' }}>
        {/* Team Sidebar */}
        <aside style={{
          width: 220,
          background: '#FFFFFF',
          borderRight: `1px solid ${COLORS.border}`,
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, margin: '0 0 12px', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Design Teachers ({TEAM.filter(t => t.online).length} online)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {TEAM.map(member => (
                <button
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      <BlockAvatar type={member.avatar} size={34} />
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: member.online ? '#39FF14' : '#FFFFFF',
                      border: member.online ? '0.5px solid #BDBDBD' : '0.5px solid #E0E0E0',
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: COLORS.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {member.name}
                    </div>
                    <div style={{ fontSize: 9, color: COLORS.textMuted }}>Grades {member.grades} · {member.classes.split(',')[0]}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Teacher Tools */}
          <div style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, margin: '0 0 12px', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Teacher Tools
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* Add Post-it */}
              <button style={{
                width: '100%',
                padding: '8px 10px',
                background: '#FFFFFF',
                border: '1px solid #00D4FF',
                borderRadius: 10,
                color: '#1a1f3c',
                fontSize: 10,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                Add Post-it Note
              </button>

              {/* IB Lesson Formatter */}
              <button
                onClick={() => setShowIBFormatter(true)}
                style={{
                width: '100%',
                padding: '8px 10px',
                background: '#FFFFFF',
                border: '1px solid #EC008C',
                borderRadius: 10,
                color: '#1a1f3c',
                fontSize: 10,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EC008C" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                IB Lesson Formatter
              </button>

              {/* Timer - Opens in new window */}
              <button
                onClick={() => window.open('/timer', 'ClassroomTimer', 'width=800,height=700,menubar=no,toolbar=no,location=no,status=no')}
                style={{
                width: '100%',
                padding: '8px 10px',
                background: '#FFFFFF',
                border: '1px solid #FFE500',
                borderRadius: 10,
                color: '#1a1f3c',
                fontSize: 10,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFE500" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Timer
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{ marginLeft: 'auto' }}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </button>

              {/* Random Student Picker - Opens in new window */}
              <button
                onClick={() => window.open('/picker', 'RandomPicker', 'width=900,height=700,menubar=no,toolbar=no,location=no,status=no')}
                style={{
                width: '100%',
                padding: '8px 10px',
                background: '#FFFFFF',
                border: '1px solid #00D4FF',
                borderRadius: 10,
                color: '#1a1f3c',
                fontSize: 10,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                Random Picker
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" style={{ marginLeft: 'auto' }}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </button>

              {/* Rubric Builder */}
              <button
                onClick={() => setShowRubricBuilder(true)}
                style={{
                width: '100%',
                padding: '8px 10px',
                background: '#FFFFFF',
                border: '1px solid #EC008C',
                borderRadius: 10,
                color: '#1a1f3c',
                fontSize: 10,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EC008C" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Rubric Builder
              </button>

              {/* Resource Library */}
              <div>
                <button
                  onClick={() => setShowResourceLibrary(!showResourceLibrary)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    background: showResourceLibrary ? '#F5F5F5' : '#FFFFFF',
                    border: '1px solid #E8E8E8',
                    borderRadius: showResourceLibrary ? '10px 10px 0 0' : 10,
                    color: '#1a1f3c',
                    fontSize: 10,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a1f3c" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  Resource Library
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" style={{ marginLeft: 'auto', transform: showResourceLibrary ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {showResourceLibrary && (
                  <div style={{
                    background: '#F9F9F9',
                    border: '1px solid #E8E8E8',
                    borderTop: 'none',
                    borderRadius: '0 0 10px 10px',
                    padding: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}>
                    <a
                      href="https://unspool.work"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 8px',
                        background: '#FFFFFF',
                        border: '1px solid #00D4FF',
                        borderRadius: 6,
                        color: '#1a1f3c',
                        fontSize: 9,
                        fontWeight: 500,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D4FF' }} />
                      Unspool
                    </a>
                    <a
                      href="https://toolsforschools-v2.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 8px',
                        background: '#FFFFFF',
                        border: '1px solid #EC008C',
                        borderRadius: 6,
                        color: '#1a1f3c',
                        fontSize: 9,
                        fontWeight: 500,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EC008C' }} />
                      Tools for Schools
                    </a>
                    <a
                      href="https://filegenerator-eight.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 8px',
                        background: '#FFFFFF',
                        border: '1px solid #FFE500',
                        borderRadius: 6,
                        color: '#1a1f3c',
                        fontSize: 9,
                        fontWeight: 500,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFE500' }} />
                      File Generator
                    </a>
                    <a
                      href="https://csf2030.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 8px',
                        background: '#FFFFFF',
                        border: '1px solid #1a1f3c',
                        borderRadius: 6,
                        color: '#1a1f3c',
                        fontSize: 9,
                        fontWeight: 500,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a1f3c' }} />
                      CSF 2030
                    </a>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid #E8E8E8', margin: '8px 0' }} />

              {/* Voice Note */}
              <div style={{ display: 'flex', gap: 6 }}>
                <VoiceButton onRecordComplete={(text) => console.log(text)} />
                <button
                  onClick={() => setShowAvatarEditor(true)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#FFFFFF',
                    border: '1px solid #FFE500',
                    borderRadius: 10,
                    color: '#1a1f3c',
                    fontSize: 9,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFE500" strokeWidth="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  My Avatar
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Whiteboard */}
        <main style={{ flex: 1, padding: 20, overflow: 'hidden' }}>
          <div
            ref={boardRef}
            style={{
            background: '#FFFFFF',
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            cursor: draggingId !== null ? 'grabbing' : 'default',
          }}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            {showGrid && <DotGrid />}

            {/* Post-it notes with push pins - draggable */}
            {postIts.map((postIt) => (
              <div
                key={postIt.id}
                style={{
                  position: 'absolute',
                  left: `${postIt.x}%`,
                  top: `${postIt.y}%`,
                  cursor: draggingId === postIt.id ? 'grabbing' : 'grab',
                  zIndex: draggingId === postIt.id ? 100 : 10,
                  transition: draggingId === postIt.id ? 'none' : 'transform 0.15s ease',
                  transform: draggingId === postIt.id ? 'scale(1.05)' : 'scale(1)',
                  userSelect: 'none',
                }}
                onMouseDown={(e) => handleDragStart(e, postIt.id)}
                onMouseEnter={(e) => {
                  if (draggingId === null) {
                    e.currentTarget.style.transform = 'rotate(-2deg) scale(1.05)';
                    e.currentTarget.style.zIndex = '100';
                  }
                }}
                onMouseLeave={(e) => {
                  if (draggingId === null) {
                    e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                    e.currentTarget.style.zIndex = '10';
                  }
                }}
              >
                {/* Post-it note */}
                <div style={{
                  width: 120,
                  minHeight: 80,
                  background: '#FFFEF0',
                  border: '1px solid #E8E8E8',
                  borderRadius: 8,
                  padding: '20px 10px 10px 10px',
                  boxShadow: '2px 2px 6px rgba(0,0,0,0.04)',
                  position: 'relative',
                }}>
                  {/* Push pin */}
                  <div style={{
                    position: 'absolute',
                    top: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16">
                      <circle cx="8" cy="8" r="6" fill={typeColors[postIt.pinColor]} stroke="#1a1f3c" strokeWidth="0.5" />
                      <circle cx="8" cy="8" r="2" fill="#FFFFFF" opacity="0.4" />
                    </svg>
                  </div>
                  {/* Content */}
                  <div style={{ fontSize: 9, fontWeight: 600, color: '#1a1f3c', marginBottom: 4, borderBottom: '1px dotted #E0E0E0', paddingBottom: 4 }}>
                    {postIt.title}
                  </div>
                  <p style={{ fontSize: 8, color: '#757575', margin: '0 0 6px', lineHeight: 1.4 }}>
                    {postIt.note}
                  </p>
                  <div style={{ fontSize: 7, color: '#BDBDBD' }}>— {postIt.author}</div>
                </div>
              </div>
            ))}

            {/* Add Button - Dieter Rams style */}
            <button
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #00D4FF',
                color: '#00D4FF',
                fontSize: 28,
                fontWeight: 300,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.background = '#00D4FF';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.color = '#00D4FF';
              }}
            >
              +
            </button>

            {/* Toolbar - Dieter Rams style */}
            <div style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              display: 'flex',
              gap: 12,
              background: '#FFFFFF',
              padding: '8px 14px',
              borderRadius: 16,
              border: '1px solid #E8E8E8',
              zIndex: 20,
            }}>
              <Knob size={24} label="ZOOM" />
              <Knob size={24} label="PAN" />
              <div style={{ width: 1, background: '#E8E8E8', margin: '0 4px' }} />
              <Knob size={24} label="SNAP" active />
            </div>
          </div>
        </main>

        {/* Inspiration & Ideas Sidebar */}
        {showActivity && (
          <aside style={{
            width: 260,
            background: '#FFFFFF',
            borderLeft: `1px solid ${COLORS.border}`,
            padding: 16,
            overflow: 'auto',
          }}>
            {/* Share Inspiration */}
            <div style={{
              marginBottom: 20,
              padding: 14,
              background: '#FFFFFF',
              borderRadius: 14,
              border: '1px solid #00D4FF',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', marginBottom: 10, borderBottom: '1px dotted #00D4FF', paddingBottom: 4, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Share Inspiration
              </div>
              <p style={{ fontSize: 11, color: COLORS.textMuted, margin: '0 0 10px', lineHeight: 1.4 }}>
                Found something that sparks ideas?
              </p>
              <button style={{
                width: '100%',
                padding: '8px 12px',
                background: '#FFFFFF',
                border: '1px solid #00D4FF',
                borderRadius: 10,
                color: '#00D4FF',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}>
                Share a Link or Image
              </button>
            </div>

            {/* Project Ideas */}
            <div style={{
              marginBottom: 20,
              padding: 14,
              background: '#FAFAFA',
              borderRadius: 14,
              border: '1px solid #EC008C',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1f3c', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EC008C" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                Project Ideas
              </div>
              <p style={{ fontSize: 11, color: COLORS.textMuted, margin: '0 0 10px', lineHeight: 1.4 }}>
                Have a project the team could collaborate on?
              </p>
              <button style={{
                width: '100%',
                padding: '8px 12px',
                background: '#FFFFFF',
                border: '1px solid #EC008C',
                borderRadius: 10,
                color: '#EC008C',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}>
                Propose a Project
              </button>
            </div>

            {/* Recent Shares */}
            <h3 style={{ fontSize: 11, fontWeight: 600, color: COLORS.textMuted, margin: '0 0 12px', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Recent Shares
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: '10px', background: '#FAFAFA', borderRadius: 10, border: '1px solid #E8E8E8' }}>
                <p style={{ fontSize: 10, color: '#1a1f3c', margin: 0, lineHeight: 1.4 }}>
                  <strong>Sarah</strong> shared a typography resource
                </p>
                <span style={{ fontSize: 9, color: COLORS.textMuted }}>2h ago</span>
              </div>
              <div style={{ padding: '10px', background: '#FAFAFA', borderRadius: 10, border: '1px solid #E8E8E8' }}>
                <p style={{ fontSize: 10, color: '#1a1f3c', margin: 0, lineHeight: 1.4 }}>
                  <strong>Mike</strong> proposed a group critique
                </p>
                <span style={{ fontSize: 9, color: COLORS.textMuted }}>5h ago</span>
              </div>
              <div style={{ padding: '10px', background: '#FAFAFA', borderRadius: 10, border: '1px solid #E8E8E8' }}>
                <p style={{ fontSize: 10, color: '#1a1f3c', margin: 0, lineHeight: 1.4 }}>
                  <strong>Jordan</strong> shared motion inspiration
                </p>
                <span style={{ fontSize: 9, color: COLORS.textMuted }}>1d ago</span>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Quick Connect Modal */}
      {selectedMember && (
        <QuickConnect member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}

      {/* Avatar Editor Modal */}
      {showAvatarEditor && (
        <AvatarEditor
          onClose={() => setShowAvatarEditor(false)}
          onSave={(config) => {
            setMyAvatar(config);
            setShowAvatarEditor(false);
          }}
        />
      )}

      {/* IB Lesson Formatter Modal */}
      {showIBFormatter && (
        <IBLessonFormatter onClose={() => setShowIBFormatter(false)} />
      )}

      {/* Rubric Builder Modal */}
      {showRubricBuilder && (
        <RubricBuilder onClose={() => setShowRubricBuilder(false)} />
      )}
    </div>
  );
}
