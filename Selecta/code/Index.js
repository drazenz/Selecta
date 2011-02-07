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


/*
 * Class:
 *	 Index 
 * Fields:
 * 	artistTags
 * 		a map<string,list> with artist names as keys, and lists of pairs (tag_name,tag_weight) as values
 * 	invind
 * 		a map<string,list> with tag names as keys, and lists of artist names as values 
 * 
 */

function Index(){}

Index.prototype.buildFromFile=function(filePath){
	this.loadData(filePath);
	this.buildIndex();		
}

Index.prototype.loadData=function(filePath){
	var inFile=new QFile(filePath);
	inFile.open(new QIODevice.OpenMode(QIODevice.ReadOnly));
	var instream=new QTextStream(inFile);
	
	this.artistTags=new Object();
	this.nArtists=0;
	var state='artist';
	var currArtist='';
	var compareFunction=function(a,b){
		if(a[0]<b[0])return -1;
		if(a[0]>b[0])return 1;
		if(a[1]<b[1])return -1;
		if(a[1]>b[1])return 1;
		return 0;
	}

	instream.readLine();	//ignore the first line	
	while(!instream.atEnd()){
		var line=instream.readLine();
		if(state=='artist'){
			this.artistTags[line]=new Array();
			this.nArtists+=1;
			currArtist=line;
			state='tags';
		}
		else{
			line=line.split('\t')
			if(line.length<2){
				state='artist'
				this.artistTags[currArtist].sort(compareFunction)
			}
			else{				
				var w=parseInt(line[0]);
				var t=line[1].trim();
				var l=this.artistTags[currArtist];
				l[l.length]=[t,w]
			}			
		}		
	}
}

Index.prototype.buildIndex=function(){
	this.invind=new Object();
	for(var a in this.artistTags){
		for(var i in this.artistTags[a]){
			var t=this.artistTags[a][i][0];
			if(t in this.invind){
				var l=this.invind[t];
				l[l.length]=a;
			}
			else{
				this.invind[t]=[a];
			}			
		}		
	}
}

Index.prototype.cosineSimilarity=function(a,b){
	//a and b are lists of pairs (tag_name, tag_weight)
	
	var NA=this.nArtists*1.0;
	var tfa=[];
	var tfb=[];
	var idfa=[];
	var idfb=[];
	for(var i in a){
		tfa[i]=a[i][1]/100.0;
		idfa[i]=Math.log(NA/this.invind[a[i][0]].length)
	}	
	for(var i in b){
		tfb[i]=b[i][1]/100.0;
		idfb[i]=Math.log(NA/this.invind[b[i][0]].length)
	}
		
	var va=new Array(tfa.length);
	for(var i in tfa){
		va[i]=tfa[i]*idfa[i];
	}
	var vb=new Array(tfb.length);
	for(var i in tfb){
		vb[i]=tfb[i]*idfb[i];
	}
	
	var norm=function(vect){
		var s=0;
		for(var i in vect){
			s+=vect[i]*vect[i];
		}
		return Math.sqrt(s);
	};
	
	var moda=norm(va);
	var modb=norm(vb);
	var inda=0;
	var indb=0;
	var sim=0;
		
	while(inda<va.length && indb<vb.length){	
		if(a[inda][0]<b[indb][0]){
			inda+=1;
		}
		else if(b[indb][0]<a[inda][0]){
			indb+=1;
		}
		else{
			sim+=va[inda]/moda*vb[indb]/modb;
			inda+=1;
			indb+=1;
		}
	}
	return sim;	
}

Index.prototype.findSimilar=function(query, max_n){
	//query is an array of pairs [tag_name, tag_weight]
	var compareFunction=function(a,b){
		if(a[0]<b[0])return -1;
		if(a[0]>b[0])return 1;
		if(a[1]<b[1])return -1;
		if(a[1]>b[1])return 1;
		return 0;
	}
		
 	query=query.sort(compareFunction);
	
	Amarok.debug('Query: '+query);
	var done=new Object();	
	var res=new Heap(
		function(a,b){
			if(a[0]!=b[0]){
				return a[0]<b[0];
			}
			else{
				return a[1]<b[1];
			}			
		}	
	);
	
	for(var i in query){
		var tag=query[i];
		var tagname=tag[0];
		var postingList=this.invind[tagname];
		for(var j in postingList){
			var artistName=postingList[j];
			var artist=this.artistTags[postingList[j]];
			if(!(artistName in done)){
				done[artistName]=1;	
				if(res.size()<max_n){
					res.insert([this.cosineSimilarity(query,artist),artistName]);
				}
				else{
					var t=this.cosineSimilarity(query,artist);
					if(t>res.top()[0]){
						res.replace([this.cosineSimilarity(query,artist),artistName]);
					}
				}
			}
		}
	}
	var ret=res.sorted();
	ret.reverse();
	return ret;
}

Index.prototype.findSimilarForArtistName=function(artistName){
	var query=this.artistTags[artistName];
	if(query==null){
		//no such artist
		return [];		
	}
	return this.findSimilar(query);
}

