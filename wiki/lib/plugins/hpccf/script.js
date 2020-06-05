function hpccf_create_link(link, text){
  return '<li class="level1"><div class="li"> <a href="' + link + '" class="wikilink1">' + text + '</a></div></li>'
}

function hpccf_mod_links(links){
  var div = jQuery("div.page");
  if(! div){
    return ;
  }
  var path = window.location.pathname;
  path = path.split("/");
  path.shift();
  if(path.shift() != "skill-tree"){
    path.shift();
    path.shift();
  }
  path = path.join("/");
  if(path == ""){
    return;
  }
  div.append('<h1 class="sectionedit10" id="Links">Links</h1>');
  links = hpccf_create_link("/contribute-question/" + path, "Submit a proposal for an examination question");
  div.append('<div class="level1"><ul>' + links + "</ul></div>");
}

jQuery( document ).ready(hpccf_mod_links);
