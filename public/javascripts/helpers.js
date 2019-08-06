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
