const HandlerOptions = { Priority:"Priority", Tags:"Tags",None:''}

const EditorType = { 
                      TextArea:"TextArea",
                      TagEditor:"TagEditor",
                      ProjectSelector:"DDLProject",
                      StatusDDL:"StatusDDL",
                      PriorityDDL:"DDLPriority" 
                    }

var Columns = [
    {	
      Header:	'Id'	,	
      DataId:	'id'	,	
      Width:	80	,	
      Handler:	HandlerOptions.None, 
      Editable:false},

    {	
      Header:	'Project'	,	
      DataId:	'project'	,	
      Width:	120	,	
      Handler:	'', 
      Editable:true,
      UpdateCommand:'task $i modify project:$1',
      Editor:EditorType.ProjectSelector
    },
   
    {	
      Header:	'Description'	,	
      DataId:	'description'	,	
      Width:	300	,	
      Handler:	HandlerOptions.None, 
      Editable:true, 
      UpdateCommand:'task $i modify $1',
      Editor:EditorType.TextArea
    },
    // use-case not covered by one command for updatecommand, again.
    // possibly make this a function call also accepting one atomic operation
    {	
      Header:	'Status'	,	
      DataId:	'status'	,	
      Width:	120	,	
      Handler:	HandlerOptions.None, 
      Editable:true,
      UpdateCommand:'task $i modify status:$1',
      Editor:EditorType.StatusDDL
    },
    
    {
      Header:	'Priority'	,	
      DataId:	'priority'	,	
      Width:	120	,	
      Handler:HandlerOptions.Priority, 
      Editable:true,
      Editor:EditorType.PriorityDDL
    },

    {	
      Header:	'Tags'	,	
      DataId:	'tags'	,	
      Width:	200	,	
      Handler:	HandlerOptions.Tags, 
      Editable:false,
      Editor:EditorType.TagEditor,
      UpdateCommand:''
    }
];

// using resetColumns() and nextColumns() to step through columnn definitions this is the index they use
// on the columns object
var _column_curr_index = 0;

function resetColumns()
{
  _column_curr_index = 0;
}

function  nextColumns()
{
    if ( _column_curr_index == Columns.length)
    {
        return null;
    }
    else
    {
        _column_curr_index++;
        return Columns[_column_curr_index-1];
    }
}

var ByUUID={};

function buildUUIDIndex(data)
{
  var uuidindex={};

  for (i in data )
  {
    var uuid = data[i].uuid;

    if (typeof uuidindex[uuid] == 'undefined')
    {
      uuidindex[uuid]=data[i];
    }
    else if (typeof uuidindex[uuid] == 'Array') 
    {
      uuidindex[uuid].push(data[i]);
    }
    else
    {
      var ori = uuidindex[uuid];
      uuidindex[uuid]=[];
      uuidindex[uuid].push(ori,data[i]);
    }
  }

  return uuidindex;
}

function getTasks(setGrid)
{

  var jqxhr = $.getJSON( "/users/getTasks", 
    function(data) 
    {
      console.log( "success" );
      
      globData=data;
      setGrid(data);

      ByUUID=buildUUIDIndex(globData);
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

// updates the value of the priority field when user clicks the priority box
// assumes no new items have just been turned on.
function updateSortPriorities(Id)
{

  console.log ('Id in udord is '+Id);
  // retrieve the max a-fucking-gain
  // while sitting waiting for an annoying black male to not bug U
 
  var max = getMaxPriority();

  // get the current items priority
  var ori = Filters[Id].Priority;

  console.log('max is '+max);
  console.log('original priority is '+ori);
  
 

  if (ori==max)
  {
    Filters[Id].Priority=1;
  }
  else
  {
    Filters[Id].Priority++;
  }


  // priority is set to last

  if (ori ==  max)
  {
    for (filterId in Filters)
    {
      // skip the selected item otherwise increment priority
      if (filterId != Id)
      {
        Filters[filterId].Priority++;
      }               
    }
  }
  else
  {
    // use case for a priority which was in the middle somewhere
  
    for (filterId in Filters)
    {
      var item = Filters[filterId];

      if (item.Priority !=0 && filterId !=Id)
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

  refreshSortPriorities();
}

