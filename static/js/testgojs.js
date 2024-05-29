function init() {
  // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
  // For details, see https://gojs.net/latest/intro/buildingObjects.html
  const $ = go.GraphObject.make; // for conciseness in defining templates

  var myDiagram = new go.Diagram(
    'myDiagramDiv', // must name or refer to the DIV HTML element
    {
      initialAutoScale: go.AutoScale.Uniform, // an initial automatic zoom-to-fit
      contentAlignment: go.Spot.Center, // align document to the center of the viewport
      layout: $(go.ForceDirectedLayout, // automatically spread nodes apart
        { defaultElectricalCharge: 300, defaultSpringLength: 150 }
      ),
      'undoManager.isEnabled': true,
    }
  );

  // define each Node's appearance
  myDiagram.nodeTemplate = $(go.Node,
    'Auto', // the whole node panel
    { locationSpot: go.Spot.Center },
    // define the node's outer shape, which will surround the TextBlock
    $(go.Shape, 'Rectangle', { fill: $(go.Brush, 'Linear', { 0: 'rgb(254, 201, 0)', 1: 'rgb(254, 162, 0)' }), stroke: 'black' }),
    $(go.TextBlock, { font: 'bold 10pt helvetica, bold arial, sans-serif', margin: new go.Margin(4, 4, 3, 20) }, new go.Binding('text', 'text'))
  );

  // replace the default Link template in the linkTemplateMap
  myDiagram.linkTemplate = $(go.Link, // the whole link panel
    // path animation works with these kinds of links too:
    //{ routing: go.Routing.AvoidsNodes },
    //{ curve: go.Curve.Bezier },
    $(go.Shape, // the link shape
      { stroke: 'black' }
    ),
    $(go.Shape, // the arrowhead
      { toArrow: 'standard', stroke: null }
    ),
    $(go.Panel,
      'Auto',
      $(go.Shape, // the label background, which becomes transparent around the edges
        {
          fill: $(go.Brush, 'Radial', { 0: 'rgb(240, 240, 240)', 0.3: 'rgb(240, 240, 240)', 1: 'rgba(240, 240, 240, 0)' }),
          stroke: null,
        }
      ),
      $(go.TextBlock, // the label text
        {
          textAlign: 'center',
          font: '10pt helvetica, arial, sans-serif',
          stroke: '#555555',
          margin: 4,
        },
        new go.Binding('text', 'text')
      )
    )
  );

  myDiagram.nodeTemplateMap.add(
    'token',
    $(go.Part,
      { locationSpot: go.Spot.Center, layerName: 'Foreground' },
      $(go.Shape, 'Circle', { width: 12, height: 12, fill: 'green', strokeWidth: 0 }, new go.Binding('fill', 'color'))
    )
  );

  // create the model for the concept map
  var nodeDataArray = [
    { key: 1, text: 'Concept Maps' },
    { key: 2, text: 'Organized Knowledge' },
    { key: 3, text: 'Context Dependent' },
    { key: 4, text: 'Concepts' },
    { key: 5, text: 'Propositions' },
    { key: 6, text: 'Associated Feelings or Affect' },
    { key: 7, text: 'Perceived Regularities' },
    { key: 8, text: 'Labeled' },
    { key: 9, text: 'Hierarchically Structured' },
    { key: 10, text: 'Effective Teaching' },
    { key: 11, text: 'Crosslinks' },
    { key: 12, text: 'Effective Learning' },
    { key: 13, text: 'Events (Happenings)' },
    { key: 14, text: 'Objects (Things)' },
    { key: 15, text: 'Symbols' },
    { key: 16, text: 'Words' },
    { key: 17, text: 'Creativity' },
    { key: 18, text: 'Interrelationships' },
    { key: 19, text: 'Infants' },
    { key: 20, text: 'Different Map Segments' },
  ];
  var linkDataArray = [
    { from: 1, to: 2, text: 'represent' },
    { from: 2, to: 3, text: 'is' },
    { from: 2, to: 4, text: 'is' },
    { from: 2, to: 5, text: 'is' },
    { from: 2, to: 6, text: 'includes' },
    { from: 2, to: 10, text: 'necessary\nfor' },
    { from: 2, to: 12, text: 'necessary\nfor' },
    { from: 4, to: 5, text: 'combine\nto form' },
    { from: 4, to: 6, text: 'include' },
    { from: 4, to: 7, text: 'are' },
    { from: 4, to: 8, text: 'are' },
    { from: 4, to: 9, text: 'are' },
    { from: 5, to: 9, text: 'are' },
    { from: 5, to: 11, text: 'may be' },
    { from: 7, to: 13, text: 'in' },
    { from: 7, to: 14, text: 'in' },
    { from: 7, to: 19, text: 'begin\nwith' },
    { from: 8, to: 15, text: 'with' },
    { from: 8, to: 16, text: 'with' },
    { from: 9, to: 17, text: 'aids' },
    { from: 11, to: 18, text: 'show' },
    { from: 12, to: 19, text: 'begins\nwith' },
    { from: 17, to: 18, text: 'needed\nto see' },
    { from: 18, to: 20, text: 'between' },
  ];
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

  initTokens();
}

function initTokens() {
  var oldskips = myDiagram.skipsUndoManager;
  myDiagram.skipsUndoManager = true;
  myDiagram.model.addNodeDataCollection([
    { category: 'token', at: 1, color: 'green' },
    { category: 'token', at: 2, color: 'blue' },
    { category: 'token', at: 4, color: 'yellow' },
    { category: 'token', at: 5, color: 'purple' },
    { category: 'token', at: 7, color: 'red' },
    { category: 'token', at: 8, color: 'black' },
    { category: 'token', at: 9, color: 'green' },
    { category: 'token', at: 11, color: 'blue' },
    { category: 'token', at: 12, color: 'yellow' },
    { category: 'token', at: 17, color: 'purple' },
    { category: 'token', at: 18, color: 'red' },
  ]);
  myDiagram.skipsUndoManager = oldskips;
  window.requestAnimationFrame(updateTokens);
}

function updateTokens() {
  var oldskips = myDiagram.skipsUndoManager;
  myDiagram.skipsUndoManager = true; // don't record these changes in the UndoManager!
  var temp = new go.Point();
  myDiagram.parts.each((token) => {
    var data = token.data;
    if (!data) return;
    var at = data.at;
    if (at === undefined) return;
    var from = myDiagram.findNodeForKey(at);
    if (from === null) return;
    var frac = data.frac;
    if (frac === undefined) frac = 0.0;
    var next = data.next;
    var to = myDiagram.findNodeForKey(next);
    if (to === null) {
      // nowhere to go?
      positionTokenAtNode(token, from); // temporarily stay at the current node
      data.next = chooseDestination(token, from); // and decide where to go next
    } else {
      // proceed toward the "to" port
      var link = from.findLinksTo(to).first();
      if (link !== null) {
        token.location = link.path.getDocumentPoint(link.path.geometry.getPointAlongPath(frac, temp));
      } else {
        // stay at the current node
        positionTokenAtNode(token, from);
      }
      if (frac >= 1.0) {
        // if beyond the end, it's "AT" the NEXT node
        data.frac = 0.0;
        data.at = next;
        data.next = undefined; // don't know where to go next
      } else {
        // otherwise, move fractionally closer to the NEXT node
        data.frac = frac + 0.01;
      }
    }
  });
  myDiagram.skipsUndoManager = oldskips;
  window.requestAnimationFrame(updateTokens);
}

// determine where to position a token when it is resting at a node
function positionTokenAtNode(token, node) {
  // these details depend on the node template
  token.location = node.position.copy().offset(4 + 6, 5 + 6);
}

function chooseDestination(token, node) {
  var dests = new go.List().addAll(node.findNodesOutOf());
  if (dests.count > 0) {
    var dest = dests.elt(Math.floor(Math.random() * dests.count));
    return dest.data.key;
  }
  var arr = myDiagram.model.nodeDataArray;
  // choose a random next data object that is not a token and is not the current Node
  var data = null;
  while (((data = arr[Math.floor(Math.random() * arr.length)]), data.category === 'token' || data === node.data)) {}
  return data.key;
}
window.addEventListener('DOMContentLoaded', init);