
// convenience object for setting SortOrder field of filter object
const SortOptions = {Up:1,Down:2,None:0}
// display, search and sort filters
var Filters = {};

const HandlerOptions = { Priority:"Priority", Tags:"Tags"}

var columns = [
    {	Header:	'Id'	,	DataId:	'id'	,	Width:	80	,	Handler:	'', Editable:false},
  {	Header:	'Project'	,	DataId:	'project'	,	Width:	120	,	Handler:	'', Editable:false},
  {	Header:	'Description'	,	DataId:	'description'	,	Width:	300	,	Handler:	'', Editable:false},
  {	Header:	'Status'	,	DataId:	'status'	,	Width:	120	,	Handler:	'', Editable:false},
  {	Header:	'Priority'	,	DataId:	'priority'	,	Width:	120	,	Handler:HandlerOptions.Priority, Editable:false	},
  {	Header:	'Tags'	,	DataId:	'tags'	,	Width:	200	,	Handler:	HandlerOptions.Tags, Editable:false}
];

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

resetColumns();

var c = nextColumns();

// some initialization code for search filters
while ( c!=null)
{
        Filters[c.Header]= 
        {
          Direction:SortOptions.None, 
          Priority:0, 
          id:c.Header,
          Column:c,
          OrderButtonName:c.Header+"order",
          SortButtonName:c.Header+"sort",
          HeaderDivName : c.Header+"head"
        };
        
        c.SortButtonName = Filters[c.Header].SortButtonName;
        c.OrderButtonName = Filters[c.Header].OrderButtonName;
        c.HeaderDivName = c.Header+"head";

        c=nextColumns();
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