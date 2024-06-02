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
    
  )