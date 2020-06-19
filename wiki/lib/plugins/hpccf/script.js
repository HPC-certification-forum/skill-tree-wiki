function hpccf_create_link(link, text){
  return '<li class="level1"><div class="li"> <a href="' + link + '" class="wikilink1">' + text + '</a></div></li>'
}

function hpccf_is_star(path){
  var c = jQuery.cookie("likeSkill");
  if(! c) return false;
  return c.search(path + ";") > -1;
}

function hpccf_star(path){
  var o = jQuery("span#marked");
  o.toggleClass("star");
  var c = jQuery.cookie("likeSkill");
  if(! c) c = "";
  if(o.hasClass("star")){
    c = path + ";" + c;
  }else{
    var p = c.search(path + ";");
    if(p > -1){
      c = c.substr(0, p) + c.substr(p + path.length + 1)
    }
  }
  jQuery.cookie("likeSkill", c, { path: '/' });
}

function hpccf_show_selection(){
  var div = jQuery("#selected_skills");
  if(div.length == 0){
    return ;
  }
  var c = jQuery.cookie("likeSkill");
  if(! c || c.length == 0){
    div.parent().append("<p>None selected</p>");
    return;
  }
  var str = "";
  var selected = c.split(";");
  for(x in selected){
    var skill = selected[x];
    if(! skill) continue;
    str + = "<li>" + skill + "</li>";
  }
  div.parent().append("<ul>" + str + "</ul>");
  div.parent().append('<h2>Operations</h2>');
  div.parent().append('<a href="#" onclick=\'jQuery.cookie("likeSkill", "", { path: "/" });location.reload();\'>Clear selection</a>');
}

function hpccf_mod_links(links){
  var div = jQuery("div.page");
  if(! div){
    return ;
  }

  hpccf_show_selection();

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
    div.prepend('<span id="marked" class="' + (hpccf_is_star(path) ? "star" : "") + '" onclick="hpccf_star(\'' + path + '\');">&#x2605;</span>')
  }
}

jQuery( document ).ready(hpccf_mod_links);
