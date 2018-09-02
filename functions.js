var hoffset = 20;
var voffset = 20;
var flo = 'float';
var lore = 'lore';
var loremaster = 'loremaster';
var saves = 'saves';
var saving = 'saving';
var edit = 'edit';
var savesPanel = 'savesPanel';
var savesVar = 'savesVar';
var viewEdit = 'viewEdit';
var viewDiv = 'view';
var init = 'init';
var extra = 'extra';
var masterTextO = '<div id="master" onmousemove="managePosition(event);" onmouseout="reset();" ';
var masterTextC = '</div>';
var close = '>';
var open = '<';
var variable;
var variables = [];
  
function g(id){return document.getElementById(id);}  
function reset(){g(flo).style.display = 'none';g(flo).innerHTML = '';}
function closeSaves(){g(savesPanel).style.display = 'none';}
function showSaves(){g(savesPanel).style.display = 'inline-block';}
function content(id){g(flo).innerHTML = '<pre>' + decodeURI(id) + '</pre>';}
function addSaving(t){g(saving).innerHTML += '<div><pre>' + t + '</pre></div>';}
function resetSaving(){g(saving).innerHTML = '';}
function _view(){g(edit).style.display = 'none';}
function _edit(){g(edit).style.display = 'initial';};
function clearDump(){g(extra).innerHTML = '';};

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

function roll(){
  var glore = g(lore);
  var text = glore.value.substr(glore.selectionStart, (glore.selectionEnd - glore.selectionStart));
  
  do{
    variable = prompt("Enter var name:", "");
  }while(variable == null || variable == "");
  
  showSaves();
  
  if(findVariable(variable)){
    g(saves).value = eval("v_" + variable);
  }
  
  g(savesVar).value = variable;
  
  glore.value = glore.value.substr(0, glore.selectionStart) + '[[onmouseover="content(v_' + variable + ');"]' + text + "]] " + glore.value.substr(glore.selectionEnd);
  
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
  var text = g(lore).value.replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\[\[/g, masterTextO).replace(/\]\]/g, masterTextC).replace(/\]/g, close).replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/~~b/g, "</b>").replace(/~b/g, "<b>").replace(/~~i/g, "</i>").replace(/~i/g, "<i>");
  g(loremaster).innerHTML = text;
}

function addVar(){
  eval("v_" + variable + " = '" + encodeURI(g(saves).value) + "'");
  
  if(findVariable(variable) === true){
    loadSavings();
  }else{
    addSaving("v_" + variable + " {" + g(saves).value + "};");
    variables.push("v_" + variable);
  }
  
  g(saves).value = '';
  variable = '';
  closeSaves();
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
  var html = [];
  
  dumpVars();
  
  html.push("<html>\n");
  html.push("<head><title>D&D Loremaster</title></head>\n");
  html.push("<script src=\"https://cdn.rawgit.com/DoHITB/LoreMaster/master/functions.js\" type=\"text/javascript\"></script" + close + "\n");
  html.push("<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdn.rawgit.com/DoHITB/LoreMaster/master/style.css\">\n");
  html.push("</head>\n");
  html.push("<body>\n");
  html.push("<div class=\"viewEdit\" id=\"viewEdit\">\n");
  html.push(g(viewEdit).innerHTML + "\n");
  html.push("</div>\n");
  html.push("<div class=\"editable\" id=\"edit\">\n");
  html.push(g(edit).innerHTML + "\n");
  html.push("</div>\n");
  html.push("<div class=\"lore\" id=\"view\">\n");
  html.push(g(viewDiv).innerHTML + "\n");
  html.push("</div>\n");
  html.push("<div id=\"init\">\n");
  html.push(g(init).innerHTML + "\n");
  html.push("</div>\n");
  html.push("<div id=\"extra\">\n");
  html.push(g(extra).innerHTML + "\n");
  html.push("</div>\n");
  html.push("</body>\n");
  html.push("</html>\n");
  
  var date = Date.now();
  
  this.dlf(new Blob(html,{type:'text/html'}), "loremaster_" + date);
  
  clearDump();
}

function dlf(b, n){
	dlfr=new FileReader();
	dlfr.onload=function(event){dlfs=document.createElement('a');
							  dlfs.href = event.target.result;
								dlfs.target = '_blank';
								dlfs.download = n + '.html';
								dlfc=new MouseEvent('click',{'view':window,'bubbles':true,'cancelable':true});
								dlfs.dispatchEvent(dlfc);
								(window.URL||window.webkitURL).revokeObjectURL(dlfs.href)};
	dlfr.readAsDataURL(b);
}

function dumpVars(){
  var t = '<script type="text/javascript">\n';
  var aux = g(lore).value.replace(/"/g, '\\"').split("\n");
  var dvi = 0;
  
  for(dvi = 0;dvi < variables.length;dvi++){
    t += 'var ' + variables[dvi] + ' = "' + eval(variables[dvi]).replace(/"/g, '\\"') + '";\n';
  }
  
  t += 'var aux = "";\n';
  
  for(dvi = 0;dvi < aux.length;dvi++){
    t += 'aux += "' + aux[dvi] + '\\n";\n'; 
  }
  
  t += 'g(lore).value = aux;\n';
  
  t += 'variables = [';
  
  for(dvi = 0;dvi < variables.length;dvi++){
    t += '"' + variables[dvi] + '"';
    
    if(dvi > variables.length){
      t += ', ';
    }
  }
  
  t += ']';
  
  t += '</script' + close;
  g(extra).innerHTML = t;
}
