'use client';

import { useState, useEffect, useRef } from 'react';

// Standalone Random Picker - safe to share on screen
export default function RandomPickerPage() {
  const [names, setNames] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [pickedNames, setPickedNames] = useState<string[]>([]);
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [mode, setMode] = useState<'picker' | 'groups'>('picker');
  const [groupSize, setGroupSize] = useState(2);
  const [groups, setGroups] = useState<string[][]>([]);
  const [showSetup, setShowSetup] = useState(true);
  const spinInterval = useRef<NodeJS.Timeout | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample class for demo
  const sampleClass = [
    'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey',
    'Riley', 'Quinn', 'Avery', 'Sage', 'Dakota',
    'Reese', 'Finley', 'Harper', 'Rowan', 'Blair'
  ];

  // Handle file upload for class roster
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      let parsedNames: string[] = [];

      if (file.name.endsWith('.csv')) {
        // Parse CSV - handle various formats
        const lines = content.split(/\r?\n/);
        lines.forEach(line => {
          // Skip empty lines and potential header rows
          if (!line.trim()) return;
          const lowerLine = line.toLowerCase();
          if (lowerLine.includes('name') && lowerLine.includes('student') ||
              lowerLine.includes('first') && lowerLine.includes('last')) {
            return; // Skip header row
          }

          // Split by comma and take first non-empty cell as name
          // This handles: "Name" or "First,Last" or "ID,Name,Email" formats
          const cells = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));

          // Try to find a name-like cell (not a number, not an email)
          for (const cell of cells) {
            if (cell &&
                !/^\d+$/.test(cell) && // Not just numbers
                !cell.includes('@') && // Not an email
                cell.length > 1 &&
                cell.length < 50) {
              parsedNames.push(cell);
              break;
            }
          }
        });
      } else {
        // Parse TXT - one name per line or comma-separated
        parsedNames = content
          .split(/[,\n\r]+/)
          .map(n => n.trim())
          .filter(n => n.length > 0 && n.length < 50);
      }

      // Filter out duplicates and existing names
      const newNames = parsedNames.filter(n =>
        n.length > 0 && !names.includes(n)
      );

      if (newNames.length > 0) {
        setNames([...names, ...newNames]);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  // Available names (excluding picked if no repeats)
  const availableNames = allowRepeats
    ? names
    : names.filter(n => !pickedNames.includes(n));

  // Add names from input
  const addNames = () => {
    const newNames = inputValue
      .split(/[,\n]/)
      .map(n => n.trim())
      .filter(n => n.length > 0 && !names.includes(n));

    if (newNames.length > 0) {
      setNames([...names, ...newNames]);
      setInputValue('');
    }
  };

  // Load sample class
  const loadSample = () => {
    setNames(sampleClass);
    setInputValue('');
  };

  // Clear all names
  const clearAll = () => {
    setNames([]);
    setPickedNames([]);
    setSelectedName(null);
    setGroups([]);
  };

  // Remove a specific name
  const removeName = (name: string) => {
    setNames(names.filter(n => n !== name));
    setPickedNames(pickedNames.filter(n => n !== name));
  };

  // Spin and pick random name
  const spinPicker = () => {
    if (availableNames.length === 0) return;

    setIsSpinning(true);
    setSelectedName(null);

    let spins = 0;
    const totalSpins = 20 + Math.floor(Math.random() * 10);

    spinInterval.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableNames.length);
      setSelectedName(availableNames[randomIndex]);
      spins++;

      if (spins >= totalSpins) {
        clearInterval(spinInterval.current!);
        setIsSpinning(false);

        const finalPick = availableNames[Math.floor(Math.random() * availableNames.length)];
        setSelectedName(finalPick);

        if (!allowRepeats) {
          setPickedNames([...pickedNames, finalPick]);
        }

        // Play sound
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.frequency.value = 523.25; // C5
          oscillator.type = 'sine';
          gainNode.gain.value = 0.3;
          oscillator.start();
          setTimeout(() => {
            oscillator.frequency.value = 659.25; // E5
            setTimeout(() => {
              oscillator.frequency.value = 783.99; // G5
              setTimeout(() => {
                oscillator.stop();
                audioContext.close();
              }, 150);
            }, 150);
          }, 150);
        } catch (e) {
          console.log('Audio not supported');
        }
      }
    }, 50 + spins * 5); // Gradually slow down
  };

  // Generate random groups
  const generateGroups = () => {
    if (names.length === 0) return;

    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const newGroups: string[][] = [];

    for (let i = 0; i < shuffled.length; i += groupSize) {
      newGroups.push(shuffled.slice(i, i + groupSize));
    }

    setGroups(newGroups);
  };

  // Reset picker
  const resetPicker = () => {
    setPickedNames([]);
    setSelectedName(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spinInterval.current) {
        clearInterval(spinInterval.current);
      }
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFFFF',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #E8E8E8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#1a1f3c' }}>
          {mode === 'picker' ? '🎲 Random Picker' : '👥 Group Generator'}
        </h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setMode('picker')}
            style={{
              padding: '8px 16px',
              background: mode === 'picker' ? '#1a1f3c' : '#FFFFFF',
              border: '1px solid #E8E8E8',
              borderRadius: 8,
              color: mode === 'picker' ? '#FFFFFF' : '#666',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Random Pick
          </button>
          <button
            onClick={() => setMode('groups')}
            style={{
              padding: '8px 16px',
              background: mode === 'groups' ? '#1a1f3c' : '#FFFFFF',
              border: '1px solid #E8E8E8',
              borderRadius: 8,
              color: mode === 'groups' ? '#FFFFFF' : '#666',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Make Groups
          </button>
          <button
            onClick={() => setShowSetup(!showSetup)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #E8E8E8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 69px)' }}>
        {/* Setup panel */}
        {showSetup && (
          <div style={{
            width: 300,
            borderRight: '1px solid #E8E8E8',
            padding: 20,
            background: '#FAFAFA',
          }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 8 }}>
                ADD NAMES
              </label>
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter names separated by commas or new lines..."
                style={{
                  width: '100%',
                  minHeight: 80,
                  padding: 10,
                  border: '1px solid #E8E8E8',
                  borderRadius: 8,
                  fontSize: 13,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  onClick={addNames}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: '#00D4FF',
                    border: 'none',
                    borderRadius: 8,
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Add Names
                </button>
                <button
                  onClick={loadSample}
                  style={{
                    padding: '8px 12px',
                    background: '#FFFFFF',
                    border: '1px solid #E8E8E8',
                    borderRadius: 8,
                    color: '#666',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Sample
                </button>
              </div>

              {/* File Upload for Class Roster */}
              <div style={{ marginTop: 12 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="roster-upload"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#FFFFFF',
                    border: '2px dashed #D0D0D0',
                    borderRadius: 8,
                    color: '#666',
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  Upload Class Roster (.csv, .txt)
                </button>
                <div style={{ fontSize: 10, color: '#888', marginTop: 4, textAlign: 'center' }}>
                  One name per line or comma-separated
                </div>
              </div>
            </div>

            {/* Name list */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#666' }}>
                  CLASS LIST ({names.length})
                </label>
                {names.length > 0 && (
                  <button
                    onClick={clearAll}
                    style={{
                      padding: '4px 8px',
                      background: 'none',
                      border: 'none',
                      color: '#E74C3C',
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div style={{
                maxHeight: 200,
                overflow: 'auto',
                background: '#FFFFFF',
                borderRadius: 8,
                border: '1px solid #E8E8E8',
              }}>
                {names.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: '#888', fontSize: 12 }}>
                    No names added yet
                  </div>
                ) : (
                  names.map(name => (
                    <div
                      key={name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderBottom: '1px solid #F0F0F0',
                        opacity: pickedNames.includes(name) && !allowRepeats ? 0.4 : 1,
                      }}
                    >
                      <span style={{
                        fontSize: 13,
                        color: pickedNames.includes(name) && !allowRepeats ? '#888' : '#1a1f3c',
                        textDecoration: pickedNames.includes(name) && !allowRepeats ? 'line-through' : 'none',
                      }}>
                        {name}
                      </span>
                      <button
                        onClick={() => removeName(name)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#888',
                          cursor: 'pointer',
                          padding: 4,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Options */}
            {mode === 'picker' && (
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 13,
                  color: '#666',
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={allowRepeats}
                    onChange={(e) => setAllowRepeats(e.target.checked)}
                    style={{ width: 16, height: 16 }}
                  />
                  Allow repeats
                </label>
                {!allowRepeats && pickedNames.length > 0 && (
                  <button
                    onClick={resetPicker}
                    style={{
                      marginTop: 12,
                      width: '100%',
                      padding: '8px 12px',
                      background: '#FFFFFF',
                      border: '1px solid #E8E8E8',
                      borderRadius: 8,
                      color: '#666',
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    Reset Picked ({pickedNames.length})
                  </button>
                )}
              </div>
            )}

            {mode === 'groups' && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#666', display: 'block', marginBottom: 8 }}>
                  GROUP SIZE
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[2, 3, 4, 5].map(size => (
                    <button
                      key={size}
                      onClick={() => setGroupSize(size)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: groupSize === size ? '#1a1f3c' : '#FFFFFF',
                        border: '1px solid #E8E8E8',
                        borderRadius: 8,
                        color: groupSize === size ? '#FFFFFF' : '#666',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}>
          {mode === 'picker' ? (
            <>
              {/* Picker display */}
              <div style={{
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: isSpinning
                  ? 'linear-gradient(135deg, #00D4FF 0%, #EC008C 50%, #FFE500 100%)'
                  : selectedName
                    ? 'linear-gradient(135deg, #00D4FF 0%, #EC008C 100%)'
                    : '#F8F8F8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 40,
                boxShadow: isSpinning ? '0 0 60px rgba(0, 212, 255, 0.4)' : '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                animation: isSpinning ? 'spin 0.5s linear infinite' : 'none',
              }}>
                <div style={{
                  width: 360,
                  height: 360,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {selectedName ? (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: 48,
                        fontWeight: 700,
                        color: '#1a1f3c',
                        marginBottom: 8,
                      }}>
                        {selectedName}
                      </div>
                      {!isSpinning && (
                        <div style={{ fontSize: 14, color: '#888' }}>
                          {!allowRepeats ? `${availableNames.length} remaining` : `${names.length} total`}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#888' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 12 }}>
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <div style={{ fontSize: 16 }}>
                        {names.length === 0 ? 'Add names to get started' : 'Click PICK to select'}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pick button */}
              <button
                onClick={spinPicker}
                disabled={availableNames.length === 0 || isSpinning}
                style={{
                  padding: '20px 60px',
                  background: availableNames.length === 0 ? '#E8E8E8' : '#1a1f3c',
                  border: 'none',
                  borderRadius: 40,
                  color: '#FFFFFF',
                  fontSize: 24,
                  fontWeight: 700,
                  cursor: availableNames.length === 0 ? 'not-allowed' : 'pointer',
                  letterSpacing: 2,
                }}
              >
                {isSpinning ? 'PICKING...' : availableNames.length === 0 && names.length > 0 ? 'ALL PICKED!' : 'PICK'}
              </button>

              {/* Picked history */}
              {pickedNames.length > 0 && !allowRepeats && (
                <div style={{ marginTop: 40, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>ALREADY PICKED:</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {pickedNames.map((name, i) => (
                      <span key={i} style={{
                        padding: '6px 14px',
                        background: '#F0F0F0',
                        borderRadius: 20,
                        fontSize: 13,
                        color: '#666',
                      }}>
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Groups display */}
              {groups.length === 0 ? (
                <div style={{ textAlign: 'center' }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#D0D0D0" strokeWidth="1" style={{ marginBottom: 20 }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <div style={{ fontSize: 18, color: '#888', marginBottom: 30 }}>
                    {names.length === 0 ? 'Add names to create groups' : 'Click button to generate random groups'}
                  </div>
                  <button
                    onClick={generateGroups}
                    disabled={names.length === 0}
                    style={{
                      padding: '16px 48px',
                      background: names.length === 0 ? '#E8E8E8' : '#1a1f3c',
                      border: 'none',
                      borderRadius: 30,
                      color: '#FFFFFF',
                      fontSize: 18,
                      fontWeight: 600,
                      cursor: names.length === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Generate Groups
                  </button>
                </div>
              ) : (
                <div style={{ width: '100%', maxWidth: 800 }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 20,
                    marginBottom: 30,
                  }}>
                    {groups.map((group, i) => (
                      <div
                        key={i}
                        style={{
                          background: '#FFFFFF',
                          border: '2px solid',
                          borderColor: ['#00D4FF', '#EC008C', '#FFE500', '#1a1f3c'][i % 4],
                          borderRadius: 16,
                          padding: 20,
                        }}
                      >
                        <div style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: ['#00D4FF', '#EC008C', '#B8860B', '#1a1f3c'][i % 4],
                          marginBottom: 12,
                          letterSpacing: 1,
                        }}>
                          GROUP {i + 1}
                        </div>
                        {group.map(name => (
                          <div key={name} style={{
                            padding: '8px 0',
                            borderBottom: '1px solid #F0F0F0',
                            fontSize: 16,
                            color: '#1a1f3c',
                          }}>
                            {name}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <button
                      onClick={generateGroups}
                      style={{
                        padding: '12px 32px',
                        background: '#FFFFFF',
                        border: '2px solid #1a1f3c',
                        borderRadius: 30,
                        color: '#1a1f3c',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      🔀 Shuffle Groups
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
