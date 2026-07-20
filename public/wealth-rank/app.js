
let DATA = null;
const WORLD_ADULTS = 5_400_000_000;
// FX and currency metadata now come from DATA (see footer note on refresh cadence).
let FX;
const CCY_SYMBOL = {};
const FXNAME = {USD:'US Dollar',EUR:'Euro',GBP:'British Pound',JPY:'Japanese Yen',CNY:'Chinese Yuan',
INR:'Indian Rupee',VND:'Vietnamese Dong',KRW:'Korean Won',CAD:'Canadian Dollar',AUD:'Australian Dollar',
NZD:'NZ Dollar',CHF:'Swiss Franc',NOK:'Norwegian Krone',SEK:'Swedish Krona',DKK:'Danish Krone',
PLN:'Polish Zloty',CZK:'Czech Koruna',HUF:'Hungarian Forint',RUB:'Russian Ruble',TRY:'Turkish Lira',
ILS:'Israeli Shekel',SAR:'Saudi Riyal',AED:'UAE Dirham',EGP:'Egyptian Pound',ZAR:'South African Rand',
NGN:'Nigerian Naira',KES:'Kenyan Shilling',BRL:'Brazilian Real',MXN:'Mexican Peso',ARS:'Argentine Peso',
CLP:'Chilean Peso',COP:'Colombian Peso',IDR:'Indonesian Rupiah',THB:'Thai Baht',PHP:'Philippine Peso',
MYR:'Malaysian Ringgit',SGD:'Singapore Dollar',HKD:'Hong Kong Dollar',TWD:'Taiwan Dollar',
PKR:'Pakistani Rupee',BDT:'Bangladeshi Taka',LKR:'Sri Lankan Rupee'};
const MAIN_CCY = ['USD','EUR','GBP','JPY','CNY','INR','VND','KRW','CAD','AUD','NZD','CHF','SGD','HKD',
 'SEK','NOK','DKK','PLN','CZK','TRY','ILS','AED','SAR','ZAR','NGN','KES','EGP','BRL','MXN','ARS','CLP',
 'COP','IDR','THB','PHP','MYR','TWD','PKR','BDT','LKR','RUB','HUF'];
let curCcy = 'USD';
const $ = id => document.getElementById(id);
const DATA_URL = document.querySelector('.wrap').dataset.src || '/wealth-rank/data.json';
let mode = 'income', cc = 'US';

function boot(){
const csel = $('currency');
MAIN_CCY.filter(c=>FX[c]).forEach(c=>{ const o=document.createElement('option'); o.value=c; o.textContent=c+' — '+(FXNAME[c]||c); csel.appendChild(o); });
{ const o=document.createElement('option'); o.value='LOCAL'; o.textContent='— my country\u2019s local currency —'; csel.appendChild(o); }
csel.value='USD';
const cmpsel = $('compare');
{
  const o=document.createElement('option'); o.value='WO'; o.textContent='the whole world'; cmpsel.appendChild(o);
  Object.keys(DATA.countries).filter(c=>c!=='WO').sort((a,b)=>DATA.countries[a].name.localeCompare(DATA.countries[b].name))
    .forEach(c=>{ const x=document.createElement('option'); x.value=c; x.textContent=DATA.countries[c].name; cmpsel.appendChild(x); });
  cmpsel.value='WO';
}
let cmp = 'WO';
const sel = $('country');
Object.keys(DATA.countries).filter(c=>c!=='WO').sort((a,b)=>DATA.countries[a].name.localeCompare(DATA.countries[b].name))
  .forEach(c=>{ const o=document.createElement('option'); o.value=c; o.textContent=DATA.countries[c].name; sel.appendChild(o); });
sel.value = 'US';

const fmt = (n, sym) => sym + Math.round(n).toLocaleString();
const parseAmt = s => { const n = parseFloat(String(s).replace(/[^0-9.]/g,'')); return isNaN(n)?0:n; };

function pctFromLadder(ladder, value){
  // ladder[i] = threshold to enter percentile i. Returns 0-99.
  let p = 0;
  for (let i=0;i<ladder.length;i++){ if (ladder[i]!=null && value >= ladder[i]) p = i; }
  return p;
}
function ordinal(n){ const s=['th','st','nd','rd'], v=n%100; return n+(s[(v-20)%10]||s[v]||s[0]); }

function drawTicks(id, p){
  const el = $(id);
  if (el.children.length !== 100){
    el.innerHTML = '';
    for (let i=0;i<100;i++){ const d=document.createElement('div'); d.className='tick'; el.appendChild(d); }
  }
  const t = el.children;
  for (let i=0;i<100;i++){
    t[i].className = 'tick' + (i===p ? ' you' : (i<p ? ' filled' : ''));
    t[i].style.height = (18 + Math.pow(i/99, 3.2) * 82) + '%';
  }
}

const SCENES = [
  {n:10,      icon:'\u{1F37B}', label:'a table of 10 friends',        unit:'people'},
  {n:30,      icon:'\u{1F393}', label:'a classroom of 30',            unit:'students'},
  {n:180,     icon:'\u{2708}\u{FE0F}', label:'a full airplane (180 seats)', unit:'passengers'},
  {n:1000,    icon:'\u{1F3EB}', label:'a high school of 1,000',       unit:'students'},
  {n:20000,   icon:'\u{1F3C0}', label:'a packed arena (20,000)',      unit:'fans'},
  {n:80000,   icon:'\u{1F3DF}\u{FE0F}', label:'a sold-out stadium (80,000)', unit:'fans'},
  {n:1000000, icon:'\u{1F30D}', label:'a city of 1 million',          unit:'adults'}
];

function pictureIt(p, whoLabel){
  const rows = SCENES.map(s => {
    const above = Math.round((100-p)/100 * s.n);
    return {...s, above, rank: above + 1};
  });
  // choose 4 scenes where the numbers stay vivid (rank readable, crowd not absurd)
  let picks = rows.filter(s => s.rank >= 2 && s.rank <= 2000);
  if (picks.length < 4) picks = rows.filter(s => s.n >= 30).slice(0, 4);
  const chosen = picks.slice(0, 4);
  return chosen.map(s => {
    let txt;
    if (s.above === 0){
      txt = `you'd be <b>the richest person in the room</b>`;
    } else if (p >= 50){
      txt = `you'd be <b>#${s.rank.toLocaleString()}</b> richest \u2014 only ${s.above.toLocaleString()} ${s.above===1?'person has':'people have'} more`;
    } else {
      const below = s.n - s.rank;
      txt = `you'd rank <b>#${s.rank.toLocaleString()}</b> of ${s.n.toLocaleString()} \u2014 still ahead of ${below.toLocaleString()} ${below===1?'person':'people'}`;
    }
    return `<div class="pic"><div class="picicon">${s.icon}</div><div class="pictext">In ${s.label}, ${txt}<span class="who">${whoLabel}</span></div></div>`;
  }).join('');
}

function render(){
  const C = DATA.countries[cc], W = DATA.countries.WO;
  // Belt-and-suspenders: a money value must never render with no unit at all, even if a
  // country's own symbol is ever missing/blank.
  const ladderKey = mode, sym = C.symbol || (C.currency && C.currency !== 'LOCAL' ? C.currency + ' ' : '');
  const typed = parseAmt($('amount').value);
  // convert what the user typed into the country's local currency via market FX
  let amt;
  if (curCcy === 'LOCAL' || C.currency === 'LOCAL' || !FX[curCcy] || !FX[C.currency]) {
    amt = typed;                              // treat input as already in the country's own currency
  } else {
    amt = typed / FX[curCcy] * FX[C.currency];
  }
  const natLadder = C[ladderKey], wLadder = W[ladderKey];

  $('amtlabel').textContent = mode==='income' ? 'Yearly income, before tax' : 'Net worth (everything you own, minus debts)';
  const localMode = (curCcy === 'LOCAL' || C.currency === 'LOCAL' || !FX[curCcy] || !FX[C.currency]);
  const conv = (!localMode && C.currency !== curCcy) ? ` \u2248 ${fmt(amt, sym)} ${C.currency}` : '';
  $('hint').textContent = `${mode==='income'?'Per adult — if you share finances with a partner, use about half the household total.':'Per adult — split shared assets in half.'}${conv}`;

  // Every OTHER displayed money value must render in the selected currency (curCcy),
  // not the country's own local currency — only the hint line above stays in C.currency.
  const dispSym = localMode ? sym : (CCY_SYMBOL[curCcy] || (curCcy + ' '));
  const dispLabel = localMode ? `${C.name} money` : curCcy;
  const toDisplay = (localVal) => localMode ? localVal : (localVal / FX[C.currency] * FX[curCcy]);

  // comparison entity (world by default, or any country) — compared via PPP
  const CMP = DATA.countries[cmp];
  const cmpLadder = CMP[ladderKey];
  const inEur = amt / C.ppp;
  const cmpEur = cmpLadder.map(v => v==null?null:v / CMP.ppp);
  const gp = pctFromLadder(cmpEur, inEur);
  const np = pctFromLadder(natLadder, amt);
  const isWorld = cmp === 'WO';
  // world numbers always computed for the headline + people count
  const wEur = wLadder.map(v => v==null?null:v / W.ppp);
  const worldPct = pctFromLadder(wEur, inEur);

  const beat = Math.round(WORLD_ADULTS * worldPct/100);
  const gbig = $('globalbig');
  gbig.textContent = worldPct >= 50 ? `Top ${100-worldPct}%` : `${ordinal(worldPct)} percentile`;
  gbig.className = 'big' + (worldPct<50?' low':'');
  const gp_ = worldPct;
  $('globalsub').innerHTML = gp_ >= 50
    ? `Out of every 100 adults on Earth, <b>you're ahead of about ${gp_}</b> of them on ${mode==='income'?'income':'net worth'}. Most people guess way lower than their real number.`
    : `Out of every 100 adults on Earth, you're ahead of about ${gp_}. Worth knowing: this compares whole countries' averages too, and where you live shapes this more than almost anything you do.`;
  $('ccybadge').textContent = (curCcy==='LOCAL' || localMode) ? (C.currency==='LOCAL' ? 'local' : C.currency) : curCcy;
  drawTicks('ticks1', np); drawTicks('ticks2', gp);
  const whoWord = isWorld ? 'random adults from anywhere on Earth' : `random adults from ${CMP.name}`;
  $('picnote').innerHTML = `If you filled a room with <b>${whoWord}</b>, here's where you'd stand on ${mode==='income'?'income':'net worth'}. Change the "compare against" dropdown above to fill the room with a different country.`;
  $('pics').innerHTML = pictureIt(gp, whoWord);
  $('c1name').textContent = C.name;
  $('c1pos').textContent = np >= 50 ? `top ${100-np}% here` : `${ordinal(np)} percentile here`;
  const cmpWord = isWorld ? 'worldwide' : `in ${CMP.name}`;
  $('c2pos').textContent = gp >= 50 ? `top ${100-gp}% ${cmpWord}` : `${ordinal(gp)} percentile ${cmpWord}`;
  $('cfoot2a').textContent = isWorld ? 'poorest adult on Earth' : `poorest adult in ${CMP.name}`;

  $('natval').textContent = np >= 50 ? `Top ${100-np}%` : `${ordinal(np)}`;
  $('natsub').textContent = `of adults in ${C.name}. The median (middle) person here has ${fmt(toDisplay(natLadder[50]), dispSym)}.`;

  $('peopleval').textContent = beat >= 1e9 ? (beat/1e9).toFixed(1)+' billion' : Math.round(beat/1e6)+' million';
  $('peoplesub').textContent = `adults worldwide have less than you. There are about 5.4 billion adults alive.`;

  // context line
  const usMed = DATA.countries.US.income[50];
  let ctx = '';
  if (mode==='income'){
    const wm = wEur[50]*C.ppp;
    ctx = `For scale: the middle person on Earth lives on about ${fmt(toDisplay(wm), dispSym)} a year in ${dispLabel}. You entered ${fmt(toDisplay(amt), dispSym)} — that's <b>${(amt/wm).toFixed(1)}× the world's middle income</b>.`;
  } else {
    const wm = wEur[50]*C.ppp;
    ctx = `For scale: the middle adult on Earth has about ${fmt(toDisplay(wm), dispSym)} to their name in ${dispLabel}. You entered ${fmt(toDisplay(amt), dispSym)} — <b>${(amt/Math.max(wm,1)).toFixed(1)}× the world median</b>.`;
  }
  $('context').innerHTML = ctx;

  // ladder table
  $('laddernote').textContent = `What it takes to reach each level in ${C.name} (${mode==='income'?'yearly income':'net worth'}, per adult, ${mode==='income'?C.incomeYear:C.wealthYear}).`;
  const rows = [[10,'Bottom 10%'],[25,'Bottom quarter'],[50,'The middle'],[75,'Top quarter'],[90,'Top 10%'],[95,'Top 5%'],[99,'Top 1%']];
  $('ladderbody').innerHTML = rows.map(([p,label])=>{
    const v = natLadder[p];
    const isYou = np >= p && (rows[rows.findIndex(r=>r[0]===p)+1] ? np < rows[rows.findIndex(r=>r[0]===p)+1][0] : true);
    return `<tr class="${isYou?'you':''}"><td>${label}</td><td>${v==null?'—':fmt(toDisplay(v), dispSym)}</td></tr>`;
  }).join('');
}

function flashResults(){
  ['globalbig','c1pos','c2pos','natval','peopleval'].forEach(id=>{
    const el = $(id); if(!el) return;
    el.parentElement.classList.remove('flash');
    void el.parentElement.offsetWidth;
    el.parentElement.classList.add('flash');
  });
}
$('recalc').addEventListener('click', ()=>{ const b=$('recalc'); b.classList.remove('spin'); void b.offsetWidth; b.classList.add('spin'); render(); flashResults(); });
$('country').addEventListener('change', e=>{ cc = e.target.value; render(); flashResults(); });
$('currency').addEventListener('change', e=>{ curCcy = e.target.value; render(); flashResults(); });
$('compare').addEventListener('change', e=>{ cmp = e.target.value; render(); flashResults(); });
$('amount').addEventListener('input', render);
$('amount').addEventListener('blur', e=>{ const n=parseAmt(e.target.value); if(n) e.target.value = n.toLocaleString(); });
$('tab-income').addEventListener('click', ()=>{ mode='income'; $('tab-income').classList.add('on'); $('tab-wealth').classList.remove('on'); render(); });
$('tab-wealth').addEventListener('click', ()=>{ mode='wealth'; $('tab-wealth').classList.add('on'); $('tab-income').classList.remove('on'); render(); });
render();
}

(async function(){
  try {
    DATA = await (await fetch(DATA_URL)).json();
    FX = DATA.fx;
    Object.values(DATA.countries).forEach(c => { if (c.currency && c.currency !== 'LOCAL' && !CCY_SYMBOL[c.currency]) CCY_SYMBOL[c.currency] = c.symbol; });
    boot();
  } catch(e){
    document.querySelector('.wrap').insertAdjacentHTML('beforeend', '<p style="color:#D8262C">Could not load the data file. Check that ' + DATA_URL + ' is reachable.</p>');
    console.error(e);
  }
})();
