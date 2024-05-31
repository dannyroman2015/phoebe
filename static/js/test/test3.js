// import * as go from "../go-debug"


const myDiagram = new go.Diagram("myDiagramDiv", 
{
  "clickCreatingTool.archetypeNodeData": {text: "Node", color: "lightgray"},
  "commandHandler.archetypeGroupData": {text: "Group", isGroup: true},
  "undoManager.isEnabled": true,
  "toolManager.mouseWheelBehavior": go.WheelMode.Zoom,
});


myDiagram.nodeTemplate = new go.Node("Auto")
  .add(
    new go.Shape("RoundedRectangle", {fill: "white"})
      .bind("fill", "color"),
    new go.TextBlock({margin: 5})
      .bind("text")
  )

myDiagram.model = new go.GraphLinksModel(
  [
    {key: "Alpha", color: "red", text: "Trung"},
    {key: "Beta", group:"gg", color: "yellow", text: "Thanh"},
    {key: "gg", isGroup: true}
  ],
  [
    {from: "Alpha", to: "Beta"}
  ]
)