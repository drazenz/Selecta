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

function SelectaConfig(){}

SelectaConfig.get_playlist_length=function(){
	return parseInt(Amarok.Script.readConfig('selecta-playlist_length','100'));
}

SelectaConfig.set_playlist_length=function(length){
	Amarok.Script.writeConfig('selecta-playlist_length',''+length);
}

SelectaConfig.get_playlist_diversity=function(){
	return parseFloat(Amarok.Script.readConfig('selecta-playlist_diversity','13'));	
}

SelectaConfig.set_playlist_diversity=function(diversity){
	Amarok.Script.writeConfig('selecta-playlist_diversity',''+diversity);	
}

SelectaConfig.get_data_dir=function(){
	return (Amarok.Script.readConfig('selecta-data_dir',''));	
}

SelectaConfig.set_data_dir=function(dir){
	Amarok.Script.writeConfig('selecta-data_dir',''+dir);	
}

SelectaConfig.get_look_at=function(){
	return parseInt(Amarok.Script.readConfig('selecta-look_at','3'));	
}

SelectaConfig.set_look_at=function(n){
	Amarok.Script.writeConfig('selecta-look_at',''+n);	
}




