console.log("Starting Content Script");

// readability.flags=0;
var doc=$('body').clone().get(0);
readability.removeScripts(doc);
var article=readability.grabArticle(doc);
var text="";
$(article).find('p').each(function(i,el){
  text=text+readability.getInnerText(el)+"\n";
});
console.log(article);
chrome.extension.sendRequest({method:"articleExtracted",text:text},function(response) {
  console.log(response);
});

