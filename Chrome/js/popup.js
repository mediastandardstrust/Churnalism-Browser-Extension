function loadResults(){
  chrome.tabs.getSelected(null,function(tab){
    $('div#results').html(chrome.extension.getBackgroundPage().results[tab.id]);
  });
};

window.onload=loadResults;
