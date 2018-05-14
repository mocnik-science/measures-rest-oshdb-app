## Getting started

The *OSM Measure Repository* is a vivid collection of measures, in particular of data quality measures.  You can add new measures and reuse existing ones.  This section provides an overview and guides you through an example of how to use the repository.

### Measures

In a first step, let us define a new measure.  Open the page *Measures* and click on the <i class="far fa-plus-square"/>-symbol at the top of the page for creating a new measure.  This measure is named `“new measure”` by default, but you can easily change the name.  For doing so, click on the <i class="fas fa-edit"/>-symbol next to the measure and change the name.  (Do not forget to save!)

You can add an algorithm to the measure by clicking on the <i class="fas fa-code"/>-symbol.  An editor opens, in which you can add a code either by using the **Simplified OSHDB API Programming (SOAP)** syntax.  This syntax is easy to use and will help you to implement measures with ease.

Assume that we want to compute the density of trees, i.e., the number of trees for each region.  First we filter by the tag `"natural"="tree"`, and then we count the number of trees:

```java
osmTag("natural", "tree")
count()
```

The computation results in the number of trees, which is automatically aggregated by grid cells (further information about the grid cells under *Help > Advanced*).  As each of these grid cells has the same size, it makes sense to compare these numbers – they always refer to an area of the same size.

That's it!  You can now enable your new measure using the <i class="fas fa-toggle-on"/>-element, which you will find on the left side of the page *Measures*.

### Map

Next, we will examine the measure on a map.  For doing so, you have to start a (REST) server, which runs in the background and evaluates the measure.  This server will take advantage of a larger server cluster and compute the needed information in real time.  Click on the <i class="fas fa-play"/>-symbol to start the server, or on the <i class="fas fa-redo"/>-symbol to restart it.  Once the server is started, changes in the code will not any longer be used by the measure.  You have to restart in order to let the server use the current version of your code.

Only enabled measures are run on the server.  This is useful if you implement measures by inserting code.  Code that is not yet ready to run may throw exceptions.  The server may thus not start.  If you disable all measures apart from those that you want to examine, no exceptions will occur and the server will start.  It takes some time for the server to start.  Be patient.

When the server has started, you can examine the measure by clicking on the <i class="fas fa-map"/>-symbol.  Congratulations, your have implemented your first measure.  Enjoy!
