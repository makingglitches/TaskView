
var globData=[];

$(document).ready(function(err)
{
    getTasks();
});

$(document).resize(function()
{

});


var sortoptions = {Up:1,Down:2,None:0}
var initial =1;
var filters = {};
var datamappings = [];

var columns = [
  {	Header:	'Id'	,	DataId:	'id'	,	Width:	80	,	Handler:	''},
  {	Header:	'Project'	,	DataId:	'project'	,	Width:	120	,	Handler:	''},
  {	Header:	'Description'	,	DataId:	'description'	,	Width:	300	,	Handler:	'},
  {	Header:	'Status'	,	DataId:	'status'	,	Width:	120	,	Handler:	''},
  {	Header:	'Priority'	,	DataId:	'urgency'	,	Width:	120	,	Handler:	'Priority'},
  {	Header:	'Tags'	,	DataId:	'Tags'	,	Width:	200	,	Handler:	'Tag'}
]
  

var headers = ['Id','Project','Description','Status','Priority','Tags'];
var toget = ['id','project','description','status','urgency','tags'];


// sets up the grid and populates it with data from getTasks() call
function setGrid(data)
{
  var t = $('#taskcontainer');

  datamappings = [];

  t.children().remove('div');

  
 // t.attr('style','grid-template-columns:repeat('+headers.length+', minmax(100px, 1fr));'  );

  // set up headers and links
  for (i in headers)
  {
    var item = headers[i];

    // for later use TODO: move this to another area in initialization code or make it a constant

    datamappings.push({HeaderId:item,DataId:""});
      
    // add cell header div
      $('<div/>')
      .attr('id',item+'head')
      .addClass('cellheader')
      .html(item)
      .appendTo(t);


      // add sort icon next to header text
      $('<img>')
      .addClass('resizeimage')
      .attr('id',item+'sort')
      .attr('src','images/inactive arrow.png')
      .attr('data-col',item)
      .appendTo('#'+item+'head');


      // populate the sort filters
      // dictionary of objects containing two options, priority and direction
      // down is decending
      // up is ascending
      // priority is sort order
      // default sort to id for consistency
      if (initial==1)
      {
        filters[item] = {Direction:sortoptions.None, Priority:0, id:item};
      }

      // add click event handler to sort arrow icon next to header
      $('#'+item+'sort').click(function()
      {
        // retrieve the id from the data-col attribute
         var id =  $(this).attr('data-col');
         console.log('id discovered was'+ id);

         switch(filters[id].Direction)
         {
           case sortoptions.None:
             filters[id].Direction = sortoptions.Up;
             filters[id].Priority = getMaxPriority()+1;

             // add sort priority control next to sort arrow
             $('<span>')
             .attr('id',id+'order')
             .attr('data-col',id)
             .appendTo('#'+id+"head");
      
             $('#'+id+'order').click(function()
             {
                var id =  $(this).attr('data-col');
                updateOrder(id);
             });

             // transform icon to active and turn right side up to indicate ascending order sort
             $(this).addClass('invertrotate arrowactive');
             break;

           case sortoptions.Up:
             filters[id].Direction = sortoptions.Down;
             
             // transform icon to turn downwards to indicate descending order
             $(this).removeClass('invertrotate');
             break;

           case sortoptions.Down:
             filters[id].Direction = sortoptions.None;
             removeOrder(id);

             //revert sort arrow to original appearance
             $(this).removeClass('arrowactive');
             // remove sort priority control
             $('#'+id+'order').remove();
             break;
         }

         refreshOrders();

      });
    
  }

    // part of initialization code to be moved TODO: remove this later
  var i =0;

  for (id in toget)
  {
      var dataid = toget[id];
      datamappings[i].DataId=dataid;
      i++;
  }

  // populate grid with provided data
  for (id in data)
  {
     var item = data[id]

     for (idnum in toget)
     {
       var dataid = toget[idnum];

      $('<div>')
      .attr('data-uuid',item.uuid)
      .html(item[dataid])
      .addClass('dataitem')
      .appendTo(t);

      i++;
     }
  }

    initial=0;
}


function refreshOrders()
{
  for (i in filters)
  {
    if (filters[i].Priority >0)
    {
      $('#'+i+'order').text(filters[i].Priority);
    }
  }
}

// for when an update needs forced, like after turning off sorting on a column
function removeOrder(Id)
{
  var ori = filters[Id].Priority;

  filters[Id].Priority=0;

  for (i in filters)
  {
    if (filters[i].Priority > ori)
    {
      // shift the items after the previous priority back by one.
      filters[i].Priority--;
    }
  }

}

// updates the value of the priority field when user clicks the priority box
// assumes no new items have just been turned on.
function updateOrder(Id)
{

  console.log ('Id in udord is '+Id);
  // retrieve the max a-fucking-gain
  // while sitting waiting for an annoying black male to not bug U
 
  var max = getMaxPriority();

  // get the current items priority
  var ori = filters[Id].Priority;

  console.log('max is '+max);
  console.log('original priority is '+ori);
  
 

  if (ori==max)
  {
    filters[Id].Priority=1;
  }
  else
  {
    filters[Id].Priority++;
  }


  // priority is set to last

  if (ori ==  max)
  {
    for (id in filters)
    {
      // skip the selected item otherwise increment priority
      if (id != Id)
      {
        filters[id].Priority++;
      }               
    }
  }
  else
  {
    // use case for a priority which was in the middle somewhere
  
    for (id in filters)
    {
      var item = filters[id];

      if (item.Priority !=0 && id !=Id)
      {
          if (item.Priority == max)
          {
            item.Priority=1;
          }  
          else
          {
            item.Priority++;
          }
      }
    }
  }

  refreshOrders();
}


function getMaxPriority()
{

  var prior=0;

  for (id in filters)
  {
    if (filters[id].Priority > prior)
    {
      prior = filters[id].Priority;
    }
  }


  return prior;
}

function getTasks()
{

  var jqxhr = $.getJSON( "/users/getTasks", 
    function(data) 
    {
      console.log( "success" );
      globData=data;
      setGrid(data);
    })
  .done(function() 
  {
      console.log( "second success" );
  })
  .fail(function() {
    console.log( "error" );
  })
  .always(function() {
    console.log( "complete" );
  });
  
}
