import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Rocket, Download } from 'lucide-react';
import { FourQuadrants } from '../components/FourQuadrants';
import { useTocStore } from '../store/tocStore';

export default function ActionPage() {
  const navigate = useNavigate();
  const { session, addActionItem, updateActionItem, toggleActionItem, removeActionItem, setCurrentStep } = useTocStore();

  useEffect(() => {
    setCurrentStep(5);
  }, [setCurrentStep]);

  if (!session?.problem || !session?.selectedSolution) {
    navigate('/');
    return null;
  }

  const handleItemsChange = (items: typeof session.actionItems) => {
    items.forEach((item) => {
      const exists = session.actionItems.some((i) => i.id === item.id);
      if (!exists) {
        addActionItem(item);
      }
    });
    session.actionItems.forEach((existingItem) => {
      const stillExists = items.some((i) => i.id === existingItem.id);
      if (!stillExists) {
        removeActionItem(existingItem.id);
      }
    });
    items.forEach((item) => {
      const existing = session.actionItems.find((i) => i.id === item.id);
      if (existing && existing.completed !== item.completed) {
        toggleActionItem(item.id);
      }
    });
  };

  const handleNext = () => {
    const hasItems = session.actionItems.length > 0;
    if (!hasItems) {
      const proceed = window.confirm('你还没有添加任何行动项，确定要继续吗？');
      if (!proceed) return;
    }
    navigate('/result');
  };

  const goldItems = session.actionItems.filter((i) => i.category === 'gold').length;
  const crocodileItems = session.actionItems.filter((i) => i.category === 'crocodile').length;
  const mermaidItems = session.actionItems.filter((i) => i.category === 'mermaid').length;
  const crutchItems = session.actionItems.filter((i) => i.category === 'crutch').length;

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">第五步：说服与实施</h1>
          <p className="text-slate-400">
            问题：<span className="text-blue-400">{session.problem}</span>
          </p>
        </div>

        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-2xl p-6 border border-purple-500/30">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-purple-400" />
              选定的解决方案
            </h2>
            <p className="text-slate-300 mb-4">{session.selectedSolution.description}</p>
            {session.refinedPlan && session.refinedPlan.concerns.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {session.refinedPlan.concerns.slice(0, 3).map((concern, i) => (
                  <span key={i} className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">
                    {concern}
                  </span>
                ))}
                {session.refinedPlan.concerns.length > 3 && (
                  <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs">
                    +{session.refinedPlan.concerns.length - 3} 更多
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <FourQuadrants items={session.actionItems} onChange={handleItemsChange} />

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30 text-center">
            <div className="text-3xl font-bold text-green-400">{goldItems}</div>
            <div className="text-xs text-slate-400 mt-1">金子</div>
          </div>
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30 text-center">
            <div className="text-3xl font-bold text-red-400">{crocodileItems}</div>
            <div className="text-xs text-slate-400 mt-1">鳄鱼</div>
          </div>
          <div className="bg-indigo-500/10 rounded-xl p-4 border border-indigo-500/30 text-center">
            <div className="text-3xl font-bold text-indigo-400">{mermaidItems}</div>
            <div className="text-xs text-slate-400 mt-1">美人鱼</div>
          </div>
          <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30 text-center">
            <div className="text-3xl font-bold text-amber-400">{crutchItems}</div>
            <div className="text-xs text-slate-400 mt-1">拐杖</div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/refine')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            上一步：完善方案
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transition-colors shadow-lg shadow-purple-500/25"
          >
            查看成果
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
