import { useState } from 'react';
import type { ActionItem, ActionCategory } from '../../types/toc';
import { ACTION_CATEGORIES } from '../../types/toc';
import { Plus, Trash2, Check, GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';
import { generateId } from '../../store/tocStore';

interface FourQuadrantsProps {
  items: ActionItem[];
  onChange: (items: ActionItem[]) => void;
}

export function FourQuadrants({ items, onChange }: FourQuadrantsProps) {
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ActionCategory>('gold');

  const addItem = () => {
    if (!newItemText.trim()) return;
    const item: ActionItem = {
      id: generateId(),
      text: newItemText.trim(),
      category: selectedCategory,
      priority: items.length + 1,
      completed: false,
    };
    onChange([...items, item]);
    setNewItemText('');
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const toggleComplete = (id: string) => {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getItemsByCategory = (category: ActionCategory) =>
    items.filter((item) => item.category === category);

  const Quadrant = ({
    category,
    color,
    title,
    icon,
  }: {
    category: ActionCategory;
    color: string;
    title: string;
    icon: string;
  }) => {
    const categoryItems = getItemsByCategory(category);
    return (
      <div
        className={cn(
          'rounded-xl p-4 border transition-all',
          `border-${color}/30 bg-${color}/5 hover:border-${color}/50`
        )}
        style={{
          backgroundColor: `var(--color-${category})`,
          borderColor: `rgba(${category === 'gold' ? '16, 185, 129' : category === 'crutch' ? '245, 158, 11' : category === 'mermaid' ? '99, 102, 241' : '239, 68, 68'}, 0.2)`,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-white font-medium">{title}</h3>
          <span
            className={cn(
              'ml-auto px-2 py-0.5 rounded-full text-xs font-medium',
              categoryItems.length > 0 ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
            )}
          >
            {categoryItems.length}
          </span>
        </div>
        <div className="space-y-2">
          {categoryItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                'group flex items-center gap-2 p-2 rounded-lg transition-all',
                item.completed ? 'bg-slate-800/50 opacity-60' : 'bg-slate-800/30'
              )}
            >
              <button
                onClick={() => toggleComplete(item.id)}
                className={cn(
                  'w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors',
                  item.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-500 hover:border-green-500'
                )}
              >
                {item.completed && <Check className="w-3 h-3" />}
              </button>
              <span
                className={cn(
                  'flex-1 text-sm',
                  item.completed ? 'line-through text-slate-500' : 'text-slate-300'
                )}
              >
                {item.text}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-700 rounded text-red-400 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          {categoryItems.length === 0 && (
            <div className="text-center py-4 text-slate-500 text-xs">
              暂无项目
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.keys(ACTION_CATEGORIES) as ActionCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              )}
            >
              {ACTION_CATEGORIES[cat].name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder={`添加${ACTION_CATEGORIES[selectedCategory].name}项目...`}
            className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={addItem}
            disabled={!newItemText.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Quadrant
          category="gold"
          color="green"
          title="金子"
          icon="🌟"
        />
        <Quadrant
          category="crocodile"
          color="red"
          title="鳄鱼"
          icon="🐊"
        />
        <Quadrant
          category="mermaid"
          color="indigo"
          title="美人鱼"
          icon="🧜‍♀️"
        />
        <Quadrant
          category="crutch"
          color="amber"
          title="拐杖"
          icon="🩺"
        />
      </div>

      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-slate-700">
        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
          💡 说服顺序建议
        </h3>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-400">
            1️⃣ 先说鳄鱼（改变的坏处）
          </span>
          <span className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-400">
            2️⃣ 再提金子（改变的好处）
          </span>
          <span className="px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-400">
            3️⃣ 化解美人鱼（不改变的好处）
          </span>
          <span className="px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400">
            4️⃣ 打破拐杖（不改变的坏处）
          </span>
        </div>
      </div>
    </div>
  );
}
