

function PrioritySort(s1,s2,sortOptions)
{

    // if priority is high obviously that should be
    // greater than low, alphanumerically however L > H  
    var comp1 = (s1 == 'L'?1:
                (s1 == 'M'?2:
                (s1 == 'H'?3:
                4))           
                );
    var comp1 = (s1 == 'L'?1:
                (s1 == 'M'?2:
                (s1 == 'H'?3:
                4))           
                );
}

function UndefinedStatus(s1,s2,sortOptions)
{

    // if both are undefined they are equal
    if ( typeof s1 == 'undefined' && typeof s2 == 'undefined')
    {
        return 0;
    }
    // if the first is undefined its less than the second
    else if (typeof s1 == 'undefined' && typeof s2 !='undefined')
    {
        return (sortOptions == SortOptions.Descending? -1: 1);
    }
    else if (typeof s1 != 'undefined' && typeof s2 == 'undefined')
    {
        return (sortOptions == SortOptions.Descending? 1 : -1);
    }
    else
    {
        // otherwise tell the parent function to skip
        // this test doesnt apply.
        return 5;
    }
}

function CompareTagArrays(tag1,tag2, sortOptions)
{

    var sorted1 = [];
    var sorted2 = [];

    for(i in tag1)
    {
        sorted1.push(tag1[i].toLowerCase());
    }

    for (i in tag2)
    {
        sorted2.push(tag2[i].toLowerCase());
    }

    
    sorted1.sort();
    sorted2.sort();
    
    var min = (sorted1.length > sorted2.length? sorted2.length:sorted1.length);

    var i=0;
    var comp=0;

    while (i < min && comp==0)
    {
        if (sorted1[i] > sorted2[i]) 
        { 
            comp = (sortOptions==SortOptions.Descending? 1: -1);
            break;
        }
        else if ( sorted1[i] < sorted2[i] )
        {
            comp = (sortOptions==SortOptions.Descending? -1 : 1);
            break;
        }
        i++;
    }

    return comp;
}