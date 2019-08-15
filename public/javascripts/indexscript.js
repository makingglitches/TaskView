
// make sure to include datadefs in html document
var globData=[];

$(document).ready(function(err)
{
    getTasks(setGrid);
});

$(document).resize(function()
{

});

/**
 * Show or hide loading icon
 * @param  {boolean} on indicates whether the icon should be shown or not, true is yes false is no
 */
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

/**
 * sets the grid container properties
 * 
 * @param  {string} containerId - points to the div which is to contain the data grid
 */
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

/**
 * Sets up display values for sort icons, ensuring they are in the proper state 
 * @param  {FilterObject} filter - an item from the global filters array which specifies sort options and properties.
 * @see filters
 */
function setButtonsFromFilters(filter)
{

  // after a grid refresh all the damn buttons may be missing that
  // were created by a click event
  if (filter.Direction != SortOptions.None)
  {

    // if order button is not found add it.
    if ( $('#'+filter.Column.OrderButtonName).length==0)
    {
      
      $('<span>')
      .attr('id',filter.Column.OrderButtonName)
      .attr('data-col',id)
      .appendTo(filter.Column.HeaderDiv());

      $('#'+filter.Column.OrderButtonName).click(function()
      {
        var id =  $(this).attr('data-col');
        updateSortPriorities(id);
        Resort();
        setGrid(globData);
      });

    }

    $('#'+filter.Column.SortButtonName).addClass('arrowactive');    

  }

  // apply display logic.
  switch(filter.Direction)
  {
    case SortOptions.Descending:
      // add sort priority control next to sort arrow
      
      // transform icon to active and turn right side up to indicate ascending order sort
    
    break;

    case SortOptions.Ascending:
        $('#'+filter.Column.SortButtonName).addClass('invertrotate');  
    break;

    case SortOptions.None:
        $('#'+filter.Column.SortButtonName).removeClass('invertrotate'); 
      //revert sort arrow to original appearance
      $('#'+filter.Column.SortButtonName).removeClass('arrowactive');
      // remove sort priority control
      $('#'+filter.Column.OrderButtonName).remove();
    break;
  }

}
 
/**
 * Takes json data provided by the backend and populates the grid with it.
 * @param  {TaskDataObject[]} data - contains an array of TaskObjectData
 * @see getTasks
 * @see globData
 */
function setGrid(data)
{
  var t = $('#taskcontainer');

  
  // clear data and header rows
  t.children().remove('div');


  var headercont = $('<div>')
                   .attr('id','headerdiv')
                   .attr('style',"grid-column-start:span "+ countColumns()+
                   "; position:sticky; top:0; grid-row-start:span 2")
                   .appendTo(t);

  setContainerProps('taskcontainer');

  // set up headers and links
  resetColumns();
  var column =nextColumns();
  
  while (column!=null)
  {    
      var newheader = addColumnHeader(column,headercont);
      addLineBreak(newheader);
      var button = addSortIcon(newheader);

      // add click event handler to sort arrow icon next to header
      $(button).click(sortButtonClick);

      column=nextColumns();
  }

  addOptionPane(headercont);

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
              .addClass('tagitem')
              .html('+'+tag);
          
              var taghtml = newtag.prop('outerHTML');
         //     console.log(taghtml);
              datapiece+=taghtml+" ";
            }
          }
          break;

        case HandlerOptions.None:
            datapiece=item[column.DataId];
          break;
      }

    //  if (column.Handler==HandlerOptions.Tags)
    //  {
    //   console.log(datapiece);
    //  }
      
      $('<div>')
      .attr('data-uuid',item.uuid)
      .attr('data-id',column.HeaderId)
      .html(datapiece)
      .outerWidth(column.Width)
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

function addOptionPane(container)
{
  $("<div/>")
  .attr("id",'searchoptionspane')
  .attr('style','grid-column-start:span '+Columns.length+'; height:20px; position:sticky;')
  .addClass('border')
  .appendTo(container);

  var pane = $('#searchoptionspane');

  // $('<img>')
  // .attr('id','expandoptionsbutton')
  // .attr('src','/images/expand.png')
  // .addClass('resizeimage')
  // .appendTo(pane);

  addCheckGroup('downsortempty',pane,'Sort empty values to the bottom ?',false);
  var icon = addIcon('/images/settings.png',pane,'downsortoptions',false);
  
  icon.attr('style','margin-left:5px;padding-left:0px;');
  
  $('<div>/')
  .attr('id','forwhichdownsortdiv')
  .attr('style','padding-left:10px')
  .appendTo(pane);

  var downopts = $('#forwhichdownsortdiv');

  addCheckGroup('downsortallcheck',downopts,'All',false);
  

  resetColumns();

  var column = nextColumns();

  while (column !=null)
  {
    
    addCheckGroup("downsort"+column.HeaderId+"check",downopts ,column.HeaderId);
    column = nextColumns();
  }

  $(downopts).hide();

}






/**
 * Event handler sparked by clicking on of the sort icons.
 */
function sortButtonClick()
{
  var id =  $(this).attr('data-col');
 // console.log('id discovered was'+ id);

  var f = Filters[id];

  switch(f.Direction)
  {
    
    case SortOptions.None:
      f.Direction = SortOptions.Ascending;
      f.Priority = getMaxPriority()+1;
      break;

    case SortOptions.Ascending:
      Filters[id].Direction = SortOptions.Descending;
      break;

    case SortOptions.Descending:
      Filters[id].Direction = SortOptions.None;
      removeOrder(id);
      break;
  }

  setButtonsFromFilters(f);
  refreshSortPriorities();
  Resort();
  setGrid(globData);
}

/**
 * Ensures the numbers in all the sort priorities in the grid are correct
 */
function refreshSortPriorities()
{
  for (filterId in Filters)
  {
    var f = Filters[filterId];

    if (f.Priority >0)
    {
      $('#'+f.Column.OrderButtonName).text(f.Priority);
    }
  }
}



