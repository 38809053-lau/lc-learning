import { useState, useRef, useEffect } from 'react';
import type { ConflictDiagram as ConflictDiagramType } from '../../types/toc';
import { cn } from '../../lib/utils';

interface ConflictDiagramProps {
  data: ConflictDiagramType;
  onChange: (data: ConflictDiagramType) => void;
  editable?: boolean;
}

export function ConflictDiagram({ data, onChange, editable = true }: ConflictDiagramProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingField]);

  const handleStartEdit = (field: keyof ConflictDiagramType) => {
    if (!editable) return;
    setEditingField(field);
    setTempValue(data[field]);
  };

  const handleSave = (field: keyof ConflictDiagramType) => {
    onChange({ ...data, [field]: tempValue });
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: keyof ConflictDiagramType) => {
    if (e.key === 'Enter') {
      handleSave(field);
    } else if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const Node = ({
    label,
    field,
    color,
    position,
  }: {
    label: string;
    field: keyof ConflictDiagramType;
    color: string;
    position: string;
  }) => (
    <div
      className={cn(
        'absolute flex flex-col items-center',
        position,
        'transform -translate-x-1/2 -translate-y-1/2'
      )}
    >
      <div
        className={cn(
          'px-6 py-4 rounded-xl border-2 min-w-[180px] text-center transition-all duration-300 cursor-pointer',
          color,
          editable && 'hover:shadow-lg hover:scale-105',
          editingField === field && 'ring-2 ring-blue-500 shadow-lg'
        )}
        onClick={() => handleStartEdit(field)}
      >
        <div className="text-xs font-medium opacity-60 mb-1">{label}</div>
        {editingField === field ? (
          <input
            ref={inputRef}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => handleSave(field)}
            onKeyDown={(e) => handleKeyDown(e, field)}
            className="bg-transparent text-white text-center outline-none w-full min-w-[140px]"
            placeholder="输入内容..."
          />
        ) : (
          <div className="text-white text-sm font-medium">
            {data[field] || <span className="opacity-50">点击输入...</span>}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
          <marker
            id="arrowhead-red"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
          </marker>
        </defs>

        <g className="stroke-slate-500 stroke-2 fill-none">
          <path
            d="M 180 200 Q 90 200 90 300"
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 620 200 Q 710 200 710 300"
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 400 100 Q 400 50 180 100"
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 400 100 Q 400 50 620 100"
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 180 400 Q 90 400 90 300"
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 620 400 Q 710 400 710 300"
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 90 300 L 90 350"
            markerEnd="url(#arrowhead)"
          />
          <path
            d="M 710 300 L 710 350"
            markerEnd="url(#arrowhead)"
          />
        </g>

        <g className="stroke-red-500 stroke-2 fill-none stroke-dasharray-4 stroke-opacity-50">
          <path d="M 180 200 Q 280 200 350 200" markerEnd="url(#arrowhead-red)" />
          <path d="M 620 200 Q 520 200 450 200" markerEnd="url(#arrowhead-red)" />
        </g>
      </svg>

      <div className="relative w-full h-full">
        <Node label="D (当前行为)" field="D" color="border-blue-500 bg-blue-500/10" position="left-[30%] top-[40%]" />
        <Node label="D′ (相反行为)" field="DPrime" color="border-orange-500 bg-orange-500/10" position="right-[30%] top-[40%]" />
        <Node label="B (D满足的需求)" field="B" color="border-blue-400 bg-blue-400/10" position="left-[15%] top-[60%]" />
        <Node label="C (D′满足的需求)" field="C" color="border-orange-400 bg-orange-400/10" position="right-[15%] top-[60%]" />
        <Node label="A (共同目标)" field="A" color="border-green-500 bg-green-500/10" position="left-1/2 top-[20%]" />
      </div>

      <div className="absolute bottom-4 right-4 bg-slate-800/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-slate-400">
        <span className="inline-block w-3 h-0.5 bg-red-500 mr-1"></span>
        冲突连线 (D危害C, D′危害B)
      </div>
    </div>
  );
}
