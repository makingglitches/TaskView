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
          OrderButtonName:c.Header+"order",
          SortButtonName:c.Header+"sort",
          HeaderDivName : c.Header+"head"
        };
        
        c.SortButtonName = Filters[c.Header].SortButtonName;
        c.OrderButtonName = Filters[c.Header].OrderButtonName;
        c.HeaderDivName = c.Header+"head";

        c=nextColumns();
}

