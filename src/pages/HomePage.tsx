import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Lightbulb, ArrowRight, Sparkles } from 'lucide-react';
import { useTocStore } from '../store/tocStore';
import { cn } from '../lib/utils';

export default function HomePage() {
  const navigate = useNavigate();
  const { setProblem, session, resetSession } = useTocStore();
  const [problem, setProblemInput] = useState(session?.problem || '');

  const handleStart = () => {
    if (!problem.trim()) return;
    setProblem(problem.trim());
    navigate('/conflict');
  };

  const exampleProblems = [
    '团队业绩长期无法突破瓶颈',
    '客户流失率居高不下',
    '产品开发周期总是延期',
    '员工积极性难以调动',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 animate-pulse">
              <Brain className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            TOC<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">清晰思考</span>技能
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            基于制约理论的五步思考流程，将复杂问题可视化，找到显而易见的双赢解决方案
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl animate-slide-up">
          <div className="mb-6">
            <label className="block text-white font-medium mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              请描述你想要解决的问题
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblemInput(e.target.value)}
              placeholder="例如：团队沟通效率低下，项目总是延期交付..."
              className="w-full h-32 bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            />
          </div>

          <div className="mb-6">
            <p className="text-sm text-slate-400 mb-3">或选择一个示例问题开始：</p>
            <div className="flex flex-wrap gap-2">
              {exampleProblems.map((example) => (
                <button
                  key={example}
                  onClick={() => setProblemInput(example)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-all',
                    problem === example
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  )}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={!problem.trim()}
            className={cn(
              'w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all',
              problem.trim()
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            )}
          >
            <Sparkles className="w-5 h-5" />
            开始TOC思考之旅
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {session && (
          <div className="mt-6 text-center">
            <button
              onClick={resetSession}
              className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
            >
              清除当前会话，重新开始
            </button>
          </div>
        )}

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-delay">
          {[
            { icon: '🔍', title: '第一步：冲突图', desc: '将问题定义为两难困境' },
            { icon: '🔗', title: '第二步：现状图', desc: '找出根本原因与恶性循环' },
            { icon: '💡', title: '第三步：双赢方案', desc: '打破假设，开发新方案' },
          ].map((step, index) => (
            <div
              key={step.title}
              className="text-center p-6 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-all hover:transform hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-3">{step.icon}</div>
              <h3 className="text-white font-medium mb-2">{step.title}</h3>
              <p className="text-slate-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-fade-in-delay { animation: fade-in 0.6s ease-out backwards; }
      `}</style>
    </div>
  );
}
