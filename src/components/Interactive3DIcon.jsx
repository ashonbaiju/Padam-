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
    
    const rotateX = ((y - centerY) / centerY) * -40; 
    const rotateY = ((x - centerX) / centerX) * 40;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      className="relative w-8 h-8 md:w-10 md:h-10 shrink-0 cursor-pointer flex items-center justify-center"
      style={{ perspective: '800px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={ref}
        className={`w-full h-full absolute inset-0 flex items-center justify-center ${!isHovered ? 'animate-float-3d' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-in-out',
          transform: isHovered 
            ? `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(1.2)` 
            : 'rotateX(0deg) rotateY(0deg) scale(1)'
        }}
      >
        {/* Soft back glow */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: color,
            transform: 'translateZ(-5px)',
            filter: 'blur(12px)',
            opacity: isHovered ? 0.6 : 0.2,
            transition: 'opacity 0.3s'
          }}
        />

        {/* Floating Animated Icon */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ 
            transform: 'translateZ(15px)',
            filter: isHovered ? `drop-shadow(0 10px 10px rgba(0,0,0,0.8))` : 'drop-shadow(0 4px 4px rgba(0,0,0,0.6))',
            transition: 'filter 0.3s ease-out'
          }}
        >
          <Icon color={color} />
        </div>
      </div>
    </div>
  );
}
