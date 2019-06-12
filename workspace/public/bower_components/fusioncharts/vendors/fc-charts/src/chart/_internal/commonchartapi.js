import BaseChart from'../../../../fc-core/src/base-chart';import canvasFactory from'../../factories/canvas';import{addDep,getDep}from'../../../../fc-core/src/dependency-manager';import Caption from'../../_internal/components/caption';import SubCaption from'../../_internal/components/sub-caption';import Background from'../../_internal/components/background';import ColorManager from'../../_internal/color-utils/colormanager';import NumberFormatter from'../../../../fc-core/src/number-formatter';import{raiseEventGroup}from'../../../../fc-core/src/event-api';import commonAnimation from'./common.animation';import{chartPaletteStr,getLinkAction,pluckNumber,pluck,BLANKSTRING,POSITION_BOTTOM,UNDEF,pluckFontSize,PXSTRING,setLineHeight,getFirstValue,pInt,getDashStyle,DASH_DEF,extend2,preDefStr,ROUND,POINTER,HAND,getMouseCoordinate,POSITION_MIDDLE,componentFactory,hasSVG,convertColor,parseConfiguration}from'../../../../fc-core/src/lib';import domEvtHandler from'../../../../fc-core/src/dom-event';import{ToolBar,Hamburger}from'../../../../fc-core/src/toolbox';import{SymbolStore}from'../../../../fc-core/src/toolbox/tools/helper';let Raphael=getDep('redraphael','plugin'),isVML='VML'===Raphael.type,mathMax=Math.max,mathMin=Math.min,mathRound=Math.round,eventMap={datalabelclick:!0,connectorclick:!0,categoryclick:!0,processclick:!0,milestoneclick:!0,labelclick:!0,dataplotclick:!0},SEVENTYSTRING=preDefStr.SEVENTYSTRING,AUTO=preDefStr.AUTOSTRING,BOLD='bold',NORMAL='normal',POSITION_RIGHT='right',supportsPointer='onpointerover'in window.document,POSITION_START='start',POSITION_END='end',assign=(...e)=>{let t=e[0],o=e.slice(1);return o.forEach(e=>{for(let o in e)e.hasOwnProperty(o)&&void 0!==e[o]&&(t[o]=e[o])}),t},createGroup=function(e,t,o){var a=o.getFromEnv('animationManager');return a.setAnimation({el:'group',attr:e,container:t,state:'appearing',component:o,label:'group'})},_registerMouseDown=function(t){let e=t.data.config;e._containerMouseState='mousedown',e._mdx1=t.clientX===UNDEF?t.changedTouches&&t.changedTouches[0].clientX:t.clientX,e.mdy1=t.clientY===UNDEF?t.changedTouches&&t.changedTouches[0].clientY:t.clientY,'touchstart'===t.type&&(e._touchStartedAt=new Date().getTime())},_registerMouseMove=function(t){var e=Math.abs;let o=t.data.config,a=t.clientX===UNDEF?t.changedTouches&&t.changedTouches[0].clientX:t.clientX,n=t.clientY===UNDEF?t.changedTouches&&t.changedTouches[0].clientY:t.clientY;(2.5<=e(o._mdx1-a)||2.5<=e(o.mdy1-n))&&(t.data.config._containerMouseState=void 0)},_onContainerClickIOS=function(t){500>new Date().getTime()-t.data.config._touchStartedAt&&setTimeout(function(){onContainerClick(t)})},onContainerClick=function(t){var e,o=t.data,a=o.getFromEnv('chartInstance'),n=t.originalEvent,i=o.config,r=getMouseCoordinate(o.getFromEnv('chart-container'),n,o);a.ref&&'mousemove'!==i._containerMouseState&&(e=extend2({height:a.args.height,width:a.args.width,pixelHeight:o.getFromEnv('chartWidth'),pixelWidth:o.getFromEnv('chartHeight'),id:a.args.id,renderer:a.args.renderer,container:a.options.containerElement},r),o.fireChartInstanceEvent('chartclick',e),i.link&&(!i.hotElemClicked||i.clickURLOverridesPlotLinks)&&o.getFromEnv('linkClickFN').call({link:i.link}),i.hotElemClicked=!1)},chartHoverManager=function(t){var e=t.type,o=t.data,a=o.getFromEnv('eventListeners');('mouseover'===e||'touchstart'===e)&&!1===o.config.mouseStateIn?(o.config.mouseStateIn=!0,CommonAPI.onContainerRollOver(t),a.push(domEvtHandler.listen(isVML?document:window,'mouseover',CommonAPI.winMouseHover,o))):('mouseout'===e||'touchend'===e)&&(o.config.posOb=!1)},toolbarPositionParser=function(e){return e='tr'===e||'rt'===e||'top right'===e||'right top'===e?'tr':'br'===e||'rb'===e||'bottom right'===e||'right bottom'===e?'br':'tl'===e||'lt'===e||'top left'===e||'left top'===e?'tl':'bl'===e||'lb'===e||'bottom left'===e||'left bottom'===e?'bl':'tr',e};function _createToolBox(){let e,t,o,a=this,n=this,i=a.config,r=a.getFromEnv('chart-attrib'),l='t'===i.toolbarVAlign?'chartMenuBar':'actionBar',s='t'===i.toolbarVAlign?'actionBar':'chartMenuBar',g=a.getFromEnv('tool-config'),c=i.printOption.enabled;e=n.config.realTimeConfig||{},componentFactory(a,ToolBar,s,0,[r]),componentFactory(a,ToolBar,l,1,[r]),t=a.getChildren(l)[0],a.addToEnv('toolbar',t),SymbolStore.register('ContextIcon',function(e,t,o){var a=e,n=t,i=2*o,r=mathRound(i/4),l=.7*mathRound(i/2),s=a-l,g=a+l,c=n+r,d=n-r;return['M',s,n,'L',g,n,'M',s,c,'L',g,c,'M',s,d,'L',g,d]}),o=t.attachChild(Hamburger,'tool',`hamburgerMenu-${t.getId()}-${a.getId()}-0`),a.addToEnv('hamburger',o),o.configure(Object.assign({},g,{name:'ContextIcon'})),o._mouseOutEvent||(o._mouseOutEvent=function(){this.getChild('listContainer').hide()}),o._mouseOverEvent||(o._mouseOverEvent=function(){this.getChild('listContainer').show()}),o.addEventListener('fc-mouseover',o._mouseOverEvent),o.addEventListener('fc-mouseout',o._mouseOutEvent),c&&o.appendInMenu([{name:'Print',action:'click',handler:function(){a.getFromEnv('chartInstance').print()}}]),n._setRTmenu&&n._setRTmenu(e.showRTmenuItem,e.useMessageLog)}function _drawDataset(){var e=this,t=e.getChildren('canvas')[0];t._mapChildren(e=>{e.syncDraw()})}function configurer(e){var t=this;t.config.skipConfigureIteration={},t.parseChartAttr(e),t.createComponent(e),t._createToolBox(),t.setTooltipStyle(),t.configureChildren()}addDep({name:'commonAnimation',type:'animationRule',extension:commonAnimation});class CommonAPI extends BaseChart{static getName(){return'CommonAPI'}plotEventHandler(e,t={},o,a){var n,i,r=this,l=t.type,s=getMouseCoordinate(r.getFromEnv('chart-container'),t,r),g=e&&e.data('eventArgs')||a,c=extend2(s,g),d=r.fireGroupEvent,h=e&&e.data('groupId'),p=function(){t.FusionChartsPreventEvent=!0};'index'in c&&!('dataIndex'in c)&&(c.dataIndex=c.index),'value'in c&&!('dataValue'in c)&&(c.dataValue=c.value),o=pluck(o,'dataplotclick').toLowerCase(),'dataplotrollover'===o?(t.FusionChartsPreventEvent=!1,d?raiseEventGroup(h,o,c,r.getFromEnv('chartInstance'),UNDEF,UNDEF,p):r.fireChartInstanceEvent(o,c,UNDEF,UNDEF,p)):d&&!eventMap[o]?raiseEventGroup(h,o,c,r.getFromEnv('chartInstance')):r.fireChartInstanceEvent(o,c),('fc-click'===l||'click'===l||'mouseup'===l||'touchend'===l)&&/click/i.test(o)&&(n=r.getFromEnv(),i=n&&n.linkClickFN,c.link&&i&&i.call({link:c.link},!0))}constructor(){super(),this.addToEnv('stringConstants',{COMPONENT:'component',CANVAS:'canvas',CAPTION:'caption'}),this.addToEnv('getMouseCoordinate',getMouseCoordinate),this._drawDataset=_drawDataset,this.config.mouseStateIn=!1,this.registerFactory('canvas',canvasFactory),this._firstConfigure=!0}getName(){return'Cartesian'}preConfigure(e){var t=this.getFromEnv('number-formatter');this.addToEnv('chart-attrib',e.chart),t?t.configure():this.addToEnv('number-formatter',new NumberFormatter(this)),super.preConfigure(e)}postConfigure(e){super.postConfigure(e),this._firstConfigure=!1}setDefaults(){super.setDefaults();let e=this.getFromEnv('number-formatter');e&&e.setDefaults&&e.setDefaults()}getType(){return'chartAPI'}parseChartAttr(e){var t=Math.abs;let o,a,n,i,r,l,s,g,c,d,h,p,m,u,v=this,b=e||v.getFromEnv('dataSource'),f=v.config.is3D,C=f?chartPaletteStr.chart3D:chartPaletteStr.chart2D,w=v.isBar,E=v.getFromEnv('color-manager');E||(E=new ColorManager(v),v.addToEnv('color-manager',E)),b.chart=b.chart||b.graph||b.map||{},delete b.map,delete b.graph,o=b.chart,o||(o=b.chart={}),a=v.config||(v.config={}),parseConfiguration(o,a,{},{showvalues:!0,crosslinecolor:!0,drawcrosslineontop:!0,crosslinealpha:!0,drawcrossline:!0}),a.showValues=pluckNumber(o.showvalues,a.showvalues),a.viewPortConfig={scaleY:1,scaleX:1,x:0,y:0},v.addToEnv('tool-config',assign({},{scale:o.toolbarbuttonscale,width:o.toolbarbuttonwidth,height:o.toolbarbuttonheight,radius:o.toolbarbuttonradius,spacing:o.toolbarbuttonspacing,marginTop:o.toolbarbuttonmargintop,marginLeft:o.toolbarbuttonmarginleft,marginRight:o.toolbarbuttonmarginright,marginBottom:o.toolbarbuttonmarginbottom,fill:o.toolbarbuttoncolor,labelFill:o.toolbarlabelcolor,symbolFill:o.toolbarsymbolcolor,hoverFill:o.toolbarbuttonhovercolor,stroke:o.toolbarbuttonbordercolor,symbolStroke:o.toolbarsymbolbordercolor,strokeWidth:o.toolbarbuttonborderthickness,symbolStrokeWidth:o.toolbarsymbolborderthickness,bSymbolPadding:o.toolbarsymbolpadding,symbolHPadding:o.toolbarsymbolhpadding,symbolVPadding:o.toolbarsymbolvpadding,hAlign:o.toolbarhalign,vAlign:o.toolbarvalign})),f&&(w?(a.xDepth=5,a.yDepth=5):(a.xDepth=10,a.yDepth=10),a.showCanvasBase=u=!!pluckNumber(o.showcanvasbase,1),a.canvasBasePadding=pluckNumber(o.canvasbasepadding,2),a.canvasBaseDepth=u?pluckNumber(o.canvasbasedepth,10):0,a.canvasBgDepth=pluckNumber(o.canvasbgdepth,3)),E&&E.configure(),a.placeAxisLabelsOnTop=pluckNumber(o.placexaxislabelsontop,0),a.enableAnimation=pluckNumber(o.animation,o.defaultanimation,1),a.showToolTip=pluckNumber(o.showtooltip,1),a.printOption={enabled:pluckNumber(o.printshowbutton,o.showprintmenuitem,0)},a.drawCrossLineOnTop=pluckNumber(o.drawcrosslineontop,1),s=a.style={},v.addToEnv('style',s),a.textDirection='1'===o.hasrtltext?'rtl':BLANKSTRING,s.inCanfontFamily=n=pluck(o.basefont,'Verdana,sans'),s.inCanfontSize=i=pluckFontSize(o.basefontsize,10),s.inCancolor=r=pluck(o.basefontcolor,E.getColor(C.baseFontColor)),s.outCanfontFamily=pluck(o.outcnvbasefont,n),s.fontSize=l=pluckFontSize(o.outcnvbasefontsize,i),s.outCanfontSize=l+PXSTRING,s.outCancolor=pluck(o.outcnvbasefontcolor,r).replace(/^#? ([a-f0-9]+)/ig,'#$1'),s.baseFontSize=i,s.inCanfontSize=i+PXSTRING,s.inCancolor=r.replace(/^#? ([a-f0-9]+)/ig,'#$1'),s.inCanvasStyle=d={fontFamily:n,fontSize:i,color:r},s.inCanLineHeight=h=setLineHeight(d),m=getFirstValue(o.valuebordercolor,BLANKSTRING),m=m?convertColor(m,pluckNumber(o.valueborderalpha,o.valuealpha,100)):BLANKSTRING,a.reverseXAxis=v.config.allowreversexaxis&&pluckNumber(o.reversexaxis,0),a.showBorder=pluckNumber(o.showborder,f?0:1),a.borderWidth=mathMax(a.showBorder?pluckNumber(o.borderthickness,1):0,0),a.useplotgradientcolor=pluckNumber(o.plotgradientcolor,a.useplotgradientcolor,0),a.valuefontbold=pluckNumber(o.valuefontbold,a.valuefontbold),a.dataLabelStyle=p={fontFamily:pluck(o.valuefont,n),fontSize:pluck(o.valuefontsize,pInt(i,10))+PXSTRING,lineHeight:h,color:convertColor(pluck(o.valuefontcolor,r),pluckNumber(o.valuefontalpha,o.valuealpha,100)),fontWeight:a.valuefontbold?BOLD:NORMAL,fontStyle:pluckNumber(o.valuefontitalic)?'italic':NORMAL,border:m||o.valuebgcolor?pluckNumber(o.valueborderthickness,1)+'px solid':BLANKSTRING,borderColor:m,borderThickness:pluckNumber(o.valueborderthickness,1),borderPadding:pluckNumber(o.valueborderpadding,2),borderRadius:pluckNumber(o.valueborderradius,0),backgroundColor:o.valuebgcolor?convertColor(o.valuebgcolor,pluckNumber(o.valuebgalpha,o.valuealpha,100)):BLANKSTRING,borderDash:pluckNumber(o.valueborderdashed,0)?getDashStyle(pluckNumber(o.valueborderdashlen,4),pluckNumber(o.valueborderdashgap,2)):DASH_DEF},setLineHeight(p),a.legendposition=pluck(o.legendposition,POSITION_BOTTOM),a.alignLegendWithCanvas=pluckNumber(o.alignlegendwithcanvas,1),a.origMarginTop=pluckNumber(o.charttopmargin,v.chartTopMargin,15),a.origMarginLeft=pluckNumber(o.chartleftmargin,v.chartLeftMargin,15),a.origMarginBottom=pluckNumber(o.chartbottommargin,v.chartBottomMargin,15),a.origMarginRight=pluckNumber(o.chartrightmargin,v.chartRightMargin,15),a.origCanvasLeftMargin=pluckNumber(o.canvasleftmargin,0),a.origCanvasRightMargin=pluckNumber(o.canvasrightmargin,0),a.origCanvasTopMargin=pluckNumber(o.canvastopmargin,0),a.origCanvasBottomMargin=pluckNumber(o.canvasbottommargin,0),a.minChartWidthPercent=pluckNumber(o.minchartwidth,v.minChartWidth,50)/100,a.minChartHeightPercent=pluckNumber(o.minchartheight,v.minChartHeight,50)/100,a.minCanvasWidthPercent=pluckNumber(o.mincanvaswidth,v.minCanvasWidth,60)/100,a.minCanvasHeightPercent=pluckNumber(o.mincanvasheight,v.minCanvasHeight,30)/100,g=pluck(o.zeroplanecolor,o.divlinecolor,E.getColor(C.divLineColor)),c=pluck(o.zeroplanealpha,o.divlinealpha,E.getColor('divLineAlpha')),a.zeroPlaneColor=convertColor(g,c),a.zeroPlaneBorderColor=convertColor(pluck(o.zeroplanebordercolor,g),pluckNumber(o.zeroplaneshowborder,1)?c:0),a.zeroPlaneShowBorder=pluckNumber(o.zeroplaneshowborder,1),a.realtimeEnabled=pluckNumber(o.realtimeenabled,v.isRealTime),a.showLegend=pluckNumber(o.showlegend,v.showLegend,1),a.link=o.clickurl,a.transposeAxis=pluckNumber(v.transposeAxis,o.transposeaxis,0),a.useEllipsesWhenOverflow=pluckNumber(o.useellipseswhenoverflow,o.useellipsewhenoverflow,1),a.drawTrendRegion=pluckNumber(o.drawcrossline,0),a.plotcolorintooltip=pluckNumber(o.plotcolorintooltip,v.config.singleseries?0:1),a.plotbinsize=mathMin(pluckNumber(o.plotbinsize,v.plotbinsize,.5),1),a.labelbinsize=mathMin(pluckNumber(o.labelbinsize,1),1),a.labelbinsize=a.plotbinsize>a.labelbinsize?a.plotbinsize:a.labelbinsize,a.enableMouseOutEvent=pluckNumber(o.enablemouseoutevent,v.enableMouseOutEvent,1),a.plotSpacePercent=Math.max(pluckNumber(o.plotspacepercent,v.plotSpacePercent),0),a.maxColWidth=t(pluckNumber(o.maxcolwidth,50)),a.maxBarHeight=t(pluckNumber(o.maxbarheight,50)),a.overlapColumns=pluckNumber(o.overlapcolumns,o.overlapbars,a.is3D?0:1),a.plotPaddingPercent=o.plotpaddingpercent,a.tooltipgrayoutcolor=pluck(o.tooltipgrayoutcolor,preDefStr.colors.AAAAAA),a.clickURLOverridesPlotLinks=pluckNumber(o.clickurloverridesplotlinks,0),a.toolbarX=pluckNumber(o.toolbarx),a.toolbarY=pluckNumber(o.toolbary),a.toolbarPosition=toolbarPositionParser(pluck(o.toolbarposition,'tr').toLowerCase()),a.toolbarHAlign='left'===(BLANKSTRING+o.toolbarhalign).toLowerCase()?'l':a.toolbarPosition.charAt(1),a.toolbarVAlign='bottom'===(BLANKSTRING+o.toolbarvalign).toLowerCase()?'b':a.toolbarPosition.charAt(0),a.toolbarVMargin=pluckNumber(o.toolbarvmargin,6),a.toolbarHMargin=pluckNumber(o.toolbarhmargin,10),v.addToEnv('chartConfig',a),v.addToEnv('linkClickFN',getLinkAction(v.getFromEnv('dataSource'),v)),v.addToEnv('dataLabelStyle',p)}createComponent(){let e,t=this,o=t.config;e=o.skipConfigureIteration,t.createBaseComponent(),t.getFromEnv('animationManager').setAnimationState(t._firstConfigure?'initial':'update'),componentFactory(t,Caption,'caption'),e.caption=!0,componentFactory(t,SubCaption,'subCaption'),e.subCaption=!0,componentFactory(t,Background,'background'),e.background=!0,t._createConfigurableComponents&&t._createConfigurableComponents(),t.config.realtimeEnabled&&t._realTimeConfigure&&t._realTimeConfigure()}configureChildren(){var e=this;e._mapChildren(t=>{!t.getState('removed')&&e.config.skipConfigureIteration[t.getName()]&&t.configure&&t.configure()})}_createToolBox(){_createToolBox.call(this)}configureAttributes(e){configurer.call(this,e)}setTooltipStyle(){let e=this.config,t=this.getFromEnv('toolTipController');t.setStyle({backgroundColor:hasSVG?convertColor(e.tooltipbgcolor||'FFF',e.tooltipbgalpha||100):(e.tooltipbgcolor||'FFF').replace(/\s+/g,'').replace(/^#?([a-f0-9]+)/ig,'#$1'),color:(e.tooltipcolor||e.basefontcolor||'545454').replace(/\s+/g,'').replace(/^#?([a-f0-9]+)/ig,'#$1'),borderColor:hasSVG?convertColor(e.tooltipbordercolor||'666',e.tooltipborderalpha||100):(e.tooltipbordercolor||'666').replace(/\s+/g,'').replace(/^#?([a-f0-9]+)/ig,'#$1'),borderWidth:pluckNumber(e.tooltipborderthickness,1)+'px',showToolTipShadow:pluckNumber(e.showtooltipshadow,e.showshadow,1),borderRadius:pluckNumber(e.tooltipborderradius,0)+'px',fontSize:pluckNumber(e.basefontsize,10)+'px',fontFamily:e.basefont||this.getFromEnv('style').inCanfontFamily,padding:pluckNumber(e.tooltippadding||3)+'px'})}__setDefaultConfig(){super.__setDefaultConfig();let e=this.config;e.valuefontbold=0,e.stickytracking=1,e.usemessagelog=0,e.zeroplanethickness=UNDEF,e.animationeffect='linear',e.showshadow=1,e.showhovereffect=UNDEF,e.plothovereffect=UNDEF,e.anchorhovereffect=UNDEF,e.plotborderdashed=UNDEF,e.stack100percent=UNDEF,e.showpercentvalues=UNDEF,e.showpercentintooltip=UNDEF,e.plotbordercolor=UNDEF,e.showtooltip=1,e.seriesnameintooltip=1,e.rotatevalues=0,e.minimizetendency=0,e.plotfillangle=270,e.valuepadding=2,e.useplotgradientcolor=1,e.plotborderthickness=1,e.plotfillalpha=SEVENTYSTRING,e.showvalues=1,e.valueposition=AUTO,e.drawcrossline=UNDEF,e.tooltipsepchar=', ',e.usedataplotcolorforlabels=0,e.placevaluesinside=0,e.showplotborder=1,e.use3dlighting=1,e.useroundedges=0,e.plotspacepercent=20,e.plotpaddingpercent=UNDEF,e.plotfillratio=UNDEF,e.maxcolwidth=50,e.plotborderdashlen=5,e.plotborderdashgap=4,e.useScaleRecursively=!0,e.formatnumberscale=1,e.decimals=2,e.decimalprecision=10,e.tooltipbgcolor='FFF',e.tooltipcolor=UNDEF,e.tooltipbordercolor='666',e.tooltipbgalpha=100,e.tooltipborderthickness=1,e.showtooltipshadow=UNDEF,e.basefontsize=10,e.basefont='Verdana, sans',e.tooltipborderradius=0,e.tooltippadding=3,e.tooltipborderalpha=100,e.origw=UNDEF,e.origh=UNDEF}configure(e){let t=this;t.sanitizeData(e),t.addToEnv('dataSource',e),t.fireEvent('internal.dataSanitized',{}),e=t.getFromEnv('dataSource'),super.configure(e)}_checkInvalidData(){var e=this,t=e.getFromEnv('dataSource'),o=e.getFromEnv('chartInstance');if(!e.isWidget&&!e.isMap&&!(t.data&&0!==t.data.length)&&!t.dataset&&!t.value&&!t.lineset&&!t.annotations&&!t.category&&!(t.tasks||t.process)&&!t.axis)return e.setChartMessage(),e.drawChartMessage(),o.__state.dataReady=!1,o.jsVars.hasNativeMessage=!0,o.jsVars.drawCount+=1,!0}_checkInvalidSpecificData(){let e=this.getFromEnv('dataSource'),t=e.dataset,o=e.categories;if(!t||!o||0===o.length||!o[0].category)return!0}sanitizeData(e){e.chart=e.chart||e.graph||e.map||{}}setChartEvents(){var e=this,t=e.getFromEnv('eventListeners'),o=e.getFromEnv('dataSource'),a=o&&o.chart,n=e.getFromEnv('paper')&&e.getFromEnv('paper').canvas,i=e.getFromEnv('chart-container'),r=a&&pluckNumber(a.enablechartmousemoveevent,0);(a||n)&&(domEvtHandler.unlisten(i,supportsPointer?'click':'touchend',supportsPointer?onContainerClick:_onContainerClickIOS),t.push(domEvtHandler.listen(i,'mousedown touchstart',_registerMouseDown,e)),t.push(domEvtHandler.listen(i,'mousemove touchmove',_registerMouseMove,e)),t.push(domEvtHandler.listen(i,supportsPointer?'click':'touchend',supportsPointer?onContainerClick:_onContainerClickIOS,e)),domEvtHandler.unlisten(n,'mouseover',chartHoverManager,e),domEvtHandler.unlisten(n,'touchstart',chartHoverManager,e),domEvtHandler.unlisten(n,'mouseout',chartHoverManager,e),domEvtHandler.unlisten(n,'touchend',chartHoverManager,e),t.push(domEvtHandler.listen(n,'mouseover touchstart mouseout touchend',chartHoverManager,e)),domEvtHandler.unlisten(i,'mousemove',CommonAPI.onContainerMouseMove,e),domEvtHandler.unlisten(i,'touchmove',CommonAPI.onContainerMouseMove,e),r&&t.push(domEvtHandler.listen(i,'mousemove touchmove',CommonAPI.onContainerMouseMove,e)))}get(e,t){var o=this[e];return t?o&&o[t]:o}prepareAttributes(){this.config.hasChartMessage||super.prepareAttributes()}disposeChartStyleSheet(){var e=this,t=e.getFromEnv('paper');t&&t.cssClear()}createChartStyleSheet(){var e=this,t=e.getFromEnv('paper');t.cssRender()}_dispose(){let e=this.getFromEnv('eventListeners'),t=e&&e.length;for(;t--;)e[t].unlisten();super._dispose()}_allocateSpace(e){var t,o,a=this,n=a.getChildren('canvas'),i=n&&n[0].config,r=a.config,l=r.canvasHeight,s=r.canvasWidth,g=r.availableHeight,c=r.availableWidth;o=r.canvasLeft+=e.left||0,t=r.canvasTop+=e.top||0,s=r.canvasWidth=mathMax(s-((e.left||0)+(e.right||0)),0),l=r.canvasHeight=mathMax(l-((e.top||0)+(e.bottom||0)),0),r.availableHeight=mathMax(g-((e.top||0)+(e.bottom||0)),0),r.availableWidth=mathMax(c-((e.left||0)+(e.right||0)),0),r.canvasRight=o+s,r.canvasBottom=t+l,i&&(i.canvasPaddingLeft=mathMax(i.canvasPaddingLeft,e.paddingLeft||0),i.canvasPaddingRight=mathMax(i.canvasPaddingRight,e.paddingRight||0),i.canvasPaddingTop=mathMax(i.canvasPaddingTop,e.paddingTop||0),i.canvasPaddingBottom=mathMax(i.canvasPaddingBottom,e.paddingBottom||0)),n&&n[0].setDimension({top:t,left:o,width:s,height:l})}_fetchCaptionPos(e){var t,o=this,a=o.config,n=a.width,i=o.getChildren('chartMenuBar')&&o.getChildren('chartMenuBar')[0],r=i?i.getLogicalSpace():{},l=r.width||0,s=o.getChildren('caption')&&o.getChildren('caption')[0],g=s.config,c=g.width,d='l'===a.toolbarHAlign,h=a.width-e,p=d?e:h,m=a.origMarginRight,u=a.origMarginLeft,v=d?u:m;return t=g.align===POSITION_MIDDLE?p-c/2-v-l:'start'===g.align?d?-1:n-a.canvasLeft-v-c-l+g.horizontalPadding:d?n-(m+u+l+c):-1,t}_manageCaptionSpacing(e,t){var o,a=this,n=a.getChildren('caption')[0];return o=n.manageSpace(e,t),o}_manageChartMenuBar(e){var t,o,a=this,n=a.config,i=a.getChildren('chartMenuBar')&&a.getChildren('chartMenuBar')[0],r=void 0!==n.toolbarY,l=i?i.getLogicalSpace():{height:0,width:0},s=a.getChildren('caption')&&a.getChildren('caption')[0],g=s.config,c=g.isOnTop,d=n.width/2,h=n.canvasRight,p=h?(n.canvasLeft+h)/2:d,m=0,u=g.alignWithCanvas?p:d;return r&&(l.height=0),i&&i.setDimension({x:void 0===n.toolbarX?pluckNumber('l'===n.toolbarHAlign?0:+n.width):n.toolbarX,y:void 0===n.toolbarY?pluckNumber('t'===n.toolbarVAlign?0:+n.height):n.toolbarY,width:l.width,height:l.height}),delete g._offsetHeight,o=g.alignWithCanvas?n.canvasWidth:n.width-n.origMarginLeft-n.origMarginRight,c?(t=a._manageCaptionSpacing(e,o),m=a._fetchCaptionPos(u),g._offsetHeight=0>m?l.height:0,t.top=0>m?pluckNumber(t.top,0)+l.height:mathMax(t.top,l.height),a._allocateSpace(t)):(a._allocateSpace({top:l.height}),t=a._manageCaptionSpacing(e,o),a._allocateSpace(t)),{top:l?mathMax(l.height,t.top):t.top,bottom:t.bottom}}_manageSpace(){var e,t,o,a,n,i,r,l,s,g,c,d,h=this,p=h.getChildren('canvas')&&h.getChildren('canvas')[0],m=p&&p.config,u=h.config,v=h.getFromEnv('chartWidth'),b=h.getFromEnv('chartHeight');u.width=v,u.height=b,u.minChartHeight=s=u.minChartHeightPercent*b,u.minChartWidth=g=u.minChartWidthPercent*v,u.minCanvasWidth=e=u.minCanvasWidthPercent*g,u.minCanvasHeight=t=u.minCanvasHeightPercent*s,u.marginTop=o=u.origMarginTop,u.marginLeft=a=u.origMarginLeft,u.marginBottom=n=u.origMarginBottom,u.marginRight=i=u.origMarginRight,u.canvasMarginTop=u.origCanvasTopMargin,u.canvasMarginLeft=u.origCanvasLeftMargin,u.canvasMarginBottom=u.origCanvasBottomMargin,u.canvasMarginRight=u.origCanvasRightMargin,u.canvasHeight=r=u.height-u.marginTop-u.marginBottom,u.canvasWidth=l=u.width-u.marginLeft-u.marginRight,u.availableHeight=r-t,u.availableWidth=l-e,r<s&&(c=b-s,u.canvasHeight=s,d=o+n,u.marginTop=c*o/d,u.marginBottom=c*n/d,u.availableHeight=s-t),l<g&&(c=v-g,d=i+a,u.canvasWidth=g,u.marginLeft=c*a/d,u.marginRight=c*i/d,u.availableWidth=g-e),u.canvasLeft=u.marginLeft,u.canvasTop=u.marginTop,m&&(m.canvasPaddingLeft=mathMin(m.origCanvasLeftPad,mathRound(.1*u.height)),m.canvasPaddingRight=mathMin(m.origCanvasRightPad,mathRound(.1*u.height)),m.canvasPaddingTop=mathMin(m.origCanvasTopPad,mathRound(.1*u.height)),m.canvasPaddingBottom=mathMin(m.origCanvasBottomPad,mathRound(.1*u.height))),h._spaceManager()}_preDraw(){var e=this;e._mapChildren(e=>{!e.getState('removed')&&e.preDraw&&e.preDraw()}),e._setAxisLimits&&e._setAxisLimits(),e._createToolBoxGantt&&e._createToolBoxGantt()}_clearTimers(){var e,t=this,o=t.config&&t.config.realTimeConfig,a=t.config.timers,n=a&&a.setTimeout,i=a&&a.setInterval;for(e in o&&(o.refreshIntervalFlag=!1),n)clearTimeout(n[e]);for(e in i)clearInterval(i[e])}setChartCursor(){var e=this,t=e.config.link,o=e.getFromEnv('paper').canvas.style;Raphael.svg?o.cursor=t?POINTER:'default':e.getFromEnv('paper').canvas.style.cursor=t?HAND:'default'}_createLayers(){var e,t=this,o=t.getFromEnv('animationManager');e=t.getContainer('parentgroup')||t.addContainer('parentgroup',o.setAnimation({el:'group',attr:{name:'parentgroup'},component:t})),t.getChildContainer('backgroundGroup')||t.addChildContainer('backgroundGroup',createGroup({name:'background'},e,t)),t.getChildContainer('axisBottomGroup')||t.addChildContainer('axisBottomGroup',createGroup({name:'axisbottom'},e,t)),t.getChildContainer('belowPlotGroup')||t.addChildContainer('belowPlotGroup',createGroup({name:'belowplot'},e,t)),t.getChildContainer('plotGroup')||t.addChildContainer('plotGroup',createGroup({name:'plots'},e,t)),t.getChildContainer('axisTopGroup')||t.addChildContainer('axisTopGroup',createGroup({name:'axistop'},e,t)),t.getChildContainer('sumLabelsLayer')||t.addChildContainer('sumLabelsLayer',createGroup({name:'sumlabels',class:'fusioncharts-datalabels'},e,t)),t.getChildContainer('datalabelsGroup')||t.addChildContainer('datalabelsGroup',createGroup({name:'datalabel'},e,t)),t.getChildContainer('abovePlotGroup')||t.addChildContainer('abovePlotGroup',createGroup({name:'aboveplot'},e,t)),t.getChildContainer('captionGroup')||t.addChildContainer('captionGroup',createGroup({name:'caption'},e,t)),t.getChildContainer('defaultGroup')||t.addChildContainer('defaultGroup',createGroup({name:'chartdefault'},e,t)),t.getChildContainer('defaultShadowGroup')||t.addChildContainer('defaultShadowGroup',createGroup({name:'chartdefault-shadow'},e,t)),t.getChildContainer('trackerGroup')||t.addChildContainer('trackerGroup',createGroup({name:'tracker'},e,t)),t.getChildContainer('toolbar-master')||t.addChildContainer('toolbar-master',createGroup({name:'toolbar-master'},e,t)),t.getChildContainer('logoGroup')||t.addChildContainer('logoGroup',o.setAnimation({el:'group',attr:{name:'logo'},component:t}))}_setDataLabelStyle(){var e=this,t=e.config.dataLabelStyle,o={fontFamily:t.fontFamily,fontSize:t.fontSize,fontWeight:t.fontWeight,fontStyle:t.fontStyle},a=e.getChildContainer('datalabelsGroup');a.css(o)}_manageCaptionPosition(){let e,t,o,a,n=this,i=n.config,r=n.getChildren(),l=r.caption&&r.caption[0],s=r.subCaption&&r.subCaption[0],g=l.config,c=g.widgetValueHeight||0,d=s.config,h=i.canvasWidth,p=g.align,m=g.text,u=g.alignWithCanvas,v=g.horizontalPadding,b=i.width,f=i.canvasLeft,C=i.canvasRight,w=i.marginRight,E=i.marginLeft,F=i.marginTop,T=(mathRound(f)||0)+pluckNumber(h,b)/2,M=g.height,L=d.height,S=r.legend&&r.legend[0]&&r.legend[0].config||{},_=S.height||0,k=S.legendPadding||0,y=i.legendposition,x=n.getFromEnv('gLegend')||{},P=0,H=!!(x.conf||{}).showLegend,A=n.config.borderWidth,B=r.actionBar,W=0;S.isActive||(_=0),H&&n.config.gLegendEnabled&&(P=x.getLogicalSpace().height);e=p===POSITION_END?u?C-v:b-v:p===POSITION_START?u?f+v:v:u?T:E+.5*(b-E-w)||b/2;g.isOnTop?t=(A||0)+(F||0):(y.toLowerCase()===POSITION_RIGHT&&(k=0,_=0,P=0),B&&(a=B[0].getLogicalSpace&&B[0].getLogicalSpace()||{},W=a.height,(W===UNDEF||W===1/0||0>W)&&(W=0)),t=n.config.height-n.config.marginBottom-M-(L||0)-(A||0)-(k||0)-(_||0)-P-c-W),t+=g._offsetHeight||0,l.setDimention({x:e,y:t}),o=m?t+M+2:t||F||0,s.setDimention({x:e,y:o})}_updateVisuals(){var e,t=this,o=t.getFromEnv('core-options'),a=t.getFromEnv('paper'),n=t.getFromEnv('animationManager'),i=t.config,r=t.getFromEnv('chartWidth'),l=t.getFromEnv('chartHeight');o&&!o._SVGDefinitionURLUpdated&&(/^\s*absolute\s*$/i.test(o.SVGDefinitionURL)&&(Raphael._url=(Raphael._g&&Raphael._g.win||window).location.href.replace(/#.*?$/,BLANKSTRING)),o._SVGDefinitionURLUpdated=!0),a?(!hasSVG&&(i._prevWidth||i._prevHeight)&&a.setSize(i._prevWidth,i._prevHeight),e={width:r,height:l},n.setAnimation({el:a,attr:e,component:t})):(a=new Raphael(t.getFromEnv('chart-container'),r,l),a.setHTMLClassName('fusioncharts-div'),t.addToEnv('paper',a),a.setConfig('stroke-linecap',ROUND),t.setChartEvents()),i._prevWidth=r,i._prevHeight=l,t.setChartCursor(),t._createLayers(),t._setDataLabelStyle(),t._drawCreditLabel()}allocateDimensionOfChartMenuBar(){var e=this,t=e.config,o=e.getFromEnv('toolbar'),a=o.config,n=a.hDirection,i=a.vDirection,r=o.getLogicalSpace(),{y:l,x:s}=o.getDimension();'t'===t.toolbarVAlign?(l+=t.toolbarVMargin*i+mathMin(0,r.height*i),s+=t.toolbarHMargin*n-mathMax(0,r.width*n),s='l'===t.toolbarHAlign?s+r.width:s-r.width):(l=t.height-t.marginBottom-r.height,s='b'===t.toolbarVAlign&&'r'===t.toolbarHAlign?t.width-t.marginRight-r.width:t.marginLeft),t.toolbarX!==void 0&&(s=t.toolbarX),t.toolbarY!==void 0&&(l=t.toolbarY),o.setDimension({x:s,y:l,width:r.width,height:r.height}),o.manageSpace()}draw(){var e=this,t=e.getFromEnv('chartInstance');e.config.hasChartMessage?(e._hide(),e.drawChartMessage(),e.fireChartInstanceEvent('nodatatodisplay',{},[t.id]),t.jsVars.drawCount+=1,t.__state.dataReady=!1,t.jsVars.hasNativeMessage=!0):(e._hideChartMessage(),e._clearTimers&&e._clearTimers(),e.config.plotOverFlow=!1,e._show(),e._updateVisuals(),e.setState('initiated',!0),t.jsVars.drawCount+=1,t.jsVars.hasNativeMessage=!1)}manageSpace(){let e=this;e.config.hasChartMessage||(e._preDraw(),e.addToolbar&&e.addToolbar(),e._manageSpace(),e._postSpaceManagement&&e._postSpaceManagement())}_show(){this.getContainer('parentgroup')&&this.getContainer('parentgroup').show()}_manageActionBarSpace(){var e=this,t=e.config,o=e.getChildren('actionBar'),a=o&&o[0]&&o[0].getLogicalSpace()||{},n=a.height||0;return t.actionBarHeight=n,{bottom:n}}_hide(){this.getContainer('parentgroup')&&this.getContainer('parentgroup').hide()}static onContainerMouseMove(t){var e,o=t.data,a=o.getFromEnv('chartInstance'),n=t.originalEvent,i=getMouseCoordinate(o.getFromEnv('chart-container'),n,o);a.ref&&(e=extend2({height:a.args.height,width:a.args.width,pixelHeight:o.getFromEnv('chartWidth'),pixelWidth:o.getFromEnv('chartHeight'),id:a.args.id,renderer:a.args.renderer,container:a.options.containerElement},i),o.fireChartInstanceEvent('chartMouseMove',e))}static onContainerRollOver(t){var e,o=t.data,a=o.getFromEnv('chartInstance'),n=t.originalEvent,i=getMouseCoordinate(o.getFromEnv('chart-container'),n,o);a.ref&&(e=extend2({height:a.args.height,width:a.args.width,pixelHeight:o.getFromEnv('chartWidth'),pixelWidth:o.getFromEnv('chartHeight'),id:a.args.id,renderer:a.args.renderer,container:a.options.containerElement},i),o.fireChartInstanceEvent('chartRollOver',e))}static onContainerRollOut(t){var e,o=t.chart,a=o.getFromEnv('chartInstance'),n=t.event,i=getMouseCoordinate(o.getFromEnv('chart-container'),n,o);a.ref&&(e=extend2({height:a.args.height,width:a.args.width,pixelHeight:o.getFromEnv('chartWidth'),pixelWidth:o.getFromEnv('chartHeight'),id:a.args.id,renderer:a.args.renderer,container:a.options.containerElement},i),o.fireChartInstanceEvent('chartRollOut',e))}static winMouseHover(t){var e=t.originalEvent,o=e.target||e.originalTarget||e.srcElement||e.relatedTarget||e.fromElement,a=t.data,n=a.getFromEnv('paper'),i={chart:a,event:t.originalEvent};isVML?!n.getById(o.parentNode.raphaelid)&&(CommonAPI.onContainerRollOut(i),a.config.mouseStateIn=!1,domEvtHandler.unlisten(document,'mouseover',CommonAPI.winMouseHover)):!o.viewportElement&&(a.config.mouseStateIn=!1,CommonAPI.onContainerRollOut(i),domEvtHandler.unlisten(window,'mouseover',CommonAPI.winMouseHover))}}export default CommonAPI;export{_drawDataset,_createToolBox,configurer};