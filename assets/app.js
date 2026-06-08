const emptyData = {
  stats: { recordCount: 0, projectCount: 0, dayCount: 0, outputCount: 0, attentionCount: 0 },
  projects: [],
  days: [],
  categories: [],
  tags: [],
  records: [],
};

let data = normalizeData(window.WORKLOG_DATA);
let searchIndex = buildSearchIndex(data);
let dataSignature = getDataSignature(data);
let liveTimer = null;

const state = {
  query: '',
  category: 'all',
  project: 'all',
  tag: 'all',
  status: 'all',
  activeId: data.records[0]?.id || null,
  filtered: [],
};

const el = {
  categoryList: document.getElementById('categoryList'),
  projectList: document.getElementById('projectList'),
  tagList: document.getElementById('tagList'),
  searchInput: document.getElementById('searchInput'),
  statusFilter: document.getElementById('statusFilter'),
  resetButton: document.getElementById('resetButton'),
  liveStatus: document.getElementById('liveStatus'),
  liveStatusText: document.getElementById('liveStatusText'),
  leftResizeHandle: document.getElementById('leftResizeHandle'),
  rightResizeHandle: document.getElementById('rightResizeHandle'),
  detailBackdrop: document.getElementById('detailBackdrop'),
  detailClose: document.getElementById('detailClose'),
  generatedMeta: document.getElementById('generatedMeta'),
  statGrid: document.getElementById('statGrid'),
  searchPanel: document.getElementById('searchPanel'),
  searchMeta: document.getElementById('searchMeta'),
  searchCount: document.getElementById('searchCount'),
  searchResults: document.getElementById('searchResults'),
  activityMeta: document.getElementById('activityMeta'),
  activityStrip: document.getElementById('activityStrip'),
  wordHeatMeta: document.getElementById('wordHeatMeta'),
  wordHeatCount: document.getElementById('wordHeatCount'),
  wordHeatCloud: document.getElementById('wordHeatCloud'),
  resultCount: document.getElementById('resultCount'),
  timeline: document.getElementById('timeline'),
  detailContent: document.getElementById('detailContent'),
};

const heatStopWords = new Set([
  '工作',
  '日志',
  '记录',
  '处理',
  '问题',
  '输出',
  '验证',
  '时间',
  '用户',
  '进行',
  '当前',
  '文件',
  '路径',
  '根据',
  '确认',
  '新增',
  '修正',
  '更新',
  '完成',
  '本地',
  '使用',
  '通过',
  '以及',
  '当前',
  '功能',
  '页面',
  '显示',
  'the',
  'and',
  'for',
  'with',
  'from',
  'this',
  'that',
]);

const heatKeyTerms = [
  '热力图',
  '热力词图',
  '时间线',
  '工作台',
  '智能体',
  '搜索',
  '筛选',
  '项目',
  '分类',
  '详情',
  '章节',
  '产物',
  '原文',
  '动画',
  '实时',
  '监听',
  '数据生成',
  'GitHub',
  'PowerShell',
  'Python',
  'UI',
  'PPT',
  'PDF',
  'OCR',
  'CVAT',
  'curve',
  'chart',
];

function normalizeData(value) {
  return {
    ...emptyData,
    ...(value || {}),
    stats: { ...emptyData.stats, ...((value || {}).stats || {}) },
    projects: Array.isArray(value?.projects) ? value.projects : [],
    days: Array.isArray(value?.days) ? value.days : [],
    categories: Array.isArray(value?.categories) ? value.categories : [],
    tags: Array.isArray(value?.tags) ? value.tags : [],
    records: Array.isArray(value?.records) ? value.records : [],
  };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function compactDate(date) {
  const [, month, day] = date.match(/^\d{4}-(\d{2})-(\d{2})$/) || [];
  return month && day ? `${month}.${day}` : date;
}

function parseDate(date) {
  return new Date(`${date}T00:00:00`);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date, offset) {
  const next = new Date(date);
  next.setDate(next.getDate() + offset);
  return next;
}

function getStatusClass(status) {
  if (status === '已完成') return 'done';
  if (status === '需要关注') return 'attention';
  return 'record';
}

function getRecordSearchText(record) {
  return [
    record.repo,
    record.date,
    record.title,
    record.summary,
    record.category,
    record.status,
    ...(record.tags || []),
    ...(record.outputs || []),
    record.text,
  ].join('\n').toLowerCase();
}

function buildSearchIndex(source) {
  return new Map(source.records.map((record) => [record.id, getRecordSearchText(record)]));
}

function getQueryTerms(query = state.query) {
  return String(query || '')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function highlightText(value, terms) {
  const text = String(value ?? '');
  const cleanTerms = [...new Set((terms || []).filter(Boolean))].sort((a, b) => b.length - a.length);
  if (!text || !cleanTerms.length) return escapeHtml(text);

  const lowerText = text.toLowerCase();
  const ranges = [];
  cleanTerms.forEach((term) => {
    let from = 0;
    const needle = term.toLowerCase();
    while (needle && from < lowerText.length) {
      const index = lowerText.indexOf(needle, from);
      if (index === -1) break;
      const next = index + needle.length;
      const overlaps = ranges.some(([start, end]) => index < end && next > start);
      if (!overlaps) ranges.push([index, next]);
      from = next;
    }
  });

  if (!ranges.length) return escapeHtml(text);
  ranges.sort((a, b) => a[0] - b[0]);

  let html = '';
  let cursor = 0;
  ranges.forEach(([start, end]) => {
    html += escapeHtml(text.slice(cursor, start));
    html += `<mark>${escapeHtml(text.slice(start, end))}</mark>`;
    cursor = end;
  });
  html += escapeHtml(text.slice(cursor));
  return html;
}

function getSearchSnippet(record, terms) {
  const source = [
    record.repo,
    record.date,
    record.title,
    record.summary,
    (record.tags || []).join(' '),
    (record.outputs || []).join(' '),
    record.text,
  ]
    .filter(Boolean)
    .join('\n')
    .replace(/\s+/g, ' ')
    .trim();

  if (!source) return '该日志暂无可搜索摘要。';
  const lowerSource = source.toLowerCase();
  const firstHit = terms
    .map((term) => lowerSource.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (firstHit === undefined) {
    return (record.summary || source).slice(0, 150);
  }

  const start = Math.max(0, firstHit - 56);
  const end = Math.min(source.length, firstHit + 116);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < source.length ? '...' : '';
  return `${prefix}${source.slice(start, end)}${suffix}`;
}

function getDataSignature(source) {
  const stats = source.stats || {};
  return [
    source.generatedAt || '',
    stats.recordCount || 0,
    stats.projectCount || 0,
    stats.dayCount || 0,
    stats.outputCount || 0,
    source.records?.[0]?.id || '',
    source.records?.[0]?.lastModified || '',
  ].join('|');
}

function renderStats() {
  const stats = [
    ['日志记录', data.stats.recordCount, '按日期日志文件聚合', 'blue'],
    ['项目数量', data.stats.projectCount, '来自一级工作目录', 'teal'],
    ['活跃日期', data.stats.dayCount, '覆盖本地时间线', 'violet'],
    ['产物路径', data.stats.outputCount, '自动识别输出文件', 'amber'],
  ];

  el.generatedMeta.textContent = `按项目、时间和产物组织工作记录。数据生成于 ${data.generatedAt || '未知时间'}，来源 ${data.root || '示例数据集'}。`;
  el.statGrid.innerHTML = stats
    .map(
      ([label, value, note, tone], index) => `
        <div class="stat-card tone-${tone}" style="--i:${index}">
          <div class="stat-topline">
            <div class="stat-label">${escapeHtml(label)}</div>
            <div class="stat-icon" aria-hidden="true"></div>
          </div>
          <div class="stat-value">${escapeHtml(value)}</div>
          <div class="stat-note">${escapeHtml(note)}</div>
        </div>
      `,
    )
    .join('');
}

function renderFilters() {
  const categoryCounts = new Map();
  data.records.forEach((record) => {
    categoryCounts.set(record.category, (categoryCounts.get(record.category) || 0) + 1);
  });

  const categories = [
    { name: 'all', label: '全部分类', count: data.records.length },
    ...data.categories.map((category) => ({
      name: category,
      label: category,
      count: categoryCounts.get(category) || 0,
    })),
  ];

  el.categoryList.innerHTML = categories
    .map(
      (item) => `
        <button class="nav-item ${state.category === item.name ? 'active' : ''}" data-filter="category" data-value="${escapeHtml(item.name)}" type="button">
          <span class="nav-label">${escapeHtml(item.label)}</span>
          <span class="nav-count">${escapeHtml(item.count)}</span>
        </button>
      `,
    )
    .join('');

  const projects = [
    { name: 'all', category: '所有项目', count: data.records.length, latestDate: '全部日期' },
    ...data.projects,
  ];

  el.projectList.innerHTML = projects
    .map(
      (project) => `
        <button class="project-item ${state.project === project.name ? 'active' : ''}" data-filter="project" data-value="${escapeHtml(project.name)}" type="button">
          <span>
            <span class="project-name">${escapeHtml(project.name === 'all' ? '全部项目' : project.name)}</span>
            <span class="project-meta">${escapeHtml(project.category)} · ${escapeHtml(project.latestDate)}</span>
          </span>
          <span class="project-count">${escapeHtml(project.count)}</span>
        </button>
      `,
    )
    .join('');

  const tags = [
    { name: 'all', label: '全部' },
    ...data.tags.slice(0, 20).map((tag) => ({ name: tag, label: tag })),
  ];

  el.tagList.innerHTML = tags
    .map(
      (tag) => `
        <button class="tag-chip ${state.tag === tag.name ? 'active' : ''}" data-filter="tag" data-value="${escapeHtml(tag.name)}" type="button">
          ${escapeHtml(tag.label)}
        </button>
      `,
    )
    .join('');
}

function getBaseFilteredRecords() {
  return data.records.filter((record) => {
    if (state.category !== 'all' && record.category !== state.category) return false;
    if (state.project !== 'all' && record.repo !== state.project) return false;
    if (state.tag !== 'all' && !(record.tags || []).includes(state.tag)) return false;
    if (state.status !== 'all' && record.status !== state.status) return false;
    return true;
  });
}

function applySearch(records) {
  const terms = getQueryTerms();
  if (!terms.length) return records;
  return records.filter((record) => {
    const searchable = searchIndex.get(record.id) || '';
    return terms.every((term) => searchable.includes(term));
  });
}

function getFilteredRecords() {
  return applySearch(getBaseFilteredRecords());
}

function renderActivity(baseRecords, resultRecords = baseRecords) {
  const baseCounts = new Map();
  const totalCounts = new Map();
  const matchedDates = new Set(resultRecords.map((record) => record.date));
  const queryActive = getQueryTerms().length > 0;
  const hasSearchHits = queryActive && resultRecords.length > 0;
  baseRecords.forEach((record) => baseCounts.set(record.date, (baseCounts.get(record.date) || 0) + 1));
  data.days.forEach((day) => totalCounts.set(day.date, day.count));

  // 热力窗口跟随当前结构筛选范围，避免老项目因全局最新日期偏移而显示为空。
  const latestDate =
    baseRecords.map((record) => record.date).sort((a, b) => b.localeCompare(a))[0] ||
    data.days[0]?.date ||
    formatDate(new Date());
  const last = parseDate(latestDate);
  const windowLength = 182;
  const days = Array.from({ length: windowLength }, (_, index) => {
    const date = addDays(last, index - (windowLength - 1));
    const iso = formatDate(date);
    return {
      date: iso,
      day: date.getDate(),
      weekday: '日一二三四五六'[date.getDay()],
      baseCount: baseCounts.get(iso) || 0,
      matchedCount: hasSearchHits && matchedDates.has(iso) ? resultRecords.filter((record) => record.date === iso).length : 0,
      totalCount: totalCounts.get(iso) || 0,
    };
  });
  const max = Math.max(1, ...days.map((day) => day.baseCount));
  const activeDays = days.filter((day) => day.baseCount > 0).length;
  const visibleTotal = days.reduce((sum, day) => sum + day.baseCount, 0);
  const matchedTotal = days.reduce((sum, day) => sum + day.matchedCount, 0);
  const peak = days.reduce((best, day) => (day.baseCount > best.baseCount ? day : best), days[0]);
  const weekCount = Math.ceil(days.length / 7);
  const weekLabels = Array.from({ length: weekCount }, (_, weekIndex) => {
    const weekDays = days.slice(weekIndex * 7, weekIndex * 7 + 7);
    const monthChanged = weekIndex === 0 || weekDays.some((day) => day.day <= 7);
    if (!monthChanged) return '';
    const labelDay = weekDays.find((day) => day.day <= 7) || weekDays[0];
    const month = parseDate(labelDay.date).getMonth() + 1;
    return `${month}月`;
  });

  el.activityMeta.textContent = queryActive
    ? `${days[0].date} 至 ${days[days.length - 1].date} · 搜索命中 ${matchedTotal} / 当前筛选 ${visibleTotal}`
    : `${days[0].date} 至 ${days[days.length - 1].date}`;

  el.activityStrip.innerHTML = `
    <div class="activity-insight">
      <div class="activity-kpi">
        <span>半年记录</span>
        <strong>${escapeHtml(visibleTotal)}</strong>
      </div>
      <div class="activity-kpi">
        <span>活跃日期</span>
        <strong>${escapeHtml(activeDays)}</strong>
      </div>
      <div class="activity-kpi">
        <span>峰值日期</span>
        <strong>${escapeHtml(compactDate(peak.date))}</strong>
      </div>
      <div class="activity-legend" aria-hidden="true">
        <em>少</em><span></span><span></span><span></span><span></span><span></span><em>多</em>
      </div>
    </div>
    <div class="activity-calendar" style="--weeks:${weekCount}">
      <div class="activity-months">
        ${weekLabels.map((label) => `<span>${escapeHtml(label)}</span>`).join('')}
      </div>
      <div class="activity-body">
        <div class="weekday-rail" aria-hidden="true">
          ${'日一二三四五六'.split('').map((day) => `<span>${day}</span>`).join('')}
        </div>
        <div class="activity-grid">
          ${days
            .map((day, index) => {
              const level = day.baseCount === 0 ? 0 : Math.min(4, Math.ceil((day.baseCount / max) * 4));
              const mutedBySearch = hasSearchHits && day.baseCount > 0 && !matchedDates.has(day.date);
              const mutedByStructure = !hasSearchHits && day.totalCount > 0 && day.baseCount === 0;
              const muted = mutedBySearch || mutedByStructure ? 'muted-by-filter' : '';
              const label = queryActive
                ? `${day.date}，搜索命中 ${day.matchedCount} 条，当前筛选 ${day.baseCount} 条，全部 ${day.totalCount} 条`
                : `${day.date}，当前筛选 ${day.baseCount} 条，全部 ${day.totalCount} 条`;
              return `
                <button class="activity-cell ${muted}" data-filter="date" data-value="${escapeHtml(day.date)}" data-level="${level}" style="--i:${index}" type="button" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">
                  <span class="sr-only">${escapeHtml(label)}</span>
                </button>
              `;
            })
            .join('')}
        </div>
      </div>
    </div>
  `;
}

function renderSearchPanel(records, baseRecords) {
  const terms = getQueryTerms();
  const query = state.query.trim();
  el.searchPanel.hidden = !terms.length;
  if (!terms.length) {
    el.searchResults.innerHTML = '';
    el.searchCount.textContent = '0 条命中';
    el.searchMeta.textContent = '输入关键词后显示匹配日志';
    return;
  }

  el.searchMeta.textContent = `在当前结构筛选的 ${baseRecords.length} 条记录中搜索 “${query}”`;
  el.searchCount.textContent = `${records.length} 条命中`;

  if (!records.length) {
    el.searchResults.innerHTML = '<div class="empty-state">没有找到匹配日志。热力图仍保留当前项目或分类的历史活跃度。</div>';
    return;
  }

  el.searchResults.innerHTML = records
    .slice(0, 10)
    .map((record, index) => {
      const snippet = getSearchSnippet(record, terms);
      return `
        <button class="search-result" data-record-id="${escapeHtml(record.id)}" type="button" style="--i:${index}">
          <div class="search-result-title">${highlightText(record.title, terms)}</div>
          <div class="search-result-meta">${escapeHtml(record.repo)} · ${escapeHtml(record.date)} · ${escapeHtml(record.category)}</div>
          <div class="search-result-snippet">${highlightText(snippet, terms)}</div>
        </button>
      `;
    })
    .join('');
}

function collectWordHeat(records) {
  const counts = new Map();

  const addTerm = (term, weight = 1) => {
    const word = String(term || '').trim();
    if (!word) return;
    const lower = word.toLowerCase();
    if (heatStopWords.has(word) || heatStopWords.has(lower)) return;
    if (/^\d+$/.test(word) || /^\d{4}[-./]\d{2}[-./]\d{2}$/.test(word)) return;
    if (word.length < 2 && !/^[A-Z]{2,}$/.test(word)) return;
    counts.set(word, (counts.get(word) || 0) + weight);
  };

  const addText = (text, weight = 1) => {
    const source = String(text || '');
    if (!source) return;

    heatKeyTerms.forEach((term) => {
      if (source.toLowerCase().includes(term.toLowerCase())) addTerm(term, weight + 1);
    });

    source
      .replace(/[^\u4e00-\u9fffA-Za-z0-9+#._-]+/g, ' ')
      .split(/\s+/)
      .forEach((token) => {
        if (!token) return;
        if (/^[\u4e00-\u9fff]+$/.test(token)) {
          if (token.length <= 6) {
            addTerm(token, weight);
          }
          return;
        }
        addTerm(token, weight);
      });
  };

  records.forEach((record) => {
    (record.tags || []).forEach((tag) => addTerm(tag, 4));
    addText(record.repo, 2);
    addText(record.title, 3);
    addText(record.summary, 2);
    (record.sections || []).forEach((section) => {
      addText(section.title, 2);
      addText(section.summary, 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-Hans-CN'))
    .slice(0, 30)
    .map(([word, count]) => ({ word, count }));
}

function renderWordHeat(records, options = {}) {
  const words = collectWordHeat(records);
  el.wordHeatCount.textContent = `${words.length} 个词`;
  el.wordHeatMeta.textContent = options.fallback
    ? `搜索暂无命中，显示当前筛选 ${records.length} 条记录的主题热度`
    : `按当前结果 ${records.length} 条记录统计高频主题`;

  if (!words.length) {
    el.wordHeatCloud.innerHTML = '<div class="empty-state">暂无可统计的主题词。</div>';
    return;
  }

  const max = Math.max(1, ...words.map((item) => item.count));
  el.wordHeatCloud.innerHTML = words
    .map((item) => {
      const heat = Math.max(0.08, item.count / max).toFixed(3);
      return `
        <button class="wordheat-token" data-word-query="${escapeHtml(item.word)}" type="button" style="--heat:${heat}">
          ${escapeHtml(item.word)}<small>${escapeHtml(item.count)}</small>
        </button>
      `;
    })
    .join('');
}

function groupByDate(records) {
  return records.reduce((acc, record) => {
    if (!acc.has(record.date)) acc.set(record.date, []);
    acc.get(record.date).push(record);
    return acc;
  }, new Map());
}

function renderTimeline(records) {
  state.filtered = records;
  el.resultCount.textContent = `${records.length} 条记录`;

  if (!records.length) {
    el.timeline.innerHTML = '<div class="empty-state">没有匹配的日志。调整搜索词或筛选条件后再查看。</div>';
    renderDetail(null);
    return;
  }

  if (!records.some((record) => record.id === state.activeId)) {
    state.activeId = records[0].id;
  }

  const groups = Array.from(groupByDate(records).entries()).sort((a, b) => b[0].localeCompare(a[0]));

  el.timeline.innerHTML = groups
    .map(([date, items]) => {
      const projects = [...new Set(items.map((item) => item.repo))];
      return `
        <div class="day-group">
          <div class="day-stamp">
            <strong>${escapeHtml(compactDate(date))}</strong>
            <span>${escapeHtml(projects.length)} 个项目 · ${escapeHtml(items.length)} 条</span>
          </div>
          <div class="day-records">
            ${items.map(renderRecordCard).join('')}
          </div>
        </div>
      `;
    })
    .join('');

  renderDetail(records.find((record) => record.id === state.activeId) || records[0]);
}

function renderRecordCard(record) {
  const tags = (record.tags || []).slice(0, 4);
  return `
    <button class="timeline-card ${record.id === state.activeId ? 'active' : ''}" data-record-id="${escapeHtml(record.id)}" type="button">
      <div class="card-topline">
        <span class="repo-pill">${escapeHtml(record.repo)}</span>
        <span class="category-pill">${escapeHtml(record.category)}</span>
        <span class="status-pill ${getStatusClass(record.status)}">${escapeHtml(record.status)}</span>
        ${tags.map((tag) => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join('')}
      </div>
      <h2 class="timeline-title">${escapeHtml(record.title)}</h2>
      <p class="timeline-summary">${escapeHtml(record.summary || '该日志包含结构化小节，可在右侧查看原文。')}</p>
      <div class="card-metrics">
        <span>${escapeHtml(record.date)}</span>
        <span class="metric-dot"></span>
        <span>${escapeHtml(record.sectionCount)} 个章节</span>
        <span class="metric-dot"></span>
        <span>${escapeHtml(record.bulletCount)} 条要点</span>
        <span class="metric-dot"></span>
        <span>${escapeHtml((record.outputs || []).length)} 个产物</span>
      </div>
    </button>
  `;
}

function renderDetail(record) {
  if (!record) {
    el.detailContent.innerHTML = `
      <div class="detail-empty">
        <div>
          <strong>没有可预览的日志</strong>
          <div class="detail-muted">请调整筛选条件。</div>
        </div>
      </div>
    `;
    return;
  }

  const sections = (record.sections || []).slice(0, 12);
  const outputs = (record.outputs || []).slice(0, 10);
  const preview = markdownToHtml(record.text);

  el.detailContent.innerHTML = `
    <article class="detail-card">
      <div>
        <div class="detail-topline">
          <span class="repo-pill">${escapeHtml(record.repo)}</span>
          <span class="status-pill ${getStatusClass(record.status)}">${escapeHtml(record.status)}</span>
        </div>
        <h2 class="detail-title">${escapeHtml(record.title)}</h2>
      </div>
      <p class="detail-summary">${escapeHtml(record.summary || '该日志暂无自动摘要。')}</p>
      <div class="detail-actions">
        <div class="path-field" title="${escapeHtml(record.path)}">${escapeHtml(record.path)}</div>
        <button class="copy-button" type="button" data-copy="${escapeHtml(record.path)}">复制</button>
      </div>
      <div class="detail-section">
        <h3>标签</h3>
        <div class="tag-cloud">
          ${(record.tags || []).map((tag) => `<button class="tag-chip" data-filter="tag" data-value="${escapeHtml(tag)}" type="button">${escapeHtml(tag)}</button>`).join('')}
        </div>
      </div>
      <div class="detail-section">
        <h3>章节结构</h3>
        ${
          sections.length
            ? sections
                .map(
                  (section) => `
                    <div class="section-row">
                      <div class="section-row-title">${escapeHtml(section.title)}</div>
                      <div class="section-row-text">${escapeHtml(section.summary || `${section.bulletCount} 条要点`)}</div>
                    </div>
                  `,
                )
                .join('')
            : '<div class="detail-muted">未识别到二级章节。</div>'
        }
      </div>
      <div class="detail-section">
        <h3>输出产物</h3>
        ${
          outputs.length
            ? outputs
                .map(
                  (path) => `
                    <div class="output-row">
                      <span class="output-path" title="${escapeHtml(path)}">${escapeHtml(path)}</span>
                      <button class="copy-button" type="button" data-copy="${escapeHtml(path)}">复制</button>
                    </div>
                  `,
                )
                .join('')
            : '<div class="detail-muted">未在正文中识别到输出路径。</div>'
        }
      </div>
      <div class="detail-section">
        <h3>原文预览</h3>
        <div class="markdown-preview">${preview}</div>
      </div>
    </article>
  `;
}

function markdownToHtml(markdown) {
  const lines = String(markdown || '').split(/\r?\n/).slice(0, 180);
  const html = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  lines.forEach((line) => {
    if (/^\s*$/.test(line)) {
      closeList();
      return;
    }

    const h3 = line.match(/^##\s+(.+)$/);
    if (h3) {
      closeList();
      html.push(`<h3>${inlineMarkdown(h3[1])}</h3>`);
      return;
    }

    const h4 = line.match(/^###\s+(.+)$/);
    if (h4) {
      closeList();
      html.push(`<h4>${inlineMarkdown(h4[1])}</h4>`);
      return;
    }

    const item = line.match(/^\s*[-*+]\s+(.+)$/);
    if (item) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(item[1])}</li>`);
      return;
    }

    closeList();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  });

  closeList();
  return html.join('');
}

function inlineMarkdown(value) {
  return escapeHtml(value).replace(/`([^`]+)`/g, '<code>$1</code>');
}

function updateFilter(kind, value) {
  if (kind === 'date') {
    state.query = value;
    el.searchInput.value = value;
  } else {
    state[kind] = value;
  }
  render();
}

function resetFilters() {
  state.query = '';
  state.category = 'all';
  state.project = 'all';
  state.tag = 'all';
  state.status = 'all';
  el.searchInput.value = '';
  el.statusFilter.value = 'all';
  render();
}

function setLiveStatus(status, text) {
  el.liveStatus.dataset.status = status;
  el.liveStatusText.textContent = text;
}

function parseDataScript(text) {
  const match = text.match(/window\.WORKLOG_DATA\s*=\s*([\s\S]*?);\s*$/);
  if (!match) {
    throw new Error('worklog-data.js 格式不正确');
  }
  return JSON.parse(match[1]);
}

async function fetchLatestData({ silent = true } = {}) {
  if (!silent) setLiveStatus('loading', '正在刷新');
  try {
    const response = await fetch(`assets/worklog-data.js?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const nextData = normalizeData(parseDataScript(await response.text()));
    const nextSignature = getDataSignature(nextData);
    if (nextSignature !== dataSignature) {
      data = nextData;
      searchIndex = buildSearchIndex(data);
      dataSignature = nextSignature;
      if (!data.records.some((record) => record.id === state.activeId)) {
        state.activeId = data.records[0]?.id || null;
      }
      renderStats();
      render();
      setLiveStatus('updated', `已更新 ${data.generatedAt || ''}`.trim());
      window.setTimeout(() => setLiveStatus('ready', '实时监听'), 1800);
      return true;
    }
    setLiveStatus('ready', '实时监听');
    return false;
  } catch (error) {
    setLiveStatus('error', '监听中断');
    return false;
  }
}

function startLiveRefresh() {
  setLiveStatus('ready', '实时监听');
  window.addEventListener('focus', () => fetchLatestData({ silent: false }));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) fetchLatestData({ silent: true });
  });
  liveTimer = window.setInterval(() => {
    if (!document.hidden) fetchLatestData({ silent: true });
  }, 4000);
}

function setupSmoothWheelScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const active = new WeakMap();
  const isEditable = (target) => ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName || '') || target?.isContentEditable;
  const getScrollTarget = (target) => {
    const scrollable = target.closest?.('.detail-content, .project-list, .markdown-preview');
    if (scrollable && scrollable.scrollHeight > scrollable.clientHeight + 1) return scrollable;
    return document.scrollingElement || document.documentElement;
  };
  const maxScrollTop = (target) => target.scrollHeight - target.clientHeight;

  const animateTo = (target, destination) => {
    const current = active.get(target);
    if (current?.frame) window.cancelAnimationFrame(current.frame);

    const state = {
      start: target.scrollTop,
      destination: Math.max(0, Math.min(maxScrollTop(target), destination)),
      startedAt: performance.now(),
      duration: 260,
      frame: 0,
    };

    const step = (time) => {
      const progress = Math.min(1, (time - state.startedAt) / state.duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      target.scrollTop = state.start + (state.destination - state.start) * eased;
      if (progress < 1) {
        state.frame = window.requestAnimationFrame(step);
      } else {
        active.delete(target);
      }
    };

    state.frame = window.requestAnimationFrame(step);
    active.set(target, state);
  };

  window.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || isEditable(event.target)) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

    const pixelDelta = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * 36 : event.deltaY;
    if (Math.abs(pixelDelta) < 18) return;

    const target = getScrollTarget(event.target);
    const current = active.get(target);
    const base = current ? current.destination : target.scrollTop;
    const destination = base + pixelDelta * 1.15;
    const bounded = Math.max(0, Math.min(maxScrollTop(target), destination));
    if (bounded === target.scrollTop && !current) return;

    event.preventDefault();
    animateTo(target, bounded);
  }, { passive: false });
}

function setupResizableColumns() {
  const minSidebar = 220;
  const maxSidebar = 420;
  const minDetail = 300;
  const hardMaxDetail = 820;
  const minWorkspace = 420;
  const sidebarKey = 'worklog.sidebarWidth';
  const detailKey = 'worklog.detailWidth';
  const root = document.documentElement;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const isResizableViewport = () => window.innerWidth > 1240;
  const getDetailMax = () => {
    const sidebarWidth = getCssWidth('--sidebar-width', 288);
    return Math.min(hardMaxDetail, Math.max(minDetail, window.innerWidth - sidebarWidth - minWorkspace - 12));
  };
  const getCssWidth = (name, fallback) => {
    const raw = getComputedStyle(root).getPropertyValue(name).trim();
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const setWidth = (name, value, key) => {
    root.style.setProperty(name, `${Math.round(value)}px`);
    window.localStorage.setItem(key, String(Math.round(value)));
  };

  const savedSidebar = Number.parseInt(window.localStorage.getItem(sidebarKey), 10);
  const savedDetail = Number.parseInt(window.localStorage.getItem(detailKey), 10);
  if (Number.isFinite(savedSidebar)) setWidth('--sidebar-width', clamp(savedSidebar, minSidebar, maxSidebar), sidebarKey);
  if (Number.isFinite(savedDetail)) setWidth('--detail-width', clamp(savedDetail, minDetail, getDetailMax()), detailKey);

  const bindHandle = (handle, config) => {
    if (!handle) return;
    handle.addEventListener('pointerdown', (event) => {
      if (!isResizableViewport()) return;
      event.preventDefault();
      try {
        handle.setPointerCapture(event.pointerId);
      } catch (error) {
        // 合成指针事件可能没有激活指针；真实拖拽不受影响，继续使用全局 move/up 监听。
      }
      document.body.classList.add('resizing-columns');

      const startX = event.clientX;
      const startWidth = getCssWidth(config.variable, config.fallback);

      const onMove = (moveEvent) => {
        const delta = moveEvent.clientX - startX;
        const nextWidth = config.side === 'left' ? startWidth + delta : startWidth - delta;
        const max = typeof config.max === 'function' ? config.max() : config.max;
        setWidth(config.variable, clamp(nextWidth, config.min, max), config.key);
      };

      const onUp = () => {
        document.body.classList.remove('resizing-columns');
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    });
  };

  bindHandle(el.leftResizeHandle, {
    side: 'left',
    variable: '--sidebar-width',
    key: sidebarKey,
    fallback: 288,
    min: minSidebar,
    max: maxSidebar,
  });
  bindHandle(el.rightResizeHandle, {
    side: 'right',
    variable: '--detail-width',
    key: detailKey,
    fallback: 390,
    min: minDetail,
    max: getDetailMax,
  });
}

function render() {
  renderFilters();
  const baseRecords = getBaseFilteredRecords();
  const records = applySearch(baseRecords);
  const useWordFallback = getQueryTerms().length > 0 && records.length === 0 && baseRecords.length > 0;
  state.filtered = records;
  renderSearchPanel(records, baseRecords);
  renderActivity(baseRecords, records);
  renderWordHeat(useWordFallback ? baseRecords : records, { fallback: useWordFallback });
  renderTimeline(records);
}

document.addEventListener('click', (event) => {
  const wordButton = event.target.closest('[data-word-query]');
  if (wordButton) {
    state.query = wordButton.dataset.wordQuery;
    el.searchInput.value = state.query;
    render();
    el.searchInput.focus();
    return;
  }

  const filterButton = event.target.closest('[data-filter]');
  if (filterButton) {
    updateFilter(filterButton.dataset.filter, filterButton.dataset.value);
    return;
  }

  const recordButton = event.target.closest('[data-record-id]');
  if (recordButton) {
    state.activeId = recordButton.dataset.recordId;
    renderTimeline(state.filtered);
    document.body.classList.add('detail-open');
    return;
  }

  const copyButton = event.target.closest('[data-copy]');
  if (copyButton) {
    const text = copyButton.dataset.copy;
    copyText(text).then(() => {
      copyButton.textContent = '已复制';
      setTimeout(() => {
        copyButton.textContent = '复制';
      }, 1200);
    });
  }
});

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  input.remove();
  return Promise.resolve();
}

el.searchInput.addEventListener('input', (event) => {
  state.query = event.target.value;
  render();
});

el.statusFilter.addEventListener('change', (event) => {
  state.status = event.target.value;
  render();
});

el.resetButton.addEventListener('click', resetFilters);

el.detailClose.addEventListener('click', () => {
  document.body.classList.remove('detail-open');
});

el.detailBackdrop.addEventListener('click', () => {
  document.body.classList.remove('detail-open');
});

document.addEventListener('keydown', (event) => {
  const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '');
  if (event.key === '/' && !typing) {
    event.preventDefault();
    el.searchInput.focus();
    return;
  }
  if (event.key === 'Escape') {
    document.body.classList.remove('detail-open');
    el.searchInput.blur();
    return;
  }
  if (!['j', 'J', 'k', 'K', 'Enter'].includes(event.key) || typing || !state.filtered.length) return;

  const currentIndex = Math.max(0, state.filtered.findIndex((record) => record.id === state.activeId));
  if (event.key === 'j' || event.key === 'J') {
    event.preventDefault();
    state.activeId = state.filtered[Math.min(state.filtered.length - 1, currentIndex + 1)].id;
    renderTimeline(state.filtered);
  } else if (event.key === 'k' || event.key === 'K') {
    event.preventDefault();
    state.activeId = state.filtered[Math.max(0, currentIndex - 1)].id;
    renderTimeline(state.filtered);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    document.body.classList.add('detail-open');
  }
});

setupResizableColumns();
setupSmoothWheelScroll();
renderStats();
render();
startLiveRefresh();
