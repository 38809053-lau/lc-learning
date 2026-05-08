import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Cloud, GitBranch, Lightbulb, Wrench, Rocket, Trophy } from 'lucide-react';
import { STEPS } from '../types/toc';
import { useTocStore } from '../store/tocStore';
import { cn } from '../lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Cloud,
  GitBranch,
  Lightbulb,
  Wrench,
  Rocket,
  Trophy,
};

export function StepNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useTocStore();
  const currentStepIndex = STEPS.findIndex((s) => s.path === location.pathname);

  const canNavigate = (index: number) => {
    if (!session) return index === 0;
    return index <= Math.max(1, session.currentStep);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">TOC</span>
            </div>
            <span className="text-white font-semibold hidden sm:block">清晰思考</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 -mb-2 sm:mb-0 px-2">
            {STEPS.map((step, index) => {
              const Icon = iconMap[step.icon];
              const isActive = location.pathname === step.path;
              const isAccessible = canNavigate(index);

              return (
                <button
                  key={step.id}
                  onClick={() => isAccessible && navigate(step.path)}
                  disabled={!isAccessible}
                  className={cn(
                    'flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap text-xs sm:text-sm',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : isAccessible
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'text-slate-600 cursor-not-allowed'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden md:block">{step.name}</span>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        'hidden sm:block w-4 h-0.5 rounded ml-1',
                        index < currentStepIndex ? 'bg-green-500' : 'bg-slate-700'
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
