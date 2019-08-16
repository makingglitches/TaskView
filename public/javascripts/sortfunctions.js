const SortResult = { SortLeftFirst: -1, SortRightFirst: 1, AreEqual: 0 };

// When the sort() function compares two values, it sends the values to the compare function, and sorts the values according to the returned (negative, zero, positive) value.

// If the result is negative a is sorted before b.

// If the result is positive b is sorted before a.

/**
 * Sort function for priority column
 * @param  {} s1
 * @param  {} s2
 * @param  {} sortOptions
 */
function PrioritySort(s1, s2, sortOptions) {
	console.log(sortOptions);

	// if priority is high obviously that should be
	// greater than low, alphanumerically however L > H
	var comp1 = s1 == "L" ? 1 : s1 == "M" ? 2 : s1 == "H" ? 3 : 4;
	var comp2 = s2 == "L" ? 1 : s2 == "M" ? 2 : s2 == "H" ? 3 : 4;

	if (comp1 == comp2) {
		return SortResult.AreEqual;
	}

	// sort blanks downwards
	if (comp1 == 4) {
		console.log("4");
		return SortResult.SortRightFirst;
	}

	if (comp2 == 4) {
		console.log("4");
		return SortResult.SortLeftFirst;
	}

	if (comp1 > comp2) {
		return sortOptions == SortOptions.Descending
			? SortResult.SortLeftFirst
			: SortResult.SortRightFirst;
	}
	else if (comp1 < comp2) {
		return sortOptions == SortOptions.Descending
			? SortResult.SortRightFirst
			: SortResult.SortLeftFirst;
	}

	return SortResult.AreEqual;
}

function UndefinedStatus(s1, s2, sortOptions) {
	// if both are undefined they are equal
	if (typeof s1 == "undefined" && typeof s2 == "undefined") {
		return 0;
	}
	else if (typeof s1 == "undefined" && typeof s2 != "undefined") {
		// if the first is undefined its less than the second
		return sortOptions == SortOptions.Descending ? -1 : 1;
	}
	else if (typeof s1 != "undefined" && typeof s2 == "undefined") {
		return sortOptions == SortOptions.Descending ? 1 : -1;
	}
	else {
		// otherwise tell the parent function to skip
		// this test doesnt apply.
		return 5;
	}
}

function CompareTagArrays(tag1, tag2, sortOptions) {
	var sorted1 = [];
	var sorted2 = [];

	for (i in tag1) {
		sorted1.push(tag1[i].toLowerCase());
	}

	for (i in tag2) {
		sorted2.push(tag2[i].toLowerCase());
	}

	sorted1.sort();
	sorted2.sort();

	var min =
		sorted1.length > sorted2.length ? sorted2.length : sorted1.length;

	var i = 0;
	var comp = 0;

	while (i < min && comp == 0) {
		if (sorted1[i] > sorted2[i]) {
			comp = sortOptions == SortOptions.Descending ? 1 : -1;
			break;
		}
		else if (sorted1[i] < sorted2[i]) {
			comp = sortOptions == SortOptions.Descending ? -1 : 1;
			break;
		}
		i++;
	}

	return comp;
}

function CompareStrings(s1, s2, sortOptions) {
	var comp1 = s1.toLowerCase();
	var comp2 = s1.toLowerCase();

	if (comp1 > comp2) {
		return sortOptions == SortOptions.Descending
			? SortResult.SortLeftFirst
			: SortResult.SortRightFirst;
	}
	else if (comp1 < comp2) {
		return sortOptions == SortOptions.Descending
			? SortResult.SortRightFirst
			: SortResult.SortLeftFirst;
	}

	return SortResult.AreEqual;
}

function DefaultCompare(s1, s2, sortOptions) {
	if (typeof s1 == "string" || typeof s2 == "string") {
		return CompareStrings(s1 + "", s2 + "", sortOptions);
	}

	if (s1 > s2) {
		return sortOptions == SortOptions.Descending
			? SortResult.SortLeftFirst
			: SortResult.SortRightFirst;
	}
	else if (s1 < s2) {
		return sortOptions == SortOptions.Descending
			? SortResult.SortRightFirst
			: SortResult.SortLeftFirst;
	}

	return SortResult.AreEqual;
}
