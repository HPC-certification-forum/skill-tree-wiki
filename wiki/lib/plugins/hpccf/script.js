function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : "";
}

function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;SameSite=Strict;expires=" + d.toGMTString();
}

function deleteCookie(name) { setCookie(name, '', -1); }

function hpccf_create_link(link, text){
  return '<li class="level1"><div class="li"> <a href="' + link + '" class="wikilink1">' + text + '</a></div></li>'
}

function hpccf_is_star(path){
  var c = getCookie("likeSkill");
  if(! c) return false;
  return c.search(path + "_") > -1;
}

function hpccf_add_star_option(path){
  return '<span id="marked" class="' + (hpccf_is_star(path) ? "star" : "") + '" onclick="hpccf_star(\'' + path + '\');">&#x2605;</span>'
}

function hpccf_star(path){
  var o = jQuery("span#marked");
  o.toggleClass("star");
  var c = getCookie("likeSkill");
  if(! c) c = "";
  if(o.hasClass("star")){
    c = path + "_" + c;
  }else{
    var p = c.search(path + "_");
    if(p > -1){
      c = c.substr(0, p) + c.substr(p + path.length + 1)
    }
  }
  setCookie("likeSkill", c);
}

hpccf_skill = [];
hpccf_skill_title = {};
hpccf_version = "1.0";

function hpccf_remove_skill(id){
  var pos = hpccf_skill.indexOf(id);
  if (pos >= 0) hpccf_skill.splice(pos, 1);
}

function hpccf_renderSkillData(data){
  var title = data["title"];
  var id = data["id"];
  if(id){
    var elem = jQuery("#skill_" + id.replace(/[/]/g, "_"));
    if(elem.length == 0){
      return;
    }
    if(title){
      elem.empty().append(title);
      hpccf_skill_title[id] = title;
    }else{
      elem.empty().append("<span style='color:red;'>invalid</span>");
      hpccf_remove_skill(id);
    }
  }else{
    console.log("error retrieving data");
    console.log(data);
  }
}

function hpccf_renderSkill(url){
  jQuery.ajax({
    url: "https://www.hpc-certification.org/api/" + url + "?fields=title,id",
    dataType: "json",
    mimeType: "application/json",
    success: hpccf_renderSkillData,
    error: function(jqXHR, textStatus, error) {
      console.log("jqXHR: '", jqXHR, "'");
      console.log("textStatus: '", textStatus, "'");
      console.log("error: '", error, "'");
    }
  });
}

function hpccf_create_endorsment(){
  var out = jQuery("#output");
  out.show();
  out.empty().append("<h2>Output</h2>");
  var first = true;
  var str = "";
  for(var i in hpccf_skill){
    var skill = hpccf_skill[i];
    if(! skill in hpccf_skill_title) continue;
    if(! first) str += ",<br/>";
    str += skill + " (" + hpccf_skill_title[skill] + ")";
    first = false;
  }
  var img = 'https://raw.githubusercontent.com/HPC-certification-forum/tools/master/branding/released/endorsement-' + hpccf_version;
  var url = "https://hpc-certification.org/wiki/skill-tree/" + hpccf_version;

  out.append('<p>Please use one of these images: <a href="' + img + '.png">PNG</a> <a href="' + img + '.pdf">PDF</a></p><h4>Customize the text in the expected look:</h4><p><img style="width:40%;" src="' + img + '.png"></p>');
  out.append("<p>This training <span class='hint' title='Choose if this is material or an event'>material/event</span> covers <span class='hint' title='If you train all learning objectives, you may remove partially.'>(partially)</span><br/>" + str + "<br/><a href='" + url + "'>" + url + "</a></p>");
}

function hpccf_load_skill_list(){
  var skills = jQuery("#userskills").val().split(/[\n;,]/);
  var pending = [];
  for(var i in skills){
    var s = skills[i].trim();
    if(s.length == 0) continue;
    // check if the skill was previously selected
    if(hpccf_skill.indexOf(s) > -1) continue;
    hpccf_skill.push(s);
  }

  hpccf_skill.sort();
  hpccf_show_selection();
}

function hpccf_load_skills_cookie(){
  var arr = getCookie("likeSkill").split("_");
  arr.pop();
  hpccf_skill = arr.sort();
}

function hpccf_add_link(id){
  var path = "https://www.hpc-certification.org/wiki/skill-tree/";
  return "<a href='"+ path + id + "'>" + id + "</a>";
}

function hccf_validate_skill(id, skill){ /* return error */
  // check basic consistency
  if (! ("title" in skill)){
    return ["Unparsable skill"];
  }
  var status = [];

  if(! ("background" in skill)){
    status.push("Background section missing");
  }else{
    var check = skill["background"];

    if(check.length < 1){
      status.push("Background section is empty");
    }else{
      if(check[0].length < 20){
        status.push("Background section must be at least 20 characters");
      }
    }
  }

  if(! ("aim" in skill)){
    status.push("Aim section missing");
  }else{
    var check = skill["aim"];
    if(check.length < 2){
      status.push("Aim section must have at least one aim as bullet list");
    }
  }

  if(! ("outcomes" in skill)){
    status.push("Outcomes section missing");
  }else{
    var check = skill["outcomes"];
    if(check.length < 3){
      status.push("Outcomes section must have at least two outcomes");
    }
  }

  // check title
  var res = skill["title"].split(" ");
  if(skill["id"] != id){
    status.push("ID is inconsistent, how can that happen?");
  }
  if(res.length < 2){
    status.push("Title must contain the ID");
  }else{
    var re = /([A-Z]*)([1-9.]+)?-([BIE])/;
    var match = res[0].match(re);
    if(match){
      var expected = match[1].toLowerCase() + "/";
      if(match[2]){
        expected += match[2].split(".").join("/") + "/";
      }
      expected += match[3].toLowerCase();
      if( id != expected ){
        status.push("Title ID doesn't match the expected ID");
      }
    }else{
      status.push("Title doesn't match the regular expression");
    }
  }

  return status;
}

function hccf_add_status(id, data, skill){
  var str = "";
  var msg = hccf_validate_skill(id, skill);
  var status = "ok";

  if ("title" in skill){
    str += "<div>" + skill["title"] + "</div>";

    // check titles across subversions of the skill
    var type = id.slice(-1);
    if (type != "b"){
      // compare with basic title
      var basic_skill = id.substring(0, id.length - 2);
      var basic = data[basic_skill + "/b"];
      if("title" in basic){
        var expected_title = basic["title"].replace("-B ", "-" + type.toUpperCase() + " ");
        if(expected_title != skill["title"]){
          msg.push("Title doesn't match title infered from basic skill: " + expected_title);
        }
      }
    }
  }

  if(msg.length != 0) {
    status = "err";
    var tmp = msg;
    for (err in tmp){
      msg = "<div>" + tmp[err] + "</div>";
    }
  }

  return [status, "<div class='skill-list skill-" + status + "'>" + hpccf_add_link(e) + str + msg + "</div>"];
}


function hpccf_show_status_render(data){
  var list = "";
  var listerr = "";
  var oks = 0;
  var errs = 0;
  for(e in data){
    var ret = hccf_add_status(e, data, data[e]);
    if(ret[0] == "ok"){
      list += ret[1];
      oks++;
    }else{
      listerr += ret[1];
      errs++;
    }
  }
  var div = jQuery("#status_of_the_competence_specification");
  div.html('<h3 class="sectionedit3">Validation Error: ' + errs + ' skills</h3><p><div style="font-size:small">' + listerr + "</div></p>" + '<h3 class="sectionedit3">Validation OK: ' + oks + ' skills</h3><p><div style="font-size:small">' + list + "</div></p>");
}


function hpccf_show_status(){
  var div = jQuery("#status_of_the_competence_specification");
  if(div.length == 0) return;

  jQuery.ajax({
    url: "https://www.hpc-certification.org/api/",
    dataType: "json",
    mimeType: "application/json",
    success: hpccf_show_status_render,
    error: function(jqXHR, textStatus, error) {
      console.log("jqXHR: '", jqXHR, "'");
      console.log("textStatus: '", textStatus, "'");
      console.log("error: '", error, "'");
    }
  });
}

function hpccf_show_selection(){
  var div = jQuery("#skill_selection");
  if(div.length == 0){
    div = jQuery("#selected_skills");
    if(div.length == 0){
      return ;
    }
    div.parent().append("<div id='skill_selection'></div");
    div = jQuery("#skill_selection");
  }else{
    div.empty();
  }
  var input = "<h2>Manual add skills to the selection</h2><p>List/Paste here valid skill IDs and leave the box</p><p><textarea id='userskills' onchange='hpccf_load_skill_list();' rows='5' cols='40'></textarea></p>";
  if(hpccf_skill.length == 0){
    div.append("<p>None selected</p>" + input);
    return;
  }
  var str = "<div><b>ID</b></div>";
  var str2 = "<div><b>Title</b></div>";
  var str3 = "<div><b>Marked</b></div>";
  for(x in hpccf_skill){
    var skill = hpccf_skill[x];
    if(! skill) continue;
    str + = "<div>" + skill + "</div>";
    if( skill in hpccf_skill_title ){
      str2 + = "<div>" + hpccf_skill_title[skill] + "</div>";
    }else{
      str2 + = "<div id='skill_" + skill.replace(/[/]/g, "_") + "'>&nbsp;</div>";
      hpccf_renderSkill(skill);
    }
    str3 + = '<div><span class="star" onclick="hpccf_remove_skill(\'' + skill + '\'); hpccf_show_selection();">&#x2605;</span></div>';
  }
  div.append("<div class='skilllist'>" + str + "</div><div class='skilllist'>" + str2 + "</div><div>" + str3 + '</div><div><a href="#" onclick=\'deleteCookie("likeSkill");location.reload();\'>Clear selection</a></div><p></p>' + input);
  div.append('<h2>Operations</h2>');
  div.append('<p><div><a href="#" onclick=\'hpccf_create_endorsment()\'>Create training endorsment string</a></div> </p>');
  div.append('<div id="output" style="display:none"></div>');
}

function hpccf_mod_links(links){
  var div = jQuery("div.page");
  if(! div){
    return ;
  }

  hpccf_load_skills_cookie();
  hpccf_show_selection();
  hpccf_show_status();

  var path = window.location.pathname;
  path = path.split("/");
  path.shift();
  if(path.shift() != "skill-tree"){
    if(path.shift() != "skill-tree"){
      return;
    }
  }
  path = path.join("/");
  if(path == ""){
    return;
  }
  // append contribution
  div.append('<h1 class="sectionedit10" id="Links">Links</h1>');
  links = hpccf_create_link("/contribute-question/" + path, "Submit a proposal for an examination question");
  div.append('<div class="level1"><ul>' + links + "</ul></div>");

  // append control on top
  div = jQuery("div.page"); //div = jQuery("h1#background");
  if(div.length != 0){
    div.prepend(hpccf_add_star_option(path));
  }
}

jQuery( document ).ready(hpccf_mod_links);
