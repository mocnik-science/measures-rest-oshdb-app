# Measures (description)

A measure needs to be described.  Which aspects does the measure assess?  When have the results a meaningful interpretation?  And how to interpret the results?  The *OSM Measure Repository* offers a wide range of characterizations to describe the measures and their interrelations.

## Description of the results

The interpretation of a measure is not simple.  It requires detailed knowledge about the algorithm and about the dataset it is applied to.  A semantic description of the result of a measure allows to make sense of the numbers returned by a measure.  These results may also not be unique to one measure only, but several measures may assess the very same aspects, e.g., the topological quality of the road network.  In such cases, it is important to know exactly which aspect is assessed, i.e., what the result of a measure is.  This description needs to incorporate some type of scale for classifying the and making sense of the very numbers.  What does it mean if a certain measure returns a number of 15?

Some measures depend on the geographical context (e.g., urban vs rural, areas in which the data is of high quality, etc.).  Such context can be expressed by other measures – a measure describes some context dependent on the geographical location.  As an example, a measure $\mu$ may **presume** that a certain value $u$ (e.g., the “urbanity”) is larger than a certain value.  This value $u$ can, in turn, be computed by another measure $\nu$.  Each measure has an **expected result** – the measure $\nu$ has, as a result, the urbanity of the examined grid cells represented as a number in a certain range.

As a consequence, the repository contains measures that do not measure quality.  Instead, they provide context to other measures that measure quality.  This results in a network of measures, yielding a more holistic and geographic view on data quality and fitness for purpose.

## Description of contexts

Some measures are only **valid in a certain context** of use.  As an example, a measure might only have a meaningful interpretation in the context of disaster management or in the context of routing.  Such a restriction is of global nature (independent of the location) and refers to the use of the data.  Restrictions to the interpretation can formally be represented as a **context**.  One usually aims at finding measures that are independent of a context.

## Further properties

OpenStreetMap data conists of nodes, ways and areas, and relations, each of them potentially being tagged by a number of key–value pairs.  As the measures refer to OSM data, the description of a measure contains information about which **elements** it **assesses**, and which **tags** it **assesses**.

A data quality measure compares the actual data to other information for assessing data quality.  Hereby, two ways of how to **ground** the data are compared, the one of the actual data and an alternative one.  This can be expressed by the *grounding based ontology of data quality measures*.  The classes of the ontology, characterise the alternative grounding, include:

* **Perception-based grounding.**  We observe the environment anew, giving rise to the similar data.
* **Data-based grounding.**  The data are compared to other yet very similar parts of the same dataset (intrinsic grounding), or to a reference dataset that has other characteristics (extrinsic grounding).
* **Grounding in processed data.**  The data can be processed, e.g., by computing route descriptions.  These route descriptions can, in turn, be compared to route descriptions gained by the same dataset (for other regions; intrinsic) or by another dataset (extrinsic).  The same can be done for other ways of processing the data.
* **Grounding rules/patterns/knowledge.**  One can often derive rules or patterns from a dataset or the environment.  If the actual data complies to these rules or patterns, this might be an indicator for good quality.  If the data contradicts these rules or patterns, the data might be of bad quality.

## Background: Linked Open Data

Measures can be published on http://osm-measure.geog.uni-heidelberg.de (see *Help > Public repository*).  In this case, the semantic description of the measure is published as Linked Open Data (LOD).  The representation consists of a number of triples, each consisting of a subject, a predicate, and an object.  These triples, being represented as [RDFa](http://www.w3.org/TR/rdfa-primer/), refer to entities on other pages of this repository, and they refer to known vocabularies.  Among these are the [Data Quality Vocabulary](http://purl.org/data-quality) and the [OpenStreetMap Data Quality Vocabulary](http://purl.org/osm-data-quality).  The data can be queried using the query language [SPARQL](http://www.w3.org/TR/sparql11-query/).
