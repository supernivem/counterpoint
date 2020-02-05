const notes_in_measure = 1;
const min_measures = 2;
const fadeIn = 0.01;
const fadeOut = 0.1;
const example_last = 0.5;
const whole_note = 1;
const fundamental_frequency = 220;
const url_wholerest = "https://lh6.googleusercontent.com/proxy/lM-D-KWg-Q3zdET2V61V_gH2e7qM--Jq4gLUr1KsEMIZW1WTHMIYdTE3RvF06Kce3lP_I2P4AhT0358QAZLWCvaL6cOOiB6kj4n6CQuWNL_6uGc";
const url_wholenote = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Daman_semibreve.svg/1280px-Daman_semibreve.svg.png";
const url_sharp = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Sharp.svg/1200px-Sharp.svg.png";
const url_flat = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flat.svg/1200px-Flat.svg.png";
const url_arrow = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PES-Red-Arrow.svg/1077px-PES-Red-Arrow.svg.png";
const url_treble = "https://cdn.clipart.email/bc4f20784fa11c391454b6b091cfaf36_music-key-clipart-clipartxtras_3000-3000.svg";
const url_bass = "https://static.thenounproject.com/png/501763-200.png";
const messages = new Map([
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
    ['harmonic_dissonances', 'Sono presenti intervalli amonicamente dissonanti'],
    ['unisons', "L'unisono è ammesso solo all'inizio e alla fine"],
    ['contrary', "Gli intervalli di quinta, ottava e unisono devono essere preceduti da moti contrari, ad eccezione delle cd. quinte di corno"],
    ['parallel', "Sono presenti quinte o ottave parallele"],
    ['parallels', "Terze e seste consecutive sono ammesse ma in un numero non superiore a tre"],
    ['chromaticisms2', 'Ci sono cromatismi proibiti'],
    ['start', 'Il contrappunto ha la nota iniziale scorretta'],
    ['end', 'Il contrappunto deve finire sulla tonica preceduto da un moto contrario e congiunto'],
  ]);
const ionian_mode = new Map([[0,0],[1,2],[2,4],[3,5],[4,7],[5,9],[6,11],[7,12],[8,14],[9,16],[10,17],[11,19],[12,21],[-1,-1],[-2,-3],[-3,-5],[-4,-7],[-5,-8],[-6,-10],[-7,-12],[-8,-13],[-9,-15],[-10,-17],[-11,-19],[-12,-20]]);
const tonics = {
  major: [0,7,-7],
  minor: [5,12,-2,-9]
};
var errors = new Array();
var cantus_firmus = new Array();
var counterpoint = new Array();
var intervals = new Array();
var motions = new Array();
var counterpoint_active = false;
var is_playing = false;
var alter_active = 0;
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
  if(counterpoint_active){
    counterpoint[index] = {note: j, alter: alter_active};
    intervals[index] = get_interval(j, cantus_firmus[index].note);
    if(index<length-1)
      motions[index] = get_motion(j, counterpoint[index+1] ? counterpoint[index+1].note : null, cantus_firmus[index].note, cantus_firmus[index+1].note);
    if(index>0)
      motions[index-1] = get_motion(counterpoint[index-1] ? counterpoint[index-1].note : null, j, cantus_firmus[index-1].note, cantus_firmus[index].note);
  }
  else
    cantus_firmus[index] = {note: j, alter: alter_active};
  render_stave();
  play_note(ionian_mode.get(j)+alter_active, example_last);
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
  }
  else
    cantus_firmus[index] = null;
  while(cantus_firmus[cantus_firmus.length-1]==null && cantus_firmus.length>0) cantus_firmus.pop();
  render_stave();
}

function render_stave(){
  var measure = document.getElementById("measures");
  var notes_box;
  var note;
  var melody;
  var interval;
  var motion;
  var active_treble = is_active_treble();
  if(counterpoint_active)
    melody = counterpoint;
  else
    melody = cantus_firmus;
  while(measure.childElementCount<=Math.floor(cantus_firmus.length/notes_in_measure))
    insert_measure();
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
            insert_wholenote(notespot, note.alter);
            if(active_treble && k==0 || !active_treble && k==-12)
              notespot.parentElement.classList.replace("noline", "lineonbottom");
            else
              notespot.parentElement.classList.replace("lineonbottom", "noline");
            if(active_treble && k==12 || !active_treble && k==0)
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
      if(counterpoint_active && interval)
        lyrics.innerHTML = interval;
      else
        lyrics.innerHTML = "";
      lyrics = lyrics.nextElementSibling;
      motion = motions[index];
      if(counterpoint_active && motion)
        lyrics.innerHTML = motion;
      else
        lyrics.innerHTML = "";
      notespace = notespace.nextElementSibling;
    }
    measure = measure.nextElementSibling;
  }
}

function is_active_treble(){
  return cf_clef=="treble" && !counterpoint_active || cf_clef=="bass" && counterpoint_active;
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
  if(alter==1){
    img = document.createElement("img");
    img.src = url_sharp;
    img.classList.add("sharp");
    node.append(img);
  }else if(alter==-1){
    img = document.createElement("img");
    img.src = url_flat;
    img.classList.add("sharp");
    node.append(img);
  }
}

function add_measure(){
  if(counterpoint_active)
    update_message_box(-1, "Il contrappunto non può essere più lungo del cantus firmus");
  else
    insert_measure();
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
          if(cf_clef=="treble" && s=="clef_notes" || cf_clef=="bass" && s=="bass_notes"){
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

function remove_measure(){
  var stave = document.getElementById("measures");
  var number = stave.childElementCount - 1;
  if(counterpoint_active)
    update_message_box(-1, "Non puoi più modificare la lunghezza del brano");
  else
    if(number>min_measures){
      cantus_firmus.splice(-notes_in_measure, notes_in_measure);
      stave.lastElementChild.remove();
    }
}

function play_note(note, duration){
  var ac = new AudioContext();
  var wave = ac.createPeriodicWave(real, imag);
  var osc = ac.createOscillator();
  var g = ac.createGain();
  osc.frequency.setValueAtTime(fundamental_frequency*Math.pow(2, (note-9)/12), ac.currentTime);
  osc.setPeriodicWave(wave);
  osc.connect(g);
  g.connect(ac.destination);
  g.gain.value = 0;
  osc.start();
  g.gain.setTargetAtTime(1, ac.currentTime, fadeIn);
  g.gain.setTargetAtTime(0, ac.currentTime+duration, fadeOut);
  osc.stop(duration*10);
}

function play_song(){
  is_playing = true;
  var button = document.getElementById("play")
  button.onclick = stop_song;
  button.src="http://we-mobi.com/wp-content/uploads/2014/10/com_sapps_android_NoWallpaper.png";
  var i = 0;
  var notes;
  function myLoop(){
    if(is_playing){
      notes = [cantus_firmus[i], counterpoint[i]];
      for(var note of notes)
        if(note)
          play_note(ionian_mode.get(note.note) + note.alter, whole_note);
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
  button.src="https://i.pinimg.com/originals/e1/bd/8d/e1bd8d29a727bb65b99d35e3eeec64ed.png";
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
  display_alert("Eliminare tutto il brano?");
}

function delete_song(){
  var p = document.getElementById("measures").firstElementChild.nextElementSibling;
  var next;
  while(p){
    next = p.nextElementSibling;
    p.remove();
    p = next;
  }
  cantus_firmus = [];
  insert_measure();
  hide_alert();
}

function ask_saving_song(){
  document.getElementById("alert_ok").onclick = save_song;
  display_alert("Sicuro di voler salvare? Il salvataggio sovrascriverà il brano precedente");
}

function save_song(){
  var cf_for_saving = new Array();
  var ctp_for_saving = new Array();
  for(var i=0; i<cantus_firmus.length; i++){
    if(cantus_firmus[i]!=null)
      cf_for_saving[i] = cantus_firmus[i];
    else
      cf_for_saving[i] = -1;
    if(counterpoint[i]!=null)
      ctp_for_saving[i] = counterpoint[i];
    else
      ctp_for_saving[i] = -1;
  }
  db.collection("data").doc("song").set({clef: cf_clef, cf: cf_for_saving, ctp: ctp_for_saving});
  update_message_box(1, "canzone salvata");
  hide_alert();
}

function ask_import_song(){
  document.getElementById("alert_ok").onclick = import_song;
  display_alert("Importare il brano? Eliminerai quello esistente");
}

function import_song(){
  var note;
  var saved_cf_clef;
  var doc = db.collection("data").doc("song").get()
    .then(doc => {
      saved_cf_clef = doc.data().clef;
      cantus_firmus = [];
      counterpoint_active = false;
      if(cf_clef!=saved_cf_clef)
        swap_cf_clef();
      note = doc.data().cf;      
      for(var i=0; note[i]!=null; i++){
        if(note[i]!=-1)
          cantus_firmus[i] = note[i];
        else
          cantus_firmus[i] = null;
      }
      render_stave();
      note = doc.data().ctp;
      if(note.length){
        counterpoint_active = true;
        for(var i=0; i<note.length; i++){
          if(note[i]!=-1)
            counterpoint[i] = note[i];
          else
            counterpoint[i] = null;
        }
        intervals = get_all_intervals(cantus_firmus, counterpoint);
        motions = get_all_motions(cantus_firmus, counterpoint);
        render_stave();
        pass_to_counterpoint();
      }
    })
    .catch(err => {
      update_message_box(-11, "Impossibile importare il brano");
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
    pointers = has_contrary_before_perfects(intervals, motions);
    if(pointers.length)
      errors.push({type: "contrary", positions: pointers});
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
    text = "Molto bene";
  }
  else if(errors[number]){
    type = -1;
    display_pointers(errors[number].positions);
    text = "Errore " + (number+1) + " di " + errors.length + ": " + messages.get(errors[number].type);
  }
  update_message_box(type, text);
  next_button.style.display = "inline-block";
  next_button.onclick = function(){notify_errors(number+1);};
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
  else
    message_box.style.display = "none";
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
  for(var i=0; measure; i++){
    var notespace = measure.firstElementChild;
    for(var j=0; notespace; j++){
      lyrics_box = notespace.firstElementChild.nextElementSibling;
      if(is_active_treble())
        pointer_box = lyrics_box.firstElementChild;
      else
        pointer_box = lyrics_box.lastElementChild;
      while(pointer_box.firstChild) pointer_box.removeChild(pointer_box.firstChild);
      if(positions.includes(i*notes_in_measure+j)){
        var img = document.createElement("img");
        img.src = url_arrow;
        img.classList.add("wholenote");
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
    if(cantus_firmus[i].alter)
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
  if(tonics.major.includes(one) && tonics.major.includes(two))
    return true;
  if(tonics.minor.includes(one) && tonics.minor.includes(two))
    return true;
  return false
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
    return Math.abs(tuple[0]-tuple[1]);
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
  if(max-min>9)
    return [min_pos, max_pos];
  return [];
}

function has_too_many_leaps(cantus_firmus){
  var length = cantus_firmus.length;
  var count = 0;
  var leaps = spot_leaps(cantus_firmus);
  for(var i=0; i<leaps.length-1; i++)
    if(leaps[i]==leaps[i+1]-1)
      count++;
  if(count>=(length/2))
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
  if(cf_clef=="treble")
    return prev==3 && next==6 || prev==6 && next==3 || prev==6 && next==10 || prev==10 && next==6;
  else
    return prev==-1 && next==-4 || prev==-4 && next==-1 || prev==-4 && next==-8 || prev==-8 && next==-4 || prev==-11 && next==-8 || prev==-8 && next==-11;
}

function has_legit_leaps(cantus_firmus){
  var positions = new Array();
  var prev, next;
  for(var i=0; i<cantus_firmus.length-1; i++){
    prev = cantus_firmus[i].note;
    next = cantus_firmus[i+1].note;
    if(prev+4<next || prev-4>next) //se è un intervallo sopra la quinta
      if(!is_octave(prev, next) && !is_ascending_minor_sixth(prev, next))
        positions.push(i, i+1);
  }
  return positions;
}

function is_octave(prev, next){
  return prev==next+7 || prev==next-7;
}

function is_ascending_minor_sixth(prev, next){
  if(cf_clef=="treble")
    return (prev==2 || prev==5 || prev==6) && next==prev+5;
  else
    return (prev==-5 || prev==-8 || prev==-9 || prev==-12) && next==prev+5;
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
      if(first>last) last = [first, first = last][0];
      if(!(is_ascending_perfect_fifth(first, mid) && is_ascending_perfect_fourth(mid, last)) && !(first==mid-2 && mid==last-3) && !(first==mid-2 && mid==last-2 && mid!=8 && mid!=-6))
        positions.push(i, i+1, i+2);
    }
  }
  return positions;
}

function is_ascending_perfect_fourth(first, second){
  return second==first+3 && !is_tritone(first, second);
}

function is_ascending_perfect_fifth(first, second){
  return second==first+4 && !is_tritone(first, second);
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
    update_message_box(-1, "E' troppo corto");
    reset_correction();
    return 0;
  }
  if(has_pauses(cantus_firmus).length){
    update_message_box("#F99", "Non ci devono essere pause");
    reset_correction();
    return 0;
  }
  update_message_box(0, "Sto correggendo...");
  for(var i=0; i<length; i++) //eliminate all chromaticisms
    candidate[i].alter = 0;
  fix_extremes(candidate);
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
      render_stave();
  }
  }, 500);
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
    update_message_box(-1, "Non ci devono essere pause");
    reset_correction();
    return 0;
  }
  update_message_box(0, "Sto correggendo...");
  for(var i=0; i<length; i++) //eliminate all chromaticisms
    candidate[i].alter = 0;
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
    render_stave();
  }
  }, 500);
}

function has_dissonances(intervals){
  var positions = new Array();
  var low, interval;
  for(var i=0; i<cantus_firmus.length; i++){
    low = cantus_firmus[i].note;
    interval = intervals[i];
    if(interval!=1 && interval!=8 && interval!=3 && interval!=6 && !(interval==5 && low!=-1 && low!=-8))
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

function has_contrary_before_perfects(intervals, motions){
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
      positions.push(1, i+1);
    if(Math.abs(intervals[i]-intervals[i+1])==7)
      positions.push(1, i+1);
  }
  return positions;
}

function has_too_many_parallels(intervals){
  var positions = new Array();
  for(var i=0; i<intervals.length-3; i++)
    if((intervals[i]==3 || intervals[i]==6) && intervals[i]==intervals[i+1] && intervals[i+1]==intervals[i+2] && intervals[i+2]==intervals[i+3])
      positions.push(i, i+1, i+2, i+3);
  return positions;
}

//TODO: add exceptions
function has_forbidden_chromaticisms(counterpoint){
  var positions = new Array();
  for(var i=0; i<counterpoint.length; i++)
    if(counterpoint[i].alter)
      positions.push(i);
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
  if(intervals[last]!=1 && intervals[last]!=8)
    positions.push(last);
  if(counterpoint[penultimate].note+1!=counterpoint[last].note)
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
  if(intervals[index-1]==3 && high_prev==high_next+1 && are_tonic_notes(cantus_firmus[0].note, low_prev))
    return true;
  if((intervals[index-1]==6 || intervals[index-1]==8) && high_prev+1==high_next && are_tonic_notes(cantus_firmus[0].note, high_prev))
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
  if(intervals[index-1]==5 && high_prev==high_next+1 && are_tonic_notes(cantus_firmus[0].note, low_next))
    return true;
  return false;
}

function get_interval(high, low){
  if(low>high)
    low = [high, high = low][0];
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
    update_message_box(-1, "Troppo difficile correggere");
  else{
    if(counterpoint_active){
      counterpoint = copy_cf(cantus);
      text = "Contrappunto corretto";
    }
    else{
      cantus_firmus = copy_cf(cantus);
      text = "Cantus firmus corretto";
    }
    render_stave();
    update_message_box(+1, text);
  }
}

function stop_correction(){
  clearInterval(loop_cf);
  update_message_box(-1, "Correzione interrotta");
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

function fix_extremes(cantus){
  var configurations = new Array();
  var major = tonics.major;
  var minor = tonics.minor;
  var first = cantus[0].note;
  var avoid_note = 12;
  if(cf_clef=="bass"){
    avoid_note = 0;
  }
  var last = cantus[cantus.length-1].note;
    for(var i=0; i<major.length; i++) //cannot end on high C in bass clef
      for(var j=0; j<major.length; j++)
        if(major[j]!=avoid_note)
          configurations.push({distance: Math.abs(first-major[i])+Math.abs(last-major[j]), first: major[i], last: major[j]});
    for(var i=0; i<minor.length; i++)
      for(var j=0; j<minor.length; j++) //cannot end on high A in treble clef
        if(minor[j]!=avoid_note)
          configurations.push({distance: Math.abs(first-minor[i])+Math.abs(last-minor[j]), first: minor[i], last: minor[j]});
    configurations.sort((a,b) => a.distance - b.distance);
    cantus[0].note=configurations[0].first;
    cantus[cantus.length-1].note=configurations[0].last;
  if(ends_with_clausula_vera(cantus).length)
    cantus[cantus.length-2].note=cantus[cantus.length-1].note+1;
}

function fix_extremes_counterpoint(counterpoint){
  var intervals = get_all_intervals(cantus_firmus, counterpoint);
  var errors = has_correct_start(intervals).length;
  var change = 0;
  //var new_first = 0;
  //var new_last = 0;
  //var new_penultimate = 0;
  var length = counterpoint.length;
  var max_note = 12;
  var min_note = 0;
  if(cf_clef=="treble"){
    max_note = 0;
    min_note = -12;
  }
  while(errors && change<26){
    change = -change;
    if(change>=0)
      change++;
    counterpoint[0].note += change;
    if(counterpoint[0].note>=min_note && counterpoint[0].note<=max_note){
      intervals = get_all_intervals(cantus_firmus, counterpoint);
      errors = has_correct_start(intervals).length;
    }
  }
  change = 0;
  errors = has_correct_end(intervals, counterpoint).length;
  while(errors && change<26){
    change = -change;
    if(change>=0)
      change++;
    counterpoint[length-1].note += change;
    if(counterpoint[length-1].note>min_note && counterpoint[length-1].note<=max_note){
      counterpoint[length-2].note = counterpoint[length-1].note-1;
      intervals = get_all_intervals(cantus_firmus, counterpoint);
      errors = has_correct_end(intervals, counterpoint).length;
    }
  }
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
  errors += has_dissonances(intervals).length;
  errors += has_unison_in_middle(intervals).length;
  errors += has_contrary_before_perfects(intervals, motions).length;
  errors += has_too_many_leaps(counterpoint).length;
  errors += has_consecutive_fifths_or_octaves(intervals).length;
  if(has_too_many_parallels(intervals).length) errors++;
  errors += has_correct_start(intervals).length;
  errors += has_correct_end(intervals, counterpoint).length;
  return errors;
}

function ask_random(){
  document.getElementById("alert_ok").onclick = random_song;
  display_alert("La randomizzazione sovrascrive il brano esistente. Continuare?");
}

function random_song(){
  if(counterpoint_active)
    random_counterpoint();
  else
    random_cantus_firmus();
  hide_alert();
}

function random_cantus_firmus(){
  var swapper = 1;
  if(cf_clef=="bass") swapper = -1;
  for(var i=0; i<cantus_firmus.length; i++)
    cantus_firmus[i].note=Math.round(Math.random()*12*swapper);
  render_stave();
}

function random_counterpoint(){
  var swapper = 1;
  var new_note;
  if(cf_clef=="treble") swapper = -1;
  for(var i=0; i<counterpoint.length; i++){
    if(counterpoint[i]){
      new_note = Math.round(Math.random()*12*swapper);
      counterpoint[i].note = new_note;
      intervals[i] = get_interval(new_note, cantus_firmus[i].note);
      if(counterpoint[i-1])
        motions[i-1] = get_motion(counterpoint[i-1].note, new_note, cantus_firmus[i-1].note, cantus_firmus[i].note);
    }
  }
  render_stave();
}

function swap_cf_clef(){
  var button = document.getElementById("cf_clef");
  if(!cantus_firmus.length){
    if(cf_clef=="treble"){
      button.src = url_bass;
      cf_clef = "bass";
    }
    else{
      button.src = url_treble;
      cf_clef = "treble";
    }
    swap_active_clef();
  }
  else
    update_message_box(-1, "Non puoi più cambiare il rigo del cantus firmus. Elimina il brano e riprova");
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
  var button = document.getElementById("counterpoint");
  find_errors_on_cantus_firmus();
  if(errors.length)
    update_message_box(-1, "Prima di passare a comporre il contrappunto, è necessario comporre un cantus firmus privo di errori");
  else{
    button.onclick = go_back_to_cf;
    button.classList.add("active");
    swap_active_clef();
    counterpoint_active = true;
    toggle_message_direction();
    update_message_box(0, "Ciao, sono Giovanni Pierluigi da Palestrina e ti aiuterò a scrivere una seconda voce seconfo le regole del Contrappunto di Prima Specie");
  }
}

function toggle_message_direction(){
  var message_box = document.getElementById("messages");
  message_box.classList.toggle("from_gregory");
  message_box.classList.toggle("from_palestrina");
}

function go_back_to_cf(event){
  var button = event.target;
  button.onclick = pass_to_counterpoint;
  button.classList.remove("active");
  swap_active_clef();
  counterpoint_active = false;
  toggle_message_direction();
}

for(var i=0; i<min_measures; i++)
  insert_measure();
document.getElementById("plus").onclick = add_measure;
document.getElementById("minus").onclick = remove_measure;
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
update_message_box(0, "Ciao, sono Gregorio Magno e ti aiuterò a scrivere un Cantus Firmus secondo le regole della tradizione musicale");