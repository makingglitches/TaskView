const HandlerOptions = { Priority: "Priority", Tags: "Tags", Status:"Status",None: "" };

const EditorType = {
	TextArea: "TextArea",
	TagEditor: "TagEditor",
	ProjectSelector: "DDLProject",
	StatusDDL: "StatusDDL",
	PriorityDDL: "DDLPriority",
	None: "None"
};

var Columns = [
	new ColumnObject(
		1,
		"Id",
		"id",
		80,
		HandlerOptions.None,
		"",
		EditorType.None
	),

	new ColumnObject(
		2,
		"Project",
		"project",
		120,
		HandlerOptions.None,
		"task $i modify project:$1",
		EditorType.ProjectSelector
	),

	new ColumnObject(
		3,
		"Description",
		"description",
		300,
		HandlerOptions.None,
		"task $i modify $1",
		EditorType.TextArea
	),

	new ColumnObject(
		4,
		"Status",
		"status",
		120,
		HandlerOptions.None,
		"task $i modify status:$1",
		EditorType.StatusDDL
	),

	new ColumnObject(
		5,
		"Priority",
		"priority",
		120,
		HandlerOptions.Priority,
		"task $i modify priority:$1",
		EditorType.PriorityDDL
	),

	new ColumnObject(
		6,
		"Tags",
		"tags",
		200,
		HandlerOptions.Tags,
		"",
		EditorType.TagEditor
	)
];

// using resetColumns() and nextColumns() to step through columnn definitions this is the index they use
// on the columns object
var _column_curr_index = 0;

function resetColumns() {
	_column_curr_index = 0;
}

function countColumns() {
	return Columns.length;
}

function nextColumns() {
	if (_column_curr_index == Columns.length) {
		return null;
	}
	else {
		_column_curr_index++;
		return Columns[_column_curr_index - 1];
	}
}

var ByUUID = {};

function buildUUIDIndex(data) {
	var uuidindex = {};

	for (i in data) {
		var uuid = data[i].uuid;

		if (typeof uuidindex[uuid] == "undefined") {
			uuidindex[uuid] = data[i];
		}
		else if (typeof uuidindex[uuid] == "Array") {
			uuidindex[uuid].push(data[i]);
		}
		else {
			var ori = uuidindex[uuid];
			uuidindex[uuid] = [];
			uuidindex[uuid].push(ori, data[i]);
		}
	}

	return uuidindex;
}

function getTasks(setGrid) {
	var jqxhr = $.getJSON("/users/getTasks", function(data) {
		// console.log( "success" );

		globData = data;
		setGrid(data);

		ByUUID = buildUUIDIndex(globData);
	})
		.done(function() {
			// console.log( "second success" );
		})
		.fail(function() {
			// console.log( "error" );
		})
		.always(function() {
			// console.log( "complete" );
		});
}

// updates the value of the priority field when user clicks the priority box
// assumes no new items have just been turned on.
function updateSortPriorities(Id) {
	// console.log ('Id in udord is '+Id);
	// retrieve the max a-fucking-gain
	// while sitting waiting for an annoying black male to not bug U

	var max = getMaxPriority();

	// get the current items priority
	var ori = Filters[Id].Priority;

	// console.log('max is '+max);
	// console.log('original priority is '+ori);

	if (ori == max) {
		Filters[Id].Priority = 1;
	}
	else {
		Filters[Id].Priority++;
	}

	// priority is set to last

	if (ori == max) {
		for (filterId in Filters) {
			// skip the selected item otherwise increment priority
			if (filterId != Id) {
				Filters[filterId].Priority++;
			}
		}
	}
	else {
		// use case for a priority which was in the middle somewhere

		for (filterId in Filters) {
			var item = Filters[filterId];

			if (item.Priority != 0 && filterId != Id) {
				if (item.Priority == max) {
					item.Priority = 1;
				}
				else {
					item.Priority++;
				}
			}
		}
	}

	refreshSortPriorities();
}
