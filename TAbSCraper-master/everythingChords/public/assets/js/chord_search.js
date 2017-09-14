var chord_containers = document.getElementsByClassName("showback chords");
var addedChords = [];
var colors = ["#73C5E1", "#EB65A0", "#AED136", "#00467", "#FF5A09" , "#634271"];
var chordon = []; //quick fix- consider replace
var chords_main = [["A major", "C major", "D major", "E major", "F major", "G major", "A minor", "D minor", "E minor", "A7", "B7", "C7", "D7", "E7", "G7", "Fmaj7"], ["B major", "B minor", "C minor", "F minor", "F7", "Amaj7", "Cmaj7", "Am7", "Dm7", "Em7", "Asus2", "Dsus2", "Asus4", "Dsus4", "Esus4"],[]];

for(var y = 0; y < chord_containers.length; y++){
    var chords = chord_containers[y].getElementsByTagName('button');
    var color=colors[y];
    for(var x = 0; x < chords.length; x++){
        var chord = chords[x];
        chord.style.marginBottom = "5px"; //quick fix
        chord.style.backgroundColor=color;
        chord.style.border="none";
        chord.id = chord.childNodes[0].nodeValue;
        chord.addEventListener('click',  function(){
            addchord(this);
        }); 
    }
}

function addchord(chord){
    var container = document.getElementById("chord_container");
    //clear if defaulted
    if (container.children[1].nodeName == "H7")
        container.removeChild(container.children[1]);
        
    //check if chord already added
    for (var x = 0; x < addedChords.length; x++){
        if(addedChords[x] == chord.id){
            return;
        }
    }
    
    //check if above 5
    if(addedChords.length == 5) return;
    
    //setup wrapper on-fly and quick margins
    var temp = chord.cloneNode(true);
    temp.style.margin = "0px 2px 5px 2px";
    removeChord(chord, false);
    
    container.insertBefore(temp, container.lastElementChild);
    chordon.push(temp); chordon.push(true);
    temp.addEventListener('click', avoidAnonRet);
    addedChords.push(chord.id);
}

function removeChord(chord, isList){
    chord.parentNode.removeChild(chord);
    if(isList){ 
        addedChords.splice(addedChords.indexOf(chord), 1);
        putBackIn(chord);
    }
    if(addedChords.length == 0 && isList){
        var heading = document.createElement("h7");
        heading.appendChild(document.createTextNode("Add your chords here by clicking them!"));
        var base = document.getElementById("chord_container");
        base.insertBefore(heading, base.lastElementChild);
        addedChords = []; //reinitialze
    }
}

function putBackIn(chord){
    //first find the chord sequence
    var chord_seq = [];
    var type = 0; //0 - beginner, 1 - inter, etc...
    //cti = chord type iterator, ci = chord iterator
    for(var cti = 0; cti < chords_main.length; cti++){
        for(var ci = 0; ci < chords_main[cti].length; ci++){
            var chordComp = chords_main[cti][ci];
            if(chord.id == chordComp){
                chord_seq = chords_main[cti]; 
                type = cti;
            }
        }
    } 
    //next generate compareable sequence
    var chord_seq_comp = [];
    var chord_elements = document.getElementsByClassName("col-lg-12 mb")[0].children[type+1].children; //adjust for empty container
    for(ci = 1; ci < chord_elements.length; ci++){
        var chordName = chord_elements[ci].id;
        chord_seq_comp.push(chordName);
    }
    
    //finally compare both and add offset to html
    //check sides
    var hit = false;
    var index = chord_seq.indexOf(chord.id);
    for(var x = index-1; x >= 0; x--){
        if(hit) break;
        var chordToSearch = chord_seq[x];
        for(var y = 0; y < chord_seq_comp.length; y++){
            if(chordToSearch == chord_seq_comp[y]){
                //insert it in now! - find chord as Element then addSibling
                var sib = chord_elements.item(y+1); //add 1 because of h4
                //setup event handlers
                chord.removeEventListener('click', avoidAnonRet);
                chord.addEventListener('click', function(){addchord(this);}); //re-add event listener 
                sib.parentNode.insertBefore(chord, sib.nextSibling); //append between nodes or at end
                hit = true;
            }
        }
    }
}

function avoidAnonRet(){
    if(chordon.length < 1) return;
    removeChord(chordon[0], chordon[1]);
    chordon.pop(); //stack encapsulation - quick fix
    chordon.pop();
}