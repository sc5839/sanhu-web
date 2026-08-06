import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, Bell, BookOpen, BriefcaseBusiness,
  CalendarDays, CheckCircle2, ChevronDown, CircleHelp, ClipboardList, Compass, Download, Landmark,
  LayoutDashboard, LineChart, Menu, Plus, Search, Settings, ShieldAlert, SlidersHorizontal,
  Target, TrendingDown, TrendingUp, WalletCards, X,
} from 'lucide-react'

const funds = [
  { code: '159995', name: '华夏芯片 ETF 联接 A', type: '股票型', value: 28640, profit: 4238, day: 1.72, share: 30.8, tag: '半导体' },
  { code: '110011', name: '易方达中小盘混合', type: '混合型', value: 18420, profit: 1290, day: 0.83, share: 19.8, tag: '消费成长' },
  { code: '006195', name: '国泰中证全指通信设备 ETF', type: '股票型', value: 16580, profit: -652, day: -0.41, share: 17.8, tag: '通信' },
  { code: '000217', name: '华安黄金 ETF 联接 A', type: 'QDII/商品', value: 10860, profit: 1764, day: 0.46, share: 11.7, tag: '黄金' },
  { code: '003474', name: '南方天天利货币 B', type: '货币型', value: 8520, profit: 81, day: 0.02, share: 9.2, tag: '现金管理' },
  { code: '006567', name: '招商中债 3-5 年国开债', type: '债券型', value: 5920, profit: 146, day: 0.01, share: 6.4, tag: '利率债' },
]

const sectorRows = [
  { rank: 1, name: '半导体', change: 2.86, flow: 18.42, ratio: 8.74, stock: '寒武纪-U', hot: true },
  { rank: 2, name: '电力设备', change: 1.63, flow: 12.68, ratio: 5.19, stock: '阳光电源' },
  { rank: 3, name: '有色金属', change: 1.27, flow: 9.36, ratio: 4.28, stock: '洛阳钼业' },
  { rank: 4, name: '软件开发', change: 0.82, flow: 6.75, ratio: 3.11, stock: '金山办公' },
  { rank: 5, name: '通信设备', change: 0.71, flow: 4.26, ratio: 2.35, stock: '中际旭创' },
  { rank: 6, name: '医药生物', change: -0.36, flow: -3.88, ratio: -1.94, stock: '药明康德' },
  { rank: 7, name: '白酒', change: -0.61, flow: -5.12, ratio: -2.88, stock: '贵州茅台' },
]

const MARKET_API = import.meta.env.VITE_MARKET_API || (import.meta.env.PROD ? 'https://aidon-market-data.aidon-fund.workers.dev/api/market' : '/api/market')

const nav = [
  ['总览', LayoutDashboard], ['持仓', WalletCards], ['市场', Compass], ['风险', ShieldAlert],
  ['调仓', SlidersHorizontal], ['策略', BarChart3], ['决策记录', ClipboardList],
]

const money = (n) => `¥${n.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`
function FlowValue({ value, suffix = '%' }) { const up = value >= 0; return <span className={up ? 'rise' : 'fall'}>{up ? '+' : ''}{value.toFixed(2)}{suffix}</span> }
function SectionHeading({ title, text, action, onAction, icon: Icon = Download }) { return <section className="page-heading"><div><h1>{title}</h1><p>{text}</p></div>{action && <button className="outline-action" onClick={onAction}><Icon size={16}/>{action}</button>}</section> }
function Metric({ label, value, detail, tone }) { return <div className="metric"><span>{label}</span><strong className={tone || ''}>{value}</strong>{detail && <small>{detail}</small>}</div> }
function Bar({ value, color = 'blue' }) { return <span className={`bar ${color}`}><i style={{ width: `${Math.min(value, 100)}%` }} /></span> }

function Sidebar({ active, setActive, expanded, onClose, notify }) {
  return <aside className={`sidebar ${expanded ? 'is-open' : ''}`}>
    <div className="brand"><span className="brand-mark">A</span><span>Aidon’s 基金管理工具</span><button className="mobile-close" onClick={onClose}><X size={18}/></button></div>
    <div className="portfolio-switch"><span>我的基金账户</span><ChevronDown size={15}/></div>
    <nav>{nav.map(([label, Icon]) => <button key={label} onClick={() => { setActive(label); onClose() }} className={active === label ? 'nav-link active' : 'nav-link'}><Icon size={18}/><span>{label}</span>{label === '决策记录' && <i>3</i>}</button>)}</nav>
    <div className="sidebar-foot"><button className="nav-link" onClick={() => notify('使用指南将在接入真实账户后开放。')}><BookOpen size={18}/><span>使用指南</span></button><button className="nav-link" onClick={() => notify('设置面板已预留，当前为演示模式。')}><Settings size={18}/><span>设置</span></button><div className="local-note"><span></span><div><strong>版本 v0.3.0</strong><small>2026-08-06 · 交互与页面迭代</small></div></div></div>
  </aside>
}

function Overview({ go, notify }) { return <main className="content">
  <SectionHeading title="持仓总览" text="用一页看清资产、收益和需要留意的组合信号。" action="更新持仓" onAction={() => notify('持仓导入需要连接个人基金数据源；当前保留演示组合。')} icon={Plus}/>
  <section className="market-summary overview-metrics"><Metric label="持仓总市值" value="¥88,940" detail="共 6 只基金"/><Metric label="累计收益" value="+¥6,867" detail="收益率 +8.37%" tone="rise"/><Metric label="今日收益" value="+¥723" detail="较昨日 +0.82%" tone="rise"/></section>
  <section className="two-grid"><article className="panel"><header className="panel-head"><div><h2>资产配置</h2><p>按基金类型划分</p></div><button onClick={() => go('调仓')}>查看目标配置 <ArrowUpRight size={15}/></button></header><div className="allocation"><div className="allocation-ring"><b>¥8.9万</b><span>总资产</span></div><div className="allocation-list">{[['股票型',48.6,'coral'],['混合型',19.8,'blue'],['QDII/商品',11.7,'gold'],['货币型',9.2,'teal'],['债券型',6.4,'slate']].map(([n,v,c]) => <div key={n}><span><i className={c}/>{n}</span><strong>{v}%</strong><Bar value={v} color={c}/></div>)}</div></div></article>
  <article className="panel"><header className="panel-head"><div><h2>组合提示</h2><p>基于当前持仓结构</p></div><button onClick={() => go('风险')}>风险详情 <ArrowUpRight size={15}/></button></header><div className="insights"><div className="insight warning"><AlertTriangle size={18}/><div><strong>权益仓位偏高</strong><p>股票及混合型合计 68.4%，高于设定目标 8.4%。</p></div></div><div className="insight positive"><CheckCircle2 size={18}/><div><strong>流动性充足</strong><p>货币与债券类合计 15.6%，可覆盖近期计划。</p></div></div><div className="insight neutral"><Target size={18}/><div><strong>板块关注</strong><p>半导体相关敞口 25.6%，请留意集中度变化。</p></div></div></div></article></section>
  <section className="panel fund-panel"><header className="panel-head"><div><h2>基金持仓</h2><p>净值与收益为演示数据，真实版本可同步公开基金行情。</p></div><button onClick={() => go('持仓')}>持仓透视 <ArrowUpRight size={15}/></button></header><FundTable /></section>
</main> }

function FundTable() { return <div className="table-scroll"><table><thead><tr><th>基金</th><th>类型</th><th>持有金额</th><th>累计收益</th><th>今日估值</th><th>占比</th></tr></thead><tbody>{funds.map(f => <tr key={f.code}><td><strong>{f.name}</strong><small className="code">{f.code} · {f.tag}</small></td><td>{f.type}</td><td>{money(f.value)}</td><td><FlowValue value={f.profit} suffix="" /></td><td><FlowValue value={f.day}/></td><td><span className="share-cell">{f.share}%<Bar value={f.share} color="blue"/></span></td></tr>)}</tbody></table></div> }

function Holdings({ notify }) { return <main className="content"><SectionHeading title="持仓透视" text="穿透基金包装，观察底层行业分布与持股重叠。" action="刷新季报" onAction={() => notify('已请求刷新；演示版本显示最近报告期 2026Q2。')}/>
  <section className="market-summary"><Metric label="已分析权益基金" value="4 / 4" detail="最新季报 2026Q2"/><Metric label="等效独立基金数" value="3.2" detail="6 只基金并非完全独立"/><Metric label="前五行业集中度" value="64.7%" detail="半导体敞口最高" tone="rise"/></section>
  <section className="two-grid"><article className="panel"><header className="panel-head"><div><h2>行业暴露</h2><p>按基金资产权重估算</p></div><CircleHelp size={17}/></header><div className="exposure-bars">{[['半导体',25.6,'coral'],['通信设备',14.3,'blue'],['电子制造',9.4,'blue'],['黄金与贵金属',8.7,'gold'],['消费服务',6.7,'teal'],['医药生物',5.2,'slate']].map(([n,v,c]) => <div key={n}><span>{n}</span><Bar value={v * 3} color={c}/><strong>{v}%</strong></div>)}</div></article>
  <article className="panel"><header className="panel-head"><div><h2>重叠持股</h2><p>多只基金同时持有的标的</p></div><span className="data-label">穿透数据</span></header><div className="overlap-list">{[['中芯国际','3 只基金',6.84],['寒武纪-U','2 只基金',4.97],['立讯精密','2 只基金',3.12],['中际旭创','2 只基金',2.76]].map(([n,c,v], i) => <div key={n}><b>{i+1}</b><span><strong>{n}</strong><small>{c}</small></span><FlowValue value={v}/></div>)}</div></article></section>
  <section className="panel fund-panel"><header className="panel-head"><div><h2>单基金穿透</h2><p>基金季报通常存在披露时滞，页面需明确展示报告期。</p></div><span className="data-label">报告期：2026-06-30</span></header><FundTable /></section>
</main> }

function Risk({ notify, go }) { const rows = [['单一行业集中度','25.6%','建议不高于 25%','预警'],['单只基金集中度','30.8%','建议不高于 30%','预警'],['相关性','0.58','组合相关性中等','关注'],['最大回撤（近一年）','-12.4%','可接受区间：-15% 以内','正常']]; return <main className="content"><SectionHeading title="风险分析" text="使用集中度、波动和回撤检查组合，而不作买卖指令。" action="生成报告" onAction={() => notify('风险报告已生成（演示预览）。')}/>
  <section className="market-summary risk-metrics"><Metric label="综合风险等级" value="中等" detail="适合中等波动承受度"/><Metric label="年化波动率" value="14.8%" detail="过去 12 个月" tone="rise"/><Metric label="最大回撤" value="-12.4%" detail="近一年" tone="fall"/></section>
  <section className="two-grid"><article className="panel"><header className="panel-head"><div><h2>风险雷达</h2><p>五个维度均为演示口径</p></div></header><div className="radar-wrap"><div className="radar"><i/><i/><i/><b>集中度</b><b>波动率</b><b>回撤</b><b>流动性</b><b>相关性</b></div><div className="risk-copy"><strong>需要关注集中度</strong><p>组合大部分风险来自科技成长板块。若不符合你的投资期限，可通过增加低相关资产平衡。</p><button>查看调仓建议 <ArrowUpRight size={15}/></button></div></div></article>
  <article className="panel"><header className="panel-head"><div><h2>相关性矩阵</h2><p>数值越接近 1，走势越相似</p></div></header><Correlation /></article></section>
  <section className="panel alert-panel"><header className="panel-head"><div><h2>风险检查项</h2><p>每条告警均带有当前数值与参考阈值。</p></div></header><div className="risk-list">{rows.map(([n,v,d,s]) => <div key={n}><span className={`risk-dot ${s}`}/><strong>{n}</strong><b>{v}</b><small>{d}</small><em className={s}>{s}</em></div>)}</div></section>
</main> }
function Correlation() { const nums = [['1.00','.68','.55','.32'],['.68','1.00','.62','.27'],['.55','.62','1.00','.18'],['.32','.27','.18','1.00']]; return <div className="corr"><div className="corr-names"><span>本组合</span><span>芯片</span><span>通信</span><span>黄金</span></div><div className="corr-grid">{nums.flat().map((n,i) => <b key={i} style={{opacity: .35 + Number(n)*.65}}>{n}</b>)}</div></div> }

function Rebalance() { const [target, setTarget] = useState(40); return <main className="content"><SectionHeading title="调仓建议" text="与个人目标配置进行对照，执行与否始终由你决定。" action="编辑目标" icon={SlidersHorizontal}/>
  <section className="panel target-panel"><header className="panel-head"><div><h2>目标配置</h2><p>可按你的风险偏好调整；当前页面修改仅为演示。</p></div><span className="data-label">合计 100%</span></header><div className="target-editor"><div><label>股票型 <b>{target}%</b></label><input type="range" min="20" max="60" value={target} onChange={e => setTarget(+e.target.value)}/></div>{[['混合型',25],['债券型',15],['货币型',10],['QDII/商品',10]].map(([n,v]) => <div key={n}><label>{n}<b>{v}%</b></label><span className="fake-range"><i style={{width:`${v * 1.7}%`}}/></span></div>)}</div></section>
  <section className="two-grid"><article className="panel"><header className="panel-head"><div><h2>当前与目标</h2><p>配置差异以百分点展示</p></div></header><div className="compare-bars">{[['股票型',48.6,target],['混合型',19.8,25],['债券型',6.4,15],['货币型',9.2,10],['QDII/商品',11.7,10]].map(([n,c,t]) => <div key={n}><span>{n}</span><div><Bar value={c*1.5} color="blue"/><Bar value={t*1.5} color="teal"/></div><strong className={c>t?'rise':'fall'}>{c>t?'+':''}{(c-t).toFixed(1)}%</strong></div>)}<p className="legend"><i className="blue"/>当前配置 <i className="teal"/>目标配置</p></div></article><article className="panel"><header className="panel-head"><div><h2>建议动作</h2><p>按目标配置估算</p></div></header><div className="action-list">{[['减少','华夏芯片 ETF 联接 A','¥7,900'],['增加','招商中债 3-5 年国开债','¥5,630'],['增加','南方天天利货币 B','¥2,270']].map(([a,n,m]) => <div key={n}><span className={a==='减少'?'action-sell':'action-buy'}>{a}</span><strong>{n}</strong><b>{m}</b></div>)}</div></article></section>
</main> }

function Strategy() { return <main className="content"><SectionHeading title="策略模拟" text="先用历史数据验证定投和止盈设想，再决定是否采用。" action="新建模拟" icon={Plus}/><section className="market-summary"><Metric label="已保存策略" value="2" detail="1 个历史回测，1 个观察中"/><Metric label="最佳年化收益" value="12.6%" detail="历史表现不代表未来" tone="rise"/><Metric label="回测区间" value="36 个月" detail="2023-08 至 2026-07"/></section><section className="two-grid"><article className="panel strategy-card"><header className="panel-head"><div><h2>每月定投 · 半导体</h2><p>历史回测 · 每月 1,000 元</p></div><span className="data-label">已完成</span></header><div className="strategy-chart"><svg viewBox="0 0 500 180"><path d="M0 150 C55 145 50 132 95 135 S137 104 178 115 S218 100 260 91 S300 118 337 78 S377 53 418 60 S458 28 500 20 L500 180 L0 180Z"/><polyline points="0,150 40,146 95,135 136,108 178,115 218,100 260,91 300,118 337,78 377,53 418,60 458,28 500,20"/></svg></div><div className="strategy-stats"><Metric label="累计投入" value="¥36,000"/><Metric label="期末价值" value="¥42,514" tone="rise"/><Metric label="最大回撤" value="-18.6%" tone="fall"/></div></article><article className="panel"><header className="panel-head"><div><h2>创建观察模拟</h2><p>虚拟记录，不连接交易账户</p></div></header><div className="simulation-form"><label>选择基金 <select><option>华夏芯片 ETF 联接 A</option><option>易方达中小盘混合</option></select></label><label>每月投入 <input defaultValue="1000" inputMode="decimal"/> 元</label><label>观察期限 <select><option>12 个月</option><option>24 个月</option></select></label><button className="primary-action">开始模拟</button></div></article></section></main> }

function Decisions() { const [records, setRecords] = useState([{title:'半导体基金是否继续定投',date:'2026-08-05',status:'待复盘',reason:'估值与行业资金流同步改善，维持原计划。'},{title:'增加债券基金配置',date:'2026-08-01',status:'已执行',reason:'降低权益集中度，作为组合稳定器。'},{title:'黄金基金止盈规则',date:'2026-07-18',status:'观察中',reason:'达到目标收益前不因短期波动退出。'}]); return <main className="content"><SectionHeading title="决策记录" text="记录买入、持有或卖出的理由，帮助自己事后复盘。" action="新建记录" icon={Plus}/><section className="panel decision-panel"><header className="panel-head"><div><h2>决策台账</h2><p>把判断写下来，比只看结果更能改善长期决策。</p></div><button onClick={() => setRecords([{title:'新的基金配置判断',date:'刚刚',status:'草稿',reason:'请补充这次决策的依据和验证条件。'}, ...records])}>添加一条 <Plus size={15}/></button></header><div className="decision-list">{records.map((r,i) => <article key={r.title+i}><div className="decision-date"><CalendarDays size={17}/><span>{r.date}</span></div><div><h3>{r.title}</h3><p>{r.reason}</p></div><span className={`status ${r.status}`}>{r.status}</span><button aria-label="查看记录"><ArrowUpRight size={17}/></button></article>)}</div></section></main> }

function MiniChart({ klines = [] }) { const raw = klines.slice(-12).map(line => line.split(',').map(Number)); const values = raw.flatMap(item => [item[1], item[2], item[3], item[4]]); const max = Math.max(...values, 1); const min = Math.min(...values, 0); const y = value => 16 + (max - value) / Math.max(max - min, 1) * 112; return <div className="kline-wrap"><div className="kline-head"><strong>板块日 K 复盘</strong><span>{raw.length ? '东方财富真实日线' : '正在采集…'}</span></div><svg className="mini-chart kline-chart" viewBox="0 0 440 168"><g className="chart-grid"><path d="M0 32H440M0 78H440M0 124H440" /></g>{raw.map((item,i)=>{const [,open,close,high,low]=item;const x=18+i*35;const up=close>=open;return <g key={x} className={up?'k-up':'k-down'}><path d={`M${x+8} ${y(high)}V${y(low)}`}/><rect x={x} y={Math.min(y(open),y(close))} width="16" height={Math.max(4,Math.abs(y(open)-y(close)))}/></g>})}</svg><div className="kline-summary"><span>区间高点 <b>{raw.length ? max.toFixed(2) : '—'}</b></span><span>区间低点 <b>{raw.length ? min.toFixed(2) : '—'}</b></span><span>数据源 <b>东方财富</b></span></div></div> }
function Market() {
  const [selected, setSelected] = useState('通信设备'); const [live, setLive] = useState(null); const [kline, setKline] = useState([]); const [error, setError] = useState('')
  useEffect(() => { fetch(`${MARKET_API}/boards`).then(r => r.json()).then(data => { if (data.error) throw new Error(data.error); setLive(data); setSelected(data.rows[0]?.name || selected) }).catch(() => setError('行情源暂时不可用，正在保留上次成功数据。')) }, [])
  const rows = live?.rows || sectorRows; const row = rows.find(r => r.name === selected) || rows[0]
  useEffect(() => { if (!row?.code) return; fetch(`${MARKET_API}/kline?code=${row.code}`).then(r => r.json()).then(data => setKline(data.klines || [])).catch(() => setKline([])) }, [row?.code])
  const net = rows.reduce((sum, item) => sum + item.flow, 0); const collected = live?.collectedAt ? new Date(live.collectedAt).toLocaleString('zh-CN', { hour12: false }) : '未连接'
  return <main className="content"><SectionHeading title="市场脉搏" text="真实公开行情每 30 秒缓存；主力资金流不等同基金申赎。" action="刷新数据" onAction={() => window.location.reload()}/><section className="market-summary"><Metric label="行业池主力净流入" value={`${net >= 0 ? '+' : ''}${net.toFixed(2)} 亿`} detail="东方财富公开行情" tone={net >= 0 ? 'rise' : 'fall'}/><Metric label="已采集行业板块" value={`${rows.length} 个`} detail="按主力净流入排序"/><Metric label="数据状态" value={live ? '已连接' : '等待连接'} detail={error || '本地采集代理'} /></section><section className="toolbar"><span className="data-label">行业资金流 · 实时采集</span><span className="timestamp"><i/>最近采集：{collected}</span></section><section className="market-grid"><div className="flow-table-wrap"><header className="table-title"><div><h2>行业资金流排行</h2><p>真实数据 · 点击板块查看日 K 复盘</p></div><CircleHelp size={17}/></header><div className="table-scroll"><table><thead><tr><th>排名</th><th>板块</th><th>最新价</th><th>涨跌幅</th><th>主力净流入</th><th>净占比</th></tr></thead><tbody>{rows.map(r=><tr className={row.name===r.name?'selected-row':''} onClick={()=>setSelected(r.name)} key={r.name}><td><span className={`rank ${r.rank<4?'top':''}`}>{r.rank}</span></td><td><strong>{r.name}</strong></td><td>{r.price?.toLocaleString?.() || '—'}</td><td><FlowValue value={r.change}/></td><td><FlowValue value={r.flow} suffix="亿"/></td><td><FlowValue value={r.ratio}/></td></tr>)}</tbody></table></div><footer>主源：东方财富公开行情；新浪财经方向校验仍在验证，当前不混用口径。数据仅供参考。</footer></div><aside className="detail-panel"><div className="detail-top"><div><span>资金流详情</span><h2>{row.name}</h2><p><FlowValue value={row.flow} suffix="亿"/> 主力净流入</p></div><ChevronDown size={18}/></div><MiniChart klines={kline}/><div className="flow-split"><Metric label="主力净流入" value={`${row.flow?.toFixed?.(2) || '—'}亿`} tone={row.flow >= 0 ? 'rise' : 'fall'}/><Metric label="最新价" value={row.price?.toLocaleString?.() || '—'}/><Metric label="净占比" value={`${row.ratio?.toFixed?.(2) || '—'}%`} tone={row.ratio >= 0 ? 'rise' : 'fall'}/></div></aside></section></main>
}

export default function App() {
  const [active,setActive]=useState('总览'); const [expanded,setExpanded]=useState(false); const [toast,setToast]=useState('');
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2800) };
  const genericFeedback = (event) => { const button = event.target.closest('button'); if (!button || button.dataset.noFeedback) return; const label = button.innerText.trim().replace(/\s+/g,' '); if (label) notify(`${label}：操作已响应`); };
  const pages={总览:<Overview go={setActive} notify={notify}/>,市场:<Market/>,持仓:<Holdings notify={notify}/>,风险:<Risk notify={notify} go={setActive}/>,调仓:<Rebalance/>,策略:<Strategy/>,决策记录:<Decisions/>};
  return <div className="app-shell"><Sidebar active={active} setActive={setActive} expanded={expanded} onClose={()=>setExpanded(false)} notify={notify}/><div className="shell-main" onClickCapture={genericFeedback}><header className="topbar"><button className="menu-button" onClick={()=>setExpanded(true)}><Menu size={21}/></button><div className="search"><Search size={17}/><input placeholder="搜索基金、板块或代码" /></div><div className="topbar-tools"><span>2026年8月6日，周四</span><button className="icon-button"><Bell size={18}/></button><button className="avatar">A</button></div></header>{pages[active]}</div>{toast && <div className="toast" role="status">{toast}</div>}</div>
}
