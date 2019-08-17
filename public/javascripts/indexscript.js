
/*********************Initialization code **********************************/
var globData = [];

$(document).ready(function(err) {
	getTasks(setGrid);
});

$(document).resize(function() {});

/************************************************************************** */

/**
 * Show or hide loading icon
 * @param  {boolean} on indicates whether the icon should be shown or not, true is yes false is no
 */
function showLoad(on) {
	if (on) {
		$("#spinner").show();
		$("#taskcontainer").hide();
	}
	else {
		$("#spinner").hide();
		$("#taskcontainer").show();
	}
}

/**
 * sets the grid container properties
 * 
 * @param  {string} containerId - points to the div which is to contain the data grid
 */
function setContainerProps(containerId) {
	resetColumns();

	var c = nextColumns();

	var sizestring = "grid-template-columns: ";

	while (c != null) {
		sizestring += c.Width + "px ";
		c = nextColumns();
	}

	sizestring += ";";

	$("#" + containerId).attr("style", sizestring);
}

/**
 * Sets up display values for sort icons, ensuring they are in the proper state 
 * @param  {FilterObject} filter - an item from the global filters array which specifies sort options and properties.
 * @see filters
 */
function setButtonsFromFilters(filter) {
	// after a grid refresh all the damn buttons may be missing that
	// were created by a click event
	if (filter.Direction != SortOptions.None) {
		// if order button is not found add it.
		if ($("#" + filter.Column.OrderButtonName).length == 0) {
			$("<span>")
				.attr("id", filter.Column.OrderButtonName)
				.attr("data-col", id)
				.appendTo(filter.Column.HeaderDiv());

			$("#" + filter.Column.OrderButtonName).click(function() {
				var id = $(this).attr("data-col");
				updateSortPriorities(id);
				Resort();
				setGrid(globData);
			});
		}

		$("#" + filter.Column.SortButtonName).addClass("arrowactive");
	}

	// apply display logic.
	switch (filter.Direction) {
		case SortOptions.Descending:
			// add sort priority control next to sort arrow

			// transform icon to active and turn right side up to indicate ascending order sort

			break;

		case SortOptions.Ascending:
			$("#" + filter.Column.SortButtonName).addClass("invertrotate");
			break;

		case SortOptions.None:
			$("#" + filter.Column.SortButtonName).removeClass(
				"invertrotate"
			);
			//revert sort arrow to original appearance
			$("#" + filter.Column.SortButtonName).removeClass("arrowactive");
			// remove sort priority control
			$("#" + filter.Column.OrderButtonName).remove();
			break;
	}
}

/**
 * Takes json data provided by the backend and populates the grid with it.
 * @param  {TaskDataObject[]} data - contains an array of TaskObjectData
 * @see getTasks
 * @see globData
 */
function setGrid(data) {
	
	showLoad(true);
	
	var taskdiv = $("#taskcontainer");

	// clear data and header rows
	taskdiv.children().remove("div");

	// var headercont = $('<div>')
	//                  .attr('id','headerdiv')
	//                  .attr('style',"grid-column-start:span "+ countColumns()+
	//                  "; position:sticky; top:0;  grid-row-start:span 2")
	//                  .appendTo(t);

	setContainerProps("taskcontainer");

	// set up headers and links
	resetColumns();
	var column = nextColumns();

	while (column != null) {
		var newheader = addColumnHeader(column, taskdiv);
		addLineBreak(newheader);
		var button = addSortIcon(column, newheader);

		// add click event handler to sort arrow icon next to header
		$(button).click(sortButtonClick);

		column = nextColumns();
	}

	addOptionPane(taskdiv);

	// build hide list

	var hide=[];

	for (index in Filters)
	{
		if (Filters[index].HideEmpty)
		{
			hide.push(Filters[index].Column.DataId);
		}
	}

	// populate grid with provided data
	for (item of data) {
		//  var item = data[id]

		var showthis = true;

		for (i in hide)
		{
			if ( EmptyValue(item[hide[i]])) { showthis=false; break;}
		}

		if (showthis)
		{
		resetColumns();
		var column = nextColumns();

		while (column != null) {
			var datapiece = "";
			//determine how to display items
			switch (column.Handler) {
				case HandlerOptions.Priority:
					switch (item[column.DataId]) {
						case "L":
							datapiece = "Low";
							break;
						case "M":
							datapiece = "Medium";
							break;
						case "H":
							datapiece = "High";
							break;
						default:
							datapiece = " ";
							break;
					}
					break;

				case HandlerOptions.Tags:
					if (typeof item[column.DataId] != "undefined") {
						for (tag of item[column.DataId]) {
							var newtag = $("<span>")
								.attr("id", "tag" + tag + item.uuid)
								.attr("data-uuid", item.uuid)
								.attr("data-tag", tag)
								.addClass("tagitem")
								.html("+" + tag);

							var taghtml = newtag.prop("outerHTML");
							//     console.log(taghtml);
							datapiece += taghtml + " ";
						}
					}
					break;

				case HandlerOptions.None:
					datapiece = item[column.DataId];
					break;
			}

			//  if (column.Handler==HandlerOptions.Tags)
			//  {
			//   console.log(datapiece);
			//  }

			$("<div>")
				.attr("data-uuid", item.uuid)
				.attr("data-id", column.HeaderId)
				.html(datapiece)
				//.outerWidth(column.Width)
				.addClass("dataitem")
				.appendTo(taskdiv);

			column = nextColumns();
		}

		$(".dataitem").dblclick(function() {
			var id = $(this).attr("data-id");
			var uuid = $(this).attr("data-uuid");

			var column = Filters[id].Column;

			if (column.Editable) {
				"<textarea>"
					.attr("id", id + "editor")
					.attr("style", "width:100%;height:100%")
					.val(ByUUID[uuid])
					.prop("outerHTML");
			}
		});

		}
	}

	//reset button state from filters
	for (id in Filters) {
		setButtonsFromFilters(Filters[id]);
	}

	refreshSortPriorities();

	showLoad(false);
}

var OptionsPane=null;
var downSortCheck=null;
var DownSortOptionsPane=null;
/**
 * Creates the search options panel
 * @param  {JQuery} container - container to append the options panel to
 */
function addOptionPane(container) {


	OptionsPane = SpanAllColumns( addDiv("searchoptionspane",container))
	.addClass("border").addClass("optionspane");

	//TODO: add 3 state master, color code the box grey when other values are selected but not all
	// on clicking while grey change all values to true.
	// create checkbox group for downsorting all empty values, add gear icon for later.
	 downSortCheck = addCheckGroup(
		"DownSortMaster",
		OptionsPane,
		"Sort empty values to the bottom ?",
		Filters[Columns[0].HeaderId].EmptyToBottom,
		false
	).attr('style','display:inline').children('input');

	$(downSortCheck).change(DownSortChange);

	// add settings icon
	var settingsIcon = addIcon("/images/settings.png", OptionsPane, "downsortoptions", false);

	settingsIcon.attr("style", "margin-left:5px;padding-left:0px;");
	settingsIcon.click(DownSortOptionsClick);

	// create the hidden div that contains specific checkboxes for each column and an all
	DownSortOptionsPane = addDiv("forwhichdownsortdiv",OptionsPane).attr("style", "padding-left:10px");
	
	resetColumns();

	var column = nextColumns();

	while (column != null) {
	var check=	 addCheckGroup(
			column.DownSortCheckName,
			DownSortOptionsPane,
			column.HeaderId,
			Filters[column.HeaderId].EmptyToBottom,
			false
		).attr('style','display:inline').
		children('input');

		$(check).attr('data-column',column.FilterIndex);

	var hidecheck = addCheckGroup(
		column.HideEmptyCheckName,
		DownSortOptionsPane,
		"Hide ?",
		Filters[column.FilterIndex].HideEmpty,
		true).attr('style','display:inline;').children('input');

	addLineBreak(DownSortOptionsPane);

	hidecheck.attr('data-id',column.FilterIndex);
	hidecheck.change(hideCheckChange);

	column = nextColumns();
	}	

	$(DownSortOptionsPane).hide();
}

/**
 * Event handler for hide checkboxes
 */
function hideCheckChange()
{
	var key = $(this).attr('data-id');
		
	Filters[key].HideEmpty = $(this).prop('checked');

	setGrid(globData);

	DownSortOptionsPane.show();
	
}

/**
 * Event handler sparked by clicking on of the sort icons.
 */
function sortButtonClick() {
	var id = $(this).attr("data-col");
	// console.log('id discovered was'+ id);

	var f = Filters[id];

	switch (f.Direction) {
		case SortOptions.None:
			f.Direction = SortOptions.Ascending;
			f.Priority = getMaxPriority() + 1;
			break;

		case SortOptions.Ascending:
			Filters[id].Direction = SortOptions.Descending;
			break;

		case SortOptions.Descending:
			Filters[id].Direction = SortOptions.None;
			removeOrderPriorityById(id);
			break;
	}

	setButtonsFromFilters(f);
	refreshSortPriorities();
	Resort();
	setGrid(globData);
}

/**
 * Ensures the numbers in all the sort priorities in the grid are correct
 */
function refreshSortPriorities() {
	for (filterId in Filters) {
		var f = Filters[filterId];

		if (f.Priority > 0) {
			$("#" + f.Column.OrderButtonName).text(f.Priority);
		}
	}
}
/**
 * Downsort gear icon click event
 */
function DownSortOptionsClick()
{
	if (DownSortOptionsPane.is(':visible'))
	{
		DownSortOptionsPane.fadeOut();
	}
	else
	{
		DownSortOptionsPane.fadeIn();
	}
}

/**
 * The change event handler for the master downsort checkbox
 */
function DownSortChange()
{
	ToggleChangeHandlersCheck(false);

	if ($(this).prop('indeterminate')|| $(this).prop('checked'))
	{
		// either some of the filters are checked or all of them are now supposed to be.
		$(this).prop('indeterminate',false);
		$(this).prop('checked',true);

		for (i in Filters)
		{
			console.log(i);
			var check = Filters[i].Column.DownSortCheck();
			check.prop('checked',true);
			Filters[i].EmptyToBottom = true;
		}
	}
	else 
	{
		// else its now not checked, update all the others accordingly
		for (i in Filters)
		{
			var check = Filters[i].Column.DownSortCheck();
			check.prop('checked',false);
			Filters[i].EmptyToBottom = false;
		}
	}
	
	ToggleChangeHandlersCheck(true);
	Resort(globData);
}

/**
 * Generic event handler for a single filter checkbox for downsort option
 */
function DownSortFilterChange()
{
	
	var key = $(this).attr('data-column');
			   Filters[key].EmptyToBottom= $(this).prop('checked');

	console.log(key);

	var filter = Filters[key];
	
	// update the filter
	filter.EmptyToBottom = $(this).prop('checked');

	ToggleChangeHandlersCheck(false);

	if (AnyChecked() && !AllChecked())
	{
		downSortCheck.prop('indeterminate',true);
		downSortCheck.prop('checked',false);
	}
	else if (AllChecked())
	{
		downSortCheck.prop('indeterminate',false);
		downSortCheck.prop('checked',true);
	}
	else
	{
		// none have been checked
		downSortCheck.prop('indeterminate',false);
		downSortCheck.prop('checked',false);		
	}

	ToggleChangeHandlersCheck(true);
	Resort(globData);
}

/**
 * Are any of the downsort filters checked ?
 */
function AnyChecked()
{
	var checked = false;

	for (i in Filters)
	{
		checked = checked || Filters[i].Column.DownSortCheck().prop('checked');
	}

	return checked;
}

/**
 * Are all the column downsort empty inputs checked ?
 */
function AllChecked()
{
	var checked = true;

	for (i in Filters)
	{
		checked = checked && Filters[i].Column.DownSortCheck().prop('checked');
	}

	return checked;
}

/**
 * Switches changed event on and off on related filters to prevent event cascade
 * @param  {boolean} on - switch the filters on or off ?
 */
function ToggleChangeHandlersCheck(on)
{

	resetColumns();

	var column = nextColumns();

	if (on)
	{
		downSortCheck.change(DownSortChange);
	}
	else
	{
		downSortCheck.unbind('change');
	}

	while (column !=null)
	{

		var check = column.DownSortCheck();

		if (on)
		{
			check.change(DownSortFilterChange);
		}
		else
		{
			check.unbind('change');
		}

		column = nextColumns();
	}
	
}