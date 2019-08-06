// load this script second.

//load this script first
// convenience object for setting SortOrder field of filter object
const SortOptions = {Descending:1,Ascending:2,None:0}
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
        filters[c.HeaderId]= new FilterObject(SortOptions.None,0,c);
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

        // causes all kind of errors if you do not check to see whether one or both variables are undefined
        // first
        sortfunctioncode+='var definedCrit=UndefinedStatus('+symbol1+','+symbol2+','+o.dir+');';
        sortfunctioncode+='if (definedCrit!=5) { return definedCrit;}';

        if (o.filter.Column.Handler== HandlerOptions.Tags)
        {
          sortfunctioncode+='return CompareTagArrays('+symbol1+','+symbol2+','+o.dir+');'

          console.log(sortfunctioncode);
        }
        else
        {


        // greater than test
         sortfunctioncode+=
                "if ("+symbol1+' > ' +symbol2+" ) { return "
                +(o.dir == SortOptions.Descending?'-1':'1')+ ";} ";
        
        // less than test
        sortfunctioncode+=
                "if ("+symbol1+' < ' +symbol2+" ) { return "
                +(o.dir == SortOptions.Descending?'1':'-1')+ ";} ";
        }
      }

      sortfunctioncode+= 'return 0; });   }';
    
  }
  else
  {
    var sortfunctioncode='function gridSort(data) { console.log("empty search filters");}';
  }

 // console.log(sortfunctioncode);
  eval(sortfunctioncode);

  gridSort(globData);

  // console.log(sortpath);
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