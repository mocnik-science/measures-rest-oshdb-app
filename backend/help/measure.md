## Measures

**Further information will come soon.**

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
