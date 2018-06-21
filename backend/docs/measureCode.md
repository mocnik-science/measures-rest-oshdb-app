# Measures (code)

In the context of this repository, a measure is a mapping from the OpenStreetMap (OSM) dataset to a number.  To be more precise, such a number is computed for each cell of the *Discrete Global Grid System ISEA 3H*, which seems to be a good compromise between the local evaluation of data quality for a certain set of OSM elements and the areal nature of other measures.

Here, you will find information on how to implement such a measure using the **Simplified OSHDB API Programming Syntax (SOAP)**.

## Example 1a: A first example

Assume that we want to compute the length of the road network for each region.  First we filter by the tag `highway`:

```java
osmTag("highway")
```

Thereafter, we can map each highway to the length of its geometry:

```java
map(h -> h.getGeometry())
```

The geometries in turn can be mapped to their length:

```java
map(g -> Geo.lengthOf(g))
```

The result can finally be summed up:

```java
sum()
```

The entire code is thus as follows:

```java
osmTag("highway")
map(h -> h.getGeometry())
map(g -> Geo.lengthOf(g))
sum()
```

The same code can be rewritten as:

```java
osmTag("highway")
map(h -> Geo.lengthOf(h.getGeometry()))
sum()
```

## Example 1b: A first example

Assume that we want to compute the same number but want to subtract 5, we can use the usual JAVA syntax:

```java
osmTag("highway")
map(h -> Geo.lengthOf(h.getGeometry()))
x = sum()

// java from here
x += 5;
return x;
```

Instead of taking the sum, elements can also be counted, the unique values can be counted, and the average can be computed.  In the following example, the number of trees is computed:

```java
osmTag("natural", "tree")
count()
```

Also, the number of nodes defining a highway can be computed, and it is examined how many different number of nodes occur:

```java
osmTag("highway")
map(h -> h.getGeometry().getNumPoints())
countUniq()
```

Finally, the average length of a highway can be computed:

```java
osmTag("highway")
map(h -> Geo.lengthOf(h.getGeometry()))
average()
```

If one wants to manually perform computations on all lenghts of highways, this can be done as follows:

```java
osmTag("highway")
map(h -> Geo.lengthOf(h.getGeometry()))
x = collect()

// java from here
...
return n;
```

Instead of `collect`, also `uniq` can be used to only get every element once.

## Example 2: OSM data at a point in time in the past

A measure can also refer to OSM data that existed in the past.  We can use a **SOAP directive** to indicate the date for which the measure is to be evaluated:

```java
// 2016-01-01 //
osmTag("highway")
map(h -> Geo.lengthOf(h.getGeometry()))
sum()
```

As can be seen in the example, a SOAP directive starts with a double slash and ends with a double slash.  If the data shall refer to the last point in time that is included in the database, the following SOAP directive can be used:

```java
// now //
```

## Example 3a: The history of OSM

Many measures do not refer to only one point in time but to many ones.  They make sense of the lineage of the data and provide more information by comparing data at different points in time.  There exist several SOAP directives to determine which points of time.  As an example, one can assess the data from the last 4 years (4 $\cdot$ 12 $\cdot$ 30 days) in intervals of 3 months (3 $\cdot$ 30 days):

```java
// last 4 years //
// every 3 months //
```

Please note that a month is here the interval of 30 days and a year is the interval of 12 months, i.e., of 12 $\cdot$ 30 days.  This is useful to achieve intervals of equal lengths, which is contrast too calendar months that differ in lengths.  Two or more SOAP directives can even be shortened as follows:

```java
// last 4 years, every 3 months //
```

The time span and the interval can be provided in days, months, or years.  Further examples include:

```java
// last year, monthly //
// last year, every month //
```

When such a SOAP directive is used, the data is processed for several points in time.  Such time series allow for examining the lineage of the data.  As an example, the lengths of the roads can be computed for every month of the last year.  These different lengths can be merged in some meaningful way in order to reflect the lineage.  Strategies for such merging include the minimum and maximum of the data, the sum, the average, and the saturation principle:

```java
lineageBy(minimum)
lineageBy(maximum)
lineageBy(sum)
lineageBy(average)
lineageBy(saturation)
```

Observe that `saturation` is not yet implemented.

As an example, one can compute the average number of trees in the last 2 years (examined monthly) in the following way:

```java
// last 2 years, monthly //
osmTag("natural", "tree")
count()
lineageBy(average)
```

## Example 3b: The history of OSM

The function `lineageBy` also accepts user defined functions.  As an example, one may write:

```java
lineageBy(s ->
    s.values()
    .stream()
    .mapToDouble(Number::doubleValue)
    .average()
    .orElse(Double.NaN))
```

While this function seems to be complicated, it is, in fact, not.  It consumes a parameter of type `SortedMap<G, N> s`, where `G` refers to the grid cells and `N` extends the JAVA class `Number`.  As a result, the lambda function returns an instance of the class `Number`.

## Example 4: Mapping activity

By default, the OSM elements at a given point in time, called snapshots, are examined.  This can even explicitly be achieved by using the following SOAP directive:

```java
// snapshots //
```

In contrast to examining OSM elements at given points in time, one can examine the changes of OSM elements.  Such a change, called contribution, can be the creation, modification, or deletion of an OSM element.  Such contributions can, e.g., be counted as follows:

```java
// contributions //
count()
```

## Example 5a: Parameters

In some cases, one wants to include parameters in the code, which can be provided in the URL when accessing the REST server.  As an example, one might want to count the number of elements with tag `highway=value`, where the value of the tag is provided in the URL:

```java
osmTag("highway", @typeOfHighway)
count()
```

In the URL, the parameter needs to be provided, e.g., `...&typeOfHighway=tertiary`.  A default value can be set as follows:

```java
// @typeOfHighway: tertiary //
osmTag("highway", @typeOfHighway)
count()
```

Please keep in mind, that the type of the parameter is guessed by the name.  If the parameter name starts with `number`, it is regarded to be an `Integer`; if it starts with `weight` or `factor`, to be a `Double`; and if it starts with `is`, `has`, or `needs`, to be a `Boolean`.  Otherwise, the parameter is regarded to be a `String`.  If you would like to force the interpretation of a parameter as a certain type, you can enforce this as `para_int`, `para_double`, `para_str`, etc.

## Example 5b: Import of other measures

If a measure uses a parameter, it can be reused by another measure.  As an example, one might count different types of highways in a measure called `Count Highways`:

```java
osmTag("highway", @typeOfHighway)
count()
```

In further measures, the previous one can be imported and the parameter default value be set:

```java
// import Count Highways //
// @typeOfHighway: secondary //
```

Such imports allow to implement measures which share the code but have independent meanings.  Technically, the number of POIs and of trees can, e.g., be derived in a very similar way, but the meaning can semantically be described in very different ways.

## Java imports

In some cases, imports are needed.  The SOAP syntax is internally converted to JAVA code, which is why you can use usual JAVA import commands.  They are filtered from the SOAP code and inserted at the beginning of the resulting JAVA code.

## Using a IDE

In some examples, it may be hard to write the code without a proper IDE with a more sophisticated auto completion.  You can use the JAVA IDE of your choice.  If you click on the <i class="fas fa-cloud-download"/>-symbol of a measure, a Maven project will be downloaded.  You can open this project with your IDE and write the code (in JAVA syntax) in the IDE of your choice.  For more information, please read *Help > Advanced*.
