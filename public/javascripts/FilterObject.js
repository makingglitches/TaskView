function FilterObject(direction,prioity,column)
{
    this.Direction=direction;
    this.Priority = prioity;
    this.Column=column;
    this.id = column.HeaderId;
}