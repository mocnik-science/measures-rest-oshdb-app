## Measures

**Further information will come soon.**

What is a measure?

### Example 1

```java
osmTag("highway")
filter(h -> h.length > 4)
count()
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
