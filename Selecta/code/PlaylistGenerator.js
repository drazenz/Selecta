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

function PlaylistGenerator(index){
	this.index=index;
}

PlaylistGenerator.prototype.addToQuery=function(query,artist){
	for(var i in artist){
		var tn=artist[i][0];
		var tw=artist[i][1];
		if(tn in query){
			query[tn]=Math.max(tw,query[tn]);			
		}
		else{
			query[tn]=tw;
		}
	}
}

PlaylistGenerator.prototype.generateFromAmarokPlaylist=function(){
	var len=Amarok.Playlist.totalTrackCount();
	var query=new Object();
	if(len==0){
		return;
	}
	try{
		//create a query using artists from first 3 songs of the current Amarok playlist
		for(var i=0;i<3 && i<len;++i){
			var artist=Amarok.Playlist.trackAt(i).artist;
			artist=this.index.artistTags[artist];
			if(artist!=null){
				this.addToQuery(query,artist);
			}		
		}		
		q=[];
		for(var i in query){
			//Amarok.debug(i+' '+query[i]);
			q[q.length]=[i,query[i]];				
		}
		if(q.length==0){
			Amarok.alert("Selecta: Can't generate playlist. No info for given artists");
		}
		similar=this.index.findSimilar(q);
		playlist_urls=this.generateForSimilar(similar,length=100,sigma=13);	//13 is one handsome number
		
		return playlist_urls;
	}
	catch(e){
		Amarok.debug(e);
		return [];
	}		
}

/*
 *	similar is a list of pairs [artist_similarity, artist_name] 
 *	 
 * 	length is the length of playlist to generate
 * 
 *	sigma influences the generated probability distribution used 
 *  	for artist selection. A smaller sigma favors artists with
 *  	high similarity measure. Increasing sigma allows for 
 *  	less similar artists to appear in the playlist being created.
 * 
 */
PlaylistGenerator.prototype.generateForSimilar=function(similar, length, sigma){
	Amarok.debug(sigma)
	//generate relative likelihoods for each artist
	var prob=[];
	for(var i in similar){
		t=Math.round(similar[i][0]*Math.exp( -(i*i)/(2*sigma*sigma) )*1000);
		if(t==0){
			//all following probs will be zero too
			break;
		}
		prob[i]=t;
		//Amarok.debug(prob[i]+" "+similar[i][1]);
	}
	
	similar.splice(prob.length);	//throw away those artists with zero probability
	
	var findInd=function(t,prob){
		//when t is selected from a distribution with pdf=e^(-(t/sigma)^2)
		//the expected number of iterations here is sqrt(2/pi)*sigma ~ 0.8 sigma,
		//which is nice
		var s=0;
		for(var i in prob){
			if(t<=s+prob[i]){
				return i;
			}
			s+=prob[i];
		}		
	}
	
	//get the number of available songs for artists
	var n_available=[]
	for(var i in similar){
		var artist_name=similar[i][1];
		var q="SELECT COUNT(id) FROM tracks t WHERE t.artist IN (SELECT id FROM artists WHERE name='"+artist_name.replace(/'/g,"''")+"')";
		var q=Amarok.Collection.query(q);
		if(q.length>0){
			n_available[i]=parseInt(q[0]);
		}
		else{
			n_available[i]=0;
		}
		if(n_available[i]==0){
			prob[i]=0;
		}
	}
	
	var maxRand=arraySum(prob);
	
	var artist_pl_position=new Object();	
	var actual_length=0;	//maybe there are less than length songs that satisfy the query
	
	for(var i=0;i<length;i++){
		//randomly select an artist from the appropriate distribution
		var t=randInt(maxRand);
		var ind=findInd(t,prob);
				
		//put this artist on the i-th position in playlist
		actual_length+=1;
		if(ind in artist_pl_position){
			var list=artist_pl_position[ind];
			list[list.length]=i;
		}
		else{
			artist_pl_position[ind]=[i];
		}
		
		//if there are no more songs from this artist, set the likelihood to 0
		n_available[ind]-=1;
		if(n_available[ind]==0){
			maxRand-=prob[ind];
			prob[ind]=0;
		}
		if(maxRand==0){
			//no more songs
			break;
		}		
	}
	length=actual_length;
		
	var shuffle=function(a){
		//a function to shuffle the given array
		for(var i=0;i<a.length/2+a.length%2;i++){
			var i1=randInt(a.length-1);
			var i2=randInt(a.length-1);
			var tmp=a[i1];
			a[i1]=a[i2];
			a[i2]=tmp;
		}		
	}
				
	var playlist_urls=new Array(length);
	
	for(var i=0;i<Amarok.Playlist.totalTrackCount() && i<1;++i){
		var track=Amarok.Playlist.trackAt(i);
		for(var j in track){
			Amarok.debug(j+" : "+track[j]);
		}
	}
	
	for(var ind in artist_pl_position){
		var artist_name=similar[ind][1];
		Amarok.debug(artist_name);
		//var q="SELECT DISTINCT url.uniqueid FROM urls url,tracks t, artists a WHERE t.url=url.id AND t.artist IN(SELECT id FROM artists WHERE name='"+artist_name.replace(/'/g,"''")+"')";	//incredibly slow!

		var query_results=[];
		artist_id=Amarok.Collection.query("SELECT id FROM artists WHERE name='"+artist_name.replace(/'/g,"''")+"\'");
		
		if(artist_id.length>0){
			var artist_id=artist_id[0];
			var tracks=Amarok.Collection.query("SELECT t.url FROM tracks t WHERE t.artist="+artist_id);
			for(var t in tracks){
				query_results[query_results.length]=Amarok.Collection.query("SELECT uniqueid, rpath FROM urls WHERE id="+tracks[t])[0];
			}		
		}				
		//now we have all songs from artist_name in query_results
		shuffle(query_results);
		for(var i in artist_pl_position[ind]){
			playlist_urls[artist_pl_position[ind][i]]=query_results[i];
		}		
	}
		
	return playlist_urls;
}


function arraySum(a){
	//returns the sum of elements in array a
	var s=0;
	for(var i in a){
		s+=a[i];
	}
	return s;
}

function randInt(max){
	//generates random int from [0,max]
	return Math.floor(Math.random()*(max+1));
}



