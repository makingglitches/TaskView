/**
 * Constructor for filterobject
 * @param  {SortOptions} direction - the direction to sort the column
 * @param  {number} prioity - the order in which to sort this column
 * @param  {ColumnObject} column - the column definition to associate with this filter
 * @param  {boolean} emptytoBottom=false - should we sort empty values to the bottom ?
 */
function FilterObject(direction,prioity,column,emptytoBottom=false,hideEmpty=false)
{
    this.Direction=direction;
    this.Priority = prioity;
    this.Column=column;
    this.id = column.HeaderId;
    this.EmptyToBottom = emptytoBottom;
    this.HideEmpty=hideEmpty;
}