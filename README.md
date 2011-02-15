#Selecta#

**Author:** Drazen Zaric <drazen.zaric@gmail.com>

**Homepage:** [http://dzaric.github.com/Selecta/selecta_home_page/](http://dzaric.github.com/Selecta/selecta_home_page/)


#How it really works? #

For each artist in your collection, Selecta uses [Last.fm api](http://www.last.fm/api) method Artist.getTopTags to
get tag info about that artist. After writing the data to a simple text file, an inverted index
is built, mapping tags to artist names. Since last.fm is kind enough to also deliver 
tag weights for each artist, it is quite straightforward to use all these data and 
implement a retrieval system using tf-idf weighting. So, whenever you hit *Selecta->Play*, 
a query is formed and each artist from your collection is scored against that query by
cosine similarity measure. Finally, the appropriate probability distribution over artists is 
generated and used to select tracks for your playlist. 

