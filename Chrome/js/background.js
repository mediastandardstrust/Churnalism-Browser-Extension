var results={};
var defaultOptions={sites:[{url:"http://www.reuters.com"},
                           {url:"http://www.nytimes.com"},
                           {url:"http://www.washingtonpost.com"},
                           {url:"http://www.ft.com"},
                           {url:"http://www.bbc.co.uk/news"},
                           {url:"http://www.guardian.co.uk"},
                           {url:"http://www.dailymail.co.uk"},
                           {url:"http://www.telegraph.co.uk"},
                           {url:"http://www.prnewswire.com/"}
                          ]};

RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function saveOptions(options){
  localStorage.setItem("options",JSON.stringify(options));
  return options;
}

function restoreOptions(){
  var options=JSON.parse(localStorage.getItem("options"));
  return (options==null)?resetOptions():options;
}

function resetOptions(){
  localStorage.setItem("options",JSON.stringify(defaultOptions));
  return defaultOptions;
}

function getRegex(){
  var regex="";
  var sites=restoreOptions().sites;
  $.each(sites,function(index,value){
    regex+="^"+RegExp.escape(value.url);
    if (index!=sites.length-1){
      regex+="|";
    }
  })
  return new RegExp(regex);
}

function checkForValidUrl(tabId, changeInfo, tab) {
  if (changeInfo.status =="loading"){
    var sites=getRegex()
    if (sites.test(tab.url)) {
      chrome.pageAction.show(tabId);
      chrome.pageAction.setPopup({tabId:tabId,popup:""});
      chrome.tabs.executeScript(null,{file: "/js/jquery.js"});
      chrome.tabs.executeScript(null,{file: "/js/readability.js"});
      chrome.tabs.executeScript(null,{file: "/js/content_script.js"});
    }
  }
};

function handleMessage(request,sender,response){
  if (request.method=="articleExtracted"){
    console.log("Searching for content at: " + sender.tab.url);
    console.log(request.text);
    $.post("http://us.churnalism.com/search/",{text:request.text},function(data){
      console.log("Results received");
      results[sender.tab.id]=data;
      chrome.pageAction.setIcon({tabId:sender.tab.id,path:"/img/found.png"});
      chrome.pageAction.setPopup({tabId:sender.tab.id,popup:"/html/popup.html"});
      response({});
    });
  }else if(request.method=="getOptions"){
    response(restoreOptions());
  }else if(request.method=="saveOptions"){
    response(saveOptions(request.options));
  }else if(request.method=="resetOptions"){
    response(resetOptions());
  }
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);
chrome.extension.onRequest.addListener(handleMessage);
