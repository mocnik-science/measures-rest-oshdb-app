## Getting started

The *OSM Measure Repository* is a vivid collection of measures, in particular of data quality measures.  You can add new measures and reuse existing ones.  This section provides an overview and guides you through an example of how to use the repository.

### Measures

In a first step, let us define a new measure.  Open the page “Measures” and click on the `plus` symbol for creating a new measure.  This measure is named `new measure` by default, but you can easily change the name.  For doing so, click on the `pen` symbol next to the measure and change the name.  (Do not forget to save!)

You can add an algorithm to the measure by clicking on the `code` symbol.  An editor opens, in which you can add a code either by using *Java* syntax or by using the *Simplified OSHDB API Programming (SOAP)* syntax.  We use the latter one in the following example.

Assume that we want to compute the density of trees, i.e., the number of trees for each region.  First we filter by the tag `"natural"="tree"`, and then we count the number of trees:

```java
osmTag("natural", "tree")
count()
```

The information is automatically aggregated by grid cells, which are discussed below.

### REST API

enable the measure (because the code is ready)

start with the play button, wait until started

click on the map button and enjoy

api is also possible

**Further information will come soon.**

### ISEA 3H Discrete Global Grid System

the data is aggregated by a grid, advantages

**Further information will come soon.**
