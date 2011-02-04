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

function ActionHandler(index){
	this.index=index;
}

ActionHandler.prototype.play=function(){
	if(Amarok.Script.readConfig('selecta-data_dir','')=='' || this.index.artistTags==null){
		Amarok.alert('Selecta: No index data found. Please update Selecta index');
	}
	else{
		var pl_gen=new PlaylistGenerator(this.index);
		playlist_urls=pl_gen.generateFromAmarokPlaylist();
		Amarok.Playlist.addMediaList(playlist_urls);
		if(Amarok.Engine.engineState()==2){
			//if amarok is stopped play immediately
			Amarok.Engine.Play();
		}	
	}
}

ActionHandler.prototype.update_index=function(){
	var updater=new IndexUpdater(this.index);
	updater.update();	
}




