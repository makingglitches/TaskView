
// convenience object for setting SortOrder field of filter object
const SortOptions = {Up:1,Down:2,None:0}
// display, search and sort filters

const HandlerOptions = { Priority:"Priority", Tags:"Tags"}

const EditorType = { 
                      TextArea:"TextArea",
                      TagEditor:"TagEditor",
                      ProjectSelector:"DDLProject",
                      StatusDDL:"StatusDDL",
                      PriorityDDL:"DDLPriority" 
                    }

var columns = [
    {	
      Header:	'Id'	,	
      DataId:	'id'	,	
      Width:	80	,	
      Handler:	'', 
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
      Handler:	'', 
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
      Handler:	'', 
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

var Filters = initFilters();

function initFilters()
{

  var filters={};

  resetColumns();

  var c = nextColumns();

  // some initialization code for search filters
  while ( c!=null)
  {
        filters[c.Header]= 
        {
          Direction:SortOptions.None, 
          Priority:0, 
          id:c.Header,
          Column:c,
          OrderButtonName:c.Header+"order",
          SortButtonName:c.Header+"sort",
          HeaderDivName : c.Header+"head"
        };
        
        c.SortButtonName = filters[c.Header].SortButtonName;
        c.OrderButtonName = filters[c.Header].OrderButtonName;
        c.HeaderDivName = c.Header+"head";

        c=nextColumns();
  }

  return filters;

}

var _column_curr_index = 0;

function resetColumns()
{
  _column_curr_index = 0;
}

function  nextColumns()
{
    if ( _column_curr_index == columns.length)
    {
        return null;
    }
    else
    {
        _column_curr_index++;
        return columns[_column_curr_index-1];
    }
}

function Resort()
{
  var sortpath = [];

  for (filterId in Filters)
  {
    var f = Filters[filterId];

    if ( f.Direction != SortOptions.None)
    {
        sortpath.push({id:f.Column.DataId, dir:f.Direction,pr:f.Priority, filter:f});
    }
  }

  if (sortpath.length > 0)
  {
    sortpath.sort(function(a,b)
    {
        if (a.pr > b.pr )
        { 
          return 1;
        }
        else if (a.pr < b.pr)
        {
          return -1;
        }
        else return 0;
    });

    var sortfunctioncode = 'function gridSort(data) { data.sort(function(d1,d2) {';

      for (o of sortpath)
      {
        // get the indexed parameter passed to the sort function
        var symbol1 = "d1['"+o.id+"']";
        var symbol2 = "d2['"+o.id+"']";

        
        sortfunctioncode+='if (typeof '+symbol1+' == "undefined" &&';
   
        sortfunctioncode+=' typeof '+symbol2+' != "undefined") { return '+
        (o.dir == SortOptions.Up?' ':'-')+"1; }";


        sortfunctioncode+='if (typeof '+symbol1+' != "undefined" &&';
   
        sortfunctioncode+=' typeof '+symbol2+' == "undefined") { return '+
        (o.dir == SortOptions.Up?'-':' ')+ "1;}";

        
        if (o.filter.Column.Handler== HandlerOptions.Tags)
        {
          // this is a really dumb way to do this
          // but tags arent really more than a convenience like a database key
          // again.
        
            sortfunctioncode+=symbol1+'.sort();';
            sortfunctioncode+=symbol2+'.sort();';
            
            sortfunctioncode+='var s1 ='+symbol1+'.join(" "); ';
            sortfunctioncode+='var s2 ='+symbol2+'.join(" "); ';

            sortfunctioncode+=
                "if (s1 " + (o.dir == SortOptions.Up?'>':'<')+" s2) { return 1; } "
                "if (s1 " + (o.dir == SortOptions.Up?'<':'>')+" s2) { return -1;} ";
            
        }
        else
        {

         sortfunctioncode+=
                "if ("+symbol1
                + (o.dir == SortOptions.Up?'>':'<')
                +symbol2+" ) { return 1;} ";
          
          sortfunctioncode+=
                "if ("+symbol1
                + (o.dir == SortOptions.Up?'<':'>')
                +symbol2+" ) { return -1;} ";
        }
      }

      sortfunctioncode+= 'return 0; });   }';
    
  }
  else
  {
    var sortfunctioncode='function gridSort(data) { console.log("empty search filters");}';
  }

  console.log(sortfunctioncode);
  eval(sortfunctioncode);

  gridSort(globData);

  console.log(sortpath);
}

var ByUUID={};

function testindex(data)
{
  var uuidindex={};

  for (i in data )
  {
    uuidindex[data[i].uuid]=data[i];
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
      ByUUID=testindex(globData);
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