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

Importer.include('code/ui/IndexUpdateDialog.js');
Importer.include('code/ui/ChooseDirectoryDialog.js');

function IndexUpdater(index){
	this.index=index;
	this.canceled=false;
}

IndexUpdater.prototype.openIndexFile=function(data_dir){
	var qdata_dir=new QDir(data_dir);
	if(qdata_dir.exists()==false){
		Amarok.debug('creating directory');
		qdata_dir.mkdir(data_dir);
	}
	var data_file=new QFile(data_dir+'/taginfo');
	if(data_file.exists()){
		data_file.open(new QIODevice.OpenMode(QIODevice.Append));
	}
	else{
		data_file.open(new QIODevice.OpenMode(QIODevice.WriteOnly));
	}
	return data_file;	
}

IndexUpdater.prototype.pause=function(millis){
	var timer=new QTimer();
	var loop=new QEventLoop();
	timer['timeout'].connect(loop,'quit');
	timer.singleShot=true;
	timer.interval=millis;
	timer.start();
	loop.exec();		
}

IndexUpdater.prototype.update=function(){
	var data_dir=this.selectDataDir();
	if(this.canceled){
		return;
	}
	Amarok.debug(data_dir);
	var dialog=new IndexUpdateDialog();
	dialog.ui.buttonBox['rejected'].connect(this,'cancel');
	try{		
		
		var data_file=this.openIndexFile(data_dir);
		dialog.ui.currentActionLabel.text='Getting list of artists';
		dialog.ui.show();
		
		var artists_in_collection=Amarok.Collection.query('SELECT DISTINCT name FROM artists');

		this.index.buildFromFile(Amarok.Script.readConfig('selecta-data_dir','')+'/taginfo');
				
		var need_update=[];
		for(var i in artists_in_collection){
			if(this.index==null || this.index.artistTags==null || !(artists_in_collection[i] in this.index.artistTags) ){
				need_update[need_update.length]=artists_in_collection[i];
			}
		}		
			
		dialog.ui.currentActionLabel.text='Fetching data from Last.fm...';
		/*
		* Please use your own Last.fm api key if you make any changes to the original code.
		* You can get one at www.last.fm/api
		*/
		var api=new LastFM('86491ac5225fc6dcc1f04c3502c01189');	
		
		var encoder=new QTextEncoder(QTextCodec.codecForName(new QByteArray('UTF-8')));
		for(var i in need_update){
			if(this.canceled){
				break;
			}
			try{
				var artist_name=need_update[i];
				if(artist_name.length>0){
					dialog.ui.currentArtistLabel.text=artist_name;					
					dialog.ui.progressLabel.text=i+'/'+need_update.length;
					dialog.ui.progressBar.value=i/need_update.length*100;

					this.pause(700);	//go easy on last.fm servers					
					var tags=api.getTopTagsForArtist(artist_name);
					
					if(tags.length>0){						
						data_file.write(encoder.fromUnicode('\n'));
						data_file.write(encoder.fromUnicode(artist_name+'\n'));
						for(var j in tags){
							if(tags[j][1]==0){
								break;	//don't want zero weight tags
							}
							data_file.write(encoder.fromUnicode(tags[j][1]+'\t'+tags[j][0]+'\n'));
						}
						data_file.flush();
						Amarok.debug('Wrote info for '+artist_name+' to '+data_dir+'/taginfo');
					}		
					else{
						Amarok.debug('No tag info for: '+artist_name);
					}
				}	
				else{
					Amarok.debug('Skipped '+artist_name);
				}
			}
			catch(e){
				Amarok.debug(e);
			}
		}	
		data_file.close();
		
		this.index.buildFromFile(Amarok.Script.readConfig('selecta-data_dir','')+'/taginfo');
		
		if(this.canceled==false){			
			Amarok.alert('Selecta: Finished updating index.');
		}
		
	}
	catch(e){
		Amarok.debug(e);
	}		
	dialog.ui.setVisible(false);
	dialog.ui.close();
}

IndexUpdater.prototype.cancel=function(){
	this.canceled=true;
}

IndexUpdater.prototype.selectDataDir=function(){	
	var data_dir=Amarok.Script.readConfig('selecta-data_dir','');	

	if(data_dir!=''){
		return data_dir;		
	}
	else{
		var dialog=new ChooseDirectoryDialog();
		dialog.modal=true;
		dialog.ui.exec();

		if(dialog.ui.result()==QDialog.Accepted){
			data_dir=dialog.ui.locationEdit.text;
			Amarok.Script.writeConfig('selecta-data_dir',data_dir);
			return data_dir;
		}	
		else{	
			this.canceled=true;
			return;
		}			
	}	
}
