function gridSort(data) {
	data.sort(function(d1, d2) {
		var UndefinedStatusresult = UndefinedStatus(d1['priority'], d2['priority'], 1, false);
		if (UndefinedStatusresult != 5 && UndefinedStatusresult != SortResult.AreEqual) return UndefinedStatusresult;
		var NullOrEmptyStringresult = NullOrEmptyString(d1['priority'], d2['priority'], 1, false);
		if (NullOrEmptyStringresult != 5 && NullOrEmptyStringresult != SortResult.AreEqual)
			return NullOrEmptyStringresult;
		var PrioritySortresult = PrioritySort(d1['priority'], d2['priority'], 1);
		if (PrioritySortresult != 5 && PrioritySortresult != SortResult.AreEqual) return PrioritySortresult;
		var UndefinedStatusresult = UndefinedStatus(d1['status'], d2['status'], 2, false);
		if (UndefinedStatusresult != 5 && UndefinedStatusresult != SortResult.AreEqual) return UndefinedStatusresult;
		var NullOrEmptyStringresult = NullOrEmptyString(d1['status'], d2['status'], 2, false);
		if (NullOrEmptyStringresult != 5 && NullOrEmptyStringresult != SortResult.AreEqual)
			return NullOrEmptyStringresult;
		var DefaultCompareresult = DefaultCompare(d1['status'], d2['status'], 2);
		if (DefaultCompareresult != 5 && DefaultCompareresult != SortResult.AreEqual) return DefaultCompareresult;
		return SortResult.AreEqual;
	});
}
