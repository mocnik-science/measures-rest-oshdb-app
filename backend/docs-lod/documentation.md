# Documentation

The repository contains data quality measures (and general measures) for OpenStreetMap (OSM).  Besides the algorithms of the measures, it contains semantic information about how the measures relate.  Such relations provide the context to interpret the data provided by the measures and renders a more complex view of data quality than a single measure.

In the following, we discuss the entities that are documented in the repository: measures, results, contexts, and people.

## Measures

In the context of this repository, a measure is a mapping from the OSM dataset to a number.  To be more precise, such a number is computed for each cell of the *Discrete Global Grid System ISEA 3H*, which seems to be a good compromise between the local evaluation of data quality for a certain set of OSM elements and the areal nature of other measures.

OpenStreetMap data conists of nodes, ways and areas, and relations, each of them potentially being tagged by a number of key–value pairs.  As the measures refer to OSM data, the description of a measure contains information about which **elements** it **assesses**, and which **tags** it **assesses**.

A data quality measure compares the actual data to other information for assessing data quality.  Hereby, two ways of how to **ground** the data are compared, the one of the actual data and an alternative one.  This can be expressed by the *grounding based ontology of data quality measures*.  The classes of the ontology, characterise the alternative grounding, include:

* **Perception-based grounding.**  We observe the environment anew, giving rise to the similar data.
* **Data-based grounding.**  The data are compared to other yet very similar parts of the same dataset (intrinsic grounding), or to a reference dataset that has other characteristics (extrinsic grounding).
* **Grounding in processed data.**  The data can be processed, e.g., by computing route descriptions.  These route descriptions can, in turn, be compared to route descriptions gained by the same dataset (for other regions; intrinsic) or by another dataset (extrinsic).  The same can be done for other ways of processing the data.
* **Grounding rules/patterns/knowledge.**  One can often derive rules or patterns from a dataset or the environment.  If the actual data complies to these rules or patterns, this might be an indicator for good quality.  If the data contradicts these rules or patterns, the data might be of bad quality.

## Results

Some measures depend on the geographical context (e.g., urban vs rural, areas in which the data is of high quality, etc.).  Such context can be expressed by other measures – a measure describes some context dependent on the geographical location.  As an example, a measure $\mu$ may **presume** that a certain value $u$ (e.g., the “urbanity”) is larger than a certain value.  This value $u$ can, in turn, be computed by another measure $\nu$.  Each measure has an **expected result** – the measure $\nu$ has, as a result, the urbanity of the examined grid cells represented as a number in a certain range.

## Contexts

Some measures are only **valid in a certain context** of use.  As an example, a measure might only have a meaningful interpretation in the context of disaster management or in the context of routing.  Such a restriction is of global nature (independent of the location) and refers to the use of the data.  Restrictions to the interpretation can formally be represented as a **context**.  One usually aims at finding measures that are independet of a context.

## People

Knowledge in general is hard to formally represent.  This also applies to the measures and their relations that you can find in this repository.  It is thus of great importance to note whom did implement and whom did document the measures.  If you have any question regarding a particular measure, please address the question to the corresponding person.

## Linked Open Data (LOD) and SPARQL Queries

The semantic information contained in this repository is available in human-readable way as well as formally as Linked Open Data.  While being a website, the pages contains a number of triples, each consisting of a subject, a predicate, and an object.  These triples are used to represent the data in a machine-readable way.  The data, being represented as [RDFa](http://www.w3.org/TR/rdfa-primer/), refer to entities on other pages of this repository, and they refer to known vocabularies.  Among these are the [Data Quality Vocabulary](http://purl.org/data-quality) and the [OpenStreetMap Data Quality Vocabulary](http://purl.org/osm-data-quality).  The data can be queried using the query language [SPARQL](http://www.w3.org/TR/sparql11-query/).
