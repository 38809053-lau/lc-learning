import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, AlertTriangle } from 'lucide-react';
import { RealityTreeEditor } from '../components/RealityTree';
import { useTocStore } from '../store/tocStore';

export default function RealityPage() {
  const navigate = useNavigate();
  const { session, setRealityTree, setCurrentStep } = useTocStore();

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  if (!session?.problem || !session?.conflictDiagram) {
    navigate('/');
    return null;
  }

  const handleSave = () => {
    if (session.realityTree) {
      setRealityTree(session.realityTree);
    }
  };

  const handleNext = () => {
    if (!session.realityTree || session.realityTree.effects.length < 3) {
      alert('请至少添加3个不良效应后再继续');
      return;
    }
    handleSave();
    navigate('/solution');
  };

  const handleTreeChange = (tree: typeof session.realityTree) => {
    if (tree) {
      setRealityTree(tree);
    }
  };

  const exampleEffects = [
    '客户投诉响应时间长',
    '团队沟通层级过多',
    '决策需要多部门审批',
    '信息在传递过程中失真',
  ];

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">第二步：构建现状图</h1>
          <p className="text-slate-400">
            问题：<span className="text-blue-400">{session.problem}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">现状图 (Current Reality Tree)</h2>
              <RealityTreeEditor
                tree={session.realityTree || { effects: [], connections: [], coreProblem: '' }}
                onChange={handleTreeChange}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                什么是不良效应？
              </h3>
              <ul className="text-sm text-slate-300 space-y-2 mb-4">
                <li>• 长期客观存在的问题</li>
                <li>• 不因人而异的系统性问题</li>
                <li>• 不指责具体人或部门</li>
                <li>• 通常以负面描述呈现</li>
              </ul>
              <div className="border-t border-slate-700 pt-4">
                <p className="text-xs text-slate-500 mb-2">建议收集10-15个不良效应</p>
                <div className="space-y-1">
                  {exampleEffects.map((effect) => (
                    <button
                      key={effect}
                      onClick={() => {
                        const newEffect = {
                          id: Math.random().toString(36).substring(2, 11),
                          text: effect,
                          x: Math.random() * 60 + 20,
                          y: (session.realityTree?.effects.length || 0) * 15 + 10,
                        };
                        handleTreeChange({
                          ...(session.realityTree || { effects: [], connections: [], coreProblem: '' }),
                          effects: [...(session.realityTree?.effects || []), newEffect],
                        });
                      }}
                      className="block w-full text-left px-3 py-2 rounded-lg bg-slate-900/50 hover:bg-slate-700 text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      + {effect}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-purple-400 font-medium mb-3">🔗 因果链构建技巧</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>1. 从最明显的效应开始</li>
                <li>2. 问"为什么导致这个？"</li>
                <li>3. 找到共同的上游原因</li>
                <li>4. 识别恶性循环（正反馈）</li>
                <li className="mt-2 text-xs text-slate-500">用"如果...那么..."朗读验证</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/conflict')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            上一步：冲突图
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
              下一步：双赢方案
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
