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

function LastFM(api_key){
	this.api_key=api_key;	
	
};

LastFM.prototype.encode=function(s){
	var reserved={"!":0, "*":0, "'":0, "(":0, ")":0, ";":0, ":":0, "@":0, "&":0, ":":0, "+":0, "$":0, ",":0, "/":0, "?":0, "#":0, "[":0, "]":0};
	var ret='';
	for(var i in s){
		var c=s[i];
		if(c in reserved){
			ret+=encodeURIComponent(c);
		}
		else{
			ret+=c;
		}
	}
	return ret;	
}

LastFM.prototype.getTopTagsForArtist=function(artist_name){	
	var url= 'http://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist='+this.encode(artist_name)+'&api_key='+this.api_key+'&format=json';
	var network_manager=new QNetworkAccessManager();
	var req=new QNetworkRequest(new QUrl(url));
	var reply=network_manager.get(req);	
	
	var event_loop=new QEventLoop();
	network_manager['finished'].connect(event_loop,'quit');
	event_loop.exec();
	
	try{
		var instream=new QTextStream(reply);
		var result=instream.readAll();
		var ret=[]		
		var tags=eval('('+result+')').toptags.tag ;
		for(var i in tags ){
			//Amarok.debug(tags[i].name+" / "+tags[i].count);
			ret[i]=[tags[i].name,parseInt(tags[i].count)];
		}
		//Amarok.debug(ret);
		return ret;	
	}
	catch(e){
		//Amarok.debug(e);
		return [];
	}
}



