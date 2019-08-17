// load this script second.

//load this script first
// convenience object for setting SortOrder field of filter object

const SortOptions = { Descending: 1, Ascending: 2, None: 0 };
// display, search and sort filters

var Filters = initFilters();
/**
 * Sets up the filters array, one per column defined field.
 */
function initFilters() {
	var filters = {};

	resetColumns();

	var c = nextColumns();

	// some initialization code for search filters
	while (c != null) {
		filters[c.HeaderId] = new FilterObject(SortOptions.None, 0, c);
		c = nextColumns();
	}

	return filters;
}
/**
 * Generates a sort function dynamically and places it in 'gridsort' then executes it.
 */
function Resort() {
	var sortpath = [];

	for (filterId in Filters) {
		var f = Filters[filterId];

		if (f.Direction != SortOptions.None) {
			sortpath.push({
				id: f.Column.DataId,
				dir: f.Direction,
				pr: f.Priority,
				em: f.EmptyToBottom,
				filter: f
			});
		}
	}

	if (sortpath.length > 0) {
		// calculate an order to apply filters in.
		sortpath.sort(function(a, b) {
			if (a.pr > b.pr) {
				return 1;
			}
			else if (a.pr < b.pr) {
				return -1;
			}
			else return 0;
		});

		var sortfunctioncode = 'function gridSort(data) { data.sort(function(d1,d2) {';

		for (o of sortpath) {
			// get the indexed parameter passed to the sort function
			var symbol1 = "d1['" + o.id + "']";
			var symbol2 = "d2['" + o.id + "']";

			var symbolstr = symbol1 + ',' + symbol2 + ',' + o.dir;
			var emptysymbolstr = symbolstr + ',' + o.em;

			// causes all kind of errors if you do not check to see whether one or both variables are undefined
			// first

			sortfunctioncode += MakeSortTest(UndefinedStatus.name, true, emptysymbolstr);
			sortfunctioncode += MakeSortTest(NullOrEmptyString.name, true, emptysymbolstr);

			if (o.filter.Column.Handler == HandlerOptions.Priority) {
				sortfunctioncode += MakeSortTest(PrioritySort.name, false, symbolstr);
			}
			else if (o.filter.Column.Handler == HandlerOptions.Tags) {
				sortfunctioncode += MakeSortTest(CompareTagArrays.name, false, symbolstr);
			}
			else if (o.filter.Column.Handler == HandlerOptions.Status) {
				sortfunctioncode += MakeSortTest(StatusCompare.name, false, symbolstr);
			}
			else {
				sortfunctioncode += MakeSortTest(DefaultCompare.name, false, symbolstr);
			}
		}

		// close function and add default return value of equal.
		sortfunctioncode += 'return SortResult.AreEqual; });   }';
	}
	else {
		var sortfunctioncode = 'function gridSort(data) { console.log("empty search filters");}';
	}

	console.log(sortfunctioncode);

	// console.log(sortfunctioncode);
	eval(sortfunctioncode);

	gridSort(globData);

	// console.log(sortpath);
}

function MakeSortTest(testName, hasFive, paramStr) {
	var s = 'var ' + testName + 'result = ' + testName + '(' + paramStr + ');';
	s +=
		' if (' +
		testName +
		'result != 5 && ' +
		testName +
		'result != SortResult.AreEqual) return ' +
		testName +
		'result;';

	return s;
}

/**
 * Updates the filters resetting priority of id and adjusting the others
 * @param  {string} Id - the id of the header field whos filters need reset.
 */
function removeOrderPriorityById(Id) {
	var ori = Filters[Id].Priority;

	Filters[Id].Priority = 0;

	for (filterId in Filters) {
		f = Filters[filterId];

		if (f.Priority > ori) {
			// shift the items after the previous priority back by one.
			f.Priority--;
		}
	}
}

// loop through the sort filters and get the maximum priority presently set
function getMaxPriority() {
	var prior = 0;

	for (id in Filters) {
		if (Filters[id].Priority > prior) {
			prior = Filters[id].Priority;
		}
	}

	return prior;
}
