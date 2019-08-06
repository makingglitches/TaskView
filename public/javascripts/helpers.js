function addIcon(src,container,id='',linebreak=true)
{
  var i =  $('<img>')
  .attr('id',id)
  .attr('src',src)
  .addClass('resizeimage')
  .appendTo(container);

  if (linebreak)
  {
    addLineBreak(container);
  }
  
  return i;

}

function addCheck(name,container,text,linebreak=true)
{
  $('<input/>')
  .attr('type','checkbox')
  .attr('name',name)
  .appendTo(container).val(true);

  addTextSpan(text,container);

  if (linebreak)
  {
  addLineBreak(container);
  }

}
/**
 * Adds a span tag with text
 * @param  {string} text - text to display
 * @param  {JQuery} container - container selection to add to
 * @param  {} id='' - optional id of span
 */
function addTextSpan(text,container,id='')
{
  $('<span/>')
  .text(text)
  .attr('id',id)
  .appendTo(container);

}

/**
 * Simply adds a <br> tag to a container at the end of its present children() array.
 * @param  {JQuery} container - container object selected via jquery
 */
function addLineBreak(container)
{
  $('<br>').appendTo(container);
}


function doModal(container, show=true)
{
    if (show)
    {
        $(container).animate({height:"100%",width:'100%',left:"0%",top:"0%"},'slow');
    }
    else
    {
        $(container).animate({height:"0%",width:'0%',left:"50%",top:"50%"},'slow');
    }
    
}