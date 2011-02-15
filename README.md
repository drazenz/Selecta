#Selecta#
An Amarok script

**Author:** Drazen Zaric <drazen.zaric@gmail.com>

**Homepage:** [http://dzaric.github.com/Selecta/selecta_home_page/](http://dzaric.github.com/Selecta/selecta_home_page/)

##What is it?##
Selecta is an Amarok script that generates playlists of similar artists using Last.fm tags.

##How it works?##

First off, you need to have some music in your Amarok Collection.
After installing Selecta, you must update its index (go to Tools->Selecta->Update index).
It takes some time to fetch all the necessary data from Last.fm, about 10 minutes per 500 artists,
so please be patient.
Once the the indexing is finished, Selecta is ready to make some playlists for you.
Drop a couple of tracks into Amarok playlist and hit Tools->Selecta->Play.
Note: you should update Selecta's index whenever you add new artists to your collection.

##How it really works? ##

For each artist in your collection, Selecta uses [Last.fm api](http://www.last.fm/api) method Artist.getTopTags to
get tag info about that artist. After writing the data to a simple text file, an inverted index
is built, mapping tags to artist names. Since last.fm is kind enough to also deliver 
tag weights for each artist, it is quite straightforward to use all these data and 
implement a retrieval system using tf-idf weighting. So, whenever you hit *Selecta->Play*, 
a query is formed and each artist from your collection is scored against that query by
cosine similarity measure. Finally, the appropriate probability distribution over artists is 
generated and used to select tracks for your playlist. 

