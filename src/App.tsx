import { useState, useRef, useEffect } from 'react';
import { Brain, Send, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from './lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  step?: number;
}

interface ConflictDiagram {
  D: string;
  DPrime: string;
  B: string;
  C: string;
  A: string;
}

interface RealityTree {
  coreProblem: string;
  effects: string[];
  rootCause: string;
}

interface Solution {
  type: string;
  description: string;
  assumptions: string[];
}

type Step = 'problem' | 'conflict' | 'reality' | 'solution' | 'refine' | 'action';

const STEPS: { id: Step; name: string; zh: string }[] = [
  { id: 'problem', name: 'problem', zh: '定义困境' },
  { id: 'conflict', name: 'conflict', zh: '冲突图' },
  { id: 'reality', name: 'reality', zh: '溯源' },
  { id: 'solution', name: 'solution', zh: '破解' },
  { id: 'refine', name: 'refine', zh: '消除顾虑' },
  { id: 'action', name: 'action', zh: '行动' },
];

const STEP_INDEX: Record<Step, number> = {
  problem: 0, conflict: 1, reality: 2, solution: 3, refine: 4, action: 5
};

export default function App() {
  const [step, setStep] = useState<Step>('problem');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [userProblem, setUserProblem] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string, stepNum?: number) => {
    setMessages(prev => [...prev, { role, content, step: stepNum }]);
  };

  const analyze = async () => {
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 1500));

    let result: any = {};

    if (step === 'problem') {
      result = {
        type: 'problem_summary',
        summary: `问题核心：${userProblem}`,
        suggestions: ['这是一个典型的TOC分析场景', '接下来我会帮你构建冲突图']
      };
    } else if (step === 'conflict') {
      const keywords = userProblem.toLowerCase();
      result = {
        type: 'conflict_diagram',
        diagram: {
          D: input.includes('不敢') ? '维持现状' : input.includes('必须') ? '坚持高标准' : '当前采取的行为',
          DPrime: input.includes('不敢') ? '大胆行动' : input.includes('必须') ? '降低标准' : '相反的行为',
          B: input.includes('安全') ? '保障安全感' : '满足某种需求',
          C: input.includes('安全') ? '保持竞争力' : '满足另一种需求',
          A: '实现长期可持续发展'
        } as ConflictDiagram
      };
    } else if (step === 'reality') {
      result = {
        type: 'reality_tree',
        coreProblem: '资源配置与目标不匹配',
        effects: ['团队精力分散', '关键任务优先级低', '决策周期延长', '执行效率下降'],
        rootCause: '缺乏明确的聚焦机制'
      };
    } else if (step === 'solution') {
      result = {
        type: 'solution',
        solutions: [
          { type: '改变++', desc: '在保持核心价值的同时，调整执行方式', assumptions: ['现有方式并非唯一路径'] },
          { type: '不改变++', desc: '优化当前方案，消除隐性障碍', assumptions: ['问题是局部的'] }
        ]
      };
    } else if (step === 'refine') {
      result = {
        type: 'refine',
        concerns: ['担心新方案带来不确定性', '资源重新配置有阻力'],
        solutions: ['先试点再推广', '保持与团队充分沟通']
      };
    } else if (step === 'action') {
      result = {
        type: 'action',
        actions: [
          { title: '立即行动', items: ['第一步：选定试点范围', '第二步：制定衡量标准', '第三步：两周内启动'] },
          { title: '风险预案', items: ['定期复盘机制', '快速调整通道', '备选方案准备'] }
        ]
      };
    }

    setAnalysisResult(result);
    setIsAnalyzing(false);

    let response = '';
    switch (step) {
      case 'problem':
        response = `好的，我理解了。\n\n📌 **问题摘要**：${userProblem}\n\n接下来，我将引导你通过TOC五步法来分析和解决这个问题。\n\n**第一步：构建冲突图**\n\n请告诉我：\n- 你当前采取了什么行动？（或者你不敢做什么？）`;
        break;
      case 'conflict':
        response = `📊 **冲突图分析完成**\n\n**D (当前行为)**：${result.diagram.D}\n**D′ (相反行为)**：${result.diagram.DPrime}\n**B (D满足的需求)**：${result.diagram.B}\n**C (D′满足的需求)**：${result.diagram.C}\n**A (共同目标)**：${result.diagram.A}\n\n请确认这个冲突图是否反映了你面临的困境？`;
        break;
      case 'reality':
        response = `🔍 **现状图分析**\n\n**核心问题**：${result.coreProblem}\n\n**不良效应链条**：\n${result.effects.map((e: string, i: number) => `${i + 1}. ${e}`).join('\n')}\n\n**根本原因**：${result.rootCause}\n\n这个分析是否与你的实际情况相符？`;
        break;
      case 'solution':
        response = `💡 **双赢方案建议**\n\n**方案一：${result.solutions[0].type}**\n${result.solutions[0].desc}\n关键假设：${result.solutions[0].assumptions[0]}\n\n**方案二：${result.solutions[1].type}**\n${result.solutions[1].desc}\n\n你倾向于哪个方向？`;
        break;
      case 'refine':
        response = `🛡️ **顾虑消除**\n\n**可能的顾虑**：\n${result.concerns.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}\n\n**对应解决方案**：\n${result.solutions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}\n\n这些顾虑是否涵盖了你担心的问题？`;
        break;
      case 'action':
        response = `🚀 **行动方案**\n\n**${result.actions[0].title}**\n${result.actions[0].items.map((i: string, idx: number) => `${idx + 1}. ${i}`).join('\n')}\n\n**${result.actions[1].title}**\n${result.actions[1].items.map((i: string, idx: number) => `${idx + 1}. ${i}`).join('\n')}\n\n🎉 **TOC分析完成！**\n\n按照这个方案执行，你将能够跳出当前的冲突困局，实现双赢。记住TOC的核心原则：**一次只做一件事，聚焦最大价值**。`;
        break;
    }

    addMessage('assistant', response, STEP_INDEX[step]);
  };

  const handleSubmit = () => {
    if (!input.trim()) return;
    addMessage('user', input);
    setInput('');
    analyze();
  };

  const handleConfirm = () => {
    setConfirmed(true);
    const nextStep = STEPS[STEP_INDEX[step] + 1];
    if (nextStep) {
      setStep(nextStep.id);
      addMessage('assistant', `很好，进入**${nextStep.zh}**阶段...`, STEP_INDEX[nextStep.id]);
    }
  };

  const handleNextStep = () => {
    const currentIndex = STEP_INDEX[step];
    const nextStep = STEPS[currentIndex + 1];
    if (nextStep) {
      setStep(nextStep.id);
      setConfirmed(false);
      setAnalysisResult(null);
      addMessage('assistant', `进入**${nextStep.zh}**阶段...`, STEP_INDEX[nextStep.id]);
    }
  };

  const handleStartOver = () => {
    setStep('problem');
    setMessages([]);
    setInput('');
    setAnalysisResult(null);
    setUserProblem('');
    setConfirmed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-medium">TOC清晰思考</span>
          </div>
          <button onClick={handleStartOver} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm">
            <RotateCcw className="w-4 h-4" /> 重开始
          </button>
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-3">
          <div className="flex gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex-1 flex items-center">
                <div className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded text-xs',
                  i <= STEP_INDEX[step] ? 'bg-blue-600 text-white' : 'text-slate-500'
                )}>
                  <span className="font-medium">{i + 1}</span>
                  <span className="hidden sm:inline">{s.zh}</span>
                </div>
                {i < STEPS.length - 1 && <div className="h-0.5 flex-1 mx-1 bg-slate-700" />}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">TOC清晰思考</h1>
            <p className="text-slate-400 mb-8 max-w-md">
              基于制约理论的五步思考流程，帮你从困境中找到显而易见的双赢方案
            </p>
            <div className="w-full max-w-md space-y-3">
              <textarea
                value={userProblem}
                onChange={(e) => setUserProblem(e.target.value)}
                placeholder="描述你面临的困境... 例如：团队业绩下滑、决策两难、个人发展困惑..."
                className="w-full h-28 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
              <button
                onClick={() => { addMessage('user', userProblem); setStep('problem'); analyze(); }}
                disabled={!userProblem.trim()}
                className={cn(
                  'w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all',
                  userProblem.trim() ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                )}
              >
                <Sparkles className="w-4 h-4" /> 开始分析
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-32">
            {messages.map((msg, i) => (
              <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-3',
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'
                )}>
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">{msg.content}</pre>
                </div>
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex justify-start">
                <div className="bg-slate-800 rounded-2xl px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-3xl mx-auto p-4">
          {confirmed ? (
            <button
              onClick={handleNextStep}
              className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white flex items-center justify-center gap-2"
            >
              确认无误，继续 <ChevronRight className="w-4 h-4" />
            </button>
          ) : step !== 'action' ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="输入你的想法..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isAnalyzing}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
              {analysisResult && (
                <button
                  onClick={handleConfirm}
                  className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl"
                >
                  确认
                </button>
              )}
            </div>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
