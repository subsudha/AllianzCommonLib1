/**
 * @param {Array/Any} pslist
 * @param {Array/string} passwordtoencrypt
 *
 * @return {Any}
 */
(function (pslist, passwordtoencrypt) {
	var ansibleusername=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Software","General","ansibleusername");
	var ansiblepassword=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Software","General","ansiblepassword");
	var ansibleport=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Software","General","ansibleport");
	var ansiblesynchronous=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Software","General","ansiblesynchronous");
	var ansibleserver=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Software","General","ansibleserver");
	var ansibleworkspace=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Software","General","ansibleworkspace");

	var playbookaccesstoken=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Software","General","playbookaccesstoken");
	var playbookaccessurl=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Software","General","windowsplaybookaccessurl");
	var playbookname=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Software","General","powershellplaybookinstallsoftwarename");
	var localplaybookname=System.getCurrentTime()+playbookname;

	var powershellserver=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Software","General","windowsserver");
	var powershellserverusername=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Software","General","windowsuser");
	var powershellserverpassword=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Software","General","windowspassword");

	var command1=System.getModule("com.allianz.common").getConfigItem("_Allianz/External Systems/Software","General","ansibleplaybookcmd") +
	             " --tags 'remote_call_powershell' --extra-vars 'script_access_token=" + playbookaccesstoken +
	             " ansible_user="
	var command2=" ansible_password=";
	var command3=" script_url=";
	var command4=" script=";
	var command5=" paramaters=";
	var command6="' -i "
	var command7=", " + ansibleworkspace + localplaybookname

	var consoleoutput = {};

	System.debug("Login ansible server "+ansibleserver+" at port "+ansibleport+" with user "+ansibleusername);
	session = new SSHSession(ansibleserver, ansibleusername, ansibleport);
	session.connectWithPassword(ansiblepassword);
	session.setEncoding("");
	System.debug("Download playbook from "+ playbookaccessurl + "/" +playbookname);
	session.executeCommand("wget -q -O "+ansibleworkspace + localplaybookname + " " +playbookaccessurl+ "/"+ playbookname + "?private_token=" + playbookaccesstoken, ansiblesynchronous);
	session.executeCommand("chmod o+r "+ansibleworkspace+localplaybookname, ansiblesynchronous);

	for(var i=0, len=pslist.length; i < len; i++){
  
	  var paramatersoutput = pslist[i].paramaters;
	  if (passwordtoencrypt != null && passwordtoencrypt.length > 0) {
	    for(var j=0, size=passwordtoencrypt.length; j < size; j++){
	       while(paramatersoutput.indexOf(passwordtoencrypt[j]) != -1) {
	         paramatersoutput=paramatersoutput.replace(passwordtoencrypt[j],"****")
	      }
	    }
	  }
	  System.debug("Running powershell script " + pslist[i].script + " with paramaters '" + paramatersoutput + "' ..." );

	  if (pslist[i].server != null && pslist[i].server != "") {
		 insatllfullcmd=command1+pslist[i].serverusername+
		                command2+pslist[i].serverpassword+
		                command3+pslist[i].scripturl+
		                command4+pslist[i].script+
		                command5+"\"" + pslist[i].paramaters + "\"" + 
		                command6+pslist[i].server+
		                command7;
	  } else {
	     insatllfullcmd=command1+powershellserverusername+
		                command2+powershellserverpassword+
		                command3+pslist[i].scripturl+
		                command4+pslist[i].script+
		                command5+"\"" + pslist[i].paramaters + "\"" + 
		                command6+powershellserver+
		                command7;
	  }
	  var insatllfullcmdoutput = insatllfullcmd;
	  while(insatllfullcmdoutput.indexOf(powershellserverpassword) != -1) {
	     insatllfullcmdoutput=insatllfullcmdoutput.replace(powershellserverpassword,"****")
	  }
	  while(insatllfullcmdoutput.indexOf(playbookaccesstoken) != -1) {
	     insatllfullcmdoutput=insatllfullcmdoutput.replace(playbookaccesstoken,"****")
	  }
	  if (passwordtoencrypt != null && passwordtoencrypt.length > 0) {
	    for(var j=0, size=passwordtoencrypt.length; j < size; j++){
	       while(insatllfullcmdoutput.indexOf(passwordtoencrypt[j]) != -1) {
	         insatllfullcmdoutput=insatllfullcmdoutput.replace(passwordtoencrypt[j],"****")
	      }
	    }
	  }
	  System.debug("Installation command: "+insatllfullcmdoutput);

	  try {
	    session.executeCommand(insatllfullcmd, ansiblesynchronous);
	    if (session.exitCode != 0) {
	      System.log("Failed to run the powersehll script "+ pslist[i].script);
	      System.debug(session.error);
	      consoleoutput[pslist[i].script] = {
	        exitcode: session.exitCode,
	        output: session.erro
	      }
	    } else {
	      System.log("Successfully run the powershell script "+ pslist[i].script);
	      System.debug(session.output);
	      consoleoutput[pslist[i].script] = {
	        exitcode: session.exitCode,
	        output: session.output
	      }
	    }
	  } catch (e) {
	    System.log("Failed to run the powersehll script "+ pslist[i].script + " with exception: " + e);
	    System.debug(session.error);
	    consoleoutput[pslist[i].script] = {
	      exitcode: session.exitCode,
	      output: session.erro
	    }
	  }
	}
  
	if (session) {
	  session.executeCommand("rm -rf "+ansibleworkspace+localplaybookname, ansiblesynchronous);
	  session.disconnect();
	}
	System.debug("Leave ansible server "+ansibleserver+" at port "+ansibleport+" with user "+ansibleusername);

	return consoleoutput;
});
