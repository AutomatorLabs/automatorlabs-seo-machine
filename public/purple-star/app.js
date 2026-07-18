
const { astro } = iztro;
// English-first display layer
const STAR_EN = {'Tử Vi':'The Emperor','Thiên Cơ':'The Strategist','Thái Dương':'The Sun','Vũ Khúc':'The Money General','Thiên Đồng':'The Lucky Child','Liêm Trinh':'The Official','Thiên Phủ':'The Vault','Thái Âm':'The Moon','Tham Lang':'The Wolf','Cự Môn':'The Big Mouth','Thiên Tướng':'The Chancellor','Thiên Lương':'The Elder','Thất Sát':'The Marshal','Phá Quân':'The Breaker',
'Văn Xương':'Study Star','Văn Khúc':'Talent Star','Tả Phù':'Left Helper','Hữu Bật':'Right Helper','Thiên Khôi':'Day Mentor','Thiên Việt':'Night Mentor','Lộc Tồn':'Salary Star','Thiên Mã':'Travel Horse','Kình Dương':'The Blade','Đà La':'Delay Star','Hỏa Tinh':'The Spark','Linh Tinh':'Slow Burn','Địa Không':'Daydream Star','Địa Kiếp':'The Drain'};
const ADJ_EN = {'Đào Hoa':'Charm Boost','Hồng Loan':'Romance Luck','Thiên Hỷ':'Good News','Thiên Hình':'Strict Judge','Thiên Diêu':'Temptation','Thiên Khốc':'Heavy Feelings','Thiên Hư':'The Worrier','Cô Thần':'Lone Wolf','Quả Tú':'Keeps-to-Self','Kiếp Sát':'Small Losses','Hoa Cái':'Spiritual Streak','Thiên Tài':'Hidden Talent','Thiên Thọ':'Staying Power','Long Trì':'Good Taste','Phụng Các':'Good Name','Tam Thai':'Slow Promotions','Bát Tọa':'Gets the Seat','Ân Quang':'Boss’s Favor','Thiên Quý':'Quietly Valued','Thiên Quan':'Official Protection','Thiên Phúc':'Small Blessings','Thiên Trù':'Food Luck','Giải Thần':'Problem Solver','Niên Giải':'Time Heals','Thiên Đức':'Guardian Shade','Nguyệt Đức':'Gentle Shield','Đẩu Quân':'Steady Anchor','Thiên Không':'Daydreamer','Tuần Không':'Mute Button','Triệt Lộ':'Interrupter','Không Vong':'The Vanisher','Phá Toái':'Redo Work','Lưu Hà':'Small Slips','Hàm Trì':'Flirty Pull','Thiên Thương':'Soft Spot','Thiên Sứ':'News Carrier','Thiên Nguyệt':'Low Battery','Phi Liêm':'Fast & Gossipy','Phong Cáo':'Awards Luck','Âm Sát':'Hidden Drain','Đài Phụ':'Small Boost','Thiên Vu':'Gut Feeling'};
const PAL_EN = {'Mệnh':'Self','Huynh Đệ':'Siblings','Phu Thê':'Marriage','Tử Nữ':'Children','Tài Bạch':'Money','Tật Ách':'Health','Thiên Di':'Travel','Nô Bộc':'Friends','Giao Hữu':'Friends','Quan Lộc':'Career','Điền Trạch':'Property','Phúc Đức':'Inner Life','Phụ Mẫu':'Parents'};
const STEM_EN = {'Giáp':'Wood','Ất':'Wood','Bính':'Fire','Đinh':'Fire','Mậu':'Earth','Kỷ':'Earth','Canh':'Metal','Tân':'Metal','Nhâm':'Water','Quý':'Water'};
const BRANCH_EN = {'Tý':'Rat','Sửu':'Ox','Dần':'Tiger','Mão':'Rabbit','Thìn':'Dragon','Tỵ':'Snake','Ngọ':'Horse','Mùi':'Goat','Thân':'Monkey','Dậu':'Rooster','Tuất':'Dog','Hợi':'Pig'};
const ELEM_EN = {'Thủy Nhị Cục':'Water','Mộc Tam Cục':'Wood','Kim Tứ Cục':'Metal','Thổ Ngũ Cục':'Earth','Hỏa Lục Cục':'Fire'};
const ZODIAC_EN = {'Chuột':'Rat','Trâu':'Ox','Hổ':'Tiger','Mèo':'Cat','Thỏ':'Rabbit','Rồng':'Dragon','Rắn':'Snake','Ngựa':'Horse','Dê':'Goat','Khỉ':'Monkey','Gà':'Rooster','Chó':'Dog','Lợn':'Pig','Heo':'Pig'};
const SIGN_EN = {'Bạch Dương':'Aries','Kim Ngưu':'Taurus','Song Tử':'Gemini','Cự Giải':'Cancer','Sư Tử':'Leo','Xử Nữ':'Virgo','Thiên Bình':'Libra','Thiên Yết':'Scorpio','Bọ Cạp':'Scorpio','Nhân Mã':'Sagittarius','Ma Kết':'Capricorn','Bảo Bình':'Aquarius','Thủy Bình':'Aquarius','Song Ngư':'Pisces'};
const MUT_EN = {'Lộc':'Gain','Quyền':'Power','Khoa':'Fame','Kỵ':'Friction','Hóa Lộc':'Gain','Hóa Quyền':'Power','Hóa Khoa':'Fame','Hóa Kỵ':'Friction'};
const en = n => STAR_EN[n] || ADJ_EN[n] || n;
const sb = (stem, branch) => (STEM_EN[stem]||stem) + ' ' + (BRANCH_EN[branch]||branch);
const pillarEn = pill => { const [s,b] = pill.split(' '); return sb(s,b); };
const mutBadge = m => { const short = m.replace('Hóa ',''); return '<span class="mut" style="background:' + (MUTCOLOR[m]||MUTCOLOR[short]||'var(--muted)') + '">' + (MUT_EN[short]||short) + '</span>'; };

const BRIGHTBARS = {'Miếu':'▮▮▮▮','Vượng':'▮▮▮▯','Đắc':'▮▮▯▯','Lợi':'▮▯▯▯','Bình':'·','Bất':'!','Hạn':'✕','Hãm':'✕'};


const HOURS = [
  ['12:00–1:00 AM','early Rat hour'],['1:00–3:00 AM','Ox hour'],['3:00–5:00 AM','Tiger hour'],['5:00–7:00 AM','Rabbit hour'],
  ['7:00–9:00 AM','Dragon hour'],['9:00–11:00 AM','Snake hour'],['11:00 AM–1:00 PM','Horse hour'],['1:00–3:00 PM','Goat hour'],
  ['3:00–5:00 PM','Monkey hour'],['5:00–7:00 PM','Rooster hour'],['7:00–9:00 PM','Dog hour'],['9:00–11:00 PM','Pig hour'],
  ['11:00 PM–12:00 AM','late Rat hour']
];
const hsel = document.getElementById('bhour');
HOURS.forEach((h,i)=>{ const o=document.createElement('option'); o.value=i; o.textContent=`${h[0]} (${h[1]})`; hsel.appendChild(o); });
hsel.value = 7;

// fixed traditional grid: branch -> [row, col]
const BRANCH_POS = {
  'Tỵ':[0,0],'Ngọ':[0,1],'Mùi':[0,2],'Thân':[0,3],
  'Thìn':[1,0],'Dậu':[1,3],
  'Mão':[2,0],'Tuất':[2,3],
  'Dần':[3,0],'Sửu':[3,1],'Tý':[3,2],'Hợi':[3,3]
};
const DOMAINS = {
  'Mệnh':'The Self palace — temperament, core disposition, the chart’s anchor. Every other palace is read relative to this one.',
  'Phụ Mẫu':'Parents — relationship with parents and elders, inherited context, early guidance.',
  'Phúc Đức':'Fortune & Virtue — inner life, contentment, ancestral blessing, what restores you.',
  'Điền Trạch':'Property — home, land, living environment, accumulated assets.',
  'Quan Lộc':'Career — vocation, public role, achievement style, relationship with authority.',
  'Nô Bộc':'Friends & Subordinates — networks, colleagues, the help (or trouble) others bring.',
  'Giao Hữu':'Friends & Subordinates — networks, colleagues, the help (or trouble) others bring.',
  'Thiên Di':'Travel — life away from home, movement, how the outside world receives you.',
  'Tật Ách':'Health — constitution, vulnerabilities, how the body carries stress.',
  'Tài Bạch':'Wealth — earning style, money flow, relationship with material resources.',
  'Tử Tức':'Children — offspring, creations, what you nurture and leave behind.',
  'Phu Thê':'Spouse — marriage and intimate partnership, the qualities drawn close.',
  'Huynh Đệ':'Siblings — brothers, sisters, peers-as-family, lateral support.'
};
const MUTCOLOR = {'Hóa Lộc':'var(--luc)','Hóa Quyền':'var(--quyen)','Hóa Khoa':'var(--khoa)','Hóa Kỵ':'var(--ky)',
                  'Lộc':'var(--luc)','Quyền':'var(--quyen)','Khoa':'var(--khoa)','Kỵ':'var(--ky)'};

let gender = 'male', selIdx = null, CHART = null;

function draw(){
  const date = document.getElementById('bdate').value;
  const tIdx = +hsel.value;
  if (!date) return;
  const [Y,M,D] = date.split('-').map(Number);
  CHART = astro.bySolar(`${Y}-${M}-${D}`, tIdx, gender, true, 'vi-VN');

  const board = document.getElementById('board');
  board.innerHTML = '';
  // center panel
  const center = document.createElement('div');
  center.className = 'center';
  const pillars = CHART.chineseDate.split(' - ');
  center.innerHTML = `
    <h2>Your Basics</h2>
    <div class="crow"><span>Born</span><span>${CHART.solarDate} · ${HOURS[tIdx][0]}</span></div>
    <div class="crow"><span>Lunar date</span><span>${CHART.rawDates.lunarDate.lunarDay}/${CHART.rawDates.lunarDate.lunarMonth}/${CHART.rawDates.lunarDate.lunarYear}${CHART.rawDates.lunarDate.isLeap?' (leap month)':''}</span></div>
    <div class="crow"><span>Your element</span><span>${ELEM_EN[CHART.fiveElementsClass]||CHART.fiveElementsClass}</span></div>
    <div class="crow"><span>Life star / Body star</span><span>${en(CHART.soul)} / ${en(CHART.body)}</span></div>
    <div class="crow"><span>Animal · Star sign</span><span>${ZODIAC_EN[CHART.zodiac]||CHART.zodiac} · ${SIGN_EN[CHART.sign.replace('Cung ','')]||CHART.sign}</span></div>
    <div class="pillars">${['Year','Month','Day','Hour'].map((l,i)=>`<div class="pillar"><span>${l}</span><b>${pillars[i]?pillarEn(pillars[i]):''}</b></div>`).join('')}</div>`;
  board.appendChild(center);
  // ensure center occupies its grid area even with later-appended cells
  center.style.gridColumn = '2 / 4'; center.style.gridRow = '2 / 4';

  CHART.palaces.forEach((p, i)=>{
    const pos = BRANCH_POS[p.earthlyBranch];
    if (!pos) return;
    const cell = document.createElement('div');
    cell.className = 'cell' + (p.name==='Mệnh' ? ' menh' : '') + (i===selIdx ? ' sel' : '');
    cell.style.gridRow = (pos[0]+1); cell.style.gridColumn = (pos[1]+1);
    const majors = p.majorStars.map(s=>`<span class="mstar">${en(s.name)}<sup>${BRIGHTBARS[s.brightness]||''}</sup>${s.mutagen?mutBadge(s.mutagen):''}</span>`).join('');
    const minors = p.minorStars.map(s=>`${en(s.name)}${s.mutagen?mutBadge(s.mutagen):''}`).join(' · ');
    cell.innerHTML = `
      <div class="pname">${PAL_EN[p.name]||p.name}${p.isBodyPalace?'<span class="than">BODY</span>':''}</div>
      <div class="stemb">${sb(p.heavenlyStem, p.earthlyBranch)}</div>
      <div class="majors">${majors || '<span style="font-size:10px;color:var(--muted)">— no main star —</span>'}</div>
      <div class="minors">${minors}</div>
      <div class="adjs">${p.adjectiveStars.map(s=>en(s.name)).join(' · ')}</div>
      <div class="dec">Decade ${p.decadal.range[0]}–${p.decadal.range[1]}</div>`;
    cell.addEventListener('click', ()=>{ selIdx = i; draw(); showDetail(p); });
    board.appendChild(cell);
  });
}

const GOOD_BRIGHT = new Set(['Miếu','Vượng','Đắc']);
const BAD_BRIGHT = new Set(['Bất','Hạn','Hãm']);
const SAT_TINH = new Set(['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh','Địa Không','Địa Kiếp']);
const CAT_TINH = new Set(['Văn Xương','Văn Khúc','Tả Phù','Hữu Bật','Thiên Khôi','Thiên Việt','Lộc Tồn']);

function quickRead(p){
  const strengths = [], frictions = [];
  for (const s of p.majorStars){
    const mz = s.mutagen ? (s.mutagen.startsWith('Hóa') ? s.mutagen : 'Hóa ' + s.mutagen) : '';
    if (GOOD_BRIGHT.has(s.brightness)) strengths.push(`Your star <b>${en(s.name)}</b> is running at full power in this box. Translation: you get the good version of it here, not the messy one.`);
    if (BAD_BRIGHT.has(s.brightness)) frictions.push(`Your star <b>${en(s.name)}</b> is running weak in this box. Translation: you get more of its bad habits than its gifts here, so this part of life needs you to actually pay attention.`);
    if (mz === 'Hóa Lộc') strengths.push(`<b>${en(s.name)}</b> got stamped with "Gain" — think of it like a tailwind. Money, chances, and people wanting to help show up easier in this part of your life. Free luck. Use it.`);
    if (mz === 'Hóa Quyền') strengths.push(`<b>${en(s.name)}</b> got stamped with "Power" — basically a turbo button. You go hard in this part of life without even trying. Great when you aim it, obnoxious when you don't.`);
    if (mz === 'Hóa Khoa') strengths.push(`<b>${en(s.name)}</b> got stamped with "Fame" — kind of an airbag. People respect you here, and when you screw up in this part of life, something usually softens the crash.`);
    if (mz === 'Hóa Kỵ') frictions.push(`<b>${en(s.name)}</b> got stamped with "Friction" — and this is THE problem spot of your entire chart. Stuff gets stuck, tangled, or leaks money here. The weird fix: stop squeezing. Leave yourself extra cash, extra time, a backup plan, and most of the trouble never shows up.`);
  }
  for (const s of p.minorStars){
    const mz = s.mutagen ? (s.mutagen.startsWith('Hóa') ? s.mutagen : 'Hóa ' + s.mutagen) : '';
    if (CAT_TINH.has(s.name)) strengths.push(`<b>${en(s.name)}</b> — ${TUVI.MINOR[s.name]||''}`);
    if (SAT_TINH.has(s.name)) frictions.push(`<b>${en(s.name)}</b> — ${TUVI.MINOR[s.name]||''}`);
    if (mz === 'Hóa Kỵ') frictions.push(`<b>${en(s.name)}</b> got stamped with "Friction" — meaning this star causes more headaches than help in this part of your life.`);
    if (mz === 'Hóa Lộc' || mz === 'Hóa Quyền' || mz === 'Hóa Khoa') strengths.push(`<b>${en(s.name)}</b> got stamped with "${MUT_EN[mz.replace('Hóa ','')]}" — a bonus that works in your favor here.`);
  }
  return {strengths, frictions};
}

function showDetail(p){
  const d = document.getElementById('detail');
  const dom = TUVI.DOMAINS[p.name] || 'One of the twelve palaces of the chart.';
  const qr = quickRead(p);

  let majorsHtml = '';
  if (p.majorStars.length){
    majorsHtml = p.majorStars.map(s=>{
      const S = TUVI.STARS[s.name];
      if (!S) return '';
      const bright = TUVI.BRIGHT[s.brightness];
      const hoa = s.mutagen ? TUVI.HOA[s.mutagen.startsWith('Hóa') ? s.mutagen : 'Hóa ' + s.mutagen] : '';
      return `<div class="starblock">
        <h4>${en(s.name)}${s.brightness?` <span class="bshort">· power: ${bright?bright[0]:s.brightness}</span>`:''}${s.mutagen?` ${mutBadge(s.mutagen)}`:''}</h4>
        <p class="arch">${S.arch}</p>
        <p class="inpal"><b>What this star means for your ${PAL_EN[p.name]||p.name.toLowerCase()}:</b> ${S.pal[p.name]||''}</p>
        ${bright?`<p class="bline"><b>How strong is this star here?</b> ${bright[1]}.</p>`:''}
        ${hoa?`<p class="hline">${hoa}</p>`:''}
        <div class="dd">
          <div><b>Do</b><ul>${S.dos.map(x=>`<li>${x}</li>`).join('')}</ul></div>
          <div><b>Don’t</b><ul>${S.donts.map(x=>`<li>${x}</li>`).join('')}</ul></div>
        </div>
      </div>`;
    }).join('');
  } else {
    const opp = CHART.palaces[(p.index+6)%12];
    majorsHtml = `<div class="starblock"><h4>Vô chính diệu — no major star</h4>
      <p class="arch">An "empty" palace — and that’s okay. The tradition reads it by borrowing the main stars from the palace across from it (your ${PAL_EN[opp.name]||opp.name} palace: ${opp.majorStars.map(s=>en(s.name)).join(', ')||'also empty'}), just expressed more softly. In plain terms: this part of life is shaped more by outside events and by that opposite area than by a fixed inner pattern. Keep it flexible. Borrow structure on purpose. Don’t force it to act like an area with a strong star.</p></div>`;
  }

  const minorsHtml = p.minorStars.length
    ? p.minorStars.map(s=>`<li><b>${en(s.name)}</b>${s.mutagen?` ${mutBadge(s.mutagen)}`:''} — ${TUVI.MINOR[s.name]||'supporting star.'}</li>`).join('')
    : '';
  const adjHtml = p.adjectiveStars.map(s=>`<li><b>${en(s.name)}</b> — ${TUVI.ADJ[s.name]||'a small background star. Light accent, not a driver.'}</li>`).join('');

  d.innerHTML = `
    <h3>${PAL_EN[p.name]||p.name} Palace · ${sb(p.heavenlyStem,p.earthlyBranch)}${p.isBodyPalace?' · your BODY palace (the area your life slowly centers on after about age 35)':''}</h3>
    <p class="dom">${dom} This palace also runs your life’s ages ${p.decadal.range[0]}–${p.decadal.range[1]} (each palace takes a 10-year shift).</p>
    <p class="howto">Quick reminder: <b>stars</b> are the characters that landed in this box — each one has a personality. <b>Power</b> (bars) is how strong that star is here. Some stars also get <b>stamped</b> with Gain, Power, Fame, or Friction — bonuses and curses on top.</p>
    ${(qr.strengths.length||qr.frictions.length)?`<div class="qr">
      ${qr.strengths.length?`<div class="qcol qgood"><b>Working for you here</b><ul>${qr.strengths.map(x=>`<li>${x}</li>`).join('')}</ul></div>`:''}
      ${qr.frictions.length?`<div class="qcol qbad"><b>Friction to manage here</b><ul>${qr.frictions.map(x=>`<li>${x}</li>`).join('')}</ul></div>`:''}
    </div>`:''}
    ${majorsHtml}
    ${minorsHtml?`<div class="mgroup"><b class="glabel">Backup stars</b><p class="gnote">Think of these as the supporting cast. They help or annoy the main star above, but they don’t run the show.</p><ul class="mlist">${minorsHtml}</ul></div>`:''}
    ${adjHtml?`<div class="mgroup"><b class="glabel">Extra little stars</b><p class="gnote">These are the small stuff — like seasoning on food. Each one nudges this part of your life maybe 5–10%. Fun to read, not a big deal on their own.</p><ul class="mlist adj">${adjHtml}</ul></div>`:''}
    <p class="tradnote">These readings describe what the classical Purple Star Astrology tradition says. Different schools teach it a bit differently. This describes the tradition — it does not predict your life.</p>`;
  d.scrollIntoView({behavior:'smooth', block:'nearest'});
}

document.getElementById('bdate').addEventListener('change', draw);
hsel.addEventListener('change', draw);
document.getElementById('gm').addEventListener('click', ()=>{ gender='male'; document.getElementById('gm').classList.add('on'); document.getElementById('gf').classList.remove('on'); draw(); });
document.getElementById('gf').addEventListener('click', ()=>{ gender='female'; document.getElementById('gf').classList.add('on'); document.getElementById('gm').classList.remove('on'); draw(); });
draw();
