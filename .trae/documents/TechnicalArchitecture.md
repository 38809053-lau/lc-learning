# TOC清晰思考技能应用 - 技术架构文档

## 1. 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                     前端应用层                          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │  页面   │ │  组件   │ │  状态   │ │  路由   │       │
│  │ Pages   │ │Compo-   │ │ Zustand │ │ React   │       │
│  │         │ │nents    │ │ Store   │ │ Router  │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     工具层                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ SVG绘图  │ │ 本地存储 │ │ 导出功能 │ │ 图表渲染 │   │
│  │ 工具函数 │ │localSto- │ │ html2can-│ │ 坐标计算 │   │
│  │          │ │rage      │ │ vas      │ │          │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 2. 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | React | 18.x |
| 语言 | TypeScript | 5.x |
| 构建工具 | Vite | 5.x |
| 样式 | TailwindCSS | 3.x |
| 状态管理 | Zustand | 4.x |
| 路由 | React Router DOM | 6.x |
| 图标 | Lucide React | 最新 |

## 3. 路由定义

| 路径 | 页面 | 功能 |
|------|------|------|
| `/` | HomePage | 问题输入、开始思考 |
| `/conflict` | ConflictPage | 构建冲突图 |
| `/reality` | RealityPage | 构建现状图 |
| `/solution` | SolutionPage | 开发双赢方案 |
| `/refine` | RefinePage | 完善方案消除顾虑 |
| `/action` | ActionPage | 四象限分析与实施 |
| `/result` | ResultPage | 成果展示与导出 |

## 4. 数据模型

### 4.1 TOC会话数据

```typescript
interface TocSession {
  id: string;
  problem: string;
  currentStep: number;
  conflictDiagram: ConflictDiagram | null;
  realityTree: RealityTree | null;
  solutions: Solution[];
  selectedSolution: Solution | null;
  refinedPlan: RefinedPlan | null;
  actionItems: ActionItem[];
  createdAt: number;
  updatedAt: number;
}
```

### 4.2 冲突图数据

```typescript
interface ConflictDiagram {
  D: string;        // 当前行为
  DPrime: string;   // 相反行为
  B: string;         // D满足的需求
  C: string;         // D'满足的需求
  A: string;         // 共同目标
}
```

### 4.3 现状图数据

```typescript
interface RealityTree {
  effects:不良效应[];
  connections:连接关系[];
  coreProblem: string;
}

interface 不良效应 {
  id: string;
  text: string;
  x: number;
  y: number;
}

interface 连接关系 {
  from: string;
  to: string;
}
```

### 4.4 解决方案数据

```typescript
interface Solution {
  id: string;
  type: 'change++' | 'no-change++' | 'conditional' | 'alternative';
  description: string;
  assumptions: string[];
  evaluation: {
    feasibility: number;
    impact: number;
    effort: number;
  };
}
```

### 4.5 行动项数据

```typescript
interface ActionItem {
  id: string;
  text: string;
  category: 'gold' | 'crutch' | 'mermaid' | 'crocodile';
  priority: number;
  completed: boolean;
}
```

## 5. 组件结构

```
src/
├── components/
│   ├── ConflictDiagram/
│   │   ├── index.tsx              # 主组件
│   │   ├── ConflictNode.tsx       # 节点组件
│   │   └── ConflictArrow.tsx      # 连接线组件
│   ├── RealityTree/
│   │   ├── index.tsx              # 主组件
│   │   ├── EffectNode.tsx        # 不良效应节点
│   │   └── TreeArrow.tsx         # 树形连接线
│   ├── FourQuadrants/
│   │   ├── index.tsx             # 主组件
│   │   └── QuadrantCard.tsx      # 象限卡片
│   ├── StepNavigation/
│   │   └── index.tsx             # 步骤导航栏
│   ├── QuestionCard/
│   │   └── index.tsx             # 引导问题卡片
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── Tooltip.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── ConflictPage.tsx
│   ├── RealityPage.tsx
│   ├── SolutionPage.tsx
│   ├── RefinePage.tsx
│   ├── ActionPage.tsx
│   └── ResultPage.tsx
├── store/
│   └── tocStore.ts               # Zustand状态管理
├── hooks/
│   ├── useLocalStorage.ts        # 本地存储钩子
│   ├── useDiagram.ts             # 图表逻辑钩子
│   └── useExport.ts              # 导出功能钩子
├── utils/
│   ├── diagram.ts               # 图表计算工具
│   ├── export.ts                # 导出工具
│   └── constants.ts              # 常量定义
└── types/
    └── toc.ts                   # 类型定义
```

## 6. 关键实现细节

### 6.1 冲突图渲染
- 使用SVG绘制五个矩形节点
- 贝塞尔曲线连接箭头
- 节点可编辑（点击进入输入模式）
- 动态计算箭头起点终点坐标

### 6.2 现状图渲染
- 支持拖拽节点位置
- 可视化连接线创建
- 自动布局算法（力导向或网格）
- 恶性循环高亮标记

### 6.3 数据持久化
- Zustand + persist中间件
- 自动同步到localStorage
- 会话恢复机制

### 6.4 导出功能
- 使用html2canvas将图表转为图片
- 生成PDF格式报告
- 支持打印样式

## 7. 性能优化

- React.memo减少不必要的重渲染
- useMemo缓存计算结果
- 图表懒加载（按需渲染）
- 防抖处理用户输入
