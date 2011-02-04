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

function ChooseDirectoryDialog(){
	var ui_loader = new QUiLoader(this);
	var ui_file = new QFile(Amarok.Info.scriptPath()+'/code/ui/choose_directory_dialog.ui');
	
	ui_file.open(QIODevice.ReadOnly);
	this.ui=ui_loader.load(ui_file,this);
	ui_file.close();		
	this.ui.locationEdit.text=(new QDir('Selecta')).absolutePath();	
	this.ui.locationChooseButton['clicked'].connect(this,'chooseDir');
}

ChooseDirectoryDialog.prototype.chooseDir=function(){
	var file_dialog=new QFileDialog(this);
	file_dialog.fileMode=QFileDialog.Directory;
	file_dialog.modal=true;	
	file_dialog.exec();
	
	if(file_dialog.result()==QDialog.Accepted){
		var selected_dir=file_dialog.selectedFiles()[0];
		this.ui.locationEdit.text=selected_dir;
	}	
}

