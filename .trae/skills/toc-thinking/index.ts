/**
 * TOC清晰思考技能
 * 基于制约理论(TOC)的五步思考流程
 */

export const tocThinkingSkill = {
  name: 'toc-clear-thinking',
  displayName: 'TOC清晰思考',
  description: '通过五步思考流程，从复杂问题中找到显而易见的双赢解决方案',
  version: '1.0.0',
  
  steps: [
    {
      id: 'define',
      name: '定义困境',
      description: '理解用户面临的核心问题',
      questions: [
        '请描述一下你面临的问题或困境',
        '这个问题持续了多久？',
        '已经尝试过什么方法？效果如何？',
        '这个问题影响了谁？'
      ]
    },
    {
      id: 'conflict',
      name: '冲突图',
      description: '将问题转化为两难冲突',
      elements: {
        D: '当前采取的行为',
        DPrime: '相反的行为',
        B: 'D满足的需求',
        C: 'DPrime满足的需求',
        A: '共同目标'
      },
      questions: [
        '你目前采取的是什么行动？',
        '与之相反的行为是什么？',
        '每个行为分别满足了什么需求？',
        '两者的共同目标是什么？'
      ]
    },
    {
      id: 'source',
      name: '溯源',
      description: '找出根本原因与不良效应',
      questions: [
        '这个问题导致了哪些不良后果？',
        '这些后果之间有什么关联？',
        '最根本的原因是什么？'
      ]
    },
    {
      id: 'solution',
      name: '双赢方案',
      description: '开发打破冲突的解决方案',
      methods: [
        { name: '改变++', desc: '挑战D→C假设，找到例外' },
        { name: '不改变++', desc: '挑战D\'→B假设，优化D\'' },
        { name: '条件改变', desc: '分情况处理不同条件' },
        { name: '另一种改变', desc: '跳出D/D\'，寻找第三条路' }
      ],
      keyQuestions: [
        '真的是这样吗？',
        '总是真的吗？有没有例外？',
        '有没有完全不同的解决方式？'
      ]
    },
    {
      id: 'refine',
      name: '消除顾虑',
      description: '确保方案可行，消除潜在问题',
      questions: [
        '这个方案可能有什么顾虑？',
        '顾虑成立的前提是什么？',
        '如何消除或缓解这些顾虑？'
      ]
    },
    {
      id: 'action',
      name: '行动计划',
      description: '推动执行落地',
      quadrants: {
        gold: '改变的好处',
        crocodile: '改变的坏处',
        mermaid: '不改变的好处',
        crutch: '不改变的坏处'
      },
      questions: [
        '谁需要被说服？',
        '第一步从哪里开始？',
        '如何衡量进展？'
      ]
    }
  ],

  principles: [
    { name: '可视化', desc: '把问题画出来，用图表展示' },
    { name: '先假言后验证', desc: '挑战每个假设，寻找例外' },
    { name: '不妥协', desc: '不接受冲突不可避免' },
    { name: '一次只做一件事', desc: '聚焦最大价值' }
  ],

  conflictDiagramTemplate: `
         [A]
        /   \\
       /     \\
     [B]     [C]
      \\       /
       \\     /
        [D]---X---[D']

    D = 当前行为
    D' = 相反行为
    B = D满足的需求
    C = D'满足的需求
    A = 共同目标
  `
};

export default tocThinkingSkill;
