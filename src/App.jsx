import { useMemo, useState } from 'react'
import {
  ArrowDownRight, ArrowUpRight, BarChart3, Bell, BookOpen, BriefcaseBusiness,
  ChevronDown, CircleHelp, ClipboardList, Compass, Download, Landmark,
  LayoutDashboard, LineChart, Menu, RefreshCw, Search, Settings, ShieldAlert,
  Sparkles, WalletCards, X,
} from 'lucide-react'

const sectorRows = [
  { rank: 1, name: '半导体', change: 2.86, flow: 18.42, ratio: 8.74, stock: '寒武纪-U', hot: true },
  { rank: 2, name: '电力设备', change: 1.63, flow: 12.68, ratio: 5.19, stock: '阳光电源' },
  { rank: 3, name: '有色金属', change: 1.27, flow: 9.36, ratio: 4.28, stock: '洛阳钼业' },
  { rank: 4, name: '软件开发', change: 0.82, flow: 6.75, ratio: 3.11, stock: '金山办公' },
  { rank: 5, name: '通信设备', change: 0.71, flow: 4.26, ratio: 2.35, stock: '中际旭创' },
  { rank: 6, name: '医药生物', change: -0.36, flow: -3.88, ratio: -1.94, stock: '药明康德' },
  { rank: 7, name: '白酒', change: -0.61, flow: -5.12, ratio: -2.88, stock: '贵州茅台' },
]

const nav = [
  ['总览', LayoutDashboard], ['市场', Compass], ['持仓', WalletCards], ['风险', ShieldAlert],
  ['调仓', LineChart], ['策略', BarChart3], ['决策记录', ClipboardList],
]

function FlowValue({ value, suffix = '亿' }) {
  const up = value >= 0
  return <span className={up ? 'rise' : 'fall'}>{up ? '+' : ''}{value.toFixed(2)}{suffix}</span>
}

function MiniChart() {
  return <svg className="mini-chart" viewBox="0 0 440 168" role="img" aria-label="半导体今日主力净流入走势">
    <defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#e85b4b" stopOpacity=".22"/><stop offset="1" stopColor="#e85b4b" stopOpacity="0"/></linearGradient></defs>
    <g className="chart-grid"><path d="M0 32H440M0 78H440M0 124H440" /></g>
    <path className="chart-area" d="M0 136 C19 132 24 139 42 127 S70 119 90 124 S116 108 130 112 S151 96 170 103 S190 82 210 89 S231 68 248 78 S270 51 287 61 S309 78 325 58 S344 38 364 47 S389 29 409 38 S426 21 440 28 L440 168 L0 168Z" />
    <path className="chart-line" d="M0 136 C19 132 24 139 42 127 S70 119 90 124 S116 108 130 112 S151 96 170 103 S190 82 210 89 S231 68 248 78 S270 51 287 61 S309 78 325 58 S344 38 364 47 S389 29 409 38 S426 21 440 28" />
    <circle cx="440" cy="28" r="4" className="chart-dot" />
    <g className="chart-labels"><text x="0" y="164">09:30</text><text x="198" y="164">11:30</text><text x="390" y="164">14:55</text></g>
  </svg>
}

function Sidebar({ active, setActive, expanded, onClose }) {
  return <aside className={`sidebar ${expanded ? 'is-open' : ''}`}>
    <div className="brand"><span className="brand-mark">散</span><span>散户</span><button className="mobile-close" onClick={onClose}><X size={18}/></button></div>
    <div className="portfolio-switch"><span>我的基金账户</span><ChevronDown size={15}/></div>
    <nav>{nav.map(([label, Icon]) => <button key={label} onClick={() => { setActive(label); onClose() }} className={active === label ? 'nav-link active' : 'nav-link'}><Icon size={18}/><span>{label}</span>{label === '决策记录' && <i>3</i>}</button>)}</nav>
    <div className="sidebar-foot"><button className="nav-link"><BookOpen size={18}/><span>使用指南</span></button><button className="nav-link"><Settings size={18}/><span>设置</span></button><div className="local-note"><span></span><div><strong>本地数据模式</strong><small>数据仅用于个人分析</small></div></div></div>
  </aside>
}

function Market() {
  const [kind, setKind] = useState('行业资金流')
  const [period, setPeriod] = useState('今日')
  const [selected, setSelected] = useState('半导体')
  const rows = useMemo(() => kind === '行业资金流' ? sectorRows : sectorRows.map((row, i) => ({ ...row, name: ['人工智能', '机器人', '算力概念', '创新药', '新能源车', '低空经济', '消费电子'][i] })), [kind])
  const selectedRow = rows.find((row) => row.name === selected) || rows[0]
  return <main className="content">
    <section className="page-heading"><div><h1>市场脉搏</h1><p>用资金流观察板块强弱，不替代投资决策。</p></div><button className="outline-action"><Download size={16}/> 导出数据</button></section>
    <section className="market-summary">
      <div><span>两市主力净流入</span><strong className="rise">+86.42 亿</strong><small>较昨日同期 <b>+21.6%</b></small></div>
      <div><span>行业净流入板块</span><strong>46 / 86</strong><small><b className="rise">半导体</b> 领涨</small></div>
      <div><span>概念净流入板块</span><strong>181 / 369</strong><small><b className="rise">人工智能</b> 居首</small></div>
    </section>
    <section className="toolbar"><div className="segmented">{['行业资金流', '概念资金流', '地域资金流'].map(item => <button onClick={() => {setKind(item); setSelected(item === '行业资金流' ? '半导体' : '人工智能')}} className={kind === item ? 'selected' : ''} key={item}>{item}</button>)}</div><div className="right-controls"><div className="period">{['今日', '5日', '10日'].map(item => <button onClick={() => setPeriod(item)} key={item} className={period === item ? 'selected' : ''}>{item}</button>)}</div><span className="timestamp"><span></span> 盘中更新 14:56:12</span></div></section>
    <section className="market-grid">
      <div className="flow-table-wrap"><header className="table-title"><div><h2>{kind}排行</h2><p>按主力净流入排序</p></div><button aria-label="了解资金流口径"><CircleHelp size={17}/></button></header><div className="table-scroll"><table><thead><tr><th>排名</th><th>板块</th><th>涨跌幅</th><th>主力净流入</th><th>净占比</th><th>领涨股</th></tr></thead><tbody>{rows.map(row => <tr className={selectedRow.name === row.name ? 'selected-row' : ''} onClick={() => setSelected(row.name)} key={row.name}><td><span className={`rank ${row.rank < 4 ? 'top' : ''}`}>{row.rank}</span></td><td><strong>{row.name}</strong>{row.hot && <em>热门</em>}</td><td><FlowValue value={row.change} suffix="%" /></td><td><FlowValue value={row.flow}/></td><td><FlowValue value={row.ratio} suffix="%" /></td><td>{row.stock}</td></tr>)}</tbody></table></div><footer>数据来源：东方财富公开行情 · 资金流为交易口径推算，仅供参考</footer></div>
      <aside className="detail-panel"><div className="detail-top"><div><span className="eyeless-label">资金流详情</span><h2>{selectedRow.name}</h2><p><FlowValue value={selectedRow.flow}/> 主力净流入</p></div><button><ChevronDown size={18}/></button></div><div className="chart-tabs"><span className="selected">分时</span><span>日线</span></div><MiniChart/><div className="flow-split"><div><span>流入</span><strong className="rise">126.78亿</strong></div><div><span>流出</span><strong className="fall">108.36亿</strong></div><div><span>净占比</span><strong className="rise">8.74%</strong></div></div><div className="constituents"><h3>主力净流入靠前个股</h3>{['寒武纪-U', '中芯国际', '海光信息'].map((item, i) => <div key={item}><span>{i + 1}</span><strong>{item}</strong><FlowValue value={[5.86, 4.19, 3.47][i]}/></div>)}</div></aside>
    </section>
    <section className="holding-link"><header><div><h2>与你的持仓关联</h2><p>以下是你所持基金当前覆盖的重点板块</p></div><button>查看持仓透视 <ArrowUpRight size={15}/></button></header><div className="exposure-list"><article><div className="theme-icon purple"><Landmark size={19}/></div><div><strong>半导体</strong><span>2 只基金覆盖 · 估算配置 18.6%</span></div><FlowValue value={18.42}/><ArrowUpRight className="link-arrow" size={17}/></article><article><div className="theme-icon teal"><BriefcaseBusiness size={19}/></div><div><strong>医药生物</strong><span>1 只基金覆盖 · 估算配置 11.2%</span></div><FlowValue value={-3.88}/><ArrowDownRight className="link-arrow" size={17}/></article></div></section>
  </main>
}

function Placeholder({ title }) { return <main className="content placeholder"><Sparkles size={26}/><h1>{title}</h1><p>该模块将沿用原版 sanhu 的分析逻辑，在下一步接入后端数据。</p></main> }

export default function App() {
  const [active, setActive] = useState('市场')
  const [expanded, setExpanded] = useState(false)
  return <div className="app-shell"><Sidebar active={active} setActive={setActive} expanded={expanded} onClose={() => setExpanded(false)}/><div className="shell-main"><header className="topbar"><button className="menu-button" onClick={() => setExpanded(true)}><Menu size={21}/></button><div className="search"><Search size={17}/><input placeholder="搜索基金、板块或代码" /></div><div className="topbar-tools"><span>2026年8月6日，周四</span><button className="icon-button"><Bell size={18}/></button><button className="avatar">A</button></div></header>{active === '市场' ? <Market/> : <Placeholder title={active}/>}</div></div>
}
