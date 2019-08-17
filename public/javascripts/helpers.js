/**
 * Add sort icon to the specified container
 * really just seperating these to clean up code
 * @param  {string} src - image source path
 * @param  {JQuery} container - div selected via jquery
 * @param  {string} id='' - id of the new button
 * @param  {boolean} linebreak=true - add a <br> tag ?
 * @returns {JQuery} new image tag inserted in dom
 */
function addIcon(src, container, id = "", linebreak = true) {
	var i = $("<img>")
		.attr("id", id)
		.attr("src", src)
		.addClass("resizeimage")
		.appendTo(container);

	if (linebreak) {
		addLineBreak(container);
	}

	return i;
}
/**
 * Adds a checkbox input with a label in a <span> to the selected container
 * @param  {string} name - input name 
 * @param  {JQuery} container - selected container to put checkbox in
 * @param  {string} text - a textual label
 * @param  {boolean} linebreak=true - add a <br> tag to end ?
 * @returns {JQuery} toplevel span containing the checkbox and label items.
 */
function addCheckGroup(name, container, text, initialvalue=false,linebreak = true) {
	var contSpan = $("<span/>").attr("id", name + "span").appendTo(container);

	$("<input/>")
		.attr("type", "checkbox")
		.attr("id", name)
		.attr('name',name)
		.appendTo(contSpan)
		.prop('checked',initialvalue);
		

	addTextSpan(text, contSpan);

	if (linebreak) {
		addLineBreak(contSpan);
	}

	return contSpan;
}

/**
 * Adds a span tag with text
 * @param  {string} text - text to display
 * @param  {JQuery} container - container selection to add to
 * @param  {} id='' - optional id of span
 */
function addTextSpan(text, container, id = "") {
	$("<span/>").text(text).attr("id", id).appendTo(container);
}

/**
 * Simply adds a <br> tag to a container at the end of its present children() array.
 * @param  {JQuery} container - container object selected via jquery
 */
function addLineBreak(container) {
	$("<br>").appendTo(container);
}

/**
 * Animate the model div 
 * @param  {JQuery} container - selected modal div
 * @param  {boolean} show=true - hide or show the div
 */
function doModal(container, show = true) {
	if (show) {
		$("#modaldiv").animate(
			{ height: "100%", width: "100%", left: "0%", top: "0%" },
			"slow"
		);
	}
	else {
		$("#modaldiv").animate(
			{ height: "0%", width: "0%", left: "50%", top: "50%" },
			"slow"
		);
	}
}

/**
 * Adds a column header to the data grid
 * @param  {ColumnObject} column - column object from the globcal columns array
 * @param  {JQuery} container - selected jquery element for the taskcontainer eg grid
 * @see columns
 * @returns {JQuery} the new div
 */
function addColumnHeader(column, container) {
	// add cell header div
	var c = $("<div/>")
		.attr("id", column.HeaderDivName)
		// minus 10 for padding left + right
		// .attr('style','width:'+(column.Width-15)+"px;")
		.attr("style", "grid-column:" + column.Number)
		//.outerWidth(column.Width)
		.addClass("cellheader")
		.html(column.HeaderId)
		.appendTo(container);

	return c;
}

/**
 * Adds a sort icon for the column.
 * @param  {ColumnObject} column - column from the global columns array
 * @param  {JQuery} container - the div to add the button to selected by jquery
 * @returns {JQuery} - the created sort icon
 */
function addSortIcon(column, container) {
	// add sort icon next to header text
	var s = $("<img>")
		.addClass("resizeimage")
		.attr("id", column.SortButtonName)
		.attr("src", "images/inactive arrow.png")
		.attr("data-col", column.HeaderId)
		.attr("data-dataid", column.DataId)
		.appendTo(container);

	return s;
}

function addDiv(id,container)
{
	var d = $("<div>")
	.attr('id',id)
	.appendTo(container);
	return d;
}
