/* 
 ***** BEGIN LICENSE BLOCK ***** 
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1 
 * 
 * The contents of this file are subject to the Mozilla Public License Version 
 * 1.1 (the "License"); you may not use this file except in compliance with 
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis, 
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License 
 * for the specific language governing rights and limitations under the 
 * License. 
 * 
 * Contributor(s): Steven D Miller (Copart) <stevendm(at)rellims.com>
 *                 Niko Berger <niko.berger(at)corinis.com> 
 * 
 * Alternatively, the contents of this file may be used under the terms of 
 * either the GNU General Public License Version 2 or later (the "GPL"), or 
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"), 
 * in which case the provisions of the GPL or the LGPL are applicable instead 
 * of those above. If you wish to allow use of your version of this file only 
 * under the terms of either the GPL or the LGPL, and not to allow others to 
 * use your version of this file under the terms of the MPL, indicate your 
 * decision by deleting the provisions above and replace them with the notice 
 * and other provisions required by the GPL or the LGPL. If you do not delete 
 * the provisions above, a recipient may use your version of this file under 
 * the terms of any one of the MPL, the GPL or the LGPL. 
 * 
 * 
 ***** END LICENSE BLOCK ***** */
"use strict";
if(!synckolab) var synckolab={};

synckolab.contactConflict = {

	localCard:null,
	serverCard: null,
	conflictsArray: null,
	conflictResolution: null,

	doOK: function ()
	{
		//User submitted, now check, did user accept only server, only local, or combination of both
		var bServerOnly = true;
		var bLocalOnly = true;
		var i;
		for ( i=0 ; i < this.conflictsArray.length ; i++ ) {
			if (document.getElementById(this.conflictsArray[i]).selectedIndex !== 0 ) {
				bServerOnly = false;
			}
			if (document.getElementById(this.conflictsArray[i]).selectedIndex !== 1 ) {
				bLocalOnly = false;
			}
		}
		if ( bServerOnly ) {
			this.conflictResolution.result = 1;
		} else if ( bLocalOnly ) {
			this.conflictResolution.result = 2;
		} else {
			//Updating both copies with new values
			for ( i=0 ; i < this.conflictsArray.length ; i++ ) {
				var serverValue = synckolab.addressbookTools.getCardProperty(this.serverCard, this.conflictsArray[i]);
				var localValue = synckolab.addressbookTools.getCardProperty(this.localCard, this.conflictsArray[i]);
				if (document.getElementById(this.conflictsArray[i]).selectedIndex === 0) {
					synckolab.addressbookTools.setCardProperty(this.localCard, this.conflictsArray[i], serverValue);
				} else {
					synckolab.addressbookTools.setCardProperty(this.serverCard, this.conflictsArray[i], localValue);
				}
			}
			this.conflictResolution.result = 3;
		}
		return true;
	},

	doCancel: function ()
	{
		this.conflictResolution.result = 0;
		return true;
	},

	keepServer: function ()
	{
		var i;
		for ( i=0 ; i < this.conflictsArray.length ; i++ ) {
			if(document.getElementById(this.conflictsArray[i])) {
				document.getElementById(this.conflictsArray[i]).selectedIndex = 0;
			}
			else {
				synckolab.tools.logMessage("unable to find element for conflict " + this.conflictsArray[i], synckolab.global.LOG_ERROR + synckolab.global.LOG_AB);
			}
		}
		return false;
	},
	keepLocal: function ()
	{
		for (var i=0 ; i < this.conflictsArray.length ; i++ ) {
			var e = document.getElementById(this.conflictsArray[i]);
			if (!e) {
				continue;
			}
			e.selectedIndex = 1;
		}
		return false;
	},
	
	init: function ()
	{
		this.conflictsArray = window.arguments[0];
		this.conflictResolution = window.arguments[1];
		this.serverCard = window.arguments[2];
		this.localCard = window.arguments[3];
			
		//Show static elements for the following so that we always know who's record we are looking at	
		document.getElementById("firstNameStatic").value = synckolab.addressbookTools.getCardProperty(this.localCard, 'FirstName');
		document.getElementById("lastNameStatic").value = synckolab.addressbookTools.getCardProperty(this.localCard, 'LastName');
		document.getElementById("displayNameStatic").value = synckolab.addressbookTools.getCardProperty(this.localCard, 'DisplayName');
		document.getElementById("nickNameStatic").value = synckolab.addressbookTools.getCardProperty(this.localCard, 'NickName');
		
		var serverValue;
		var localValue;
		
		//Loop through the conflicted fields, set their current values, unhide from the dialog
		for (var i=0 ; i < this.conflictsArray.length ; i++ ) {
			serverValue = synckolab.addressbookTools.getCardProperty(this.serverCard, this.conflictsArray[i]);
			localValue = synckolab.addressbookTools.getCardProperty(this.localCard, this.conflictsArray[i]);
			
			if (serverValue === 0 || serverValue === null || serverValue === "0" || serverValue === "null")
				serverValue = "";

			if (localValue === 0 || localValue === null || localValue === "0" || localValue === "null")
				localValue = "";

				
			var e = document.getElementById(this.conflictsArray[i]); //Field Element
			if(!e) {
				continue;
			}
			var innerBox = e.parentNode;
			//var outerBox = e.parentNode.parentNode; If it wasnt a grid then it would be this simple
			var outerBox = e.parentNode.parentNode.parentNode.parentNode;
			
			//Unhide the conflicted field
			outerBox.hidden = false;
			innerBox.hidden = false;
			
			//hide the static labels if any
			if (document.getElementById(this.conflictsArray[i]+"Static")) {
				document.getElementById(this.conflictsArray[i]+"Static").hidden = true;
			}
			
			e.hidden = false; //Name is hidden by default, so always unhide just in case
			if (this.conflictsArray[i] === "preferMailFormat" ) {
				//Handling the special case of Email format preference
				switch ( serverValue ) {
				case 1 :
					e.appendItem("Plain Text [Server]",1);
					break;
				case 2 :
					e.appendItem("HTML [Server]",2);
					break;
				default :
					e.appendItem("Unknown [Server]",0);
				break;
				}
				switch ( localValue ) {
				case 1 :
					e.appendItem("Plain Text [Local]",1);
					break;
				case 2 :
					e.appendItem("HTML [Local]",2);
					break;
				default :
					e.appendItem("Unknown [Local]",0);
				break;
				}
			} else {
				e.appendItem(serverValue +" [Server]",serverValue);
				e.appendItem(localValue +" [Local]",localValue);
			}
			e.selectedIndex = 0; //Set the current value to SERVER
		}
	}

};
