
// make sure to include datadefs in html document
var globData=[];

$(document).ready(function(err)
{
    getTasks(setGrid);
});

$(document).resize(function()
{

});

function showLoad(on)
{
    if (on)
    {     
      $('#spinner').show();
      $('#taskcontainer').hide();
    }
    else
    {
      $('#spinner').hide();
      $('#taskcontainer').show();
    }
}


// flag indicating filters have not been set up yet.
//var initial =1;



// sets the grid container properties
function setContainerProps(containerId)
{

  resetColumns();

  var c = nextColumns();

  var sizestring = "grid-template-columns: ";

  while (c!=null)
  {
    sizestring+=c.Width+"px ";
    c=nextColumns();
  }

  sizestring+=";"

  $('#'+containerId).attr('style',sizestring);
}

function setButtonsFromFilters(filter)
{

  // after a grid refresh all the damn buttons may be missing that
  // were created by a click event
  if (filter.Direction != SortOptions.None)
  {

    if ( $('#'+filter.OrderButtonName).length==0)
    {
      
      $('<span>')
      .attr('id',filter.OrderButtonName)
      .attr('data-col',id)
      .appendTo('#'+filter.HeaderDivName);

      $('#'+filter.OrderButtonName).click(function()
      {
        var id =  $(this).attr('data-col');
        updateSortPriorities(id);
        Resort();
        setGrid(globData);
      });

    }

    $('#'+filter.SortButtonName).addClass('arrowactive');    

  }

  // apply display logic.
  switch(filter.Direction)
  {
    case SortOptions.Up:
      // add sort priority control next to sort arrow
      
      // transform icon to active and turn right side up to indicate ascending order sort
      $('#'+filter.SortButtonName).addClass('invertrotate');
    break;

    case SortOptions.Down:
      $('#'+filter.SortButtonName).removeClass('invertrotate');  
    break;

    case SortOptions.None:
      //revert sort arrow to original appearance
      $('#'+filter.SortButtonName).removeClass('arrowactive');
      // remove sort priority control
      $('#'+filter.OrderButtonName).remove();
    break;
  }

}
 

// sets up the grid and populates it with data from getTasks() call
function setGrid(data)
{
  var t = $('#taskcontainer');

  // clear data and header rows
  t.children().remove('div');

  setContainerProps('taskcontainer');

  // set up headers and links
  resetColumns();
  var column =nextColumns();
  
  while (column!=null)
  {    
      addColumnHeader(column,t);
      addLineBreak($('#'+column.HeaderDivName));
      addSortIcon(column,'#'+column.HeaderDivName);
      
      // add click event handler to sort arrow icon next to header
      $('#'+column.SortButtonName).click(sortButtonClick);

      column=nextColumns();
  }

  // populate grid with provided data
  for (item of data)
  {
   //  var item = data[id]

     resetColumns();
     var column= nextColumns();
     
     while (column!=null)
     {
      
      var datapiece ="";
      //determine how to display items
      switch(column.Handler)
      {
        case HandlerOptions.Priority:
          switch(item[column.DataId])
          {
            case 'L':
              datapiece="Low";
              break;
            case 'M':
              datapiece="Medium";
              break;
            case 'H':
              datapiece="High";
              break;
            default:
              datapiece=" ";
              break;
            }
          break;

        case HandlerOptions.Tags:
          if (typeof item[column.DataId] != "undefined")
          {
            for (tag of item[column.DataId])
            {
              var newtag = $("<span>")
              .attr('id','tag'+tag+item.uuid)
              .attr('data-uuid',item.uuid)
              .attr('data-tag',tag)
              .attr('margin-left',5)
              .html('+'+tag);
          
              var taghtml = newtag.prop('outerHTML');
              console.log(taghtml);
              datapiece+=taghtml+" ";
            }
          }
          break;

        case HandlerOptions.None:
            datapiece=item[column.DataId];
          break;
      }

      if (column.Handler==HandlerOptions.Tags)
      {
        console.log(datapiece);
      }
      
      $('<div>')
      .attr('data-uuid',item.uuid)
      .attr('data-id',column.Header)
      .html(datapiece)
      .addClass('dataitem')
      .appendTo(t);

      column=nextColumns();
     }

     $('.dataitem').dblclick(function()
     {
       var id = $(this).attr('data-id');
       var uuid = $(this).attr('data-uuid');
      
     
      
       var column = Filters[id].Column;
       
       if ( column.Editable )
       {
        ('<textarea>')
        .attr('id',id+'editor')
        .attr('style','width:100%;height:100%')
        .val(ByUUID[uuid])
        .prop('outerHTML');    
       }
     });




  }

  //reset button state from filters
  for (id in Filters)
  {
    setButtonsFromFilters(Filters[id]);
  }

  refreshSortPriorities();

}

function addColumnHeader(column,container)
{
  // add cell header div
  $('<div/>')
  .attr('id',column.HeaderDivName)
  .addClass('cellheader')
  .html(column.Header)
  .appendTo(container);
}

function addLineBreak(container)
{
  $('<br>').appendTo(container);
}

function addSortIcon(column,container)
{
      // add sort icon next to header text
      $('<img>')
      .addClass('resizeimage')
      .attr('id',column.SortButtonName)
      .attr('src','images/inactive arrow.png')
      .attr('data-col',column.Header)
      .attr('data-dataid',column.DataId)
      .appendTo(container);
}

function sortButtonClick()
{
  var id =  $(this).attr('data-col');
  console.log('id discovered was'+ id);

  var f = Filters[id];

  switch(f.Direction)
  {
    
    case SortOptions.None:
      f.Direction = SortOptions.Up;
      f.Priority = getMaxPriority()+1;
      break;

    case SortOptions.Up:
      Filters[id].Direction = SortOptions.Down;
      // transform icon to turn downwards to indicate descending order
      break;

    case SortOptions.Down:
      Filters[id].Direction = SortOptions.None;
      removeOrder(id);
      break;
  }

  setButtonsFromFilters(f);
  refreshSortPriorities();
  Resort();
  setGrid(globData);


}


function refreshSortPriorities()
{
  for (filterId in Filters)
  {
    var f = Filters[filterId];

    if (f.Priority >0)
    {
      $('#'+f.OrderButtonName).text(f.Priority);
    }
  }
}



