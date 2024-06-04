// import * as go from "../go-debug"

const myDiagram = new go.Diagram("myDiagramDiv", 
{
  "commandHandler.archetypeGroupData": {text: "Group", isGroup: true},
  "undoManager.isEnabled": true,
  "toolManager.mouseWheelBehavior": go.WheelMode.Zoom,
});

myDiagram.groupTemplate = new go.Group("Auto", {
  layout: new go.LayeredDigraphLayout({direction: 0, columnSpacing: 10})
}).add(
  new go.Shape("RoundedRectangle", {parameter1: 10, fill: "rgba(128,128,128,0.33)"}),
  new go.Panel("Vertical", {defaultAlignment: go.Spot.Left})
    .add(
      new go.Panel("Horizontal", {defaultAlignment: go.Spot.Top}).add(
        go.GraphObject.make("SubGraphExpanderButton"),
        new go.TextBlock({font: "Bold 12pt San-serif"}).bind("text")
      ),
      new go.Panel("Auto").add(
        new go.Shape("Rectangle"),
        new go.TextBlock("skdfhskdh")
      )
    )
)

myDiagram.layout = new go.LayeredDigraphLayout({
  direction: 90,
  layerSpacing: 10,
  isRealtime: false,
});

myDiagram.model = new go.GraphLinksModel(
  [
    {key: 1, text: "Alpha"},
    {key: 2, text: "Omega", isGroup: true},
    {key: 3, text: "Beta", group: 2},
    {key: 4, text: "Gama", group: 2},
    {key: 5, text: "Epsilon", group: 2},
    {key: 6, text: "Zeta", group: 2},
    {key: 7, text: "Delta"}
  ],
  [
    {from: 1, to: 2},
    {from: 3, to: 4},
    {from: 3, to: 5},
    {from: 4, to: 6},
    {from: 5, to: 6},
    {from: 2, to: 7},
  ]
)