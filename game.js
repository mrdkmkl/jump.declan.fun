/* ════════════════════════════════════════
   VERSION
════════════════════════════════════════ */
(function(){
  const BASE = 'V1.0.94';
  try{
    const el = document.getElementById('version-tag');
    if(el) el.textContent = BASE + ' (alpha)';
  }catch(e){}
})();

/* ════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════ */
const GRAVITY        = 0.24;
const JUMP1          = -12.2;
const JUMP2          = -10.8;
const MOVE_SPEED     = 5.2;
const BOOST_FORCE    = -5.5;
const ULTRA_BOOST_FORCE = -16.5;
const MAX_BOOSTS     = 10;
const MAX_ULTRA      = 3;
const ULTRA_REGEN    = 10;
const PLAT_H         = 12;
const GAP_BASE       = 62;
const DIFF_SCALE_PER_1000M = 0.008;  // gap grows by 0.008× every 1000 score pts (much gentler)
const COIN_VALUE     = 100;    // base coin value on platforms / shower (multipliers apply on top)
const BOUNCE_COIN_VALUE = 10;  // base coin value earned from bouncing on a platform (multipliers apply on top)
const MONEYBAG_VALUE = 10000;  // rare high-value pickup found on some platforms

/* ════════════════════════════════════════
   SHOP / POWERUP DATA
════════════════════════════════════════ */
const SHOP_ITEMS = [
  // ── MOVEMENT ──
  {id:'double_jump',    icon:'🦅',    name:'double jump',    desc:'one extra mid-air jump this round',            price:55,  type:'run', key:'doubleJump'},
  {id:'triple_jump',    icon:'🦅🦅',  name:'triple jump',    desc:'two extra mid-air jumps this round',           price:64, type:'run', key:'tripleJump'},
  {id:'quad_jump',      icon:'🦅🦅🦅',name:'quad jump',      desc:'three extra mid-air jumps this round',         price:78, type:'run', key:'quadJump'},
  {id:'spring_boots',   icon:'🥾',    name:'spring boots',   desc:'jump 25% higher this round',                  price:58,  type:'run', key:'springBoots'},
  {id:'hyper_boots',    icon:'👟',    name:'hyper boots',    desc:'jump 50% higher — bounces too',                price:76, type:'run', key:'hyperBoots'},
  {id:'slow_fall',      icon:'🪂',    name:'slow fall',      desc:'hold ↑ to glide slowly this round',           price:57,  type:'run', key:'slowFall'},
  {id:'jetpack',        icon:'🚀',    name:'jetpack',        desc:'unlimited jumps for 10 seconds',               price:80, type:'run', key:'jetpack'},
  {id:'rocket_boost',   icon:'🔥',    name:'rocket boost',   desc:'+3 ultra boost charges for this round',       price:62, type:'run', key:'rocketBoost'},
  {id:'turbo',          icon:'🏎️',    name:'turbo',          desc:'move 30% faster left/right',                  price:60, type:'run', key:'turbo'},
  {id:'wall_bounce',    icon:'🏀',    name:'wall bounce',    desc:'bounce off screen edges instead of wrapping', price:59,  type:'run', key:'wallBounce'},
  {id:'low_gravity',    icon:'🌙',    name:'low gravity',    desc:'reduced gravity — floatier jumps all round',   price:66, type:'run', key:'lowGravity'},
  // ── COLLECTION ──
  {id:'coin_double',    icon:'💰',    name:'coin×2',         desc:'earn double coins this entire round',          price:59,  type:'run', key:'coinDouble'},
  {id:'coin_triple',    icon:'💎',    name:'coin×3',         desc:'earn triple coins this entire round',          price:74, type:'run', key:'coinTriple'},
  {id:'coin_quintuple', icon:'💎💎',  name:'coin×5',         desc:'earn 5× coins this entire round',             price:110, type:'run', key:'coinQuintuple'},
  {id:'magnet',         icon:'🧲',    name:'coin magnet',    desc:'auto-collect nearby coins this round',         price:58,  type:'run', key:'magnet'},
  {id:'magnet_plus',    icon:'🧲✨',  name:'super magnet',   desc:'mega coin attraction radius this round',       price:74, type:'run', key:'magnetPlus'},
  {id:'coin_trail',     icon:'🌟',    name:'star trail',     desc:'leave a trail that collects coins around you', price:64, type:'run', key:'coinTrail'},
  // ── SURVIVAL ──
  {id:'shield',         icon:'🛡️',    name:'shield',         desc:'survive one deadly fall this round',           price:72, type:'run', key:'shield'},
  {id:'double_shield',  icon:'🛡️🛡️',  name:'double shield',  desc:'survive two deadly falls this round',         price:90, type:'run', key:'doubleShield'},
  {id:'triple_shield',  icon:'🛡️🛡️🛡️',name:'triple shield',  desc:'survive three deadly falls this round',      price:115, type:'run', key:'tripleShield'},
  {id:'ghost',          icon:'👻',    name:'ghost mode',     desc:'phase through dissolving platforms this round',price:63, type:'run', key:'ghost'},
  {id:'last_chance',    icon:'🫀',    name:'last chance',    desc:'auto-triggers ultra boost when you fall off',  price:75, type:'run', key:'lastChance'},
  {id:'sticky_boots',   icon:'🦶',    name:'sticky boots',   desc:'stay on dissolving platforms 2× longer',      price:57,  type:'run', key:'stickyBoots'},
  // ── BOOSTS ──
  {id:'boost_tank',     icon:'⚡',    name:'boost tank',     desc:'+4 boost charges for this round',             price:56,  type:'run', key:'boostTank'},
  {id:'boost_tank2',    icon:'⚡⚡',  name:'mega tank',      desc:'+8 boost charges for this round',             price:66, type:'run', key:'boostTank2'},
  {id:'boost_regen',    icon:'🔋',    name:'boost regen',    desc:'boosts regenerate automatically over time',   price:70, type:'run', key:'boostRegen'},
  {id:'free_boost',     icon:'🆓',    name:'free boost',     desc:'first 3 boosts each platform are free',       price:62, type:'run', key:'freeBoost'},
  // ── SPECIAL ──
  {id:'mini_mode',      icon:'🔻',    name:'tiny mode',      desc:'shrink — harder to miss gaps this round',      price:60, type:'run', key:'miniMode'},
  {id:'wide_body',      icon:'↔️',    name:'wide body',      desc:'player is wider — easier to land',            price:58,  type:'run', key:'wideBody'},
  {id:'time_warp',      icon:'⏱️',    name:'time warp',      desc:'everything moves 20% slower this round',       price:70, type:'run', key:'timeWarp'},
  {id:'platform_lock',  icon:'🔒',    name:'no dissolve',    desc:'dissolving platforms act normal this round',   price:61, type:'run', key:'platLock'},
  {id:'score_rush',     icon:'📈',    name:'score rush',     desc:'score increases 50% faster this round',        price:65, type:'run', key:'scoreRush'},
  {id:'extra_plats',    icon:'✨',    name:'extra platforms', desc:'more platforms spawn per height this round',   price:63, type:'run', key:'extraPlats'},
  {id:'lucky',          icon:'🍀',    name:'lucky',          desc:'double chance of good powerups on platforms',  price:62, type:'run', key:'lucky'},
  {id:'mirror',         icon:'🪞',    name:'mirror run',     desc:'platforms mirror left-right — more predictable',price:59, type:'run', key:'mirror'},
  // ── CURSED (shop) ──
  {id:'curse_ward',     icon:'🧿',    name:'curse ward',     desc:'any cursed powerup on a platform is skipped',  price:64, type:'run', key:'curseWard'},
  // ── ADVANCED ──
  {id:'platform_radar', icon:'📡',    name:'platform radar', desc:'platforms briefly glow before you land on them',price:61, type:'run', key:'platRadar'},
  {id:'coin_shower',    icon:'🌧️',    name:'coin shower',    desc:'coins rain from the sky for this run',          price:68, type:'run', key:'coinShower'},
  {id:'speed_cap',      icon:'🐢',    name:'slow cap',       desc:'max fall speed capped — easier to control',     price:58,  type:'run', key:'speedCap'},
  {id:'boost_on_land',  icon:'💫',    name:'bounce boost',   desc:'every bounce also gives +1 boost charge',       price:63, type:'run', key:'bounceBoost'},
  {id:'ultra_start',    icon:'⚡🔥',  name:'ultra start',    desc:'start with all ultra boosts fully charged',      price:64, type:'run', key:'ultraStart'},
  {id:'platform_wide',  icon:'📏',    name:'wide platforms', desc:'all platforms are 40% wider this round',        price:66, type:'run', key:'widePlatforms'},
  {id:'score_x2_boost', icon:'🎯',    name:'boost scorer',   desc:'each boost used adds +2 bonus score',           price:62, type:'run', key:'boostScorer'},
  {id:'parachute',      icon:'🎈',    name:'parachute',      desc:'if you fall, float down slowly for 3 seconds',  price:65, type:'run', key:'parachute'},
  {id:'coin_bomb',      icon:'💣',    name:'coin bomb',      desc:'start with 5 bonus coins already in wallet',    price:55,  type:'run', key:'coinBomb'},
  // ── NEW ITEMS ──
  {id:'phase_dash',     icon:'💨',    name:'phase dash',     desc:'double-tap left/right to dash through platforms',price:68, type:'run', key:'phaseDash'},
  {id:'score_saver',    icon:'🏦',    name:'score saver',    desc:'your high score cannot be beaten this run — only tied or improved',price:68, type:'run', key:'scoreSaver'},
  {id:'coin_interest',  icon:'📊',    name:'coin interest',  desc:'earn +1 coin every 5 seconds automatically',    price:64, type:'run', key:'coinInterest'},
  {id:'double_boost',   icon:'⚡⚡', name:'double boost',   desc:'each boost charge counts as two this round',     price:72, type:'run', key:'doubleBoost'},
  {id:'platform_spring',icon:'🌀',    name:'spring pad',     desc:'every 5th platform is a super spring',          price:65, type:'run', key:'springPad'},
  {id:'head_start',     icon:'🚀',    name:'head start',     desc:'begin 200m up — already climbing',              price:70, type:'run', key:'headStart'},
  {id:'safe_landing',   icon:'🛬',    name:'safe landing',   desc:'never die from hitting the ground for 3 falls', price:68, type:'run', key:'safeLanding'},
  {id:'score_streak',   icon:'🔥',    name:'score streak',   desc:'land 5 platforms in a row for a 2× score burst', price:66, type:'run', key:'scoreStreak'},
  {id:'rainbow_trail',  icon:'🌈',    name:'rainbow trail',  desc:'leave a rainbow trail — also attracts coins',   price:61, type:'run', key:'rainbowTrail'},
  {id:'death_save',     icon:'💀',    name:'death save',     desc:'if you die, respawn once on the nearest platform',price:95,type:'run', key:'deathSave'},
  // ── VALUE BUNDLES (20c, stacked benefits) ──
  {id:'starter_pack',   icon:'🎁',    name:'starter pack',   desc:'double jump + boost tank + coin×2, all in one', price:70, type:'run', key:'starterPack'},
  {id:'safety_net',     icon:'🪢',    name:'safety net',     desc:'shield + sticky boots + platform radar, bundled', price:70, type:'run', key:'safetyNet'},
  {id:'speed_demon',    icon:'🌪️',    name:'speed demon',    desc:'turbo + hyper boots + low gravity, bundled',   price:70, type:'run', key:'speedDemon'},
  {id:'coin_rush',      icon:'🤑',    name:'coin rush',      desc:'coin×3 + magnet + coin shower, bundled',       price:70, type:'run', key:'coinRush'},
  {id:'survivor_kit',   icon:'🧰',    name:'survivor kit',   desc:'mega boost tank + no dissolve + wide platforms',price:70, type:'run', key:'survivorKit'},
];

const PLATFORM_POWERUPS = [
  {id:'pu_boost_refill',   icon:'⚡', name:'boost refill',   desc:'fully refill all normal boosts',
    apply:()=>{ boosts=MAX_BOOSTS+(runPowerups.boostTank?4:0)+(runPowerups.boostTank2?8:0); updateBoostPips(); }},
  {id:'pu_ultra_charge',   icon:'🔥', name:'ultra charge',   desc:'+1 ultra boost charge',
    apply:()=>{ const maxU=MAX_ULTRA+(runPowerups.rocketBoost?3:0); ultraBoosts=Math.min(maxU,ultraBoosts+1); updateBoostPips(); }},
  {id:'pu_spring',         icon:'🥾', name:'spring bounce',  desc:'next 5 bounces are 30% higher',
    apply:()=>{ tempSpring=5; }},
  {id:'pu_shield',         icon:'🛡️', name:'shield',         desc:'survive one deadly fall',
    apply:()=>{ runPowerups.shield=true; }},
  {id:'pu_slow_fall',      icon:'🪂', name:'slow fall',      desc:'hold ↑ to glide for 8 seconds',
    apply:()=>{ tempSlowFall=8; }},
  {id:'pu_coin_magnet',    icon:'🧲', name:'coin magnet',    desc:'auto-collect coins for 10 seconds',
    apply:()=>{ tempMagnet=10; }},
  {id:'pu_ghost',          icon:'👻', name:'ghost',          desc:'phase through dissolving platforms for 6s',
    apply:()=>{ tempGhost=6; }},
  {id:'pu_double_coins',   icon:'💰', name:'coin×2',         desc:'double coin value for 12 seconds',
    apply:()=>{ tempCoinDouble=12; }},
  {id:'pu_mini',           icon:'🔻', name:'tiny mode',      desc:'shrink for 8s — harder to hit gaps',
    apply:()=>{ tempMini=8; }},
  {id:'pu_turbo',          icon:'🏎️', name:'turbo',          desc:'speed boost for 7 seconds',
    apply:()=>{ tempTurbo=7; }},
  {id:'pu_low_gravity',    icon:'🌙', name:'low gravity',    desc:'float gently for 8 seconds',
    apply:()=>{ tempLowGrav=8; }},
  {id:'pu_size_up',        icon:'⬛', name:'wide mode',      desc:'player widens for 6 seconds — easier landings',
    apply:()=>{ tempWide=6; }},
  {id:'pu_triple_coins',   icon:'💎', name:'coin×3',         desc:'triple coin value for 8 seconds',
    apply:()=>{ tempCoinTriple=8; }},
  {id:'pu_invincible',     icon:'⭐', name:'star power',     desc:'invincible for 4 seconds — platforms never dissolve',
    apply:()=>{ tempInvincible=4; }},
  {id:'pu_ultra_refill',   icon:'💥', name:'full ultra fill', desc:'fully refill all ultra boost charges',
    apply:()=>{ const maxU=MAX_ULTRA+(runPowerups.rocketBoost?3:0); ultraBoosts=maxU; updateBoostPips(); }},
  {id:'pu_bad_ice',        icon:'🌀', name:'slippery!',      desc:'CURSED: icy controls for 5 seconds',
    apply:()=>{ tempIce=5; }, bad:true},
  {id:'pu_bad_flip',       icon:'🙃', name:'flip!',          desc:'CURSED: reversed controls for 5 seconds',
    apply:()=>{ tempFlip=5; }, bad:true},
  {id:'pu_bad_heavy',      icon:'🪨', name:'heavy!',         desc:'CURSED: 2× gravity for 5 seconds',
    apply:()=>{ tempHeavy=5; }, bad:true},
  {id:'pu_bad_tiny',       icon:'🔬', name:'microscopic!',   desc:'CURSED: super tiny for 5 seconds — hard to see',
    apply:()=>{ tempBadTiny=5; }, bad:true},
  {id:'pu_bad_dark',       icon:'🌑', name:'lights out!',    desc:'CURSED: canvas dims for 5 seconds',
    apply:()=>{ tempDark=5; }, bad:true},
  {id:'pu_bad_shrink',     icon:'📌', name:'coin cut!',       desc:'CURSED: next 6 bounces earn no coins',
    apply:()=>{ tempNoCoin=6; }, bad:true},
  {id:'pu_parachute',      icon:'🎈', name:'parachute',       desc:'if you fall, float safely for 3 seconds',
    apply:()=>{ tempParachute=3; }},
  {id:'pu_score_burst',    icon:'🎯', name:'score burst',     desc:'+20 instant bonus score',
    apply:()=>{ score+=20; document.getElementById('hud-score').textContent=score; }},
  {id:'pu_warp_top',       icon:'🌀', name:'platform warp',  desc:'teleport to the highest visible platform',
    apply:()=>{ const top=platforms.filter(p=>!p.isFloor).reduce((a,b)=>a.y<b.y?a:b,{y:0}); if(top&&top.y!==0){player.y=top.y-player.h;player.vy=0;} }},
  {id:'pu_bad_blind',      icon:'😵', name:'dizzy!',          desc:'CURSED: camera wobbles badly for 5 seconds',
    apply:()=>{ tempDizzy=5; }, bad:true},
];

/* ════════════════════════════════════════
   SEASONAL ITEMS
   Unlock windows: 4 weeks before the holiday, on the day, and 1 week after.
   Christmas:      Dec 25  → unlocked Nov 27 – Jan 1
   St. Patrick's:  Mar 17  → unlocked Feb 17 – Mar 24
   Easter:         varies  → unlocked ~4 weeks before through 1 week after
   Thanksgiving:   4th Thu Nov → unlocked ~4 weeks before through 1 week after
════════════════════════════════════════ */

/* ── Easter calculation (Gregorian) ── */
function getEasterDate(year) {
  const a = year % 19, b = Math.floor(year/100), c = year % 100;
  const d = Math.floor(b/4), e = b % 4, f = Math.floor((b+8)/25);
  const g = Math.floor((b-f+1)/3), h = (19*a+b-d-g+15) % 30;
  const i = Math.floor(c/4), k = c % 4;
  const l = (32+2*e+2*i-h-k) % 7;
  const m = Math.floor((a+11*h+22*l)/451);
  const month = Math.floor((h+l-7*m+114)/31); // 1-based
  const day   = ((h+l-7*m+114) % 31)+1;
  return new Date(year, month-1, day);
}

/* ── 4th Thursday of November (US Thanksgiving) ── */
function getThanksgivingDate(year) {
  const nov1 = new Date(year, 10, 1);
  const firstThursday = ((4 - nov1.getDay() + 7) % 7) + 1;
  return new Date(year, 10, firstThursday + 21); // +21 = 4th Thursday
}

/* Returns true if today is within [holiday - 28 days, holiday + 7 days] */
function isSeasonalWindowActive(holiday) {
  const today = new Date();
  const year  = today.getFullYear();
  let hDate;
  switch(holiday) {
    case 'christmas':    hDate = new Date(year, 11, 25); break;
    case 'stpatricks':   hDate = new Date(year, 2, 17);  break;
    case 'easter':       hDate = getEasterDate(year);     break;
    case 'thanksgiving': hDate = getThanksgivingDate(year); break;
    default: return false;
  }
  const start = new Date(hDate); start.setDate(start.getDate() - 28);
  const end   = new Date(hDate); end.setDate(end.getDate() + 7);
  // Also check previous-year window in case we're in early January (Christmas)
  if(holiday === 'christmas') {
    const prevEnd = new Date(year-1, 11, 25); prevEnd.setDate(prevEnd.getDate()+7);
    if(today <= prevEnd) return true;
  }
  return today >= start && today <= end;
}

const SEASONAL_ITEMS = {
  christmas: [
    {id:'s_santa_hat',      icon:'🎅',   name:'santa hat',         desc:'all coins appear as gift boxes — +1 bonus coin each',       price:0, type:'run', key:'santaHat',     season:'christmas'},
    {id:'s_candy_cane',     icon:'🍬',   name:'candy cane boost',  desc:'boosts launch you higher with a candy-cane spin effect',    price:0, type:'run', key:'candyCane',    season:'christmas'},
    {id:'s_snowfall',       icon:'❄️',   name:'snowfall',          desc:'gentle snowflakes slow your fall speed by 20%',             price:0, type:'run', key:'snowfall',     season:'christmas'},
    {id:'s_reindeer',       icon:'🦌',   name:'reindeer dash',     desc:'dash left/right 50% faster for the whole run',             price:0, type:'run', key:'reindeerDash', season:'christmas'},
    {id:'s_elf_boost',      icon:'🧝',   name:'elf shoes',         desc:'+2 extra mid-air jumps this run',                          price:0, type:'run', key:'elfShoes',     season:'christmas'},
    {id:'s_gift_drop',      icon:'🎁',   name:'gift drop',         desc:'every 10th platform drops a mystery bonus — usually coins', price:0, type:'run', key:'giftDrop',     season:'christmas'},
    {id:'s_wreath',         icon:'💚',   name:'wreath shield',     desc:'absorb two deadly falls — wreath glows green',             price:0, type:'run', key:'wreathShield', season:'christmas'},
    {id:'s_snowglobe',      icon:'🔮',   name:'snow globe',        desc:'platforms never dissolve this run',                        price:0, type:'run', key:'snowGlobe',    season:'christmas'},
    {id:'s_xmas_star',      icon:'⭐',   name:'christmas star',    desc:'star power for 6s on first platform hit this run',         price:0, type:'run', key:'xmasStar',     season:'christmas'},
    {id:'s_bells',          icon:'🔔',   name:'jingle bells',      desc:'coin collection radius doubled this run',                   price:0, type:'run', key:'jingleBells',  season:'christmas'},
    {id:'s_tinsel',         icon:'✨',   name:'tinsel trail',      desc:'leave a golden sparkle trail that collects nearby coins',  price:0, type:'run', key:'tinselTrail',  season:'christmas'},
    {id:'s_chimney',        icon:'🏠',   name:'chimney warp',      desc:'teleport upward by 200m once per run (auto at 500m)',      price:0, type:'run', key:'chimneyWarp',  season:'christmas'},
    {id:'s_fruitcake',      icon:'🎂',   name:'fruitcake armor',   desc:'take one hit from any cursed powerup - it is negated',     price:0, type:'run', key:'fruitcake',    season:'christmas'},
    {id:'s_nutcracker',     icon:'🪆',   name:'nutcracker march',  desc:'score increases 75% faster this run',                      price:0, type:'run', key:'nutcracker',   season:'christmas'},
    {id:'s_snowball',       icon:'🌨️',  name:'snowball throw',     desc:'+5 ultra boost charges start fully loaded',                price:0, type:'run', key:'snowball',     season:'christmas'},
    {id:'s_mistletoe',      icon:'🌿',   name:'mistletoe luck',    desc:'triple powerup spawn chance; cursed ones become benign',   price:0, type:'run', key:'mistletoe',    season:'christmas'},
  ],
  stpatricks: [
    {id:'s_shamrock',       icon:'☘️',   name:'shamrock luck',     desc:'every 4th bounce earns +4 bonus coins',                    price:0, type:'run', key:'shamrockLuck', season:'stpatricks'},
    {id:'s_leprechaun',     icon:'🧑‍🌾', name:'leprechaun run',    desc:'coins appear 3× more frequently on platforms',            price:0, type:'run', key:'leprechaunRun',season:'stpatricks'},
    {id:'s_pot_of_gold',    icon:'🪙',   name:'pot of gold',       desc:'start with 20 bonus coins already in wallet',              price:0, type:'run', key:'potOfGold',    season:'stpatricks'},
    {id:'s_rainbow_path',   icon:'🌈',   name:'rainbow path',      desc:'platforms shimmer rainbow — 30% wider than normal',       price:0, type:'run', key:'rainbowPath',  season:'stpatricks'},
    {id:'s_green_boots',    icon:'👞',   name:'green boots',       desc:'jump 40% higher; platforms glow green on land',            price:0, type:'run', key:'greenBoots',   season:'stpatricks'},
    {id:'s_four_leaf',      icon:'🍀',   name:'four-leaf clover',  desc:'bad powerups have a 75% chance to be good ones instead',  price:0, type:'run', key:'fourLeaf',     season:'stpatricks'},
    {id:'s_irish_jig',      icon:'💃',   name:'irish jig speed',   desc:'move 60% faster left/right all run',                       price:0, type:'run', key:'irishJig',     season:'stpatricks'},
    {id:'s_harp',           icon:'🎵',   name:'harp resonance',    desc:'ultra boosts recharge 50% faster than normal',            price:0, type:'run', key:'harpRegen',    season:'stpatricks'},
    {id:'s_clover_shield',  icon:'🛡️',  name:'clover shield',     desc:'survive 3 deadly falls — shields glow green',             price:0, type:'run', key:'cloverShield', season:'stpatricks'},
    {id:'s_mist',           icon:'🌫️',  name:'morning mist',      desc:'slow fall always active — float gently downward',         price:0, type:'run', key:'irishMist',    season:'stpatricks'},
    {id:'s_emerald',        icon:'💚',   name:'emerald magnet',    desc:'mega coin pull radius; coins trail toward you',            price:0, type:'run', key:'emeraldMagnet',season:'stpatricks'},
    {id:'s_stout',          icon:'🍺',   name:'liquid courage',    desc:'gravity reduced by 40% all run',                          price:0, type:'run', key:'liquidCourage',season:'stpatricks'},
    {id:'s_cobblestone',    icon:'🪨',   name:'cobblestone grip',  desc:'stay on dissolving platforms 4× longer than normal',      price:0, type:'run', key:'cobblestone',  season:'stpatricks'},
    {id:'s_fiddle',         icon:'🎻',   name:'fiddle fever',      desc:'score multiplier increases 0.1× every 10 bounces',        price:0, type:'run', key:'fiddleFever',  season:'stpatricks'},
    {id:'s_gold_rush',      icon:'✨',   name:'gold rush',         desc:'coin shower active the entire run',                        price:0, type:'run', key:'goldRush',     season:'stpatricks'},
    {id:'s_leprechaun_hat', icon:'🎩',   name:"leprechaun's hat",  desc:'start with all boost types fully charged',                 price:0, type:'run', key:'lepHat',       season:'stpatricks'},
  ],
  easter: [
    {id:'s_easter_egg',     icon:'🥚',   name:'easter egg hunt',   desc:'hidden bonus coins scatter across every platform',         price:0, type:'run', key:'easterEgg',    season:'easter'},
    {id:'s_bunny_hop',      icon:'🐇',   name:'bunny hop',         desc:'extra bounce height +35%; ears make you taller (visual)',  price:0, type:'run', key:'bunnyHop',     season:'easter'},
    {id:'s_chick',          icon:'🐥',   name:'baby chick float',  desc:'slow fall always active; gentle feather drift downward',  price:0, type:'run', key:'chickFloat',   season:'easter'},
    {id:'s_jelly_bean',     icon:'🍬',   name:'jelly bean rush',   desc:'coins worth 3× for the first 60 seconds of the run',     price:0, type:'run', key:'jellyBean',    season:'easter'},
    {id:'s_tulip',          icon:'🌷',   name:'tulip spring',      desc:'platforms bounce you 20% higher than normal',             price:0, type:'run', key:'tulipSpring',  season:'easter'},
    {id:'s_pastel_cloud',   icon:'☁️',   name:'pastel cloud',      desc:'gravity reduced to 55%; floaty pastel run',               price:0, type:'run', key:'pastelCloud',  season:'easter'},
    {id:'s_nest',           icon:'🪺',   name:'egg nest shield',   desc:'absorb 2 deaths — nest cracks then breaks',               price:0, type:'run', key:'nestShield',   season:'easter'},
    {id:'s_daffodil',       icon:'🌼',   name:'daffodil magnet',   desc:'coins attracted from 150px away all run',                 price:0, type:'run', key:'daffodilMag',  season:'easter'},
    {id:'s_carrot',         icon:'🥕',   name:'carrot vision',     desc:'platform radar active all run - see where you land',      price:0, type:'run', key:'carrotVision', season:'easter'},
    {id:'s_lamb',           icon:'🐑',   name:'spring lamb',       desc:'move 45% faster; bouncy, lighter feel',                   price:0, type:'run', key:'springLamb',   season:'easter'},
    {id:'s_chocolate',      icon:'🍫',   name:'chocolate coins',   desc:'every platform drops +2 bonus coins on touch',            price:0, type:'run', key:'chocoCoins',   season:'easter'},
    {id:'s_painted_egg',    icon:'🎨',   name:'painted egg luck',  desc:'powerup chance tripled; cursed powerups skipped',         price:0, type:'run', key:'paintedEgg',   season:'easter'},
    {id:'s_spring_air',     icon:'🌬️',  name:'spring breeze',     desc:'ultra boosts cost 0 — use freely all run',                price:0, type:'run', key:'springBreeze', season:'easter'},
    {id:'s_renewal',        icon:'🌱',   name:'spring renewal',    desc:'revive once mid-run; score saved when you respawn',       price:0, type:'run', key:'springRenewal',season:'easter'},
    {id:'s_butterfly',      icon:'🦋',   name:'butterfly wings',   desc:'phase dash unlocked — double-tap direction to dash',      price:0, type:'run', key:'butterflyDash',season:'easter'},
    {id:'s_rainbow_egg',    icon:'🌈',   name:'rainbow egg burst', desc:'+50 instant score on first bounce, +5 every 10 bounces',  price:0, type:'run', key:'rainbowEgg',   season:'easter'},
  ],
  thanksgiving: [
    {id:'s_turkey',         icon:'🦃',   name:'turkey flight',     desc:'jetpack active for first 15 seconds of the run',          price:0, type:'run', key:'turkeyFlight', season:'thanksgiving'},
    {id:'s_pumpkin',        icon:'🎃',   name:'pumpkin armor',     desc:'absorb 3 deadly falls — pumpkin cracks each time',        price:0, type:'run', key:'pumpkinArmor', season:'thanksgiving'},
    {id:'s_cornucopia',     icon:'🌽',   name:'cornucopia wealth', desc:'coins worth 4× for the entire run',                       price:0, type:'run', key:'cornucopia',   season:'thanksgiving'},
    {id:'s_harvest',        icon:'🍂',   name:'harvest moon',      desc:'force night mode with a permanent golden glow',           price:0, type:'run', key:'harvestMoon',  season:'thanksgiving'},
    {id:'s_stuffing',       icon:'🍞',   name:'stuffing boots',    desc:'sticky boots + platforms never dissolve this run',        price:0, type:'run', key:'stuffingBoots',season:'thanksgiving'},
    {id:'s_cranberry',      icon:'🍒',   name:'cranberry bounce',  desc:'each bounce gives +1 boost charge (unlimited stack)',     price:0, type:'run', key:'cranberry',    season:'thanksgiving'},
    {id:'s_gravy',          icon:'🫙',   name:'gravy slide',       desc:'icy controls OFF; movement is extra smooth and precise',  price:0, type:'run', key:'gravySlide',   season:'thanksgiving'},
    {id:'s_pie',            icon:'🥧',   name:'pumpkin pie power', desc:'ultra boost force +50% for this run',                     price:0, type:'run', key:'piePower',     season:'thanksgiving'},
    {id:'s_apple',          icon:'🍎',   name:'apple cider rush',  desc:'score increases 2× faster than normal all run',          price:0, type:'run', key:'ciderRush',    season:'thanksgiving'},
    {id:'s_leaves',         icon:'🍁',   name:'autumn leaves',     desc:'coin shower active + coins rain as maple leaves',         price:0, type:'run', key:'autumnLeaves', season:'thanksgiving'},
    {id:'s_feast',          icon:'🍽️',  name:'feast mode',         desc:'start with 10 coins + all boost types fully stocked',    price:0, type:'run', key:'feastMode',    season:'thanksgiving'},
    {id:'s_giving',         icon:'🤝',   name:'spirit of giving',  desc:'each time a coin spawns, a bonus coin spawns beside it',  price:0, type:'run', key:'givingSpirit', season:'thanksgiving'},
    {id:'s_harvest_cart',   icon:'🛒',   name:'harvest cart',      desc:'magnet active all run + triple coin value',               price:0, type:'run', key:'harvestCart',  season:'thanksgiving'},
    {id:'s_owl',            icon:'🦉',   name:'wise owl sight',    desc:'platform radar + difficulty frozen for the run',          price:0, type:'run', key:'owlSight',     season:'thanksgiving'},
    {id:'s_acorn',          icon:'🌰',   name:'acorn hoard',       desc:'collect coins into reserve — double payout at run end',   price:0, type:'run', key:'acornHoard',   season:'thanksgiving'},
    {id:'s_bonfire',        icon:'🔥',   name:'bonfire warmth',    desc:'all cursed powerups converted to good ones this run',     price:0, type:'run', key:'bonfireWarmth',season:'thanksgiving'},
  ],
};

/* ── MEGA VAULT — high-end permanent gameplay boosts (one-time buy, active every run forever) ── */
const MEGA_ITEMS = [
  {id:'mega_bronze',    icon:'🥉', name:'bronze vault',    desc:'permanent: shield + sticky boots on every run, forever',                          price:5500,   type:'run', key:'megaBronze',    mega:true},
  {id:'mega_silver',    icon:'🥈', name:'silver vault',    desc:'permanent: double shield + mega boost tank on every run, forever',                price:5750,   type:'run', key:'megaSilver',    mega:true},
  {id:'mega_gold',      icon:'🥇', name:'gold vault',      desc:'permanent: turbo + hyper boots + low gravity on every run, forever',              price:6000,  type:'run', key:'megaGold',      mega:true},
  {id:'mega_platinum',  icon:'💠', name:'platinum vault',  desc:'permanent: triple shield + free boosts + no dissolve on every run, forever',       price:6500,  type:'run', key:'megaPlatinum',  mega:true},
  {id:'mega_diamond',   icon:'💎', name:'diamond vault',   desc:'permanent: jetpack + quad jump + ultra start + wide body on every run, forever',   price:7000,  type:'run', key:'megaDiamond',   mega:true},
  {id:'mega_legendary', icon:'👑', name:'legendary vault', desc:'permanent: death save + score saver + lucky + wide platforms + boost regen, forever', price:15000, type:'run', key:'megaLegendary', mega:true},
];
SHOP_ITEMS.push(...MEGA_ITEMS);

/* Flatten all seasonal items for lookup */
const ALL_SEASONAL_ITEMS = Object.values(SEASONAL_ITEMS).flat();

/* Returns which seasonal windows are currently open */
function getActiveSeasons() {
  return ['christmas','stpatricks','easter','thanksgiving'].filter(s => isSeasonalWindowActive(s));
}

/* Returns all seasonal items that are currently unlockable */
function getUnlockedSeasonalItems() {
  const active = getActiveSeasons();
  return ALL_SEASONAL_ITEMS.filter(it => active.includes(it.season));
}

/* ════════════════════════════════════════
   SKINS
════════════════════════════════════════ */
const SKINS = [
  // ── free starters ──
  {id:'skin_normal',   name:'normal',    price:0,      body:'#ffffff', accent:'rgba(0,0,0,.85)', special:null, coinMult:1},
  {id:'skin_slate',    name:'slate',     price:0,      body:'#7d8a99', accent:'rgba(40,50,60,.85)', special:null, coinMult:1},
  // ── paid skins, priced across 150c – 150,000c (ordered cheapest → priciest) ──
  {id:'skin_birch',    name:'birch',     price:150,      body:'#e8ddc7', accent:'rgba(90,75,45,.85)', special:null, coinMult:1},
  {id:'skin_clay',     name:'clay',      price:200,      body:'#b5651d', accent:'rgba(80,40,10,.85)', special:null, coinMult:1},
  {id:'skin_tiger',    name:'tiger',     price:250,      body:'#ff9f40', colors:['#ff9f40','#1a1a1a'], accent:'rgba(60,30,0,.9)', special:'stripes', coinMult:1},
  {id:'skin_moss',     name:'moss',      price:325,      body:'#7a8f5c', accent:'rgba(35,50,20,.85)', special:null, coinMult:1},
  {id:'skin_pebble',   name:'pebble',    price:425,      body:'#c9c9c9', accent:'rgba(70,70,70,.85)', special:null, coinMult:1.5},
  {id:'skin_coral',    name:'coral',     price:550,     body:'#ff6b6b', accent:'rgba(140,20,20,.85)', special:null, coinMult:2},
  {id:'skin_lilac',    name:'lilac',     price:700,     body:'#c9a8e0', accent:'rgba(90,55,110,.85)', special:null, coinMult:2.5},
  {id:'skin_seafoam',  name:'seafoam',   price:900,     body:'#8fd9c4', accent:'rgba(20,80,60,.85)', special:null, coinMult:3.5},
  {id:'skin_peach',    name:'peach',     price:1150,     body:'#ffbfa0', accent:'rgba(140,70,30,.85)', special:null, coinMult:4.5},
  {id:'skin_sunbeam',  name:'sunbeam',   price:1500,    body:'#ffd93d', accent:'rgba(150,110,0,.85)', special:null, coinMult:5},
  {id:'skin_mint',     name:'mint',      price:1950,    body:'#6bcf9c', accent:'rgba(15,90,55,.85)', special:null, coinMult:7},
  {id:'skin_candy',    name:'candy stripe', price:2500, body:'#ff6b9d', colors:['#ff6b9d','#6bd6ff'], accent:'rgba(120,20,70,.85)', special:'stripes', coinMult:8},
  {id:'skin_sky',      name:'sky',       price:3250,    body:'#5aa9e6', accent:'rgba(10,60,110,.85)', special:null, coinMult:10},
  {id:'skin_sunset',   name:'sunset',    price:4200,    body:'#ff9a56', colors:['#ff9a56','#ff6b9d','#845ec2'], accent:'rgba(90,30,70,.9)', special:'gradient', coinMult:12},
  {id:'skin_grape',    name:'grape',     price:5400,   body:'#a66bd6', accent:'rgba(70,20,100,.85)', special:null, coinMult:14},
  {id:'skin_aurora',   name:'aurora',    price:7000,   body:'#00c9a7', colors:['#00c9a7','#4d8dff','#845ec2'], accent:'rgba(15,50,80,.9)', special:'gradient', coinMult:18},
  {id:'skin_galaxy',   name:'galaxy',    price:9000,   body:'#1b1240', colors:['#ff6bd6','#6bd6ff','#ffe66b','#a66bd6'], accent:'rgba(200,200,255,.85)', special:'galaxy', coinMult:22},
  {id:'skin_copper',   name:'copper',    price:11600,   body:'#c07a4a', accent:'rgba(90,45,15,.9)', special:'metal', coinMult:25},
  {id:'skin_ember',    name:'ember',     price:15000,   body:'#ff7b3f', accent:'rgba(120,35,0,.85)', special:'glow', coinMult:27},
  {id:'skin_silver',   name:'silver',    price:19400,   body:'#c7ccd1', accent:'rgba(70,75,80,.9)', special:'metal', coinMult:29},
  {id:'skin_camo',     name:'tropical camo', price:25000, body:'#6bcf9c', colors:['#6bcf9c','#ffd93d','#ff6b6b','#4d8dff'], accent:'rgba(20,60,30,.9)', special:'camo', coinMult:32},
  {id:'skin_titanium', name:'titanium',  price:32300,   body:'#8a92a6', accent:'rgba(40,45,60,.9)', special:'metal', coinMult:34},
  {id:'skin_obsidian', name:'obsidian',  price:41700,  body:'#2b2b3a', accent:'rgba(180,180,220,.85)', special:'glow', coinMult:36},
  {id:'skin_platinum', name:'platinum',  price:53900,  body:'#e2e6ea', accent:'rgba(90,95,100,.9)', special:'metal', coinMult:40},
  {id:'skin_gold',     name:'gold',      price:69600,  body:'#ffcc33', accent:'rgba(110,70,0,.9)', special:'shine', coinMult:43},
  {id:'skin_sunny',    name:'sunny',     price:89900,  body:'#ffe14d', accent:'rgba(150,110,0,.9)', special:'sunny', coinMult:45},
  {id:'skin_holo',     name:'holo',      price:116000,  body:'holo',    accent:'rgba(60,20,90,.85)', special:'holo', coinMult:48},
  {id:'skin_diamond',  name:'diamond',   price:150000, body:'#bdf3ff', accent:'rgba(20,80,100,.9)', special:'shine', coinMult:95},
];
const SKINS_UNLOCK_COST = 500;

/* ── PETS — permanent, only one equipped at a time; boost speed + coins ── */
const PETS = [
  {id:'pet_panda',   icon:'🐼', name:'panda',   price:1000,  speedMult:1.05, coinMult:1.10, desc:'small speed boost · +10% coins'},
  {id:'pet_giraffe', icon:'🦒', name:'giraffe', price:5000,  speedMult:1.10, coinMult:1.25, desc:'better speed · +25% coins'},
  {id:'pet_turtle',  icon:'🐢', name:'turtle',  price:10000, speedMult:1.15, coinMult:1.50, desc:'strong speed · +50% coins'},
  {id:'pet_seal',    icon:'🦭', name:'seal',    price:20000, speedMult:1.25, coinMult:2.00, desc:'max speed · double coins'},
];

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let _actx = null;
let _masterGain = null;
function getACtx(){
  if(!_actx){ try{ _actx=new AudioCtx(); }catch(e){} }
  if(_actx && _actx.state==='suspended') _actx.resume();
  if(_actx && !_masterGain){
    _masterGain = _actx.createGain();
    _masterGain.connect(_actx.destination);
  }
  if(_masterGain) _masterGain.gain.value = settings.soundVolume ?? 0.8;
  return _actx;
}
function getSfxDest(){
  getACtx();
  return (_masterGain || (_actx && _actx.destination));
}

function sfx(type){
  if(!settings.soundEnabled || !settings.sfxEnabled) return;
  const ac=getACtx(); if(!ac)return;
  const now=ac.currentTime;
  const osc=ac.createOscillator();
  const gain=ac.createGain();
  osc.connect(gain); gain.connect(getSfxDest());
  switch(type){
    case 'bounce':{
      osc.type='sine';
      osc.frequency.setValueAtTime(140,now);
      osc.frequency.exponentialRampToValueAtTime(280,now+0.06);
      gain.gain.setValueAtTime(0.18,now);
      gain.gain.exponentialRampToValueAtTime(0.001,now+0.12);
      osc.start(now); osc.stop(now+0.13);
      break;
    }
    case 'coin':{
      osc.type='triangle';
      osc.frequency.setValueAtTime(880,now);
      osc.frequency.exponentialRampToValueAtTime(1320,now+0.08);
      gain.gain.setValueAtTime(0.14,now);
      gain.gain.exponentialRampToValueAtTime(0.001,now+0.18);
      osc.start(now); osc.stop(now+0.19);
      break;
    }
    case 'boost':{
      osc.type='sawtooth';
      osc.frequency.setValueAtTime(200,now);
      osc.frequency.exponentialRampToValueAtTime(600,now+0.12);
      gain.gain.setValueAtTime(0.10,now);
      gain.gain.exponentialRampToValueAtTime(0.001,now+0.15);
      osc.start(now); osc.stop(now+0.16);
      break;
    }
    case 'ultra':{
      const osc2=ac.createOscillator(), g2=ac.createGain();
      osc2.connect(g2); g2.connect(ac.destination);
      osc.type='sawtooth';
      osc.frequency.setValueAtTime(60,now);
      osc.frequency.exponentialRampToValueAtTime(800,now+0.18);
      gain.gain.setValueAtTime(0.22,now);
      gain.gain.exponentialRampToValueAtTime(0.001,now+0.25);
      osc.start(now); osc.stop(now+0.26);
      osc2.type='sine';
      osc2.frequency.setValueAtTime(120,now);
      osc2.frequency.exponentialRampToValueAtTime(40,now+0.3);
      g2.gain.setValueAtTime(0.18,now);
      g2.gain.exponentialRampToValueAtTime(0.001,now+0.3);
      osc2.start(now); osc2.stop(now+0.31);
      break;
    }
    case 'powerup':{
      [0,0.08,0.16].forEach((t,i)=>{
        const o=ac.createOscillator(), g=ac.createGain();
        o.connect(g); g.connect(getSfxDest());
        o.type='triangle';
        o.frequency.setValueAtTime([523,659,784][i],now+t);
        g.gain.setValueAtTime(0.13,now+t);
        g.gain.exponentialRampToValueAtTime(0.001,now+t+0.12);
        o.start(now+t); o.stop(now+t+0.13);
      });
      return;
    }
    case 'powerup_bad':{
      osc.type='square';
      osc.frequency.setValueAtTime(300,now);
      osc.frequency.exponentialRampToValueAtTime(80,now+0.2);
      gain.gain.setValueAtTime(0.12,now);
      gain.gain.exponentialRampToValueAtTime(0.001,now+0.22);
      osc.start(now); osc.stop(now+0.23);
      break;
    }
    case 'jump':{
      osc.type='sine';
      osc.frequency.setValueAtTime(320,now);
      osc.frequency.exponentialRampToValueAtTime(480,now+0.07);
      gain.gain.setValueAtTime(0.10,now);
      gain.gain.exponentialRampToValueAtTime(0.001,now+0.10);
      osc.start(now); osc.stop(now+0.11);
      break;
    }
    case 'buy':{
      [0,0.05].forEach((t,i)=>{
        const o=ac.createOscillator(), g=ac.createGain();
        o.connect(g); g.connect(getSfxDest());
        o.type='triangle';
        o.frequency.setValueAtTime([660,990][i],now+t);
        g.gain.setValueAtTime(0.12,now+t);
        g.gain.exponentialRampToValueAtTime(0.001,now+t+0.1);
        o.start(now+t); o.stop(now+t+0.11);
      });
      return;
    }
    case 'die':{
      osc.type='sawtooth';
      osc.frequency.setValueAtTime(440,now);
      osc.frequency.exponentialRampToValueAtTime(55,now+0.4);
      gain.gain.setValueAtTime(0.18,now);
      gain.gain.exponentialRampToValueAtTime(0.001,now+0.42);
      osc.start(now); osc.stop(now+0.43);
      break;
    }
    default: return;
  }
}

/* ════════════════════════════════════════
   SETTINGS  (persisted to localStorage)
════════════════════════════════════════ */
const SETTINGS_KEY = 'jump_settings';
let settings = {
  soundEnabled:    true,
  soundVolume:     0.8,
  sfxEnabled:      true,
  lowPowerMode:    false,
  showFloatingAds: true,
  leftKey:         'ArrowLeft',
  rightKey:        'ArrowRight',
  jumpKey:         'ArrowUp',
  boostKey:        ' ',
  pauseKey:        'Escape',
};
function saveSettings(){
  const json = JSON.stringify(settings);
  try{ localStorage.setItem(SETTINGS_KEY, json); }catch(e){ console.warn('settings save failed', e); }
  applySettings();
}
function loadSettings(){
  try{
    const raw = localStorage.getItem(SETTINGS_KEY);
    if(raw){
      const s = JSON.parse(raw);
      if(s && typeof s === 'object') settings = Object.assign({}, settings, s);
    }
  }catch(e){ console.warn('settings load failed', e); }
  applySettings();
}
function applySettings(){
  document.body.classList.toggle('low-power', !!settings.lowPowerMode);
  if(_masterGain) _masterGain.gain.value = settings.soundEnabled ? (settings.soundVolume ?? 0.8) : 0;
}

/* ════════════════════════════════════════
   STATE
════════════════════════════════════════ */
let mode = 'easy';
let gameState = 'idle'; // idle playing paused dead
let paused = false;

let score = 0, coins = 0, runCoins = 0;
let savedCoins = 0;
let highScores = {easy:0, normal:0, hard:0, chaos:0, moon:0};
let owned = {};
let purchaseCounts = {};
let activeToggles = {};
let runPowerups = {};
let currentShopDiscounts = []; // [{id, pct, tier}] — 'yellow' or 'red', refreshed every open

// skins
let ownedSkins = {skin_normal:true};
let equippedSkin = 'skin_normal';
let skinsUnlocked = false; // reveals the rest of the skin list; slate becomes free once unlocked, everything else still costs coins

// pets
let ownedPets = {};
let equippedPet = null; // null = no pet equipped
let petsUnlocked = false;
const PETS_UNLOCK_COST = 2000;
let rebirthCount = 0;
let megaVaultUnlocked = false; // mega vault items are hidden behind '?' until this is bought for 5000c
const MEGA_VAULT_UNLOCK_COST = 5000;
let rebirthMult = 1; // permanent coin multiplier from rebirths (1 = none yet)

// all-time stats
let allTimeStats = {
  totalRuns: 0,
  totalCoins: 0,
  totalHeight: 0,
  bestScore: 0,
  bestHeight: 0,
  bestRunCoins: 0,
  bestMode: 'normal'
};

let player, platforms, particles, floatingCoins;
let cameraY = 0, cameraVY = 0;
let boosts = MAX_BOOSTS;
let ultraBoosts = MAX_ULTRA;
let ultraRegenTimer = 0;
let ultraFlash = 0;
let jetpackTimer = 0;
let animId = null, lastTime = 0;

let tempSpring = 0, tempSlowFall = 0, tempMagnet = 0, tempGhost = 0;
let tempCoinDouble = 0, tempMini = 0;
let tempIce = 0, tempFlip = 0, tempHeavy = 0;
let tempTurbo = 0, tempLowGrav = 0, tempWide = 0, tempCoinTriple = 0;
let tempInvincible = 0, tempBadTiny = 0, tempDark = 0;
let tempNoCoin = 0, tempParachute = 0, tempDizzy = 0;
let boostRegenTimer = 0;
let freeBoostsLeft = 0;
let parachuteActive = false;
let boostRefillClicks = 0; // resets each round; each click raises the price
let lastActivityTime = 0;  // ts of last real input (move/jump/boost) — for AFK check
const AFK_TIMEOUT = 20000; // ms of no directional input before "still playing?" shows
let afkPromptActive = false;

/* ════════════════════════════════════════
   CHEAT STATE
════════════════════════════════════════ */
const CHEAT_PASSWORD = '201302';
let cheatActive = false;
let cheatState = {
  scoreMultiplier: 1,        // multiplies score gain each tick
  scoreDivisor: 55,          // px of camera travel per score point
  gapOverride: null,         // override GAP_BASE (null = use default)
  platCountOverride: null,   // override target platform count
  platWidthMult: 1,          // multiply platform width
  puChanceOverride: null,    // override powerup chance 0-1 (null = default)
  dissolveOverride: null,    // override dissolve chance 0-1
  movingOverride: null,      // override moving chance 0-1
  gravityOverride: null,     // override GRAVITY
  jumpOverride: null,        // override JUMP1 magnitude
  speedOverride: null,       // override MOVE_SPEED
  boostForceOverride: null,  // override BOOST_FORCE magnitude
  maxBoostsOverride: null,   // override MAX_BOOSTS
  maxJumpsOverride: null,    // add extra mid-air jumps
  diffMult: 1,               // difficulty scale factor
  freezeDiff: false,         // lock difficulty at current
  infLives: false,           // infinite lives
  infBoosts: false,          // infinite boost charges
  coinShower: false,         // constant coin shower
  forceNight: false,         // lock to night
  forceDay: false,           // lock to day
  // ── 10 new cheats ──
  allSeasonalUnlocked: false, // unlock all seasonal shop items regardless of date
  zeroGravity: false,         // zero gravity — float freely
  speedrunMode: false,        // 10× score gain
  mirrorWorld: false,         // flip all controls permanently
  platinumRun: false,         // all platforms are wide + no dissolve
  ultraMegaBoost: false,      // ultra boost force ×3
  coinMultiplierX10: false,   // 10× coin value
  allShieldsActive: false,    // 5 shields at once
  teleportCheat: false,       // press T mid-run to warp +500m
  rainbowEverything: false,   // rainbow platforms + coin trail + radar all on
};

let pendingPU = null;
let puPaused = false;   // true only while powerup choice is pending
let curseDeclineFee = 110; // cost to skip a cursed power-up — starts at 110, +20 each decline (resets every run)

// state for previously-unwired shop powerups
let coinInterestTimer = 0;          // coin interest: seconds since last automatic coin
let landingCount = 0;               // non-floor platform landings this run (spring pad + score streak)
let runElapsed = 0;                 // seconds elapsed in the current run (jelly bean rush, etc)
let chimneyWarpUsed = false;        // seasonal: chimney warp — once per run
let rainbowEggFirstBounce = false;  // seasonal: rainbow egg burst — first-bounce bonus
let fiddleFeverMult = 1;            // seasonal: fiddle fever — score multiplier grows every 10 bounces
let lastPhaseDashTapTime = {left:0, right:0}; // phase dash: last tap time per direction, for double-tap detection
let phaseDashActive = 0;            // seconds remaining of pass-through movement after a phase dash
let deathSaveUsed = false;          // death save: only respawns once per run

const keys = {left:false, right:false, jump:false, boost:false, shift:false};
let jumpHeld = false, jumpCount = 0, maxJumps = 2;

/* ════════════════════════════════════════
   FLOATING IMAGES
   ─ Rendered on the canvas behind everything.
   ─ Each fires once when the player hits a score threshold.
   ─ Owner-configured list of image URLs below (up to 6, add/remove
     as many as you like from the config panel).
   ─ Images fly in from off-screen with canvas-drawn rockets, bob
     while visible, then fly back out.
   ─ If an image can't load, a styled placeholder card shows instead.

   CONFIGURATION:
     urls     — list of image URLs (16:9 ratio). every `interval`
                score points, one is picked at random and shown.
     interval — score points between each floating image (default 30)
     duration — seconds each image stays on screen (default 10)

   ROTATION RULE: images are shuffled into a "bag" and shown one at a
   time so every image appears once before any repeats, and the same
   image can never show twice in a row (including across the seam
   where the bag reshuffles).
════════════════════════════════════════ */
const FLOATING_IMG_CONFIG = {
  urls: ['ad1.jpg', 'ad2.jpg', 'ad3.jpg', 'ad4.jpg', 'ad5.jpg'],
  interval: 30,
  duration: 15,
};

/* ─── state ─────────────────────────────────────────────────────── */
let floatingImgConfig = { urls: [...FLOATING_IMG_CONFIG.urls], interval: FLOATING_IMG_CONFIG.interval, duration: FLOATING_IMG_CONFIG.duration };
let imgShuffleBag      = [];   // remaining shuffled urls for the current cycle
let lastShownImgUrl    = null; // prevents back-to-back repeats across a reshuffle
let nextImgTriggerScore= 30;   // score at which the next image is allowed to show
let fi                = null;        // single active floating card

/* ─── dismiss hit-test rect (updated each draw frame) ─────────────*/
let fiDismissBtn = null;  // {x,y,w,h} in screen coords, or null

/* ─── shuffle helpers ───────────────────────────────────────────── */
function refillImgShuffleBag(){
  const urls = (floatingImgConfig.urls || []).filter(Boolean);
  if(urls.length === 0) return [];
  const bag = [...urls];
  // Fisher-Yates shuffle
  for(let i = bag.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  // never let the same image repeat back-to-back across the reshuffle seam
  if(bag.length > 1 && bag[0] === lastShownImgUrl){
    const swapIdx = 1 + Math.floor(Math.random() * (bag.length - 1));
    [bag[0], bag[swapIdx]] = [bag[swapIdx], bag[0]];
  }
  return bag;
}

/* ─── spawn ─────────────────────────────────────────────────────── */
function spawnFloatingImg(url, duration){
  const W = canvas.width, H = canvas.height;
  const imgW = Math.min(340, Math.round(W * 0.44));
  const imgH = Math.round(imgW * 9 / 16);
  const padH = 50;

  const tX = 80 + Math.random() * (W - imgW - 160);
  const tY = 60 + Math.random() * (H * 0.52 - imgH - padH);

  // entry from closest edge
  const distTop    = tY;
  const distBottom = H - (tY + imgH);
  const distLeft   = tX;
  const distRight  = W - (tX + imgW);
  const minDist    = Math.min(distTop, distBottom, distLeft, distRight);
  let sX, sY;
  if      (minDist === distLeft)  { sX = -imgW - 80; sY = tY; }
  else if (minDist === distRight) { sX = W + 80;      sY = tY; }
  else if (minDist === distTop)   { sX = tX;           sY = -imgH - 80; }
  else                            { sX = tX;           sY = H + 80; }

  const img = new Image();
  img.src = url;

  fi = {
    img, loaded: false, failed: false,
    imgW, imgH,
    x: sX, y: sY,
    targetX: tX, targetY: tY,
    vx: 0, vy: 0,
    opacity: 0,
    phase: 'in',
    inT: 0,              // 0→1 progress of 1-second ease-in
    holdTimer: 0,
    duration: duration || 8,
    bobT: 0,
    rot: 0,              // current rotation in radians
    rotV: 0,             // rotation velocity
    rocketFlame: [],
    entryAngle: Math.atan2(tY - sY, tX - sX),
  };

  img.onload  = () => { if(fi && fi.img === img) fi.loaded = true; };
  img.onerror = () => { if(fi && fi.img === img) fi.failed = true; };
}

/* ─── dismiss ───────────────────────────────────────────────────── */
function dismissFloatingImg(){
  if(!fi) return;
  fi.phase = 'out';
  fi.vx = fi.vy = 0;
}

/* ─── check triggers — every `interval` score points, shuffled, no repeats ─── */
function checkFloatingImages(currentScore, currentHeightM){
  if(!settings.showFloatingAds) return;
  if(fi) return;
  const urls = (floatingImgConfig.urls || []).filter(Boolean);
  if(urls.length === 0) return;
  const interval = floatingImgConfig.interval || 30;
  if(currentScore < nextImgTriggerScore) return;

  if(imgShuffleBag.length === 0) imgShuffleBag = refillImgShuffleBag();
  const url = imgShuffleBag.shift();
  if(!url) return;
  lastShownImgUrl = url;
  nextImgTriggerScore += interval;
  spawnFloatingImg(url, floatingImgConfig.duration);
}

/* ─── update ────────────────────────────────────────────────────── */
function updateFloatingImg(dt){
  if(!fi) return;
  if(!fi.loaded && !fi.failed) return;

  const sec = dt / 60;

  if(fi.phase === 'in'){
    // ease-in over exactly 1 second using smoothstep
    fi.inT = Math.min(1, fi.inT + sec);
    const t = fi.inT;
    // smoothstep: 3t²-2t³  — starts slow, decelerates to stop, no bounce
    const ease = t * t * (3 - 2 * t);
    fi.x = fi.x + (fi.targetX - fi.x) * (1 - (1 - ease));
    fi.y = fi.y + (fi.targetY - fi.y) * (1 - (1 - ease));
    // simpler: interpolate directly from start
    if(!fi._sX){ fi._sX = fi.x; fi._sY = fi.y; }
    fi.x = fi._sX + (fi.targetX - fi._sX) * ease;
    fi.y = fi._sY + (fi.targetY - fi._sY) * ease;
    fi.opacity = ease;
    fi.rot = 0;
    if(fi.inT >= 1){
      fi.x = fi.targetX; fi.y = fi.targetY;
      fi.opacity = 1; fi.phase = 'hold';
      fi.bobT = 0; fi.rot = 0;
    }

  } else if(fi.phase === 'hold'){
    fi.bobT += sec;

    // ease the bob in during first 1.5s so it doesn't snap into motion
    const bobEase = Math.min(1, fi.bobT / 1.5);
    const smoothBob = bobEase * bobEase * (3 - 2 * bobEase); // smoothstep

    // slow vertical bob + lazy horizontal drift
    const bY = Math.sin(fi.bobT * 0.62) * 8 + Math.sin(fi.bobT * 0.28) * 4;
    const bX = Math.sin(fi.bobT * 0.40) * 4;
    fi.x = fi.targetX + bX * smoothBob;
    fi.y = fi.targetY + bY * smoothBob;

    // gentle rotation — ease in over same window, tiny max angle (±1.5°)
    const targetRot = Math.sin(fi.bobT * 0.35) * 0.026;
    fi.rotV += (targetRot - fi.rot) * 0.04 * dt;
    fi.rotV *= 0.88;
    fi.rot  += fi.rotV * smoothBob;

    fi.holdTimer += sec;
    if(fi.holdTimer >= fi.duration - 0.8) fi.phase = 'out';

  } else {
    // drift away in reverse entry direction, fade out
    fi.vx -= Math.cos(fi.entryAngle) * 0.25 * dt;
    fi.vy -= Math.sin(fi.entryAngle) * 0.25 * dt;
    fi.x  += fi.vx;
    fi.y  += fi.vy;
    fi.opacity = Math.max(0, fi.opacity - 0.028 * dt);
    if(fi.opacity <= 0){ fi = null; fiDismissBtn = null; return; }
  }

  if(!fi) return;

  /* ── rocket flame particles ── */
  const emit = fi.phase !== 'out';
  if(emit){
    const rCy = fi.y + fi.imgH * 0.5;
    const lx  = fi.x - 18,  ly = rCy;
    const rx  = fi.x + fi.imgW + 18, ry = rCy;
    for(let side2 = 0; side2 < 2; side2++){
      const ex = side2 === 0 ? lx : rx;
      const ey = side2 === 0 ? ly : ry;
      const n = 2 + Math.floor(Math.random() * 2);
      for(let k = 0; k < n; k++){
        const angle = Math.PI * 0.5 + (Math.random() - 0.5) * 0.6;
        const spd   = 1.2 + Math.random() * 2.2;
        const life  = 14 + Math.random() * 18;
        const r     = 1.8 + Math.random() * 2.5;
        const hot   = Math.random();
        const color = hot > 0.6
          ? `rgba(255,${Math.round(180+hot*60)},40,`
          : hot > 0.3 ? `rgba(255,${Math.round(80+hot*140)},0,`
          : `rgba(255,240,180,`;
        fi.rocketFlame.push({
          x: ex + (Math.random()-0.5)*4, y: ey + (Math.random()-0.5)*4,
          vx: (Math.random()-0.5)*0.8, vy: Math.sin(angle)*spd,
          r, life, maxLife: life, color
        });
      }
    }
  }
  for(let k = fi.rocketFlame.length-1; k >= 0; k--){
    const p = fi.rocketFlame[k];
    p.x += p.vx; p.y += p.vy; p.vy += 0.07; p.vx *= 0.94;
    p.r *= 0.95; p.life--;
    if(p.life <= 0 || p.r < 0.2) fi.rocketFlame.splice(k, 1);
  }
}

/* ─── draw ─────────────────────────────────────────────────────── */
function drawFloatingImg(){
  if(!fi || fi.opacity <= 0.01){ fiDismissBtn = null; return; }
  const showPlaceholder = !fi.loaded;
  const nightT = (typeof getDayNightT === 'function') ? getDayNightT() : 0;

  ctx.save();

  /* 1. flame particles (behind card) */
  fi.rocketFlame.forEach(p => {
    const a = (p.life / p.maxLife) * fi.opacity * 0.9;
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color + a.toFixed(2) + ')';
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
  });

  /* 2. card — translated + rotated around its center */
  const cx = fi.x + fi.imgW / 2;
  const cy = fi.y + fi.imgH / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(fi.rot);
  ctx.translate(-fi.imgW/2, -fi.imgH/2);

  // shadow
  ctx.globalAlpha = fi.opacity * 0.22;
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 28;
  ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 7;
  ctx.fillStyle = 'rgba(0,0,0,1)';
  ctx.beginPath(); ctx.roundRect(3, 7, fi.imgW, fi.imgH, 12); ctx.fill();
  ctx.shadowBlur = ctx.shadowOffsetX = ctx.shadowOffsetY = 0;

  // image or placeholder
  ctx.globalAlpha = fi.opacity;
  if(showPlaceholder || fi.failed){
    const grad = ctx.createLinearGradient(0,0,fi.imgW,fi.imgH);
    grad.addColorStop(0, nightT > 0.4 ? '#1a2535' : '#dde4ee');
    grad.addColorStop(1, nightT > 0.4 ? '#0f1820' : '#c8d4e3');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.roundRect(0, 0, fi.imgW, fi.imgH, 12); ctx.fill();
    ctx.fillStyle = nightT>0.4 ? 'rgba(180,200,255,0.5)' : 'rgba(80,100,140,0.45)';
    ctx.font = `${Math.round(fi.imgH*0.12)}px DM Mono,monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(fi.failed ? '⚠ image not found' : '⏳ loading…', fi.imgW/2, fi.imgH/2);
    ctx.strokeStyle = nightT>0.4 ? 'rgba(120,150,255,0.4)' : 'rgba(80,100,140,0.3)';
    ctx.lineWidth = 1.5; ctx.setLineDash([5,6]);
    ctx.beginPath(); ctx.roundRect(3,3,fi.imgW-6,fi.imgH-6,10); ctx.stroke();
    ctx.setLineDash([]);
  } else {
    ctx.save();
    ctx.beginPath(); ctx.roundRect(0,0,fi.imgW,fi.imgH,12); ctx.clip();
    ctx.drawImage(fi.img, 0, 0, fi.imgW, fi.imgH);
    ctx.restore();
  }

  // glass sheen
  ctx.globalAlpha = fi.opacity * 0.11;
  const sheen = ctx.createLinearGradient(0,0,0,fi.imgH*0.5);
  sheen.addColorStop(0,'rgba(255,255,255,1)'); sheen.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.save(); ctx.beginPath(); ctx.roundRect(0,0,fi.imgW,fi.imgH*0.5,[12,12,0,0]); ctx.clip();
  ctx.fillRect(0,0,fi.imgW,fi.imgH*0.5); ctx.restore();

  // border
  ctx.globalAlpha = fi.opacity * (nightT>0.4 ? 0.4 : 0.6);
  ctx.strokeStyle = nightT>0.4 ? 'rgba(160,190,255,1)' : 'rgba(255,255,255,1)';
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.roundRect(0,0,fi.imgW,fi.imgH,12); ctx.stroke();

  // ── dismiss button — top-right corner of card ──
  const btnR  = 11;
  const btnX  = fi.imgW - btnR - 8;
  const btnY  = btnR + 8;
  // store screen-space position for click hit-test (undo rotation for simplicity — use card AABB)
  ctx.globalAlpha = fi.opacity * 0.82;
  ctx.fillStyle   = 'rgba(20,20,18,0.75)';
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth   = 1.2;
  ctx.beginPath(); ctx.arc(btnX, btnY, btnR, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  ctx.fillStyle   = 'rgba(255,255,255,0.9)';
  ctx.font        = `bold ${Math.round(btnR*1.1)}px DM Mono,monospace`;
  ctx.textAlign   = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('×', btnX, btnY + 0.5);

  ctx.restore(); // undo card rotation transform

  // record dismiss button screen coords (approximate — axis-aligned)
  const screenBtnX = fi.x + (fi.imgW - btnR - 8);
  const screenBtnY = fi.y + (btnR + 8);
  fiDismissBtn = { x: screenBtnX - btnR - 6, y: screenBtnY - btnR - 6,
                   w: (btnR+6)*2, h: (btnR+6)*2 };

  /* 3. duration bar */
  if(fi.phase === 'hold'){
    const pct = Math.max(0, 1 - fi.holdTimer / fi.duration);
    const bY  = fi.y + fi.imgH + 7;
    ctx.globalAlpha = fi.opacity * 0.28;
    ctx.fillStyle   = 'rgba(0,0,0,0.5)';
    ctx.beginPath(); ctx.roundRect(fi.x, bY, fi.imgW, 4, 2); ctx.fill();
    const barCol = pct > 0.4 ? (nightT>0.4?'#7aadff':'#ffffff') : pct>0.15?'#ffcc44':'#ff5544';
    ctx.globalAlpha = fi.opacity * 0.8;
    ctx.fillStyle   = barCol;
    ctx.beginPath(); ctx.roundRect(fi.x, bY, fi.imgW*pct, 4, 2); ctx.fill();
  }

  /* 4. rockets */
  const rCy   = fi.y + fi.imgH * 0.5;
  const lBob  =  Math.sin(fi.bobT * 1.1) * 4;
  const rBob2 = -Math.sin(fi.bobT * 1.1) * 4;

  function drawRocket(cx2, cy2, pointLeft){
    ctx.save();
    ctx.translate(cx2, cy2);
    ctx.rotate(pointLeft ? Math.PI : 0);
    ctx.globalAlpha = fi.opacity * 0.95;
    const flameLen = 14 + Math.sin(fi.bobT * 8) * 5;
    const flamGrad = ctx.createLinearGradient(-flameLen-4,0,0,0);
    flamGrad.addColorStop(0,'rgba(255,255,255,0)'); flamGrad.addColorStop(0.3,'rgba(255,220,50,0.85)');
    flamGrad.addColorStop(0.7,'rgba(255,100,20,0.9)'); flamGrad.addColorStop(1,'rgba(255,60,0,1)');
    ctx.fillStyle = flamGrad;
    ctx.beginPath(); ctx.moveTo(-2,-5); ctx.lineTo(-flameLen-4,0); ctx.lineTo(-2,5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#888';
    ctx.beginPath(); ctx.moveTo(0,-4); ctx.lineTo(-7,-6); ctx.lineTo(-7,6); ctx.lineTo(0,4); ctx.closePath(); ctx.fill();
    const bodyGrad = ctx.createLinearGradient(0,-7,0,7);
    bodyGrad.addColorStop(0,'#f0f0f0'); bodyGrad.addColorStop(0.4,'#c8c8c8'); bodyGrad.addColorStop(1,'#888');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath(); ctx.roundRect(0,-6,22,12,4); ctx.fill();
    ctx.fillStyle = 'rgba(255,50,50,0.7)'; ctx.fillRect(8,-6,5,12);
    ctx.fillStyle = '#e84040';
    ctx.beginPath(); ctx.moveTo(22,-6); ctx.lineTo(30,0); ctx.lineTo(22,6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#a0d0ff'; ctx.strokeStyle = '#4488aa'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(15,0,4,0,Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#cc3333';
    ctx.beginPath(); ctx.moveTo(2,6); ctx.lineTo(-4,16); ctx.lineTo(10,6); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(2,-6); ctx.lineTo(-4,-16); ctx.lineTo(10,-6); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  drawRocket(fi.x - 22, rCy + lBob, true);
  drawRocket(fi.x + fi.imgW + 22, rCy + rBob2, false);

  ctx.restore();
}

/* ════════════════════════════════════════
   CANVAS
════════════════════════════════════════ */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
resize();
window.addEventListener('resize', resize);

// dismiss floating image on tap/click of the × button
canvas.addEventListener('click', e => {
  if(!fiDismissBtn) return;
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left, my = e.clientY - rect.top;
  const b = fiDismissBtn;
  if(mx >= b.x && mx <= b.x+b.w && my >= b.y && my <= b.y+b.h) dismissFloatingImg();
});
canvas.addEventListener('touchstart', e => {
  if(!fiDismissBtn) return;
  const rect = canvas.getBoundingClientRect();
  const t = e.touches[0];
  const mx = t.clientX - rect.left, my = t.clientY - rect.top;
  const b = fiDismissBtn;
  if(mx >= b.x && mx <= b.x+b.w && my >= b.y && my <= b.y+b.h){
    e.preventDefault(); dismissFloatingImg();
  }
}, {passive: false});

/* ════════════════════════════════════════
   MODE CONFIG
════════════════════════════════════════ */
function modeCfg(){
  switch(mode){
    case 'easy':  return {gap:.75, dissolve:.05, moving:.1,  speedMult:1};
    case 'hard':  return {gap:1.25,dissolve:.3,  moving:.4,  speedMult:1.3};
    case 'chaos': return {gap:1.5, dissolve:.45, moving:.5,  speedMult:1.5};
    case 'moon':  return {gap:1,   dissolve:.18, moving:.25, speedMult:1}; // same feel as normal — just the theme + gravity differ
    default:      return {gap:1,   dissolve:.18, moving:.25, speedMult:1};
  }
}

/* ════════════════════════════════════════
   PLATFORM FACTORY
════════════════════════════════════════ */
function makePlat(x, y, w, type, isFloor){
  // ── one item per platform, at most — rolled from a single dice so
  //    coins / money bags / powerups never stack on the same platform,
  //    and most platforms stay empty so the screen doesn't get cluttered ──
  const _basePu = cheatState.puChanceOverride != null ? cheatState.puChanceOverride : 0.20;
  const puChance = (typeof runPowerups !== 'undefined' && runPowerups.lucky) ? Math.min(1, _basePu*2) : _basePu;
  const bagChance = 0.035;   // rare — worth a lot
  const coinChance = 0.18;
  const itemRoll = Math.random();
  let hasCoin = false, hasBag = false, platPU = null;
  if(!isFloor){
    if(itemRoll < bagChance){
      hasBag = true;
    } else if(itemRoll < bagChance + coinChance){
      hasCoin = true;
    } else if(itemRoll < bagChance + coinChance + puChance){
      platPU = PLATFORM_POWERUPS[Math.floor(Math.random()*PLATFORM_POWERUPS.length)];
    }
  }
  const wBonus = (typeof runPowerups!=='undefined' && runPowerups.widePlatforms) ? w*0.4 : 0;
  w = w + wBonus;
  return {
    x, y, w, h: PLAT_H, type,
    alpha: 1, touched: false, dissolveT: 0,
    moveDir: Math.random()<.5?1:-1,
    moveSpd: (.5+Math.random()*.8) * modeCfg().speedMult,
    moveRange: 30+Math.random()*60,
    ox: x,
    hasCoin, coinCollected: false,
    coinY: 0, coinBob: Math.random()*Math.PI*2,
    hasBag, bagCollected: false,
    bagY: 0, bagBob: Math.random()*Math.PI*2,
    platPU,
    puRevealed: false,
    puBob: Math.random()*Math.PI*2,
    isFloor: !!isFloor
  };
}

function platType(){
  const cfg = modeCfg();
  const r = Math.random();
  const dProgress = cheatState.freezeDiff ? 0 : Math.min(score/40, 1);
  const d = (cheatState.dissolveOverride != null ? cheatState.dissolveOverride : cfg.dissolve) * dProgress;
  const m = (cheatState.movingOverride  != null ? cheatState.movingOverride  : cfg.moving)   * dProgress;
  if(r < d) return 'dissolving';
  if(r < d+m) return 'moving';
  return 'normal';
}

function spawnPlatforms(){
  platforms = [];
  const W = canvas.width;
  const H = canvas.height;

  // FLOOR — full-width ground platform
  const floorY = H - 30;
  const floor = makePlat(0, floorY, W, 'normal', true);
  floor.w = W;
  platforms.push(floor);

  let topY = floorY;
  for(let i=0;i<16;i++){
    const _gap0 = cheatState.gapOverride != null ? cheatState.gapOverride : GAP_BASE;
    topY -= _gap0 * modeCfg().gap * (.7+Math.random()*.6);
    const w = (60+Math.random()*90) * cheatState.platWidthMult;
    const x = 20+Math.random()*(W-w-40);
    const p = makePlat(x, topY, w, i<3?'normal':platType());
    platforms.push(p);
  }
}

function topPlatY(){
  if(!platforms || platforms.length===0) return cameraY; // safety net — never throw mid-run
  return platforms.reduce((a,b)=>a.y<b.y?a:b).y;
}

function coinGain(base=COIN_VALUE){
  let mult = cheatState.coinMultiplierX10 ? 10 :
    runPowerups.coinQuintuple?5 : (runPowerups.coinTriple||tempCoinTriple>0)?3 : (runPowerups.coinDouble||tempCoinDouble>0)?2 : 1;
  if(runPowerups.jellyBean && runElapsed<60) mult=Math.max(mult,3);
  const skinMult = (getEquippedSkin().coinMult) || 1;
  const petMult = getPetCoinMult();
  const flatBonus = runPowerups.santaHat ? 1 : 0;
  return Math.max(1, Math.round(base * mult * skinMult * petMult * rebirthMult) + flatBonus);
}

function spawnNewPlatform(diffMult=1){
  const W = canvas.width;
  const ty = topPlatY();
  const _gap = cheatState.gapOverride != null ? cheatState.gapOverride : GAP_BASE;
  const y = ty - _gap*modeCfg().gap*diffMult*(.65+Math.random()*.6);
  const rawW = 55+Math.random()*95;
  const w = rawW * cheatState.platWidthMult;
  let x = 15+Math.random()*(W-w-30);
  // mirror mode: mirror each platform around the centre
  if(runPowerups.mirror){
    const lastNonFloor = platforms.filter(p=>!p.isFloor);
    if(lastNonFloor.length>0){
      const prev=lastNonFloor[lastNonFloor.length-1];
      x = W - prev.x - w; // mirror
    }
  }
  x = Math.max(10, Math.min(W-w-10, x));
  platforms.push(makePlat(x,y,w,platType()));
}

/* ════════════════════════════════════════
   PLAYER
════════════════════════════════════════ */
function initPlayer(){
  // place player on the floor
  const floor = platforms.find(p=>p.isFloor) || platforms.reduce((a,b)=>a.y>b.y?a:b);
  // base player size — modified by shop items
  const baseW = runPowerups.miniMode ? 16 : runPowerups.wideBody ? 38 : 26;
  const baseH = runPowerups.miniMode ? 20 : 32;
  player = {
    x: floor.x + floor.w/2 - baseW/2,
    y: floor.y - baseH,
    w: baseW, h: baseH,
    vx: 0, vy: 0,
    onGround: false,
    trail: [],
    squish: 1, squishV: 0,
    dead: false
  };
  cameraY = 0; cameraVY = 0;
  jumpCount = 0;
  maxJumps = (cheatState.maxJumpsOverride != null ? cheatState.maxJumpsOverride : 2)
    + (runPowerups.doubleJump?1:0)
    + (runPowerups.tripleJump?1:0)
    + (runPowerups.quadJump?1:0)
    + (runPowerups.elfShoes?2:0);
  const bonusBoosts = (runPowerups.boostTank?4:0) + (runPowerups.boostTank2?8:0);
  const _maxB0 = cheatState.maxBoostsOverride != null ? cheatState.maxBoostsOverride : MAX_BOOSTS;
  boosts = _maxB0 + bonusBoosts;
  ultraBoosts = MAX_ULTRA + (runPowerups.rocketBoost?3:0);
  if(runPowerups.ultraStart) ultraBoosts = MAX_ULTRA + (runPowerups.rocketBoost?3:0); // already full
  // Seasonal init
  if(runPowerups.snowball)   ultraBoosts = MAX_ULTRA + 5; // snowball gives +5 ultra
  if(runPowerups.xmasStar)   tempInvincible = 6;  // star power on first hit
  ultraRegenTimer = 0;
  ultraFlash = 0;
  jetpackTimer = runPowerups.jetpack ? 10 : 0;
  floatingCoins = [];
  tempSpring=0; tempSlowFall=0; tempMagnet=0; tempGhost=0;
  tempCoinDouble=0; tempMini=0; tempIce=0; tempFlip=0; tempHeavy=0;
  tempTurbo=0; tempLowGrav=0; tempWide=0; tempCoinTriple=0;
  tempInvincible=0; tempBadTiny=0; tempDark=0;
  tempNoCoin=0; tempParachute=0; tempDizzy=0; parachuteActive=false;
  boostRegenTimer=0; freeBoostsLeft=runPowerups.freeBoost?3:0;
  pendingPU=null;
  puPaused=false;
  hidePUToast();
  imgShuffleBag = [];
  lastShownImgUrl = null;
  nextImgTriggerScore = floatingImgConfig.interval || 30;
  fi = null;
  fiDismissBtn = null;

  // ── new powerup state (reset every run) ──
  coinInterestTimer = 0;
  runElapsed = 0;
  chimneyWarpUsed = false;
  rainbowEggFirstBounce = false;
  fiddleFeverMult = 1;
  landingCount = 0;              // non-floor platform landings this run — drives spring pad + score streak
  lastPhaseDashTapTime = {left:0, right:0};
  phaseDashActive = 0;           // seconds remaining of pass-through after a double-tap dash
  deathSaveUsed = false;

  // head start: begin 200m up. Build a platform chain up to that height
  // and place the player on top of it so they land on solid ground.
  if(runPowerups.headStart){
    const H = canvas.height;
    const targetY = floor.y - 200*40; // 40px per metre, matches heightM calc
    let guard = 0;
    while(topPlatY() > targetY && guard < 600){ spawnNewPlatform(1); guard++; }
    const top = platforms.reduce((a,b)=>a.y<b.y?a:b);
    player.x = top.x + top.w/2 - baseW/2;
    player.y = top.y - baseH;
    cameraY = player.y - H*0.42;
    score = Math.max(0, Math.floor(-cameraY/55));
  }
}

/* ════════════════════════════════════════
   PARTICLES
════════════════════════════════════════ */
function spawnParticles(x,y,color,n=5){
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2, s=1+Math.random()*2.5;
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,r:1.5+Math.random()*2.5,alpha:1,color});
  }
}

function spawnCoinPopup(sx,sy,amount){
  const el=document.createElement('div');
  el.className='coin-popup';
  const val = amount !== undefined ? amount : coinGain();
  el.textContent=`+${val} ●`;
  el.style.left=sx+'px'; el.style.top=sy+'px';
  document.getElementById('game-screen').appendChild(el);
  setTimeout(()=>el.remove(),950);
}

function animateCoinHUD(){
  const strong=document.querySelector('.hud-coins-wrap strong');
  const dot=document.querySelector('.hud-coins-wrap .coin-dot');
  strong.textContent=savedCoins;
  strong.classList.remove('bump');
  dot.classList.remove('ping');
  void strong.offsetWidth;
  strong.classList.add('bump');
  dot.classList.add('ping');
  clearTimeout(strong._bumptimer);
  strong._bumptimer=setTimeout(()=>{strong.classList.remove('bump');dot.classList.remove('ping');},200);
  updateBoostRefillBtn();
}

/* ════════════════════════════════════════
   JUMP PIP UPDATE
════════════════════════════════════════ */
function updateJumpPips(){
  const el=document.getElementById('jump-pips');
  el.innerHTML='';
  for(let i=0;i<maxJumps;i++){
    const d=document.createElement('div');
    d.className='jump-pip '+(i<(maxJumps-jumpCount)?'ready':'used');
    el.appendChild(d);
  }
}

function boostRefillCost(){
  const total=MAX_BOOSTS+(runPowerups.boostTank?4:0)+(runPowerups.boostTank2?8:0);
  const maxU=MAX_ULTRA+(runPowerups.rocketBoost?3:0);
  const missing=Math.max(0,total-boosts)+Math.max(0,maxU-ultraBoosts)*4;
  // starting price 50c, scales up with how many boosts are missing, and escalates each click this round
  return Math.round((50 + missing*6) * Math.pow(1.5, boostRefillClicks));
}

function updateBoostRefillBtn(){
  const btn=document.getElementById('boost-refill-btn');
  if(!btn) return;
  const priceEl=document.getElementById('boost-refill-price');
  const maxU=MAX_ULTRA+(runPowerups.rocketBoost?3:0);
  if((boosts<6 || ultraBoosts<2) && gameState==='playing'){
    const cost=boostRefillCost();
    priceEl.textContent=cost;
    btn.classList.remove('hidden');
    btn.classList.toggle('cannot-afford', savedCoins<cost);
  } else {
    btn.classList.add('hidden');
  }
}

function buyBoostRefill(){
  if(gameState!=='playing') return;
  const cost=boostRefillCost();
  if(savedCoins<cost) return;
  savedCoins-=cost;
  const total=MAX_BOOSTS+(runPowerups.boostTank?4:0)+(runPowerups.boostTank2?8:0);
  const maxU=MAX_ULTRA+(runPowerups.rocketBoost?3:0);
  boosts=total;
  ultraBoosts=maxU;
  boostRefillClicks++;
  try{ localStorage.setItem('jump_coins',savedCoins); }catch(e){}
  animateCoinHUD();
  sfx('buy');
  updateBoostPips();
}

function updateBoostPips(){
  const el=document.getElementById('boost-pips');
  const total=MAX_BOOSTS+(runPowerups.boostTank?4:0)+(runPowerups.boostTank2?8:0);
  const maxU=MAX_ULTRA+(runPowerups.rocketBoost?3:0);
  el.innerHTML='';
  for(let i=0;i<total;i++){
    const d=document.createElement('div');
    d.className='boost-pip '+(i<boosts?'full':'');
    el.appendChild(d);
  }
  const sep=document.createElement('div');
  sep.style.cssText='width:1px;height:10px;background:rgba(255,255,255,.2);margin:0 3px';
  el.appendChild(sep);
  for(let i=0;i<maxU;i++){
    const d=document.createElement('div');
    d.className='boost-pip '+(i<ultraBoosts?'full':'');
    d.style.cssText=i<ultraBoosts
      ?'width:9px;height:9px;border-radius:3px;background:linear-gradient(135deg,#ff6b35,#ff3366);box-shadow:0 0 6px rgba(255,60,80,.5);transition:background .2s,transform .15s'
      :'width:9px;height:9px;border-radius:3px;background:rgba(255,255,255,.12);transition:background .2s,transform .15s';
    if(i===ultraBoosts&&ultraBoosts<maxU){
      const pct=ultraRegenTimer/ULTRA_REGEN;
      d.style.background=`linear-gradient(135deg, rgba(255,107,53,${pct}), rgba(255,51,102,${pct}))`;
      d.style.boxShadow=`0 0 ${pct*6}px rgba(255,60,80,${pct*.5})`;
    }
    el.appendChild(d);
  }
  updateBoostRefillBtn();
}

/* ════════════════════════════════════════
   PRICE SCALING — doubles each time an item is bought
════════════════════════════════════════ */
function itemPrice(item){
  const timesBought = purchaseCounts[item.id] || 0;
  return Math.round(item.price * Math.pow(2, timesBought));
}

/* ════════════════════════════════════════
   START / LOOP
════════════════════════════════════════ */
function startGame(){
  score=0; runCoins=0; particles=[]; floatingCoins=[];
  curseDeclineFee=110;
  runPowerups={};
  activeToggles={};
  boostRefillClicks=0;
  lastActivityTime=performance.now();
  afkPromptActive=false;

  // apply all purchased run items
  if(owned['double_jump'])  { runPowerups.doubleJump=true; }
  if(owned['triple_jump'])  { runPowerups.tripleJump=true; }
  if(owned['spring_boots']) { runPowerups.springBoots=true; }
  if(owned['slow_fall'])    { runPowerups.slowFall=true; }
  if(owned['jetpack'])      { runPowerups.jetpack=true; }
  if(owned['rocket_boost']) { runPowerups.rocketBoost=true; }
  if(owned['coin_double'])  { runPowerups.coinDouble=true; }
  if(owned['coin_triple'])  { runPowerups.coinTriple=true; }
  if(owned['magnet'])       { runPowerups.magnet=true; }
  if(owned['magnet_plus'])  { runPowerups.magnetPlus=true; }
  if(owned['shield'])       { runPowerups.shield=true; }
  if(owned['double_shield']){ runPowerups.doubleShield=true; runPowerups.shieldCount=2; }
  if(owned['ghost'])        { runPowerups.ghost=true; }
  if(owned['boost_tank'])     { runPowerups.boostTank=true; }
  if(owned['boost_tank2'])    { runPowerups.boostTank2=true; }
  if(owned['boost_regen'])    { runPowerups.boostRegen=true; }
  if(owned['free_boost'])     { runPowerups.freeBoost=true; }
  if(owned['mini_mode'])      { runPowerups.miniMode=true; }
  if(owned['wide_body'])      { runPowerups.wideBody=true; }
  if(owned['time_warp'])      { runPowerups.timeWarp=true; }
  if(owned['platform_lock'])  { runPowerups.platLock=true; }
  if(owned['score_rush'])     { runPowerups.scoreRush=true; }
  if(owned['extra_plats'])    { runPowerups.extraPlats=true; }
  if(owned['lucky'])          { runPowerups.lucky=true; }
  if(owned['quad_jump'])      { runPowerups.quadJump=true; }
  if(owned['hyper_boots'])    { runPowerups.hyperBoots=true; }
  if(owned['turbo'])          { runPowerups.turbo=true; }
  if(owned['wall_bounce'])    { runPowerups.wallBounce=true; }
  if(owned['low_gravity'])    { runPowerups.lowGravity=true; }
  if(owned['coin_quintuple']) { runPowerups.coinQuintuple=true; }
  if(owned['coin_trail'])     { runPowerups.coinTrail=true; }
  if(owned['triple_shield'])  { runPowerups.tripleShield=true; runPowerups.shieldCount=3; }
  if(owned['last_chance'])    { runPowerups.lastChance=true; }
  if(owned['sticky_boots'])   { runPowerups.stickyBoots=true; }
  if(owned['mirror'])         { runPowerups.mirror=true; }
  if(owned['curse_ward'])     { runPowerups.curseWard=true; }
  if(owned['platform_radar']) { runPowerups.platRadar=true; }
  if(owned['coin_shower'])    { runPowerups.coinShower=true; }
  if(owned['speed_cap'])      { runPowerups.speedCap=true; }
  if(owned['boost_on_land'])  { runPowerups.bounceBoost=true; }
  if(owned['ultra_start'])    { runPowerups.ultraStart=true; }
  if(owned['platform_wide'])  { runPowerups.widePlatforms=true; }
  if(owned['score_x2_boost']) { runPowerups.boostScorer=true; }
  if(owned['parachute'])      { runPowerups.parachute=true; }
  if(owned['coin_bomb'])      { savedCoins+=5; }
  if(owned['phase_dash'])     { runPowerups.phaseDash=true; }
  if(owned['score_saver'])    { runPowerups.scoreSaver=true; }
  if(owned['coin_interest'])  { runPowerups.coinInterest=true; }
  if(owned['double_boost'])   { runPowerups.doubleBoost=true; }
  if(owned['platform_spring']){ runPowerups.springPad=true; }
  if(owned['head_start'])     { runPowerups.headStart=true; }
  if(owned['safe_landing'])   { runPowerups.safeLanding=true; runPowerups.safeLandingCount=3; }
  if(owned['score_streak'])   { runPowerups.scoreStreak=true; }
  if(owned['rainbow_trail'])  { runPowerups.rainbowTrail=true; }
  if(owned['death_save'])     { runPowerups.deathSave=true; }

  // ── mega vault — permanent boosts, applied every run forever ──
  if(owned['mega_bronze'])   { runPowerups.shield=true; runPowerups.stickyBoots=true; }
  if(owned['mega_silver'])   { runPowerups.doubleShield=true; runPowerups.shieldCount=2; runPowerups.boostTank2=true; }
  if(owned['mega_gold'])     { runPowerups.turbo=true; runPowerups.hyperBoots=true; runPowerups.lowGravity=true; }
  if(owned['mega_platinum']) { runPowerups.tripleShield=true; runPowerups.shieldCount=3; runPowerups.freeBoost=true; runPowerups.platLock=true; }
  if(owned['mega_diamond'])  { runPowerups.jetpack=true; runPowerups.quadJump=true; runPowerups.ultraStart=true; runPowerups.wideBody=true; }
  if(owned['mega_legendary']){ runPowerups.deathSave=true; runPowerups.scoreSaver=true; runPowerups.lucky=true; runPowerups.widePlatforms=true; runPowerups.boostRegen=true; }
  // ── value bundles — each unlocks several proven powerups at once ──
  if(owned['starter_pack']){ runPowerups.doubleJump=true; runPowerups.boostTank=true; runPowerups.coinDouble=true; }
  if(owned['safety_net']){ runPowerups.shield=true; runPowerups.stickyBoots=true; runPowerups.platRadar=true; }
  if(owned['speed_demon']){ runPowerups.turbo=true; runPowerups.hyperBoots=true; runPowerups.lowGravity=true; }
  if(owned['coin_rush']){ runPowerups.coinTriple=true; runPowerups.magnet=true; runPowerups.coinShower=true; }
  if(owned['survivor_kit']){ runPowerups.boostTank2=true; runPowerups.platLock=true; runPowerups.widePlatforms=true; }

  // ── seasonal items ──
  ALL_SEASONAL_ITEMS.forEach(item => {
    if(!owned[item.id]) return;
    switch(item.key){
      // Christmas
      case 'santaHat':      runPowerups.santaHat=true; break;
      case 'candyCane':     runPowerups.candyCane=true; break;
      case 'snowfall':      runPowerups.snowfall=true; break;
      case 'reindeerDash':  runPowerups.reindeerDash=true; break;
      case 'elfShoes':      runPowerups.elfShoes=true; break;
      case 'giftDrop':      runPowerups.giftDrop=true; break;
      case 'wreathShield':  runPowerups.wreathShield=true; runPowerups.doubleShield=true; runPowerups.shieldCount=(runPowerups.shieldCount||0)+2; break;
      case 'snowGlobe':     runPowerups.platLock=true; break;
      case 'xmasStar':      runPowerups.xmasStar=true; break;
      case 'jingleBells':   runPowerups.magnetPlus=true; break;
      case 'tinselTrail':   runPowerups.coinTrail=true; break;
      case 'chimneyWarp':   runPowerups.chimneyWarp=true; break;
      case 'fruitcake':     runPowerups.curseWard=true; break;
      case 'nutcracker':    runPowerups.scoreRush=true; break;
      case 'snowball':      runPowerups.snowball=true; break; // ultra fill handled in initPlayer
      case 'mistletoe':     runPowerups.lucky=true; runPowerups.curseWard=true; break;
      // St. Patrick's
      case 'shamrockLuck':  runPowerups.shamrockLuck=true; break;
      case 'leprechaunRun': runPowerups.coinShower=true; break;
      case 'potOfGold':     savedCoins+=20; break;
      case 'rainbowPath':   runPowerups.widePlatforms=true; runPowerups.rainbowTrail=true; break;
      case 'greenBoots':    runPowerups.hyperBoots=true; break;
      case 'fourLeaf':      runPowerups.lucky=true; break;
      case 'irishJig':      runPowerups.irishJig=true; break;
      case 'harpRegen':     runPowerups.boostRegen=true; break;
      case 'cloverShield':  runPowerups.tripleShield=true; runPowerups.shieldCount=3; break;
      case 'irishMist':     runPowerups.slowFall=true; break;
      case 'emeraldMagnet': runPowerups.magnetPlus=true; runPowerups.coinTrail=true; break;
      case 'liquidCourage': runPowerups.lowGravity=true; break;
      case 'cobblestone':   runPowerups.stickyBoots=true; break;
      case 'fiddleFever':   runPowerups.fiddleFever=true; break;
      case 'goldRush':      runPowerups.coinShower=true; runPowerups.coinTriple=true; break;
      case 'lepHat':        runPowerups.ultraStart=true; runPowerups.boostTank2=true; break;
      // Easter
      case 'easterEgg':     runPowerups.easterEgg=true; break;
      case 'bunnyHop':      runPowerups.springBoots=true; break;
      case 'chickFloat':    runPowerups.slowFall=true; break;
      case 'jellyBean':     runPowerups.jellyBean=true; break;
      case 'tulipSpring':   runPowerups.springBoots=true; break;
      case 'pastelCloud':   runPowerups.lowGravity=true; break;
      case 'nestShield':    runPowerups.doubleShield=true; runPowerups.shieldCount=2; break;
      case 'daffodilMag':   runPowerups.magnet=true; break;
      case 'carrotVision':  runPowerups.platRadar=true; break;
      case 'springLamb':    runPowerups.springLamb=true; break;
      case 'chocoCoins':    runPowerups.coinDouble=true; break;
      case 'paintedEgg':    runPowerups.lucky=true; runPowerups.curseWard=true; break;
      case 'springBreeze':  runPowerups.ultraStart=true; break;
      case 'springRenewal': runPowerups.deathSave=true; break;
      case 'butterflyDash': runPowerups.phaseDash=true; break;
      case 'rainbowEgg':    runPowerups.rainbowEgg=true; break;
      // Thanksgiving
      case 'turkeyFlight':  runPowerups.jetpack=true; break;
      case 'pumpkinArmor':  runPowerups.tripleShield=true; runPowerups.shieldCount=3; break;
      case 'cornucopia':    runPowerups.coinQuintuple=true; break; // effectively 4× (close enough)
      case 'harvestMoon':   break; // applied via cheatState flag below
      case 'stuffingBoots': runPowerups.stickyBoots=true; runPowerups.platLock=true; break;
      case 'cranberry':     runPowerups.bounceBoost=true; break;
      case 'gravySlide':    runPowerups.gravySlide=true; break;
      case 'piePower':      runPowerups.piePower=true; break;
      case 'ciderRush':     runPowerups.scoreRush=true; break;
      case 'autumnLeaves':  runPowerups.coinShower=true; break;
      case 'feastMode':     savedCoins+=10; runPowerups.ultraStart=true; runPowerups.boostTank2=true; break;
      case 'givingSpirit':  runPowerups.givingSpirit=true; break;
      case 'harvestCart':   runPowerups.magnetPlus=true; runPowerups.coinTriple=true; break;
      case 'owlSight':      runPowerups.platRadar=true; runPowerups.freezeDiffRun=true; break;
      case 'acornHoard':    runPowerups.acornHoard=true; break;
      case 'bonfireWarmth': runPowerups.curseWard=true; break;
    }
  });

  // clear owned items (single-use)
  owned={};
  try{ localStorage.setItem('jump_owned',JSON.stringify(owned)); }catch(e){}

  // ── new cheats applied at run start ──
  if(cheatState.platinumRun){
    runPowerups.platLock=true; runPowerups.widePlatforms=true;
  }
  if(cheatState.ultraMegaBoost){
    cheatState.boostForceOverride = 5.5*3;
  }
  if(cheatState.coinMultiplierX10){
    runPowerups.coinQuintuple=true; // visual/UI hint only — coinGain() checks cheatState.coinMultiplierX10 directly for the real ×10
  }
  if(cheatState.allShieldsActive){
    runPowerups.tripleShield=true; runPowerups.shieldCount=5;
  }
  if(cheatState.mirrorWorld){
    runPowerups.mirror=true;
  }
  if(cheatState.rainbowEverything){
    runPowerups.coinTrail=true; runPowerups.platRadar=true; runPowerups.rainbowTrail=true;
  }
  if(cheatState.speedrunMode){
    cheatState.scoreMultiplier = Math.max(cheatState.scoreMultiplier, 10);
  }

  allTimeStats.totalRuns++;
  saveStats();

  spawnPlatforms();
  initPlayer();
  gameState='playing'; paused=false;
  document.getElementById('hud-score').textContent='0';
  animateCoinHUD();
  document.getElementById('hud-height').textContent='0m';
  document.getElementById('hud-best').textContent=highScores[mode];
  document.getElementById('pause-overlay').classList.add('hidden');
  document.getElementById('dead-overlay').classList.add('hidden');
  document.getElementById('shop-overlay').classList.add('hidden');
  updateJumpPips();
  updateBoostPips();
  if(animId)cancelAnimationFrame(animId);
  lastTime=performance.now();
  loop(lastTime);
}

const TARGET_60FPS = 1000/60;
const TARGET_30FPS = 1000/30;

/* ── 60 fps lock ──────────────────────────────────────────────────
   requestAnimationFrame fires at the monitor's refresh rate (60, 120,
   144…). We normalise everything to a fixed 60fps timestep so physics
   feel identical on all screens.
   • Normal mode: runs every rAF frame, caps dt to 3 frames max to
     prevent the spiral-of-death after a tab-switch.
   • Low-power mode: skips frames so the effective rate stays near 30fps.
────────────────────────────────────────────────────────────────── */
function loop(ts){
  if(gameState!=='playing'){ return; }
  animId = requestAnimationFrame(loop);
  if(!afkPromptActive && !puPaused && ts - lastActivityTime > AFK_TIMEOUT){
    showAfkPrompt();
    return;
  }
  const elapsed = ts - lastTime;
  // Low power: skip frames until ~30fps interval has passed
  if(settings.lowPowerMode && elapsed < TARGET_30FPS - 1) return;
  // Cap dt to 3 frames (handles tab-switch pause or heavy GC spikes)
  // Divide by TARGET_60FPS (16.667ms) so dt=1.0 == exactly one 60fps frame
  const dt = Math.min(elapsed / TARGET_60FPS, 3.0);
  lastTime = ts;
  if(!paused && !puPaused){
    try{ update(dt); }catch(err){ console.warn('update() error, skipping frame', err); }
  }
  try{ drawFrame(); }catch(err){ console.warn('drawFrame() error, skipping frame', err); }
}

/* ════════════════════════════════════════
   AFK / "ARE YOU STILL PLAYING?" PROMPT
════════════════════════════════════════ */
function showAfkPrompt(){
  if(afkPromptActive) return;
  afkPromptActive = true;
  paused = true;
  gameState = 'paused';
  document.getElementById('afk-overlay').classList.remove('hidden');
}

function dismissAfkPrompt(){
  afkPromptActive = false;
  paused = false;
  gameState = 'playing';
  lastActivityTime = performance.now();
  document.getElementById('afk-overlay').classList.add('hidden');
  lastTime = performance.now();
  loop(lastTime);
}

/* ════════════════════════════════════════
   PLATFORM POWERUP TOAST
════════════════════════════════════════ */
function showPUToast(pu){
  // curse ward: silently skip bad powerups
  if(pu.bad && runPowerups.curseWard){ return; }
  pendingPU = {pu};
  puPaused = true;
  document.getElementById('pu-icon').textContent = pu.icon;
  document.getElementById('pu-name').textContent = pu.name;
  document.getElementById('pu-desc').textContent = pu.desc;
  const acceptBtn = document.getElementById('pu-accept');
  const declineBtn = document.getElementById('pu-decline');
  if(pu.bad){
    acceptBtn.style.borderColor='#e84e60';
    acceptBtn.style.background='rgba(232,78,96,.18)';
    acceptBtn.style.color='#f08090';
    // cursed powerups charge a fee to decline — fee grows every time you skip one
    const canAfford = savedCoins >= curseDeclineFee;
    declineBtn.textContent = `✕ pay ${curseDeclineFee}c to skip`;
    declineBtn.classList.toggle('cannot-afford', !canAfford);
    declineBtn.title = canAfford ? '' : "not enough coins — you'll have to accept this one";
  } else {
    acceptBtn.style.borderColor='#5cb85c';
    acceptBtn.style.background='rgba(92,184,92,.18)';
    acceptBtn.style.color='#7fd87f';
    declineBtn.textContent = '✕ skip';
    declineBtn.classList.remove('cannot-afford');
    declineBtn.title = '';
  }
  document.getElementById('pu-timer-fill').style.width='100%';
  document.getElementById('pu-backdrop').classList.add('active');
  const toast = document.getElementById('pu-toast');
  toast.classList.remove('hidden');
  toast.offsetHeight;
  toast.classList.add('visible');
}

function hidePUToast(){
  pendingPU = null;
  puPaused = false;
  lastTime = performance.now();
  lastActivityTime = performance.now();
  document.getElementById('pu-backdrop').classList.remove('active');
  const toast = document.getElementById('pu-toast');
  toast.classList.remove('visible');
  toast.classList.add('hidden');
}

function acceptPU(){
  if(!pendingPU) return;
  const pu = pendingPU.pu;
  pu.apply();
  hidePUToast();
  if(!pu.bad){
    sfx('powerup');
    spawnParticles(player.x+player.w/2, player.y+player.h/2, '#7fd87f', 12);
  } else {
    sfx('powerup_bad');
    spawnParticles(player.x+player.w/2, player.y+player.h/2, '#e84e60', 12);
  }
}

function declinePU(){
  if(!pendingPU) return;
  const pu = pendingPU.pu;
  if(pu.bad){
    // cursed powerups cost a fee to decline — can't afford it? forced to accept instead
    if(savedCoins < curseDeclineFee){
      const declineBtn = document.getElementById('pu-decline');
      flashRow(declineBtn);
      sfx('die');
      return;
    }
    savedCoins -= curseDeclineFee;
    curseDeclineFee += 20;
    animateCoinHUD();
    try{ localStorage.setItem('jump_coins', savedCoins); }catch(e){}
    sfx('buy');
  }
  hidePUToast();
}

/* ════════════════════════════════════════
   UPDATE
════════════════════════════════════════ */
function update(dt){
  const W=canvas.width, H=canvas.height;

  // keep the "still playing?" timer alive while any key is actively held —
  // previously only the initial keydown refreshed it, so holding a direction
  // or jump for 20+ seconds (very normal in a platformer) would falsely
  // trigger the AFK prompt and yank control away mid-run
  if(keys.left||keys.right||keys.jump||keys.boost) lastActivityTime=performance.now();

  if(jetpackTimer>0){
    jetpackTimer-=dt*(1/60);
    if(jetpackTimer<0)jetpackTimer=0;
  }

  const maxUltra = MAX_ULTRA + (runPowerups.rocketBoost?3:0);
  if(ultraBoosts<maxUltra){
    ultraRegenTimer+=dt*(1/60);
    if(ultraRegenTimer>=ULTRA_REGEN){
      ultraRegenTimer-=ULTRA_REGEN;
      ultraBoosts=Math.min(maxUltra,ultraBoosts+1);
    }
    updateBoostPips();
  }

  const sec=dt*(1/60);
  if(tempSlowFall>0)    tempSlowFall    =Math.max(0,tempSlowFall    -sec);
  if(tempMagnet>0)      tempMagnet      =Math.max(0,tempMagnet      -sec);
  if(tempGhost>0)       tempGhost       =Math.max(0,tempGhost       -sec);
  if(tempCoinDouble>0)  tempCoinDouble  =Math.max(0,tempCoinDouble  -sec);
  if(tempMini>0)        tempMini        =Math.max(0,tempMini        -sec);
  if(tempIce>0)         tempIce         =Math.max(0,tempIce         -sec);
  if(tempFlip>0)        tempFlip        =Math.max(0,tempFlip        -sec);
  if(tempHeavy>0)       tempHeavy       =Math.max(0,tempHeavy       -sec);
  if(tempTurbo>0)       tempTurbo       =Math.max(0,tempTurbo       -sec);
  if(tempLowGrav>0)     tempLowGrav     =Math.max(0,tempLowGrav     -sec);
  if(tempWide>0)        tempWide        =Math.max(0,tempWide        -sec);
  if(tempCoinTriple>0)  tempCoinTriple  =Math.max(0,tempCoinTriple  -sec);
  if(tempInvincible>0)  tempInvincible  =Math.max(0,tempInvincible  -sec);
  if(tempBadTiny>0)     tempBadTiny     =Math.max(0,tempBadTiny     -sec);
  if(tempDark>0)        tempDark        =Math.max(0,tempDark        -sec);
  if(tempParachute>0)   tempParachute   =Math.max(0,tempParachute   -sec);
  if(tempDizzy>0)       tempDizzy       =Math.max(0,tempDizzy       -sec);
  if(phaseDashActive>0) phaseDashActive =Math.max(0,phaseDashActive -sec);
  // coin interest: passive +1 coin every 5 seconds
  if(runPowerups.coinInterest){
    coinInterestTimer+=sec;
    if(coinInterestTimer>=5){
      coinInterestTimer-=5;
      runCoins+=1; savedCoins+=1;
      animateCoinHUD();
      spawnCoinPopup(player.x+player.w/2, player.y-cameraY-30, 1);
    }
  }
  // boost regen
  if(runPowerups.boostRegen){
    boostRegenTimer+=sec;
    const maxB=MAX_BOOSTS+(runPowerups.boostTank?4:0)+(runPowerups.boostTank2?8:0);
    if(boostRegenTimer>=2&&boosts<maxB){ boosts=Math.min(maxB,boosts+1); boostRegenTimer=0; updateBoostPips(); }
  }

  // PU timeout disabled while paused — we pause instead of auto-declining
  // (pendingPU is handled; timer bar doesn't count down while paused)

  runElapsed += dt/60;
  const heightM=Math.max(0,Math.floor(-cameraY/40));
  if(runPowerups.chimneyWarp && !chimneyWarpUsed && heightM>=500){
    chimneyWarpUsed=true;
    cameraY -= 200*40;
    player.y -= 200*40;
    spawnParticles(player.x+player.w/2,player.y-cameraY,'#c0392b',16);
    sfx('ultra');
  }
  const _rawDiff = (cheatState.freezeDiff || runPowerups.freezeDiffRun) ? 1.0 : Math.min(2.0, 1+Math.floor(score/500)*DIFF_SCALE_PER_1000M*500);
  const diffMult=_rawDiff*cheatState.diffMult;
  const springActive = runPowerups.springBoots || activeToggles.springBoots;
  const hyperActive = runPowerups.hyperBoots;
  const _jump1 = cheatState.jumpOverride != null ? -cheatState.jumpOverride : JUMP1;
  const jForce=_jump1*(hyperActive?1.5:springActive?1.25:1);
  const timeScale = runPowerups.timeWarp ? 0.8 : 1; // time warp slows everything

  // movement
  const iceSlip=tempIce>0 && !runPowerups.gravySlide;
  const flipCtrl=tempFlip>0;
  const leftKey=flipCtrl?keys.right:keys.left;
  const rightKey=flipCtrl?keys.left:keys.right;
  const turboMult = (runPowerups.turbo||tempTurbo>0?1.3:1) * (runPowerups.reindeerDash?1.5:1) * (runPowerups.irishJig?1.6:1) * (runPowerups.springLamb?1.45:1) * getPetSpeedMult();
  const _spd = cheatState.speedOverride != null ? cheatState.speedOverride : MOVE_SPEED;
  const effSpeed = _spd*turboMult;
  if(leftKey)  player.vx+=(iceSlip?0.4:-effSpeed-player.vx)*dt*(iceSlip?.05:1);
  if(rightKey) player.vx+=(iceSlip?0.4: effSpeed-player.vx)*dt*(iceSlip?.05:1);
  if(!leftKey&&!rightKey){
    player.vx*=iceSlip?Math.pow(.98,dt):Math.pow(.75,dt);
  }
  if(Math.abs(player.vx)>effSpeed)player.vx=Math.sign(player.vx)*effSpeed;

  // jump
  if(keys.jump&&!jumpHeld){
    if(jetpackTimer>0){
      player.vy=jForce*.8;
      jumpHeld=true;
      updateJumpPips();
    } else if(jumpCount<maxJumps){
      if(jumpCount===0){
        player.vy=jForce;
        player.squish=.65; player.squishV=.12;
        spawnParticles(player.x+player.w/2,player.y+player.h,'#888',4);
      } else {
        player.vy=JUMP2*(hyperActive?1.5:springActive?1.18:1);
        sfx('jump');
        spawnParticles(player.x+player.w/2,player.y+player.h,'#aaa',5);
      }
      jumpCount++;
      jumpHeld=true;
      updateJumpPips();
    }
  }
  if(!keys.jump)jumpHeld=false;

  // gravity
  let grav=(cheatState.gravityOverride != null ? cheatState.gravityOverride : GRAVITY)*timeScale;
  if(cheatState.zeroGravity) grav = 0;
  const canSlowFall = runPowerups.slowFall || activeToggles.slowFall || tempSlowFall>0;
  const hasLowGrav = runPowerups.lowGravity || tempLowGrav>0;
  if(canSlowFall&&keys.jump&&player.vy>0&&jumpCount>=maxJumps){grav=GRAVITY*.3*timeScale;}
  if(jetpackTimer>0)grav=GRAVITY*.15*timeScale;
  if(hasLowGrav)grav*=0.5;
  if(tempHeavy>0)grav*=2;
  if(mode==='moon')grav*=0.35; // moon mode — really low gravity, floaty jumps
  grav*=modeCfg().speedMult;

  player.vy+=grav*dt;
  if(player.vy>20)player.vy=20;
  if(runPowerups.snowfall && player.vy>16) player.vy=16;
  if(runPowerups.speedCap && player.vy>10) player.vy=10;

  // normal boost
  if(keys.boost&&!keys.boostHeld&&!keys.shiftHeld){
    if(boosts>0||cheatState.infBoosts||freeBoostsLeft>0){
      const _bf = cheatState.boostForceOverride != null ? -cheatState.boostForceOverride : BOOST_FORCE;
      player.vy=_bf*(springActive?1.15:hyperActive?1.3:1)*(runPowerups.doubleBoost?1.7:1)*(runPowerups.candyCane?1.25:1);
      if(freeBoostsLeft>0){
        freeBoostsLeft=Math.max(0,freeBoostsLeft-1); // free — don't deduct from boosts
      } else {
        boosts=Math.max(0,boosts-1);
      }
      keys.boostHeld=true;
      updateBoostPips();
      sfx('boost');
      if(runPowerups.boostScorer){ score+=2; document.getElementById('hud-score').textContent=score; }
      spawnParticles(player.x+player.w/2,player.y+player.h,'#e8a020',8);
    }
  }
  if(!keys.boost)keys.boostHeld=false;

  // ultra boost
  if(keys.boost&&keys.shift&&!keys.ultraHeld){
    if(ultraBoosts>0){
      player.vy=ULTRA_BOOST_FORCE*(springActive?1.15:1)*(runPowerups.piePower?1.5:1);
      ultraBoosts=Math.max(0,ultraBoosts-1);
      keys.ultraHeld=true;
      ultraFlash=1;
      updateBoostPips();
      sfx('ultra');
      spawnParticles(player.x+player.w/2,player.y+player.h,'#ff3366',14);
      spawnParticles(player.x+player.w/2,player.y+player.h,'#ff8833',10);
    }
  }
  if(!keys.boost||!keys.shift)keys.ultraHeld=false;

  player.x+=player.vx*dt;
  player.y+=player.vy*dt;

  if(runPowerups.wallBounce){
    if(player.x<0){ player.x=0; player.vx=Math.abs(player.vx)*0.8; }
    if(player.x+player.w>W){ player.x=W-player.w; player.vx=-Math.abs(player.vx)*0.8; }
  } else {
    if(player.x+player.w<0)player.x=W;
    if(player.x>W)player.x=-player.w;
  }

  // squish spring
  player.squish+=player.squishV*dt;
  player.squishV+=(1-player.squish)*.3*dt;
  player.squishV*=Math.pow(.85,dt);

  // trail
  player.trail.push({x:player.x+player.w/2,y:player.y+player.h/2});
  if(player.trail.length>12)player.trail.shift();

  // camera
  const targetCamY = player.y - H*0.42;
  if(targetCamY<cameraY){
    cameraY+=(targetCamY-cameraY)*Math.min(1, 0.1*dt);
  }

  // score
  const _baseDiv = Math.max(1, Math.round(cheatState.scoreDivisor / cheatState.scoreMultiplier / (runPowerups.fiddleFever?fiddleFeverMult:1)));
  const scoreDiv = runPowerups.scoreRush ? Math.max(1,Math.round(_baseDiv*0.67)) : _baseDiv;
  const newScore=Math.max(score,Math.floor(-cameraY/scoreDiv));
  if(newScore>score){
    score=newScore;
    const se=document.getElementById('hud-score');
    se.textContent=score;
    se.classList.remove('bump'); void se.offsetWidth; se.classList.add('bump');
    clearTimeout(se._t); se._t=setTimeout(()=>se.classList.remove('bump'),180);
    const be=document.getElementById('hud-best');
    be.textContent=Math.max(score,highScores[mode]);
    // check floating images — pass both score and height for recurrence
    checkFloatingImages(score, heightM);
  }
  document.getElementById('hud-height').textContent=heightM+'m';
  document.getElementById('hud-diff').textContent='×'+diffMult.toFixed(2);

  // adapt HUD colours to day/night
  const _nt = getDayNightT();
  if(_nt > 0.05){
    const hudEl = document.getElementById('hud');
    const alpha = _nt.toFixed(2);
    hudEl.style.setProperty('--night', alpha);
    // fade stats text toward light
    const lightness = Math.round(170 + _nt*85);
    hudEl.querySelectorAll('.hud-stat,.hud-coins-wrap,.boost-label,.boost-key').forEach(el=>{
      el.style.color = _nt > 0.5 ? `rgb(${lightness},${lightness},${lightness})` : '';
    });
    hudEl.querySelectorAll('.hud-stat strong').forEach(el=>{
      el.style.color = _nt > 0.5 ? '#fff' : '';
    });
  }

  // platform update + collision
  player.onGround=false;
  for(let i=platforms.length-1;i>=0;i--){
    const p=platforms[i];

    if(p.type==='moving'&&!p.isFloor){
      p.x+=p.moveSpd*p.moveDir*dt;
      if(Math.abs(p.x-p.ox)>p.moveRange)p.moveDir*=-1;
    }
    if(p.type==='dissolving'&&p.touched&&!runPowerups.platLock){
      p.dissolveT+=dt;
      const dissolveRate = runPowerups.stickyBoots ? 44 : 22;
      p.alpha=Math.max(0,1-p.dissolveT/dissolveRate);
      if(p.alpha<=0){platforms.splice(i,1);continue;}
    }
    // don't cull the floor
    if(!p.isFloor && p.y-cameraY>H+100){platforms.splice(i,1);continue;}

    // collision — use effective player width from active powerups
    const ghostActive = runPowerups.ghost||activeToggles.ghost||tempGhost>0;
    const dashingThrough = phaseDashActive>0 && !p.isFloor; // phase dash: pass through any platform briefly
    const effPlayerW = (runPowerups.wideBody||tempWide>0) ? player.w*1.5 : (runPowerups.miniMode||tempMini>0) ? player.w*0.55 : player.w;
    const effPlayerX = player.x + (player.w - effPlayerW)/2;
    if(player.vy>=0&&!dashingThrough&&!(p.type==='dissolving'&&ghostActive&&p.touched)){
      const py=player.y+player.h;
      const ppy=py-player.vy*dt;
      if(effPlayerX+effPlayerW-2>p.x&&effPlayerX+2<p.x+p.w&&ppy<=p.y&&py>=p.y){
        player.y=p.y-player.h;

        // auto-bounce on ALL platforms including floor
        let springMult = tempSpring>0 ? 1.3 : 1;
        if(tempSpring>0) tempSpring=Math.max(0,tempSpring-1);

        // landing streak — drives spring pad (every 5th platform) & score streak (every 5 lands)
        if(!p.isFloor){
          landingCount++;
          if(runPowerups.springPad && landingCount%5===0){
            springMult*=1.6; // super spring platform
            spawnParticles(player.x+player.w/2,p.y,'#c084fc',10);
          }
          if(runPowerups.scoreStreak && landingCount%5===0){
            score+=25;
            document.getElementById('hud-score').textContent=score;
            spawnParticles(player.x+player.w/2,p.y-14,'#ffd166',8);
            spawnCoinPopup(player.x+player.w/2, player.y-cameraY-24);
          }
          if(runPowerups.giftDrop && landingCount%10===0){
            const bonus=coinGain(6);
            runCoins+=bonus; savedCoins+=bonus;
            animateCoinHUD();
            spawnParticles(player.x+player.w/2,p.y-14,'#e84e60',10);
            spawnCoinPopup(player.x+player.w/2, player.y-cameraY-38, bonus);
          }
          if(runPowerups.shamrockLuck && landingCount%4===0){
            const bonus=coinGain(4);
            runCoins+=bonus; savedCoins+=bonus;
            animateCoinHUD();
            spawnParticles(player.x+player.w/2,p.y-14,'#5cb85c',8);
            spawnCoinPopup(player.x+player.w/2, player.y-cameraY-38, bonus);
          }
          if(runPowerups.fiddleFever && landingCount%10===0){
            fiddleFeverMult=Math.min(3, (fiddleFeverMult||1)+0.1);
          }
          if(runPowerups.easterEgg){
            const bonus=coinGain(2);
            runCoins+=bonus; savedCoins+=bonus;
            animateCoinHUD();
            spawnCoinPopup(player.x+player.w/2, player.y-cameraY-24, bonus);
          }
          if(runPowerups.rainbowEgg){
            const rEggBonus = !rainbowEggFirstBounce ? 50 : (landingCount%10===0 ? 5 : 0);
            if(!rainbowEggFirstBounce) rainbowEggFirstBounce=true;
            if(rEggBonus>0){
              score+=rEggBonus;
              document.getElementById('hud-score').textContent=score;
              spawnParticles(player.x+player.w/2,p.y-14,'#ff6bd6',10);
            }
          }
        }

        player.vy=jForce*springMult;
        player.onGround=false;
        jumpCount=0;  // full reset so all mid-air jumps are available
        updateJumpPips();

        player.squish=.6; player.squishV=.14;
        spawnParticles(player.x+player.w/2,p.y,'#888',4);
        sfx('bounce');

        const bounceCoinGain= (tempNoCoin>0) ? 0 : coinGain(BOUNCE_COIN_VALUE) * (runPowerups.givingSpirit ? 2 : 1);
        if(tempNoCoin>0) tempNoCoin=Math.max(0,tempNoCoin-1);
        runCoins+=bounceCoinGain; savedCoins+=bounceCoinGain;
        animateCoinHUD();
        spawnCoinPopup(player.x+player.w/2, player.y-cameraY-10, bounceCoinGain);

        const maxB=MAX_BOOSTS+(runPowerups.boostTank?4:0)+(runPowerups.boostTank2?8:0);
        const boostGain = runPowerups.bounceBoost ? 2 : 1;
        if(boosts<maxB){boosts=Math.min(maxB,boosts+boostGain);updateBoostPips();}

        // platform powerup reveal — pauses game
        if(p.platPU && !p.puRevealed && !pendingPU){
          p.puRevealed=true;
          showPUToast(p.platPU);
        }

        if(p.type==='dissolving'&&!p.touched){
          p.touched=true;
          if(!(runPowerups.ghost||activeToggles.ghost||tempGhost>0))spawnParticles(p.x+p.w/2,p.y,'#e84e60',5);
        }
      }
    }

    // coin on platform
    if(p.hasCoin&&!p.coinCollected){
      p.coinBob+=.04*dt;
      const coinSX=p.x+p.w/2, coinSY=p.y-cameraY-22+Math.sin(p.coinBob)*4;
      const dx=(player.x+player.w/2)-coinSX, dy=(player.y+player.h/2)-(coinSY+cameraY);
      const magnetActive = runPowerups.magnet||runPowerups.magnetPlus||activeToggles.magnet||tempMagnet>0;
      // coinTrail / rainbowTrail give a wide collection radius around the player's trail
      const trailActive = runPowerups.coinTrail || runPowerups.rainbowTrail;
      const magnetR= runPowerups.magnetPlus?200 : magnetActive?110 : trailActive?60 : 22;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist<magnetR){
        if(dist<22){
          p.coinCollected=true;
          const gain= coinGain();
          runCoins+=gain; savedCoins+=gain;
          animateCoinHUD();
          sfx('coin');
          spawnCoinPopup(coinSX,coinSY);
          spawnParticles(coinSX,coinSY+cameraY,'#e8a020',4);
        }
      }
    }

    // money bag on platform — rarer, flat high value, but still scales with skin coin multiplier
    if(p.hasBag&&!p.bagCollected){
      p.bagBob+=.035*dt;
      const bagSX=p.x+p.w/2, bagSY=p.y-cameraY-26+Math.sin(p.bagBob)*3;
      const bdx=(player.x+player.w/2)-bagSX, bdy=(player.y+player.h/2)-(bagSY+cameraY);
      const magnetActive = runPowerups.magnet||runPowerups.magnetPlus||activeToggles.magnet||tempMagnet>0;
      const trailActive = runPowerups.coinTrail || runPowerups.rainbowTrail;
      const bagMagnetR= runPowerups.magnetPlus?200 : magnetActive?110 : trailActive?60 : 24;
      const bdist = Math.sqrt(bdx*bdx+bdy*bdy);
      if(bdist<bagMagnetR){
        if(bdist<24){
          p.bagCollected=true;
          const skinMult = (getEquippedSkin().coinMult) || 1;
          const bagGain = Math.max(1, Math.round(MONEYBAG_VALUE * skinMult * getPetCoinMult()));
          runCoins+=bagGain; savedCoins+=bagGain;
          animateCoinHUD();
          sfx('coin');
          spawnCoinPopup(bagSX,bagSY,bagGain);
          spawnParticles(bagSX,bagSY+cameraY,'#ffd166',8);
        }
      }
    }
  }

  const _basePlats = cheatState.platCountOverride != null ? cheatState.platCountOverride : (runPowerups.extraPlats ? 24 : 18);
  const targetPlats = _basePlats;
  while(platforms.length<targetPlats)spawnNewPlatform(diffMult);

  // coin shower — drop random coins from top of screen
  if((runPowerups.coinShower||cheatState.coinShower) && Math.random()<0.04*dt){
    const cx = Math.random()*W;
    const cy = cameraY + 20 + Math.random()*H*0.2;
    floatingCoins.push({x:cx, y:cy, vy:1.2, collected:false, bob:0});
  }

  // update + collect floating coins (from coin shower)
  for(let i=floatingCoins.length-1;i>=0;i--){
    const fc=floatingCoins[i];
    fc.y+=fc.vy*dt;
    fc.bob+=0.05*dt;
    if(!fc.collected){
      const fdx=(player.x+player.w/2)-fc.x;
      const fdy=(player.y+player.h/2)-fc.y;
      if(Math.sqrt(fdx*fdx+fdy*fdy)<28){
        fc.collected=true;
        const gain= coinGain();
        runCoins+=gain; savedCoins+=gain;
        animateCoinHUD(); sfx('coin');
        spawnParticles(fc.x,fc.y,'#e8a020',3);
      }
    }
    if(fc.y-cameraY>H+80||fc.collected) floatingCoins.splice(i,1);
  }
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.1*dt;p.alpha-=.035*dt;
    if(p.alpha<=0)particles.splice(i,1);
  }

  if(ultraFlash>0){ultraFlash=Math.max(0,ultraFlash-.06*dt);}

  // update canvas-based floating image
  updateFloatingImg(dt);

  // death
  // parachute — activate when falling past screen bottom
  if(player.y-cameraY>H+20 && (runPowerups.parachute||tempParachute>0) && !parachuteActive){
    parachuteActive=true;
    player.vy=Math.min(player.vy,1.5);
    spawnParticles(player.x+player.w/2,player.y-cameraY,'#ffd166',8);
  }
  if(parachuteActive){
    player.vy=Math.min(player.vy,1.5);
    if(player.y-cameraY>H+180){ parachuteActive=false; if(!runPowerups.parachute) tempParachute=0; }
  }

  if(player.y-cameraY>H+80 && !parachuteActive){
    // last chance: auto ultra boost instead of dying
    if(runPowerups.lastChance&&ultraBoosts>0){
      player.vy=ULTRA_BOOST_FORCE;
      ultraBoosts=Math.max(0,ultraBoosts-1);
      ultraFlash=1;
      runPowerups.lastChance=false;
      updateBoostPips();
      sfx('ultra');
      spawnParticles(player.x+player.w/2,player.y,'#ff3366',14);
    } else if(tempInvincible>0){
      player.vy=-10;
      spawnParticles(player.x+player.w/2,player.y,'#ffd700',10);
    } else if(runPowerups.tripleShield){
      runPowerups.shieldCount=(runPowerups.shieldCount||3)-1;
      if(runPowerups.shieldCount<=0){ runPowerups.tripleShield=false; runPowerups.shield=false; runPowerups.doubleShield=false; }
      player.vy=-10;
      spawnParticles(player.x+player.w/2,player.y,'#aaa',10);
    } else if(runPowerups.shield||runPowerups.doubleShield){
      if(runPowerups.doubleShield){
        runPowerups.shieldCount=(runPowerups.shieldCount||2)-1;
        if(runPowerups.shieldCount<=0){ runPowerups.doubleShield=false; runPowerups.shield=false; }
      } else {
        runPowerups.shield=false;
      }
      player.vy=-10;
      spawnParticles(player.x+player.w/2,player.y,'#aaa',10);
    } else if(runPowerups.safeLanding && (runPowerups.safeLandingCount||0)>0){
      runPowerups.safeLandingCount--;
      if(runPowerups.safeLandingCount<=0) runPowerups.safeLanding=false;
      player.vy=-10;
      spawnParticles(player.x+player.w/2,player.y,'#66d9ff',10);
    } else {
      if(cheatState.infLives){ player.vy=-12; spawnParticles(player.x+player.w/2,player.y,'#7fd87f',8); }
      else if(runPowerups.deathSave && !deathSaveUsed){
        // respawn once on the nearest surviving platform instead of dying
        deathSaveUsed=true;
        let nearest=null, bestDist=Infinity;
        for(const pl of platforms){
          const d=Math.abs((pl.x+pl.w/2)-(player.x+player.w/2))+Math.abs(pl.y-player.y);
          if(d<bestDist){ bestDist=d; nearest=pl; }
        }
        if(nearest){
          player.x=nearest.x+nearest.w/2-player.w/2;
          player.y=nearest.y-player.h;
          player.vy=jForce;
        } else {
          player.y=cameraY+H*0.3;
          player.vy=0;
        }
        sfx('ultra');
        spawnParticles(player.x+player.w/2,player.y,'#ff66cc',16);
      }
      else die();
    }
  }
}

/* ════════════════════════════════════════
   DIE
════════════════════════════════════════ */
function die(){
  gameState='dead';
  sfx('die');
  afkPromptActive=false;
  if(runPowerups.acornHoard && runCoins>0){
    savedCoins+=runCoins; // reserve doubles the run's coin haul on payout
    runCoins*=2;
    animateCoinHUD();
  }
  document.getElementById('afk-overlay').classList.add('hidden');
  document.getElementById('boost-refill-btn').classList.add('hidden');
  const prev=highScores[mode]||0;
  // score saver: this run's recorded score can only tie or beat your previous best
  if(runPowerups.scoreSaver && score<prev) score=prev;
  if(score>prev)highScores[mode]=score;
  const heightM=Math.max(0,Math.floor(-cameraY/40));

  // update all-time stats
  allTimeStats.totalCoins += runCoins;
  allTimeStats.totalHeight += heightM;
  if(score > allTimeStats.bestScore){ allTimeStats.bestScore=score; allTimeStats.bestMode=mode; }
  if(heightM > allTimeStats.bestHeight) allTimeStats.bestHeight=heightM;
  if(runCoins > allTimeStats.bestRunCoins) allTimeStats.bestRunCoins=runCoins;
  saveStats();

  // power-ups are single-round use — clear ownership so they must be rebought next run
  owned = {};

  try{
    localStorage.setItem('jump_hs',JSON.stringify(highScores));
    localStorage.setItem('jump_coins',savedCoins);
    localStorage.setItem('jump_owned',JSON.stringify(owned));
  }catch(e){}

  document.getElementById('final-score').textContent=score;
  document.getElementById('final-height').textContent=heightM+'m';
  document.getElementById('final-coins').textContent=runCoins;
  document.getElementById('ov-hs-msg').textContent=score>prev?`🏆 new best for ${mode}!`:`best: ${prev}`;
  document.getElementById('dead-overlay').classList.remove('hidden');
  updateHSDisplay();
}

/* ════════════════════════════════════════
   DAY / NIGHT CYCLE
   - Tied to score: full day→night cycle over CYCLE_LEN score points
   - Cheats can force day or night
════════════════════════════════════════ */
const DAY_NIGHT_CYCLE_LEN = 800;   // score points per full cycle

// Returns 0=full day, 1=full night (smooth 0→1→0→1…)
function getDayNightT(){
  if(cheatState.forceNight || runPowerups.harvestMoon) return 1;
  if(cheatState.forceDay)   return 0;
  if(gameState !== 'playing') return 0;
  // sine wave: 0 at score=0 (day), peaks at night every CYCLE_LEN/2
  const t = (score % DAY_NIGHT_CYCLE_LEN) / DAY_NIGHT_CYCLE_LEN;
  return Math.max(0, Math.sin(t * Math.PI));  // 0→1→0 per cycle
}

function drawSky(W, H){
  if(mode==='moon'){
    // permanent deep-space backdrop — no day/night cycle, dense stars, distant planets
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#05060f');
    g.addColorStop(1, '#0c0e1e');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    const seed = Math.floor(-cameraY / 40);
    for(let i=0; i<90; i++){
      const sx = ((i*137.508 + seed*3.7) % W + W) % W;
      const sy = ((i*97.3 + seed*1.3) % H + H) % H;
      const sr = 0.5 + ((i*31.7)%1)*1.1;
      const twinkle = 0.5 + 0.5*Math.sin(Date.now()*0.001*(0.8+i%3*0.3)+i);
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();

    // a couple of distant, slow-parallax planets for depth
    const distantPlanets = [
      {sx:.18, col:'#c96b4a', r:26, parallax:.05},
      {sx:.78, col:'#6b8fc9', r:16, parallax:.09},
    ];
    distantPlanets.forEach(dp=>{
      const py = (((-cameraY*dp.parallax)+H*0.3)%(H*2)+H*2)%(H*2) - H*0.5;
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = dp.col;
      ctx.beginPath(); ctx.arc(dp.sx*W, py, dp.r, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    });
    return;
  }

  const t = getDayNightT();

  // Interpolate background colours day→dusk→night
  // day:   #edf2f4 (light blue-grey)
  // night: #0d1b2a (deep navy)
  const dayR=237, dayG=242, dayB=244;
  const nightR=13, nightG=27, nightB=42;
  const r = Math.round(dayR + (nightR-dayR)*t);
  const g = Math.round(dayG + (nightG-dayG)*t);
  const b = Math.round(dayB + (nightB-dayB)*t);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, W, H);

  // Stars (only at night, t > 0.3)
  if(t > 0.3){
    const starAlpha = Math.min(1, (t-0.3)/0.4);
    ctx.save();
    ctx.globalAlpha = starAlpha * 0.85;
    // deterministic star positions based on camera Y (parallax)
    const seed = Math.floor(-cameraY / 40);
    for(let i=0; i<60; i++){
      const sx = ((i*137.508 + seed*3.7) % W + W) % W;
      const sy = ((i*97.3 + seed*1.3) % (H*0.7) + H*0.02);
      const sr = 0.6 + ((i*31.7)%1)*0.9;
      const twinkle = 0.6 + 0.4*Math.sin(Date.now()*0.001*(0.8+i%3*0.3)+i);
      ctx.fillStyle = `rgba(255,255,255,${twinkle})`;
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  // Sun / Moon
  const sunX = W * 0.82, moonX = W * 0.15;
  const bodyY = H * 0.12;

  if(t < 0.85){
    // Sun
    const sunAlpha = Math.max(0, 1 - t*1.3);
    ctx.save();
    ctx.globalAlpha = sunAlpha * 0.9;
    // glow
    const sg = ctx.createRadialGradient(sunX, bodyY, 0, sunX, bodyY, 48);
    sg.addColorStop(0, 'rgba(255,240,140,0.7)');
    sg.addColorStop(1, 'rgba(255,240,140,0)');
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.arc(sunX, bodyY, 48, 0, Math.PI*2); ctx.fill();
    // core
    ctx.fillStyle = '#ffe566';
    ctx.beginPath(); ctx.arc(sunX, bodyY, 16, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  if(t > 0.25){
    // Moon
    const moonAlpha = Math.min(1, (t-0.25)/0.35);
    ctx.save();
    ctx.globalAlpha = moonAlpha * 0.9;
    // glow
    const mg = ctx.createRadialGradient(moonX, bodyY, 0, moonX, bodyY, 38);
    mg.addColorStop(0, 'rgba(200,215,255,0.45)');
    mg.addColorStop(1, 'rgba(200,215,255,0)');
    ctx.fillStyle = mg;
    ctx.beginPath(); ctx.arc(moonX, bodyY, 38, 0, Math.PI*2); ctx.fill();
    // crescent
    ctx.fillStyle = '#dde8ff';
    ctx.beginPath(); ctx.arc(moonX, bodyY, 13, 0, Math.PI*2); ctx.fill();
    // crescent shadow — use sky colour
    const cr = Math.round(nightR + (dayR-nightR)*(1-t));
    const cg2 = Math.round(nightG + (dayG-nightG)*(1-t));
    const cb2 = Math.round(nightB + (dayB-nightB)*(1-t));
    ctx.fillStyle = `rgb(${cr},${cg2},${cb2})`;
    ctx.beginPath(); ctx.arc(moonX+5, bodyY-2, 10, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  // Horizon gradient (blend sky into "air" below)
  const hg = ctx.createLinearGradient(0, H*0.55, 0, H);
  if(t < 0.5){
    // dawn/day horizon: warm haze
    hg.addColorStop(0, 'rgba(255,255,255,0)');
    hg.addColorStop(1, `rgba(240,240,238,${0.18*(1-t*2)})`);
  } else {
    // dusk/night horizon: cool mist
    hg.addColorStop(0, 'rgba(13,27,42,0)');
    hg.addColorStop(1, `rgba(20,35,55,${0.22*(t-0.5)*2})`);
  }
  ctx.fillStyle = hg;
  ctx.fillRect(0, 0, W, H);
}

/* ════════════════════════════════════════
   DRAW
════════════════════════════════════════ */
function drawFrame(){
  const W=canvas.width,H=canvas.height;

  // ── sky / day-night ──
  drawSky(W, H);

  // ── FLOATING IMAGE — drawn first so it's behind everything ──
  drawFloatingImg();

  // scanlines texture
  ctx.fillStyle='rgba(0,0,0,.009)';
  for(let y=0;y<H;y+=3){ctx.fillRect(0,y,W,1);}

  // clouds (skip in moon mode — space has no clouds)
  if(mode!=='moon'){
    const nightT = getDayNightT();
    const cloudAlpha = 0.55 + 0.35 * (1 - nightT);
    ctx.fillStyle=`rgba(220,220,218,${cloudAlpha})`;
    const cloudSeeds=[.12,.35,.6,.82];
    cloudSeeds.forEach((sx,i)=>{
      const cy=(((-cameraY*.15)+(i*300))%H+H)%H;
      const cw=120+i*60, ch=40+i*10;
      drawCloud(sx*W,cy,cw,ch);
    });
  }

  // ground start marker
  const groundY=canvas.height-30-cameraY;
  if(groundY<H+2&&groundY>-10){
    ctx.strokeStyle='rgba(0,0,0,.12)';
    ctx.lineWidth=1;
    ctx.setLineDash([6,8]);
    ctx.beginPath();ctx.moveTo(0,groundY);ctx.lineTo(W,groundY);ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(0,0,0,.10)';
    ctx.font='11px DM Mono,monospace';
    ctx.textAlign='left';
    ctx.fillText('start · 0m',16,groundY-6);
  }

  // platforms
  platforms.forEach(p=>{
    const sy=p.y-cameraY;
    if(sy>H+20||sy+p.h<-20)return;
    ctx.save();
    ctx.globalAlpha=p.alpha;

    if(mode==='moon' && p.isFloor){
      // moon surface — grey regolith strip with a few craters
      ctx.fillStyle='rgba(0,0,0,.25)';
      ctx.fillRect(p.x,sy+4,p.w,p.h);
      ctx.fillStyle='#c7c9cf';
      ctx.beginPath();ctx.roundRect(p.x,sy,p.w,p.h,0);ctx.fill();
      ctx.fillStyle='rgba(140,142,150,.6)';
      for(let cx=20; cx<p.w; cx+=70){
        ctx.beginPath();ctx.arc(p.x+cx, sy+p.h*0.5, 5, 0, Math.PI*2);ctx.fill();
      }
      ctx.fillStyle='rgba(0,0,0,.35)';
      ctx.font='10px DM Mono,monospace';
      ctx.textAlign='center';
      ctx.fillText('surface', W/2, sy+p.h-2);
      ctx.restore();
      return;
    }

    if(mode==='moon'){
      // planet colours picked deterministically from position so they stay stable each frame
      const hash = Math.abs(Math.sin(p.ox*12.9898 + p.y*78.233) * 43758.5453) % 1;
      const planetPalette = ['#c96b4a','#e0a458','#8fa8c9','#a86bd6','#5fbf8f','#d67878'];
      const baseCol = planetPalette[Math.floor(hash*planetPalette.length)];
      // a true circle, sized off the platform's width, sitting with its top on the jump surface
      const r = Math.max(14, Math.min(p.w/2, 34));
      const cx = p.x+p.w/2, cy = sy+r;

      // shadow
      ctx.fillStyle='rgba(0,0,0,.18)';
      ctx.beginPath();ctx.ellipse(cx+2,cy+4,r,r,0,0,Math.PI*2);ctx.fill();

      let fillCol = baseCol, ringCol = 'rgba(255,255,255,.3)';
      if(p.type==='dissolving'){
        const prog=p.touched?p.dissolveT/22:0;
        fillCol = `hsl(${8-prog*8},${75-prog*35}%,${55-prog*15}%)`;
        ringCol = `rgba(255,120,90,${.6-prog*.3})`;
      } else if(p.type==='moving'){
        ringCol = 'rgba(150,200,255,.55)';
      }
      const pg = ctx.createRadialGradient(cx-r*0.3,cy-r*0.35,r*0.1,cx,cy,r*1.1);
      pg.addColorStop(0, fillCol);
      pg.addColorStop(1, 'rgba(20,20,30,0.55)');
      ctx.fillStyle=pg;
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();

      if(p.type==='moving'){
        // saturn-style ring
        ctx.strokeStyle=ringCol;
        ctx.lineWidth=2;
        ctx.beginPath();ctx.ellipse(cx,cy,r*1.4,r*0.4,0.25,0,Math.PI*2);ctx.stroke();
      }
      if(p.type==='dissolving'&&!p.touched){
        ctx.strokeStyle='rgba(255,120,90,.5)';ctx.lineWidth=1;
        ctx.setLineDash([3,4]);
        ctx.beginPath();ctx.arc(cx,cy,r*0.72,0,Math.PI*2);ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.fillStyle='rgba(255,255,255,.22)';
      ctx.beginPath();ctx.ellipse(cx-r*0.32,cy-r*0.32,r*0.32,r*0.24,0,0,Math.PI*2);ctx.fill();
    } else if(p.isFloor){
      // floor — full-width solid ground, colour shifts at night
      const nt = getDayNightT();
      const floorL = Math.round(234 - nt*60);
      ctx.fillStyle='rgba(0,0,0,.07)';
      ctx.fillRect(p.x,sy+4,p.w,p.h);
      ctx.fillStyle=`rgb(${floorL},${floorL},${floorL-2})`;
      ctx.strokeStyle=`rgba(0,0,0,${0.5+nt*0.3})`;
      ctx.lineWidth=1.5;
      ctx.beginPath();ctx.roundRect(p.x,sy,p.w,p.h,0);
      ctx.fill();ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.28)';
      ctx.fillRect(p.x,sy+2,p.w,3);
      ctx.fillStyle=`rgba(0,0,0,${0.12+nt*0.1})`;
      ctx.font='10px DM Mono,monospace';
      ctx.textAlign='center';
      ctx.fillText('floor', W/2, sy+p.h-2);
      ctx.restore();
      return;
    } else {
      // shadow
      ctx.fillStyle='rgba(0,0,0,.07)';
      ctx.beginPath();ctx.roundRect(p.x+2,sy+4,p.w,p.h,6);ctx.fill();

      // platform body — slightly desaturated at night
      const nt2 = getDayNightT();
      if(p.type==='normal'){
        const lum = Math.round(255 - nt2*30);
        ctx.fillStyle=`rgb(${lum},${lum},${lum})`;
        ctx.strokeStyle=`rgba(0,0,0,${0.7+nt2*0.2})`;
      } else if(p.type==='dissolving'){
        const prog=p.touched?p.dissolveT/22:0;
        ctx.fillStyle=`hsl(${10-prog*10},${70-prog*40}%,${92-prog*10}%)`;
        ctx.strokeStyle=`rgba(200,60,40,${.8-prog*.4})`;
      } else {
        ctx.fillStyle='#f5f8ff';
        ctx.strokeStyle='rgba(80,100,200,.7)';
      }
      ctx.lineWidth=1.5;
      ctx.beginPath();ctx.roundRect(p.x,sy,p.w,p.h,6);
      ctx.fill();ctx.stroke();

      ctx.fillStyle='rgba(255,255,255,.5)';
      ctx.beginPath();ctx.roundRect(p.x+4,sy+2,p.w-8,3,2);ctx.fill();

      if(p.type==='moving'){
        ctx.fillStyle='rgba(80,100,200,.25)';
        for(let d=0;d<3;d++){
          ctx.beginPath();ctx.arc(p.x+p.w/2-8+d*8,sy+p.h/2,2,0,Math.PI*2);ctx.fill();
        }
      }
      if(p.type==='dissolving'&&!p.touched){
        ctx.strokeStyle='rgba(200,60,40,.4)';ctx.lineWidth=1;
        ctx.setLineDash([3,4]);
        ctx.beginPath();ctx.roundRect(p.x+3,sy+3,p.w-6,p.h-6,4);ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // platRadar: glow the platform the player is heading toward
    if(runPowerups.platRadar && !p.isFloor && player.vy>0){
      const playerBottom = player.y-cameraY+player.h;
      const dist = p.y-cameraY - playerBottom;
      if(dist>0 && dist<180 && player.x+player.w>p.x+4 && player.x<p.x+p.w-4){
        const gIntensity = Math.max(0,1-dist/180);
        ctx.save();
        ctx.strokeStyle=`rgba(100,220,120,${gIntensity*0.8})`;
        ctx.lineWidth=2.5;
        ctx.shadowColor='rgba(100,220,120,0.6)';
        ctx.shadowBlur=10*gIntensity;
        if(mode==='moon'){
          const r = Math.max(14, Math.min(p.w/2, 34));
          ctx.beginPath();ctx.arc(p.x+p.w/2, sy+r, r+2, 0, Math.PI*2);ctx.stroke();
        } else {
          ctx.beginPath();ctx.roundRect(p.x-1,sy-1,p.w+2,p.h+2,7);ctx.stroke();
        }
        ctx.restore();
      }
    }

    // coin
    if(p.hasCoin&&!p.coinCollected){
      const coinX=p.x+p.w/2;
      const coinY=sy-22+Math.sin(p.coinBob)*4;
      const magnetDrawActive = runPowerups.magnet||runPowerups.magnetPlus||activeToggles.magnet||tempMagnet>0;
      const magnetDrawR = runPowerups.magnetPlus?200:110;
      if(magnetDrawActive){
        const px2=player.x+player.w/2, py2=player.y-cameraY+player.h/2;
        const dx2=coinX-px2,dy2=coinY-py2;
        const dist=Math.sqrt(dx2*dx2+dy2*dy2);
        if(dist<magnetDrawR){
          ctx.globalAlpha=p.alpha*(1-dist/magnetDrawR)*.3;
          ctx.strokeStyle='#e8a020';ctx.lineWidth=1;ctx.setLineDash([3,5]);
          ctx.beginPath();ctx.moveTo(coinX,coinY);ctx.lineTo(px2,py2);ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha=p.alpha;
        }
      }
      ctx.fillStyle='#e8a020';
      ctx.strokeStyle='#c8780a';
      ctx.lineWidth=1.5;
      ctx.shadowColor='rgba(232,160,32,.35)';ctx.shadowBlur=6;
      ctx.beginPath();ctx.arc(coinX,coinY,7,0,Math.PI*2);
      ctx.fill();ctx.stroke();
      ctx.shadowBlur=0;
      ctx.fillStyle='rgba(255,255,255,.5)';
      ctx.beginPath();ctx.arc(coinX-2,coinY-2,2.5,0,Math.PI*2);ctx.fill();
    }

    // money bag — rare, worth a lot more than a coin
    if(p.hasBag&&!p.bagCollected){
      const bagX=p.x+p.w/2;
      const bagY=sy-26+Math.sin(p.bagBob)*3;
      const magnetDrawActive = runPowerups.magnet||runPowerups.magnetPlus||activeToggles.magnet||tempMagnet>0;
      const magnetDrawR = runPowerups.magnetPlus?200:110;
      if(magnetDrawActive){
        const px2=player.x+player.w/2, py2=player.y-cameraY+player.h/2;
        const dx2=bagX-px2,dy2=bagY-py2;
        const dist=Math.sqrt(dx2*dx2+dy2*dy2);
        if(dist<magnetDrawR){
          ctx.globalAlpha=p.alpha*(1-dist/magnetDrawR)*.3;
          ctx.strokeStyle='#c8a020';ctx.lineWidth=1;ctx.setLineDash([3,5]);
          ctx.beginPath();ctx.moveTo(bagX,bagY);ctx.lineTo(px2,py2);ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha=p.alpha;
        }
      }
      ctx.save();
      ctx.shadowColor='rgba(210,160,30,.55)';ctx.shadowBlur=9;

      // round, bulging sack body (wider + rounder than a simple teardrop)
      const bagGrad = ctx.createRadialGradient(bagX-4,bagY+3,2,bagX,bagY+6,15);
      bagGrad.addColorStop(0,'#f0c26a');
      bagGrad.addColorStop(.55,'#d9a441');
      bagGrad.addColorStop(1,'#a86e22');
      ctx.fillStyle=bagGrad;
      ctx.strokeStyle='#7a4e17';
      ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(bagX-10,bagY-1);
      ctx.bezierCurveTo(bagX-13,bagY+7, bagX-10,bagY+15, bagX,bagY+16);
      ctx.bezierCurveTo(bagX+10,bagY+15, bagX+13,bagY+7, bagX+10,bagY-1);
      ctx.bezierCurveTo(bagX+9,bagY-5, bagX+5,bagY-7, bagX,bagY-7);
      ctx.bezierCurveTo(bagX-5,bagY-7, bagX-9,bagY-5, bagX-10,bagY-1);
      ctx.closePath();
      ctx.fill();ctx.stroke();

      // fabric fold lines on the body for a sack-like texture
      ctx.shadowBlur=0;
      ctx.strokeStyle='rgba(122,78,23,.45)';
      ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(bagX-6,bagY+1);ctx.quadraticCurveTo(bagX-7,bagY+8,bagX-3,bagY+13);ctx.stroke();
      ctx.beginPath();ctx.moveTo(bagX+6,bagY+1);ctx.quadraticCurveTo(bagX+7,bagY+8,bagX+3,bagY+13);ctx.stroke();

      // cinched neck — bunched fabric ruffle where the drawstring ties it off
      ctx.fillStyle='#c8934a';
      ctx.strokeStyle='#7a4e17';
      ctx.lineWidth=1;
      for(let k=-1;k<=1;k++){
        ctx.beginPath();
        ctx.ellipse(bagX+k*3.2,bagY-7,2.2,3,0,0,Math.PI*2);
        ctx.fill();ctx.stroke();
      }

      // wrapped drawstring cord around the neck
      ctx.strokeStyle='#5c3a10';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(bagX-7,bagY-6.5);ctx.quadraticCurveTo(bagX,bagY-4.5,bagX+7,bagY-6.5);ctx.stroke();
      ctx.beginPath();ctx.moveTo(bagX-6.5,bagY-9);ctx.quadraticCurveTo(bagX,bagY-11,bagX+6.5,bagY-9);ctx.stroke();

      // little knot + string tails poking up
      ctx.fillStyle='#5c3a10';
      ctx.beginPath();ctx.arc(bagX,bagY-10,1.6,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#5c3a10';ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(bagX-1.5,bagY-11);ctx.quadraticCurveTo(bagX-4,bagY-14,bagX-3,bagY-16);ctx.stroke();
      ctx.beginPath();ctx.moveTo(bagX+1.5,bagY-11);ctx.quadraticCurveTo(bagX+4,bagY-14,bagX+3,bagY-16);ctx.stroke();

      // glossy highlight for a rounder, more three-dimensional look
      ctx.fillStyle='rgba(255,255,255,.35)';
      ctx.beginPath();ctx.ellipse(bagX-5,bagY+3,2.6,4,-0.4,0,Math.PI*2);ctx.fill();

      // $ mark badge
      ctx.fillStyle='#fff8e0';
      ctx.font='bold 10px DM Mono,monospace';
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText('$',bagX,bagY+6);
      ctx.restore();
    }

    // platform powerup ? box
    if(p.platPU){
      p.puBob+=.035;
      const puX=p.x+p.w/2 + (p.hasCoin?18:0);
      const puY=sy-20+Math.sin(p.puBob)*3;
      const boxSize=18;
      if(!p.puRevealed){
        const pulse=0.85+Math.sin(p.puBob*2)*0.15;
        ctx.save();
        ctx.globalAlpha=p.alpha*pulse;
        const isBad=p.platPU.bad;
        ctx.fillStyle=isBad?'rgba(232,78,96,.9)':'rgba(255,209,102,.9)';
        ctx.strokeStyle=isBad?'rgba(180,30,50,.8)':'rgba(180,140,20,.8)';
        ctx.lineWidth=1.5;
        ctx.beginPath();ctx.roundRect(puX-boxSize/2,puY-boxSize/2,boxSize,boxSize,4);
        ctx.fill();ctx.stroke();
        ctx.fillStyle='rgba(255,255,255,.35)';
        ctx.beginPath();ctx.roundRect(puX-boxSize/2+2,puY-boxSize/2+2,boxSize-4,5,2);ctx.fill();
        ctx.fillStyle=isBad?'#fff':'#555';
        ctx.font=`bold 12px DM Mono,monospace`;
        ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText('?',puX,puY+1);
        ctx.restore();
      } else {
        ctx.save();
        ctx.globalAlpha=p.alpha*0.7;
        ctx.font='14px serif';
        ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(p.platPU.icon,puX,puY);
        ctx.restore();
      }
    }

    ctx.restore();
  });

  // particles
  particles.forEach(p=>{
    ctx.save();
    ctx.globalAlpha=Math.max(0,p.alpha);
    ctx.fillStyle=p.color;
    ctx.beginPath();ctx.arc(p.x,p.y-cameraY,p.r,0,Math.PI*2);ctx.fill();
    ctx.restore();
  });

  // player trail
  const tlen=player.trail.length;
  player.trail.forEach((t,i)=>{
    const a=((i/tlen)*.4)*(i/tlen);
    if(a<.01)return;
    ctx.save();ctx.globalAlpha=a;
    ctx.fillStyle = runPowerups.rainbowTrail ? `hsl(${(i*28+performance.now()*0.08)%360},85%,60%)` : 'rgba(80,80,80,.5)';
    const r=player.w*.2*(i/tlen);
    ctx.beginPath();ctx.arc(t.x,t.y-cameraY,r,0,Math.PI*2);ctx.fill();
    // coinTrail: golden star sparkles along trail
    if(runPowerups.coinTrail && i % 3 === 0){
      ctx.globalAlpha=a*0.8;
      ctx.fillStyle='#e8a020';
      ctx.font=`${8+i/tlen*6}px serif`;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText('★', t.x+(Math.sin(i*2.3)*5), t.y-cameraY+(Math.cos(i*1.7)*5));
    }
    ctx.restore();
  });

  drawPlayer();

  // jetpack flames
  if(jetpackTimer>0){
    const px=player.x+player.w/2, py=player.y-cameraY+player.h;
    ctx.save();
    ctx.globalAlpha=.7+Math.random()*.3;
    ctx.fillStyle='#e8a020';
    ctx.beginPath();
    ctx.moveTo(px-7,py);ctx.lineTo(px,py+12+Math.random()*8);ctx.lineTo(px+7,py);
    ctx.fill();
    ctx.fillStyle='rgba(255,160,40,.5)';
    ctx.beginPath();
    ctx.moveTo(px-4,py);ctx.lineTo(px,py+18+Math.random()*10);ctx.lineTo(px+4,py);
    ctx.fill();
    ctx.restore();
  }

  // ultra boost flash vignette
  if(ultraFlash>0){
    const g=ctx.createRadialGradient(W/2,H/2,H*.15,W/2,H/2,H*.8);
    g.addColorStop(0,'rgba(255,51,102,0)');
    g.addColorStop(1,`rgba(255,51,102,${ultraFlash*.35})`);
    ctx.save();ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();
  }


  // floating coins (coin shower)
  if(floatingCoins.length>0){
    ctx.save();
    floatingCoins.forEach(fc=>{
      if(fc.collected)return;
      ctx.globalAlpha=0.85;
      ctx.fillStyle='#e8a020';
      ctx.strokeStyle='#c8880a';
      ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.arc(fc.x, fc.y-cameraY+Math.sin(fc.bob)*4, 6, 0, Math.PI*2);
      ctx.fill();ctx.stroke();
    });
    ctx.restore();
  }

  // Dizzy camera wobble
  if(tempDizzy>0){
    const wobble=Math.sin(Date.now()/60)*12*(tempDizzy/5);
    ctx.save();ctx.translate(wobble,Math.cos(Date.now()/80)*6*(tempDizzy/5));
    // Just draw a vignette wobble indicator — actual canvas translate would break HUD
    ctx.restore();
    ctx.save();
    ctx.fillStyle=`rgba(180,60,200,${0.12*(tempDizzy/5)})`;
    ctx.fillRect(0,0,W,H);
    ctx.restore();
  }

  // Dark curse overlay
  if(tempDark>0){
    const darkAlpha=Math.min(0.75, tempDark/5*0.75);
    ctx.save();ctx.fillStyle=`rgba(0,0,0,${darkAlpha})`;ctx.fillRect(0,0,W,H);ctx.restore();
  }

  // PU pause: dim the canvas so the toast pops
  if(puPaused){
    ctx.save();
    ctx.fillStyle='rgba(240,240,238,0.55)';
    ctx.fillRect(0,0,W,H);
    ctx.restore();
  }

  // active temp powerup status bar
  const statusItems=[];
  if(tempSpring>0)       statusItems.push({icon:'🥾',t:tempSpring,bad:false});
  if(tempSlowFall>0)     statusItems.push({icon:'🪂',t:tempSlowFall,bad:false});
  if(tempMagnet>0)       statusItems.push({icon:'🧲',t:tempMagnet,bad:false});
  if(tempGhost>0)        statusItems.push({icon:'👻',t:tempGhost,bad:false});
  if(tempCoinDouble>0)   statusItems.push({icon:'💰',t:tempCoinDouble,bad:false});
  if(tempCoinTriple>0)   statusItems.push({icon:'💎',t:tempCoinTriple,bad:false});
  if(tempMini>0)         statusItems.push({icon:'🔻',t:tempMini,bad:false});
  if(tempTurbo>0)        statusItems.push({icon:'🏎️',t:tempTurbo,bad:false});
  if(tempLowGrav>0)      statusItems.push({icon:'🌙',t:tempLowGrav,bad:false});
  if(tempWide>0)         statusItems.push({icon:'↔️',t:tempWide,bad:false});
  if(tempInvincible>0)   statusItems.push({icon:'⭐',t:tempInvincible,bad:false});
  if(tempIce>0)          statusItems.push({icon:'🌀',t:tempIce,bad:true});
  if(tempFlip>0)         statusItems.push({icon:'🙃',t:tempFlip,bad:true});
  if(tempHeavy>0)        statusItems.push({icon:'🪨',t:tempHeavy,bad:true});
  if(tempBadTiny>0)      statusItems.push({icon:'🔬',t:tempBadTiny,bad:true});
  if(tempDark>0)         statusItems.push({icon:'🌑',t:tempDark,bad:true});
  if(tempNoCoin>0)       statusItems.push({icon:'📌',t:tempNoCoin,bad:true});
  if(tempDizzy>0)        statusItems.push({icon:'😵',t:tempDizzy,bad:true});
  if(parachuteActive)    statusItems.push({icon:'🎈',t:3,bad:false});
  if(statusItems.length>0){
    const pill=22, gap=4, total=statusItems.length*(pill+gap)-gap;
    let sx=W/2-total/2;
    const sy2=50;
    statusItems.forEach(s=>{
      ctx.save();
      ctx.fillStyle=s.bad?'rgba(232,78,96,.75)':'rgba(30,30,28,.65)';
      ctx.beginPath();ctx.roundRect(sx,sy2,pill,pill,6);ctx.fill();
      const frac=Math.min(1,s.t/12);
      ctx.strokeStyle=s.bad?'#e84e60':'#7fd87f';
      ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(sx+pill/2,sy2+pill/2,9,-Math.PI/2,-Math.PI/2+frac*Math.PI*2);ctx.stroke();
      ctx.font='12px serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(s.icon,sx+pill/2,sy2+pill/2);
      ctx.restore();
      sx+=pill+gap;
    });
  }
}

function drawPlayer(){
  const px=player.x, py=player.y-cameraY;
  const isWide = runPowerups.wideBody || tempWide>0;
  const isBadTiny = tempBadTiny>0;
  const miniScale = (isBadTiny) ? 0.2 : (tempMini>0||runPowerups.miniMode) ? 0.55 : 1;
  const wideScale = isWide ? 1.5 : 1;
  const sq = player.squish;
  const W2 = player.w * sq * miniScale * wideScale;
  const H2 = player.h / sq * miniScale;
  const ox = (player.w - W2) / 2;
  const oy = player.h * miniScale - H2;
  const isGhost = runPowerups.ghost||activeToggles.ghost || tempGhost>0;

  ctx.save();

  ctx.globalAlpha = isGhost ? 0.04 : 0.08;
  ctx.fillStyle='#000';
  ctx.beginPath();
  ctx.ellipse(px+player.w/2, py+player.h*miniScale+2, W2*0.6, 4*miniScale, 0, 0, Math.PI*2);
  ctx.fill();

  const skin = getEquippedSkin();
  ctx.globalAlpha = isGhost ? 0.45 : 1;
  if(skin.body === 'holo'){
    const holoT = (performance.now()/900) % (Math.PI*2);
    const grad = ctx.createLinearGradient(px+ox, py+oy, px+ox+W2, py+oy+H2);
    grad.addColorStop(0, `hsl(${(holoT*57)%360},85%,70%)`);
    grad.addColorStop(0.5, `hsl(${(holoT*57+90)%360},85%,70%)`);
    grad.addColorStop(1, `hsl(${(holoT*57+180)%360},85%,70%)`);
    ctx.fillStyle = grad;
  } else if(skin.special==='gradient' && skin.colors){
    const grad = ctx.createLinearGradient(px+ox, py+oy, px+ox+W2, py+oy+H2);
    skin.colors.forEach((c,i)=>grad.addColorStop(i/(skin.colors.length-1), c));
    ctx.fillStyle = grad;
  } else if(skin.special==='galaxy' && skin.colors){
    ctx.fillStyle = skin.body;
  } else {
    ctx.fillStyle = skin.body;
  }
  ctx.strokeStyle = skin.accent;
  ctx.lineWidth=1.8;
  if(skin.special==='glow'){
    ctx.shadowColor = skin.body;
    ctx.shadowBlur = 14;
  } else if(skin.special==='shine' || skin.special==='sunny'){
    ctx.shadowColor = skin.body;
    ctx.shadowBlur = 8;
  }
  ctx.beginPath();
  ctx.roundRect(px+ox, py+oy, W2, H2, Math.max(2, 6*miniScale));
  ctx.fill();ctx.stroke();
  ctx.shadowBlur = 0;

  // extra multi-color detailing drawn on top of the base body shape
  if(skin.special==='stripes' && skin.colors){
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(px+ox, py+oy, W2, H2, Math.max(2, 6*miniScale));
    ctx.clip();
    ctx.fillStyle = skin.colors[1];
    const stripeW = 6*miniScale;
    for(let sx=-H2; sx<W2+H2; sx+=stripeW*2){
      ctx.beginPath();
      ctx.moveTo(px+ox+sx, py+oy+H2);
      ctx.lineTo(px+ox+sx+H2, py+oy);
      ctx.lineTo(px+ox+sx+H2+stripeW, py+oy);
      ctx.lineTo(px+ox+sx+stripeW, py+oy+H2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  if(skin.special==='galaxy' && skin.colors){
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(px+ox, py+oy, W2, H2, Math.max(2, 6*miniScale));
    ctx.clip();
    const starSeed = [[.25,.3],[.7,.55],[.5,.8],[.2,.65],[.8,.25],[.4,.15]];
    starSeed.forEach((s,i)=>{
      ctx.fillStyle = skin.colors[i%skin.colors.length];
      const sx2 = px+ox+s[0]*W2, sy2 = py+oy+s[1]*H2;
      ctx.beginPath();ctx.arc(sx2, sy2, 1.4*miniScale, 0, Math.PI*2);ctx.fill();
    });
    ctx.restore();
  }
  if(skin.special==='camo' && skin.colors){
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(px+ox, py+oy, W2, H2, Math.max(2, 6*miniScale));
    ctx.clip();
    const blobSeed = [[.3,.3,1],[.7,.25,2],[.55,.7,3],[.2,.7,1]];
    blobSeed.forEach(b=>{
      ctx.fillStyle = skin.colors[b[2]];
      ctx.globalAlpha *= 0.85;
      ctx.beginPath();
      ctx.ellipse(px+ox+b[0]*W2, py+oy+b[1]*H2, W2*0.28, H2*0.22, 0, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.restore();
  }
  // metal series — a soft diagonal highlight band sweeps across the body,
  // giving copper/silver/titanium/platinum a polished, reflective look
  if(skin.special==='metal'){
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(px+ox, py+oy, W2, H2, Math.max(2, 6*miniScale));
    ctx.clip();
    const sweepT = (performance.now()/1100) % 1;
    const bandX = px+ox - H2 + sweepT*(W2+H2*2);
    const grad = ctx.createLinearGradient(bandX, py+oy, bandX+H2, py+oy+H2);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.5, 'rgba(255,255,255,.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(px+ox, py+oy, W2, H2);
    // faint bottom shadow for extra depth
    ctx.fillStyle = 'rgba(0,0,0,.12)';
    ctx.fillRect(px+ox, py+oy+H2*0.7, W2, H2*0.3);
    ctx.restore();
  }
  // sunny — bright by day, and once night falls it radiates a warm glow
  // around the player like a little portable sun
  if(skin.special==='sunny'){
    const nightT = (typeof getDayNightT === 'function') ? getDayNightT() : 0;
    if(nightT > 0.05){
      const cx = px+ox+W2/2, cy = py+oy+H2/2;
      const glowR = (26 + nightT*30) * miniScale;
      ctx.save();
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      g.addColorStop(0, `rgba(255,225,77,${0.55*nightT})`);
      g.addColorStop(0.5, `rgba(255,200,60,${0.22*nightT})`);
      g.addColorStop(1, 'rgba(255,200,60,0)');
      ctx.fillStyle = g;
      ctx.beginPath();ctx.arc(cx, cy, glowR, 0, Math.PI*2);ctx.fill();
      ctx.restore();
    }
  }

  const dir = player.vx>0.4 ? 1 : player.vx<-0.4 ? -1 : 0;
  const ex = px + player.w/2 + dir*3*miniScale;
  const ey = py + oy + H2*0.3;
  const er = 2.2*miniScale;
  const eo = 4*miniScale;
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.arc(ex-eo, ey, er, 0, Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(ex+eo, ey, er, 0, Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.8)';
  ctx.beginPath();ctx.arc(ex-eo+dir*0.5-miniScale, ey-miniScale, miniScale, 0, Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(ex+eo+dir*0.5-miniScale, ey-miniScale, miniScale, 0, Math.PI*2);ctx.fill();

  if(runPowerups.shield||runPowerups.doubleShield){
    ctx.strokeStyle=runPowerups.doubleShield?'rgba(255,200,80,.75)':'rgba(100,160,255,.65)';
    ctx.lineWidth=runPowerups.doubleShield?3:2;
    ctx.beginPath();
    ctx.roundRect(px+ox-3, py+oy-3, W2+6, H2+6, Math.max(2, 9*miniScale));
    ctx.stroke();
    // second ring for double shield
    if(runPowerups.doubleShield){
      ctx.strokeStyle='rgba(255,200,80,.25)';
      ctx.lineWidth=6;
      ctx.beginPath();
      ctx.roundRect(px+ox-6, py+oy-6, W2+12, H2+12, Math.max(2, 12*miniScale));
      ctx.stroke();
    }
  }

  const equippedPetObj = getEquippedPet();
  if(equippedPetObj){
    const petBob = Math.sin(performance.now()/280) * 2.2 * miniScale;
    const petCx = px+ox+W2/2;
    const petCy = py+oy - 8*miniScale + petBob;
    ctx.save();
    ctx.font = `${Math.round(14*miniScale)}px serif`;
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(equippedPetObj.icon, petCx, petCy);
    ctx.restore();
  }

  ctx.restore();
}

function drawCloud(x,y,w,h){
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x,y,w/2,h/2,0,0,Math.PI*2);
  ctx.ellipse(x-w*.25,y+h*.1,w*.3,h*.4,0,0,Math.PI*2);
  ctx.ellipse(x+w*.25,y+h*.1,w*.3,h*.4,0,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}

/* ════════════════════════════════════════
   SHOP UI
════════════════════════════════════════ */
let shopFilterState = { search:'', category:'all', priceRange:'all' };

function shopPriceInRange(price, range){
  if(range==='all') return true;
  const parts = range.split('-').map(Number);
  return price>=parts[0] && price<=parts[1];
}

function shopMatchesSearch(item, q){
  if(!q) return true;
  const hay = (item.name+' '+item.desc).toLowerCase();
  return hay.includes(q);
}

function initShopControls(){
  const searchEl = document.getElementById('shop-search');
  const catEl = document.getElementById('shop-category-filter');
  const priceEl = document.getElementById('shop-price-filter');
  if(!searchEl || searchEl._wired) return;
  searchEl._wired = true;
  searchEl.value = shopFilterState.search;
  catEl.value = shopFilterState.category;
  priceEl.value = shopFilterState.priceRange;
  searchEl.addEventListener('input', ()=>{ shopFilterState.search = searchEl.value.trim().toLowerCase(); renderShop(); });
  catEl.addEventListener('change', ()=>{ shopFilterState.category = catEl.value; renderShop(); });
  priceEl.addEventListener('change', ()=>{ shopFilterState.priceRange = priceEl.value; renderShop(); });
}

function buildShopCard(item, discountMap){
  const isOwned=!!owned[item.id];
  const deal = !isOwned ? discountMap[item.id] : null;
  const basePrice = itemPrice(item);
  const finalPrice = deal ? Math.max(1, Math.round(basePrice * (1 - deal.pct/100))) : basePrice;
  const canAfford=savedCoins>=finalPrice;
  const locked = !isOwned && !canAfford;
  const card=document.createElement('div');
  card.className='shop-card'+(isOwned?' owned':'')+(locked?' cannot-afford':'')+(deal?` on-sale-${deal.tier}`:'')+(item.mega?' mega-card':'');
  card.innerHTML=`<div class="shop-icon">${item.icon}</div>
    <div class="shop-name">${item.name}</div>
    ${item.mega?`<div class="mega-badge">💎 mega vault · permanent</div>`:''}
    ${deal?`<div class="sale-badge sale-badge-${deal.tier}">-${deal.pct}% SALE</div>`:''}
    <div class="shop-desc">${item.desc}</div>
    <div class="shop-price">
      ${isOwned
        ?`<span class="owned-tag">✓ queued</span>`
        :deal
          ?`<div class="coin-dot"></div><span class="price-tag sale-price-${deal.tier}">${finalPrice}c</span><span class="price-original">${basePrice}c</span>`
          :`<div class="coin-dot"></div><span class="price-tag">${finalPrice}c</span>`}
    </div>`;
  if(!isOwned&&canAfford){
    card.addEventListener('click',()=>buyItem(item, finalPrice));
  }
  return card;
}

/* curated pool of generally-strong picks used for the "recommended for you" card */
const GOOD_ITEM_IDS = [
  'double_jump','magnet','shield','coin_double','boost_tank','wide_body','hyper_boots',
  'coin_trail','sticky_boots','turbo','curse_ward','jetpack','last_chance','boost_regen',
  'lucky','ghost','coin_quintuple','triple_shield','magnet_plus','score_saver','phase_dash',
  'starter_pack','coin_interest','platform_radar',
];
function getRecommendedItem(){
  const candidates = GOOD_ITEM_IDS
    .map(id=>SHOP_ITEMS.find(it=>it.id===id))
    .filter(item=>item && !owned[item.id]);
  if(candidates.length===0) return null;
  const affordable = candidates.filter(item=>itemPrice(item)<=savedCoins);
  if(affordable.length){
    // best item they can actually afford right now
    affordable.sort((a,b)=>itemPrice(b)-itemPrice(a));
    return affordable[0];
  }
  // nothing in range yet — surface the cheapest good item as the next goal
  candidates.sort((a,b)=>itemPrice(a)-itemPrice(b));
  return candidates[0];
}
function buildRecommendedCard(item, discountMap){
  const card = buildShopCard(item, discountMap);
  card.classList.add('recommended-card');
  const ribbon = document.createElement('div');
  ribbon.className='recommended-ribbon';
  ribbon.textContent='⭐ recommended';
  card.prepend(ribbon);
  return card;
}

function renderShop(){
  document.getElementById('shop-coin-count').textContent=savedCoins;
  const grid=document.getElementById('shop-grid');
  grid.innerHTML='';
  // remove any previously-built seasonal dropdown before re-rendering
  const prevDetails = grid.parentElement.querySelector('.shop-seasonal-details');
  if(prevDetails) prevDetails.remove();
  initShopControls();

  const q = shopFilterState.search;
  const cat = shopFilterState.category;
  const priceRange = shopFilterState.priceRange;
  const isFiltering = !!q || cat!=='all' || priceRange!=='all';

  // Build discount lookup from currentShopDiscounts
  const discountMap = {};
  currentShopDiscounts.forEach(d => { discountMap[d.id] = d; });

  const sections=[
    {key:'mega', label:'💎 mega vault — permanent boosts, once bought active forever', ids: MEGA_ITEMS.map(it=>it.id)},
    {key:'value bundles', label:'value bundles — 20c each, stacked benefits', ids:['starter_pack','safety_net','speed_demon','coin_rush','survivor_kit']},
    {key:'movement', label:'movement', ids:['double_jump','triple_jump','quad_jump','spring_boots','hyper_boots','slow_fall','jetpack','rocket_boost','turbo','wall_bounce','low_gravity','phase_dash','head_start']},
    {key:'coins & collection', label:'coins & collection', ids:['coin_double','coin_triple','coin_quintuple','magnet','magnet_plus','coin_trail','coin_interest']},
    {key:'survival', label:'survival', ids:['shield','double_shield','triple_shield','ghost','last_chance','sticky_boots','safe_landing','death_save']},
    {key:'boosts', label:'boosts', ids:['boost_tank','boost_tank2','boost_regen','free_boost','double_boost']},
    {key:'special', label:'special', ids:['mini_mode','wide_body','time_warp','platform_lock','score_rush','extra_plats','lucky','mirror','curse_ward','platform_radar','coin_shower','speed_cap','boost_on_land','ultra_start','platform_wide','score_x2_boost','parachute','coin_bomb','platform_spring','score_streak','rainbow_trail','score_saver']},
  ];

  // ── recommended item — one good pick in the player's price range, always first ──
  if(!isFiltering){
    const rec = getRecommendedItem();
    if(rec){
      const rlbl=document.createElement('div');
      rlbl.className='shop-section-label';
      rlbl.textContent='⭐ recommended for you';
      grid.appendChild(rlbl);
      grid.appendChild(buildRecommendedCard(rec, discountMap));
    }
  }

  // ── pets — sits to the right of the recommended card, locked behind a one-time unlock ──
  if(!isFiltering){
    renderPetsSection(grid);
  }

  // ── seasonal section (active holidays) — only shown when not filtering ──
  const activeSeasons = getActiveSeasons();
  const unlockedSeasonal = getUnlockedSeasonalItems();
  const seasonLabels = {christmas:'🎄 christmas', stpatricks:'☘️ st. patrick\'s day', easter:'🥚 easter', thanksgiving:'🦃 thanksgiving'};
  const seasonUnlockHint = {
    christmas:'unlocks late november',
    stpatricks:'unlocks mid february',
    easter:'unlocks ~4 weeks before easter',
    thanksgiving:'unlocks late october',
  };
  if(!isFiltering && unlockedSeasonal.length > 0){
    ['christmas','stpatricks','easter','thanksgiving'].forEach(season => {
      const items = unlockedSeasonal.filter(it => it.season === season);
      if(items.length === 0) return;
      const lbl=document.createElement('div');
      lbl.className='shop-section-label shop-section-seasonal';
      lbl.textContent=seasonLabels[season] + ' (free · seasonal)';
      grid.appendChild(lbl);
      items.forEach(item => {
        const isOwned=!!owned[item.id];
        const card=document.createElement('div');
        card.className='shop-card seasonal-card'+(isOwned?' owned':'');
        card.innerHTML=`<div class="shop-icon">${item.icon}</div>
          <div class="shop-name">${item.name}</div>
          <div class="shop-seasonal-badge">seasonal · free</div>
          <div class="shop-desc">${item.desc}</div>
          <div class="shop-price">
            ${isOwned
              ?`<span class="owned-tag">✓ queued</span>`
              :`<span class="price-tag seasonal-free">FREE</span>`}
          </div>`;
        if(!isOwned){
          card.addEventListener('click',()=>buySeasonalItem(item));
        }
        grid.appendChild(card);
      });
    });
  }

  let anyResult = false;

  // gather each section's matching items, sorted cheapest → priciest within the section,
  // then order the sections themselves by their cheapest item so the whole grid reads
  // cheap-at-top, expensive-at-bottom
  const builtSections = sections
    .filter(sec => cat==='all' || cat===sec.key)
    .map(sec=>{
      const matchingItems = sec.ids
        .map(id=>SHOP_ITEMS.find(it=>it.id===id))
        .filter(item=>item && shopMatchesSearch(item,q) && shopPriceInRange(itemPrice(item), priceRange))
        .sort((a,b)=>itemPrice(a)-itemPrice(b));
      return {sec, matchingItems};
    })
    .filter(({matchingItems})=>matchingItems.length>0)
    .sort((a,b)=>itemPrice(a.matchingItems[0])-itemPrice(b.matchingItems[0]));

  builtSections.forEach(({sec, matchingItems})=>{
    anyResult = true;

    const lbl=document.createElement('div');
    lbl.className='shop-section-label';
    lbl.textContent = sec.key==='mega' && !megaVaultUnlocked
      ? '💎 mega vault — permanent boosts, hidden until unlocked'
      : sec.label;
    grid.appendChild(lbl);

    if(sec.key==='mega' && !megaVaultUnlocked){
      const canUnlock = savedCoins >= MEGA_VAULT_UNLOCK_COST;
      const unlockCard=document.createElement('div');
      unlockCard.className='shop-card mega-unlock-card'+(canUnlock?'':' cannot-afford');
      unlockCard.innerHTML=`<div class="shop-icon">🔓</div>
        <div class="shop-name">unlock mega vault</div>
        <div class="mega-badge">💎 mega vault · permanent</div>
        <div class="shop-desc">reveal all ${matchingItems.length} mega vault items so you can see &amp; buy them</div>
        <div class="shop-price"><div class="coin-dot"></div><span class="price-tag">${MEGA_VAULT_UNLOCK_COST.toLocaleString()}c</span></div>`;
      if(canUnlock) unlockCard.addEventListener('click', buyMegaVaultUnlock);
      grid.appendChild(unlockCard);

      matchingItems.forEach(item=>{
        const isOwned=!!owned[item.id];
        if(isOwned){ grid.appendChild(buildShopCard(item, discountMap)); return; }
        const card=document.createElement('div');
        card.className='shop-card mega-card mega-mystery-card';
        card.innerHTML=`<div class="shop-icon">❓</div>
          <div class="shop-name">???</div>
          <div class="mega-badge">💎 mega vault · permanent</div>
          <div class="shop-desc">unlock the mega vault to reveal this item</div>
          <div class="shop-price"><span class="price-tag mega-mystery-price">unlock to reveal</span></div>`;
        grid.appendChild(card);
      });
      return;
    }

    matchingItems.forEach(item=>{
      grid.appendChild(buildShopCard(item, discountMap));
    });
  });

  // ── rebirth — always the priciest thing in the shop, so it goes dead last ──
  if(!isFiltering){
    const cost = rebirthCost();
    const canRebirth = savedCoins >= cost;
    const rlbl=document.createElement('div');
    rlbl.className='shop-section-label';
    rlbl.textContent='☯ rebirth — reset for a permanent boost';
    grid.appendChild(rlbl);
    const rcard=document.createElement('div');
    rcard.className='shop-card rebirth-card'+(canRebirth?'':' cannot-afford');
    rcard.innerHTML=`<div class="shop-icon">☯</div>
      <div class="shop-name">rebirth ${rebirthCount>0?`(×${rebirthCount})`:''}</div>
      <div class="shop-desc">reset all coins, shop items &amp; skins for a permanent ×${rebirthNextMult()} coin multiplier, forever${rebirthMult>1?` (currently ×${rebirthMult})`:''}</div>
      <div class="shop-price"><div class="coin-dot"></div><span class="price-tag">${cost.toLocaleString()}c</span></div>`;
    if(canRebirth) rcard.addEventListener('click', performRebirth);
    grid.appendChild(rcard);
    anyResult = true;
  }

  if(!anyResult){
    const empty=document.createElement('div');
    empty.className='shop-no-results';
    empty.textContent='no items match your search/filters';
    grid.appendChild(empty);
  }

  // ── seasonal section (out of season) — collapsible dropdown tab ──
  if(!isFiltering){
    const outOfSeason = ['christmas','stpatricks','easter','thanksgiving'].filter(s=>!activeSeasons.includes(s));
    if(outOfSeason.length){
      const details=document.createElement('details');
      details.className='shop-seasonal-details';
      const summary=document.createElement('summary');
      summary.className='shop-seasonal-summary';
      summary.textContent='🔒 seasonal items (out of season) — tap to view';
      details.appendChild(summary);
      outOfSeason.forEach(season=>{
        const items = SEASONAL_ITEMS[season];
        if(!items || items.length===0) return;
        const lbl=document.createElement('div');
        lbl.className='shop-section-label shop-section-seasonal shop-section-locked';
        lbl.textContent=seasonLabels[season] + ' — ' + seasonUnlockHint[season];
        details.appendChild(lbl);
        const wrap=document.createElement('div');
        wrap.className='shop-grid shop-seasonal-inner-grid';
        items.forEach(item=>{
          const isOwned=!!owned[item.id];
          const card=document.createElement('div');
          card.className='shop-card seasonal-card seasonal-locked'+(isOwned?' owned':'');
          card.innerHTML=`<div class="shop-icon">${item.icon}</div>
            <div class="shop-name">${item.name}</div>
            <div class="shop-seasonal-badge shop-seasonal-badge-locked">🔒 seasonal</div>
            <div class="shop-desc">${item.desc}</div>
            <div class="shop-price">
              ${isOwned
                ?`<span class="owned-tag">✓ queued</span>`
                :`<span class="price-tag seasonal-locked-tag">not in season</span>`}
            </div>`;
          wrap.appendChild(card);
        });
        details.appendChild(wrap);
      });
      grid.parentElement.insertBefore(details, grid.nextSibling);
    }
  }
}

/* ════════════════════════════════════════
   REBIRTH — reset progress for a permanent coin multiplier
════════════════════════════════════════ */
function rebirthCost(){
  return Math.round(20000 * Math.pow(2, rebirthCount));
}
function rebirthNextMult(){
  return Math.pow(2, rebirthCount + 1);
}
function saveAllProgress(){
  try{
    localStorage.setItem('jump_coins', savedCoins);
    localStorage.setItem('jump_owned', JSON.stringify(owned));
    localStorage.setItem('jump_purchases', JSON.stringify(purchaseCounts));
    localStorage.setItem('jump_skins_owned', JSON.stringify(ownedSkins));
    localStorage.setItem('jump_skin_equipped', equippedSkin);
    localStorage.setItem('jump_skins_unlocked', skinsUnlocked ? '1' : '0');
    localStorage.setItem('jump_rebirth_count', rebirthCount);
  }catch(e){}
}
function buyMegaVaultUnlock(){
  if(megaVaultUnlocked || savedCoins < MEGA_VAULT_UNLOCK_COST) return;
  savedCoins -= MEGA_VAULT_UNLOCK_COST;
  megaVaultUnlocked = true;
  try{
    localStorage.setItem('jump_coins', savedCoins);
    localStorage.setItem('jump_mega_vault_unlocked', '1');
  }catch(e){}
  animateCoinHUD();
  sfx('buy');
  renderShop();
}

function performRebirth(){
  const cost = rebirthCost();
  if(savedCoins < cost) return;
  const confirmed = window.confirm(
    `Rebirth for ${cost.toLocaleString()}c?\n\nYou will permanently lose ALL coins, shop items, and skins.\nIn exchange you get a permanent ×${rebirthNextMult()} coin multiplier, forever.`
  );
  if(!confirmed) return;
  savedCoins = 0;
  owned = {};
  purchaseCounts = {};
  ownedSkins = {skin_normal:true};
  equippedSkin = 'skin_normal';
  skinsUnlocked = false;
  rebirthCount += 1;
  rebirthMult = Math.pow(2, rebirthCount);
  saveAllProgress();
  animateCoinHUD();
  sfx('buy');
  renderShop();
  renderSkins();
}

function buyItem(item, finalPrice){
  const price = finalPrice !== undefined ? finalPrice : itemPrice(item);
  if(savedCoins<price)return;
  savedCoins-=price;
  owned[item.id]=true;
  purchaseCounts[item.id]=(purchaseCounts[item.id]||0)+1;
  try{
    localStorage.setItem('jump_coins',savedCoins);
    localStorage.setItem('jump_owned',JSON.stringify(owned));
    localStorage.setItem('jump_purchases',JSON.stringify(purchaseCounts));
  }catch(e){}
  if(item.type==='toggle'){activeToggles[item.key]=true;}
  if(item.type==='run'){runPowerups[item.key]=true;}
  animateCoinHUD();
  sfx('buy');
  renderShop();
}

function buySeasonalItem(item){
  // Seasonal items are always free
  owned[item.id]=true;
  try{ localStorage.setItem('jump_owned',JSON.stringify(owned)); }catch(e){}
  animateCoinHUD();
  sfx('buy');
  renderShop();
}

/* ════════════════════════════════════════
   SKINS UI
════════════════════════════════════════ */
function skinSwatchStyle(skin){
  if(skin.body === 'holo'){
    return 'background: linear-gradient(135deg,#ff6bd6,#6bd6ff,#ffe66b,#a66bd6); background-size:300% 300%; animation: holoShift 3s ease infinite;';
  }
  if(skin.special === 'stripes' && skin.colors){
    const [c0,c1] = skin.colors;
    return `background: repeating-linear-gradient(45deg, ${c0} 0 6px, ${c1} 6px 12px);`;
  }
  if(skin.special === 'gradient' && skin.colors){
    return `background: linear-gradient(135deg, ${skin.colors.join(',')});`;
  }
  if(skin.special === 'galaxy' && skin.colors){
    return `background: radial-gradient(circle at 30% 30%, ${skin.colors[0]} 0 3px, transparent 4px),
      radial-gradient(circle at 70% 60%, ${skin.colors[1]} 0 3px, transparent 4px),
      radial-gradient(circle at 50% 80%, ${skin.colors[2]} 0 2px, transparent 3px),
      radial-gradient(circle at 20% 65%, ${skin.colors[3]} 0 2px, transparent 3px),
      ${skin.body};`;
  }
  if(skin.special === 'camo' && skin.colors){
    return `background: radial-gradient(circle at 25% 30%, ${skin.colors[1]} 0 30%, transparent 55%),
      radial-gradient(circle at 70% 20%, ${skin.colors[2]} 0 28%, transparent 55%),
      radial-gradient(circle at 60% 70%, ${skin.colors[3]} 0 30%, transparent 55%),
      ${skin.colors[0]};`;
  }
  if(skin.special === 'metal'){
    return `background: linear-gradient(115deg, ${skin.body} 0%, #ffffff 45%, ${skin.body} 60%, #ffffff 80%, ${skin.body} 100%);`;
  }
  if(skin.special === 'sunny'){
    return `background: radial-gradient(circle at 40% 35%, #fff6c8 0%, ${skin.body} 55%, #e8a020 100%); box-shadow: inset 0 0 6px rgba(255,255,255,.6);`;
  }
  return `background:${skin.body};`;
}
function unlockSkinsShop(){
  if(skinsUnlocked || savedCoins < SKINS_UNLOCK_COST) return;
  savedCoins -= SKINS_UNLOCK_COST;
  skinsUnlocked = true;
  ownedSkins['skin_slate'] = true; // slate is free, granted the moment the shop unlocks
  try{
    localStorage.setItem('jump_coins', savedCoins);
    localStorage.setItem('jump_skins_unlocked', '1');
    localStorage.setItem('jump_skins_owned', JSON.stringify(ownedSkins));
  }catch(e){}
  animateCoinHUD();
  sfx('buy');
  renderSkins();
}
function buildSkinCard(skin){
  const isOwned = !!ownedSkins[skin.id];
  const isEquipped = equippedSkin === skin.id;
  const canAfford = savedCoins >= skin.price;
  const card=document.createElement('div');
  card.className='skin-card'
    + (isOwned?' owned':'')
    + (isEquipped?' equipped':'')
    + ((!isOwned && !canAfford)?' cannot-afford':'')
    + (skin.special?` skin-special-${skin.special}`:'');
  card.innerHTML=`
    <div class="skin-swatch" style="${skinSwatchStyle(skin)}"></div>
    <div class="skin-name">${skin.name}</div>
    <div class="skin-status">
      ${isEquipped
        ? `<span class="skin-equipped-tag">✓ equipped</span>`
        : isOwned
          ? `<span class="skin-owned-tag">owned</span>`
          : skin.price === 0
            ? `<span class="price-tag">free</span>`
            : `<div class="coin-dot"></div><span class="price-tag">${skin.price}c</span>`}
    </div>
    ${skin.coinMult && skin.coinMult>1 ? `<div class="skin-mult-tag">×${skin.coinMult} base coins${isEquipped?' (active)':''}</div>` : ''}`;
  if(isEquipped){
    // no-op, already equipped
  } else if(isOwned){
    card.addEventListener('click', ()=>equipSkin(skin.id));
  } else if(canAfford){
    card.addEventListener('click', ()=>buySkin(skin));
  }
  return card;
}
function renderSkins(){
  const grid=document.getElementById('skins-grid');
  if(!grid) return;
  document.getElementById('skins-coin-count').textContent = savedCoins;
  grid.innerHTML='';

  // ── locked: only normal + the unlock card show, side by side ──
  if(!skinsUnlocked){
    const normalSkin = SKINS.find(s=>s.id==='skin_normal');
    if(normalSkin) grid.appendChild(buildSkinCard(normalSkin));

    const canAfford = savedCoins >= SKINS_UNLOCK_COST;
    const unlockCard=document.createElement('div');
    unlockCard.className='skin-card skins-unlock-all-card'+(canAfford?'':' cannot-afford');
    unlockCard.innerHTML=`
      <div class="skin-swatch skins-unlock-all-swatch">🔓</div>
      <div class="skin-name">unlock skins</div>
      <div class="skin-status"><div class="coin-dot"></div><span class="price-tag">${SKINS_UNLOCK_COST}c</span></div>`;
    if(canAfford) unlockCard.addEventListener('click', unlockSkinsShop);
    grid.appendChild(unlockCard);
    return;
  }

  // ── unlocked: every skin shows, each still needs to be bought individually (slate is free) ──
  SKINS.forEach(skin=>{
    grid.appendChild(buildSkinCard(skin));
  });
}
function buySkin(skin){
  if(savedCoins < skin.price) return;
  savedCoins -= skin.price;
  ownedSkins[skin.id] = true;
  equippedSkin = skin.id;
  try{
    localStorage.setItem('jump_coins', savedCoins);
    localStorage.setItem('jump_skins_owned', JSON.stringify(ownedSkins));
    localStorage.setItem('jump_skin_equipped', equippedSkin);
  }catch(e){}
  animateCoinHUD();
  sfx('buy');
  renderSkins();
}
function equipSkin(id){
  if(!ownedSkins[id]) return;
  equippedSkin = id;
  try{ localStorage.setItem('jump_skin_equipped', equippedSkin); }catch(e){}
  sfx('buy');
  renderSkins();
}
function getEquippedSkin(){
  return SKINS.find(s=>s.id===equippedSkin) || SKINS[0];
}

// ── pets ──
function getEquippedPet(){
  if(!equippedPet) return null;
  return PETS.find(p=>p.id===equippedPet) || null;
}
function getPetCoinMult(){
  const pet=getEquippedPet();
  return pet ? pet.coinMult : 1;
}
function getPetSpeedMult(){
  const pet=getEquippedPet();
  return pet ? pet.speedMult : 1;
}
function buyPet(pet){
  if(savedCoins < pet.price) return;
  savedCoins -= pet.price;
  ownedPets[pet.id] = true;
  equippedPet = pet.id;
  try{
    localStorage.setItem('jump_coins', savedCoins);
    localStorage.setItem('jump_pets_owned', JSON.stringify(ownedPets));
    localStorage.setItem('jump_pet_equipped', equippedPet);
  }catch(e){}
  animateCoinHUD();
  sfx('buy');
  renderShop();
}
function equipPet(id){
  if(id!==null && !ownedPets[id]) return;
  equippedPet = id;
  try{
    if(equippedPet) localStorage.setItem('jump_pet_equipped', equippedPet);
    else localStorage.removeItem('jump_pet_equipped');
  }catch(e){}
  sfx('buy');
  renderShop();
}
function buildPetCard(pet){
  const isOwned = !!ownedPets[pet.id];
  const isEquipped = equippedPet === pet.id;
  const canAfford = savedCoins >= pet.price;
  const card=document.createElement('div');
  card.className='shop-card pet-card'
    + (isOwned?' owned':'')
    + (isEquipped?' equipped':'')
    + ((!isOwned && !canAfford)?' cannot-afford':'');
  card.innerHTML=`<div class="shop-icon">${pet.icon}</div>
    <div class="shop-name">${pet.name}</div>
    <div class="pet-badge">🐾 pet · permanent · one equipped at a time</div>
    <div class="shop-desc">${pet.desc}</div>
    <div class="shop-price">
      ${isEquipped
        ? `<span class="skin-equipped-tag">✓ equipped</span>`
        : isOwned
          ? `<span class="skin-owned-tag">owned</span>`
          : `<div class="coin-dot"></div><span class="price-tag">${pet.price.toLocaleString()}c</span>`}
    </div>`;
  if(isEquipped){
    // no-op, already equipped
  } else if(isOwned){
    card.addEventListener('click', ()=>equipPet(pet.id));
  } else if(canAfford){
    card.addEventListener('click', ()=>buyPet(pet));
  }
  return card;
}
function buyPetsUnlock(){
  if(petsUnlocked || savedCoins < PETS_UNLOCK_COST) return;
  savedCoins -= PETS_UNLOCK_COST;
  petsUnlocked = true;
  try{
    localStorage.setItem('jump_coins', savedCoins);
    localStorage.setItem('jump_pets_unlocked', '1');
  }catch(e){}
  animateCoinHUD();
  sfx('buy');
  renderShop();
}
function renderPetsSection(grid){
  if(!petsUnlocked){
    const canAfford = savedCoins >= PETS_UNLOCK_COST;
    const card=document.createElement('div');
    card.className='shop-card'+(canAfford?'':' cannot-afford');
    card.innerHTML=`<div class="shop-icon">🐾</div>
      <div class="shop-name">unlock pets</div>
      <div class="shop-desc">reveal 4 pets that boost speed &amp; coins — equip one at a time</div>
      <div class="shop-price"><div class="coin-dot"></div><span class="price-tag">${PETS_UNLOCK_COST.toLocaleString()}c</span></div>`;
    if(canAfford) card.addEventListener('click', buyPetsUnlock);
    grid.appendChild(card);
    return;
  }
  PETS.forEach(pet=>grid.appendChild(buildPetCard(pet)));
}
function openSkins(){
  renderSkins();
  document.getElementById('skins-overlay').classList.remove('hidden');
}
function closeSkins(){
  document.getElementById('skins-overlay').classList.add('hidden');
  if(gameState==='paused') togglePause(false);
}

/* ════════════════════════════════════════
   ALL-TIME STATS
════════════════════════════════════════ */
function saveStats(){
  try{ localStorage.setItem('jump_stats', JSON.stringify(allTimeStats)); }catch(e){}
}

function loadStats(){
  try{
    const s = JSON.parse(localStorage.getItem('jump_stats'));
    if(s) allTimeStats = {...allTimeStats, ...s};
  }catch(e){}
}

function openStatsOverlay(){
  const o = document.getElementById('stats-overlay');
  document.getElementById('stats-total-runs').textContent = allTimeStats.totalRuns;
  document.getElementById('stats-total-coins').textContent = allTimeStats.totalCoins;
  document.getElementById('stats-best-score').textContent = allTimeStats.bestScore;
  document.getElementById('stats-best-height').textContent = allTimeStats.bestHeight + 'm';
  document.getElementById('stats-best-coins').textContent = allTimeStats.bestRunCoins;
  document.getElementById('stats-best-mode').textContent = allTimeStats.bestMode;
  document.getElementById('stats-wallet').textContent = savedCoins;
  // per-mode best scores
  ['easy','normal','hard','chaos','moon'].forEach(m=>{
    const el = document.getElementById('stats-mode-'+m);
    if(el) el.textContent = highScores[m] || 0;
  });
  o.classList.remove('hidden');
}

/* ════════════════════════════════════════
   IMAGE CONFIG UI
════════════════════════════════════════ */
function openImgConfig(){
  renderImgConfigList();
  document.getElementById('img-config-overlay').classList.remove('hidden');
}

function closeImgConfig(){
  document.getElementById('img-config-overlay').classList.add('hidden');
}

function loadImgConfig(){
  try{
    const raw = localStorage.getItem('jump_img_config');
    if(raw){
      const parsed = JSON.parse(raw);
      // new shape only: {urls:[...], interval, duration}. Old per-slot array
      // configs are ignored/reset since the whole trigger model changed.
      if(parsed && Array.isArray(parsed.urls)){
        // add any default ad slots (e.g. newly-added ad4.jpg/ad5.jpg) that a
        // saved config from an earlier version doesn't have yet
        const urls = [...parsed.urls];
        FLOATING_IMG_CONFIG.urls.forEach(u=>{ if(!urls.includes(u)) urls.push(u); });
        floatingImgConfig = {
          urls,
          interval: parseInt(parsed.interval) || 30,
          duration: parseInt(parsed.duration) || 10,
        };
      }
    }
  }catch(e){}
}

function saveImgConfig(){
  try{ localStorage.setItem('jump_img_config', JSON.stringify(floatingImgConfig)); }catch(e){}
}

function renderImgConfigList(){
  // ── global settings row (interval / duration) ──
  const settingsRow = document.getElementById('img-config-settings');
  if(settingsRow){
    settingsRow.innerHTML = '';

    const intervalLabel = document.createElement('span');
    intervalLabel.style.cssText='font-family:DM Mono,monospace;font-size:.6rem;color:#bbb';
    intervalLabel.textContent='show one every (score)';
    const intervalInput = document.createElement('input');
    intervalInput.className = 'img-config-score-input';
    intervalInput.type = 'number';
    intervalInput.min = '5';
    intervalInput.value = floatingImgConfig.interval || 30;
    intervalInput.addEventListener('input', ()=>{ floatingImgConfig.interval = parseInt(intervalInput.value)||30; });

    const durLabel = document.createElement('span');
    durLabel.style.cssText='font-family:DM Mono,monospace;font-size:.6rem;color:#bbb;margin-left:10px';
    durLabel.textContent='duration (s)';
    const durInput = document.createElement('input');
    durInput.className = 'img-config-score-input';
    durInput.type = 'number';
    durInput.min = '2';
    durInput.max = '30';
    durInput.value = floatingImgConfig.duration || 10;
    durInput.addEventListener('input', ()=>{ floatingImgConfig.duration = parseInt(durInput.value)||10; });

    settingsRow.appendChild(intervalLabel);
    settingsRow.appendChild(intervalInput);
    settingsRow.appendChild(durLabel);
    settingsRow.appendChild(durInput);
  }

  // ── image url list — shuffled + shown one at a time, no repeats in a row ──
  const list = document.getElementById('img-config-list');
  list.innerHTML = '';
  floatingImgConfig.urls.forEach((url,i)=>{
    const row = document.createElement('div');
    row.className = 'img-config-row';

    // thumb preview
    let thumbEl;
    if(url){
      thumbEl = document.createElement('img');
      thumbEl.className = 'img-config-thumb';
      thumbEl.src = url;
      thumbEl.onerror = ()=>{ thumbEl.style.display='none'; };
    } else {
      thumbEl = document.createElement('div');
      thumbEl.className = 'img-config-thumb-empty';
      thumbEl.textContent = '16:9';
    }

    const details = document.createElement('div');
    details.className = 'img-config-details';

    const urlInput = document.createElement('input');
    urlInput.className = 'img-config-url-input';
    urlInput.type = 'text';
    urlInput.placeholder = 'image url (16:9)';
    urlInput.value = url || '';
    urlInput.addEventListener('input', ()=>{ floatingImgConfig.urls[i] = urlInput.value.trim(); });

    details.appendChild(urlInput);

    const delBtn = document.createElement('button');
    delBtn.className = 'img-config-del';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', ()=>{
      floatingImgConfig.urls.splice(i,1);
      renderImgConfigList();
    });

    row.appendChild(thumbEl);
    row.appendChild(details);
    row.appendChild(delBtn);
    list.appendChild(row);
  });
}

/* ════════════════════════════════════════
   UI HELPERS
════════════════════════════════════════ */
function updateHSDisplay(){
  const el=document.getElementById('menu-hs');
  el.innerHTML=Object.entries(highScores).map(([k,v])=>
    `<div class="hs-entry">${k}<strong>${v}</strong></div>`).join('');
}

function togglePause(force){
  if(afkPromptActive) return;
  if(gameState!=='playing'&&gameState!=='paused')return;
  paused=force!==undefined?force:!paused;
  gameState=paused?'paused':'playing';
  document.getElementById('pause-overlay').classList.toggle('hidden',!paused);
  if(!paused){lastTime=performance.now();lastActivityTime=performance.now();loop(lastTime);}
  updateBoostRefillBtn();
}

function goMenu(){
  if(animId)cancelAnimationFrame(animId);
  gameState='idle';
  puPaused=false;
  afkPromptActive=false;
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('menu').classList.remove('hidden');
  document.getElementById('pause-overlay').classList.add('hidden');
  document.getElementById('dead-overlay').classList.add('hidden');
  document.getElementById('shop-overlay').classList.add('hidden');
  document.getElementById('stats-overlay').classList.add('hidden');
  const afkOv=document.getElementById('afk-overlay'); if(afkOv) afkOv.classList.add('hidden');
  const ic=document.getElementById('img-config-overlay'); if(ic)ic.classList.add('hidden');
  const pb=document.getElementById('pu-backdrop'); if(pb)pb.classList.remove('active');
  const pt=document.getElementById('pu-toast'); if(pt){pt.classList.add('hidden');pt.classList.remove('visible');}
  updateHSDisplay();
}

/* ════════════════════════════════════════
   INPUT
════════════════════════════════════════ */
function matchKey(e, setting, fallbacks){
  return e.key === settings[setting] || fallbacks.includes(e.key);
}
const PHASE_DASH_TAP_WINDOW = 320; // ms — double-tap window for phase dash
function triggerPhaseDashTap(dir){
  if(!runPowerups.phaseDash) return;
  if(gameState!=='playing' || puPaused) return;
  const now = performance.now();
  const last = lastPhaseDashTapTime[dir] || 0;
  if(now - last < PHASE_DASH_TAP_WINDOW){
    phaseDashActive = 0.35;
    player.vx = (dir==='left' ? -1 : 1) * MOVE_SPEED * 2.4;
    sfx('boost');
    spawnParticles(player.x+player.w/2, player.y+player.h/2, '#66d9ff', 10);
    lastPhaseDashTapTime[dir] = 0;
  } else {
    lastPhaseDashTapTime[dir] = now;
  }
}
window.addEventListener('keydown',e=>{
  if(e.repeat)return;
  if(_capturingEl){ return; } // key capture handles this
  // Teleport cheat: press T during gameplay
  if(e.key==='t'||e.key==='T'){
    if(cheatState.teleportCheat && (gameState==='playing'||gameState==='paused') && !puPaused){
      cameraY -= 500*40; // warp up ~500m (40px per metre)
      player.y = cameraY + canvas.height*0.42;
      score = Math.max(score, Math.floor(-cameraY/55));
      sfx('ultra');
      spawnParticles(player.x+player.w/2, player.y, '#7fd87f', 16);
    }
  }
  if(pendingPU){
    if(e.key==='y'||e.key==='Y'||e.key==='Enter'){e.preventDefault();acceptPU();return;}
    if(e.key==='n'||e.key==='N'){e.preventDefault();declinePU();return;}
    e.preventDefault(); return;
  }
  // Skins menu: press S once, works from the menu screen or mid-game
  if(e.key==='s'||e.key==='S'){
    const skinsOverlay = document.getElementById('skins-overlay');
    const skinsOpen = skinsOverlay && !skinsOverlay.classList.contains('hidden');
    if(!skinsOpen){
      const okState = gameState==='idle' || gameState==='playing' || gameState==='paused';
      const shopOpen = !document.getElementById('shop-overlay').classList.contains('hidden');
      if(okState && !shopOpen){
        if(gameState==='playing') togglePause(true);
        openSkins();
      }
    }
  }
  if(matchKey(e,'leftKey',['ArrowLeft','a','A'])){keys.left=true; lastActivityTime=performance.now(); triggerPhaseDashTap('left');}
  if(matchKey(e,'rightKey',['ArrowRight','d','D'])){keys.right=true; lastActivityTime=performance.now(); triggerPhaseDashTap('right');}
  if(matchKey(e,'jumpKey',['ArrowUp','w','W'])){e.preventDefault();keys.jump=true; lastActivityTime=performance.now();}
  if(e.key===settings.boostKey||e.key===' '){e.preventDefault();keys.boost=true; lastActivityTime=performance.now();}
  if(e.key==='Shift')keys.shift=true;
  if(e.key===settings.pauseKey||e.key==='Escape'||e.key==='p'){
    // Escape/pause key closes whichever overlay panel is currently open,
    // in priority order, before falling back to the normal pause toggle.
    const isOpen = id => { const el=document.getElementById(id); return el && !el.classList.contains('hidden'); };
    if(e.key==='Escape' && isOpen('cheat-pw-overlay')){ closeCheatPW(); return; }
    if(e.key==='Escape' && isOpen('cheat-overlay')){ closeCheatPanel(); return; }
    if(e.key==='Escape' && isOpen('shop-overlay')){ closeShop(); return; }
    if(e.key==='Escape' && isOpen('skins-overlay')){ closeSkins(); return; }
    if(e.key==='Escape' && isOpen('settings-overlay')){ closeSettings(); return; }
    if(e.key==='Escape' && isOpen('stats-overlay')){ closeStatsOverlay(); return; }
    togglePause();
  }
});
window.addEventListener('keyup',e=>{
  if(matchKey(e,'leftKey',['ArrowLeft','a','A']))keys.left=false;
  if(matchKey(e,'rightKey',['ArrowRight','d','D']))keys.right=false;
  if(matchKey(e,'jumpKey',['ArrowUp','w','W']))keys.jump=false;
  if(e.key===settings.boostKey||e.key===' ')keys.boost=false;
  if(e.key==='Shift')keys.shift=false;
});

/* ════════════════════════════════════════
   MOBILE CONTROLS
════════════════════════════════════════ */
function mobBtn(id, key){
  const el = document.getElementById(id);
  if(!el) return;
  const on  = ()=>{ keys[key]=true;  el.classList.add('pressed'); lastActivityTime=performance.now(); if(key==='left'||key==='right') triggerPhaseDashTap(key); };
  const off = ()=>{ keys[key]=false; el.classList.remove('pressed'); };
  el.addEventListener('touchstart', e=>{ e.preventDefault(); on();  }, {passive:false});
  el.addEventListener('touchend',   e=>{ e.preventDefault(); off(); }, {passive:false});
  el.addEventListener('touchcancel',e=>{ e.preventDefault(); off(); }, {passive:false});
  el.addEventListener('mousedown', on);
  el.addEventListener('mouseup',   off);
  el.addEventListener('mouseleave',off);
}

function initMobileControls(){
  mobBtn('mob-left',     'left');
  mobBtn('mob-right',    'right');
  mobBtn('mob-jump-btn', 'jump');
  mobBtn('mob-boost',    'boost');

  // ultra = boost + shift simultaneously
  const ultraEl = document.getElementById('mob-ultra');
  if(ultraEl){
    const on  = ()=>{ keys.boost=true; keys.shift=true;  ultraEl.classList.add('pressed'); };
    const off = ()=>{ keys.boost=false;keys.shift=false; ultraEl.classList.remove('pressed'); };
    ultraEl.addEventListener('touchstart', e=>{ e.preventDefault(); on();  }, {passive:false});
    ultraEl.addEventListener('touchend',   e=>{ e.preventDefault(); off(); }, {passive:false});
    ultraEl.addEventListener('touchcancel',e=>{ e.preventDefault(); off(); }, {passive:false});
    ultraEl.addEventListener('mousedown', on);
    ultraEl.addEventListener('mouseup',   off);
    ultraEl.addEventListener('mouseleave',off);
  }

  // pause button
  const pauseEl = document.getElementById('mob-pause-btn');
  if(pauseEl){
    pauseEl.addEventListener('touchstart', e=>{ e.preventDefault(); togglePause(); }, {passive:false});
    pauseEl.addEventListener('click', ()=> togglePause());
  }

  document.getElementById('mob-controls').classList.add('mob-active');
  document.body.classList.add('is-mobile-controls');
}

/* ════════════════════════════════════════
   MOBILE WARNING
════════════════════════════════════════ */
(function(){
  const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)
                   || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const WARN_KEY = 'jump_mob_accepted';
  const overlay  = document.getElementById('mobile-warn-overlay');
  const acceptBtn= document.getElementById('mob-warn-accept');

  function acceptMobile(){
    try{ localStorage.setItem(WARN_KEY,'1'); }catch(e){}
    overlay.classList.add('hidden');
    initMobileControls();
  }

  if(isMobile){
    const alreadyAccepted = (() => { try{ return localStorage.getItem(WARN_KEY)==='1'; }catch(e){ return false; } })();
    if(alreadyAccepted){
      // Already accepted before — show controls immediately, no warning
      overlay.classList.add('hidden');
      initMobileControls();
    } else {
      // Show warning
      overlay.classList.remove('hidden');
    }
  } else {
    // Desktop — hide overlay, no mobile controls
    overlay.classList.add('hidden');
  }

  acceptBtn.addEventListener('click', acceptMobile);
  acceptBtn.addEventListener('touchend', e=>{ e.preventDefault(); acceptMobile(); }, {passive:false});
})();

/* ════════════════════════════════════════
   SETTINGS UI
════════════════════════════════════════ */
let _capturingEl  = null;
let _capturingKey = null;

function openSettings(){
  // Always pull fresh values so sliders are correct whether opened
  // from the menu OR mid-game (via pause → settings).
  document.getElementById('set-sound-enabled').checked = settings.soundEnabled;
  document.getElementById('set-sfx-enabled').checked   = settings.sfxEnabled;
  document.getElementById('set-volume').value           = Math.round(settings.soundVolume * 100);
  document.getElementById('set-volume-val').textContent = Math.round(settings.soundVolume * 100) + '%';
  document.getElementById('set-low-power').checked      = settings.lowPowerMode;
  document.getElementById('set-show-ads').checked       = settings.showFloatingAds;
  document.getElementById('set-key-left').value         = settings.leftKey;
  document.getElementById('set-key-right').value        = settings.rightKey;
  document.getElementById('set-key-jump').value         = settings.jumpKey;
  document.getElementById('set-key-boost').value        = settings.boostKey === ' ' ? 'Space' : settings.boostKey;
  document.getElementById('set-key-pause').value        = settings.pauseKey;
  document.getElementById('settings-overlay').classList.remove('hidden');
}

function closeSettings(){
  cancelKeyCapture();
  document.getElementById('settings-overlay').classList.add('hidden');
}

function startKeyCapture(inputEl, settingKey){
  cancelKeyCapture();
  _capturingEl  = inputEl;
  _capturingKey = settingKey;
  inputEl.value = 'press a key...';
  inputEl.classList.add('capturing');
}

function cancelKeyCapture(){
  if(!_capturingEl) return;
  _capturingEl.classList.remove('capturing');
  _capturingEl  = null;
  _capturingKey = null;
}

// Capture phase — intercepts key before anything else when capturing
window.addEventListener('keydown', function(e){
  if(!_capturingEl) return;
  if(['Shift','Control','Alt','Meta'].includes(e.key)) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  settings[_capturingKey] = e.key;
  _capturingEl.value = e.key === ' ' ? 'Space' : e.key;
  cancelKeyCapture();
  saveSettings();
}, true);

function wireSettings(){
  document.getElementById('set-sound-enabled').addEventListener('change', function(e){
    settings.soundEnabled = e.target.checked;
    saveSettings();
  });
  document.getElementById('set-sfx-enabled').addEventListener('change', function(e){
    settings.sfxEnabled = e.target.checked;
    saveSettings();
  });
  document.getElementById('set-volume').addEventListener('input', function(e){
    settings.soundVolume = parseInt(e.target.value) / 100;
    document.getElementById('set-volume-val').textContent = e.target.value + '%';
    saveSettings();
  });
  document.getElementById('set-low-power').addEventListener('change', function(e){
    settings.lowPowerMode = e.target.checked;
    saveSettings();
  });
  document.getElementById('set-show-ads').addEventListener('change', function(e){
    settings.showFloatingAds = e.target.checked;
    if(!settings.showFloatingAds && fi) dismissFloatingImg();
    saveSettings();
  });

  var keyFields = [
    ['set-key-left',  'leftKey'],
    ['set-key-right', 'rightKey'],
    ['set-key-jump',  'jumpKey'],
    ['set-key-boost', 'boostKey'],
    ['set-key-pause', 'pauseKey'],
  ];
  keyFields.forEach(function(pair){
    var inp = document.getElementById(pair[0]);
    inp.addEventListener('click', function(){ startKeyCapture(inp, pair[1]); });
  });

  document.getElementById('set-reset-keys').addEventListener('click', function(){
    settings.leftKey  = 'ArrowLeft';
    settings.rightKey = 'ArrowRight';
    settings.jumpKey  = 'ArrowUp';
    settings.boostKey = ' ';
    settings.pauseKey = 'Escape';
    saveSettings();
    openSettings();
  });

  const resetAllBtn = document.getElementById('settings-reset-all');
  if(resetAllBtn && !resetAllBtn._wired){
    resetAllBtn._wired = true;
    resetAllBtn.addEventListener('click', resetAllData);
  }
}

function resetAllData(){
  const confirmed = window.confirm(
    'Reset ALL data?\n\nThis permanently erases your coins, owned items, skins, rebirths, mega vault progress, and all-time stats. High scores are cleared too. This cannot be undone.'
  );
  if(!confirmed) return;

  savedCoins = 0;
  owned = {};
  purchaseCounts = {};
  activeToggles = {};
  runPowerups = {};
  ownedSkins = {skin_normal:true};
  equippedSkin = 'skin_normal';
  skinsUnlocked = false;
  ownedPets = {};
  equippedPet = null;
  petsUnlocked = false;
  rebirthCount = 0;
  rebirthMult = 1;
  megaVaultUnlocked = false;
  highScores = {easy:0, normal:0, hard:0, chaos:0, moon:0};
  allTimeStats = {
    totalRuns: 0,
    totalCoins: 0,
    totalHeight: 0,
    bestScore: 0,
    bestHeight: 0,
    bestRunCoins: 0,
    bestMode: 'normal'
  };

  try{
    localStorage.removeItem('jump_hs');
    localStorage.removeItem('jump_coins');
    localStorage.removeItem('jump_owned');
    localStorage.removeItem('jump_purchases');
    localStorage.removeItem('jump_skins_owned');
    localStorage.removeItem('jump_skin_equipped');
    localStorage.removeItem('jump_skins_unlocked');
    localStorage.removeItem('jump_pets_owned');
    localStorage.removeItem('jump_pet_equipped');
    localStorage.removeItem('jump_pets_unlocked');
    localStorage.removeItem('jump_rebirth_count');
    localStorage.removeItem('jump_mega_vault_unlocked');
    localStorage.removeItem('jump_stats');
  }catch(e){}

  updateHSDisplay();
  renderShop();
  renderSkins();
  const walletEl = document.getElementById('shop-coin-count');
  if(walletEl) walletEl.textContent = savedCoins;
  window.alert('All data has been reset.');
}

/* ════════════════════════════════════════
   BUTTON WIRING
════════════════════════════════════════ */
const MENU_MODE_CLASSES = ['menu-mode-easy','menu-mode-normal','menu-mode-hard','menu-mode-chaos','menu-mode-moon'];
document.querySelectorAll('.mode-pill').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.mode-pill').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    mode=btn.dataset.mode;
    const menuEl = document.getElementById('menu');
    menuEl.classList.remove(...MENU_MODE_CLASSES);
    menuEl.classList.add('menu-mode-'+mode);
  });
});
// sync the menu tint with whichever pill starts active in the markup
const initialActivePill = document.querySelector('.mode-pill.active');
document.getElementById('menu').classList.add('menu-mode-'+(initialActivePill ? initialActivePill.dataset.mode : mode));

document.getElementById('play-btn').addEventListener('click',()=>{
  getACtx();
  const menuEl = document.getElementById('menu');
  const gameEl = document.getElementById('game-screen');
  if(menuEl.classList.contains('menu-exit')) return; // already transitioning
  menuEl.classList.add('menu-exit');
  setTimeout(()=>{
    menuEl.classList.add('hidden');
    menuEl.classList.remove('menu-exit');
    gameEl.classList.remove('hidden');
    gameEl.classList.add('game-enter');
    document.getElementById('hud-mode').textContent=mode;
    startGame();
    setTimeout(()=>gameEl.classList.remove('game-enter'), 520);
  }, 480);
});
document.getElementById('retry-btn').addEventListener('click',startGame);
document.getElementById('resume-btn').addEventListener('click',()=>togglePause(false));
document.getElementById('menu-from-pause').addEventListener('click',goMenu);
document.getElementById('menu-from-dead').addEventListener('click',goMenu);

document.getElementById('pu-accept').addEventListener('click', acceptPU);
document.getElementById('pu-decline').addEventListener('click', declinePU);

function openShop(){
  // Pick two distinct unowned items — one yellow deal (10-40%), one red deal (60-90%)
  const unowned = SHOP_ITEMS.filter(it => !owned[it.id]);
  currentShopDiscounts = [];
  if(unowned.length >= 2){
    const shuffled = unowned.slice().sort(()=>Math.random()-.5);
    const yellowPct = [10,15,20,25,30,40][Math.floor(Math.random()*6)];
    const redPct    = [60,70,75,80,90][Math.floor(Math.random()*5)];
    currentShopDiscounts = [
      {id: shuffled[0].id, pct: yellowPct, tier: 'yellow'},
      {id: shuffled[1].id, pct: redPct,    tier: 'red'},
    ];
  } else if(unowned.length === 1){
    const yellowPct = [10,15,20,25,30,40][Math.floor(Math.random()*6)];
    currentShopDiscounts = [{id: unowned[0].id, pct: yellowPct, tier: 'yellow'}];
  }
  renderShop();
  document.getElementById('shop-overlay').classList.remove('hidden');
}
function closeShop(){
  document.getElementById('shop-overlay').classList.add('hidden');
  if(gameState==='paused') togglePause(false);
}

// in-game shop button
document.getElementById('shop-btn').addEventListener('click',()=>{
  if(gameState==='playing') togglePause(true);
  openShop();
});

// mid-run boost refill button
document.getElementById('boost-refill-btn').addEventListener('click', buyBoostRefill);

// AFK "still playing?" prompt
document.getElementById('afk-yes-btn').addEventListener('click', dismissAfkPrompt);
document.getElementById('afk-menu-btn').addEventListener('click', ()=>{
  afkPromptActive=false;
  document.getElementById('afk-overlay').classList.add('hidden');
  goMenu();
});

// single close handler — works from menu AND in-game
document.getElementById('shop-close').addEventListener('click', closeShop);
document.getElementById('shop-x-close').addEventListener('click', closeShop);

// menu shop button
const _menuShopBtn = document.getElementById('menu-shop-btn');
if(_menuShopBtn) _menuShopBtn.addEventListener('click', openShop);

// skins overlay close
const _skinsCloseBtn = document.getElementById('skins-close');
if(_skinsCloseBtn) _skinsCloseBtn.addEventListener('click', closeSkins);
const _skinsXCloseBtn = document.getElementById('skins-x-close');
if(_skinsXCloseBtn) _skinsXCloseBtn.addEventListener('click', closeSkins);

// stats button
document.getElementById('stats-btn').addEventListener('click', openStatsOverlay);
document.getElementById('settings-btn').addEventListener('click', openSettings);
document.getElementById('settings-close').addEventListener('click', closeSettings);
document.getElementById('settings-x-close').addEventListener('click', closeSettings);
document.getElementById('stats-x-close').addEventListener('click', closeStatsOverlay);
document.getElementById('cheat-x-close').addEventListener('click', closeCheatPanel);
/* ════════════════════════════════════════
   ABOUT OVERLAY
════════════════════════════════════════ */
/* ════════════════════════════════════════
   CHEAT SYSTEM
════════════════════════════════════════ */
function openCheatPW(){
  const ov = document.getElementById('cheat-pw-overlay');
  const inp = document.getElementById('cheat-pw-input');
  const err = document.getElementById('cheat-pw-err');
  inp.value = '';
  err.classList.add('hidden');
  ov.classList.remove('hidden');
  setTimeout(()=>inp.focus(), 80);
}
function closeCheatPW(){
  document.getElementById('cheat-pw-overlay').classList.add('hidden');
}
function submitCheatPW(){
  const val = document.getElementById('cheat-pw-input').value.trim();
  if(val === CHEAT_PASSWORD){
    closeCheatPW();
    cheatActive = true;
    openCheatPanel();
  } else {
    const err = document.getElementById('cheat-pw-err');
    err.classList.remove('hidden');
    const inp = document.getElementById('cheat-pw-input');
    inp.value = '';
    inp.classList.add('shake');
    setTimeout(()=>inp.classList.remove('shake'), 400);
    inp.focus();
  }
}

function flashRow(el){
  el.closest && el.closest('.cheat-row') && (el.closest('.cheat-row').classList.remove('flash'),
    void el.closest('.cheat-row').offsetWidth, el.closest('.cheat-row').classList.add('flash'));
}
function applyCheat(key, value, el){
  cheatState[key] = value;
  flashRow(el);
  sfx('buy');
}

function openCheatPanel(){
  // Sync inputs to current state
  document.getElementById('ch-gap').value = cheatState.gapOverride ?? 62;
  document.getElementById('ch-plat-count').value = cheatState.platCountOverride ?? 18;
  document.getElementById('ch-plat-w').value = cheatState.platWidthMult;
  document.getElementById('ch-pu-chance').value = cheatState.puChanceOverride != null ? Math.round(cheatState.puChanceOverride*100) : 20;
  document.getElementById('ch-dissolve').value = cheatState.dissolveOverride != null ? Math.round(cheatState.dissolveOverride*100) : 18;
  document.getElementById('ch-moving').value = cheatState.movingOverride != null ? Math.round(cheatState.movingOverride*100) : 25;
  document.getElementById('ch-gravity').value = cheatState.gravityOverride ?? 0.42;
  document.getElementById('ch-jump').value = cheatState.jumpOverride ?? 12.2;
  document.getElementById('ch-speed').value = cheatState.speedOverride ?? 5.2;
  document.getElementById('ch-boost-f').value = cheatState.boostForceOverride ?? 5.5;
  document.getElementById('ch-boosts').value = cheatState.maxBoostsOverride ?? 10;
  document.getElementById('ch-jumps').value = cheatState.maxJumpsOverride ?? 2;
  document.getElementById('ch-score-mult').value = cheatState.scoreMultiplier;
  document.getElementById('ch-score-div').value = cheatState.scoreDivisor;
  document.getElementById('ch-diff').value = cheatState.diffMult;
  document.getElementById('ch-freeze-diff').checked = cheatState.freezeDiff;
  document.getElementById('ch-inf-lives').checked = cheatState.infLives;
  document.getElementById('ch-inf-boosts').checked = cheatState.infBoosts;
  document.getElementById('ch-coin-shower').checked = cheatState.coinShower;
  // new cheats
  const chNew = {
    'ch-all-seasonal': 'allSeasonalUnlocked',
    'ch-zero-gravity': 'zeroGravity',
    'ch-speedrun': 'speedrunMode',
    'ch-mirror-world': 'mirrorWorld',
    'ch-platinum-run': 'platinumRun',
    'ch-ultra-mega': 'ultraMegaBoost',
    'ch-coin-x10': 'coinMultiplierX10',
    'ch-all-shields': 'allShieldsActive',
    'ch-teleport': 'teleportCheat',
    'ch-rainbow-all': 'rainbowEverything',
  };
  Object.entries(chNew).forEach(([elId, key]) => {
    const el = document.getElementById(elId);
    if(el) el.checked = cheatState[key];
  });
  document.getElementById('cheat-overlay').classList.remove('hidden');
}

// ── wire cheat panel buttons ──
document.getElementById('cheat-btn').addEventListener('click',()=>{
  if(cheatActive) openCheatPanel();
  else openCheatPW();
});
document.getElementById('cheat-pw-cancel').addEventListener('click', closeCheatPW);
document.getElementById('cheat-pw-submit').addEventListener('click', submitCheatPW);
document.getElementById('cheat-pw-input').addEventListener('keydown',e=>{ if(e.key==='Enter') submitCheatPW(); if(e.key==='Escape') closeCheatPW(); });

function closeCheatPanel(){
  document.getElementById('cheat-overlay').classList.add('hidden');
}
document.getElementById('cheat-close').addEventListener('click', closeCheatPanel);

// coins
document.getElementById('ch-coins-btn').addEventListener('click', e=>{
  const v = parseInt(document.getElementById('ch-coins').value)||0;
  savedCoins += v; animateCoinHUD();
  try{ localStorage.setItem('jump_coins', savedCoins); }catch(ex){}
  flashRow(e.target); sfx('coin');
});
document.getElementById('ch-set-coins-btn').addEventListener('click', e=>{
  const v = parseInt(document.getElementById('ch-set-coins').value)||0;
  savedCoins = v; animateCoinHUD();
  try{ localStorage.setItem('jump_coins', savedCoins); }catch(ex){}
  flashRow(e.target); sfx('coin');
});

// score
document.getElementById('ch-score-mult-btn').addEventListener('click', e=>{
  applyCheat('scoreMultiplier', Math.max(0.01, parseFloat(document.getElementById('ch-score-mult').value)||1), e.target);
});
document.getElementById('ch-score-div-btn').addEventListener('click', e=>{
  applyCheat('scoreDivisor', Math.max(1, parseInt(document.getElementById('ch-score-div').value)||55), e.target);
});

// platforms
document.getElementById('ch-gap-btn').addEventListener('click', e=>{
  applyCheat('gapOverride', Math.max(10, parseInt(document.getElementById('ch-gap').value)||62), e.target);
});
document.getElementById('ch-plat-count-btn').addEventListener('click', e=>{
  applyCheat('platCountOverride', Math.max(4, parseInt(document.getElementById('ch-plat-count').value)||18), e.target);
});
document.getElementById('ch-plat-w-btn').addEventListener('click', e=>{
  applyCheat('platWidthMult', Math.max(0.1, parseFloat(document.getElementById('ch-plat-w').value)||1), e.target);
});
document.getElementById('ch-pu-chance-btn').addEventListener('click', e=>{
  applyCheat('puChanceOverride', Math.min(1, Math.max(0, (parseInt(document.getElementById('ch-pu-chance').value)||20)/100)), e.target);
});
document.getElementById('ch-dissolve-btn').addEventListener('click', e=>{
  applyCheat('dissolveOverride', Math.min(1, Math.max(0, (parseInt(document.getElementById('ch-dissolve').value)||18)/100)), e.target);
});
document.getElementById('ch-moving-btn').addEventListener('click', e=>{
  applyCheat('movingOverride', Math.min(1, Math.max(0, (parseInt(document.getElementById('ch-moving').value)||25)/100)), e.target);
});

// physics
document.getElementById('ch-gravity-btn').addEventListener('click', e=>{
  applyCheat('gravityOverride', Math.max(0, parseFloat(document.getElementById('ch-gravity').value)||0.42), e.target);
});
document.getElementById('ch-jump-btn').addEventListener('click', e=>{
  applyCheat('jumpOverride', Math.max(1, parseFloat(document.getElementById('ch-jump').value)||12.2), e.target);
});
document.getElementById('ch-speed-btn').addEventListener('click', e=>{
  applyCheat('speedOverride', Math.max(0.5, parseFloat(document.getElementById('ch-speed').value)||5.2), e.target);
});
document.getElementById('ch-boost-f-btn').addEventListener('click', e=>{
  applyCheat('boostForceOverride', Math.max(0.5, parseFloat(document.getElementById('ch-boost-f').value)||5.5), e.target);
});
document.getElementById('ch-boosts-btn').addEventListener('click', e=>{
  const v = Math.max(0, parseInt(document.getElementById('ch-boosts').value)||10);
  applyCheat('maxBoostsOverride', v, e.target);
  if(gameState==='playing'||gameState==='paused'){ boosts=Math.max(boosts,v); updateBoostPips(); }
});
document.getElementById('ch-jumps-btn').addEventListener('click', e=>{
  const v = Math.max(1, parseInt(document.getElementById('ch-jumps').value)||2);
  applyCheat('maxJumpsOverride', v, e.target);
  if(gameState==='playing'||gameState==='paused'){ maxJumps=v; updateJumpPips(); }
});

// difficulty
document.getElementById('ch-diff-btn').addEventListener('click', e=>{
  applyCheat('diffMult', Math.max(0, parseFloat(document.getElementById('ch-diff').value)||1), e.target);
});
document.getElementById('ch-freeze-diff-btn').addEventListener('click', e=>{
  applyCheat('freezeDiff', document.getElementById('ch-freeze-diff').checked, e.target);
});

// god mode
document.getElementById('ch-inf-lives-btn').addEventListener('click', e=>{
  applyCheat('infLives', document.getElementById('ch-inf-lives').checked, e.target);
});
document.getElementById('ch-inf-boosts-btn').addEventListener('click', e=>{
  applyCheat('infBoosts', document.getElementById('ch-inf-boosts').checked, e.target);
});
document.getElementById('ch-coin-shower-btn').addEventListener('click', e=>{
  applyCheat('coinShower', document.getElementById('ch-coin-shower').checked, e.target);
});

// tools
document.getElementById('ch-unlock-all').addEventListener('click', e=>{
  SHOP_ITEMS.forEach(item=>{ owned[item.id]=true; });
  try{ localStorage.setItem('jump_owned', JSON.stringify(owned)); }catch(ex){}
  flashRow(e.target); sfx('buy');
});
document.getElementById('ch-clear-all').addEventListener('click', e=>{
  owned = {};
  try{ localStorage.setItem('jump_owned', JSON.stringify(owned)); }catch(ex){}
  flashRow(e.target); sfx('buy');
});
document.getElementById('ch-reset-hs').addEventListener('click', e=>{
  highScores = {easy:0, normal:0, hard:0, chaos:0, moon:0};
  try{ localStorage.setItem('jump_hs', JSON.stringify(highScores)); }catch(ex){}
  updateHSDisplay();
  flashRow(e.target); sfx('die');
});

document.getElementById('ch-night-force-btn').addEventListener('click', e=>{
  applyCheat('forceNight', document.getElementById('ch-night-force').checked, e.target);
  if(cheatState.forceNight) cheatState.forceDay=false;
});
document.getElementById('ch-day-force-btn').addEventListener('click', e=>{
  applyCheat('forceDay', document.getElementById('ch-day-force').checked, e.target);
  if(cheatState.forceDay) cheatState.forceNight=false;
});
document.getElementById('ch-turbo-mode-btn').addEventListener('click', e=>{
  const on = document.getElementById('ch-turbo-mode').checked;
  cheatState.speedOverride = on ? MOVE_SPEED*2.5 : null;
  flashRow(e.target); sfx('buy');
});
document.getElementById('ch-ghost-mode-btn').addEventListener('click', e=>{
  const on = document.getElementById('ch-ghost-mode').checked;
  if(on) runPowerups.ghost=true; else { runPowerups.ghost=false; activeToggles.ghost=false; }
  flashRow(e.target); sfx('buy');
});
document.getElementById('ch-magnet-mode-btn').addEventListener('click', e=>{
  const on = document.getElementById('ch-magnet-mode').checked;
  if(on) runPowerups.magnetPlus=true; else { runPowerups.magnetPlus=false; runPowerups.magnet=false; }
  flashRow(e.target); sfx('buy');
});
document.getElementById('ch-plat-glow-btn').addEventListener('click', e=>{
  applyCheat('platGlow', document.getElementById('ch-plat-glow').checked, e.target);
});
document.getElementById('ch-super-bounce-btn').addEventListener('click', e=>{
  const on = document.getElementById('ch-super-bounce').checked;
  cheatState.jumpOverride = on ? JUMP1*2 : null;
  flashRow(e.target); sfx('buy');
});
document.getElementById('ch-slow-time-btn').addEventListener('click', e=>{
  const on = document.getElementById('ch-slow-time').checked;
  cheatState.timeScaleOverride = on ? 0.5 : null;
  flashRow(e.target); sfx('buy');
});
document.getElementById('ch-mega-score-btn').addEventListener('click', e=>{
  const on = document.getElementById('ch-mega-score').checked;
  cheatState.scoreDivisor = on ? 11 : 55;
  flashRow(e.target); sfx('buy');
});

function closeStatsOverlay(){
  document.getElementById('stats-overlay').classList.add('hidden');
}
document.getElementById('stats-close').addEventListener('click', closeStatsOverlay);

// ── 10 new cheat wiring ──
[
  ['ch-all-seasonal-btn', 'ch-all-seasonal', 'allSeasonalUnlocked', (on)=>{
    if(on){ ALL_SEASONAL_ITEMS.forEach(it=>{ owned[it.id]=true; }); }
    else  { ALL_SEASONAL_ITEMS.forEach(it=>{ delete owned[it.id]; }); }
    try{ localStorage.setItem('jump_owned', JSON.stringify(owned)); }catch(ex){}
  }],
  ['ch-zero-gravity-btn', 'ch-zero-gravity', 'zeroGravity', null],
  ['ch-speedrun-btn', 'ch-speedrun', 'speedrunMode', (on)=>{
    cheatState.scoreMultiplier = on ? 10 : 1;
  }],
  ['ch-mirror-world-btn', 'ch-mirror-world', 'mirrorWorld', null],
  ['ch-platinum-run-btn', 'ch-platinum-run', 'platinumRun', null],
  ['ch-ultra-mega-btn', 'ch-ultra-mega', 'ultraMegaBoost', (on)=>{
    cheatState.boostForceOverride = on ? 5.5*3 : null;
  }],
  ['ch-coin-x10-btn', 'ch-coin-x10', 'coinMultiplierX10', null],
  ['ch-all-shields-btn', 'ch-all-shields', 'allShieldsActive', null],
  ['ch-teleport-btn', 'ch-teleport', 'teleportCheat', null],
  ['ch-rainbow-all-btn', 'ch-rainbow-all', 'rainbowEverything', (on)=>{
    if(on && (gameState==='playing'||gameState==='paused')){
      runPowerups.coinTrail=true; runPowerups.platRadar=true; runPowerups.rainbowTrail=true;
    }
  }],
].forEach(([btnId, cbId, key, extra])=>{
  const btn = document.getElementById(btnId);
  if(!btn) return;
  btn.addEventListener('click', e=>{
    const on = document.getElementById(cbId).checked;
    cheatState[key] = on;
    if(extra) extra(on);
    flashRow(e.target); sfx('buy');
  });
});

// image config (owner-only — button removed from player-facing UI)
const imgCfgBtn = document.getElementById('img-config-btn');
if(imgCfgBtn) imgCfgBtn.addEventListener('click', openImgConfig);
const imgCfgAdd = document.getElementById('img-config-add');
if(imgCfgAdd) imgCfgAdd.addEventListener('click',()=>{ floatingImgConfig.urls.push(''); renderImgConfigList(); });
const imgCfgSave = document.getElementById('img-config-save');
if(imgCfgSave) imgCfgSave.addEventListener('click',()=>{ saveImgConfig(); closeImgConfig(); });
const imgCfgCancel = document.getElementById('img-config-cancel');
if(imgCfgCancel) imgCfgCancel.addEventListener('click', closeImgConfig);

/* ════════════════════════════════════════
   PERSIST
════════════════════════════════════════ */
try{
  const hs=JSON.parse(localStorage.getItem('jump_hs'));if(hs)highScores={...highScores,...hs};
  const sc=parseInt(localStorage.getItem('jump_coins'));if(!isNaN(sc))savedCoins=sc;
  const ow=JSON.parse(localStorage.getItem('jump_owned'));if(ow)owned={...ow};
  const pc=JSON.parse(localStorage.getItem('jump_purchases'));if(pc)purchaseCounts={...pc};
  const sk=JSON.parse(localStorage.getItem('jump_skins_owned'));if(sk)ownedSkins={skin_normal:true, ...sk};
  const eq=localStorage.getItem('jump_skin_equipped');if(eq && SKINS.some(s=>s.id===eq))equippedSkin=eq;
  const su=localStorage.getItem('jump_skins_unlocked');if(su==='1') skinsUnlocked=true;
  const rb=parseInt(localStorage.getItem('jump_rebirth_count'));if(!isNaN(rb)&&rb>0){ rebirthCount=rb; rebirthMult=Math.pow(2,rb); }
  const mvu=localStorage.getItem('jump_mega_vault_unlocked');if(mvu==='1') megaVaultUnlocked=true;
  const pw=JSON.parse(localStorage.getItem('jump_pets_owned'));if(pw)ownedPets={...pw};
  const peq=localStorage.getItem('jump_pet_equipped');if(peq && PETS.some(p=>p.id===peq))equippedPet=peq;
  const pu=localStorage.getItem('jump_pets_unlocked');if(pu==='1') petsUnlocked=true;
}catch(e){}
loadStats();
loadImgConfig();
loadSettings();
wireSettings();
updateHSDisplay();
