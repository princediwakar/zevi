import { FrameworkName, QuestionCategory } from '../types';

export interface WhenToUseRule {
  question_type: string;
  example: string;
}

export interface FillInBlankExercise {
  sentence: string;
  blanks: {
    position: number;
    answer: string;
    hint?: string;
  }[];
}

export interface MCQuestion {
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface FrameworkDefinition {
  name: FrameworkName;
  description: string;
  steps: FrameworkStep[];
  icon: string;
  color: string;
  category: 'product_sense' | 'execution' | 'strategy' | 'behavioral';
  when_to_use: WhenToUseRule[];
  applicable_categories: QuestionCategory[];
  fill_in_blank?: FillInBlankExercise[];
  mc_questions?: MCQuestion[];
}

export interface FrameworkStep {
  name: string;
  description: string;
  key_points: string[];
  weight: number; // For evaluation
}

export const FRAMEWORKS: Record<FrameworkName, FrameworkDefinition> = {
  CIRCLES: {
    name: 'CIRCLES',
    description: 'A structured approach to product sense interviews',
    icon: 'Target',
    color: '#2563EB',
    category: 'product_sense',
    when_to_use: [
      { question_type: 'Design a new product', example: 'Design a food delivery app for seniors' },
      { question_type: 'Improve an existing product', example: 'How would you improve Netflix?' },
      { question_type: 'Add a new feature', example: 'What feature would you add to Spotify?' },
    ],
    applicable_categories: ['product_sense'],
    fill_in_blank: [
      {
        sentence: 'The first step in CIRCLES is to blank the problem by understanding what the user needs and the business context.',
        blanks: [
          { position: 3, answer: 'Comprehend', hint: 'First letter C' },
        ]
      },
      {
        sentence: 'In the blank step you identify different user segments and their specific needs.',
        blanks: [
          { position: 2, answer: 'Identify', hint: 'Second letter I' },
        ]
      },
      {
        sentence: 'The blank step ensures you state your assumptions and discuss edge cases.',
        blanks: [
          { position: 0, answer: 'Clarify', hint: 'Fourth letter C' },
        ]
      }
    ],
    mc_questions: [
      {
        question: 'A PM asks: "How would you improve Google Maps?" Which framework step should you start with?',
        options: [
          'Start with Evaluate to propose solutions immediately',
          'Begin with Comprehend to clarify what "improve" means',
          'Jump straight to Summarize your recommendations',
          'Skip to Report current user complaints'
        ],
        correct_answer: 1,
        explanation: 'Always start with Comprehend to clarify the scope. What does "improve" mean? Improve engagement? Accessibility? Revenue? Ambiguity shows strong PM thinking.'
      },
      {
        question: 'During the Report step of CIRCLES, what should you focus on?',
        options: [
          'Proposing solutions and new features',
          'Listing all your assumptions',
          'Analyzing current state and supporting with data',
          'Summarizing final recommendations'
        ],
        correct_answer: 2,
        explanation: 'Report is about analyzing the current state - user behavior, metrics, pain points, and market trends. Save solutions for the Evaluate step.'
      },
      {
        question: 'What makes a great CIRCLES response stand out?',
        options: [
          'Covering all 6 steps quickly',
          'Asking clarifying questions and making explicit assumptions',
          'Skipping to recommendations',
          'Using frameworks as a rigid checklist'
        ],
        correct_answer: 1,
        explanation: 'Interviewers value candidates who ask clarifying questions (Comprehend) and state assumptions explicitly (Clarify) rather than jumping to solutions.'
      }
    ],
    steps: [
      {
        name: 'Comprehend',
        description: 'Understand and clarify the problem',
        key_points: [
          'Clarify the problem statement',
          'Define the scope and constraints',
          'Identify key stakeholders',
          'Understand the context'
        ],
        weight: 0.2
      },
      {
        name: 'Identify',
        description: 'Break down the problem into key areas',
        key_points: [
          'Identify key areas to analyze',
          'Consider different user segments',
          'Identify key metrics',
          'Determine success criteria'
        ],
        weight: 0.2
      },
      {
        name: 'Report',
        description: 'Analyze and report findings',
        key_points: [
          'Analyze current state',
          'Identify key insights',
          'Support with data',
          'Highlight trends'
        ],
        weight: 0.15
      },
      {
        name: 'Clarify',
        description: 'Clarify assumptions and constraints',
        key_points: [
          'State assumptions clearly',
          'Identify constraints',
          'Consider limitations',
          'Discuss edge cases'
        ],
        weight: 0.15
      },
      {
        name: 'Evaluate',
        description: 'Evaluate solutions',
        key_points: [
          'Propose multiple solutions',
          'Analyze trade-offs',
          'Consider implementation',
          'Discuss pros and cons'
        ],
        weight: 0.15
      },
      {
        name: 'Summarize',
        description: 'Summarize key points',
        key_points: [
          'Recap key findings',
          'Highlight main recommendations',
          'Suggest next steps',
          'End with clear conclusion'
        ],
        weight: 0.15
      }
    ]
  },

  STAR: {
    name: 'STAR',
    description: 'Behavioral interview framework for storytelling',
    icon: 'MessageSquare',
    color: '#7C3AED',
    category: 'behavioral',
    when_to_use: [
      { question_type: 'Tell me about a time...', example: 'Tell me about a time you dealt with a conflict' },
      { question_type: 'Leadership questions', example: 'Describe a time you led a team through challenge' },
      { question_type: 'Conflict resolution', example: 'Tell me about a disagreement with a coworker' },
      { question_type: 'Failure & learning', example: 'Describe a time you failed and what you learned' },
    ],
    applicable_categories: ['behavioral'],
    fill_in_blank: [
      {
        sentence: 'A strong STAR response should focus on your blank role, not what your team or company did.',
        blanks: [
          { position: 2, answer: 'specific', hint: 'Your individual' },
        ]
      },
      {
        sentence: 'Always blank your results with specific numbers - e.g., "increased by 40%" or "saved $100K".',
        blanks: [
          { position: 0, answer: 'Quantify', hint: 'Use numbers' },
        ]
      }
    ],
    mc_questions: [
      {
        question: 'Your interviewer asks: "Tell me about a time you had a conflict with a coworker." What should your Situation include?',
        options: [
          'Start with the resolution immediately',
          'Provide context: who was involved, what was the project, when did it happen',
          'Focus on blaming the coworker',
          'Skip to the result'
        ],
        correct_answer: 1,
        explanation: 'Good Situation sets the scene: "During my time as a PM at Company X, I was leading a cross-functional team to launch a new feature. There was a disagreement with a senior engineer about prioritization."'
      },
      {
        question: 'In the Action portion, what should you avoid?',
        options: [
          'Using "I" statements',
          'Describing your specific decisions',
          'Taking credit for your team\'s work',
          'Explaining your thought process'
        ],
        correct_answer: 2,
        explanation: 'Interviewers want to hear about YOUR actions, not what your team or manager did. Use "I led..." not "We fixed..."'
      },
      {
        question: 'For the Result, what makes an answer compelling?',
        options: [
          'Making up impressive numbers',
          'Only mentioning positive outcomes - never failures',
          'Quantifying impact AND reflecting on what you learned',
          'Keeping results vague to avoid being questioned'
        ],
        correct_answer: 2,
        explanation: 'Great answers include metrics (40% improvement, $50K saved) AND personal growth (learned to communicate more clearly). Don\'t just list achievements - show self-awareness.'
      }
    ],
    steps: [
      {
        name: 'Situation',
        description: 'Describe the context',
        key_points: [
          'Provide context',
          'Describe the challenge',
          'Set the scene',
          'Be concise'
        ],
        weight: 0.25
      },
      {
        name: 'Task',
        description: 'Explain your responsibility',
        key_points: [
          'What was your role?',
          'What was expected?',
          'What were the constraints?',
          'What was the timeline?'
        ],
        weight: 0.25
      },
      {
        name: 'Action',
        description: 'Describe what you did',
        key_points: [
          'Use "I" statements',
          'Focus on your actions',
          'Explain your thinking',
          'Show leadership'
        ],
        weight: 0.25
      },
      {
        name: 'Result',
        description: 'Share the outcomes',
        key_points: [
          'Quantify results',
          'What did you learn?',
          'Impact on business',
          'What would you do differently?'
        ],
        weight: 0.25
      }
    ]
  },

  METRICS: {
    name: 'METRICS',
    description: 'Framework for defining product metrics',
    icon: 'BarChart',
    color: '#059669',
    category: 'execution',
    when_to_use: [
      { question_type: 'Define metrics for...', example: 'What metrics would you track for Instagram?' },
      { question_type: 'Metrics dropped', example: 'Why did DAU drop 20%?' },
      { question_type: 'A/B testing', example: 'How would you test a new recommendation algorithm?' },
      { question_type: 'Measure success', example: 'How would you measure the success of a new feature?' },
    ],
    applicable_categories: ['execution', 'ab_testing'],
    fill_in_blank: [
      {
        sentence: 'A blank indicator predicts future outcomes while a blank indicator shows past performance.',
        blanks: [
          { position: 0, answer: 'leading', hint: 'Predicts future' },
          { position: 6, answer: 'lagging', hint: 'Shows past' },
        ]
      },
      {
        sentence: 'Facebook\'s North Star Metric is blank Monthly Active Users who connect with friends.',
        blanks: [
          { position: 0, answer: 'Daily', hint: 'Facebook is DAU-focused' },
        ]
      }
    ],
    mc_questions: [
      {
        question: 'Your PM asks: "Why did DAU drop 20% this week?" What\'s your first step?',
        options: [
          'Immediately propose solutions to fix it',
          'Check if the data is accurate and segment by user cohorts',
          'Report to leadership immediately',
          'Ignore it - fluctuations are normal'
        ],
        correct_answer: 1,
        explanation: 'Always validate data first! Check for tracking issues, segment by platform/region/cohort. A 20% drop could be a data pipeline error, not a real issue.'
      },
      {
        question: 'You\'re launching a new feature. Which metrics should you track?',
        options: [
          'Only the vanity metrics that look impressive',
          'A mix of leading indicators (early signals) and lagging indicators (final outcomes)',
          'Just one metric to keep it simple',
          'Metrics only after the feature is fully launched'
        ],
        correct_answer: 1,
        explanation: 'Leading indicators (sign-up rate, activation) predict success early. Lagging indicators (revenue, retention) confirm actual impact. Both matter for a complete picture.'
      },
      {
        question: 'For an A/B test, when can you declare a winner?',
        options: [
          'After 1 day regardless of sample size',
          'When you reach statistical significance AND have sufficient sample size',
          'As soon as variant B is ahead',
          'When stakeholders ask for results'
        ],
        correct_answer: 1,
        explanation: 'You need BOTH statistical significance (confidence the difference is real) AND sufficient sample size (representative data). Running tests too short is a common PM mistake.'
      }
    ],
    steps: [
      {
        name: 'Define',
        description: 'Define what success means',
        key_points: [
          'Business objectives',
          'User needs',
          'Company goals',
          'Success criteria'
        ],
        weight: 0.25
      },
      {
        name: 'Measure',
        description: 'How to measure success',
        key_points: [
          'Leading vs lagging indicators',
          'North Star Metric',
          'Key results',
          'Data sources'
        ],
        weight: 0.25
      },
      {
        name: 'Analyze',
        description: 'Analyze the data',
        key_points: [
          'Trend analysis',
          'Segmentation',
          'Cohort analysis',
          'Statistical significance'
        ],
        weight: 0.25
      },
      {
        name: 'Optimize',
        description: 'Optimize based on insights',
        key_points: [
          'Identify opportunities',
          'Prioritize initiatives',
          'Run experiments',
          'Iterate quickly'
        ],
        weight: 0.25
      }
    ]
  },

  PRIORITIZATION: {
    name: 'PRIORITIZATION',
    description: 'Framework for prioritizing features/initiatives',
    icon: 'List',
    color: '#DC2626',
    category: 'execution',
    when_to_use: [
      { question_type: 'Prioritize features', example: 'Which features would you prioritize for a new app?' },
      { question_type: 'Roadmap planning', example: 'How would you plan the next quarter roadmap?' },
      { question_type: 'Resource allocation', example: 'How would you allocate engineering resources?' },
      { question_type: 'Make trade-offs', example: 'What would you cut from the roadmap and why?' },
    ],
    applicable_categories: ['execution'],
    fill_in_blank: [
      {
        sentence: 'The blank framework scores initiatives on Reach Impact Confidence and blank.',
        blanks: [
          { position: 1, answer: 'RICE', hint: 'Acronym for prioritization' },
          { position: 9, answer: 'Effort', hint: 'The last E in RICE' },
        ]
      },
      {
        sentence: 'In the blank model features that delight customers are called blank features.',
        blanks: [
          { position: 2, answer: 'Kano', hint: 'Named after Noriaki Kano' },
          { position: 7, answer: 'Delight', hint: 'Beyond expected' },
        ]
      }
    ],
    mc_questions: [
      {
        question: 'What does RICE stand for in the RICE prioritization framework?',
        options: [
          'Reach, Impact, Cost, Estimate',
          'Reach, Importance, Confidence, Effort',
          'Reach, Impact, Confidence, Effort',
          'Risk, Impact, Cost, Estimate'
        ],
        correct_answer: 2,
        explanation: 'RICE stands for Reach (how many users), Impact (how much better), Confidence (how certain), and Effort (time required).'
      },
      {
        question: 'In the Kano Model, which feature type would cause dissatisfaction if missing but not increase satisfaction if present?',
        options: [
          'Performance features',
          'Delight features',
          'Basic features',
          'Indifferent features'
        ],
        correct_answer: 2,
        explanation: 'Basic (or Must-be) features cause dissatisfaction when missing but don\'t increase satisfaction when present. They are expected baseline requirements.'
      }
    ],
    steps: [
      {
        name: 'Value vs Effort',
        description: 'Map on value vs effort matrix',
        key_points: [
          'Estimate business value',
          'Estimate implementation effort',
          'Consider strategic alignment',
          'Risk assessment'
        ],
        weight: 0.33
      },
      {
        name: 'RICE Framework',
        description: 'Reach, Impact, Confidence, Effort',
        key_points: [
          'Reach: Number of users',
          'Impact: How much better',
          'Confidence: Certainty level',
          'Effort: Time required'
        ],
        weight: 0.33
      },
      {
        name: 'Kano Model',
        description: 'Basic, Performance, Delight features',
        key_points: [
          'Basic needs (must-haves)',
          'Performance needs (more is better)',
          'Delight features (wow factor)',
          'Indifferent features'
        ],
        weight: 0.34
      }
    ]
  },

  PROBLEM_STATEMENT: {
    name: 'PROBLEM_STATEMENT',
    description: 'Framework for clearly defining problems',
    icon: 'AlertCircle',
    color: '#EA580C',
    category: 'strategy',
    when_to_use: [
      { question_type: 'Define a problem', example: 'What problem would you solve with $1M budget?' },
      { question_type: 'Opportunity identification', example: 'Identify a market opportunity for a new product' },
      { question_type: 'Root cause analysis', example: 'Why did the product launch fail?' },
    ],
    applicable_categories: ['strategy'],
    fill_in_blank: [
      {
        sentence: 'The Problem Statement framework helps you identify the blank their blank and the blank.',
        blanks: [
          { position: 3, answer: 'user', hint: 'Who is affected?' },
          { position: 6, answer: 'need', hint: 'What do they need?' },
          { position: 10, answer: 'insight', hint: 'What\'s the key realization?' },
        ]
      }
    ],
    mc_questions: [
      {
        question: 'What are the three components of a problem statement?',
        options: [
          'Who, What, When',
          'User, Need, Insight',
          'Problem, Solution, Impact',
          'Market, Product, Revenue'
        ],
        correct_answer: 1,
        explanation: 'The Problem Statement framework uses User (who), Need (what they need), and Insight (your unique understanding).'
      }
    ],
    steps: [
      {
        name: 'User',
        description: 'Who is the user?',
        key_points: [
          'User demographics',
          'User needs',
          'User pain points',
          'User behavior'
        ],
        weight: 0.33
      },
      {
        name: 'Need',
        description: 'What is their need?',
        key_points: [
          'Core problem',
          'Current solutions',
          'Gaps in solutions',
          'Unmet needs'
        ],
        weight: 0.33
      },
      {
        name: 'Insight',
        description: 'What is the insight?',
        key_points: [
          'Key insight',
          'Why now?',
          'Market opportunity',
          'Unique angle'
        ],
        weight: 0.34
      }
    ]
  },

  SWOT: {
    name: 'SWOT',
    description: 'Strengths, Weaknesses, Opportunities, Threats analysis',
    icon: 'PieChart',
    color: '#8B5CF6',
    category: 'strategy',
    when_to_use: [
      { question_type: 'Competitor analysis', example: 'Analyze Netflix vs Disney+ competitive position' },
      { question_type: 'Strategic planning', example: 'What are our strategic options for entering a new market?' },
      { question_type: 'Self assessment', example: 'What are our strengths and weaknesses as a company?' },
    ],
    applicable_categories: ['strategy'],
    fill_in_blank: [
      {
        sentence: 'SWOT analysis looks at internal blank and blank plus external blank and blank.',
        blanks: [
          { position: 2, answer: 'Strengths', hint: 'Internal - what you do well' },
          { position: 3, answer: 'Weaknesses', hint: 'Internal - what needs improvement' },
          { position: 6, answer: 'Opportunities', hint: 'External - market trends' },
          { position: 7, answer: 'Threats', hint: 'External - competitors, risks' },
        ]
      }
    ],
    mc_questions: [
      {
        question: 'Your company is considering entering a new market. In SWOT, where would you look for information about market growth?',
        options: [
          'Strengths',
          'Weaknesses',
          'Opportunities',
          'Threats'
        ],
        correct_answer: 2,
        explanation: 'Market growth, emerging trends, and unmet needs belong in Opportunities (external, positive). Threats include market decline or increasing competition.'
      },
      {
        question: 'What\'s a common mistake when doing SWOT analysis?',
        options: [
          'Including only internal factors',
          'Confusing internal with external factors',
          'Making it too detailed',
          'Using it for quarterly planning'
        ],
        correct_answer: 1,
        explanation: 'Many candidates mix up internal vs external. Strengths/Weaknesses = Internal (inside your control). Opportunities/Threats = External (market, competitors).'
      },
      {
        question: 'You\'re analyzing a competitor who just launched a popular feature. Where does this go in your SWOT?',
        options: [
          'Strengths',
          'Weaknesses',
          'Opportunities',
          'Threats'
        ],
        correct_answer: 3,
        explanation: 'Competitor actions are external threats (or opportunities if you can respond faster). This isn\'t your strength or weakness - it\'s external market pressure.'
      }
    ],
    steps: [
      {
        name: 'Strengths',
        description: 'Identify internal positive attributes',
        key_points: [
          'What advantages does your company have?',
          'What do competitors lack?',
          'What resources do you have?',
          'What do customers praise?'
        ],
        weight: 0.25
      },
      {
        name: 'Weaknesses',
        description: 'Identify internal negative attributes',
        key_points: [
          'What areas need improvement?',
          'What do competitors do better?',
          'What resources are missing?',
          'What do customers complain about?'
        ],
        weight: 0.25
      },
      {
        name: 'Opportunities',
        description: 'Identify external positive factors',
        key_points: [
          'What market trends can you exploit?',
          'Are there unmet customer needs?',
          'Can you partner or expand?',
          'Are regulations changing in your favor?'
        ],
        weight: 0.25
      },
      {
        name: 'Threats',
        description: 'Identify external negative factors',
        key_points: [
          'What competitors threats exist?',
          'Are regulations becoming stricter?',
          'Is market demand declining?',
          'Are new entrants a risk?'
        ],
        weight: 0.25
      }
    ]
  },

  PORTER_FIVE_FORCES: {
    name: 'PORTER_FIVE_FORCES',
    description: 'Industry analysis framework',
    icon: 'Globe',
    color: '#0EA5E9',
    category: 'strategy',
    when_to_use: [
      { question_type: 'Industry analysis', example: 'Analyze the ride-sharing industry attractiveness' },
      { question_type: 'Market entry', example: 'Should we enter the Indian market?' },
      { question_type: 'Competitive dynamics', example: 'How do suppliers and buyers affect the industry?' },
    ],
    applicable_categories: ['strategy'],
    fill_in_blank: [
      {
        sentence: 'Porter\'s Five Forces analyzes supplier power buyer power competitive blank new entrants and substitutes.',
        blanks: [
          { position: 4, answer: 'rivalry', hint: 'The main force' },
        ]
      }
    ],
    mc_questions: [
      {
        question: 'Which force in Porter\'s Five Forces examines how easy it is for new companies to enter an industry?',
        options: [
          'Supplier Power',
          'Buyer Power',
          'Threat of New Entrants',
          'Competitive Rivalry'
        ],
        correct_answer: 2,
        explanation: 'Threat of New Entrants examines barriers to entry like capital requirements, regulations, and brand loyalty.'
      }
    ],
    steps: [
      {
        name: 'Competitive Rivalry',
        description: 'Intensity of competition',
        key_points: [
          'Number of competitors',
          'Industry concentration',
          'Product differentiation',
          'Exit barriers'
        ],
        weight: 0.2
      },
      {
        name: 'Supplier Power',
        description: 'Bargaining power of suppliers',
        key_points: [
          'Number of suppliers',
          'Supplier size and strength',
          'Switching costs',
          'Supplier concentration'
        ],
        weight: 0.2
      },
      {
        name: 'Buyer Power',
        description: 'Bargaining power of buyers',
        key_points: [
          'Number of buyers',
          'Price sensitivity',
          'Switching costs',
          'Buyer concentration'
        ],
        weight: 0.2
      },
      {
        name: 'Threat of New Entrants',
        description: 'Risk of new competitors',
        key_points: [
          'Barriers to entry',
          'Capital requirements',
          'Economies of scale',
          'Access to distribution'
        ],
        weight: 0.2
      },
      {
        name: 'Threat of Substitutes',
        description: 'Risk of alternative products',
        key_points: [
          'Number of substitutes',
          'Perceived value',
          'Switching costs',
          'Technology changes'
        ],
        weight: 0.2
      }
    ]
  },

  BLUE_OCEAN: {
    name: 'BLUE_OCEAN',
    description: 'Blue Ocean Strategy framework',
    icon: 'Droplet',
    color: '#06B6D4',
    category: 'strategy',
    when_to_use: [
      { question_type: 'Create new market', example: 'How would you create a new category in the market?' },
      { question_type: 'Innovation strategy', example: 'How can we differentiate from all competitors?' },
      { question_type: 'Value innovation', example: 'What can we eliminate, reduce, raise, create?' },
    ],
    applicable_categories: ['strategy'],
    fill_in_blank: [
      {
        sentence: 'The ERRGC grid helps you blank eliminate blank raise and blank create factors.',
        blanks: [
          { position: 2, answer: 'Eliminate', hint: 'Remove what\'s overdone' },
          { position: 5, answer: 'Reduce', hint: 'Below industry standard' },
          { position: 8, answer: 'Raise', hint: 'Above industry standard' },
          { position: 11, answer: 'Create', hint: 'New factors' },
        ]
      }
    ],
    mc_questions: [
      {
        question: 'What does the ERRRC grid in Blue Ocean Strategy help companies do?',
        options: [
          'Analyze financial statements',
          'Eliminate, Reduce, Raise, Create value factors',
          'Measure customer satisfaction',
          'Hire employees'
        ],
        correct_answer: 1,
        explanation: 'ERRRC stands for Eliminate, Reduce, Raise, Create - a tool to reconstruct value elements and break away from competition.'
      }
    ],
    steps: [
      {
        name: 'Eliminate',
        description: 'Remove factors no longer relevant',
        key_points: [
          'What assumptions are outdated?',
          'What features are taken for granted?',
          'What no longer adds value?',
          'What can be removed entirely?'
        ],
        weight: 0.25
      },
      {
        name: 'Reduce',
        description: 'Lower factors below industry standard',
        key_points: [
          'What is over-served?',
          'Where can you reduce complexity?',
          'What can be simplified?',
          'Where can you cut costs?'
        ],
        weight: 0.25
      },
      {
        name: 'Raise',
        description: 'Raise factors above industry standard',
        key_points: [
          'What needs dramatic improvement?',
          'What would delight customers?',
          'Where can you create new value?',
          'What should be elevated?'
        ],
        weight: 0.25
      },
      {
        name: 'Create',
        description: 'Create entirely new factors',
        key_points: [
          'What new value can you introduce?',
          'What unmet needs exist?',
          'What can you invent?',
          'What would surprise customers?'
        ],
        weight: 0.25
      }
    ]
  }
};
