import React, { useRef, useEffect, useState } from 'react';

interface WaveformVisualizerProps {
  audioStream: MediaStream | null;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ audioStream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    if (!audioStream) return;

    const newAudioContext = new AudioContext();
    const newAnalyser = newAudioContext.createAnalyser();
    const source = newAudioContext.createMediaStreamSource(audioStream);
    source.connect(newAnalyser);

    setAudioContext(newAudioContext);
    setAnalyser(newAnalyser);

    return () => {
      source.disconnect();
      newAudioContext.close();
    };
  }, [audioStream]);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();

  }, [analyser]);

  return <canvas ref={canvasRef} width="300" height="150" />;
};

export default WaveformVisualizer;