/**
 * @param {REST:RESTHost} host
 * @param {string} operationName
 *
 * @return {string}
 */
(function (host, operationName) {
	var operationIds = host.getOperations();

	var operation = null;

	for(var i in operationIds){
		var cOp = host.getOperation(operationIds[i]);
		System.log(cOp.name);
		if(cOp.name == operationName){
			operation = cOp;
		}
	}

	return operation;
});
