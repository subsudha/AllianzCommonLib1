/**
 * getOEFromHostname attempts to extract OE Code and Country from standard hostnames, eg ap1sgaztl0001, or sgazt0001.
 *
 * If successful a properties object is returned containing keys: code, country.
 *
 * Unsucessful attempts thrown an exception.
 * Test Comments. Please delete this line later.
 *
 * @param {string} hostname
 *
 * @return {Properties}
 */
(function (hostname) {
	var oe = new Properties();
	var regex = /^(?:ap\d){0,1}(\w{2})(\w{3})[ml]{0,1}\d{4}$/;
	var match = regex.exec(hostname);
	if (match.length == 3) {
		oe.put("country", match[1]);
		oe.put("code", match[2]);
	}
	else {
		throw "Cannot determine OE from hostname " + hostname;
	}

	return oe;
});
