import SSCartesian3D from'../_internal/sscartesian3d';import Column3DDataset from'../../dataset/column3d';class Column3D extends SSCartesian3D{static getName(){return'Column3D'}constructor(){super(),this.defaultPlotShadow=1,this.defaultZeroPlaneHighlighted=!1}getName(){return'Column3D'}__setDefaultConfig(){super.__setDefaultConfig();let a=this.config;a.is3D=!0,a.hasLegend=!1,a.singleseries=!0,a.friendlyName='3D Column Chart',a.showplotborder=0,a.enablemousetracking=!0}getDSdef(){return Column3DDataset}}export default Column3D;