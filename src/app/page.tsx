'use client';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ color: 'white', fontSize: '32px', fontWeight: '700', margin: 0 }}>
          DS DesignBook
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          {['Whiteboard', 'Projects', 'Forums', 'Members'].map(item => (
            <button key={item} style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Whiteboard Area */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        minHeight: '70vh',
        padding: '24px',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Sample Pins */}
        {[
          { x: 10, y: 10, color: '#FF6B6B', title: 'Logo Concepts', author: 'Sarah' },
          { x: 35, y: 20, color: '#4ECDC4', title: 'Brand Guidelines', author: 'Mike' },
          { x: 60, y: 15, color: '#FFE66D', title: 'Website Mockup', author: 'Alex' },
          { x: 20, y: 50, color: '#95E1D3', title: 'Icon Set v2', author: 'Jordan' },
          { x: 50, y: 45, color: '#DDA0DD', title: 'App Screens', author: 'Taylor' },
          { x: 75, y: 35, color: '#87CEEB', title: 'Print Materials', author: 'Sam' },
        ].map((pin, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            background: pin.color,
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            minWidth: '140px'
          }}>
            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{pin.title}</div>
            <div style={{ fontSize: '12px', opacity: 0.7 }}>by {pin.author}</div>
          </div>
        ))}

        {/* Add Pin Button */}
        <button style={{
          position: 'absolute',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          color: 'white',
          fontSize: '28px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.5)'
        }}>
          +
        </button>
      </div>
    </div>
  );
}
