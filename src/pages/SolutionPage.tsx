import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Lightbulb, Check, Sparkles, Zap, Layers, RefreshCw } from 'lucide-react';
import { useTocStore } from '../store/tocStore';
import { SOLUTION_TYPES } from '../types/toc';
import type { SolutionType, Solution } from '../types/toc';
import { cn } from '../lib/utils';

const SOLUTION_ICONS: Record<SolutionType, React.ReactNode> = {
  'change++': <Zap className="w-6 h-6" />,
  'no-change++': <RefreshCw className="w-6 h-6" />,
  'conditional': <Layers className="w-6 h-6" />,
  'alternative': <Sparkles className="w-6 h-6" />,
};

const SOLUTION_COLORS: Record<SolutionType, string> = {
  'change++': 'from-blue-500 to-cyan-500',
  'no-change++': 'from-green-500 to-emerald-500',
  'conditional': 'from-purple-500 to-pink-500',
  'alternative': 'from-amber-500 to-orange-500',
};

export default function SolutionPage() {
  const navigate = useNavigate();
  const { session, addSolution, selectSolution, setCurrentStep } = useTocStore();
  const [selectedType, setSelectedType] = useState<SolutionType | null>(null);
  const [solutionDescription, setSolutionDescription] = useState('');
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [newAssumption, setNewAssumption] = useState('');

  useEffect(() => {
    setCurrentStep(3);
  }, [setCurrentStep]);

  if (!session?.problem || !session?.conflictDiagram || !session?.realityTree) {
    navigate('/');
    return null;
  }

  const handleAddSolution = () => {
    if (!selectedType || !solutionDescription.trim()) return;

    const solution: Solution = {
      id: Math.random().toString(36).substring(2, 11),
      type: selectedType,
      description: solutionDescription.trim(),
      assumptions: assumptions.filter(a => a.trim()),
      evaluation: {
        feasibility: 5,
        impact: 5,
        effort: 5,
      },
    };

    addSolution(solution);
    setSolutionDescription('');
    setAssumptions([]);
    setSelectedType(null);
  };

  const handleSelectSolution = (solution: Solution) => {
    selectSolution(solution);
  };

  const handleAddAssumption = () => {
    if (!newAssumption.trim()) return;
    setAssumptions([...assumptions, newAssumption.trim()]);
    setNewAssumption('');
  };

  const handleRemoveAssumption = (index: number) => {
    setAssumptions(assumptions.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (!session.selectedSolution) {
      alert('请先创建一个或选择一个解决方案');
      return;
    }
    navigate('/refine');
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">第三步：开发双赢方案</h1>
          <p className="text-slate-400">
            问题：<span className="text-blue-400">{session.problem}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                选择破解方法
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {(Object.keys(SOLUTION_TYPES) as SolutionType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all',
                      selectedType === type
                        ? `bg-gradient-to-br ${SOLUTION_COLORS[type]} border-transparent shadow-lg`
                        : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                    )}
                  >
                    <div className={cn(
                      'flex items-center gap-3 mb-2',
                      selectedType === type ? 'text-white' : 'text-slate-300'
                    )}>
                      {SOLUTION_ICONS[type]}
                      <span className="font-semibold">{SOLUTION_TYPES[type].name}</span>
                    </div>
                    <p className={cn(
                      'text-sm',
                      selectedType === type ? 'text-white/80' : 'text-slate-400'
                    )}>
                      {SOLUTION_TYPES[type].description}
                    </p>
                  </button>
                ))}
              </div>

              {selectedType && (
                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30 mb-4">
                  <h3 className="text-blue-400 font-medium mb-2">
                    💡 {SOLUTION_TYPES[selectedType].name} 技巧
                  </h3>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {selectedType === 'change++' && (
                      <>
                        <li>• 挑战"D → C"这个假设</li>
                        <li>• 寻找D不必然导致C的例外情况</li>
                        <li>• 注入一个新行为D''</li>
                      </>
                    )}
                    {selectedType === 'no-change++' && (
                      <>
                        <li>• 挑战"D′ → B"这个假设</li>
                        <li>• 证明D′不必然导致B的缺失</li>
                        <li>• 优化现有D行为</li>
                      </>
                    )}
                    {selectedType === 'conditional' && (
                      <>
                        <li>• 找出D与D′发生冲突的具体条件</li>
                        <li>• 在某些条件下允许D，其他条件下允许D′</li>
                        <li>• 分情况采取不同行动</li>
                      </>
                    )}
                    {selectedType === 'alternative' && (
                      <>
                        <li>• 完全跳出D和D′的选择</li>
                        <li>• 寻找第三条路直接满足B和C</li>
                        <li>• 这是最高层次的创新解决方案</li>
                      </>
                    )}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    描述你的激发方案
                  </label>
                  <textarea
                    value={solutionDescription}
                    onChange={(e) => setSolutionDescription(e.target.value)}
                    placeholder="描述你想要采取的新行为或方案..."
                    className="w-full h-24 bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    挑战的假设（可选）
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newAssumption}
                      onChange={(e) => setNewAssumption(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddAssumption()}
                      placeholder="输入一个假设，如：真的是这样吗？"
                      className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleAddAssumption}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    >
                      添加
                    </button>
                  </div>
                  {assumptions.length > 0 && (
                    <div className="space-y-1">
                      {assumptions.map((assumption, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg"
                        >
                          <span className="text-xs text-slate-500">问：</span>
                          <span className="flex-1 text-sm text-slate-300">{assumption}</span>
                          <button
                            onClick={() => handleRemoveAssumption(index)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            删除
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddSolution}
                  disabled={!selectedType || !solutionDescription.trim()}
                  className={cn(
                    'w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all',
                    selectedType && solutionDescription.trim()
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  生成激发方案
                </button>
              </div>
            </div>

            {session.solutions.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4">
                  已创建的方案 ({session.solutions.length})
                </h2>
                <div className="space-y-3">
                  {session.solutions.map((solution) => (
                    <div
                      key={solution.id}
                      onClick={() => handleSelectSolution(solution)}
                      className={cn(
                        'p-4 rounded-xl border cursor-pointer transition-all',
                        session.selectedSolution?.id === solution.id
                          ? 'bg-blue-500/20 border-blue-500'
                          : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            'px-2 py-0.5 rounded text-xs font-medium',
                            solution.type === 'change++' ? 'bg-blue-500/20 text-blue-400' :
                            solution.type === 'no-change++' ? 'bg-green-500/20 text-green-400' :
                            solution.type === 'conditional' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-amber-500/20 text-amber-400'
                          )}>
                            {SOLUTION_TYPES[solution.type].name}
                          </span>
                          {session.selectedSolution?.id === solution.id && (
                            <Check className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                      </div>
                      <p className="text-slate-300 text-sm">{solution.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/30">
              <h3 className="text-blue-400 font-medium mb-3">🔑 核心技巧</h3>
              <p className="text-sm text-slate-300 mb-4">
                问自己三个问题来挑战假设：
              </p>
              <ul className="space-y-3">
                {[
                  { q: '是真的吗？', desc: '这个因果关系真的存在吗？' },
                  { q: '总是真的吗？', desc: '在所有情况下都成立吗？' },
                  { q: '有没有例外？', desc: '有没有反例可以打破这个假设？' },
                ].map((item) => (
                  <li key={item.q} className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">✨</span>
                    <div>
                      <span className="text-white font-medium text-sm">{item.q}</span>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-medium mb-3">🎯 建议</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• 尝试所有四种方法</li>
                <li>• 选择最能满足B和C的方案</li>
                <li>• 不要妥协于中间方案</li>
                <li>• 一次只做一个重大改变</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/reality')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            上一步：现状图
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-500/25"
          >
            下一步：完善方案
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
