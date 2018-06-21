# Public repository

The *OSM Measure Repository* is a place to (1) test and develop new measures (these will be private) and to (2) publish measures for making sense of them and their relations in a more holistic way.  You (and all other scientists) can easily access the public measures here:

<div style="text-align: center; margin: 30px 0;">http://osm-measure.geog.uni-heidelberg.de</div>

| State   | access          | can refer to | can be referred to | modify          | delete |
| ------- |:---------------:|:------------:|:------------------:|:---------------:|:------:|
| Public  | everyone        | everyone     | everyone           | admin           | no one |
| Private | owner and admin | owner        | owner              | owner and admin | no one |

## Private measures

All measures, results, contexts, and people that you create are *private* by default.  Nobody except you is able to access them.  Feel free to test and develop new measures.  We would be happy if you bring your measures to perfection for then sharing them, but this is no necessity.

## Public measures

Measures (as well as results and contexts) can be published to a broader audience.  This is useful for other scientists who want to compare and make sense of a number of measures.  Providing measures that are published is a way of saying thanks to this project.

A measure needs to be implemented and documented very well in order to be published.  This may help the scientists who use this public information.  To ensure the quality of the published measures, the measures need to be reviewed by one of the administrators of this repository, or by someone on behalf of them.  In particular, the review will check that

* the code compiles well and does not throw exceptions,
* the semantic description is complete and fits well to the measure,
* the measure is relevant to the repository, and
* the measure is in a state that future adaptions seem to be unlikely.

In particular, the repository aims for not containing two very similar or even identical measures.  It may happen that a measure needs to be modified in before it is published, which is a chance to learn from and with the reviewer about which measures already exist and how measures can complement.

Before a measure is published, it will automatically be checked whether there exist dependencies which are yet unpublished.  When a measure is published, also the contexts, results, and people that the measure refers to need to be published.

Once a measure is published, it is public.  It is available to others.  You can easily recognize a measure as being public by the <i class="fas fa-certificate"/>-symbol.  If you are not an administrator, you are not able to modify a public measures.  This is due to technical reasons: when modifying a measure, the cache needs to refilled, resulting in a high computational load.

Public measures (and other items) are licensed under the MIT license.  This ensures that measures, the semantic information, and the results can freely be used for conducting research.
