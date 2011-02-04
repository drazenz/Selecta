/*
 * 	Copyright (C) 2011 Drazen Zaric <drazen.zaric@gmail.com>
 *
 *	This file is part of Selecta - an Amarok script.
 *
 *	Selecta is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *
 *	Selecta is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU General Public License for more details.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with Selecta.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */

function IndexUpdateDialog(){
	var ui_loader = new QUiLoader(this);
	var ui_file = new QFile(Amarok.Info.scriptPath()+'/code/ui/index_update_dialog.ui');
	
	ui_file.open(QIODevice.ReadOnly);
	this.ui=ui_loader.load(ui_file,this);
	ui_file.close();	
	
	this.ui.currentArtistLabel.text='';
	this.ui.progressLabel.text='';
	this.ui.progressBar.text='';
	this.ui.progressBar.value=0;	
	Amarok.debug(QDialogButtonBox.StandardButton('Cancel'));
	this.ui.buttonBox.button(QDialogButtonBox.Cancel).text='Finish later';
}




