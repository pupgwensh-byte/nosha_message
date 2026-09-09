const gate = document.getElementById('gate');
const form = document.getElementById('passwordForm');
const input = document.getElementById('passwordInput');
const error = document.getElementById('passwordError');
const togglePassword = document.getElementById('togglePassword');
const song = document.getElementById('song');
const musicToggle = document.getElementById('musicToggle');
const playBig = document.getElementById('playBig');
const progressTrack = document.getElementById('progressTrack');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const typedLetter = document.getElementById('typedLetter');
const caret = document.getElementById('caret');
const restartTyping = document.getElementById('restartTyping');
const toast = document.getElementById('toast');

const PASSWORD = 'NOSHA';
const secretMessage = 'بصي يا نوشا انا عارف اننا عرفنا بعض من وقت قليل ولسه متكلمناش كتير ولسه مفهمناش بعض زي ما نفسي بس من اول ما عرفتك وانتي بقيتي حاجه حلوه ف يومي وانا مش جاي استعجلك ولا اضغط عليكي ف حاجه كل اللي نفسي فيه انك تديني فرصه نتكلم اكتر وتفهميني وافهمك ونعرف بعض بجد ويمكن مع الوقت تعرفي انا شايفك ازاي وقد اي وجودك فرق معايا انا عارف ان الكلام ده يمكن بدري بس انا حبيت وجودك وحبيت طريقتك وحسيت اني عايز اقرب منك اكتر بس بالطريقه اللي تريحك انتي واتمني لو في يوم حسيتي بيا تقوليلي من غير خوف ولا قلق وانا اوعدك اني هفضل صريح معاكي وهسيب الايام تثبتلك كلامي';
let typingTimer = null;
let isTyping = false;

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(()=>toast.classList.remove('show'), 2600);
}

function unlock(){
  document.body.classList.remove('locked');
  document.body.classList.add('unlocked');
  gate.classList.add('hide');
  document.getElementById('site').setAttribute('aria-hidden','false');
  setTimeout(()=> gate.style.display='none', 750);
  startTyping();
  createHearts();
  song.volume = 0.72;
  try { song.load(); } catch(e) {}
  const playPromise = song.play();
  if (playPromise && typeof playPromise.then === 'function') {
    playPromise.then(updatePlayerState).catch(()=>{
      showToast('دوسي على علامة الموسيقى فوق عشان الأغنية تبدأ ♥');
      updatePlayerState();
    });
  } else {
    updatePlayerState();
  }
}

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const value = input.value.trim().toUpperCase();
  if(!value){ error.textContent='اكتبي الباسورد الأول يا نوشا'; return; }
  if(value === PASSWORD){
    error.textContent='';
    unlock();
  } else {
    error.textContent='الباسورد مش ده يا نوشا جربي اسم الدلع ♥';
    document.querySelector('.gate-card').classList.remove('shake');
    void document.querySelector('.gate-card').offsetWidth;
    document.querySelector('.gate-card').classList.add('shake');
  }
});

togglePassword.addEventListener('click',()=>{
  input.type = input.type === 'password' ? 'text' : 'password';
});

function startTyping(){
  clearInterval(typingTimer);
  typedLetter.textContent='';
  let i=0;
  isTyping=true;
  typingTimer=setInterval(()=>{
    typedLetter.textContent += secretMessage[i] || '';
    i++;
    if(i>=secretMessage.length){clearInterval(typingTimer);isTyping=false;caret.style.opacity='1';}
  }, 34);
}
restartTyping.addEventListener('click',()=>{startTyping(); document.getElementById('letter').scrollIntoView({behavior:'smooth'});});

function fmt(sec){
  if(!Number.isFinite(sec)) return '0:00';
  const m=Math.floor(sec/60); const s=Math.floor(sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}
function updatePlayerState(){
  const playing=!song.paused;
  musicToggle.textContent=playing?'❚❚':'♫';
  playBig.textContent=playing?'❚❚':'▶';
}
function toggleMusic(){
  if(song.paused){song.play().catch(()=>showToast('دوسي مرة تانية لتشغيل الأغنية'));}
  else song.pause();
  setTimeout(updatePlayerState,50);
}
musicToggle.addEventListener('click',toggleMusic);
playBig.addEventListener('click',toggleMusic);
song.addEventListener('play',updatePlayerState);
song.addEventListener('pause',updatePlayerState);
song.addEventListener('loadedmetadata',()=>durationEl.textContent=fmt(song.duration));
song.addEventListener('timeupdate',()=>{
  currentTimeEl.textContent=fmt(song.currentTime);
  const p=song.duration ? (song.currentTime/song.duration)*100 : 0;
  progressFill.style.width=`${p}%`;
  progressTrack.setAttribute('aria-valuenow',Math.round(p));
});
progressTrack.addEventListener('click',(e)=>{
  if(!song.duration) return;
  const r=progressTrack.getBoundingClientRect();
  const pct=(e.clientX-r.left)/r.width;
  song.currentTime=Math.max(0,Math.min(song.duration,pct*song.duration));
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

function createHearts(){
  const box=document.getElementById('floatingHearts');
  if(box.dataset.started) return;
  box.dataset.started='1';
  setInterval(()=>{
    const h=document.createElement('span');
    h.className='heart-particle';
    h.textContent=Math.random()>.5?'♡':'♥';
    h.style.left=`${Math.random()*100}%`;
    h.style.animationDuration=`${8+Math.random()*7}s`;
    h.style.fontSize=`${12+Math.random()*14}px`;
    box.appendChild(h);
    setTimeout(()=>h.remove(),16000);
  },1100);
}

function openWhatsApp(answer){
  const number='201282266003';
  const text = answer === 'yes'
    ? 'أنا نوشا وإجابتي هي أيوه بحبك ❤️ وعايزة ندّي لبعض فرصة ونتكلم أكتر'
    : 'أنا نوشا وإجابتي لسه لا وعايزة ناخد وقتنا ونتعرف على بعض أكتر براحة';
  const url=`https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  window.open(url,'_blank','noopener,noreferrer');
}
document.getElementById('yesBtn').addEventListener('click',()=>openWhatsApp('yes'));
document.getElementById('noBtn').addEventListener('click',()=>openWhatsApp('no'));

