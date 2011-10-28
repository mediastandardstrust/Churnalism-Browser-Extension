$(function() {
    function renderList() {
      chrome.extension.sendRequest({method:"getOptions"},function(options){
        $('#sites-list').empty().append($("#site-list-item").tmpl(options.sites));
      });
    }

    function updateOptions(){
      var options={sites:[]};
      $('#sites-list li label').each(function(i,el){
        options.sites.push({url:$(el).text()});
      })
      chrome.extension.sendRequest({method:"saveOptions",options:options});
    }

    $("#newSite").validate({
      rules: {
        url: {
          required: true,
          url: true
        }
      }
    });
        
    $("#newSite").submit(function(event){
      event.preventDefault();
      if ($("#newSite").valid()){
        var input = $(this).find("input");
        if (!input.val()){
          return;
        }
        $("#sites-list").append($("#site-list-item").tmpl({url:input.val()}));
        updateOptions();
        input.val("");
      }
    });
    
    $("#reset").click(function(){
      chrome.extension.sendRequest({method:"resetOptions"},function(response){
        renderList();
      });
    });

    $(".delete").live('click',function(){
      $(this).parent().remove();
      updateOptions();
    });

    renderList();
});