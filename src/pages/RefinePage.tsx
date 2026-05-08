import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Shield, AlertTriangle, Check, Plus, Trash2 } from 'lucide-react';
import { useTocStore } from '../store/tocStore';
import { cn } from '../lib/utils';

export default function RefinePage() {
  const navigate = useNavigate();
  const { session, setRefinedPlan, setCurrentStep } = useTocStore();
  const [concerns, setConcerns] = useState<string[]>([]);
  const [newConcern, setNewConcern] = useState('');
  const [corrections, setCorrections] = useState<string[]>([]);
  const [newCorrection, setNewCorrection] = useState('');

  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  if (!session?.problem || !session?.selectedSolution) {
    navigate('/');
    return null;
  }

  const handleAddConcern = () => {
    if (!newConcern.trim()) return;
    setConcerns([...concerns, newConcern.trim()]);
    setNewConcern('');
  };

  const handleRemoveConcern = (index: number) => {
    setConcerns(concerns.filter((_, i) => i !== index));
  };

  const handleAddCorrection = () => {
    if (!newCorrection.trim()) return;
    setCorrections([...corrections, newCorrection.trim()]);
    setNewCorrection('');
  };

  const handleRemoveCorrection = (index: number) => {
    setCorrections(corrections.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setRefinedPlan({
      additionalConnections: [],
      concerns,
      corrections,
    });
  };

  const handleNext = () => {
    handleSave();
    navigate('/action');
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">第四步：完善方案，消除顾虑</h1>
          <p className="text-slate-400">
            问题：<span className="text-blue-400">{session.problem}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/30">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                选定的激发方案
              </h2>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-slate-300">{session.selectedSolution.description}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                消除负面分支
              </h2>
              <p className="text-slate-400 mb-4">
                列出激发方案可能带来的顾虑和潜在问题
              </p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newConcern}
                  onChange={(e) => setNewConcern(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddConcern()}
                  placeholder="描述一个可能的顾虑或问题..."
                  className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddConcern}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>

              <div className="space-y-2">
                {concerns.map((concern, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="flex-1 text-sm text-slate-300">{concern}</span>
                    <button
                      onClick={() => handleRemoveConcern(index)}
                      className="p-1 hover:bg-slate-700 rounded text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {concerns.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    添加可能的顾虑或问题
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                补充方案与修正
              </h2>
              <p className="text-slate-400 mb-4">
                针对每个顾虑，注入修正方案
              </p>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newCorrection}
                  onChange={(e) => setNewCorrection(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCorrection()}
                  placeholder="描述一个修正或补充方案..."
                  className="flex-1 bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={handleAddCorrection}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </button>
              </div>

              <div className="space-y-2">
                {corrections.map((correction, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                  >
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="flex-1 text-sm text-slate-300">{correction}</span>
                    <button
                      onClick={() => handleRemoveCorrection(index)}
                      className="p-1 hover:bg-slate-700 rounded text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {corrections.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    针对顾虑添加修正方案
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/30">
              <h3 className="text-amber-400 font-medium mb-3">🔍 检查清单</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  激发方案是否完整覆盖B和C？
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  是否补充了缺失的中间效应？
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  所有顾虑是否都有对应修正？
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  修正方案是否会引入新问题？
                </li>
              </ul>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h3 className="text-white font-medium mb-3">💡 提示</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• 想象方案实施后的场景</li>
                <li>• 考虑不同利益相关者的感受</li>
                <li>• 思考可能的意外后果</li>
                <li>• 预留调整空间</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/solution')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            上一步：双赢方案
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-lg shadow-blue-500/25"
          >
            下一步：实施计划
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
