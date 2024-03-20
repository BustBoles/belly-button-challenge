function buildMetadata(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let metadata = data.metadata;
    // Filter thru data for  sample
    let Array = metadata.filter(sampleObj => sampleObj.id == sample);
    let results = Array[0];
    // Use d3 so let panel eqals metadata
    let PANEL = d3.select("#sample-metadata");

    // clear metadata
    PANEL.html("");

    // for loop to search key-value tags in metadata.
    for (key in results){
      PANEL.append("h6").text(`${key.toUpperCase()}: ${results[key]}`);
    };

    // build gauge chart w frequency
    buildGauge(results.wfreq);
  });
}

// build charts with sample and assign variables on samples/results
function buildCharts(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let samples = data.samples;
    let Array = samples.filter(sampleObj => sampleObj.id == sample);
    let results = Array[0];

    let ids = results.otu_ids;
    let labels = results.otu_labels;
    let sample_value = results.sample_values;

    // Build a Bubble Chart
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    let bubbleData = [
      {
        x: ids,
        y: sample_value,
        text: labels,
        mode: "markers",
        marker: {
          size: sample_value,
          color: ids,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    let yticks = ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [
      {
        y: yticks,
        x: sample_value.slice(0, 10).reverse(),
        text: labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}

function init() {
  // reference dropdown select element
  let dropdown = d3.select("#selDataset");

  // populate the options with reference to samples names
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    let names = data.names;

    for (let i = 0; i < names.length; i++){
      dropdown
        .append("option")
        .text(names[i])
        .property("value", names[i]);
    };

    // initial plots by building off first sample
    let firstSample = names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // new data from new sample is fetched here
  buildCharts(newSample);
  buildMetadata(newSample);
}

// init dashboard
init();
