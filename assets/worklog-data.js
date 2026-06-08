window.WORKLOG_DATA = {
  "generatedAt": "2026-06-08 12:30:00",
  "root": "示例数据集",
  "stats": {
    "recordCount": 12,
    "projectCount": 4,
    "dayCount": 10,
    "outputCount": 18,
    "attentionCount": 3
  },
  "tags": ["UI", "数据", "搜索", "热力图", "性能", "文档", "自动化", "发布", "体验", "复盘"],
  "categories": ["产品设计", "工程研发", "数据分析", "运营复盘"],
  "projects": [
    {
      "name": "Dashboard UX",
      "category": "产品设计",
      "count": 4,
      "latestDate": "2026-06-08",
      "firstDate": "2026-05-29",
      "activeDays": 4,
      "tags": ["UI", "搜索", "热力图", "体验"],
      "attentionCount": 1
    },
    {
      "name": "Data Pipeline",
      "category": "工程研发",
      "count": 3,
      "latestDate": "2026-06-07",
      "firstDate": "2026-05-30",
      "activeDays": 3,
      "tags": ["数据", "自动化", "性能"],
      "attentionCount": 1
    },
    {
      "name": "Insight Report",
      "category": "数据分析",
      "count": 3,
      "latestDate": "2026-06-05",
      "firstDate": "2026-05-28",
      "activeDays": 3,
      "tags": ["数据", "复盘", "文档"],
      "attentionCount": 1
    },
    {
      "name": "Release Notes",
      "category": "运营复盘",
      "count": 2,
      "latestDate": "2026-06-03",
      "firstDate": "2026-05-31",
      "activeDays": 2,
      "tags": ["发布", "文档", "复盘"],
      "attentionCount": 0
    }
  ],
  "days": [
    { "date": "2026-06-08", "count": 2, "projects": ["Dashboard UX", "Data Pipeline"], "categories": ["产品设计", "工程研发"], "bulletCount": 18 },
    { "date": "2026-06-07", "count": 1, "projects": ["Data Pipeline"], "categories": ["工程研发"], "bulletCount": 12 },
    { "date": "2026-06-05", "count": 1, "projects": ["Insight Report"], "categories": ["数据分析"], "bulletCount": 9 },
    { "date": "2026-06-03", "count": 2, "projects": ["Dashboard UX", "Release Notes"], "categories": ["产品设计", "运营复盘"], "bulletCount": 15 },
    { "date": "2026-06-01", "count": 1, "projects": ["Dashboard UX"], "categories": ["产品设计"], "bulletCount": 7 },
    { "date": "2026-05-31", "count": 1, "projects": ["Release Notes"], "categories": ["运营复盘"], "bulletCount": 6 },
    { "date": "2026-05-30", "count": 1, "projects": ["Data Pipeline"], "categories": ["工程研发"], "bulletCount": 8 },
    { "date": "2026-05-29", "count": 1, "projects": ["Dashboard UX"], "categories": ["产品设计"], "bulletCount": 10 },
    { "date": "2026-05-28", "count": 1, "projects": ["Insight Report"], "categories": ["数据分析"], "bulletCount": 8 },
    { "date": "2026-05-27", "count": 1, "projects": ["Insight Report"], "categories": ["数据分析"], "bulletCount": 6 }
  ],
  "records": [
    {
      "id": "demo-dashboard-2026-06-08-a",
      "repo": "Dashboard UX",
      "date": "2026-06-08",
      "title": "搜索结果面板与命中摘要优化",
      "summary": "将搜索结果从单纯过滤升级为可浏览的命中面板，支持摘要高亮和快速定位。",
      "category": "产品设计",
      "status": "已完成",
      "tags": ["UI", "搜索", "体验"],
      "sections": [
        { "title": "搜索体验", "summary": "补充命中卡片、摘要高亮和结果计数。", "bulletCount": 4 },
        { "title": "交互验证", "summary": "检查关键词、日期和项目组合下的显示状态。", "bulletCount": 3 }
      ],
      "outputs": ["demo://dashboard/search-panel", "demo://dashboard/highlight"],
      "bulletCount": 7,
      "sectionCount": 2,
      "path": "demo://records/dashboard-ux/2026-06-08-a",
      "relativePath": "demo/dashboard-ux/2026-06-08-a.md",
      "size": 1280,
      "lastModified": "2026-06-08 12:30:00",
      "text": "## 搜索体验\n- 补充命中卡片、摘要高亮和结果计数。\n- 点击搜索结果可打开右侧详情。\n\n## 交互验证\n- 检查关键词、日期和项目组合下的显示状态。"
    },
    {
      "id": "demo-pipeline-2026-06-08-a",
      "repo": "Data Pipeline",
      "date": "2026-06-08",
      "title": "数据生成链路巡检",
      "summary": "梳理示例数据结构，确认统计、项目、日期与记录字段能驱动页面完整渲染。",
      "category": "工程研发",
      "status": "记录",
      "tags": ["数据", "自动化", "验证"],
      "sections": [
        { "title": "字段检查", "summary": "确认统计卡、热力图和时间线依赖字段齐全。", "bulletCount": 3 },
        { "title": "数据更新", "summary": "使用静态示例数据替代真实记录。", "bulletCount": 2 }
      ],
      "outputs": ["demo://sample/schema", "demo://sample/payload"],
      "bulletCount": 5,
      "sectionCount": 2,
      "path": "demo://records/data-pipeline/2026-06-08-a",
      "relativePath": "demo/data-pipeline/2026-06-08-a.md",
      "size": 1040,
      "lastModified": "2026-06-08 12:10:00",
      "text": "## 字段检查\n- 确认统计卡、热力图和时间线依赖字段齐全。\n\n## 数据更新\n- 使用静态示例数据替代真实记录。"
    },
    {
      "id": "demo-pipeline-2026-06-07-a",
      "repo": "Data Pipeline",
      "date": "2026-06-07",
      "title": "刷新策略与缓存检查",
      "summary": "检查静态数据文件加载和前端刷新状态，确保页面在普通静态托管环境可访问。",
      "category": "工程研发",
      "status": "需要关注",
      "tags": ["性能", "数据", "发布"],
      "sections": [
        { "title": "缓存策略", "summary": "避免静态数据更新后浏览器长期读取旧版本。", "bulletCount": 4 },
        { "title": "托管兼容", "summary": "验证普通静态服务器能够加载页面资源。", "bulletCount": 3 }
      ],
      "outputs": ["demo://release/static-hosting"],
      "bulletCount": 7,
      "sectionCount": 2,
      "path": "demo://records/data-pipeline/2026-06-07-a",
      "relativePath": "demo/data-pipeline/2026-06-07-a.md",
      "size": 1188,
      "lastModified": "2026-06-07 18:00:00",
      "text": "## 缓存策略\n- 避免静态数据更新后浏览器长期读取旧版本。\n\n## 托管兼容\n- 验证普通静态服务器能够加载页面资源。"
    },
    {
      "id": "demo-insight-2026-06-05-a",
      "repo": "Insight Report",
      "date": "2026-06-05",
      "title": "主题词图统计口径复核",
      "summary": "围绕标题、摘要、标签和章节标题统计主题热度，减少无意义词语干扰。",
      "category": "数据分析",
      "status": "已完成",
      "tags": ["数据", "热力图", "复盘"],
      "sections": [
        { "title": "主题抽取", "summary": "优先使用标签并补充正文中的关键主题。", "bulletCount": 3 },
        { "title": "词频展示", "summary": "用字号和色彩表达词频强弱。", "bulletCount": 3 }
      ],
      "outputs": ["demo://insight/word-heat"],
      "bulletCount": 6,
      "sectionCount": 2,
      "path": "demo://records/insight-report/2026-06-05-a",
      "relativePath": "demo/insight-report/2026-06-05-a.md",
      "size": 1120,
      "lastModified": "2026-06-05 19:10:00",
      "text": "## 主题抽取\n- 优先使用标签并补充正文中的关键主题。\n\n## 词频展示\n- 用字号和色彩表达词频强弱。"
    },
    {
      "id": "demo-dashboard-2026-06-03-a",
      "repo": "Dashboard UX",
      "date": "2026-06-03",
      "title": "右侧详情栏拖拽范围扩大",
      "summary": "扩大详情栏宽度范围，让长摘要、章节和输出列表有更舒适的阅读空间。",
      "category": "产品设计",
      "status": "已完成",
      "tags": ["UI", "体验", "性能"],
      "sections": [
        { "title": "布局调整", "summary": "详情栏最大宽度随视口动态计算。", "bulletCount": 2 },
        { "title": "阅读体验", "summary": "保留主内容区最小可读宽度。", "bulletCount": 2 }
      ],
      "outputs": ["demo://dashboard/detail-panel"],
      "bulletCount": 4,
      "sectionCount": 2,
      "path": "demo://records/dashboard-ux/2026-06-03-a",
      "relativePath": "demo/dashboard-ux/2026-06-03-a.md",
      "size": 990,
      "lastModified": "2026-06-03 16:40:00",
      "text": "## 布局调整\n- 详情栏最大宽度随视口动态计算。\n\n## 阅读体验\n- 保留主内容区最小可读宽度。"
    },
    {
      "id": "demo-release-2026-06-03-a",
      "repo": "Release Notes",
      "date": "2026-06-03",
      "title": "发布说明结构整理",
      "summary": "将发布内容拆分为功能更新、验证记录和后续事项，便于复盘。",
      "category": "运营复盘",
      "status": "记录",
      "tags": ["发布", "文档", "复盘"],
      "sections": [
        { "title": "功能更新", "summary": "记录主要交互与数据展示变化。", "bulletCount": 3 },
        { "title": "验证记录", "summary": "记录语法检查和页面访问验证。", "bulletCount": 2 }
      ],
      "outputs": ["demo://release/notes"],
      "bulletCount": 5,
      "sectionCount": 2,
      "path": "demo://records/release-notes/2026-06-03-a",
      "relativePath": "demo/release-notes/2026-06-03-a.md",
      "size": 900,
      "lastModified": "2026-06-03 12:20:00",
      "text": "## 功能更新\n- 记录主要交互与数据展示变化。\n\n## 验证记录\n- 记录语法检查和页面访问验证。"
    },
    {
      "id": "demo-dashboard-2026-06-01-a",
      "repo": "Dashboard UX",
      "date": "2026-06-01",
      "title": "滚轮滚动体验优化",
      "summary": "为传统鼠标滚轮增加缓动滚动，保留触控板原生细粒度滚动。",
      "category": "产品设计",
      "status": "需要关注",
      "tags": ["体验", "性能", "UI"],
      "sections": [
        { "title": "滚动策略", "summary": "仅接管大步进滚轮，避免破坏触控板体验。", "bulletCount": 3 },
        { "title": "容器处理", "summary": "详情栏和项目列表优先在自身容器内滚动。", "bulletCount": 2 }
      ],
      "outputs": ["demo://dashboard/smooth-wheel"],
      "bulletCount": 5,
      "sectionCount": 2,
      "path": "demo://records/dashboard-ux/2026-06-01-a",
      "relativePath": "demo/dashboard-ux/2026-06-01-a.md",
      "size": 1024,
      "lastModified": "2026-06-01 11:30:00",
      "text": "## 滚动策略\n- 仅接管大步进滚轮，避免破坏触控板体验。\n\n## 容器处理\n- 详情栏和项目列表优先在自身容器内滚动。"
    },
    {
      "id": "demo-release-2026-05-31-a",
      "repo": "Release Notes",
      "date": "2026-05-31",
      "title": "公开演示数据脱敏",
      "summary": "用虚构项目、虚构路径和示例正文替代真实工作记录。",
      "category": "运营复盘",
      "status": "已完成",
      "tags": ["发布", "文档", "数据"],
      "sections": [
        { "title": "脱敏原则", "summary": "公开版本只包含示例数据，不包含真实记录。", "bulletCount": 3 },
        { "title": "检查范围", "summary": "检查路径、邮箱、姓名和真实项目名。", "bulletCount": 3 }
      ],
      "outputs": ["demo://release/privacy-check"],
      "bulletCount": 6,
      "sectionCount": 2,
      "path": "demo://records/release-notes/2026-05-31-a",
      "relativePath": "demo/release-notes/2026-05-31-a.md",
      "size": 960,
      "lastModified": "2026-05-31 10:05:00",
      "text": "## 脱敏原则\n- 公开版本只包含示例数据，不包含真实记录。\n\n## 检查范围\n- 检查路径、邮箱、姓名和真实项目名。"
    },
    {
      "id": "demo-pipeline-2026-05-30-a",
      "repo": "Data Pipeline",
      "date": "2026-05-30",
      "title": "统计卡片数据联调",
      "summary": "确认记录数、项目数、活跃日期和产物数量能随数据源变化。",
      "category": "工程研发",
      "status": "记录",
      "tags": ["数据", "自动化", "验证"],
      "sections": [
        { "title": "统计映射", "summary": "检查 stats 字段到卡片的映射关系。", "bulletCount": 2 },
        { "title": "异常兜底", "summary": "空数组时页面保持可浏览。", "bulletCount": 2 }
      ],
      "outputs": ["demo://sample/stats"],
      "bulletCount": 4,
      "sectionCount": 2,
      "path": "demo://records/data-pipeline/2026-05-30-a",
      "relativePath": "demo/data-pipeline/2026-05-30-a.md",
      "size": 940,
      "lastModified": "2026-05-30 15:00:00",
      "text": "## 统计映射\n- 检查 stats 字段到卡片的映射关系。\n\n## 异常兜底\n- 空数组时页面保持可浏览。"
    },
    {
      "id": "demo-dashboard-2026-05-29-a",
      "repo": "Dashboard UX",
      "date": "2026-05-29",
      "title": "时间热力图视觉升级",
      "summary": "将活跃度改为 GitHub 风格日历热力图，强化活跃日期和强度对比。",
      "category": "产品设计",
      "status": "已完成",
      "tags": ["热力图", "UI", "体验"],
      "sections": [
        { "title": "视觉表达", "summary": "使用灰色空白格和绿色阶梯表达活跃强度。", "bulletCount": 3 },
        { "title": "交互说明", "summary": "悬停显示当日记录数量。", "bulletCount": 2 }
      ],
      "outputs": ["demo://dashboard/activity-heatmap"],
      "bulletCount": 5,
      "sectionCount": 2,
      "path": "demo://records/dashboard-ux/2026-05-29-a",
      "relativePath": "demo/dashboard-ux/2026-05-29-a.md",
      "size": 1030,
      "lastModified": "2026-05-29 18:10:00",
      "text": "## 视觉表达\n- 使用灰色空白格和绿色阶梯表达活跃强度。\n\n## 交互说明\n- 悬停显示当日记录数量。"
    },
    {
      "id": "demo-insight-2026-05-28-a",
      "repo": "Insight Report",
      "date": "2026-05-28",
      "title": "时间线分组口径复盘",
      "summary": "按日期倒序聚合记录，并在分组中展示项目数量和日志数量。",
      "category": "数据分析",
      "status": "已完成",
      "tags": ["数据", "复盘", "文档"],
      "sections": [
        { "title": "分组逻辑", "summary": "同一天的多条记录集中展示。", "bulletCount": 2 },
        { "title": "阅读顺序", "summary": "最新日期优先，减少查找成本。", "bulletCount": 2 }
      ],
      "outputs": ["demo://insight/timeline"],
      "bulletCount": 4,
      "sectionCount": 2,
      "path": "demo://records/insight-report/2026-05-28-a",
      "relativePath": "demo/insight-report/2026-05-28-a.md",
      "size": 930,
      "lastModified": "2026-05-28 14:10:00",
      "text": "## 分组逻辑\n- 同一天的多条记录集中展示。\n\n## 阅读顺序\n- 最新日期优先，减少查找成本。"
    },
    {
      "id": "demo-insight-2026-05-27-a",
      "repo": "Insight Report",
      "date": "2026-05-27",
      "title": "详情面板信息架构梳理",
      "summary": "把摘要、标签、章节结构、输出项和原文预览集中到右侧面板。",
      "category": "数据分析",
      "status": "记录",
      "tags": ["文档", "复盘", "UI"],
      "sections": [
        { "title": "面板结构", "summary": "优先展示摘要和标签，再展示结构化详情。", "bulletCount": 3 },
        { "title": "路径展示", "summary": "示例版使用虚构链接，不包含本机路径。", "bulletCount": 2 }
      ],
      "outputs": ["demo://insight/detail-panel"],
      "bulletCount": 5,
      "sectionCount": 2,
      "path": "demo://records/insight-report/2026-05-27-a",
      "relativePath": "demo/insight-report/2026-05-27-a.md",
      "size": 960,
      "lastModified": "2026-05-27 17:35:00",
      "text": "## 面板结构\n- 优先展示摘要和标签，再展示结构化详情。\n\n## 路径展示\n- 示例版使用虚构链接，不包含本机路径。"
    }
  ]
};
