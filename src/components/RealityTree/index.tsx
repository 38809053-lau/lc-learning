import { useState, useCallback } from 'react';
import type { Effect, Connection, RealityTree } from '../../types/toc';
import { Plus, Trash2, Link2, Unlink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { generateId } from '../../store/tocStore';

interface RealityTreeEditorProps {
  tree: RealityTree;
  onChange: (tree: RealityTree) => void;
}

export function RealityTreeEditor({ tree, onChange }: RealityTreeEditorProps) {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [newEffectText, setNewEffectText] = useState('');

  const addEffect = useCallback(() => {
    if (!newEffectText.trim()) return;
    const effect: Effect = {
      id: generateId(),
      text: newEffectText.trim(),
      x: Math.random() * 60 + 20,
      y: tree.effects.length * 15 + 10,
    };
    onChange({ ...tree, effects: [...tree.effects, effect] });
    setNewEffectText('');
  }, [newEffectText, tree, onChange]);

  const removeEffect = useCallback(
    (id: string) => {
      onChange({
        ...tree,
        effects: tree.effects.filter((e) => e.id !== id),
        connections: tree.connections.filter((c) => c.from !== id && c.to !== id),
      });
      if (selectedEffect === id) setSelectedEffect(null);
    },
    [tree, onChange, selectedEffect]
  );

  const addConnection = useCallback(
    (from: string, to: string) => {
      if (from === to) return;
      const exists = tree.connections.some((c) => c.from === from && c.to === to);
      if (exists) return;
      onChange({
        ...tree,
        connections: [...tree.connections, { from, to }],
      });
    },
    [tree, onChange]
  );

  const removeConnection = useCallback(
    (from: string, to: string) => {
      onChange({
        ...tree,
        connections: tree.connections.filter((c) => !(c.from === from && c.to === to)),
      });
    },
    [tree, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addEffect();
    }
  };

  const getEffectById = (id: string) => tree.effects.find((e) => e.id === id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-400" />
            添加不良效应
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newEffectText}
              onChange={(e) => setNewEffectText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="描述一个不良效应..."
              className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={addEffect}
              disabled={!newEffectText.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <span className="text-amber-400">⚠</span>
            不良效应列表
          </h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {tree.effects.map((effect, index) => (
              <div
                key={effect.id}
                className={cn(
                  'group flex items-center gap-2 p-3 rounded-lg border transition-all',
                  selectedEffect === effect.id
                    ? 'bg-blue-500/20 border-blue-500'
                    : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                )}
              >
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-medium flex-shrink-0">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm text-slate-300">{effect.text}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {selectedEffect && selectedEffect !== effect.id && (
                    <button
                      onClick={() => addConnection(selectedEffect, effect.id)}
                      className="p-1.5 hover:bg-slate-700 rounded text-green-400"
                      title="连接到选中项"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => removeEffect(effect.id)}
                    className="p-1.5 hover:bg-slate-700 rounded text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {tree.effects.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm">
                还没有添加任何不良效应
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <span className="text-purple-400">🔗</span>
            连接关系
          </h3>
          <div className="space-y-2">
            {tree.connections.map((conn, index) => {
              const fromEffect = getEffectById(conn.from);
              const toEffect = getEffectById(conn.to);
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg border border-slate-700"
                >
                  <span className="text-xs text-slate-400 flex-1 truncate">
                    {fromEffect?.text.substring(0, 15)}...
                  </span>
                  <span className="text-blue-400">→</span>
                  <span className="text-xs text-slate-400 flex-1 truncate">
                    {toEffect?.text.substring(0, 15)}...
                  </span>
                  <button
                    onClick={() => removeConnection(conn.from, conn.to)}
                    className="p-1 hover:bg-slate-700 rounded text-red-400"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
            {tree.connections.length === 0 && (
              <div className="text-center py-4 text-slate-500 text-sm">
                点击上方效应，再点击连接按钮创建因果关系
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 min-h-[500px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">因果链可视化</h3>
            <div className="text-xs text-slate-400">
              点击选中节点后可连接
            </div>
          </div>
          <svg className="w-full h-[450px]" viewBox="0 0 600 450">
            <defs>
              <marker
                id="tree-arrow"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
            </defs>
            {tree.connections.map((conn, index) => {
              const fromEffect = getEffectById(conn.from);
              const toEffect = getEffectById(conn.to);
              if (!fromEffect || !toEffect) return null;
              const x1 = (fromEffect.x / 100) * 600;
              const y1 = (fromEffect.y / 100) * 450;
              const x2 = (toEffect.x / 100) * 600;
              const y2 = (toEffect.y / 100) * 450;
              return (
                <line
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#64748b"
                  strokeWidth="2"
                  markerEnd="url(#tree-arrow)"
                  className="transition-all duration-300"
                />
              );
            })}
            {tree.effects.map((effect, index) => {
              const x = (effect.x / 100) * 600;
              const y = (effect.y / 100) * 450;
              const isSelected = selectedEffect === effect.id;
              return (
                <g
                  key={effect.id}
                  onClick={() => setSelectedEffect(isSelected ? null : effect.id)}
                  className="cursor-pointer"
                >
                  <rect
                    x={x - 80}
                    y={y - 20}
                    width="160"
                    height="40"
                    rx="8"
                    fill={isSelected ? '#3b82f6' : '#1e293b'}
                    stroke={isSelected ? '#60a5fa' : '#475569'}
                    strokeWidth="2"
                    className="transition-all duration-200 hover:fill-slate-700"
                  />
                  <text
                    x={x}
                    y={y + 5}
                    textAnchor="middle"
                    fill="#e2e8f0"
                    fontSize="12"
                    className="pointer-events-none"
                  >
                    {effect.text.length > 18
                      ? effect.text.substring(0, 16) + '...'
                      : effect.text}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
