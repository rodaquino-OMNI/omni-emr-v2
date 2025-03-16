
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Pencil, Eraser, Download, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VisitNoteDrawingCanvasProps {
  onSaveDrawing: (dataUrl: string) => void;
}

const VisitNoteDrawingCanvas: React.FC<VisitNoteDrawingCanvasProps> = ({ onSaveDrawing }) => {
  const { language } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState('3');
  
  // Initialize canvas when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    // Set drawing styles
    if (tool === 'pencil') {
      ctx.strokeStyle = color;
      ctx.lineWidth = parseInt(lineWidth);
    } else {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = parseInt(lineWidth) * 2;
    }
    
    ctx.lineCap = 'round';
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    onSaveDrawing(dataUrl);
  };
  
  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'drawing.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          {language === 'pt' ? 'Desenho Clínico' : 'Clinical Drawing'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant={tool === 'pencil' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('pencil')}
            className="flex items-center gap-1"
          >
            <Pencil className="h-4 w-4" />
            {language === 'pt' ? 'Lápis' : 'Pencil'}
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
            className="flex items-center gap-1"
          >
            <Eraser className="h-4 w-4" />
            {language === 'pt' ? 'Borracha' : 'Eraser'}
          </Button>
          
          {tool === 'pencil' && (
            <div className="flex items-center gap-2">
              <label htmlFor="color-picker" className="text-sm">
                {language === 'pt' ? 'Cor' : 'Color'}:
              </label>
              <input
                id="color-picker"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 p-0 border-0"
              />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <label htmlFor="line-width" className="text-sm">
              {language === 'pt' ? 'Espessura' : 'Width'}:
            </label>
            <Select
              value={lineWidth}
              onValueChange={setLineWidth}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="3px" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1px</SelectItem>
                <SelectItem value="3">3px</SelectItem>
                <SelectItem value="5">5px</SelectItem>
                <SelectItem value="8">8px</SelectItem>
                <SelectItem value="12">12px</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full h-auto cursor-crosshair"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="destructive"
          size="sm"
          onClick={clearCanvas}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          {language === 'pt' ? 'Limpar' : 'Clear'}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadDrawing}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            {language === 'pt' ? 'Download' : 'Download'}
          </Button>
          <Button
            size="sm"
            onClick={saveDrawing}
            className="flex items-center gap-1"
          >
            {language === 'pt' ? 'Salvar Desenho' : 'Save Drawing'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VisitNoteDrawingCanvas;
