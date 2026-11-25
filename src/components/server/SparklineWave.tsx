import React, { useEffect, useRef } from 'react';

interface SparklineWaveProps {
  color: string;
  fillColor?: string;
  height?: number;
  dataPoints?: number[];
  label?: string;
  unit?: string;
}

export const SparklineWave: React.FC<SparklineWaveProps> = ({
  color = '#3B82F6',
  fillColor = 'rgba(59, 130, 246, 0.15)',
  height = 90,
  dataPoints,
  label,
  unit = '%'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const valuesRef = useRef<number[]>(dataPoints || Array.from({ length: 60 }, () => 40 + Math.random() * 45));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Shift and push smooth data
      const arr = valuesRef.current;
      const last = arr[arr.length - 1];
      const next = Math.max(10, Math.min(98, last + (Math.random() - 0.48) * 6));
      arr.shift();
      arr.push(next);

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Gradient Fill
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'rgba(15, 17, 21, 0)');

      ctx.beginPath();
      const step = w / (arr.length - 1);
      ctx.moveTo(0, h - (arr[0] / 100) * (h - 10));

      for (let i = 1; i < arr.length; i++) {
        const x = i * step;
        const y = h - (arr[i] / 100) * (h - 10);
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Close polygon for gradient fill
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [color, fillColor]);

  const currentVal = Math.round(valuesRef.current[valuesRef.current.length - 1]);

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">{label}</span>
          <span className="font-mono font-bold" style={{ color }}>
            {currentVal}{unit}
          </span>
        </div>
      )}
      <div className="w-full bg-surface-950/70 border border-surface-border/40 rounded-xl overflow-hidden p-1">
        <canvas
          ref={canvasRef}
          width={600}
          height={height}
          className="w-full block"
          style={{ height: `${height}px` }}
        />
      </div>
    </div>
  );
};
