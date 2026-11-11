
// ===============================================
// ХИМИЯ — 4.3–4.4
// 2 (IIA) ТОП ЭЛЕМЕНТТЕРІ
// 80 МИНУТ • BY DARKHAN
// ===============================================

const $=id=>document.getElementById(id);

function esc(value){
  return String(value).replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",
    '"':"&quot;","'":"&#39;"
  }[c]));
}

function rnd(n){return Math.floor(Math.random()*n)}

function shuffle(items){
  const a=[...items];
  for(let i=a.length-1;i>0;i--){
    const j=rnd(i+1);
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

// ===============================================
// ФОТОЛАР
// ===============================================

const photos={
  magnesium:{
    filename:"Magnesium sample.jpg",
    caption:"Магний металының үлгісі"
  },
  calcium:{
    filename:"Calcium sample.jpg",
    caption:"Кальций металының қорғалған ортадағы үлгісі"
  },
  magnesiumOxide:{
    filename:"Magnesium oxide sample.jpg",
    caption:"Магний оксидінің үлгісі"
  },
  calcite:{
    filename:"Calcite NHMLA.png",
    caption:"Кальцит минералы — кальций карбонаты"
  }
};

function photo(key){
  const f=photos[key];
  if(!f)return "";

  const file=encodeURIComponent(f.filename);
  const url=
    "https://commons.wikimedia.org/wiki/Special:FilePath/"+
    file+"?width=900";

  const source=
    "https://commons.wikimedia.org/wiki/File:"+
    file;

  return `
    <figure class="photo-card">
      <img src="${url}"
           alt="${esc(f.caption)}"
           loading="lazy">
      <figcaption>
        ${esc(f.caption)}
        <div>
          <a href="${source}" target="_blank"
             rel="noopener noreferrer">
             Фото дереккөзі: Wikimedia Commons
          </a>
        </div>
      </figcaption>
    </figure>
  `;
}

// ===============================================
// 24 ОҚУШЫ
// ===============================================

const names=[
  "Рамазан","Тұрғанжан","Нұрай","Әлқуат",
  "Шырай","Гүлсезім","Маржан","Мариям",
  "Жансая","Азиза","Ақсезім","Нұрболсын",
  "Ақнұр","Іңкәр","Асхат","Аяжан",
  "Мирас","Санжар","Ерасыл","Нұрасыл",
  "Расул","Айнұр","Дархан","Айкерім"
];

const STORAGE="darkhan_chem_4344_photo_v1";
const TIME_KEY=STORAGE+"_timer";

function initialState(){
  return {
    students:names.map((name,i)=>({
      id:i+1,name,present:true
    })),
    teams:[[],[],[]],
    scores:[0,0,0],
    gameIndex:0,
    gameOpen:false,
    notebookOpen:{},
    homeworkOpen:false,
    selected:null,
    taskIndex:null,
    answerOpen:false,
    usedTasks:[],
    marks:[]
  };
}

let state=initialState();

try{
  const old=JSON.parse(localStorage.getItem(STORAGE));
  if(
    old &&
    Array.isArray(old.students) &&
    Array.isArray(old.teams) &&
    Array.isArray(old.marks)
  ){
    state={...initialState(),...old};
  }
}catch(e){console.warn(e)}

function save(){
  try{
    localStorage.setItem(STORAGE,JSON.stringify(state));
  }catch(e){console.warn(e)}
}

const present=()=>state.students.filter(s=>s.present);
const student=id=>state.students.find(s=>s.id===id);

// ===============================================
// ТАЙМЕР ЖӘНЕ АЛМАТЫ САҒАТЫ
// ===============================================

const DURATION=80*60*1000;
let deadline=null;

try{
  const saved=Number(localStorage.getItem(TIME_KEY));
  if(saved>0)deadline=saved;
}catch(e){console.warn(e)}

function timeLeft(){
  return deadline===null
    ?4800
    :Math.max(0,Math.ceil((deadline-Date.now())/1000));
}

function updateTime(){
  const t=timeLeft();

  $("lessonTimer").textContent=
    String(Math.floor(t/60)).padStart(2,"0")+
    ":"+String(t%60).padStart(2,"0");

  $("lessonTimer").style.color=
    t===0?"#ffa4aa":"";

  $("realClock").textContent=
    new Intl.DateTimeFormat("en-GB",{
      timeZone:"Asia/Almaty",
      hour:"2-digit",
      minute:"2-digit",
      second:"2-digit",
      hourCycle:"h23"
    }).format(new Date());
}

function startTimer(){
  if(deadline!==null && timeLeft()>0)return;
  deadline=Date.now()+DURATION;
  localStorage.setItem(TIME_KEY,String(deadline));
  updateTime();show();
}

function resetTimer(){
  if(!confirm("80 минуттық таймерді жаңарту керек пе?"))return;
  deadline=null;
  localStorage.removeItem(TIME_KEY);
  updateTime();show();
}

setInterval(updateTime,1000);

// ===============================================
// СЛАЙД БАСҚАРУ
// ===============================================

const slides=[];
let page=0;

function add(title,section,html){
  slides.push({title,section,html});
}

function dynamic(title,section,render){
  slides.push({title,section,render});
}

function show(){
  const s=slides[page];
  if(!s)return;

  $("slide").innerHTML=s.render?s.render():s.html;
  $("sectionName").textContent=s.section;
  $("slideTitle").textContent=s.title;
  $("pageCount").textContent=(page+1)+" / "+slides.length;

  $("prevBtn").disabled=page===0;
  $("nextBtn").disabled=page===slides.length-1;
  $("main").scrollTop=0;

  // Фото қолжетімсіз болса мәтін қалады.
  $("slide").querySelectorAll(".photo-card img")
    .forEach(img=>{
      img.onerror=()=>{
        const box=document.createElement("div");
        box.className="photo-fallback";
        box.textContent=img.alt+
          " — фото интернет арқылы жүктелмеді.";
        img.replaceWith(box);
      };
    });
}

function goTo(title){
  const i=slides.findIndex(s=>s.title===title);
  if(i>=0){page=i;show()}
}

$("prevBtn").onclick=()=>{
  if(page>0){page--;show()}
};

$("nextBtn").onclick=()=>{
  if(page<slides.length-1){page++;show()}
};

// ===============================================
// КІРІСПЕ
// ===============================================

dynamic("Кіріспе","Кіріспе · 5 минут",()=>`
  <div class="hero">
    <div>
      <div class="subtitle">
        ХИМИЯ · 4.3–4.4 · 1-КУРС
      </div>
      <h1>
        2 (IIA) топ
        <span class="blue">элементтері</span>
      </h1>

      <h2 class="green-text">
        Құрылысы, қасиеттері және қосылыстары
      </h2>

      <p>
        Бериллий, магний, кальций, стронций,
        барий және радийдің қасиеттерін
        түсініп, химиялық есептер шығарамыз.
      </p>

      <button class="btn success" onclick="startTimer()">
        ▶ 80 минутты бастау
      </button>
      <button class="btn" onclick="resetTimer()">
        ↺ Таймерді жаңарту
      </button>
    </div>

    ${photo("magnesium")}
  </div>
`);

add("Сабақтың мақсаты","Кіріспе",`
  <h2>Сабақтың мақсаты</h2>
  <div class="grid2">
    <div class="card">
      <h3>Түсіндіру</h3>
      <ul>
        <li>2-топ элементтерінің құрылысын анықтау.</li>
        <li>Металдық белсенділік заңдылығын түсіну.</li>
        <li>Оксид, гидроксид және тұздарды салыстыру.</li>
      </ul>
    </div>
    <div class="card green-card">
      <h3>Есеп шығару</h3>
      <ul>
        <li>Молярлық масса есептеу.</li>
        <li>Масса мен зат мөлшерін анықтау.</li>
        <li>Реакция теңдеулерін теңестіру.</li>
        <li>Топтық ойын және жеке жұмыс орындау.</li>
      </ul>
    </div>
  </div>
  <div class="note">
    Есепте қолданылатын жуық атомдық массалар:
    H=1, C=12, O=16, Mg=24, S=32, Ca=40,
    Cl=35,5, Sr=88, Ba=137.
  </div>
`);

// ===============================================
// 16 ТҮСІНДІРМЕ БЕТІ
// ===============================================

const theory=[
  {
    title:"2-топ элементтері дегеніміз не?",
    a:"Периодтық жүйенің 2-тобында бериллий, магний, кальций, стронций, барий және радий орналасады. Бұлардың барлығы металдар. Сыртқы электрондық қабатында екі электрон болғандықтан, химиялық қасиеттерінде ортақ заңдылықтар байқалады.",
    b:"Көптеген қосылыстарында +2 тотығу дәрежесін көрсетеді. Бериллий мен магний кейбір қасиеттері бойынша басқа топ мүшелерінен ерекшеленеді. Сілтілік-жер металдары атауы көбіне кальций, стронций, барий және радийге қатысты қолданылады.",
    note:"2-топта 6 элемент бар. Сыртқы қабатта 2 электрон."
  },
  {
    title:"Периодтық жүйедегі орналасуы",
    a:"Бериллий екінші, магний үшінші, кальций төртінші, стронций бесінші, барий алтыншы, радий жетінші периодта орналасқан. Бұл элементтер s-блокқа жатады.",
    b:"Жоғарыдан төмен қарай электрондық қабат саны артады, соған байланысты атом радиусы жалпы ұлғаяды. Период нөмірі мен атомдағы электрон қабаттарының саны өзара байланысты.",
    note:"Be → Mg → Ca → Sr → Ba → Ra."
  },
  {
    title:"Валенттік электрондар",
    a:"2-топ элементтерінің сыртқы электрондық конфигурациясы ns² түрінде болады. Бұл сыртқы s-деңгейшеде екі электрон орналасқанын білдіреді. Осы электрондар химиялық байланысқа қатысады.",
    b:"Металл атомы екі электронын бергенде +2 зарядты катион түзе алады. Мысалы: Mg → Mg²⁺ + 2e⁻. Оң зарядтың шамасы жоғалтылған электрон санына сәйкес келеді.",
    note:"ns² → екі валенттік электрон.",
    diagram:"shell"
  },
  {
    title:"Магнийдің электрондық құрылысы",
    a:"Магнийдің реттік нөмірі 12. Бейтарап атомында 12 протон және 12 электрон бар. Электрондары қабаттарға 2,8,2 болып таралады. Ол үшінші периодтың 2-тобында орналасқан.",
    b:"Магний екі электрон бергенде Mg²⁺ ионы түзіледі. Бұл ионда 12 протон және 10 электрон бар. Магний ионының заряды +2 болады.",
    note:"Mg: 2,8,2; Mg²⁺: 10 электрон.",
    image:"magnesium"
  },
  {
    title:"Кальцийдің атомдық құрылысы",
    a:"Кальцийдің реттік нөмірі 20. Электрондары қабаттарға 2,8,8,2 болып таралады. Сыртқы қабатындағы екі электрон оның 2-топта орналасуын түсіндіреді.",
    b:"Кальций екі электрон жоғалтқанда Ca²⁺ ионы түзіледі. Катионда 20 протон мен 18 электрон сақталады. Кальций металын оның тұздарынан химиялық қасиеті бойынша ажырату керек.",
    note:"Ca: 2,8,8,2; Ca²⁺: 18 электрон.",
    image:"calcium"
  },
  {
    title:"Бериллийдің ерекшелігі",
    a:"Бериллийдің реттік нөмірі 4, электрондық қабаттар бойынша құрылысы 2,2. Ол 2-топқа жатса да, атомының шағын өлшеміне байланысты өзіндік ерекшеліктері бар.",
    b:"BeO және Be(OH)₂ қосылыстары амфотерлік қасиет көрсетеді. Бұл барлық 2-топ металдарының оксидтері мен гидроксидтерін бірдей сипаттауға болмайтынын дәлелдейді.",
    note:"BeO — амфотерлі оксид."
  },
  {
    title:"Металдық белсенділіктің өзгеруі",
    a:"Топ бойынша төмен қарай атом радиусы жалпы өседі. Сыртқы электрондарды атомнан бөлу жеңілдей түседі. Сондықтан металдық белсенділік магнийден барийге қарай жалпы артады.",
    b:"Реакцияға түсу қабілеті металдың атом құрылысына ғана емес, оның бетіндегі қорғаныш қабаттарына және реакция жағдайына да тәуелді. Сол себепті салыстырғанда жалпы заңдылықты және ерекшелікті ажыратамыз.",
    note:"Mg → Ca → Sr → Ba: белсенділік жалпы артады.",
    diagram:"trend"
  },
  {
    title:"Оттекпен әрекеттесуі",
    a:"2-топ металдары оттекпен әрекеттесіп оксидтер түзе алады. Мысалы, магний оксиді MgO, кальций оксиді CaO деп жазылады. Олардың құрамындағы металл мен оттектің зарядтары +2 және −2 болады.",
    b:"Реакция теңдеулері: 2Mg + O₂ → 2MgO және 2Ca + O₂ → 2CaO. Теңдеудің екі жағында барлық элемент атомдарының саны бірдей болуы керек.",
    note:"2Mg + O₂ → 2MgO.",
    diagram:"oxygen"
  },
  {
    title:"Сумен әрекеттесуі",
    a:"Кальций мен судың реакциясын Ca + 2H₂O → Ca(OH)₂ + H₂ теңдеуі арқылы сипаттаймыз. Кальций гидроксиді мен сутек түзіледі.",
    b:"Магний суға қатысты кальцийден баяуырақ әрекеттеседі. Реакция жылдамдығы жағдайға байланысты өзгереді. Сабақта бұл реакцияларды тәжірибе жасамай, тек теңдеу арқылы талдаймыз.",
    note:"Ca + 2H₂O → Ca(OH)₂ + H₂."
  },
  {
    title:"Магний оксиді — MgO",
    a:"MgO — магний мен оттектен тұратын оксид. Магний ионы Mg²⁺, оксид ионы O²⁻ болғандықтан олардың қатынасы 1:1 болады. Бұл қосылыс негіздік қасиеттер көрсетеді.",
    b:"Жуық молярлық массасы M(MgO)=24+16=40 г/моль. Осы мән бойынша 80 грамм MgO зат мөлшері 80/40=2 моль болады.",
    note:"M(MgO)=40 г/моль.",
    image:"magnesiumOxide"
  },
  {
    title:"Кальций оксиді — CaO",
    a:"CaO — кальций оксиді. Ол сөндірілмеген әк деп те аталады. Кальцийдің салыстырмалы атомдық массасы шамамен 40, оттектікі 16 деп алынса, молярлық масса 56 г/моль шығады.",
    b:"CaO мен су реакциясының өнімін Ca(OH)₂ формуласымен жазамыз. Реакция теңдеуі: CaO + H₂O → Ca(OH)₂. Қосылыстар арасында құрамдық және химиялық байланыс бар.",
    note:"CaO — оксид; Ca(OH)₂ — негіз."
  },
  {
    title:"Кальций гидроксиді — Ca(OH)₂",
    a:"Ca(OH)₂ формуласында бір кальций, екі оттек және екі сутек атомы бар. Екі OH⁻ тобы Ca²⁺ ионының зарядын теңгереді. Кальций гидроксиді негіздерге жатады.",
    b:"Молярлық масса есептеу: M=40+2×(16+1)=74 г/моль. Жақша сыртындағы индекс оттекке де, сутекке де қолданылады.",
    note:"M(Ca(OH)₂)=74 г/моль."
  },
  {
    title:"Кальций карбонаты — CaCO₃",
    a:"CaCO₃ — кальций карбонаты. Әктас, бор және мәрмәрдің құрамында кездеседі. Бұл қосылыс тұздарға жатады және құрамында CO₃²⁻ карбонат ионы бар.",
    b:"Молярлық масса M(CaCO₃)=40+12+3×16=100 г/моль. Мысалы, 250 грамм кальций карбонатының зат мөлшері 250/100=2,5 моль.",
    note:"CaCO₃ — тұз. M=100 г/моль.",
    image:"calcite"
  },
  {
    title:"Хлорид және сульфат тұздары",
    a:"MgCl₂ — магний хлориді, CaCl₂ — кальций хлориді, MgSO₄ — магний сульфаты, CaSO₄ — кальций сульфаты. Тұздардың формуласы иондардың зарядтарына сәйкес жазылады.",
    b:"Mg²⁺ және SO₄²⁻ иондары бір-біріне 1:1 қатынаста сәйкес келеді. Сондықтан MgSO₄ формуласы түзіледі. Ал Ca²⁺ ионы үшін екі Cl⁻ қажет, сондықтан CaCl₂ деп жазылады.",
    note:"MgSO₄ — сульфат; CaCl₂ — хлорид."
  },
  {
    title:"Молярлық масса және зат мөлшері",
    a:"Молярлық масса M — бір моль заттың массасы. Өлшем бірлігі г/моль. Зат мөлшері n мольмен, ал масса m граммен өлшенеді.",
    b:"Формулалар: n=m/M және m=n×M. Мысалы, 112 г CaO үшін n=112/56=2 моль. Ал 3 моль MgO массасы m=3×40=120 г болады.",
    note:"n=m/M; m=n×M; M=m/n.",
    diagram:"formulas"
  },
  {
    title:"2-топ элементтері: қорытынды",
    a:"2-топ элементтерінің сыртқы электрондық қабатында екі электрон болады. Олар көптеген қосылыстарында +2 тотығу дәрежесін көрсетеді. Оксидтер, гидроксидтер және тұздардың формулалары ион зарядтарын теңестіру арқылы жазылады.",
    b:"Есепті шешу кезінде алдымен заттың формуласын анықтап, молярлық массасын есептейміз. Кейін берілген шамаларды қолданып зат мөлшерін немесе массаны табамыз. Соңында өлшем бірлігін міндетті түрде жазамыз.",
    note:"Құрылыс → қасиет → формула → есеп."
  }
];

function diagram(type){
  if(type==="shell"){
    return `
      <div class="card">
        <h3>Электрондық қабаттарды салыстыру</h3>
        <div class="shell-grid">
          <div class="shell">
            <strong>Be</strong><span>2,2</span>
          </div>
          <div class="shell">
            <strong>Mg</strong><span>2,8,2</span>
          </div>
          <div class="shell">
            <strong>Ca</strong><span>2,8,8,2</span>
          </div>
        </div>
      </div>
    `;
  }

  if(type==="trend"){
    return `
      <div class="card green-card">
        <h3>Металдық белсенділік</h3>
        <div class="formula">Mg → Ca → Sr → Ba</div>
        <p class="center">Жалпы өсу бағыты →</p>
      </div>
    `;
  }

  if(type==="oxygen"){
    return `
      <div class="card">
        <h3>Теңдеулерді салыстыр</h3>
        <div class="formula">2Mg + O₂ → 2MgO</div>
        <div class="formula">2Ca + O₂ → 2CaO</div>
      </div>
    `;
  }

  return `
    <div class="card green-card">
      <h3>Негізгі формулалар</h3>
      <div class="formula">n = m / M</div>
      <div class="formula">m = n × M</div>
    </div>
  `;
}

theory.forEach((t,i)=>{
  add(t.title,`Түсіндірме ${i+1}/16`,`
    <div class="subtitle">
      ТОЛЫҚ ТҮСІНДІРМЕ · ${i+1}/16
    </div>
    <h2>${esc(t.title)}</h2>

    <div class="grid2">
      <div class="card">
        <h3>Негізгі мәлімет</h3>
        <p>${esc(t.a)}</p>
      </div>

      ${t.image
        ?photo(t.image)
        :`<div class="card green-card">
             <h3>Қосымша түсіндірме</h3>
             <p>${esc(t.b)}</p>
           </div>`}
    </div>

    ${t.image?`
      <div class="note blue-note">
        <b>Түсіндірме:</b> ${esc(t.b)}
      </div>
    `:""}

    ${t.diagram?`
      <div style="margin-top:15px">
        ${diagram(t.diagram)}
      </div>
    `:""}

    <div class="note">
      <b class="gold">Есте сақта:</b>
      ${esc(t.note)}
    </div>
  `);
});

// ===============================================
// КОНСПЕКТ
// ===============================================

const notes=[
  [
    "2-топ элементтері: Be, Mg, Ca, Sr, Ba, Ra.",
    "Сыртқы электрондық конфигурациясы ns².",
    "Mg: 2,8,2; Ca: 2,8,8,2.",
    "Mg²⁺ ионында 10 электрон, Ca²⁺ ионында 18 электрон.",
    "Топ бойынша атом радиусы мен белсенділік жалпы артады."
  ],
  [
    "2Mg + O₂ → 2MgO.",
    "2Ca + O₂ → 2CaO.",
    "Ca + 2H₂O → Ca(OH)₂ + H₂.",
    "CaO + H₂O → Ca(OH)₂.",
    "Оксидтер: MgO, CaO. Негіздер: Mg(OH)₂, Ca(OH)₂."
  ],
  [
    "M(MgO)=40 г/моль.",
    "M(CaO)=56 г/моль.",
    "M(CaCO₃)=100 г/моль.",
    "M(Ca(OH)₂)=74 г/моль.",
    "n=m/M; m=n×M; M=m/n."
  ]
];

notes.forEach((items,i)=>{
  add(`Конспект №${i+1}`,"Конспект · 10 минут",`
    <div class="subtitle">ДӘПТЕРГЕ ЖАЗЫП АЛ</div>
    <h2>Конспект №${i+1}</h2>
    <div class="card">
      <ol>
        ${items.map(x=>`<li>${esc(x)}</li>`).join("")}
      </ol>
    </div>
    <div class="note blue-note">
      Формулаларды және өлшем бірліктерін
      дәптерге толық жазып ал.
    </div>
  `);
});

// ===============================================
// ДӘПТЕР ЕСЕПТЕРІ — 4 БӨЛІМ
// ===============================================

const notebook=[
  {
    title:"Атом мен ионды салыстыру",
    tasks:[
      ["Mg²⁺ ионында неше электрон бар?","12−2=10."],
      ["Ca²⁺ ионында неше электрон бар?","20−2=18."],
      ["Sr²⁺ ионында неше электрон бар?","38−2=36."],
      ["Ba²⁺ ионында неше электрон бар?","56−2=54."]
    ]
  },
  {
    title:"Реакцияларды теңестіру",
    tasks:[
      ["Mg + O₂ → MgO","2Mg + O₂ → 2MgO."],
      ["Ca + O₂ → CaO","2Ca + O₂ → 2CaO."],
      ["Ca + H₂O → Ca(OH)₂ + H₂",
       "Ca + 2H₂O → Ca(OH)₂ + H₂."],
      ["MgO + HCl → MgCl₂ + H₂O",
       "MgO + 2HCl → MgCl₂ + H₂O."]
    ]
  },
  {
    title:"Молярлық масса",
    tasks:[
      ["Mg(OH)₂ молярлық массасын есепте.",
       "24+2×(16+1)=58 г/моль."],
      ["CaCO₃ молярлық массасын есепте.",
       "40+12+3×16=100 г/моль."],
      ["MgSO₄ молярлық массасын есепте.",
       "24+32+4×16=120 г/моль."],
      ["CaCl₂ молярлық массасын есепте.",
       "40+2×35,5=111 г/моль."]
    ]
  },
  {
    title:"Масса және зат мөлшері",
    tasks:[
      ["168 г CaO зат мөлшерін тап.",
       "168/56=3 моль."],
      ["150 г CaCO₃ зат мөлшерін тап.",
       "150/100=1,5 моль."],
      ["0,75 моль MgO массасын тап.",
       "0,75×40=30 г."],
      ["2,5 моль Ca(OH)₂ массасын тап.",
       "2,5×74=185 г."]
    ]
  }
];

notebook.forEach((set,i)=>{
  dynamic(
    `Дәптер есептері №${i+1}`,
    "Дәптер жұмысы · 15 минут",
    ()=>renderNotebook(i)
  );
});

function renderNotebook(i){
  const set=notebook[i];
  const opened=!!state.notebookOpen[i];

  return `
    <div class="subtitle">ДӘПТЕРГЕ ЕСЕП ШЫҒАР</div>
    <h2>${esc(set.title)}</h2>

    ${set.tasks.map((task,j)=>`
      <div class="task">
        <p><b class="gold">${j+1}.</b>
        ${esc(task[0])}</p>
      </div>
    `).join("")}

    <div class="note blue-note">
      Есепті өз бетіңше шығар,
      содан кейін жауапты тексер.
    </div>

    <p>
      <button class="btn warning"
        onclick="toggleNotebook(${i})">
        ${opened?"Жауаптарды жасыру":"Жауаптарды көру"}
      </button>
    </p>

    ${opened?`
      <div class="answer">
        ${set.tasks.map((task,j)=>`
          <p><b>${j+1}.</b> ${esc(task[1])}</p>
        `).join("")}
      </div>
    `:""}
  `;
}

function toggleNotebook(i){
  state.notebookOpen[i]=!state.notebookOpen[i];
  save();show();
}

// ===============================================
// ҚАТЫСУШЫЛАР
// ===============================================

dynamic("Қатысушылар","3 топ",renderAttendance);

function renderAttendance(){
  const count=present().length;

  return `
    <h2>Сабаққа қатысушылар</h2>
    <p>
      Келмеген оқушыны ✕ арқылы алып таста.
      Қажет болса ↺ арқылы қайта қос.
    </p>

    <div class="grid3">
      <div class="card center">
        <h3>Барлығы</h3>
        <div class="big blue">${state.students.length}</div>
      </div>
      <div class="card center">
        <h3>Қатысушылар</h3>
        <div class="big green-text">${count}</div>
      </div>
      <div class="card center">
        <h3>Келмегендер</h3>
        <div class="big red">
          ${state.students.length-count}
        </div>
      </div>
    </div>

    <div class="student-grid">
      ${state.students.map(s=>`
        <div class="student-item ${s.present?"":"absent"}">
          <span>${esc(s.name)}</span>
          <button
            class="x-btn ${s.present?"":"restore"}"
            onclick="toggleStudent(${s.id})">
            ${s.present?"✕":"↺"}
          </button>
        </div>
      `).join("")}
    </div>
  `;
}

function toggleStudent(id){
  const s=student(id);
  if(!s)return;

  if(s.present && state.marks.some(m=>m.id===id)){
    alert("Бұл оқушы бағаланған. Бағасы журналда сақталған.");
    return;
  }

  s.present=!s.present;
  state.teams=[[],[],[]];
  state.scores=[0,0,0];
  state.gameIndex=0;
  state.gameOpen=false;

  if(!s.present && state.selected===id){
    state.selected=null;
    state.taskIndex=null;
    state.answerOpen=false;
  }

  save();show();
}

// ===============================================
// РАНДОМ 3 ТОП
// ===============================================

dynamic("3 топқа бөлу","Командалар",renderTeams);

function divideTeams(){
  const ids=shuffle(present().map(s=>s.id));

  if(ids.length===0){
    alert("Алдымен қатысушыларды белгіле.");
    return;
  }

  state.teams=[[],[],[]];

  ids.forEach((id,i)=>{
    state.teams[i%3].push(id);
  });

  state.scores=[0,0,0];
  state.gameIndex=0;
  state.gameOpen=false;

  save();show();
}

function renderTeams(){
  return `
    <h2>Оқушыларды 3 топқа бөлу</h2>

    <button class="btn success" onclick="divideTeams()">
      🎲 Топтарды кездейсоқ таңдау
    </button>

    <div class="grid3" style="margin-top:20px">
      ${state.teams.map((team,i)=>`
        <div class="team-card">
          <h3>
            ${["🔵","🟢","🟡"][i]} ${i+1}-топ
          </h3>

          <div class="team-members">
            ${team.map((id,j)=>`
              <div>${j+1}. ${esc(student(id)?.name||"")}</div>
            `).join("")||"Топ әлі бөлінбеген"}
          </div>
        </div>
      `).join("")}
    </div>

    <div class="note">
      Командалар төрт кезеңге қатысады:
      «Формула», «Математикалық химия»,
      «Қатені түзет», «Екі қадам».
    </div>
  `;
}

// ===============================================
// 3 ТОПТЫҢ 4 КЕЗЕҢДІК ОЙЫНЫ
// ===============================================

const gameQuestions=[
  {
    round:"1-кезең: Формуланы тап",
    q:"Mg²⁺ және SO₄²⁻ иондарының қосылыс формуласын ата.",
    a:"MgSO₄."
  },
  {
    round:"1-кезең: Формуланы тап",
    q:"Ca²⁺ және OH⁻ иондары қандай қосылыс түзеді?",
    a:"Ca(OH)₂."
  },
  {
    round:"1-кезең: Формуланы тап",
    q:"Ba²⁺ пен екі Cl⁻ ионы түзетін заттың формуласы?",
    a:"BaCl₂."
  },

  {
    round:"2-кезең: Математикалық химия",
    q:"2 моль MgO массасын есепте. M=40 г/моль.",
    a:"m=2×40=80 г."
  },
  {
    round:"2-кезең: Математикалық химия",
    q:"0,5 моль CaCO₃ массасын есепте. M=100 г/моль.",
    a:"m=0,5×100=50 г."
  },
  {
    round:"2-кезең: Математикалық химия",
    q:"148 г Ca(OH)₂ зат мөлшері қанша? M=74 г/моль.",
    a:"n=148/74=2 моль."
  },

  {
    round:"3-кезең: Қатені түзет",
    q:"«Магний атомында сыртқы 7 электрон бар». Қатесін анықта.",
    a:"Магний атомының сыртқы қабатында 2 электрон бар."
  },
  {
    round:"3-кезең: Қатені түзет",
    q:"«M(CaCO₃)=84 г/моль». Қатесін анықта.",
    a:"M=40+12+3×16=100 г/моль."
  },
  {
    round:"3-кезең: Қатені түзет",
    q:"«Ca²⁺ ионында 22 электрон бар». Қатесін анықта.",
    a:"Ca²⁺ ионында 20−2=18 электрон бар."
  },

  {
    round:"4-кезең: Екі қадам",
    q:"Алдымен MgSO₄ молярлық массасын, кейін 240 г заттың мөлшерін тап.",
    a:"M=24+32+64=120 г/моль. n=240/120=2 моль."
  },
  {
    round:"4-кезең: Екі қадам",
    q:"Алдымен CaO молярлық массасын, кейін 1,5 моль массасын тап.",
    a:"M=40+16=56 г/моль. m=1,5×56=84 г."
  },
  {
    round:"4-кезең: Екі қадам",
    q:"Алдымен Mg(OH)₂ молярлық массасын, кейін 116 г зат мөлшерін тап.",
    a:"M=24+2×17=58 г/моль. n=116/58=2 моль."
  }
];

dynamic("Командалық ойын","3 топ · 15 минут",renderGame);

function renderGame(){
  if(!state.teams.some(team=>team.length)){
    return `
      <h2>Алдымен 3 топқа бөлу қажет</h2>
      <button class="btn primary"
        onclick="goTo('3 топқа бөлу')">
        Топтарға өту →
      </button>
    `;
  }

  if(state.gameIndex>=gameQuestions.length){
    const best=Math.max(...state.scores);
    const winners=state.scores
      .map((v,i)=>v===best?i+1:null)
      .filter(Boolean);

    return `
      <div class="center">
        <h1>Командалық ойын аяқталды!</h1>

        <div class="grid3">
          ${state.scores.map((score,i)=>`
            <div class="card">
              <h3>${i+1}-топ</h3>
              <div class="big gold">${score}</div>
              <p>ұпай</p>
            </div>
          `).join("")}
        </div>

        <div class="note">
          Ең жоғары нәтиже:
          <b class="green-text">
            ${winners.map(x=>x+"-топ").join(", ")}
          </b>
        </div>

        <p>
          <button class="btn primary"
            onclick="goTo('Жеке бағалау')">
            Жеке есептерге өту →
          </button>
        </p>
      </div>
    `;
  }

  const i=state.gameIndex;
  const q=gameQuestions[i];
  const team=i%3;

  return `
    <div class="subtitle">${esc(q.round)}</div>
    <h2>${team+1}-топтың тапсырмасы</h2>

    <div class="grid2">
      <div class="card">
        <span class="pill">
          ${i+1}/${gameQuestions.length} тапсырма
        </span>

        <p class="question">${esc(q.q)}</p>

        <div class="note blue-note">
          Топ ақылдасады және өз шешімін
          ауызша түсіндіреді.
        </div>
      </div>

      <div class="card green-card">
        <h3>Тексеру</h3>

        ${state.gameOpen?`
          <div class="answer">${esc(q.a)}</div>

          <p>
            <button class="btn success"
              onclick="finishGame(true)">
              Дұрыс (+10)
            </button>
          </p>

          <p>
            <button class="btn"
              onclick="finishGame(false)">
              Қате (0)
            </button>
          </p>
        `:`
          <p>Жауап берген соң тексер.</p>
          <button class="btn warning"
            onclick="revealGame()">
            Жауапты көру
          </button>
        `}
      </div>
    </div>

    <div class="note">
      ${state.scores.map((score,i)=>
        `${i+1}-топ: ${score} ұпай`
      ).join(" · ")}
    </div>
  `;
}

function revealGame(){
  state.gameOpen=true;
  save();show();
}

function finishGame(correct){
  if(!state.gameOpen)return;

  if(correct){
    state.scores[state.gameIndex%3]+=10;
  }

  state.gameIndex++;
  state.gameOpen=false;

  save();show();
}

// ===============================================
// ЖЕКЕ ЕСЕПТЕР
// ===============================================

const problems=[
  ["Mg²⁺ ионында неше электрон бар?","10."],
  ["Ca²⁺ ионында неше электрон бар?","18."],
  ["Sr²⁺ ионында неше электрон бар?","36."],
  ["Ba²⁺ ионында неше электрон бар?","54."],

  ["MgO молярлық массасы?","40 г/моль."],
  ["CaO молярлық массасы?","56 г/моль."],
  ["Mg(OH)₂ молярлық массасы?","58 г/моль."],
  ["Ca(OH)₂ молярлық массасы?","74 г/моль."],
  ["CaCO₃ молярлық массасы?","100 г/моль."],
  ["MgSO₄ молярлық массасы?","120 г/моль."],
  ["CaSO₄ молярлық массасы?","136 г/моль."],
  ["CaCl₂ молярлық массасы?","111 г/моль."],

  ["120 г MgO зат мөлшерін тап.","3 моль."],
  ["280 г CaO зат мөлшерін тап.","5 моль."],
  ["200 г CaCO₃ зат мөлшерін тап.","2 моль."],
  ["185 г Ca(OH)₂ зат мөлшерін тап.","2,5 моль."],
  ["60 г MgSO₄ зат мөлшерін тап.","0,5 моль."],
  ["58 г Mg(OH)₂ зат мөлшерін тап.","1 моль."],

  ["3 моль MgO массасын тап.","120 г."],
  ["1,5 моль CaO массасын тап.","84 г."],
  ["0,75 моль CaCO₃ массасын тап.","75 г."],
  ["2 моль Ca(OH)₂ массасын тап.","148 г."],
  ["0,5 моль MgSO₄ массасын тап.","60 г."],
  ["1,25 моль CaCl₂ массасын тап.","138,75 г."],

  ["Mg + O₂ → MgO теңдеуін теңестір.",
   "2Mg + O₂ → 2MgO."],
  ["Ca + O₂ → CaO теңдеуін теңестір.",
   "2Ca + O₂ → 2CaO."],
  ["Mg + HCl → MgCl₂ + H₂ теңдеуін теңестір.",
   "Mg + 2HCl → MgCl₂ + H₂."],
  ["Ca + H₂O → Ca(OH)₂ + H₂ теңдеуін теңестір.",
   "Ca + 2H₂O → Ca(OH)₂ + H₂."],
  ["MgO + HCl → MgCl₂ + H₂O теңдеуін теңестір.",
   "MgO + 2HCl → MgCl₂ + H₂O."],
  ["CaCO₃ → CaO + CO₂ теңдеуін тексер.",
   "Теңестірілген: 1:1:1."]
];

const grades=[55,60,65,70,75,80,85,90,95,100];

dynamic("Жеке бағалау","Жеке жұмыс",renderIndividual);

function chooseStudent(){
  if(state.selected!==null)return;

  const candidates=present().filter(s=>
    !state.marks.some(m=>m.id===s.id)
  );

  if(!candidates.length){
    alert("Барлық қатысушы бағаланды.");
    return;
  }

  let available=problems.map((_,i)=>i)
    .filter(i=>!state.usedTasks.includes(i));

  if(!available.length){
    state.usedTasks=[];
    available=problems.map((_,i)=>i);
  }

  state.selected=candidates[rnd(candidates.length)].id;
  state.taskIndex=available[rnd(available.length)];
  state.usedTasks.push(state.taskIndex);
  state.answerOpen=false;

  save();show();
}

function revealIndividual(){
  state.answerOpen=true;
  save();show();
}

function gradeStudent(grade){
  if(
    state.selected===null ||
    !state.answerOpen ||
    !grades.includes(grade)
  )return;

  const s=student(state.selected);
  const task=problems[state.taskIndex];
  if(!s||!task)return;

  state.marks.push({
    id:s.id,name:s.name,
    question:task[0],
    answer:task[1],
    grade
  });

  state.selected=null;
  state.taskIndex=null;
  state.answerOpen=false;

  save();show();
}

function renderIndividual(){
  if(state.selected===null){
    return `
      <div class="center">
        <div class="subtitle">ЖЕКЕ ЕСЕП ШЫҒАРУ</div>
        <h2>Тақтаға кім шығады?</h2>

        <div class="big blue">
          ${state.marks.length}/${present().length}
        </div>

        <p>Бағаланған оқушылар</p>

        <button class="btn primary"
          onclick="chooseStudent()"
          ${state.marks.length>=present().length
            ?"disabled":""}>
          🎲 Рандом оқушы таңдау
        </button>

        <div class="note">
          Оқушы есепті шығарады, шешуін
          түсіндіреді, одан кейін баға қойылады.
        </div>
      </div>
    `;
  }

  const s=student(state.selected);
  const t=problems[state.taskIndex];
  if(!s||!t)return "<h2>Тапсырма табылмады.</h2>";

  return `
    <div class="grid2">
      <div class="card">
        <h3>Таңдалған оқушы</h3>
        <div class="student-name">${esc(s.name)}</div>
        <p class="question">${esc(t[0])}</p>

        ${state.answerOpen?`
          <div class="answer">
            <b>Дұрыс жауап:</b>
            <p>${esc(t[1])}</p>
          </div>
        `:`
          <button class="btn warning"
            onclick="revealIndividual()">
            Жауапты көру
          </button>
        `}
      </div>

      <div class="card green-card">
        <h3>55–100 бағалау</h3>
        <p>Жауапты тексеріп, баға таңда.</p>

        ${state.answerOpen?`
          <div class="grade-grid">
            ${grades.map(g=>`
              <button class="grade-btn"
                onclick="gradeStudent(${g})">
                ${g}
              </button>
            `).join("")}
          </div>
        `:`
          <div class="note">
            Алдымен жауапты ашу керек.
          </div>
        `}
      </div>
    </div>
  `;
}

// ===============================================
// ЖУРНАЛ
// ===============================================

dynamic("Бағалау журналы","Нәтижелер",renderJournal);

function renderJournal(){
  const average=state.marks.length
    ?(state.marks.reduce((sum,m)=>sum+m.grade,0)/
      state.marks.length).toFixed(1)
    :"—";

  return `
    <h2>Электрондық бағалау журналы</h2>

    <div class="grid3">
      <div class="card center">
        <h3>Қатысушылар</h3>
        <div class="big blue">${present().length}</div>
      </div>
      <div class="card center">
        <h3>Бағаланған</h3>
        <div class="big green-text">
          ${state.marks.length}
        </div>
      </div>
      <div class="card center">
        <h3>Орташа балл</h3>
        <div class="big gold">${average}</div>
      </div>
    </div>

    <div class="card table-scroll"
         style="margin-top:17px">
      <table>
        <thead>
          <tr>
            <th>№</th><th>Оқушы</th>
            <th>Есеп</th><th>Балл</th>
          </tr>
        </thead>
        <tbody>
          ${state.marks.map((m,i)=>`
            <tr>
              <td>${i+1}</td>
              <td>${esc(m.name)}</td>
              <td>${esc(m.question)}</td>
              <td class="green-text">
                <b>${m.grade}</b>
              </td>
            </tr>
          `).join("")||`
            <tr><td colspan="4">
              Әзірше баға жоқ.
            </td></tr>
          `}
        </tbody>
      </table>
    </div>

    <p style="text-align:right">
      <button class="btn success"
        onclick="exportJournal()">
        CSV журналын сақтау
      </button>
    </p>
  `;
}

function exportJournal(){
  const rows=[
    ["№","Оқушы","Есеп","Жауап","Балл"],
    ...state.marks.map((m,i)=>[
      i+1,m.name,m.question,m.answer,m.grade
    ])
  ];

  const csv="\uFEFF"+rows.map(row=>
    row.map(x=>
      '"'+String(x).replace(/"/g,'""')+'"'
    ).join(";")
  ).join("\r\n");

  const blob=new Blob([csv],{
    type:"text/csv;charset=utf-8"
  });

  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");

  a.href=url;
  a.download="himiya_4_3_4_4_bagalar.csv";
  a.click();

  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

// ===============================================
// ҮЙ ЖҰМЫСЫ — ӨЗГЕШЕ ФОРМАТ
// ===============================================

const homework=[
  {
    section:"1-кезең. Қатені анықта",
    q:"Оқушы M(Ca(OH)₂)=40+16+1×2=58 г/моль деп есептеді. Қателігін тауып, дұрыс шеш.",
    a:"OH жақшадағы топ 2 рет алынуы керек. M=40+2×(16+1)=74 г/моль."
  },
  {
    section:"1-кезең. Қатені анықта",
    q:"Оқушы Mg²⁺ ионында 14 электрон бар деді. Дұрыс жауабын есепте.",
    a:"Mg атомында 12 электрон, Mg²⁺ ионында 12−2=10 электрон."
  },
  {
    section:"1-кезең. Қатені анықта",
    q:"Оқушы 0,5 моль CaO массасын 112 г деп тапты. Есепті түзет.",
    a:"M(CaO)=56 г/моль. m=0,5×56=28 г."
  },
  {
    section:"2-кезең. Екі қадамды есеп",
    q:"CaSO₄ молярлық массасын есептеп, содан кейін 272 г заттың мөлшерін тап.",
    a:"M=40+32+64=136 г/моль. n=272/136=2 моль."
  },
  {
    section:"2-кезең. Екі қадамды есеп",
    q:"MgCl₂ молярлық массасын есептеп, 1,5 моль заттың массасын тап.",
    a:"M=24+2×35,5=95 г/моль. m=1,5×95=142,5 г."
  },
  {
    section:"2-кезең. Екі қадамды есеп",
    q:"CaCO₃ молярлық массасын есептеп, 375 г заттың мөлшерін анықта.",
    a:"M=100 г/моль. n=375/100=3,75 моль."
  },
  {
    section:"3-кезең. Реакция бойынша есеп",
    q:"2Mg + O₂ → 2MgO теңдеуі бойынша 2 моль Mg әрекеттескенде неше моль MgO түзіледі? Оның массасын есепте.",
    a:"2 моль Mg → 2 моль MgO. m=2×40=80 г."
  },
  {
    section:"3-кезең. Реакция бойынша есеп",
    q:"CaCO₃ → CaO + CO₂ теңдеуі бойынша 1 моль CaCO₃ ыдыраса, теориялық түрде неше грамм CaO түзіледі?",
    a:"1 моль CaCO₃ → 1 моль CaO. m=1×56=56 г."
  },
  {
    section:"3-кезең. Реакция бойынша есеп",
    q:"Mg + 2HCl → MgCl₂ + H₂ теңдеуі бойынша 0,5 моль Mg әрекеттессе, теориялық H₂ зат мөлшері қанша?",
    a:"Mg пен H₂ қатынасы 1:1, сондықтан n(H₂)=0,5 моль."
  },
  {
    section:"3-кезең. Реакция бойынша есеп",
    q:"CaO + H₂O → Ca(OH)₂ теңдеуі бойынша 2 моль CaO-дан теориялық түрде неше грамм Ca(OH)₂ түзіледі?",
    a:"2 моль CaO → 2 моль Ca(OH)₂. m=2×74=148 г."
  }
];

dynamic("Үй тапсырмасы","Үй жұмысы",renderHomework);

function renderHomework(){
  return `
    <div class="subtitle">
      ҮЙ ТАПСЫРМАСЫ · ЕСЕПТЕР
    </div>

    <h2>«Химиялық есептер зертханасы»</h2>

    <div class="grid2">
      <div class="card">
        <h3>1–5 тапсырма</h3>
        ${homework.slice(0,5).map((item,i)=>`
          <div class="task">
            <div class="small gold">
              ${esc(item.section)}
            </div>
            <p><b>${i+1}.</b> ${esc(item.q)}</p>
          </div>
        `).join("")}
      </div>

      <div class="card green-card">
        <h3>6–10 тапсырма</h3>
        ${homework.slice(5).map((item,i)=>`
          <div class="task">
            <div class="small gold">
              ${esc(item.section)}
            </div>
            <p><b>${i+6}.</b> ${esc(item.q)}</p>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="note blue-note">
      Есептерді дәптерге шығар.
      Әрқайсысында формула, шешуі,
      есептеу нәтижесі және өлшем бірлігі болсын.
    </div>

    <p>
      <button class="btn warning"
        onclick="toggleHomework()">
        ${state.homeworkOpen
          ?"Жауаптарды жасыру"
          :"Жауаптарды тексеру"}
      </button>
    </p>

    ${state.homeworkOpen?`
      <div class="answer">
        ${homework.map((item,i)=>`
          <p><b>${i+1}.</b> ${esc(item.a)}</p>
        `).join("")}
      </div>
    `:""}
  `;
}

function toggleHomework(){
  state.homeworkOpen=!state.homeworkOpen;
  save();show();
}

// ===============================================
// ҚОРЫТЫНДЫ
// ===============================================

add("Сабақ қорытындысы","Аяқталуы",`
  <div class="center">
    <div class="subtitle">ХИМИЯ · 4.3–4.4</div>
    <h1>Сабақ аяқталды!</h1>
    <h2 class="green-text">2 (IIA) топ элементтері</h2>

    <div class="grid3">
      <div class="card">
        <h3>Түсіндік</h3>
        <p>Атом құрылысын және металдық белсенділікті.</p>
      </div>
      <div class="card">
        <h3>Үйрендік</h3>
        <p>Оксид, гидроксид және тұздардың формулаларын.</p>
      </div>
      <div class="card">
        <h3>Орындадық</h3>
        <p>Есептер, топтық ойын және жеке тапсырмалар.</p>
      </div>
    </div>

    <h2 style="margin-top:27px">
      Назарларыңызға рақмет!
    </h2>

    <div class="big gold">BY DARKHAN</div>
  </div>
`);

// ===============================================
// КАЛЬКУЛЯТОР
// ===============================================

const calculator=$("calculator");

$("calcOpen").onclick=()=>{
  calculator.classList.toggle("hidden");

  if(!calculator.classList.contains("hidden")){
    keepCalcInside();
  }
};

$("calcClose").onclick=()=>{
  calculator.classList.add("hidden");
};

const calcButtons=[
  "7","8","9","÷",
  "4","5","6","×",
  "1","2","3","−",
  "C","0",".","+",
  "(",")","⌫","="
];

let calcText="";

$("calcKeys").innerHTML=calcButtons.map(key=>`
  <button type="button" data-key="${key}">
    ${key}
  </button>
`).join("");

$("calcKeys").addEventListener("click",event=>{
  const btn=event.target.closest("button");
  if(!btn)return;

  const key=btn.dataset.key;

  if(key==="C"){
    calcText="";
  }else if(key==="⌫"){
    calcText=calcText.slice(0,-1);
  }else if(key==="="){
    try{
      const src=calcText
        .replaceAll("×","*")
        .replaceAll("÷","/")
        .replaceAll("−","-");

      calcText=String(calculate(src));
    }catch(e){
      calcText="Қате";
    }
  }else{
    if(calcText==="Қате")calcText="";
    calcText+=key;
  }

  $("calcDisplay").value=calcText;
});

// Арифметикалық есептеу (eval қолданылмайды)
function calculate(src){
  if(!/^[0-9+\-*/(). ]+$/.test(src)){
    throw Error("Invalid expression");
  }

  let pos=0;

  function spaces(){
    while(src[pos]===" ")pos++;
  }

  function factor(){
    spaces();

    if(src[pos]==="+"){
      pos++;
      return factor();
    }

    if(src[pos]==="-"){
      pos++;
      return -factor();
    }

    if(src[pos]==="("){
      pos++;
      const n=expression();
      spaces();

      if(src[pos]!==")")throw Error();

      pos++;
      return n;
    }

    const match=/^(?:\d+(?:\.\d*)?|\.\d+)/
      .exec(src.slice(pos));

    if(!match)throw Error();

    pos+=match[0].length;
    return Number(match[0]);
  }

  function term(){
    let n=factor();

    while(true){
      spaces();
      const op=src[pos];

      if(op!=="*"&&op!=="/")break;

      pos++;
      const b=factor();
      n=op==="*"?n*b:n/b;
    }

    return n;
  }

  function expression(){
    let n=term();

    while(true){
      spaces();
      const op=src[pos];

      if(op!=="+"&&op!=="-")break;

      pos++;
      const b=term();
      n=op==="+"?n+b:n-b;
    }

    return n;
  }

  const result=expression();
  spaces();

  if(pos!==src.length||!Number.isFinite(result)){
    throw Error();
  }

  return Number(result.toPrecision(12));
}

// ===============================================
// КАЛЬКУЛЯТОРДЫ КЕЗ КЕЛГЕН ЖЕРІНЕН ЖЫЛЖЫТУ
// ===============================================

function clamp(value,min,max){
  return Math.max(min,Math.min(value,max));
}

function keepCalcInside(){
  if(calculator.classList.contains("hidden"))return;

  const r=calculator.getBoundingClientRect();

  calculator.style.left=clamp(
    r.left,0,Math.max(0,innerWidth-r.width)
  )+"px";

  calculator.style.top=clamp(
    r.top,0,Math.max(0,innerHeight-r.height)
  )+"px";

  calculator.style.right="auto";
  calculator.style.bottom="auto";
}

let drag=null;
let blockClick=false;

// Барлық бетіне сүйреу оқиғасы беріледі.
calculator.addEventListener("pointerdown",event=>{
  if(event.pointerType==="mouse"&&event.button!==0)return;

  const r=calculator.getBoundingClientRect();

  drag={
    id:event.pointerId,
    startX:event.clientX,
    startY:event.clientY,
    left:r.left,
    top:r.top,
    active:false
  };
});

window.addEventListener("pointermove",event=>{
  if(!drag||drag.id!==event.pointerId)return;

  const dx=event.clientX-drag.startX;
  const dy=event.clientY-drag.startY;

  if(!drag.active&&Math.hypot(dx,dy)>7){
    drag.active=true;
    calculator.classList.add("dragging");

    calculator.style.left=drag.left+"px";
    calculator.style.top=drag.top+"px";
    calculator.style.right="auto";
    calculator.style.bottom="auto";
  }

  if(!drag.active)return;

  if(event.cancelable)event.preventDefault();

  const maxX=Math.max(
    0,innerWidth-calculator.offsetWidth
  );
  const maxY=Math.max(
    0,innerHeight-calculator.offsetHeight
  );

  calculator.style.left=clamp(
    drag.left+dx,0,maxX
  )+"px";

  calculator.style.top=clamp(
    drag.top+dy,0,maxY
  )+"px";
},{passive:false});

// Егер сүйреп жылжытса, кездейсоқ батырма басылмасын.
calculator.addEventListener("click",event=>{
  if(!blockClick)return;

  event.preventDefault();
  event.stopImmediatePropagation();
  blockClick=false;
},true);

function stopDrag(event){
  if(!drag||drag.id!==event.pointerId)return;

  if(drag.active){
    blockClick=true;
    setTimeout(()=>{blockClick=false},100);
  }

  drag=null;
  calculator.classList.remove("dragging");
}

window.addEventListener("pointerup",stopDrag);
window.addEventListener("pointercancel",stopDrag);
window.addEventListener("resize",keepCalcInside);

// ===============================================
// МЕНДЕЛЕЕВ КЕСТЕСІ — 118 ЭЛЕМЕНТ
// ===============================================

const periodicText=`
H|Сутек|1.008
He|Гелий|4.003
Li|Литий|6.94
Be|Бериллий|9.012
B|Бор|10.81
C|Көміртек|12.011
N|Азот|14.007
O|Оттек|15.999
F|Фтор|18.998
Ne|Неон|20.180
Na|Натрий|22.990
Mg|Магний|24.305
Al|Алюминий|26.982
Si|Кремний|28.085
P|Фосфор|30.974
S|Күкірт|32.06
Cl|Хлор|35.45
Ar|Аргон|39.948
K|Калий|39.098
Ca|Кальций|40.078
Sc|Скандий|44.956
Ti|Титан|47.867
V|Ванадий|50.942
Cr|Хром|51.996
Mn|Марганец|54.938
Fe|Темір|55.845
Co|Кобальт|58.933
Ni|Никель|58.693
Cu|Мыс|63.546
Zn|Мырыш|65.38
Ga|Галлий|69.723
Ge|Германий|72.630
As|Мышьяк|74.922
Se|Селен|78.971
Br|Бром|79.904
Kr|Криптон|83.798
Rb|Рубидий|85.468
Sr|Стронций|87.62
Y|Иттрий|88.906
Zr|Цирконий|91.224
Nb|Ниобий|92.906
Mo|Молибден|95.95
Tc|Технеций|[98]
Ru|Рутений|101.07
Rh|Родий|102.906
Pd|Палладий|106.42
Ag|Күміс|107.868
Cd|Кадмий|112.414
In|Индий|114.818
Sn|Қалайы|118.710
Sb|Сурьма|121.760
Te|Теллур|127.60
I|Йод|126.904
Xe|Ксенон|131.293
Cs|Цезий|132.905
Ba|Барий|137.327
La|Лантан|138.905
Ce|Церий|140.116
Pr|Празеодим|140.908
Nd|Неодим|144.242
Pm|Прометий|[145]
Sm|Самарий|150.36
Eu|Еуропий|151.964
Gd|Гадолиний|157.25
Tb|Тербий|158.925
Dy|Диспрозий|162.500
Ho|Гольмий|164.930
Er|Эрбий|167.259
Tm|Тулий|168.934
Yb|Иттербий|173.045
Lu|Лютеций|174.967
Hf|Гафний|178.49
Ta|Тантал|180.948
W|Вольфрам|183.84
Re|Рений|186.207
Os|Осмий|190.23
Ir|Иридий|192.217
Pt|Платина|195.084
Au|Алтын|196.967
Hg|Сынап|200.592
Tl|Таллий|204.38
Pb|Қорғасын|207.2
Bi|Висмут|208.980
Po|Полоний|[209]
At|Астат|[210]
Rn|Радон|[222]
Fr|Франций|[223]
Ra|Радий|[226]
Ac|Актиний|[227]
Th|Торий|232.038
Pa|Протактиний|231.036
U|Уран|238.029
Np|Нептуний|[237]
Pu|Плутоний|[244]
Am|Америций|[243]
Cm|Кюрий|[247]
Bk|Берклий|[247]
Cf|Калифорний|[251]
Es|Эйнштейний|[252]
Fm|Фермий|[257]
Md|Менделевий|[258]
No|Нобелий|[259]
Lr|Лоуренсий|[266]
Rf|Резерфордий|[267]
Db|Дубний|[268]
Sg|Сиборгий|[269]
Bh|Борий|[270]
Hs|Хассий|[277]
Mt|Мейтнерий|[278]
Ds|Дармштадтий|[281]
Rg|Рентгений|[282]
Cn|Коперниций|[285]
Nh|Нихоний|[286]
Fl|Флеровий|[289]
Mc|Московий|[290]
Lv|Ливерморий|[293]
Ts|Теннессин|[294]
Og|Оганесон|[294]
`;

const elements=periodicText.trim().split("\n")
  .map((line,i)=>{
    const [symbol,name,mass]=line.trim().split("|");
    return {number:i+1,symbol,name,mass};
  });

// ===============================================
// ЭЛЕМЕНТТЕРДІҢ КЕСТЕДЕГІ ОРЫНДАРЫ
// ===============================================

const periodColumns=[
  [1,18],
  [1,2,13,14,15,16,17,18],
  [1,2,13,14,15,16,17,18],
  Array.from({length:18},(_,i)=>i+1),
  Array.from({length:18},(_,i)=>i+1)
];

function elementPosition(z){
  if(z<=54){
    let index=z-1;

    for(let period=0;period<5;period++){
      const columns=periodColumns[period];

      if(index<columns.length){
        return {
          row:period+1,
          col:columns[index]
        };
      }

      index-=columns.length;
    }
  }

  if(z>=55&&z<=57)return {row:6,col:z-54};
  if(z>=58&&z<=71)return {row:9,col:z-54};
  if(z>=72&&z<=86)return {row:6,col:z-68};

  if(z>=87&&z<=89)return {row:7,col:z-86};
  if(z>=90&&z<=103)return {row:10,col:z-86};
  if(z>=104&&z<=118)return {row:7,col:z-100};

  return {row:10,col:18};
}

const g2=new Set(["Be","Mg","Ca","Sr","Ba","Ra"]);
const halogen=new Set(["F","Cl","Br","I","At","Ts"]);
const noble=new Set(["He","Ne","Ar","Kr","Xe","Rn","Og"]);
const nonmetal=new Set(["H","C","N","O","P","S","Se"]);
const metalloid=new Set(["B","Si","Ge","As","Sb","Te"]);

function category(z,symbol){
  if(z>=57&&z<=71)return "lanth";
  if(z>=89&&z<=103)return "act";
  if(g2.has(symbol))return "group2";
  if(halogen.has(symbol))return "halogen";
  if(noble.has(symbol))return "noble";
  if(nonmetal.has(symbol))return "nonmetal";
  if(metalloid.has(symbol))return "metalloid";
  return "metal";
}

// ===============================================
// ТОП ЖӘНЕ ПЕРИОД НӨМІРЛЕРІ
// ===============================================

function buildPeriodic(){
  let html=`
    <div class="period-corner"
      style="grid-row:1;grid-column:1">
      Топ / Период
    </div>
  `;

  for(let group=1;group<=18;group++){
    html+=`
      <div
        class="group-num ${group===2?"highlight":""}"
        style="grid-row:1;grid-column:${group+1}">
        ${group}
      </div>
    `;
  }

  for(let period=1;period<=7;period++){
    html+=`
      <div class="period-num"
        style="grid-row:${period+1};grid-column:1">
        ${period}
      </div>
    `;
  }

  html+=`
    <div class="period-num series"
      style="grid-row:10;grid-column:1">
      Лантаноидтар
    </div>

    <div class="period-num series"
      style="grid-row:11;grid-column:1">
      Актиноидтар
    </div>
  `;

  html+=elements.map((e,i)=>{
    const p=elementPosition(e.number);

    return `
      <button
        class="element ${category(e.number,e.symbol)}"
        style="
          grid-row:${p.row+1};
          grid-column:${p.col+1}
        "
        onclick="showElement(${i})">

        <span class="num">${e.number}</span>
        <span class="symbol">${e.symbol}</span>
        <span class="ename">${esc(e.name)}</span>
        <span class="mass">${e.mass}</span>
      </button>
    `;
  }).join("");

  $("periodicGrid").innerHTML=html;
}

function showElement(index){
  const e=elements[index];
  if(!e)return;

  const p=elementPosition(e.number);

  const period=p.row===9?6:p.row===10?7:p.row;
  const group=p.row>7?"f-блок":p.col+"-топ";

  $("elementInfo").innerHTML=`
    <b class="blue">
      ${e.number}. ${esc(e.name)} (${e.symbol})
    </b>

    <div>
      ${period}-период ·
      <b class="green-text">${group}</b>
    </div>

    <div>
      Атомдық масса немесе изотоптың массалық саны:
      <b class="gold">${e.mass}</b>
    </div>
  `;
}

// ===============================================
// КЕСТЕНІ АШУ ЖӘНЕ ЖАБУ
// ===============================================

$("tableOpen").onclick=()=>{
  $("periodicModal").classList.remove("hidden");
};

$("tableClose").onclick=()=>{
  $("periodicModal").classList.add("hidden");
};

$("periodicModal").addEventListener("click",event=>{
  if(event.target===$("periodicModal")){
    $("periodicModal").classList.add("hidden");
  }
});

document.addEventListener("keydown",event=>{
  if(event.key==="Escape"){
    $("periodicModal").classList.add("hidden");
    calculator.classList.add("hidden");
  }
});

// ===============================================
// САЙТТЫ ІСКЕ ҚОСУ
// ===============================================

buildPeriodic();
updateTime();
show();
