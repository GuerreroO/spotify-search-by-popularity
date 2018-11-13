# spotify-search-by-popularity

## API Used
https://developer.spotify.com/

##App Description
The intentions of this app is simply to allow the user to search any
artist, album, or song and find recommended music based on genre and popularity.
since there can be multiple genre it will include a genre filter as well as a
popularity filter allowing one to search from highest popularity or the lowest.
The App is intended to also have a player allowing one to preview the tracks that
they choose.

##MVP
 1. Be able to Search for artist, albums and songs and render them on the UI
 2. Be able to produce recommendations based on certain criterias based on search
    choice
  

## Problem Foreseen

1.When an artist is search there albums or songs are not given, but their Id's are.
  I can most likely use the artist ID to pull album and song data. Part of the Problem
  will be using this information to re-render the data on the UI. When I search an artist
  How can I click the search result to then render the data?

2.How to get the web player up and running. This one seems relatively simple
  i'm sure It's all in the API docs. I'm must thoroughly read the documentation
  so to implement this.

3.The hardest problem will most likely be how to get search results based on artists
  with similar genre. I would have search through every single artist in their data
  and then match them, and order them by one how many genre matches they and then
  filter that by popularity. Actually, i'm not even sure spotify does this themselves!
  I think they themselves use another api in order to recommend user songs that
  they my like. I need to do more research in order to see if this is actually feasible

## WireFrame

![wireFrame] ()
