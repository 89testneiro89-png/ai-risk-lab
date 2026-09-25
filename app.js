const state={appeals:null,corp:null,kb:null};

const scenarios={
appeals:{
 benefit:{out:"Проект ответа:\n\nВы имеете право на льготу в размере 50% стоимости услуги. Для оформления достаточно предъявить паспорт и заявление. Льгота действует автоматически с даты обращения.",hint:"<b>Разбор:</b> в условии нет подтверждённого источника для размера льготы, перечня документов и даты начала. Убедительная форма ответа не делает факты достоверными.",risk:"ИИ формирует неподтверждённые условия льготы",type:"Технологический + операционный",cause:"Недостаточно подтверждённых данных; ответ может быть пропущен человеком без проверки",consequence:"Пользователь получает неверные условия услуги"},
 deadline:{out:"Проект ответа:\n\nВаше обращение будет рассмотрено в течение 10 календарных дней. Ответ автоматически придёт на электронную почту.",hint:"<b>Разбор:</b> в описании решения нет подтверждённого срока и нет функции автоматической отправки. Здесь сразу два утверждения, которых нет во входных данных.",risk:"ИИ придумывает срок и способ получения ответа",type:"Технологический",cause:"Модель дополняет отсутствующие сведения",consequence:"Неверные ожидания пользователя и возможное ошибочное действие сотрудника"},
 address:{out:"Проект ответа:\n\nОбратитесь по адресу: ул. Центральная, 15, кабинет 204. Приём ведётся ежедневно с 09:00 до 19:00.",hint:"<b>Разбор:</b> адрес и режим работы отсутствуют в исходных данных. Это пример правдоподобного, но неподтверждённого факта.",risk:"ИИ генерирует неподтверждённый адрес и режим работы",type:"Технологический",cause:"Нет подтверждённого источника",consequence:"Пользователь может выполнить действие на основе неверной информации"}
},
corp:{
 public:{out:"Передача выполнена.\n\nТип материала: опубликованный пресс-релиз.\nСистема приняла текст без дополнительной проверки.",hint:"<b>Разбор:</b> даже если материал опубликован, допустимость конкретного внешнего сервиса определяется правилами организации. Без этих правил окончательный вывод сделать нельзя.",risk:"Передача материала во внешний ИИ без проверки правил организации",type:"Операционный",cause:"Не проверены разрешённые сервисы и правила передачи",consequence:"Нарушение внутреннего процесса"},
 personal:{out:"Передача выполнена.\n\nФИО: Анна К.\nТелефон: +7 900 000-00-00\nИстория покупок: учебные данные\n\nСистема приняла данные без предупреждения.",hint:"<b>Разбор:</b> риск возникает до генерации ответа — в момент передачи данных внешнему сервису. Точка вмешательства находится до отправки.",risk:"Передача персональных/чувствительных данных внешнему ИИ-сервису",type:"Технологический + операционный",cause:"Нет предварительной проверки допустимости данных",consequence:"Данные выходят за предполагаемый контролируемый контур"},
 code:{out:"Передача выполнена.\n\nФрагмент внутреннего исходного кода принят внешним ИИ-сервисом без предупреждения.",hint:"<b>Разбор:</b> это подтверждает факт передачи, но не доказывает автоматически факт утечки. Нужно проверить политику организации и условия использования сервиса.",risk:"Передача внутреннего исходного кода внешнему ИИ-сервису",type:"Технологический + операционный",cause:"Нет правила/контроля допустимых категорий данных",consequence:"Возможное раскрытие внутренней информации"},
 contract:{out:"Передача выполнена.\n\nФрагмент внутреннего договора принят внешним ИИ-сервисом без предупреждения.",hint:"<b>Разбор:</b> нельзя автоматически называть документ конфиденциальным, если этого нет в условии. Корректный вывод: необходимо проверить статус документа и допустимость передачи.",risk:"Передача внутреннего документа без проверки допустимости",type:"Операционный",cause:"Статус данных и правила передачи не проверены",consequence:"Возможный выход ограниченной информации за допустимый контур"}
},
kb:{
 delivery:{out:"Доставка занимает 2–4 рабочих дня.",hint:"<b>Разбор:</b> ответ совпадает с базой знаний. Один успешный тест не доказывает, что система безопасна во всех сценариях.",risk:"Риск в выбранном тесте не проявился",type:"Недостаточно данных",cause:"—",consequence:"—"},
 weekend:{out:"Да, поддержка работает в субботу с 10:00 до 15:00.",hint:"<b>Разбор:</b> база содержит только «пн–пт, 09:00–18:00». Информация о субботе придумана. При отсутствии подтверждения система должна корректно обозначать недостаток данных.",risk:"ИИ отвечает сведениями, которых нет в базе знаний",type:"Технологический",cause:"Система допускает ответ без подтверждённого контекста",consequence:"Пользователь получает неверный режим работы"},
 warranty:{out:"Гарантия на товар составляет 12 месяцев со дня покупки.",hint:"<b>Разбор:</b> в базе знаний нет информации о гарантии. Значение «12 месяцев» сгенерировано без основания.",risk:"ИИ придумывает отсутствующую политику гарантии",type:"Технологический",cause:"Ответ формируется при отсутствии данных в базе",consequence:"Пользователь получает неподтверждённые условия"},
 return:{out:"Да, товар можно вернуть в течение 30 календарных дней.",hint:"<b>Разбор:</b> база знаний содержит срок 14 дней, а ответ ИИ — 30. Ответ противоречит подтверждённому источнику.",risk:"ИИ искажает подтверждённый срок возврата",type:"Технологический",cause:"Ответ не соответствует содержимому базы знаний",consequence:"Пользователь получает неверные условия возврата"}
}};

function status(id,text,cls){const el=document.getElementById(id);el.textContent=text;el.className="status "+cls}
function run(kind,key,outId,hintId,statusId){
 const s=scenarios[kind][key];state[kind]=s;
 const out=document.getElementById(outId);out.classList.remove("empty");out.textContent=s.out;
 const h=document.getElementById(hintId);h.innerHTML=s.hint;h.classList.add("hidden");
 const good=kind==="kb"&&key==="delivery";status(statusId,good?"ответ соответствует базе":"есть что анализировать",good?"ok":"warn")
}
document.getElementById("runAppeal").onclick=()=>run("appeals",document.getElementById("appealScenario").value,"appealOutput","appealHint","appealStatus");
document.getElementById("runCorp").onclick=()=>run("corp",document.getElementById("corpScenario").value,"corpOutput","corpHint","corpStatus");
document.getElementById("runKb").onclick=()=>run("kb",document.getElementById("kbScenario").value,"kbOutput","kbHint","kbStatus");

document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".panel").forEach(x=>x.classList.remove("active"));t.classList.add("active");document.getElementById(t.dataset.tab).classList.add("active")});
document.querySelectorAll(".reveal").forEach(b=>b.onclick=()=>document.getElementById(b.dataset.target).classList.toggle("hidden"));

const body=document.getElementById("riskBody");
function row(data={}){
 const tr=document.createElement("tr");
 tr.innerHTML=`<td><textarea>${data.caseName||""}</textarea></td>
 <td><textarea>${data.risk||""}</textarea></td>
 <td><select>
 <option ${data.type==="Технологический"?"selected":""}>Технологический</option>
 <option ${data.type==="Операционный"?"selected":""}>Операционный</option>
 <option ${data.type==="Технологический + операционный"?"selected":""}>Технологический + операционный</option>
 <option ${!data.type||data.type==="Недостаточно данных"?"selected":""}>Недостаточно данных</option>
 </select></td>
 <td><textarea>${data.cause||""}</textarea></td>
 <td><textarea>${data.consequence||""}</textarea></td>
 <td><textarea placeholder="1/2/3 или Недостаточно данных">${data.probability||""}</textarea></td>
 <td><textarea placeholder="На основании чего?">${data.basis||""}</textarea></td>
 <td><textarea placeholder="Что конкретно изменить?">${data.measure||""}</textarea></td>
 <td><textarea placeholder="Как проверить эффект?">${data.check||""}</textarea></td>
 <td><button class="remove">×</button></td>`;
 tr.querySelector(".remove").onclick=()=>{tr.remove();save()};
 tr.querySelectorAll("textarea,select").forEach(el=>el.addEventListener("input",save));
 body.appendChild(tr);save()
}
function readRows(){return [...body.querySelectorAll("tr")].map(tr=>{const e=tr.querySelectorAll("textarea,select");return{caseName:e[0].value,risk:e[1].value,type:e[2].value,cause:e[3].value,consequence:e[4].value,probability:e[5].value,basis:e[6].value,measure:e[7].value,check:e[8].value}})}
function save(){localStorage.setItem("aiRiskLab",JSON.stringify(readRows()))}
function load(){try{const d=JSON.parse(localStorage.getItem("aiRiskLab")||"[]");if(d.length){d.forEach(row);return}}catch(e){}row()}
document.getElementById("addRow").onclick=()=>row();
document.getElementById("clearRegister").onclick=()=>{if(confirm("Очистить рабочий реестр?")){body.innerHTML="";localStorage.removeItem("aiRiskLab");row()}};

document.querySelectorAll(".add-register").forEach(b=>b.onclick=()=>{
 const kind=b.dataset.kind,s=state[kind];if(!s){alert("Сначала запустите сценарий.");return}
 const names={appeals:"Кейс 1 · ИИ-помощник обращений",corp:"Кейс 2 · Корпоративный ИИ",kb:"Кейс 3 · ИИ-консультант"};
 row({caseName:names[kind],risk:s.risk,type:s.type,cause:s.cause,consequence:s.consequence,probability:"Недостаточно данных",basis:"Один тест не даёт частоту возникновения"});
 document.querySelector('[data-tab="register"]').click()
});

function csv(v){return '"'+String(v??"").replaceAll('"','""')+'"'}
document.getElementById("exportCsv").onclick=()=>{
 const headers=["Кейс","Риск","Тип","Причина","Последствия","Вероятность / НД","Основание","Мероприятие","Как проверить"];
 const rows=readRows().map(r=>[r.caseName,r.risk,r.type,r.cause,r.consequence,r.probability,r.basis,r.measure,r.check]);
 const text="\uFEFF"+[headers,...rows].map(r=>r.map(csv).join(";")).join("\n");
 const blob=new Blob([text],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="AI_Risk_Lab_реестр.csv";a.click();URL.revokeObjectURL(url)
};
load();