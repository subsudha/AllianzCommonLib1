/**
 * @param {string} sendto
 * @param {string} subject
 * @param {string} body
 *
 * @return {void}
 */
(function (sendto, subject, body) {
	var server=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Mail","SMTP","mail_server_name");
	var port=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Mail","SMTP","mail_server_port");
	var sender=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Mail","SMTP","mail_sender");

	var myEmailMessage = new EmailMessage() ;
	myEmailMessage.smtpHost = server;
	myEmailMessage.fromAddress = sender;
	myEmailMessage.toAddress = sendto;
	myEmailMessage.subject = subject;
	myEmailMessage.addMimePart(body , "text/html");
	myEmailMessage.sendMessage();
});
