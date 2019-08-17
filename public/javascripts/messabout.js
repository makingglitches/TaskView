var testdata = [
	{
		id: 0,
		description: 'Carjack one of them and return to wyoming',
		end: '20190815T234936Z',
		entry: '20190727T151449Z',
		modified: '20190815T234936Z',
		priority: 'L',
		project: 'Project Pitchfork',
		status: 'completed',
		uuid: 'bac1f546-13fc-4a25-9b62-d42c68222740',
		urgency: 2.90959
	},

	{
		id: 4,
		description: 'Make better plan for leaving',
		entry: '20190727T151048Z',
		modified: '20190727T153322Z',
		priority: 'H',
		status: 'pending',
		uuid: 'f39409a4-92a7-4b2a-98a9-d657d19b2026',
		urgency: 6.10959
	},
	{
		id: 0,
		description: 'kill john zimmerman at the first opportunity',
		end: '20190815T234930Z',
		entry: '20190727T135251Z',
		modified: '20190815T234930Z',
		priority: 'H',
		project: 'Project Pitchfork',
		status: 'completed',
		uuid: '4dfc8439-53b0-4aae-abd2-08ac06a22819',
		urgency: 7.10959
	},
	{
		id: 0,
		description: 'Kill one of them',
		end: '20190815T234925Z',
		entry: '20190727T134734Z',
		modified: '20190815T234925Z',
		priority: 'H',
		project: 'Project Pitchfork',
		status: 'completed',
		uuid: 'fc539f09-ac0d-41fa-b22d-3e8ce0b999b8',
		urgency: 7.10959
	},
	{
		id: 0,
		description: 'Do not give nester what he wants, disrupt their childrape inventory instead',
		end: '20190727T150551Z',
		entry: '20190727T134627Z',
		modified: '20190727T150551Z',
		priority: 'H',
		status: 'completed',
		uuid: '13b3b31f-c302-40dd-9b22-15aa26fe452b',
		urgency: 6.10959
	}
];

function gridSort(data) {
	data.sort(function(d1, d2) {
		var UndefinedStatusresult = 
		UndefinedStatus(d1['priority'], d2['priority'], 1, false);
		console.log(d1['priority']+"<-->"+d2['priority']);		
		if (UndefinedStatusresult != 5 && UndefinedStatusresult != SortResult.AreEqual) 
		return UndefinedStatusresult;
		console.log('past undefined priority');

		var NullOrEmptyStringresult = NullOrEmptyString(d1['priority'], d2['priority'], 1, false);
		if (NullOrEmptyStringresult != 5 && NullOrEmptyStringresult != SortResult.AreEqual)
			return NullOrEmptyStringresult;
		
		console.log('past null priority');

		var PrioritySortresult = PrioritySort(d1['priority'], d2['priority'], 1);
		if (PrioritySortresult != 5 && PrioritySortresult != SortResult.AreEqual) return PrioritySortresult;
		console.log("past priority sort");
		

		console.log(d1['status']+"<==>"+ d2['status']);

		var UndefinedStatusresult = UndefinedStatus(d1['status'], d2['status'], 2, false);
		if (UndefinedStatusresult != 5 && UndefinedStatusresult != SortResult.AreEqual) return UndefinedStatusresult;
			console.log('past undefined status');

		var NullOrEmptyStringresult = NullOrEmptyString(d1['status'], d2['status'], 2, false);
		if (NullOrEmptyStringresult != 5 && NullOrEmptyStringresult != SortResult.AreEqual)
			return NullOrEmptyStringresult;

			console.log('past nul status');
		
			var DefaultCompareresult = DefaultCompare(d1['status'], d2['status'], 2);
		if (DefaultCompareresult != 5 && DefaultCompareresult != SortResult.AreEqual) return DefaultCompareresult;
		console.log('past default status');
		console.log('returning equal');
		return SortResult.AreEqual;
	});
}

console.log(testdata);
gridSort(testdata);
console.log(testdata);
