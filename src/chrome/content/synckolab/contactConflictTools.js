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
 * Contributor(s): Steven D Miller (Copart) <stevendm@rellims.com>
 *                 Niko Berger <niko.berger@corinis.com> 
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
 
//Returns an array of fields that are in conflict
function contactConflictTest(serverCard,localCard)
{
	var conflictArray = new Array(); //conflictArray.length

	//Fields to look for
	var fieldsArray = new Array(
		"firstName","lastName","displayName","nickName",
		"primaryEmail","secondEmail","preferMailFormat","aimScreenName",
		"workPhone","homePhone","faxNumber","pagerNumber","cellularNumber",
		"homeAddress","homeAddress2","homeCity","homeState","homeZipCode","homeCountry","webPage2",
		"jobTitle","department","company","workAddress","workAddress2","workCity","workState","workZipCode","workCountry","webPage1",
		"custom1","custom2","custom3","notes");

	for( i=0 ; i < fieldsArray.length ; i++ ) {
		if ( eval("localCard."+fieldsArray[i]) != eval("serverCard."+fieldsArray[i]) )
			conflictArray.push(fieldsArray[i]);
	}
	return conflictArray;
}
