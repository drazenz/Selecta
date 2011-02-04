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

Importer.include('code/Index.js');
Importer.include('code/Heap.js');
Importer.include('code/ActionHandler.js');
Importer.include('code/PlaylistGenerator.js');
Importer.include('code/LastFM.js');
Importer.include('code/IndexUpdater.js');

function entry(){	
	
	var data_dir=Amarok.Script.readConfig('selecta-data_dir','');
	Amarok.debug(data_dir);
	invIndex=new Index();
	if(data_dir!=''){
		dataFilePath=data_dir+'/taginfo';
		Amarok.debug(dataFilePath);
		invIndex.buildFromFile(dataFilePath);
		Amarok.debug('loaded tag data');
	}
	setupMenus();	
}

function setupMenus(){
	Amarok.Window.addToolsMenu("SelectaToolMenu","Selecta");
	var selectaMenu=new QMenu("Selecta");
	Amarok.Window.ToolsMenu['SelectaToolMenu'].setMenu(selectaMenu);
	playAction=selectaMenu.addAction("Play")
	selectaMenu.addSeparator();
	update_index_action=selectaMenu.addAction("Update Index");
	var actionHandler=new ActionHandler(invIndex);
	playAction['triggered'].connect(actionHandler,'play');	
	update_index_action['triggered'].connect(actionHandler,'update_index');
}
