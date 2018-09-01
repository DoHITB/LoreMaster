var hoffset = 20;
var voffset = 20;
var master = 'master';
var flo = 'float';
var lore = 'lore';
var loremaster = 'loremaster';
var saves = 'saves';
var saving = 'saving';
var edit = 'edit';
var masterTextO = '<div id="master" onmousemove="managePosition(event);" onmouseout="reset();" ';
var masterTextC = '</div>';
var close = '>';
var open = '<';
var variable;
var variables = [];
  
function g(id){return document.getElementById(id);}  
function reset(){g(flo).style.display = 'none';g(flo).innerHTML = '';}
function content(id){g(flo).innerHTML = '<pre>' + decodeURI(id) + '</pre>';}
function addSaving(t){g(saving).innerHTML += '<div><pre>' + t + '</pre></div>';}
function resetSaving(){g(saving).innerHTML = '';}
function _view(){g(edit).style.display = 'none';}
function _edit(){g(edit).style.display = 'initial';};

function managePosition(event){
  var dot, eventDoc, doc, body, pageX, pageY;
  event = event || window.event;
  if (event.pageX == null && event.clientX != null) {
    eventDoc = (event.target && event.target.ownerDocument) || document;
    doc = eventDoc.documentElement;
    body = eventDoc.body;
    event.pageX = event.clientX +
                 (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                 (doc && doc.clientLeft || body && body.clientLeft || 0);
    event.pageY = event.clientY +
                 (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
                 (doc && doc.clientTop  || body && body.clientTop  || 0 );
  }
  g(flo).style.left = (event.pageX + hoffset) + "px";
  g(flo).style.top = (event.pageY - voffset) + "px"
  g(flo).style.display = 'block';
}


//https://stackoverflow.com/questions/4714192/insert-text-before-and-after-selection-in-textarea-with-javascript
function roll(){
  var glore = g(lore);
  var text = glore.value.substr(glore.selectionStart, (glore.selectionEnd - glore.selectionStart));
  //var variable;
  
  do{
    variable = prompt("Enter var name:", "");
  }while(variable == null || variable == "");
  
  glore.value = glore.value.substr(0, glore.selectionStart) + '[[onmouseover="content(v_' + variable + ');"]' + text + "]] " + glore.value.substr(glore.selectionEnd);
  //g(saves).value = g(saves).value + "\n" + variable + " = ";
  convert();
}

function bold(){
  var glore = g(lore);
  var text = glore.value.substr(glore.selectionStart, (glore.selectionEnd - glore.selectionStart));
  format(glore, text, "b");
}

function italic(){
  var glore = g(lore);
  var text = glore.value.substr(glore.selectionStart, (glore.selectionEnd - glore.selectionStart));
  format(glore, text, "i");
}

function format(glore, text, fmt){
  glore.value = glore.value.substr(0, glore.selectionStart) + "~" + fmt + text + "~~" + fmt + " " + glore.value.substr(glore.selectionEnd);
  convert();
}

function convert(){
  //load();
  var text = g(lore).value.replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\[\[/g, masterTextO).replace(/\]\]/g, masterTextC).replace(/\]/g, close).replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/~~b/g, "</b>").replace(/~b/g, "<b>").replace(/~~i/g, "</i>").replace(/~i/g, "<i>");
  g(loremaster).innerHTML = text;
}

/*function load(){
  var text = g(saves).value;
  var vars = text.split("\n");
  var i = 0;
  
  resetSaving();
  
  for(i = 0;i < vars.length;i++){
    eval(vars[i]);
    addSaving(vars[i]);
  }
}*/

function addVar(){
  eval("v_" + variable + " = '" + encodeURI(g(saves).value) + "'");
  
  if(!findVariable(variable)){
    addSaving("v_" + variable + " {" + g(saves).value + "};");
    variables.push("v_" + variable);
  }else{
    loadSavings();
  }
  
  g(saves).value = '';
  variable = '';
}

function findVariable(variable){
  var fvi = 0;
  var com = 'v_' + variable;
  
  for(fvi = 0;fvi < variables.length;fvi++){
    if(variables[fvi] == com){
      return true;
    }
  }
  
  return false;
}

function loadSavings(){
  var lsi = 0;
  resetSaving();
  
  for(lsi = 0;lsi < variables.length;lsi++){
    addSaving(variables[lsi] + " {" + eval(variables[lsi]) + "};");
  }
}

function _export(){
  var grt1 = g(saves).value.split("\n");
  var grt2 = g(lore).value.split("\n");
  var i = 0;
  
  for(i = 0;i < grt1.length;i++){
    grt1[i] += "\n";
  }
  
  for(i = 0;i < grt2.length;i++){
    grt2[i] += "\n";
  }
  
  var date = Date.now();
  
  this.dlf(new Blob(grt1,{type:'text/plain'}), "saves_" + date);
  this.dlf(new Blob(grt2,{type:'text/plain'}), "lore_" + date);
}

function dlf(b, n){
	dlfr=new FileReader();
	dlfr.onload=function(event){dlfs=document.createElement('a');
							  dlfs.href = event.target.result;
								dlfs.target = '_blank';
								dlfs.download = n + '.txt';
								dlfc=new MouseEvent('click',{'view':window,'bubbles':true,'cancelable':true});
								dlfs.dispatchEvent(dlfc);
								(window.URL||window.webkitURL).revokeObjectURL(dlfs.href)};
	dlfr.readAsDataURL(b);
}
