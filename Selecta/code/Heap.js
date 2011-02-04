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
 * The compare function should be a binary predicate (i.e. f(a,b)) that behaves as 
 * less_than operator (i.e. f(a,b) = a < b) in order to get a min-heap. If it 
 * behaves as greater_than (i.e. f(a,b) = a > b) the resulting structure is a max-heap.
 * 
 */

function Heap(compare){
	this.heap=new Array();
	if(compare==null){
		compare=function(a,b){return a<b;}
	}
	this.compare=compare;
}

Heap.prototype.insert=function(element){
	this.heap[this.heap.length]=element;		
	curr=this.heap.length-1;
	while(curr>0){
		var parent=Math.floor((curr+1)/2)-1;
		if(this.compare(this.heap[curr],this.heap[parent])){
			var tmp=this.heap[curr];
			this.heap[curr]=this.heap[parent];
			this.heap[parent]=tmp;
			curr=parent;				
		}
		else{
			break;sif
		}
	}		
}
	
Heap.prototype.top=function(){
	return this.heap[0];
}
	
Heap.prototype.pop=function(){
	var ret=this.heap[0];
	var last=this.heap.pop();
	if(this.heap.length>0){
		this.heap[0]=last;
		this.sift_down(0);
	}
	return ret;
}

Heap.prototype.replace=function(element){
	var ret=this.heap[0];
	this.heap[0]=element;
	sift_down(0);
	return ret;
}

Heap.prototype.sift_down=function(index){
	var curr=index;
	while(true){
		var ind=(curr+1)*2-1;
		if(ind>=this.heap.length){
			//curr is a leaf node
			break;
		}					
		var next=-1;
		if(this.compare(this.heap[ind],this.heap[curr])){
			//left child is less than curr
			next=ind;
		}				
		ind+=1;
		if(ind<this.heap.length && this.compare(this.heap[ind],this.heap[curr])){
			//right child is less than curr
			if(next==-1){
				//left child isn't less than curr
				next=ind;
			}
			else{
				//left child is also less than curr
				if(this.compare(this.heap[ind],this.heap[next])){
					//right child is less than left child
					next=ind;
				}					
			}					
		}
		if(next==-1){
			//curr is less than both children
			break;
		}
		else{
			var tmp=this.heap[curr];
			this.heap[curr]=this.heap[next];
			this.heap[next]=tmp;
			curr=next;
		}
	}			
}		

Heap.prototype.size=function(){
	return this.heap.length;
}

Heap.prototype.sorted=function(){
	//returns heap elements as a sorted array
	//DESTROYS THE HEAP
	var ret=[];
	
	while(this.heap.length>0){
		ret[ret.length]=this.pop();	
	}
	return ret;	
}









