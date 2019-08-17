/**
 * Constructor for ColumnObject
 * @constructor
 * @param  {number} gridNumber - the grid-column value of this column
 * @param  {string} headerId - the textual header column name
 * @param  {string} dataId - the text index of the data array returned by task export
 * @param  {number} width  - column width in px
 * @param  {string} displayHandler - DisplayHandler value indicating how the code should display this value
 * @param  {string} updateCommand - the command for updating the task in taskwarrior $i is id ${n} are parameters
 * @param  {string} editorType=EditorType.None - The html editor type handler specified in EditorType
 */
function ColumnObject(
	gridNumber,
	headerId,
	dataId,
	width,
	displayHandler,
    updateCommand,
    editorType = EditorType.None,
    dataBound = true
) {
	this.Number = gridNumber;
	this.HeaderId = headerId;
	this.DataId = dataId;
	this.Width = width;
	this.Handler = displayHandler;
	this.IsEditable = editorType != EditorType.None;
	this.UpdateCommand = updateCommand;
	this.Editor = editorType;
	this.OrderButtonName = headerId + "order";
	this.SortButtonName = headerId + "sort";
	this.HeaderDivName = headerId + "head";
    this.DataBound = dataBound;
	this.DownSortCheckName = "downsort"+headerId+"check";
	this.FilterIndex = this.HeaderId;

	this.DownSortCheck= function() 
	{
		return $('#'+this.DownSortCheckName);
	}
	
	this.OrderButton = function() {
		return $("#" + this.OrderButtonName);
	};
	this.SortButton = function() {
		return $("#" + this.SortButtonName);
	};
	this.HeaderDiv = function() {
		return $("#" + this.HeaderDivName);
	};
	
}
