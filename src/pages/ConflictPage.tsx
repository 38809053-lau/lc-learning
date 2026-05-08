import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, HelpCircle } from 'lucide-react';
import { ConflictDiagram } from '../components/ConflictDiagram';
import { useTocStore } from '../store/tocStore';
import { STEPS } from '../types/toc';
import type { ConflictDiagram as ConflictDiagramType } from '../types/toc';

const INITIAL_DATA: ConflictDiagramType = {
  D: '',
  DPrime: '',
  B: '',
  C: '',
  A: '',
};

export default function ConflictPage() {
  const navigate = useNavigate();
  const { session, setConflictDiagram, setCurrentStep } = useTocStore();
  const [diagram, setDiagram] = useState<ConflictDiagramType>(
    session?.conflictDiagram || INITIAL_DATA
  );
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  if (!session?.problem) {
    navigate('/');
    return null;
  }

  const handleSave = () => {
    setConflictDiagram(diagram);
  };

  const handleNext = () => {
    const isComplete = diagram.D && diagram.DPrime && diagram.B && diagram.C && diagram.A;
    if (!isComplete) {
      alert('请填写完整的冲突图（D、D′、B、C、A）');
      return;
    }
    handleSave();
    navigate('/reality');
  };

  const questions = [
    { label: 'D', question: '你当前采取的是什么行为？' },
    { label: "D′", question: '相反的行为是什么？' },
    { label: 'B', question: 'D满足了什么需求？' },
    { label: 'C', question: "D′满足了什么需求？" },
    { label: 'A', question: '两者共同的目标是什么？' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">第一步：构建冲突图</h1>
          <p className="text-slate-400">
            问题：<span className="text-blue-400">{session.problem}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">冲突图 (Evaporating Cloud)</h2>
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>

              {showHelp && (
                <div className="mb-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                  <h3 className="text-blue-400 font-medium mb-2">冲突图说明</h3>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• <strong>D</strong>：你当前采取的行为</li>
                    <li>• <strong>D′</strong>：与D相反的行为</li>
                    <li>• <strong>B</strong>：D满足了什么需求</li>
                    <li>• <strong>C</strong>：D′满足了什么需求</li>
                    <li>• <strong>A</strong>：B和C共同追求的目标</li>
                    <li className="mt-2 text-amber-400">⚠️ 红色虚线表示冲突：D危害C，D′危害B</li>
                  </ul>
                </div>
              )}

              <ConflictDiagram data={diagram} onChange={setDiagram} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                💡 引导问题
              </h3>
              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.label} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-500 mb-1">
                      {q.label === 'D' ? 'D (当前行为)' : q.label === "D'" ? "D′ (相反行为)" : q.label}
                    </div>
                    <div className="text-sm text-slate-300">{q.question}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/30">
              <h3 className="text-amber-400 font-medium mb-3">⚠️ 关键检查</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• 逻辑验证：为了实现A，必须B</li>
                <li>• 逻辑验证：为了实现B，必须D</li>
                <li>• 冲突检查：D是否真的危害C？</li>
                <li>• 冲突检查：D′是否真的危害B？</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            上一步
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >
              <Save className="w-4 h-4" />
              保存
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-500/25"
            >
              下一步：现状图
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
