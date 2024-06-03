// import * as go from "../go-debug"


const myDiagram = new go.Diagram("myDiagramDiv", 
{
  "commandHandler.archetypeGroupData": {text: "Group", isGroup: true},
  "undoManager.isEnabled": true,
  "toolManager.mouseWheelBehavior": go.WheelMode.Zoom,
});

myDiagram.nodeTemplate = new go.Node("Auto")
  .add(
    new go.Shape("RoundedRectangle", {fill: "whitesmoke"}),
    new go.TextBlock({margin: 5})
      .bind("text", "someValue")
  );

myDiagram.linkTemplate = new go.Link()
  .add(new go.Shape(), new go.Shape("OpenTriangle"))

myDiagram.model = new go.GraphLinksModel(
  [
    {key: "Alpha", someValue: 1},
    {key: "Beta", someValue: 2}
  ],
  [
    {from: "Alpha", to: "Beta"}
  ]
)
