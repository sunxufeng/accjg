// ============================================================
// data.js —— 共创录·AI素养修行RPG  全部内容数据
// 纯数据，便于教研替换与扩展。
// ============================================================

// ---------- 门派（创角选择） ----------
export const SECTS = [
  {
    id: 'algorithm', name: '算法门', color: '#2c5f7c', accent: '#5a8a6a',
    motto: '穷理尽性，以算入道',
    desc: '主修 AI 原理与算法认知。答题所得修为 +20%。',
    bonus: { type: 'expMul', value: 1.2 }
  },
  {
    id: 'data', name: '数据宗', color: '#b8860b', accent: '#c9a227',
    motto: '观象于数，格物致知',
    desc: '主修数据素养。创号即赠灵气 +60。',
    bonus: { type: 'spirit', value: 60 }
  },
  {
    id: 'ethics', name: '伦理阁', color: '#c23a2b', accent: '#e07b5a',
    motto: '持守方寸，行稳致远',
    desc: '主修 AI 伦理与安全。答题正确额外得灵气 +10。',
    bonus: { type: 'ethicBonus', value: 10 }
  },
  {
    id: 'apply', name: '应用派', color: '#5a8a6a', accent: '#8fbf8f',
    motto: '格物致用，以术证道',
    desc: '主修 AI 工具应用与创造。论道评分加成 +30%。',
    bonus: { type: 'lundaoMul', value: 1.3 }
  }
];

// ---------- 境界（修炼体系） ----------
export const REALMS = [
  { name: '练气', exp: 0 },
  { name: '筑基', exp: 100 },
  { name: '金丹', exp: 300 },
  { name: '元婴', exp: 700 },
  { name: '化神', exp: 1500 },
  { name: '炼虚', exp: 3000 },
  { name: '合体', exp: 6000 },
  { name: '大乘', exp: 12000 },
  { name: '渡劫', exp: 24000 }
];

// ---------- 每日一问 / 答题题库（4 维度） ----------
// dim: algorithm 算法认知 | data 数据素养 | ethics 伦理安全 | apply 应用创造
export const QUESTIONS = [
  {
    id: 'q1', dim: 'algorithm',
    q: '下面哪一项最准确地描述了"人工智能（AI）"？',
    options: [
      '一种能像人一样思考、感受情绪的机器',
      '让计算机从数据中学习规律、完成智能任务的技術',
      '只会按固定指令重复劳动的软件',
      '一根会自己写程序的魔法棒'
    ],
    answer: 1,
    explain: 'AI 是让计算机通过数据学习并完成任务的技术，它并不真正"思考"或"感受"，而是用统计与算法模拟智能行为。',
    source: '《普通高中信息技术课程标准》：人工智能是对人的意识与思维过程的模拟。'
  },
  {
    id: 'q2', dim: 'algorithm',
    q: '传统"规则编程"和"机器学习"最大的区别是？',
    options: [
      '机器学习不需要计算机',
      '规则编程由人写好每一步指令；机器学习让程序从数据中自己总结规律',
      '两者完全一样',
      '机器学习只用于玩游戏'
    ],
    answer: 1,
    explain: '规则编程是人把"如果…就…"写死；机器学习是给大量数据，让模型自己找到其中的规律。',
    source: '吴恩达：机器学习 = 用数据自动编写程序。'
  },
  {
    id: 'q3', dim: 'algorithm',
    q: '什么是"训练数据"？',
    options: [
      '程序员喝咖啡的时间',
      '用来让 AI 模型学习规律的样本集合',
      '电脑的电源线',
      '游戏的关卡'
    ],
    answer: 1,
    explain: '训练数据是喂给模型的样例（文字、图片等），模型从中归纳规律。数据的质量与数量直接决定模型能力。',
    source: '《新一代人工智能发展规划》强调数据、算力、算法为 AI 三要素。'
  },
  {
    id: 'q4', dim: 'data',
    q: '如果训练数据里"猫"的图片全是白猫，模型可能学到什么偏差？',
    options: [
      '它会讨厌所有动物',
      '它可能只认白猫，把黑猫误判成别的',
      '它变得无所不能',
      '偏差不存在'
    ],
    answer: 1,
    explain: '数据不全面会让模型产生偏见。只喂白猫，模型就以为"猫都是白的"，这是典型的数据偏差问题。',
    source: '《算法经》有云：见偏则知偏，数据不全则智不全。'
  },
  {
    id: 'q5', dim: 'data',
    q: '用 AI 给同学做"性格分析"前，最重要的是？',
    options: [
      '随便用，好玩就行',
      '先获得对方同意，保护个人隐私',
      '把结果发到网上炫耀',
      '让 AI 替你决定对方的人生'
    ],
    answer: 1,
    explain: '任何涉及个人的数据分析都应征得同意、保护隐私，不能拿他人信息随意试验或公开。',
    source: '《个人信息保护法》：处理个人信息应征得同意，遵循最小必要原则。'
  },
  {
    id: 'q6', dim: 'ethics',
    q: 'AI 出现"幻觉（hallucination）"是指？',
    options: [
      'AI 生病了',
      'AI 一本正经地编造出并不存在的错误内容',
      'AI 看到了鬼',
      'AI 在睡觉'
    ],
    answer: 1,
    explain: '大模型有时会自信地输出错误信息或根本不存在的事实，这叫"幻觉"。所以重要内容一定要核实。',
    source: 'OpenAI 安全文档：模型可能生成不真实内容，需人工核验。'
  },
  {
    id: 'q7', dim: 'ethics',
    q: '看到 AI 生成的一则"惊人新闻"，你应该？',
    options: [
      '立刻转发到朋友圈',
      '先核实来源，不造谣、不传谣',
      '当作绝对真理',
      '用它去吓唬同学'
    ],
    answer: 1,
    explain: 'AI 可能生成虚假信息。负责任的使用者会先查证，不传播未经核实的内容。',
    source: '《网络安全法》：任何个人不得利用网络编造、传播虚假信息。'
  },
  {
    id: 'q8', dim: 'apply',
    q: '想让 AI 帮你写作文开头，最好的做法是？',
    options: [
      '只说"帮我写作文"',
      '给出主题、字数、风格等清晰要求（提示词）',
      '什么都不说',
      '让 AI 替你考试'
    ],
    answer: 1,
    explain: '提示词（prompt）越清晰具体，AI 输出越贴合需求。这是"应用派"的核心技能。注意：AI 辅助不等于代写考试。',
    source: '提示工程（Prompt Engineering）：清晰的指令带来更好的结果。'
  },
  {
    id: 'q9', dim: 'apply',
    q: '用 AI 生成的画去参加比赛，正确的是？',
    options: [
      '谎称纯手绘',
      '如实标注 AI 辅助，并体现自己的创意与修改',
      '盗用他人作品声称是自己的',
      '完全不署名'
    ],
    answer: 1,
    explain: '使用 AI 创作应诚实标注，并加入自己的创意。抄袭与冒领他人成果都是不诚信的。',
    source: '《著作权法》精神：独创性表达才受保护，使用工具须如实说明。'
  },
  {
    id: 'q10', dim: 'algorithm',
    q: '"生成式 AI"最突出的特点是？',
    options: [
      '只能算 1+1',
      '能根据所学生成新的文字、图像、音乐等内容',
      '只能播放视频',
      '不能处理语言'
    ],
    answer: 1,
    explain: '生成式 AI（如对话模型、绘图模型）能创造新内容，而非仅做分类或预测。',
    source: '《生成式人工智能服务管理暂行办法》：用于生成文本、图片、音频等。'
  },
  {
    id: 'q11', dim: 'data',
    q: '推荐系统（如短视频推荐）靠什么工作？',
    options: [
      '随机乱推',
      '根据你的行为数据预测你可能喜欢的内容',
      '猜硬币',
      '完全由人工每天挑选'
    ],
    answer: 1,
    explain: '推荐系统分析你的点击、停留等行为数据，预测兴趣并推送。了解它有助于管理自己的使用时长。',
    source: '协同过滤：用相似用户/物品的行为做推荐。'
  },
  {
    id: 'q12', dim: 'ethics',
    q: '和 AI 聊天时，以下哪种做法更负责任？',
    options: [
      '把密码、家庭住址全告诉它',
      '不泄露个人隐私，把 AI 当工具而非真人',
      '让它替你做所有人生决定',
      '用它欺负别人'
    ],
    answer: 1,
    explain: 'AI 不是真人，也不该被盲目信任。不泄露隐私、不依赖它做重大决定、不用它伤害他人。',
    source: 'AI 伦理三原则：可控、可问责、向善。'
  },
  {
    id: 'q13', dim: 'algorithm',
    q: '图灵测试想判断的是？',
    options: [
      '电脑重不重',
      '机器表现出的智能是否让人难以分辨是人还是机器',
      '谁的网速更快',
      '电池能用多久'
    ],
    answer: 1,
    explain: '图灵测试由阿兰·图灵提出：如果人无法通过对话分辨对方是机器还是人，就认为机器表现出了智能。',
    source: 'A. M. Turing, 1950, Computing Machinery and Intelligence。'
  },
  {
    id: 'q14', dim: 'apply',
    q: '做"AI + 学习"时，最该警惕的是？',
    options: [
      '让 AI 替你思考、失去锻炼机会',
      '每天只想玩 AI',
      '把 AI 当字典查词',
      '用 AI 整理笔记'
    ],
    answer: 1,
    explain: 'AI 是助力而非拐杖。长期让它代劳思考，会弱化自己的学习能力。用 AI 辅助理解，而不是替代思考。',
    source: '学习科学：生成性学习（自己建构）比被动接收更有效。'
  },
  {
    id: 'q15', dim: 'data',
    q: '"算力、算法、数据"被称为 AI 的？',
    options: [
      '三座大山',
      '三大要素（三驾马车）',
      '三种游戏',
      '三顿饭'
    ],
    answer: 1,
    explain: '算力（计算能力）、算法（方法）、数据（原料）共同决定 AI 的能力，被称为 AI 三大要素。',
    source: '《新一代人工智能发展规划》：数据、算力、算法为基础支撑。'
  },
  {
    id: 'q16', dim: 'algorithm',
    q: '神经网络（深度学习）大致模仿了什么？',
    options: [
      '人的消化系统',
      '人脑中大量神经元互相连接传递信号的方式',
      '汽车的发动机',
      '一棵树的年轮'
    ],
    answer: 1,
    explain: '人工神经网络受大脑神经元启发，由许多"节点"层层连接，通过调整连接强度来学习。',
    source: '深度学习中"神经元/层"概念源自对生物神经的简化模拟。'
  },
  {
    id: 'q17', dim: 'ethics',
    q: 'AI 做出的招聘/信贷决策出现歧视，根因往往是？',
    options: [
      '电脑坏了',
      '训练数据本身带有历史偏见',
      '用户太笨',
      '天气原因'
    ],
    answer: 1,
    explain: '如果历史数据里存在歧视，模型会"学会"并放大它。因此要审查数据与算法公平。',
    source: '算法公平（Fairness）：历史偏见会被模型继承。'
  },
  {
    id: 'q18', dim: 'apply',
    q: '一个"智能体（Agent）"相比普通问答 AI 多了什么能力？',
    options: [
      '能自己规划步骤、调用工具去完成任务',
      '会飞',
      '什么都不做',
      '只能聊天'
    ],
    answer: 1,
    explain: 'AI Agent 能自主拆解目标、调用工具（搜索、写代码等）逐步完成任务，而不仅是回答一句话。',
    source: 'Agent = 规划 + 记忆 + 工具调用 的自主系统。'
  },
  {
    id: 'q19', dim: 'data',
    q: '要减少模型"偏见"，数据上应该？',
    options: [
      '越多越乱越好',
      '覆盖更全面、均衡、有代表性的样本',
      '只用一种类型',
      '不用数据'
    ],
    answer: 1,
    explain: '代表性、均衡的样本能帮助模型更公平。刻意收集多样、无偏的数据是关键一步。',
    source: '数据集构建原则：代表性、多样性、可溯源。'
  },
  {
    id: 'q20', dim: 'ethics',
    q: 'AI 生成的内容被误传为"真人说的"，危害在于？',
    options: [
      '很有趣',
      '可能误导公众、损害他人名誉，甚至违法',
      '没有任何问题',
      '能涨粉'
    ],
    answer: 1,
    explain: '伪造他人言论可能构成侵权甚至违法。对 AI 生成内容应标识，避免以假乱真。',
    source: '《深度合成规定》：不得利用深度合成从事侵害他人权益的活动。'
  },

  // ===== 扩展关卡：第二卷·进阶试炼（q21 - q31） =====
  {
    id: 'q21', dim: 'algorithm',
    q: '机器学习与传统编程最大的不同是？',
    options: [
      '传统编程由人写规则，机器学习从数据里自动找规律',
      '两者完全一样',
      '机器学习不需要计算机',
      '传统编程一定更聪明'
    ],
    answer: 0,
    explain: '传统程序由人写好明确规则；机器学习让模型从大量数据中自动归纳规律，适合规则难写清的问题。',
    source: '区分"基于规则"与"基于数据"两类智能方法。'
  },
  {
    id: 'q22', dim: 'algorithm',
    q: '模型在训练数据上表现极好、换一批新数据就大跌，这叫？',
    options: ['过拟合', '欠拟合', '刚刚好', '没关系'],
    answer: 0,
    explain: '过拟合指模型"死记"了训练样本甚至噪声，遇到新数据就失灵。缓解办法有增加数据、简化模型等。',
    source: '过拟合（overfitting）：模型对训练集过度适应而泛化差。'
  },
  {
    id: 'q23', dim: 'algorithm',
    q: '把数据分成"训练集"和"测试集"的主要目的是？',
    options: [
      '让电脑更慢',
      '检验模型在没见过的数据上是否真的有用',
      '少算一点',
      '排版好看'
    ],
    answer: 1,
    explain: '测试集模拟"未来新数据"，用来客观评估模型泛化能力，避免只会在旧数据上耍花招。',
    source: '训练/验证/测试划分是评估泛化的基本方法。'
  },
  {
    id: 'q24', dim: 'data',
    q: '让 AI 认图前，常需要人工给图片贴"这是猫/那是狗"的标签，这步叫？',
    options: ['数据标注', '数据删除', '数据加密', '数据打包'],
    answer: 0,
    explain: '数据标注为原始数据打上正确标签，是监督学习的关键环节，质量直接影响模型效果。',
    source: '标注质量决定监督学习上限。'
  },
  {
    id: 'q25', dim: 'data',
    q: '以下哪类信息属于应当谨慎对待的"个人敏感信息"？',
    options: [
      '你喜欢的颜色',
      '身份证号、人脸、病历',
      '你爱看的动画',
      '今天的天气'
    ],
    answer: 1,
    explain: '身份证、人脸、健康信息等一旦泄露危害大。使用 AI 时尽量避免上传不必要的个人敏感数据。',
    source: '《个人信息保护法》：敏感个人信息处理需单独同意。'
  },
  {
    id: 'q26', dim: 'data',
    q: '用"某城市白天街景"训练的模型，去"夜晚乡村"使用可能不准，因为？',
    options: [
      '模型怕黑',
      '训练数据不代表真实多样场景（分布偏差）',
      '电脑想睡觉',
      '乡村没有电脑'
    ],
    answer: 1,
    explain: '数据若只覆盖部分场景，模型在未见过的场景下易失效，这就是分布偏差。采集数据要兼顾多样性。',
    source: '数据代表性不足会导致分布偏移、泛化失败。'
  },
  {
    id: 'q27', dim: 'ethics',
    q: '发布 AI 生成的图片或文章时，比较负责任的做法是？',
    options: [
      '假装是自己拍的',
      '明确标注"AI 生成"',
      '偷偷删掉水印',
      '说是名人说的'
    ],
    answer: 1,
    explain: '标识 AI 生成内容，既尊重公众知情权，也避免误导。许多平台与法规都要求显著标识。',
    source: '《生成式AI服务管理暂行办法》：对生成内容应进行标识。'
  },
  {
    id: 'q28', dim: 'ethics',
    q: '有人用 AI 换脸冒充你说话借钱，这属于？',
    options: ['高科技炫技', '深度伪造，可能违法并侵害他人权益', '普通滤镜', '正常现象'],
    answer: 1,
    explain: '深度伪造可制造以假乱真的音视频，用于诈骗或诽谤属违法。遇到要警惕并核验身份。',
    source: '深度伪造（deepfake）滥用触及刑法与民法责任。'
  },
  {
    id: 'q29', dim: 'ethics',
    q: '用 AI 帮写作文，下面哪种做法更可取？',
    options: [
      '整篇照搬交作业',
      '用 AI 找思路、列提纲，自己动笔并注明辅助',
      '让 AI 代考',
      '完全不碰 AI'
    ],
    answer: 1,
    explain: '把 AI 当"脚手架"：启发思路、检查语法，核心表达仍由自己完成，并如实说明使用了工具。',
    source: '学术诚信：工具可辅助，原创与责任不能让渡。'
  },
  {
    id: 'q30', dim: 'apply',
    q: '能"自己规划步骤、调用工具去完成目标"的 AI 系统常被称为？',
    options: ['智能体（Agent）', '计算器', '字典', '打印机'],
    answer: 0,
    explain: '智能体可拆解任务、调用搜索/代码等工具并迭代，比一次性问答更接近"自主办事"。',
    source: 'Agent：具备规划、工具调用与记忆的自主系统。'
  },
  {
    id: 'q31', dim: 'apply',
    q: '第一次问 AI 没答好，最好的改进方式是？',
    options: [
      '换一句更长的废话',
      '补充背景、明确格式与约束，多轮迭代',
      '骂它一顿',
      '直接放弃'
    ],
    answer: 1,
    explain: '提示词是"渐进打磨"的过程：给足上下文、指定输出格式、说明限制，再据反馈修正，效果越来越好。',
    source: '提示词迭代：上下文 + 格式 + 约束 + 反馈。'
  }
];

// ---------- 典籍阅览（仿古文 AI 科普 + 思辨题） ----------
export const READINGS = [
  {
    id: 'r1', category: '认知', title: '算法初解', author: '共创录·无名氏',
    stars: 5,
    content: `　天地有大美而不言，万物有常理而可算。今之巧匠，聚万机之数，名曰"算法"。算法者，步骤之序也，若庖丁解牛，依其理而后动。\n　或问：机何以能识猫犬？对曰：先示以千万之图，使之自寻其形；久而熟，虽未见之猫，亦能辨之。此谓"从数据中学习"，非人教以每一物之名也。\n　然机之所知，止于所喂之数据。数据偏，则智偏；数据缺，则识缺。故用机者，必先正其源。`,
    reflection: {
      q: '根据本文，为什么"只喂白猫图片"的模型可能认不出黑猫？',
      options: ['因为模型不喜欢黑色', '因为数据不全面，模型没学过黑猫的样子', '因为电脑没电', '因为猫会隐身'],
      answer: 1,
      explain: '模型只从训练数据中学习；没见过黑猫，自然不会认。这正是数据偏差的体现。'
    }
  },
  {
    id: 'r2', category: '伦理', title: '慎言箴', author: '共创录·无名氏',
    stars: 5,
    content: `　机善言，然其言未必实。有时侃侃而谈，实则子虚乌有，世人谓之"幻觉"。故闻机之言，不可尽信，犹闻市井之传言，须考其源。\n　又有以机言冒他人之口者，伪造音容，混淆视听，此大害也。古语云：谣言止于智者。今可曰：伪言止于明者。\n　用机之要，在诚与慎：标其所助，不掠其美；不传未核之言，不泄私密之信。`,
    reflection: {
      q: '文中所言"幻觉"提醒我们，使用 AI 时应？',
      options: ['完全不用 AI', '对重要内容人工核实，不轻信', '把 AI 当神仙', '转发所有 AI 说的话'],
      answer: 1,
      explain: 'AI 可能编造不实信息，关键内容必须核实，这是负责任使用的底线。'
    }
  },
  {
    id: 'r3', category: '应用', title: '提示之术', author: '共创录·无名氏',
    stars: 4,
    content: `　欲使机善其事，必先善其问。问之不清，答必含糊；问之详明，答乃中的。此"提示词"之术也。\n　善问者，先陈其的（要什么）、次定其式（什么格式）、再约其界（有何限制）。如遣匠造物，图样愈明，所成愈近。\n　然术终为器，思方为本。机可助汝成文，不可代汝立意为学。慎之。`,
    reflection: {
      q: '依本文，"提示词"写得越清晰，AI 输出会？',
      options: ['越跑题', '越贴合需求', '越短', '越错'],
      answer: 1,
      explain: '提示词是对 AI 的指令；指令越具体，输出越贴合你的真实需要。'
    }
  },
  {
    id: 'r4', category: '数据', title: '数据如镜', author: '共创录·无名氏',
    stars: 4,
    content: `　数据者，世事之镜也。镜清则影正，镜污则形歪。以偏镜照人，所见自歪；以全镜照世，方得其真。\n　今有推言之术，观汝所好，投其所悦，久则囿于一隅，不见天地之广。此"信息茧房"之弊也。\n　破茧之法无他：广其源、节其用、常自省。勿令机夺汝之耳目。`,
    reflection: {
      q: '文中"信息茧房"比喻的是？',
      options: ['网络很快', '推荐系统只推你喜欢的内容，视野变窄', '蚕宝宝', '电脑死机'],
      answer: 1,
      explain: '推荐系统若只投你所好，会让你困在相似信息里，视野变窄，故称"茧房"。'
    }
  },
  {
    id: 'r5', category: '应用', title: '智能体说', author: '共创录·无名氏',
    stars: 5,
    content: `　今有"智能体"，能自定步骤、调兵遣将：或查资料、或算数、或执事，环环相扣以竟一业。譬若遣一仆，不仅听命，更能自谋其法。\n　然仆虽能，主不可惰。步骤之得失、工具之取舍，仍须人裁。机可任事，不可任其作主。\n　善用者，立其的、界其权、核其果；如是，则事半而功倍。`,
    reflection: {
      q: '文中"智能体"比喻能？',
      options: ['只会一次问答', '自己规划步骤并调用工具完成目标', '自动关机', '代替人思考一切'],
      answer: 1,
      explain: '智能体可自主拆解任务、调用工具并迭代，比单次问答更强，但仍需人把控方向与结果。'
    }
  },
  {
    id: 'r6', category: '伦理', title: '版权辨', author: '共创录·无名氏',
    stars: 4,
    content: `　机之所成，或取众人之作以为粮。食人谷者，当念其源。以他山之石，冒为己出，是为窃。\n　今之规：用机成图成文，宜标其助；引用他人，必注其处。明其源，方不失诚。\n　创新非无本之木。善借者成其大，掠美者失其心。`,
    reflection: {
      q: '依本文，使用 AI 生成内容时应？',
      options: ['当作完全原创', '标注辅助并尊重他人版权', '隐去所有来源', '随意商用牟利'],
      answer: 1,
      explain: 'AI 训练常取材他人作品，使用时需标识并尊重版权，引用要注明，守住诚信底线。'
    }
  }
];

// ---------- 文献库 ----------
export const LIBRARY = [
  { id: 'l1', type: 'course', title: '《人工智能入门》微课', source: '国家智慧教育平台',
    summary: '面向青少年的 AI 通识微课，讲解机器学习、图像识别基础，配套动画与练习。' },
  { id: 'l2', type: 'method', title: '提示词工程实战手册', source: '应用派·内功篇',
    summary: '系统讲解角色设定、任务分解、约束条件、示例引导等提示技巧，附 30 个模板。' },
  { id: 'l3', type: 'intl', title: 'AI for K-12（国际纲要）', source: '国际计算科学教育联盟',
    summary: '国际通用的 K12 AI 素养框架，涵盖感知、表示、推理、机器学习与社会影响五大主题。' },
  { id: 'l4', type: 'meeting', title: '青少年 AI 伦理圆桌纪要', source: '伦理阁·论道录',
    summary: '学生、老师、专家围绕"AI 与隐私、偏见、诚信"展开讨论的纪要，含 12 条共识。' },
  { id: 'l5', type: 'academic', title: '深度学习的可解释性综述', source: '学术期刊摘编',
    summary: '介绍为何要"看懂"模型决策、主流可解释方法（特征重要性、注意力可视化）及局限。' },
  { id: 'l6', type: 'chat', title: '和 AI 同桌的 100 个对话', source: '共创社区·语料',
    summary: '收录学生与 AI 协作学习的真实对话范例：答疑、 brainstorming、复盘，附点评。' }
];

// ---------- 技能树（4 维 × 5 节点 + 4 跨维绝学） ----------
// cost: 灵气；prereq: 前置节点 id（同维）
export const SKILLS = [
  // 算法认知
  { id: 's_a1', dim: 'algorithm', name: '初识算法', cost: 30, prereq: null,
    desc: '理解"步骤即算法"，答题修为 +5%。', bonus: '答题修为 +5%' },
  { id: 's_a2', dim: 'algorithm', name: '数据炼金', cost: 50, prereq: 's_a1',
    desc: '掌握训练数据概念，参悟点答题灵气 +8。', bonus: '参悟灵气 +8' },
  { id: 's_a3', dim: 'algorithm', name: '神经网络', cost: 80, prereq: 's_a2',
    desc: '理解神经元与层次，解锁"化神"专属题库。', bonus: '解锁高阶题库' },
  { id: 's_a4', dim: 'algorithm', name: '模型之眼', cost: 120, prereq: 's_a3',
    desc: '看懂过拟合与泛化，每日一问正确灵气 +12。', bonus: '每日灵气 +12' },
  { id: 's_a5', dim: 'algorithm', name: '算道通玄', cost: 200, prereq: 's_a4',
    desc: '融会贯通算法全貌，所有答题修为额外 +25%。', bonus: '全答题修为 +25%' },
  // 数据素养
  { id: 's_d1', dim: 'data', name: '格物致知', cost: 30, prereq: null,
    desc: '建立数据意识，每日一问修为 +5%。', bonus: '每日修为 +5%' },
  { id: 's_d2', dim: 'data', name: '见偏知偏', cost: 50, prereq: 's_d1',
    desc: '识别数据偏差，典籍思辨正确灵气 +8。', bonus: '思辨灵气 +8' },
  { id: 's_d3', dim: 'data', name: '破茧之眼', cost: 80, prereq: 's_d2',
    desc: '识破信息茧房，论道评分 +10%。', bonus: '论道 +10%' },
  { id: 's_d4', dim: 'data', name: '数据守门', cost: 120, prereq: 's_d3',
    desc: '守护隐私，所有灵气获取 +10%。', bonus: '全灵气 +10%' },
  { id: 's_d5', dim: 'data', name: '数海通鉴', cost: 200, prereq: 's_d4',
    desc: '洞察数据全貌，每次阅读典籍额外获顿悟 +3。', bonus: '典籍顿悟 +3' },
  // 伦理安全
  { id: 's_e1', dim: 'ethics', name: '明辨幻象', cost: 30, prereq: null,
    desc: '识破 AI 幻觉，答题正确额外灵气 +6。', bonus: '正确灵气 +6' },
  { id: 's_e2', dim: 'ethics', name: '慎言守密', cost: 50, prereq: 's_e1',
    desc: '保护隐私，违规操作不再扣修为。', bonus: '免扣修为' },
  { id: 's_e3', dim: 'ethics', name: '向善之尺', cost: 80, prereq: 's_e2',
    desc: '衡量 AI 影响，成就进度加速。', bonus: '成就加速' },
  { id: 's_e4', dim: 'ethics', name: '公平之道', cost: 120, prereq: 's_e3',
    desc: '推动算法公平，社群贡献 +15%。', bonus: '社群贡献 +15%' },
  { id: 's_e5', dim: 'ethics', name: '伦理宗师', cost: 200, prereq: 's_e4',
    desc: '以德服人，连续修行天数加成翻倍（×2）。', bonus: '连续加成 ×2' },
  // 应用创造
  { id: 's_p1', dim: 'apply', name: '善问之术', cost: 30, prereq: null,
    desc: '写好提示词，论道基础分 +10。', bonus: '论道基础 +10' },
  { id: 's_p2', dim: 'apply', name: '以术证道', cost: 50, prereq: 's_p1',
    desc: 'AI 辅助创作，论道评分 +15%。', bonus: '论道 +15%' },
  { id: 's_p3', dim: 'apply', name: '智能体驭使', cost: 80, prereq: 's_p2',
    desc: '调度 AI Agent，每日一问修为 +10%。', bonus: '每日修为 +10%' },
  { id: 's_p4', dim: 'apply', name: '格物致用', cost: 120, prereq: 's_p3',
    desc: '融会贯通，全修为获取 +10%。', bonus: '全修为 +10%' },
  { id: 's_p5', dim: 'apply', name: '创世之手', cost: 200, prereq: 's_p4',
    desc: '驾驭 AI 创造之力，论道最高分额外奖励灵气 +30。', bonus: '论道满分奖 +30灵气' },
  // —— 跨维绝学（需两个维度各满 3 节点） ——
  { id: 's_x1', dim: 'algorithm', name: '智数合一', cost: 250, prereq: 's_a3',
    desc: '【跨维】算法与数据融合，答题+思辨双倍经验。需先解锁 s_d3。',
    bonus: '答题/思辨 ×2', crossReq: ['s_d3'] },
  { id: 's_x2', dim: 'ethics', name: '德术并重', cost: 250, prereq: 's_e3',
    desc: '【跨维】伦理与应用兼顾，论道不扣分且评分 +20%。需先解锁 s_p3。',
    bonus: '论道保底+20%', crossReq: ['s_p3'] },
  { id: 's_x3', dim: 'data', name: '数伦同源', cost: 250, prereq: 's_d3',
    desc: '【跨维】数据与伦理贯通，隐私保护下数据收益 +25%。需先解锁 s_e3。',
    bonus: '安全数据收益 +25%', crossReq: ['s_e3'] },
  { id: 's_x4', dim: 'apply', name: '算用通神', cost: 300, prereq: 's_p4',
    desc: '【跨维】算法与应用合一，全技能效果 +15%。需先解锁 s_a4。',
    bonus: '全技能 +15%', crossReq: ['s_a4'] }
];

export const DIM_META = {
  algorithm: { name: '算法认知', color: '#2c5f7c' },
  data: { name: '数据素养', color: '#b8860b' },
  ethics: { name: '伦理安全', color: '#c23a2b' },
  apply: { name: '应用创造', color: '#5a8a6a' }
};

// ---------- 成就 ----------
export const ACHIEVEMENTS = [
  { id: 'a1', name: '初入修行', desc: '完成创角，踏入修行之路。', reward: '灵气+20', check: s => !!s.profile },
  { id: 'a2', name: '百问不怠', desc: '累计答对 10 道题。', reward: '灵气+50', check: s => (s.stats?.correct||0) >= 10 },
  { id: 'a3', name: '博览群书', desc: '读完全部典籍。', reward: '顿悟+5', check: s => READINGS.every(r => s.reading[r.id]) },
  { id: 'a4', name: '七日不辍', desc: '连续修行 7 天。', reward: '灵气+80', check: s => (s.streak?.days||0) >= 7 },
  { id: 'a5', name: '登堂入室', desc: '境界达到金丹。', reward: '修为+200', check: s => realmIndex(s) >= 2 },
  { id: 'a6', name: '技能大成', desc: '解锁 8 个技能节点。', reward: '灵气+100', check: s => Object.values(s.skills||{}).filter(Boolean).length >= 8 },
  { id: 'a7', name: '论道初成', desc: '完成 1 次论道。', reward: '灵气+30', check: s => (s.stats?.lundao||0) >= 1 },
  { id: 'a8', name: '化神在望', desc: '境界达到化神。', reward: '修为+500', check: s => realmIndex(s) >= 4 }
];

function realmIndex(s){ return s.realm ? REALMS.findIndex(r=>r.exp<=s.realm.exp) : 0; }

// ---------- 任务（修行任务） ----------
export const TASKS = [
  { id: 't1', cat: '主线', name: '入门之试', desc: '前往中央"每日一问碑"回答今日一题。',
    target: 'daily', reward: { exp: 30, spirit: 15 } },
  { id: 't2', cat: '日常', name: '温故知新', desc: '在藏经阁阅读一篇典籍并作答思辨。',
    target: 'reading', reward: { exp: 20, spirit: 10 } },
  { id: 't3', cat: '主线', name: '参悟之道', desc: '在地图中找到一处"参悟点"完成随机一题。',
    target: 'quiz', reward: { exp: 25, spirit: 12 } },
  { id: 't4', cat: '支线', name: '访古问今', desc: '打开文献库，浏览任意一篇文献。',
    target: 'library', reward: { exp: 15, spirit: 8 } },
  { id: 't5', cat: '日常', name: '论道一场', desc: '前往论道台，完成一次提示词创作挑战。',
    target: 'lundao', reward: { exp: 35, spirit: 20 } },
  { id: 't6', cat: '主线', name: '技艺精进', desc: '在技能树解锁任意 1 个节点。',
    target: 'skill', reward: { exp: 20, spirit: 15 } }
];

// ---------- RPG 地图 ----------
// 图例: # 墙/边界  B 建筑(大)  b 建筑(小)  ~ 水  = 路/桥  . 草地
//       T 树(可走装饰)  F 花(可走)  R 石头(可走)  C 祭坛/碑  P 桥板
export const MAP_ROWS = [
  '############################################################',
  '#..........................................................#',
  '#..........................................................#',
  '#..........................................................#',
  '#.......=.....................=.....................=......#',
  '#.......=....BB...............=..............BB.....=......#',
  '#.......=....BB...............=..............BB.....=......#',
  '#.....T.=.....................=........TTT.........T=T.....#',
  '#...====================================================...#',
  '#...TTTT=.....................P........TTT.........T=T.....#',
  '#..TTTTT=TF.................~~P~~.......T.......T...=......#',
  '#...TTTT=FFF................~~P~~..............TTT..=......#',
  '#...TTTT=FFFF..R......C....~~~P~~~............TTTTT.=......#',
  '#.....T.=FFF..RRR...........~~P~~..............TTT..=......#',
  '#.......=.F.TRRRRR..........~~P~~...............T...=......#',
  '#.......=..TTTRRR.............P.....................=......#',
  '#.......=.TTTTTR..............P....R..........R.....=......#',
  '#.......=..TTT..............~~P~~.RRR........RRR....=......#',
  '#.......=...T..............~~~P~~~RRRR......RRRRR...=..R...#',
  '#.......=..................~~~P~~~RRR........RRR....=.RRR..#',
  '#...====C=================PPPPPPPPP=================C===RR.#',
  '#.......=RRR.......TTT.....~~~P~~~..................=.RRR..#',
  '#.......=RRRR.....TTTTT....~~~P~~~..................=..R...#',
  '#.......=RRR.......TTT......~~P~~...................=......#',
  '#.......=.R.....F...T.........P.............T...F...=......#',
  '#.......=......FFF............=............TTT.FFF..=......#',
  '#.......=.....FFFFF...F.......=...........TTTTTFFFF.=......#',
  '#......T=T.....FFF...FFF......=............TTT.FFFT.=......#',
  '#.....TT=T......F.T.FFFFFR....P.....F.......T...TT.T=......#',
  '#......T=T.......TTT.FFFRRR.~~P~~..FFF..........TTTT=......#',
  '#.......=.......TTTTT.FRRRRR~~P~~.FFFFF........TTTTT=T.....#',
  '#.......=........TTT....RRR~~~P~~~.FFF..........TTTT=......#',
  '#...=======================PPPPPPP====C=================...#',
  '#.......=....BB.............~~P~~............BB...T.=......#',
  '#.......=....BB...............P..............BB.....=......#',
  '#.......=.....................=.....................=......#',
  '#.......=.....................=.....................=......#',
  '#.......=.....................=.....................=......#',
  '#..........................................................#',
  '############################################################',
];
// 瓦片尺寸（像素）
export const TILE = 40;
// 交互点（坐标为瓦片格）：type 决定触发内容
export const INTERACTIONS = [
  { x: 13, y: 8, type: 'task', label: '任务堂' },
  { x: 45, y: 8, type: 'lundao', label: '论道台' },
  { x: 13, y: 31, type: 'reading', label: '藏经阁' },
  { x: 45, y: 31, type: 'library', label: '文献阁' },
  { x: 24, y: 20, type: 'daily', label: '每日一问碑' },
  { x: 8, y: 20, type: 'quiz', label: '参悟点·算法' },
  { x: 22, y: 12, type: 'quiz', label: '参悟点·数据' },
  { x: 38, y: 32, type: 'quiz', label: '参悟点·伦理' },
  { x: 52, y: 20, type: 'quiz', label: '参悟点·应用' },
  { x: 22, y: 18, type: 'npc', label: '游方道人', npc: '老者' },
  { x: 34, y: 26, type: 'npc', label: '机巧童子', npc: '童子' },
  { x: 11, y: 31, type: 'npc', label: '藏书长老', npc: '老者' },
  { x: 48, y: 9, type: 'npc', label: '论道仙师', npc: '仙师' },
  { x: 8, y: 17, type: 'npc', label: '算法真人', npc: '老者' },
  { x: 22, y: 15, type: 'npc', label: '数据仙子', npc: '仙子' },
  { x: 38, y: 29, type: 'npc', label: '伦理守吏', npc: '吏' },
  { x: 52, y: 23, type: 'npc', label: '应用巧匠', npc: '巧匠' },
  { x: 30, y: 24, type: 'npc', label: '守桥翁', npc: '老者' },
  { x: 10, y: 28, type: 'npc', label: '采药童子', npc: '童子' },
  { x: 42, y: 28, type: 'npc', label: '古松老人', npc: '老者' },
  { x: 44, y: 16, type: 'npc', label: '灵兽白狐', npc: '仙子' },
  { x: 18, y: 24, type: 'npc', label: '集市商贩', npc: '吏' },
  { x: 30, y: 4, type: 'npc', label: '山门守卫', npc: '守卫' },
  { x: 30, y: 36, type: 'npc', label: '南天门将', npc: '守卫' },
  { x: 26, y: 26, type: 'secret', label: '隐秘石碑' },
  { x: 35, y: 26, type: 'secret', label: '古井' },
  { x: 6, y: 34, type: 'secret', label: '神秘洞窟' },
  { x: 54, y: 34, type: 'secret', label: '灵泉' },
  { x: 40, y: 6, type: 'secret', label: '残破经幢' },
  { x: 18, y: 12, type: 'secret', label: '棋盘石' },
  { x: 50, y: 28, type: 'secret', label: '许愿灯' },
  { x: 6, y: 6, type: 'secret', label: '星象台' },
  { x: 41, y: 1, type: 'npc', label: '云游散人', npc: '老者' },
  { x: 2, y: 13, type: 'npc', label: '采药童子', npc: '童子' },
  { x: 23, y: 4, type: 'npc', label: '说书先生', npc: '仙子' },
  { x: 20, y: 9, type: 'npc', label: '摆渡老翁', npc: '仙师' },
  { x: 1, y: 11, type: 'npc', label: '炼丹道童', npc: '吏' },
  { x: 17, y: 20, type: 'npc', label: '观星术士', npc: '巧匠' },
  { x: 56, y: 2, type: 'npc', label: '抚琴仙姝', npc: '守卫' },
  { x: 45, y: 20, type: 'npc', label: '弈棋棋叟', npc: '老者' },
  { x: 24, y: 9, type: 'npc', label: '卖花女郎', npc: '童子' },
  { x: 27, y: 20, type: 'npc', label: '酿酒仙翁', npc: '仙子' },
  { x: 52, y: 15, type: 'npc', label: '守园小吏', npc: '仙师' },
  { x: 32, y: 1, type: 'npc', label: '训兽使者', npc: '吏' },
  { x: 26, y: 37, type: 'npc', label: '铸剑客卿', npc: '巧匠' },
  { x: 40, y: 20, type: 'npc', label: '问天书生', npc: '守卫' },
  { x: 4, y: 23, type: 'npc', label: '寻宝游侠', npc: '老者' },
  { x: 19, y: 37, type: 'npc', label: '拂尘道姑', npc: '童子' },
  { x: 39, y: 13, type: 'npc', label: '占卜盲人', npc: '仙子' },
  { x: 1, y: 17, type: 'npc', label: '挑担脚夫', npc: '仙师' },
  { x: 14, y: 15, type: 'npc', label: '结网渔人', npc: '吏' },
  { x: 16, y: 6, type: 'npc', label: '采菱村姑', npc: '巧匠' },
  { x: 50, y: 13, type: 'npc', label: '磨镜匠人', npc: '守卫' },
  { x: 26, y: 38, type: 'npc', label: '挑灯侍者', npc: '老者' },
  { x: 55, y: 25, type: 'npc', label: '煮茶道人', npc: '童子' },
  { x: 45, y: 28, type: 'npc', label: '斫琴名家', npc: '仙子' },
  { x: 50, y: 17, type: 'npc', label: '舞剑侠女', npc: '仙师' },
  { x: 6, y: 2, type: 'npc', label: '吹箫隐士', npc: '吏' },
  { x: 23, y: 31, type: 'npc', label: '放鹤童子', npc: '巧匠' },
  { x: 24, y: 7, type: 'npc', label: '种桃老农', npc: '守卫' },
  { x: 55, y: 31, type: 'npc', label: '饲鹤仙姑', npc: '老者' },
  { x: 34, y: 1, type: 'npc', label: '卜卦道人', npc: '童子' },
  { x: 49, y: 34, type: 'npc', label: '负剑游侠', npc: '仙子' },
  { x: 51, y: 13, type: 'npc', label: '垂钓渔隐', npc: '仙师' },
  { x: 27, y: 5, type: 'npc', label: '拾薪樵夫', npc: '吏' },
  { x: 52, y: 7, type: 'npc', label: '浣纱少女', npc: '巧匠' },
  { x: 58, y: 21, type: 'npc', label: '牧羊童子', npc: '守卫' },
  { x: 7, y: 12, type: 'npc', label: '看山门人', npc: '老者' },
  { x: 15, y: 22, type: 'npc', label: '扫地道童', npc: '童子' },
  { x: 24, y: 23, type: 'npc', label: '掌灯仙吏', npc: '仙子' },
  { x: 25, y: 37, type: 'npc', label: '听涛居士', npc: '仙师' },
  { x: 33, y: 29, type: 'npc', label: '踏雪寻梅客', npc: '吏' },
  { x: 51, y: 5, type: 'npc', label: '拾贝童子', npc: '巧匠' },
  { x: 47, y: 17, type: 'npc', label: '弄潮儿郎', npc: '守卫' },
  { x: 27, y: 35, type: 'npc', label: '采莲歌女', npc: '老者' },
  { x: 52, y: 26, type: 'npc', label: '卖药郎中', npc: '童子' },
  { x: 47, y: 34, type: 'npc', label: '测字先生', npc: '仙子' },
  { x: 3, y: 32, type: 'npc', label: '扶鸾女冠', npc: '仙师' },
  { x: 40, y: 37, type: 'npc', label: '守炉道童', npc: '吏' },
  { x: 17, y: 21, type: 'npc', label: '点翠绣娘', npc: '巧匠' },
  { x: 8, y: 1, type: 'npc', label: '云游散人·其48', npc: '守卫' },
  { x: 49, y: 25, type: 'npc', label: '采药童子·其49', npc: '老者' },
  { x: 2, y: 8, type: 'secret', label: '残碑' },
  { x: 34, y: 29, type: 'secret', label: '古泉' },
  { x: 10, y: 14, type: 'secret', label: '断桥遗迹' },
  { x: 52, y: 2, type: 'secret', label: '石灯' },
  { x: 31, y: 20, type: 'secret', label: '枯井' },
  { x: 10, y: 1, type: 'secret', label: '棋枰残局' },
  { x: 9, y: 33, type: 'secret', label: '经幢' },
  { x: 11, y: 12, type: 'secret', label: '镇妖石' },
  { x: 36, y: 8, type: 'secret', label: '听风铃' },
  { x: 41, y: 10, type: 'secret', label: '落星石' },
  { x: 17, y: 31, type: 'secret', label: '藏剑冢' },
  { x: 37, y: 4, type: 'secret', label: '桃花阵' },
  { x: 38, y: 18, type: 'secret', label: '八卦台' },
  { x: 53, y: 5, type: 'secret', label: '丹炉残址' },
  { x: 11, y: 22, type: 'secret', label: '玉简' },
  { x: 6, y: 15, type: 'secret', label: '萤火洞' },
  { x: 34, y: 6, type: 'secret', label: '月影潭' },
  { x: 23, y: 23, type: 'secret', label: '封印石' },
  { x: 56, y: 19, type: 'secret', label: '鹦鹉螺' },
  { x: 7, y: 30, type: 'secret', label: '仙人指路石' },
  { x: 20, y: 32, type: 'secret', label: '无字天书' },
  { x: 47, y: 3, type: 'secret', label: '龙鳞石' },
  { x: 1, y: 7, type: 'secret', label: '凤鸣钟' },
  { x: 19, y: 31, type: 'secret', label: '龟息洞' },
  { x: 26, y: 8, type: 'secret', label: '葫芦藤' },
  { x: 37, y: 22, type: 'secret', label: '锁妖环' },
  { x: 23, y: 32, type: 'secret', label: '七星灯' },
  { x: 8, y: 26, type: 'secret', label: '同心结' },
  { x: 46, y: 22, type: 'secret', label: '忘川渡' },
  { x: 13, y: 23, type: 'secret', label: '涅槃灰' },
  { x: 3, y: 27, type: 'secret', label: '流光璧' },
  { x: 23, y: 9, type: 'secret', label: '岁月镜' },
  { x: 6, y: 38, type: 'secret', label: '问心石' },
  { x: 38, y: 38, type: 'quiz', label: '参悟点·算法' },
  { x: 54, y: 14, type: 'quiz', label: '顿悟点·数据' },
  { x: 41, y: 2, type: 'quiz', label: '明心点·伦理' },
  { x: 23, y: 28, type: 'quiz', label: '证道点·应用' },
  { x: 36, y: 23, type: 'quiz', label: '破妄点·算法' },
  { x: 37, y: 35, type: 'quiz', label: '启智点·数据' },
  { x: 32, y: 28, type: 'quiz', label: '淬灵点·伦理' },
  { x: 49, y: 20, type: 'quiz', label: '问玄点·应用' },
  { x: 36, y: 11, type: 'quiz', label: '参悟点·算法' },
  { x: 6, y: 12, type: 'quiz', label: '顿悟点·数据' },
  { x: 1, y: 25, type: 'quiz', label: '明心点·伦理' },
  { x: 49, y: 24, type: 'quiz', label: '证道点·应用' },
  { x: 47, y: 5, type: 'quiz', label: '破妄点·算法' },
];
export const PLAYER_START = { x: 30, y: 26 };

