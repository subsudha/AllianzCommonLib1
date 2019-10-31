/**
 * @param {string} categoryPath
 * @param {string} element
 * @param {string} attribute
 *
 * @return {Any}
 */
(function (categoryPath, element, attribute) {
	var cat = Server.getConfigurationElementCategoryWithPath(categoryPath);

	if (cat == null)
		throw "Configuration element category " + categoryPath + " not found";

	for each (var e in cat.configurationElements) {
		if (e.name == element) {
			var a = e.getAttributeWithKey(attribute);
			if (a == null)
				throw "Attribute " + attribute + " not found in element " + categoryPath + "/" + element;
			else 
				return a.value;
		}
	}
});
