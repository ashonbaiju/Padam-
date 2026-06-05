import { useRef, useState } from 'react';

export default function Interactive3DIcon({ icon: Icon, color = '#E50914' }) {
  const ref = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max rotation 35 degrees for extreme 3D effect
    const rotateX = ((y - centerY) / centerY) * -35; 
    const rotateY = ((x - centerX) / centerX) * 35;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      className="relative w-12 h-12 shrink-0 cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D Object Container */}
      <div 
        ref={ref}
        className={`w-full h-full absolute inset-0 ${!isHovered ? 'animate-float-3d' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-in-out',
          transform: isHovered 
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.15)` 
            : 'rotateX(0deg) rotateY(0deg) scale(1)'
        }}
      >
        {/* Back / Shadow Layer */}
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{
            background: 'rgba(0,0,0,0.8)',
            transform: 'translateZ(-15px)',
            filter: 'blur(10px)',
            opacity: isHovered ? 0.8 : 0.4,
            transition: 'opacity 0.3s'
          }}
        />

        {/* 3D Glass Cube Base */}
        <div 
          className="absolute inset-0 rounded-2xl border overflow-hidden backdrop-blur-xl"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 100%)`,
            borderColor: `rgba(255,255,255,0.2)`,
            transform: 'translateZ(0px)',
            boxShadow: isHovered 
              ? `inset 0 0 20px ${color}40, 0 20px 40px -10px ${color}80` 
              : `inset 0 0 10px rgba(255,255,255,0.05), 0 10px 20px -5px rgba(0,0,0,0.5)`,
            transition: 'box-shadow 0.3s ease-out'
          }}
        >
          {/* Light reflection */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50"
            style={{ transform: 'translateZ(1px)' }}
          />
        </div>

        {/* Floating Animated Icon (pops out in Z-axis) */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ 
            transform: 'translateZ(30px)', // Pops out 30px towards the screen!
            filter: isHovered ? `drop-shadow(0 15px 15px rgba(0,0,0,0.6))` : 'drop-shadow(0 5px 5px rgba(0,0,0,0.5))',
            transition: 'filter 0.3s ease-out'
          }}
        >
          {/* Render the highly animated SVG here */}
          <div style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)', transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
            <Icon color={color} />
          </div>
        </div>
      </div>
    </div>
  );
}
