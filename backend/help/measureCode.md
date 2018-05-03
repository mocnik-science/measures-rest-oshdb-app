## Measures

**Further information will come soon.**

What is a measure?

### Example 1

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

### Example 2

```java
osmTag("highway")
filter(h -> h.length > 4)

Double x = count()
x *= 3;
return x / 2;
```

### Example 3

### Example 4
