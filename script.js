const notes_in_measure = 1;
const min_measures = 2;
const fadeIn = 0.01;
const fadeOut = 0.1;
const example_last = 0.5;
const whole_note = 1;
const fundamental_frequency = 220;
const correction_pause = 250;
const range_limit = 9; //intervallo di decima
const url_wholerest = "images/wholerest.png";
const url_wholenote = "images/wholenote.png";
const url_sharp = "images/sharp.png";
const url_flat = "images/flat.png";
const url_natural = "images/natural.png";
const url_arrow_top = "images/arrowtop.png";
const url_arrow_down = "images/arrowdown.png";
const url_treble = "images/treble.svg";
const url_bass = "images/bass.png";
const url_play = "images/play.png";
const url_stop = "images/stop.png";
const messages = {
  cannot_change_length: "Non puoi più modificare la lunghezza del brano",
  delete_all: "Eliminare tutta la voce?",
  save: "Sicuro di voler salvare? Il salvataggio sovrascriverà il brano precedente",
  save_done: "canzone salvata",
  import: "Importare il brano? Eliminerai quello esistente",
  import_done: "Brano importato correttamente",
  import_error: "Impossibile importare il brano",
  well_done: "Molto bene",
  error: "Errore ",
  of: " di ",
  colon: ": ",
  too_short: "E' troppo corto",
  pauses: "Non ci devono essere pause",
  correcting: "Sto correggendo...",
  too_hard: "Troppo difficile correggere",
  fixed_counterpoint: "Contrappunto corretto",
  fixed_cantusfirmus: "Cantus firmus corretto",
  interrupted: "Correzione interrotta",
  random: "La randomizzazione sovrascrive la voce esistente. Continuare?",
  cannot_change_clef: "Non puoi più cambiare il rigo del cantus firmus. Elimina il brano e riprova",
  cannot_pass_to_cp: "Prima di passare a comporre il contrappunto, è necessario comporre un cantus firmus privo di errori",
  palestrina: "Ciao, sono Giovanni Pierluigi da Palestrina e ti aiuterò a scrivere una seconda voce secondo le regole del Contrappunto di Prima Specie",
  gregory: "Ciao, sono Gregorio Magno e ti aiuterò a scrivere un Cantus Firmus secondo le regole della tradizione musicale",
  
};
const texts = new Map([
    ['too_short', 'Il cantus firmus è troppo corto'],
    ['pauses', 'Non ci devono essere pause'],
    ['chromaticisms', 'Non ci devono essere cromatismi'],
    ['tonic', 'Deve iniziare e finire sulla tonica'],
    ['clausula', 'Deve finire con la clausula vera'],
    ['repeat', 'Non deve avere note ripetute'],
    ['various', 'E presente una nota troppo ricorrente'],
    ['overrange', 'Fra la nota più bassa e quella più alta deve esserci al massimo un intervallo di decima'],
    ['leaps', 'Ci sono troppi salti, usa più gradi congiunti'],
    ['dissonances', 'Sono presenti intervalli melodicamente dissonanti'],
    ['leaps2', 'Sono presenti salti proibiti'],
    ['contrary1', 'Mancano i moti contrari ad inquadrare i salti di ottava e sesta minore ascendente'],
    ['double', 'Ci sono doppi salti illegali'],
    ['contrary2', 'Mancano i moti contrari ad inquadrare i doppi salti'],
    ['climax', 'Ci sono climax multipli'],
    ['harmonic_dissonances', 'Sono presenti intervalli armonicamente dissonanti'],
    ['unisons', "L'unisono è ammesso solo all'inizio e alla fine"],
    ['contrary', "Gli intervalli di quinta, ottava e unisono devono essere preceduti da moti contrari, ad eccezione delle cd. quinte di corno"],
    ['parallel', "Sono presenti quinte o ottave parallele"],
    ['parallels', "Terze e seste consecutive sono ammesse ma in un numero non superiore a tre"],
    ['chromaticisms2', 'Ci sono cromatismi proibiti'],
    ['start', 'Il contrappunto ha la nota iniziale scorretta'],
    ['end', 'Il contrappunto deve finire sulla tonica preceduto da un moto contrario e congiunto'],
    ['far', 'Le note del contrappunto possono distare da quelle del cantus firmus al più un intervallo di decima'],
  ]);
const ionian_mode = new Map([[0,0],[1,2],[2,4],[3,5],[4,7],[5,9],[6,11],[7,12],[8,14],[9,16],[10,17],[11,19],[12,21],[-1,-1],[-2,-3],[-3,-5],[-4,-7],[-5,-8],[-6,-10],[-7,-12],[-8,-13],[-9,-15],[-10,-17],[-11,-19],[-12,-20]]);
var errors = new Array();
var cantus_firmus = new Array();
var counterpoint = new Array();
var intervals = new Array();
var motions = new Array();
var counterpoint_active = false;
var is_playing = false;
var alter_active = 0;
var signature = 0;
var altered_notes = new Array();
var cf_clef = "treble";
var loop_cf;
/*var real = new Float32Array([0,
                             0.00001,
                             0.0001,
                             0.00001,
                             0.0001,
                             0.00001,
                             0.0001,
                             0.000001,
                             0.0001,
                             0.000001,
                             0.0001,
                             0.0001,
                             0.000001,
                             0.00001,
                             0.00001
                            ]);*/
/*var real = new Float32Array([0,
                             0.001,
                             0.0001,
                             0.00001,
                             0.000001,
                             0.0000001,
                             0.00000001,
                             0.000000001,
                             0.0000000001,
                             0.00000000001,
                             0.000000000001,
                             0.0000000000001,
                             0.00000000000001,
                             0.000000000000001,
                             0.0000000000000001,
                             0.00000000000000001,
                             0.000000000000000001,
                             0.0000000000000000001,
                             0.00000000000000000001,
                             0.000000000000000000001
                            ]);*/
var real = new Float32Array([0,
0.00141253754462275,
0.00446683592150963,
0.00112201845430196,
0.00398107170553497,
0.001,
0.00199526231496888,
0.000316227766016838,
0.00446683592150963,
0.000177827941003892,
0.00199526231496888,
0,
0.00281838293126445,
0,
0.000199526231496888,
0,
0,
0,
0.000125892541179417,
0,
0.00199526231496888,
0,
0.0000630957344480192,
0,
0.000630957344480193,
0,
0.0000794328234724281,
0,
0.0001,
0,
0.000158489319246111,
0,
0.000251188643150958,
0,
0.0000354813389233575,
0,
0.0000794328234724281,
0,
0.0000223872113856834,
0,
0.000112201845430196,
0,
0.0000251188643150958,
0,
0.0000446683592150963,
0,
0,
0,
0.0000891250938133745,
0,
0.0000281838293126445,
0,
0.0000199526231496888,
0,
0,
0,
0.0000354813389233575,
0,
0,
0,
0.0000223872113856834,
0,
0,
0,
0.0000158489319246111,
                            ]);
var imag = new Float32Array(real.length);
var firebaseConfig = {
    apiKey: "AIzaSyAZPkX0JUaFpx_ukX3zo_jsW6bqEFgcPL0",
    authDomain: "labactam.firebaseapp.com",
    databaseURL: "https://labactam.firebaseio.com",
    projectId: "labactam",
    storageBucket: "labactam.appspot.com",
    messagingSenderId: "820045748028",
    appId: "1:820045748028:web:87804326321a290750f039"
};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function insert_note(event){
  var alter;
  var element = event.target;
  while(element.className != "notespot active")
    element = element.parentNode;
  element.onclick = remove_note;
  var measure = element.parentNode.parentNode.parentNode;
  for (var k=-1; measure=measure.previousElementSibling; k++);
  var notespace = element.parentNode.parentNode;
  for (var i=0; notespace=notespace.previousElementSibling; i++);
  var notespot = element;
  if(is_active_treble())
    for (var j=0; notespot=notespot.nextElementSibling; j++);
  else
    for (var j=0; notespot=notespot.previousElementSibling; j--);
  var index = k*notes_in_measure+i;
  var length = cantus_firmus.length;
  if(altered_notes.includes(j)){
    if(alter_active==0)
      alter = null;
    else if(alter_active==Math.sign(signature))
      alter = 0;
    else
      alter = alter_active;
  }
  else if(alter_active)
    alter = alter_active;
  else
    alter = null;
  if(counterpoint_active){
    counterpoint[index] = {note: j, alter: alter};
    intervals = get_all_intervals(cantus_firmus, counterpoint);
    motions = get_all_motions(cantus_firmus, counterpoint);
    render_stave(counterpoint, is_active_treble());
  }
  else{
    cantus_firmus[index] = {note: j, alter: alter};
    render_stave(cantus_firmus, is_active_treble());
  }
  play_note(j, alter, example_last);
}

function remove_note(event){
  var element = event.target;
  while(element.className != "notespot active")
    element = element.parentNode;
  element.onclick = insert_note;
  var measure = element.parentNode.parentNode.parentNode;
  for (var k=-1; measure=measure.previousElementSibling; k++);
  var notespace = element.parentNode.parentNode;
  for (var i=0; notespace=notespace.previousElementSibling; i++);
  var index = k*notes_in_measure+i;
  if(counterpoint_active){
    counterpoint[index] = null;
    intervals[index] = null;
    if(index>0)
      motions[index-1] = null;
    if(index<cantus_firmus.length-1)
      motions[index] = null;
    render_stave(counterpoint, is_active_treble());
  }
  else{
    cantus_firmus[index] = null;
    while(cantus_firmus[cantus_firmus.length-1]==null && cantus_firmus.length>0) cantus_firmus.pop();
    render_stave(cantus_firmus, is_active_treble());
  }
}

function render_stave(melody, active_treble){
  var measure = document.getElementById("measures");
  var notes_box;
  var note;
  var interval;
  var motion;
  measure = measure.firstElementChild.nextElementSibling;
  for(var i=0; measure; i++){
    var notespace = measure.firstElementChild;
    for(var j=0; notespace; j++){
      var interval;
      var notespot;
      var lyrics;
      var index = i*notes_in_measure+j;
      var increment = 1;
      if(active_treble){
        notes_box = notespace.firstElementChild;
        notespot = notes_box.lastElementChild;
        lyrics = notes_box.nextElementSibling;
      }
      else{
        notes_box = notespace.lastElementChild;
        notespot = notes_box.firstElementChild;
        lyrics = notes_box.previousElementSibling;
        increment = -1;
      }
      for(var k=0; notespot; k+=increment){
        if(melody[i*notes_in_measure+j]==null){
          while(notespot.firstChild) notespot.removeChild(notespot.firstChild);
          notes_box.classList.remove("lineonbottom", "lineontop");
          notes_box.classList.add("noline");
          if(k==7 || k==-5)
            insert_wholerest(notespot);
        }
        else{
          while(notespot.firstChild) notespot.removeChild(notespot.firstChild);
          note = melody[i*notes_in_measure+j];
          if(note.note==k){
            insert_wholenote(notespot, (note.alter==Math.sign(signature) && altered_notes.includes(note.note)) ? null : note.alter);
            if(active_treble ? k==0 : k==-12)
              notespot.parentElement.classList.replace("noline", "lineonbottom");
            else
              notespot.parentElement.classList.replace("lineonbottom", "noline");
            if(active_treble ? k==12 : k==0)
              notespot.parentElement.classList.replace("noline", "lineontop");
            else
              notespot.parentElement.classList.replace("lineontop", "noline");
          }
        }
        if(active_treble) notespot = notespot.previousElementSibling;
        else notespot = notespot.nextElementSibling;
      }
      lyrics = lyrics.firstElementChild.nextElementSibling.firstElementChild;
      interval = intervals[index];
      if(interval)
        lyrics.innerHTML = interval;
      else
        lyrics.innerHTML = "";
      lyrics = lyrics.nextElementSibling;
      motion = motions[index];
      if(motion)
        lyrics.innerHTML = motion;
      else
        lyrics.innerHTML = "";
      notespace = notespace.nextElementSibling;
    }
    measure = measure.nextElementSibling;
  }
}

function is_active_treble(){
  return counterpoint_active ? cf_clef=="bass" : cf_clef=="treble";
}

function insert_wholerest(node){
  var img = document.createElement("img");
  img.src = url_wholerest;
  img.classList.add("wholerest");
  node.append(img);
}

function insert_wholenote(node, alter){
  var img = document.createElement("img");
  img.src = url_wholenote;
  img.classList.add("wholenote");
  node.append(img);
  if(alter!=null){
    img = document.createElement("img");
    img.classList.add("accidental");
    if(alter==1){
      img.src = url_sharp;
      img.classList.add("sharp");
    }else if(alter==-1){
      img.src = url_flat;
      img.classList.add("flat");
    }else{
      img.src = url_natural;
      img.classList.add("natural");
    }
    node.append(img);
  }
}

function add_measures(num){
  for(var i=0; i<num; i++)
    insert_measure();
}

function add_one_measure(){
  if(counterpoint_active)
    update_message_box(-1, messages.cannot_change_length);
  else
    add_measures(1);
}

function insert_measure(){
  var new_measure = document.createElement("div");
  new_measure.classList.add("measure");
  var notespace;
  var notespot;
  var section;
  var sections = ["clef_notes", "lyrics", "bass_notes"];
  for(var i=0; i<notes_in_measure; i++){
    notespace = document.createElement("div");
    notespace.classList.add("notespace");
    for(var s of sections){
      section = document.createElement("div");
      section.classList.add(s);
      if(s!="lyrics"){
        section.classList.add("noline");
        for(var j=0; j<13; j++){
          notespot = document.createElement("div");
          notespot.classList.add("notespot");
          if(j==5)
            insert_wholerest(notespot);
          if(is_active_treble() ? s=="clef_notes" : s=="bass_notes"){
            notespot.classList.add("active");
            notespot.onclick = insert_note;
          }
          section.append(notespot);
        }
      }
      else
        for(var j=0; j<3; j++){
          notespot = document.createElement("div");
          notespot.classList.add("arrow_box");
          if(j==1)
            for(var style of ["interval_box", "motion_box"]){
              notespot.append(document.createElement("div"));
              notespot.lastElementChild.classList.add(style);
            }
          section.append(notespot);
        }
      notespace.append(section);
    }
    new_measure.append(notespace);
  }
  document.getElementById("measures").appendChild(new_measure);
}

function remove_one_measure(){
  remove_measure(1);
}

function remove_measure(int){
  var count = 0;
  var stave = document.getElementById("measures");
  var number = stave.childElementCount - 1;
  if(counterpoint_active)
    update_message_box(-1, messages.cannot_change_length);
  else
    while(number>min_measures && int>count){
      cantus_firmus.splice(-notes_in_measure, notes_in_measure);
      stave.lastElementChild.remove();
      count++;
      number = stave.childElementCount - 1;
    }
}

function play_note(note, alter, duration){
  var pitch = ionian_mode.get(note) + (alter!=null ? alter : altered_notes.includes(note) ? Math.sign(signature) : 0);
  var max_gain = Math.pow(0.98, note)-0.7;
  var ac = new AudioContext();
  var wave = ac.createPeriodicWave(real, imag);
  var osc = ac.createOscillator();
  var g = ac.createGain();
  osc.frequency.setValueAtTime(fundamental_frequency*Math.pow(2, (pitch-9)/12.001), ac.currentTime);
  osc.setPeriodicWave(wave);
  osc.connect(g);
  g.connect(ac.destination);
  g.gain.value = 0;
  osc.start();
  g.gain.setTargetAtTime(max_gain, ac.currentTime, fadeIn);
  g.gain.setTargetAtTime(0, ac.currentTime+duration, fadeOut);
  osc.stop(duration*10);
}

function play_song(){
  is_playing = true;
  var button = document.getElementById("play")
  button.onclick = stop_song;
  button.src = url_stop;
  var i = 0;
  var notes;
  function myLoop(){
    if(is_playing){
      notes = [cantus_firmus[i], counterpoint[i]];
      for(var note of notes)
        if(note)
          play_note(note.note, note.alter, whole_note);
      display_playing_note(i, whole_note);
      i++;
      setTimeout(i < cantus_firmus.length ? myLoop : stop_song, whole_note*1000);
    }
  }
  myLoop();
}

function stop_song(){
  is_playing = false;
  var button = document.getElementById("play")
  button.onclick = play_song;
  button.src = url_play;
}

function display_playing_note(notespace, duration){
  var p = document.getElementById("measures").firstElementChild.nextElementSibling;
  while(Math.floor(notespace/notes_in_measure)){
    p = p.nextElementSibling;
    notespace = notespace - notes_in_measure;
  }
  p = p.firstElementChild;
  while(notespace){
    p = p.nextElementSibling;
    notespace--;
  }
  p.classList.add("playing");
  setTimeout(function(){p.classList.remove("playing")}, duration*1000);
}

function ask_deleting_song(){
  document.getElementById("alert_ok").onclick = delete_song;
  display_alert(messages.delete_all);
}

function delete_song(){
  intervals = [];
  motions = [];
  if(counterpoint_active){
    counterpoint = [];
    render_stave(counterpoint, is_active_treble());
  }
  else{
    cantus_firmus = [];
    render_stave(cantus_firmus, is_active_treble());
  }
  hide_alert();
}

function ask_saving_song(){
  document.getElementById("alert_ok").onclick = save_song;
  display_alert(messages.save);
}

function save_song(){
  var cf_for_saving = new Array();
  var ctp_for_saving = new Array();
  for(var i=0; i<cantus_firmus.length; i++){
    if(cantus_firmus[i]!=null){
      cf_for_saving[i] = cantus_firmus[i];
      if(cantus_firmus[i].alter==null)
        cf_for_saving[i].alter = "null";
    }
    else
      cf_for_saving[i] = -1;
    if(counterpoint[i]!=null){
      ctp_for_saving[i] = counterpoint[i];
      if(counterpoint[i].alter==null)
        ctp_for_saving[i].alter = "null";
    }
    else
      ctp_for_saving[i] = -1;
  }
  db.collection("data").doc("song").set({clef: cf_clef, cf: cf_for_saving, ctp: ctp_for_saving, signature: signature});
  update_message_box(1, messages.save_done);
  hide_alert();
}

function ask_import_song(){
  if(cantus_firmus.length){
    document.getElementById("alert_ok").onclick = import_song;
    display_alert(messages.import);
  }
  else
    import_song();
}

function import_song(){
  var note;
  var importing_cf_clef;
  var measure_exceed = 0;
  var doc = db.collection("data").doc("song").get()
    .then(doc => {
      cantus_firmus = [];
      counterpoint = [];
      importing_cf_clef = doc.data().clef;
      signature = doc.data().signature;
      display_key_signature(signature);
      change_key_signature();
      note = doc.data().cf;      
      for(var i=0; i<note.length; i++){
        if(note[i]!=-1){
          cantus_firmus[i] = note[i];
          if(note[i].alter=="null")
            cantus_firmus[i].alter = null;
        }
        else
          cantus_firmus[i] = null;
      }
      measure_exceed = document.getElementById("measures").childElementCount-cantus_firmus.length-1;
      if(measure_exceed > 0)
        remove_measure(measure_exceed);
      else
        add_measures(-measure_exceed); 
      note = doc.data().ctp;
      for(var i=0; i<note.length; i++){
        if(note[i]!=-1){
          counterpoint[i] = note[i];
          if(note[i].alter=="null")
            counterpoint[i].alter = null;
        }
        else
          counterpoint[i] = null;
      }
      render_stave(cantus_firmus, importing_cf_clef=="treble");
      if(counterpoint.length){
        intervals = get_all_intervals(cantus_firmus, counterpoint);
        motions = get_all_motions(cantus_firmus, counterpoint);
        render_stave(counterpoint, importing_cf_clef!="treble");
        if(!counterpoint_active){
          activate_counterpoint();
          if(cf_clef!=importing_cf_clef){
            cf_clef = importing_cf_clef;
            update_cf_clef_button();
          }
          else
            swap_active_clef();
        }
      }
      else
        if(counterpoint_active){
          deactivate_counterpoint();
          if(cf_clef==importing_cf_clef)
            swap_active_clef();
          else
            update_cf_clef_button();
        }
      update_message_box(1, messages.import_done);
    })
    .catch(err => {
      update_message_box(-1, messages.import_error);
    });
  hide_alert();
}

function set_sharp(){
  unset_flat();
  var button = document.getElementById("sharp");
  button.classList.add("active");
  button.onclick = unset_sharp;
  alter_active = 1;
}

function unset_sharp(){
  var button = document.getElementById("sharp");
  button.classList.remove("active");
  button.onclick = set_sharp;
  alter_active = 0;
}

function set_flat(){
  unset_sharp();
  var button = document.getElementById("flat");
  button.classList.add("active");
  button.onclick = unset_flat;
  alter_active = -1;
}

function unset_flat(){
  var button = document.getElementById("flat");
  button.classList.remove("active");
  button.onclick = set_flat;
  alter_active = 0;
}

function check_song(){
  if(counterpoint_active)
    find_errors_on_counterpoint();
  else
    find_errors_on_cantus_firmus();
  notify_errors(0);
}

function find_errors_on_counterpoint(){
  errors = [];
  var pointers = has_pauses(counterpoint);
  if(pointers.length)
    errors.push({type: "pauses", positions: pointers});
  else{
    pointers = has_dissonances(intervals);
    if(pointers.length)
      errors.push({type: "harmonic_dissonances", positions: pointers});
    pointers = has_unison_in_middle(intervals);
    if(pointers.length)
      errors.push({type: "unisons", positions: pointers});
    pointers = has_too_many_leaps(counterpoint);
    if(pointers.length)
      errors.push({type: "leaps", positions: pointers});
    pointers = has_not_contrary_before_perfects(intervals, motions);
    if(pointers.length)
      errors.push({type: "contrary", positions: pointers});
    pointers = has_repeated_notes(cantus_firmus);
    if(pointers.length)
      errors.push({type: "repeat", positions: pointers});
    pointers = has_consecutive_fifths_or_octaves(intervals);
    if(pointers.length)
      errors.push({type: "parallel", positions: pointers});
    pointers = has_too_many_parallels(intervals);
    if(pointers.length)
      errors.push({type: "parallels", positions: pointers});
    pointers = has_forbidden_chromaticisms(counterpoint);
    if(pointers.length)
      errors.push({type: "chromaticisms2", positions: pointers});
    pointers = has_correct_start(intervals);
    if(pointers.length)
      errors.push({type: "start", positions: pointers});
    pointers = has_correct_end(intervals, counterpoint);
    if(pointers.length)
      errors.push({type: "end", positions: pointers});
        pointers = has_dissonant_interval(counterpoint);
    if(pointers.length)
      errors.push({type: "dissonances", positions: pointers});
    pointers = has_legit_leaps(counterpoint);
    if(pointers.length)
      errors.push({type: "leaps2", positions: pointers});
    pointers = has_legit_double_leaps(counterpoint);
    if(pointers.length)
      errors.push({type: "double", positions: pointers});
    pointers = has_overrange(cantus_firmus, counterpoint);
    if(pointers.length)
      errors.push({type: "far", positions: pointers});
    pointers = overrange(counterpoint);
    if(pointers.length)
      errors.push({type: "overrange", positions: pointers});
  }
}

function find_errors_on_cantus_firmus(){
  errors = [];
  var pointers = has_pauses(cantus_firmus);
  if(pointers.length)
    errors.push({type: "pauses", positions: pointers});
  pointers = [];
  if(cantus_firmus==null || cantus_firmus.length<3)
    errors.push({type: "too_short", positions: pointers});
  else{
    pointers = has_chromaticism(cantus_firmus);
    if(pointers.length)
      errors.push({type: "chromaticisms", positions: pointers});
    pointers = begins_and_end_on_tonic(cantus_firmus);
    if(pointers.length)
      errors.push({type: "tonic", positions: pointers});
    pointers = ends_with_clausula_vera(cantus_firmus);
    if(pointers.length)
      errors.push({type: "clausula", positions: pointers});
    pointers = has_repeated_notes(cantus_firmus);
    if(pointers.length)
      errors.push({type: "repeat", positions: pointers});
    pointers = is_little_variety(cantus_firmus);
    if(pointers.length)
      errors.push({type: "various", positions: pointers});
    pointers = overrange(cantus_firmus);
    if(pointers.length)
      errors.push({type: "overrange", positions: pointers});
    pointers = has_too_many_leaps(cantus_firmus);
    if(pointers.length)
      errors.push({type: "leaps", positions: pointers});
    pointers = has_dissonant_interval(cantus_firmus);
    if(pointers.length)
      errors.push({type: "dissonances", positions: pointers});
    pointers = has_legit_leaps(cantus_firmus);
    if(pointers.length)
      errors.push({type: "leaps2", positions: pointers});
    pointers = single_leaps_are_framed_by_contrary_motion_when_requested(cantus_firmus);
    if(pointers.length)
      errors.push({type: "contrary1", positions: pointers});
    pointers = has_legit_double_leaps(cantus_firmus);
    if(pointers.length)
      errors.push({type: "double", positions: pointers});
    pointers = double_leaps_are_framed_by_contrary_motion(cantus_firmus);
    if(pointers.length)
      errors.push({type: "contrary2", positions: pointers});
    pointers = has_multiple_climax(cantus_firmus);
    if(pointers.length)
      errors.push({type: "climax", positions: pointers});
  }
}

function notify_errors(number){
  var text = "";
  var type = 0;
  var next_button = document.getElementById("next_error");
  display_pointers([]);
  if(!errors.length){
    type = 1;
    text = messages.well_done;
    next_button.style.display = "none";
  }
  else if(errors[number]){
    type = -1;
    display_pointers(errors[number].positions);
    text = messages.error + (number+1) + messages.of + errors.length + messages.colon + texts.get(errors[number].type);
    next_button.style.display = "inline-block";
    next_button.onclick = function(){notify_errors(number+1);};
  }
  update_message_box(type, text);
}

function update_message_box(type, text){
  var message_box = document.getElementById("messages");
  var text_box = document.getElementById("text");
  if(text.length){
    text_box.innerHTML = text;
    message_box.removeAttribute("style");
    if(type<0)
      message_box.setAttribute("style", "background: rgba(255, 153, 153, 0.8)");
    else if(type>0)
      message_box.setAttribute("style", "background: rgba(153, 255, 153, 0.8)");
  }
  else{
    message_box.style.display = "none";
    document.getElementById("next_error").style.display = "none";
  }
}

function display_alert(text){
  document.getElementById("hide_all").style.display = "block";
  document.getElementById("alert_text").innerHTML = text;
}

function hide_alert(){
  document.getElementById("hide_all").style.display = "none";
}

function display_pointers(positions){
  var pos = 0;
  var measure = document.getElementById("measures").firstElementChild.nextElementSibling;
  var lyrics_box;
  var pointer_box;
  var on_treble = is_active_treble();
  var url_arrow;
  if(on_treble)
    url_arrow = url_arrow_top;
  else
    url_arrow = url_arrow_down;
  for(var i=0; measure; i++){
    var notespace = measure.firstElementChild;
    for(var j=0; notespace; j++){
      lyrics_box = notespace.firstElementChild.nextElementSibling;
      if(on_treble)
        pointer_box = lyrics_box.firstElementChild;
      else
        pointer_box = lyrics_box.lastElementChild;
      while(pointer_box.firstChild) pointer_box.removeChild(pointer_box.firstChild);
      if(positions.includes(i*notes_in_measure+j)){
        var img = document.createElement("img");
        img.src = url_arrow;
        img.classList.add("arrow");
        pointer_box.append(img);
        pos++;
      }
      notespace = notespace.nextElementSibling;
    }
    measure = measure.nextElementSibling;
  }
}

function has_pauses(cantus_firmus){
  var positions = new Array();
  for(var i=0; i<cantus_firmus.length; i++)
    if(cantus_firmus[i]==null)
      positions.push(i);
  return positions;
}

function has_chromaticism(cantus_firmus){
  var positions = new Array();
  for(var i=0; i<cantus_firmus.length; i++)
    if(cantus_firmus[i].alter!=null)
      positions.push(i);
  return positions;
}

function begins_and_end_on_tonic(cantus_firmus){
  var last_index = cantus_firmus.length-1;
  var first_note = cantus_firmus[0].note;
  var last_note = cantus_firmus[last_index].note;
  if(are_tonic_notes(first_note, last_note))
    return [];
  return [0, last_index];
}

function are_tonic_notes(one, two){
  var tonics = [0,5].map(n => get_standardised_note(n + get_note_of_ionian_grade(0)));
  if(tonics.includes(get_standardised_note(one)) && are_the_same_note(one, two))
    return true;
  return false
}

function are_the_same_note(one, two){
  return (two-one)%7==0;
}

function get_note_of_ionian_grade(grade){
  return ((signature+7)*4+grade)%7;
}

function get_standardised_note(note){
  return (note+14)%7;
}

function ends_with_clausula_vera(cantus_firmus){
  var length = cantus_firmus.length;
  var last = length-1;
  var penultimate = length-2;
  if(length<2)
    return [0];
  if(cantus_firmus[last].note==(cantus_firmus[penultimate].note-1))
    return [];
  return [penultimate, last];
}

function has_repeated_notes(cantus_firmus){
  var positions = new Array();
  for(var i=0; i<cantus_firmus.length-1; i++)
    if(cantus_firmus[i].note==cantus_firmus[i+1].note)
      positions.push(i, i+1);
  return positions;
}

function is_little_variety(cantus_firmus){
  var positions = new Array();
  var note_occurences = new Array(13).fill(0);
  for(var i=1; i<cantus_firmus.length; i++) //first note is excluded because is equal to the last
    note_occurences[cantus_firmus[i].note]++;
  for(var j=0; j<note_occurences.length; j++)
    if(note_occurences[j]>=cantus_firmus.length/2)
      for(var i=1; i<cantus_firmus.length; i++)
        if(cantus_firmus[i].note==j)
          positions.push(i);
  return positions;
}

function has_range_too_large(cantus_firmus){
  var tuple = overrange(cantus_firmus);
  if(tuple.length)
    return Math.abs(cantus_firmus[tuple[0]].note-cantus_firmus[tuple[1]].note);
  return 0;
}

function overrange(cantus_firmus){
  var min_pos = 0;
  var max_pos = 0;
  var note;
  var min = cantus_firmus[0].note;
  var max = cantus_firmus[0].note;
  for(var i=1; i<cantus_firmus.length; i++){
    note = cantus_firmus[i].note;
    if(note<min){
      min = note;
      min_pos = i;
    }
    else if(note>max){
      max = note;
      max_pos = i;
    }
  }
  if(exceed_range_limit(max,min))
    return [min_pos, max_pos];
  return [];
}

function exceed_range_limit(a, b){
  return Math.abs(a-b)>range_limit;
}

function has_too_many_leaps(cantus_firmus){
  var length = cantus_firmus.length;
  var count = 0;
  var leaps = spot_leaps(cantus_firmus);
  for(var i=0; i<leaps.length-1; i++)
    if(leaps[i]==leaps[i+1]-1)
      count++;
  if(count>(length/2))
    return leaps;
  return [];
}

function spot_leaps(cantus_firmus){
  var positions = new Array();
  var leaps = 0;
  var prev, next;
  var length = cantus_firmus.length;
  for(var i=0; i<length-1; i++){
    prev = cantus_firmus[i].note;
    next = cantus_firmus[i+1].note;
    if(Math.abs(prev-next)>1)
      positions.push(i, i+1);
  }
  return positions;
}

function has_dissonant_interval(cantus_firmus){
  var positions = new Array();
  var prev, next;
  for(var i=0; i<cantus_firmus.length-1; i++){
    prev = cantus_firmus[i].note;
    next = cantus_firmus[i+1].note;
    if(Math.abs(prev-next)>7) //intervalli oltre l'ottava
      positions.push(i, i+1);
    if(is_tritone(prev, next))
      positions.push(i, i+1);
    if(Math.abs(prev-next)==6) //settime
      positions.push(i, i+1);
  }
  return positions;
}

function is_tritone(prev, next){
  var subtonic = get_note_of_ionian_grade(6);
  if(get_standardised_note(next)==subtonic && (next-prev==3 || prev-next==4))
    return true;
  if(get_standardised_note(prev)==subtonic && (prev-next==3 || next-prev==4))
    return true;
  return false;
}

function has_legit_leaps(cantus_firmus){
  var positions = new Array();
  var prev, next, interval;
  for(var i=0; i<cantus_firmus.length-1; i++){
    prev = cantus_firmus[i].note;
    next = cantus_firmus[i+1].note;
    interval = Math.abs(prev-next);
    if(cantus_firmus[i+1].alter!=null && interval>2) //se è un intervallo sopra la terza
      positions.push(i, i+1);
    else if(interval>4) //se è un intervallo sopra la quinta
      if(!is_octave(prev, next) && !is_ascending_minor_sixth(prev, next))
        positions.push(i, i+1);
  }
  return positions;
}

function is_octave(prev, next){
  return prev==next+7 || prev==next-7;
}

function is_ascending_minor_sixth(prev, next){
  var first = get_standardised_note(prev);
    return next==prev+5 && (first==get_note_of_ionian_grade(2) || first==get_note_of_ionian_grade(5) || first==get_note_of_ionian_grade(6));
}

function single_leaps_are_framed_by_contrary_motion_when_requested(cantus_firmus){
  var positions = new Array();
  var prev, first, second, next;
  var length = cantus_firmus.length;
  if(length>=3){
    for(var i=0; i<length-1; i++){
      if(i) prev = cantus_firmus[i-1].note; else prev = null;
      first = cantus_firmus[i].note;
      second = cantus_firmus[i+1].note;
      if(i<length-2) next = cantus_firmus[i+2].note; else next = null;
      if((is_octave(first, second) || is_ascending_minor_sixth(first, second)) && !(motion_is_inverted(prev, first, second) && motion_is_inverted(first, second, next)))
        positions.push(i-1, i+2);
    }
  }
  return positions;
}

function motion_is_inverted(first, second, third){
  if(first==null || third==null)
    return true;
  return first>second && second<third || first<second && second>third;
}

function has_legit_double_leaps(cantus_firmus){
  var positions = new Array();
  var first, mid, last;
  for(var i=0; i<cantus_firmus.length-2; i++){
    first = cantus_firmus[i].note;
    mid = cantus_firmus[i+1].note;
    last = cantus_firmus[i+2].note;
    if((first+1<mid && mid+1<last) || (first-1>mid && mid-1>last)){ //se sono due salti consecutivi
      if(first>last) last = [first, first = last][0]; //ordine crescente
      if(!matches_pattern(first, mid, last, 4, 3) && !matches_pattern(first, mid, last, 2, 3) && !(matches_pattern(first, mid, last, 2, 2) && get_standardised_note(mid)!=get_note_of_ionian_grade(1)))
        positions.push(i, i+1, i+2);
    }
  }
  return positions;
}

function matches_pattern(first, mid, last, bottom, top){
  return mid-first==bottom && last-mid==top;
}

function double_leaps_are_framed_by_contrary_motion(cantus_firmus){
  var positions = new Array();
  var prev, first, second, third, next;
  var length = cantus_firmus.length;
  if(length>=4)
    for(var i=0; i<length-2; i++){
      if(i) prev = cantus_firmus[i-1].note; else prev = null;
      first = cantus_firmus[i].note;
      second = cantus_firmus[i+1].note;
      third = cantus_firmus[i+2].note;
      if(i<length-3) next = cantus_firmus[i+3].note; else next = null;
      if((first+1<second && second+1<third) || (first-1>second && second-1>third)){ //se sono due salti consecutivi
        if(!motion_is_inverted(prev, first, second) || !motion_is_inverted(second, third, next))
          positions.push(i-1, i+3);
      }
    }
  return positions;
}
  
function has_multiple_climax(cantus_firmus){
  var positions = new Array();
  var distance;
  var climax = 0;
  var occurrences = 0;
  for(var i=1; i<cantus_firmus.length; i++){
    distance = Math.abs(cantus_firmus[0].note-cantus_firmus[i].note);
    if(distance==climax)
      positions.push(i);
    else if(distance>climax){
      climax = distance;
      positions = [];
      positions.push(i);
    }
  }
  if(positions.length>1)
    return positions;
  return [];
}

function correct_song(){
  errors = [];
  display_pointers([]);
  document.getElementById("next_error").style.display = "none";
  if(counterpoint_active)
    correct_counterpoint();
  else
    correct_cantus_firmus();
}

function correct_cantus_firmus(){
  var button = document.getElementById("correct");
  button.classList.add("active");
  button.onclick = stop_correction;
  var found = false;
  var length = cantus_firmus.length;
  var attempt = 20000;
  var candidate = copy_cf(cantus_firmus);
  var errors;
  var random;
  var cantus_firmi = new Array();
  var cantus_firmi_length;
  var population = 20; 
  var max_note = 12;
  var min_note = 0;
  var random_correction = 1;
  if(cf_clef=="bass"){
    max_note = 0;
    min_note = -12;
    random_correction = -1;
  }
  if(length<3){
    update_message_box(-1, messages.too_short);
    reset_correction();
    return 0;
  }
  if(has_pauses(cantus_firmus).length){
    update_message_box(-1, messages.pauses);
    reset_correction();
    return 0;
  }
  update_message_box(0, messages.correcting);
  for(var i=0; i<length; i++) //eliminate all accidentals
    candidate[i].alter = null;
  fix_extremes(candidate, max_note, min_note);
  errors = evaluate(candidate);
  cantus_firmi.push({mark: errors, cantus: candidate});
  if(errors==0)
    found=true;
  loop_cf = setInterval(function(){
    if(attempt<=0 || found){
      clearInterval(loop_cf);
      found=false;
      close_correction(attempt, cantus_firmi[0].cantus);
    }else{
      cantus_firmi_length = cantus_firmi.length;
      for(var i=0; i<cantus_firmi_length && !found && attempt>0; i++){
      for(var j=1; j<length-2 && !found && attempt>0; j++){
        candidate = copy_cf(cantus_firmi[i].cantus);
        if(candidate[j].note<max_note && candidate[j].note<candidate[j-1].note+4 && candidate[j].note<candidate[j+1].note+4){
          candidate[j].note++;
          random = Math.random();
          if(candidate[j].note<max_note-1 && random<0.5)
            candidate[j].note++;
          if(candidate[j].note<max_note-2 && random<0.2)
            candidate[j].note++;
          //if(random<0.1)
          if(Math.abs(candidate[j].note-candidate[j-1].note)>5 || Math.abs(candidate[j].note-candidate[j+1].note)>5)
            candidate[j].note=Math.round(Math.random()*12*random_correction);
          errors = evaluate(candidate);
          if(errors==0)
            found=true;
          cantus_firmi.push({mark: errors, cantus: candidate});
          attempt--;
        }
        candidate = copy_cf(cantus_firmi[i].cantus);
        if(candidate[j].note>min_note && candidate[j].note>candidate[j-1].note-4 && candidate[j].note>candidate[j+1].note-4){
          candidate[j].note--;
          random = Math.random();
          if(candidate[j].note>min_note+1 && random<0.5)
            candidate[j].note--;
          if(candidate[j].note>min_note+2 && random<0.2)
            candidate[j].note--;
          //if(random<0.1)
          if(Math.abs(candidate[j].note-candidate[j-1].note)>5 || Math.abs(candidate[j].note-candidate[j+1].note)>5)
            candidate[j].note=Math.round(Math.random()*12*random_correction);
          errors = evaluate(candidate);
          if(errors==0)
            found=true;
          cantus_firmi.push({mark: errors, cantus: candidate});
          attempt--;
        }        
      }
    }
      cantus_firmi.sort((a,b) => a.mark - b.mark);
      if(cantus_firmi.length>population)
        cantus_firmi = cantus_firmi.slice(0, population);
      console.log(cantus_firmi[0].cantus.map(a => a.note) + " score: " + cantus_firmi[0].mark + " tentativi: " + (20000-attempt));
      cantus_firmus=cantus_firmi[0].cantus;
        render_stave(cantus_firmus, is_active_treble());
  }
  }, correction_pause);
}

function correct_counterpoint(){
  var button = document.getElementById("correct");
  button.classList.add("active");
  button.onclick = stop_correction;
  var found = false;
  var length = counterpoint.length;
  var attempt = 20000;
  var candidate = copy_cf(counterpoint);
  var candidate_intervals;
  var candidate_motions;
  var errors;
  var random;
  var counterpoints = new Array();
  var counterpoints_length;
  var population = 20; 
  var max_note = 12;
  var min_note = 0;
  var random_correction = 1;
  if(cf_clef=="treble"){
    max_note = 0;
    min_note = -12;
    random_correction = -1;
  }
  if(has_pauses(counterpoint).length){
    update_message_box(-1, messages.pauses);
    reset_correction();
    return 0;
  }
  update_message_box(0, messages.correcting);
  for(var i=0; i<length; i++) //eliminate all chromaticisms
    candidate[i].alter = null;
  fix_extremes_counterpoint(candidate);
  candidate_intervals = get_all_intervals(cantus_firmus, candidate);
  candidate_motions = get_all_motions(cantus_firmus, candidate);
  errors = evaluate_counterpoint(candidate, candidate_intervals, candidate_motions);
  counterpoints.push({mark: errors, cantus: candidate, intervals: candidate_intervals, motions: candidate_motions});
  if(errors==0)
    found=true;
  loop_cf = setInterval(function(){
    if(attempt<=0 || found){
      clearInterval(loop_cf);
      found = false;
      close_correction(attempt, counterpoints[0].cantus);
    }else{
    counterpoints_length = counterpoints.length;
    for(var i=0; i<counterpoints_length && !found && attempt>0; i++){
      for(var j=1; j<length-2 && !found && attempt>0; j++){
        candidate = copy_cf(counterpoints[i].cantus);
        if(candidate[j].note<max_note){
          candidate[j].note++;
          random = Math.random();
          if(candidate[j].note<max_note-1 && random<0.5)
            candidate[j].note++;
          if(candidate[j].note<max_note-2 && random<0.2)
            candidate[j].note++;
          if(random<0.1)
            candidate[j].note=Math.round(Math.random()*12*random_correction);
          candidate_intervals = get_all_intervals(cantus_firmus, candidate);
          candidate_motions = get_all_motions(cantus_firmus, candidate);
          errors = evaluate_counterpoint(candidate, candidate_intervals, candidate_motions);
          if(errors==0)
            found = true;
          counterpoints.push({mark: errors, cantus: candidate, intervals: candidate_intervals, motions: candidate_motions});
          attempt--;
        }
        candidate = copy_cf(counterpoints[i].cantus);
        if(candidate[j].note>min_note){
          candidate[j].note--;
          random = Math.random();
          if(candidate[j].note>min_note+1 && random<0.5)
            candidate[j].note--;
          if(candidate[j].note>min_note+2 && random<0.2)
            candidate[j].note--;
          if(random<0.1)
            candidate[j].note=Math.round(Math.random()*12*random_correction);
          candidate_intervals = get_all_intervals(cantus_firmus, candidate);
          candidate_motions = get_all_motions(cantus_firmus, candidate);
          errors = evaluate_counterpoint(candidate, candidate_intervals, candidate_motions);
          if(errors==0)
            found = true;
          counterpoints.push({mark: errors, cantus: candidate, intervals: candidate_intervals, motions: candidate_motions});
          attempt--;
        }        
      }
    }
    counterpoints.sort((a,b) => a.mark - b.mark);
    if(counterpoints.length>population)
      counterpoints = counterpoints.slice(0, population);
    console.log(counterpoints[0].cantus.map(a => a.note) + " score: " + counterpoints[0].mark + " tentativi: " + (20000-attempt));
    counterpoint = counterpoints[0].cantus;
    intervals = counterpoints[0].intervals;
    motions = counterpoints[0].motions;
    render_stave(counterpoint, is_active_treble());
  }
  }, correction_pause);
}

function has_dissonances(intervals){
  var positions = new Array();
  var subtonic, interval;
  for(var i=0; i<cantus_firmus.length; i++){
    subtonic = get_note_of_ionian_grade(6);
    interval = intervals[i];
    if(interval==5){
      if(get_standardised_note(cantus_firmus[i].note)==subtonic || get_standardised_note(counterpoint[i].note)==subtonic)
        positions.push(i);
    }
    else if(interval==2 || interval==4 || interval==7)
      positions.push(i);
  }
  return positions;
}

function has_unison_in_middle(intervals){
  var positions = new Array();
  var length = cantus_firmus.length;
  for(var i=0; i<length; i++)
    if(intervals[i]==1 && i!=0 && i!=length-1)
      positions.push(i);
  return positions;
}

function has_not_contrary_before_perfects(intervals, motions){
  var positions = new Array();
  var length = cantus_firmus.length;
  var interval;
  for(var i=1; i<length; i++){ //first note is ignored
    interval = intervals[i];
    if(interval==1 && motions[i-1]!="C")
      positions.push(i);
    if(interval==5)
      if(motions[i-1]!="C" && !is_horn_fifth(i))
        positions.push(i);
    if(interval==8)
      if(motions[i-1]!="C" && !is_horn_octave(i))
        positions.push(i);
  }
  return positions;
}

function has_consecutive_fifths_or_octaves(intervals){
  var positions = new Array();
  for(var i=0; i<intervals.length-1; i++){
    if((intervals[i]==5 || intervals[i]==8) && intervals[i]==intervals[i+1])
      positions.push(i, i+1);
    if(Math.abs(intervals[i]-intervals[i+1])==7)
      positions.push(i, i+1);
  }
  return positions;
}

function has_too_many_parallels(intervals){
  var positions = new Array();
  var count = 0;
  for(var i=0; i<intervals.length-3; i++){
    count = 0;
    if(intervals[i]==3 || intervals[i]==6)
      while(intervals[i]==intervals[i+1]){
        i++;
        count++;
        if(count>=3)
          positions.push(i);
      }
  }
  return positions;
}

function has_forbidden_chromaticisms(counterpoint){
  var positions = new Array();
  for(var i=0; i<counterpoint.length; i++)
    if(counterpoint[i].alter){
      if(i!=counterpoint.length-2)
        positions.push(i);
      else
        if(get_standardised_note(counterpoint[i].note)!=get_note_of_ionian_grade(4) || counterpoint[i].alter!=1)
          positions.push(i);
    }
  return positions;
}

function has_correct_start(intervals){
  var first_interval = intervals[0];
  if(first_interval==1 || first_interval==8)
    return [];
  if(first_interval==5 && cf_clef=="bass")
    return [];
  return [0];
}

function has_correct_end(intervals, counterpoint){
  var positions = new Array();
  var last = counterpoint.length - 1;
  var penultimate = last - 1;
  if(intervals[last]!=1 && intervals[last]!=8 || exceed_range_limit(counterpoint[0].note, counterpoint[last].note) || is_overrange(counterpoint[last].note, cantus_firmus[last].note))
    positions.push(last);
  if(counterpoint[penultimate].note+1!=counterpoint[last].note || exceed_range_limit(counterpoint[0].note, counterpoint[penultimate].note) || is_overrange(counterpoint[penultimate].note, cantus_firmus[penultimate].note))
    positions.push(penultimate);
  return positions;
}

function is_horn_fifth(index){
  var higher_voice, lower_voice, high_prev, high_next, low_prev;
  if(cf_clef=="treble"){
    higher_voice = cantus_firmus;
    lower_voice = counterpoint;
  }
  else{
    higher_voice = counterpoint;
    lower_voice = cantus_firmus;
  }
  high_prev = higher_voice[index-1].note;
  high_next = higher_voice[index].note;
  low_prev = lower_voice[index-1].note;
  if(intervals[index-1]==3 && high_prev==high_next+1 && are_the_same_note(cantus_firmus[0].note, low_prev))
    return true;
  if((intervals[index-1]==6 || intervals[index-1]==8) && high_prev+1==high_next && are_the_same_note(cantus_firmus[0].note, high_prev))
    return true;
  return false;
}

function is_horn_octave(index){
  var higher_voice, lower_voice, high_prev, high_next, low_next;
  if(cf_clef=="treble"){
    higher_voice = cantus_firmus;
    lower_voice = counterpoint;
  }
  else{
    higher_voice = counterpoint;
    lower_voice = cantus_firmus;
  }
  high_prev = higher_voice[index-1].note;
  high_next = higher_voice[index].note;
  low_next = lower_voice[index].note;
  if(intervals[index-1]==5 && high_prev==high_next+1 && are_the_same_note(cantus_firmus[0].note, low_next))
    return true;
  return false;
}

function has_overrange(cantus, counter){
  var positions = new Array();
  for(var i=0; i<cantus.length; i++)
    if(is_overrange(cantus[i].note, counter[i].note))
      positions.push(i);
  return positions;
}

function is_overrange(cf_note, ctp_note){
  return Math.abs(cf_note-ctp_note)>range_limit+7;
}

function get_interval(high, low){
  if(low>high)
    return (low-high-1)%7+2;
  return (high-low-1)%7+2;
}

function get_all_intervals(cantus_firmus, counterpoint){
  var intervals = new Array();
  for(var i=0; i<cantus_firmus.length; i++)
    if(counterpoint[i]!=null)
      intervals[i] = get_interval(counterpoint[i].note, cantus_firmus[i].note);
  return intervals;
}

function get_all_motions(cantus_firmus, counterpoint){
  var motions = new Array();
  for(var i=1; i<cantus_firmus.length; i++)
    if(counterpoint[i]!=null && counterpoint[i-1]!=null)
      motions[i-1] = get_motion(counterpoint[i-1].note, counterpoint[i].note, cantus_firmus[i-1].note, cantus_firmus[i].note);
  return motions;
}

function get_motion(ctp_prev, ctp_next, cf_prev, cf_next){
  if(ctp_prev==null || ctp_next==null || cf_prev==null || cf_next==null)
    return null;
  if(ctp_prev==ctp_next) //cf cannot have repeated notes
    return "O";
  if(ctp_prev<ctp_next && cf_prev>cf_next || ctp_prev>ctp_next && cf_prev<cf_next)
    return "C";
  if(ctp_prev-ctp_next==cf_prev-cf_next)
    return "P";
  return "S";
}

function close_correction(attempt, cantus){
  var text = "";
  reset_correction();
  if(attempt<=0)
    update_message_box(-1, messages.too_hard);
  else{
    if(counterpoint_active){
      counterpoint = copy_cf(cantus);
      text = messages.fixed_counterpoint;
      render_stave(counterpoint, is_active_treble());
    }
    else{
      cantus_firmus = copy_cf(cantus);
      text = messages.fixed_cantusfirmus;
      render_stave(cantus_firmus, is_active_treble());
    }
    update_message_box(+1, text);
  }
}

function stop_correction(){
  clearInterval(loop_cf);
  update_message_box(-1, messages.interrupted);
  reset_correction();
}

function reset_correction(){
  var button = document.getElementById("correct");
  button.classList.remove("active");
  button.onclick = correct_song;
}

function copy_cf(cantus_firmus){
  var copy = new Array();
  for(var i=0; i<cantus_firmus.length; i++)
    copy[i] = Object.assign({}, cantus_firmus[i])
  return copy;
}

function fix_extremes(cantus, max, min){
  var configurations = new Array();
  var first = cantus[0].note;
  var last = cantus[cantus.length-1].note;
  for(var i=min; i<=max; i++)
    for(var j=min; j<max; j++) //last note cannot be the highest due to clausula vera
      if(are_tonic_notes(i, j))
        configurations.push({distance: Math.abs(first-i)+Math.abs(last-j), first: i, last: j});
  configurations.sort((a,b) => a.distance - b.distance);
  cantus[0].note=configurations[0].first;
  cantus[cantus.length-1].note=configurations[0].last;
  if(ends_with_clausula_vera(cantus).length)
    cantus[cantus.length-2].note=cantus[cantus.length-1].note+1;
}

function fix_extremes_counterpoint(counterpoint){
  var intervals = get_all_intervals(cantus_firmus, counterpoint);
  var errors = has_correct_start(intervals).length + is_overrange(cantus_firmus[0].note, counterpoint[0].note);
  var change = 0;
  var length = counterpoint.length;
  var max_note = cantus_firmus[0].note + 7 + range_limit;
  var min_note = 0;
  if(cf_clef=="treble"){
    max_note = 0;
    min_note = cantus_firmus[0].note - 7 - range_limit;
  }
  while(errors && change<26){
    if(change>0) change++;
    else change--;
    change = -change;
    counterpoint[0].note += change;
    if(counterpoint[0].note>=min_note && counterpoint[0].note<=max_note){
      intervals = get_all_intervals(cantus_firmus, counterpoint);
      errors = has_correct_start(intervals).length;
    }
    else
      errors = 1;
  }
  change = 0;
  counterpoint[length-2].note = counterpoint[length-1].note-1;
  intervals = get_all_intervals(cantus_firmus, counterpoint);
  errors = has_correct_end(intervals, counterpoint).length;
  while(errors && change<26){
    if(change>0) change++;
    else change--;
    change = -change;
    counterpoint[length-1].note += change;
    if(counterpoint[length-1].note>min_note && counterpoint[length-1].note<=max_note){ //non può essere la nota più bassa a causa della cv
      counterpoint[length-2].note = counterpoint[length-1].note-1;
      intervals = get_all_intervals(cantus_firmus, counterpoint);
      errors = has_correct_end(intervals, counterpoint).length;
    }
    else
      errors = 1;
  }
  if(get_standardised_note(counterpoint[length-2].note)==get_note_of_ionian_grade(4)){
    if(altered_notes.includes(counterpoint[length-2].note)){
      if(signature<0)
        counterpoint[length-2].alter = 0;
    }
    else{
      if(counterpoint[length-2].alter!=null)
        counterpoint[length-2].alter++;
      else
        counterpoint[length-2].alter = 1;
    }
  }
  render_stave(counterpoint, is_active_treble());
}

function evaluate(cantus_firmus){
  var errors = 0;
  errors += has_repeated_notes(cantus_firmus).length;
  if(is_little_variety(cantus_firmus).length) errors++;
  errors += has_range_too_large(cantus_firmus);
  errors += has_too_many_leaps(cantus_firmus).length;
  if(has_dissonant_interval(cantus_firmus).length) errors++;
  if(has_legit_leaps(cantus_firmus).length) errors++;
  errors += single_leaps_are_framed_by_contrary_motion_when_requested(cantus_firmus).length;
  errors += has_legit_double_leaps(cantus_firmus).length;
  errors += double_leaps_are_framed_by_contrary_motion(cantus_firmus).length;
  errors += has_multiple_climax(cantus_firmus).length;
  return errors;
}

function evaluate_counterpoint(counterpoint, intervals, motions){
  var errors = 0;
  var score = [
    has_repeated_notes(counterpoint).length,
    has_dissonances(intervals).length,
    has_unison_in_middle(intervals).length,
    has_not_contrary_before_perfects(intervals, motions).length,
    has_too_many_leaps(counterpoint).length,
    has_consecutive_fifths_or_octaves(intervals).length,
    has_too_many_parallels(intervals).length,
    has_correct_start(intervals).length,
    has_correct_end(intervals, counterpoint).length,
    has_dissonant_interval(counterpoint).length,
    has_legit_leaps(counterpoint).length,
    has_legit_double_leaps(counterpoint).length,
    has_overrange(cantus_firmus, counterpoint).length,
    single_leaps_are_framed_by_contrary_motion_when_requested(counterpoint).length,
    has_range_too_large(counterpoint)]
  score.forEach(p => errors += p);
  return errors;
}

function ask_random(){
  if(counterpoint_active ? counterpoint.length : cantus_firmus.length){
    document.getElementById("alert_ok").onclick = random_song;
    display_alert(messages.random);
  }
  else
    random_song();
}

function random_song(){
  if(counterpoint_active)
    random_counterpoint();
  else
    random_cantus_firmus();
  hide_alert();
  display_pointers([]);
  update_message_box(0, "");
}

function random_cantus_firmus(){
  var length = (document.getElementById("measures").children.length - 1)*notes_in_measure;
  var swapper = 1;
  if(cf_clef=="bass") swapper = -1;
  for(var i=0; i<length; i++)
    cantus_firmus[i] = {note: Math.round(Math.random()*12*swapper), alter: null};
  render_stave(cantus_firmus, is_active_treble());
}

function random_counterpoint(){
  var swapper = 1;
  var new_note;
  if(cf_clef=="treble") swapper = -1;
  for(var i=0; i<cantus_firmus.length; i++){
    new_note = Math.round(Math.random()*12*swapper);
    counterpoint[i] = {note: new_note, alter: null};
    intervals[i] = get_interval(new_note, cantus_firmus[i].note);
    if(counterpoint[i-1])
      motions[i-1] = get_motion(counterpoint[i-1].note, new_note, cantus_firmus[i-1].note, cantus_firmus[i].note);
  }
  render_stave(counterpoint, is_active_treble());
}

function swap_cf_clef(){
  if(!cantus_firmus.length){
    if(cf_clef=="treble")
      cf_clef = "bass";
    else
      cf_clef = "treble";
    update_cf_clef_button();
    swap_active_clef();
  }
  else
    update_message_box(-1, messages.cannot_change_clef);
}

function update_cf_clef_button(){
  var button = document.getElementById("cf_clef");
  if(cf_clef=="treble")
    button.src = url_treble;
  else
    button.src = url_bass;
}

function swap_active_clef(){
  var measure = document.getElementById("measures");
  for(measure = measure.firstElementChild.nextElementSibling; measure; measure = measure.nextElementSibling){
    for(var notespace = measure.firstElementChild; notespace; notespace = notespace.nextElementSibling){
      var notes = notespace.firstElementChild;
      for(var i=0; i<2; i++){
        for(var notespot = notes.firstElementChild; notespot; notespot = notespot.nextElementSibling){
          if(notespot.classList.contains("active")) notespot.onclick = null;
          else notespot.onclick = insert_note;
          notespot.classList.toggle("active");
        }
        notes = notespace.lastElementChild;
      }
    }
  }
}

function pass_to_counterpoint(){
  find_errors_on_cantus_firmus();
  if(errors.length)
    update_message_box(-1, messages.cannot_pass_to_cp);
  else{
    swap_active_clef();
    activate_counterpoint();
    update_message_box(0, messages.palestrina);
  }
}

function activate_counterpoint(){
  var button = document.getElementById("counterpoint");
  button.onclick = go_back_to_cf;
  button.classList.add("active");
  counterpoint_active = true;
  toggle_message_direction();
}

function toggle_message_direction(){
  var message_box = document.getElementById("messages");
  message_box.classList.toggle("from_gregory");
  message_box.classList.toggle("from_palestrina");
}

function go_back_to_cf(){
  deactivate_counterpoint();
  swap_active_clef();
  display_pointers([]);
}

function deactivate_counterpoint(){
  var button = document.getElementById("counterpoint");
  button.onclick = pass_to_counterpoint;
  button.classList.remove("active");
  counterpoint_active = false;
  toggle_message_direction();
}

function initialize(){
  document.getElementById("title").style.display = "none";
  document.getElementById("alert_window").style.display = "block";
  document.getElementById("hide_all").style.display = "none";
  document.getElementById("container").style.visibility = "visible";
  update_message_box(0, messages.gregory);
}

function display_key_signature(alter_number){
  var treble_box = document.getElementById("treble_signature");
  var bass_box = document.getElementById("bass_signature");
  while (treble_box.firstChild) treble_box.removeChild(treble_box.lastChild);
  while (bass_box.firstChild) bass_box.removeChild(bass_box.lastChild);
  var img;
  var symbol;
  if(alter_number>0){
    symbol = url_sharp;
    for(var i=1; i<=alter_number; i++){
      img = document.createElement("img");
      img.src = symbol;
      img.classList.add("sharp");
      img.style.transform = "translateY(" + (i*3-2)%7*5.5 + "px)";
      treble_box.append(img);
      bass_box.append(img.cloneNode(true));
    }
  }
  else{
    symbol = url_flat;
    for(var i=-1; i>=alter_number; i--){
      img = document.createElement("img");
      img.src = symbol;
      img.classList.add("flat");
      img.style.transform = "translateY(" + (((i+8)*3-3)%7+1)*5.5 + "px)";
      treble_box.append(img);
      bass_box.append(img.cloneNode(true));
    }
  }
}

function change_key_signature(){
  var alters = 3;
  altered_notes = [];
  if(!counterpoint.size){
    signature += alter_active;
    if(signature<-6)
      signature = signature+12;
    else if(signature>6)
      signature = signature-12;
    display_key_signature(signature);
    if(signature>0){
      for(var i=0; i<signature; i++){
        for(var note=-12; note<=12; note++)
          if((note+14)%7==alters)
            altered_notes.push(note);
        alters = (alters+4)%7;
      }
    }
    else{
      alters = 6;
      for(var i=0; i>signature; i--){
        for(var note=-12; note<=12; note++)
          if((note+14)%7==alters)
            altered_notes.push(note);
        alters = (alters+3)%7;
      }
    }
  }
}

add_measures(min_measures);
document.getElementById("plus").onclick = add_one_measure;
document.getElementById("minus").onclick = remove_one_measure;
document.getElementById("play").onclick = play_song;
document.getElementById("save").onclick = ask_saving_song;
document.getElementById("delete").onclick = ask_deleting_song;
document.getElementById("import").onclick = ask_import_song;
document.getElementById("sharp").onclick = set_sharp;
document.getElementById("flat").onclick = set_flat;
document.getElementById("check").onclick = check_song;
document.getElementById("correct").onclick = correct_song;
document.getElementById("random").onclick = ask_random;
document.getElementById("cf_clef").onclick = swap_cf_clef;
document.getElementById("counterpoint").onclick = pass_to_counterpoint;
document.getElementById("alert_cancel").onclick = hide_alert;
document.getElementById("get_in").onclick = initialize;
document.getElementById("clef_box").onclick = change_key_signature;
update_message_box(0, "");