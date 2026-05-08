import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, RotateCcw, Download, Printer, Share2, CheckCircle2 } from 'lucide-react';
import { ConflictDiagram } from '../components/ConflictDiagram';
import { useTocStore } from '../store/tocStore';
import { SOLUTION_TYPES, ACTION_CATEGORIES } from '../types/toc';

export default function ResultPage() {
  const navigate = useNavigate();
  const { session, setCurrentStep, resetSession } = useTocStore();
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentStep(6);
  }, [setCurrentStep]);

  if (!session?.problem) {
    navigate('/');
    return null;
  }

  const completedItems = session.actionItems.filter((i) => i.completed).length;
  const totalItems = session.actionItems.length;

  const handlePrint = () => {
    window.print();
  };

  const handleNewSession = () => {
    if (window.confirm('确定要开始新的思考会话吗？当前进度将被保存。')) {
      resetSession();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 mb-4 shadow-lg shadow-amber-500/25">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TOC思考完成！</h1>
          <p className="text-slate-400">你已经完成了从问题到解决方案的完整思考流程</p>
        </div>

        <div ref={reportRef} className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              问题定义
            </h2>
            <p className="text-lg text-slate-300">{session.problem}</p>
          </div>

          {session.conflictDiagram && (
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">冲突图</h2>
              <ConflictDiagram
                data={session.conflictDiagram}
                onChange={() => {}}
                editable={false}
              />
            </div>
          )}

          {session.realityTree && session.realityTree.effects.length > 0 && (
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">现状分析</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {session.realityTree.effects.map((effect, index) => (
                  <span
                    key={effect.id}
                    className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-sm"
                  >
                    {index + 1}. {effect.text}
                  </span>
                ))}
              </div>
            </div>
          )}

          {session.selectedSolution && (
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/30">
              <h2 className="text-xl font-semibold text-white mb-4">双赢方案</h2>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                  {SOLUTION_TYPES[session.selectedSolution.type].name}
                </span>
              </div>
              <p className="text-slate-300">{session.selectedSolution.description}</p>
            </div>
          )}

          {session.actionItems.length > 0 && (
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">行动清单</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Object.keys(ACTION_CATEGORIES) as Array<keyof typeof ACTION_CATEGORIES>).map((category) => {
                  const items = session.actionItems.filter((i) => i.category === category);
                  if (items.length === 0) return null;
                  return (
                    <div key={category} className="p-4 bg-slate-900/50 rounded-xl">
                      <h3 className="text-sm font-medium mb-2" style={{ color: ACTION_CATEGORIES[category].color }}>
                        {ACTION_CATEGORIES[category].name}
                      </h3>
                      <ul className="space-y-1">
                        {items.map((item) => (
                          <li key={item.id} className="flex items-center gap-2 text-sm text-slate-300">
                            <span className={item.completed ? 'text-green-400' : 'text-slate-500'}>
                              {item.completed ? '✓' : '○'}
                            </span>
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <Printer className="w-4 h-4" />
            打印报告
          </button>
          <button
            onClick={handleNewSession}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-colors shadow-lg shadow-purple-500/25"
          >
            <RotateCcw className="w-4 h-4" />
            开始新思考
          </button>
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl border border-slate-700 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">TOC核心原则回顾</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-300">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-2xl mb-1">🔍</div>
              <div>可视化</div>
              <div className="text-xs text-slate-500 mt-1">让隐性思维显性化</div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-2xl mb-1">🤔</div>
              <div>先假言后验证</div>
              <div className="text-xs text-slate-500 mt-1">挑战每个假设</div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-2xl mb-1">🤝</div>
              <div>不妥协</div>
              <div className="text-xs text-slate-500 mt-1">永远寻找双赢</div>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="text-2xl mb-1">🎯</div>
              <div>一次一件事</div>
              <div className="text-xs text-slate-500 mt-1">聚焦最大价值</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .min-h-screen { min-height: auto !important; }
          .pt-20 { padding-top: 0 !important; }
          .bg-slate-900 { background: white !important; color: black !important; }
          .bg-slate-800 { background: #f1f5f9 !important; }
          .bg-slate-800\\/50 { background: #f8fafc !important; }
          .text-white { color: #1e293b !important; }
          .text-slate-300 { color: #475569 !important; }
          .text-slate-400 { color: #64748b !important; }
          .border-slate-700 { border-color: #e2e8f0 !important; }
        }
      `}</style>
    </div>
  );
}
