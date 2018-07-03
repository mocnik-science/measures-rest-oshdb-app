# Measures (JAVA code)

If the code of a measure is more complex, it might be easier to implement the measure using JAVA instead of the SOAP syntax.  This has several consequences:

* You have access to the full JAVA syntax.
* You can use your favourite IDE.
* You have to handle some casting and aggregation issues on your own.

Follow the steps listed below to implement your measure using JAVA.

## Step 1: Fork the Github repository

First, you have to fork the [https://github.com/giscience/osm-measure-repository](https://github.com/giscience/osm-measure-repository).  To do so, open the website and click on the button **Fork** at the top right side.  You are required to be logged in to create a fork.  As a result, you should have your own repository named *https://github.com/your-name/osm-measure-repository*.

## Step 2: Create the import in the OSM Measure Repository

Create a new measure in the *OSM Measure Repository*.  Click on the <i class="fas fa-edit"/>-symbol and rename the measure to fit your needs.  Then, open the code view by clicking on the <i class="fas fa-code"/>-symbol.  Insert the following **SOAP directive**:

```java
// import from github/your-name/osm-measure-repository //
```

Observe that you have to adapt the “your-name” part of the directive in order to match your Github account name.  Below the code, you will find a short message stating the name that you will use for your JAVA class.  If the name of your measure is “Topological completeness”, the name of your JAVA class would be “MeasureTopologicalCompleteness”.  Memorize this name because you will need it later.

## Step 3: Clone the Github repository and prepare the measure

For cloning the Github repository to your computer, you can either use a GUI or the command line.  If you choose the latter option, you have to type:

```bash
git clone https://github.com/your-name/osm-measure-repository
```

Now, you have a local copy of the repository on your computer.  Now, you ...

TODO

## Step 4: Implement the measure

TODO

## Step 5: Commit and push

In order to make the implementation of the measure including most recent changes available to the *OSM Measure Repository*, you have to commit your changes:

```bash
git add *
git commit -m "MeasureTopologicalCompleteness introduced/improved"
```

Then, you can easily upload the measure to Github:

```bash
git push
```

## Step 6: Run the measure

Congrats, you are done!  Just enable the measure using the <i class="fas fa-toggle-on"/>-element and start the server by clicking on the <i class="fas fa-play"/>-symbol.
