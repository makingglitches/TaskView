
var columns = [
    {	Header:	'Id'	,	DataId:	'id'	,	Width:	80	,	Handler:	''},
  {	Header:	'Project'	,	DataId:	'project'	,	Width:	120	,	Handler:	''},
  {	Header:	'Description'	,	DataId:	'description'	,	Width:	300	,	Handler:	''},
  {	Header:	'Status'	,	DataId:	'status'	,	Width:	120	,	Handler:	''},
  {	Header:	'Priority'	,	DataId:	'priority'	,	Width:	120	,	Handler:	'Priority'},
  {	Header:	'Tags'	,	DataId:	'tags'	,	Width:	200	,	Handler:	'Tag'}
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

// convenience object for setting SortOrder field of filter object
var SortOptions = {Up:1,Down:2,None:0}
// display, search and sort filters
var Filters = {};

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
        sortpath.push({id:f.Column.DataId, dir:f.Direction,pr:f.Priority});
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

    var sortfunctioncode = 
    `function gridSort(data)
    {
      data.sort(function(d1,d2)
      {

      `;

      for (o of sortpath)
      {
        
         sortfunctioncode+=
                "if (d1['"+o.id+"']" 
                + (o.dir == SortOptions.Up?'>':'<')+" d2['"+o.id+"']) { return 1;} "
                +"if (d1['"+o.id+"']" 
                + (o.dir == SortOptions.Up?'<':'>')+" d2['"+o.id+"']) { return -1;} ";
      }

      sortfunctioncode+=` return 0;
        });
      }`;
    
  }
  else
  {
    var sortfunctioncode='function gridSort(data) { console.log("empty search filters");}';
  }

  eval(sortfunctioncode);

  gridSort(globData);

  console.log(sortfunctioncode);
  console.log(sortpath);
}