app.page("archive-details", function()
{

  var $section = document.getElementById('archive-details');
  var tpl = doT.template($section.innerHTML);

  var currentArchiveId = null;

  //default is not shown
  $section.innerHTML=null;

  var remove = function(){
    if (confirm('sure you want to remove this archive ?')){
      TeamRepository.removeArchive(currentArchiveId);
      history.back();
    }
    return false;
  }


  return function(params) {
    currentArchiveId = params;
    var archive = TeamRepository.findArchive(currentArchiveId);
    $section.innerHTML = tpl(archive);

    $section.querySelector('.remove-link').onclick=remove;

  }
});