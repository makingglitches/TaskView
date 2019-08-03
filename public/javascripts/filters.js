// load this script second.

//load this script first
// convenience object for setting SortOrder field of filter object
const SortOptions = {Up:1,Down:2,None:0}
// display, search and sort filters

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

// for when an update needs forced, like after turning off sorting on a column
function removeOrder(Id)
{
  var ori = Filters[Id].Priority;

  Filters[Id].Priority=0;

  for (filterId in Filters)
  {
    f = Filters[filterId];

    if (f.Priority > ori)
    {
      // shift the items after the previous priority back by one.
        f.Priority--;
    }
  }

}


// loop through the sort filters and get the maximum priority presently set
function getMaxPriority()
{

  var prior=0;

  for (id in Filters)
  {
    if (Filters[id].Priority > prior)
    {
      prior = Filters[id].Priority;
    }
  }


  return prior;
}