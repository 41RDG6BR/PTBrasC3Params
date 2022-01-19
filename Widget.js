define([
  'dojo/_base/declare', 
  'jimu/BaseWidget',
  "esri/dijit/Search",
  'dojo/Deferred',
  'dgrid/OnDemandList',
  'dgrid/Selection',
  "dojo/store/Memory",
  "dojo/on", 
  "dojo/_base/lang",
  "esri/layers/FeatureLayer",
  "jimu/Utils",
  "jimu/dijit/TabContainer3",
  "dijit/layout/ContentPane",
  "dojo/_base/array",
  "esri/Color",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/graphic", 
  "esri/geometry/Point",
  'jimu/LayerInfos/LayerInfos',
  "./templates/Aeo/Widget",
  "./templates/Proprietarios/Widget",
  "./templates/Pocos/Widget",
  "./templates/Teste/Widget",
],
function(
  declare, 
  BaseWidget,
  Search,
  Deferred,
  OnDemandList,
  Selection,
  Memory,
  on,
  lang,
  FeatureLayer,
  utils,
  TabContainer3,
  ContentPane,
  array,
  Color,
  SimpleMarkerSymbol, 
  SimpleLineSymbol, 
  SimpleFillSymbol,
  Graphic,
  Point,
  LayerInfos,
  Aeo,
  Prop,
  Pocos,
  Teste,
) {
  return declare([BaseWidget], {

    baseClass: 'p-t-bras',

    postCreate: function() {
      this.inherited(arguments);

      this._initTabs()

    },
    
    _initTabs: function() {

      var tabs = [];

      this.aeo = new Aeo({
        wabWidget: "setando valor",
        serviceUrl: this.config.aeo.serviceUrl       
      })
      // console.log(this.aeo.wabWidget, 'wabaeo')
      // console.log(this.aeo.params, 'params')
      tabs.push({
        title: this.nls.configTitles[0],
        content: this.aeo
      })

      this.prop = new Prop({
        wabWidget: this
      })
      tabs.push({
        title: this.nls.configTitles[1],
        content: this.prop
      })

      this.pocos = new Pocos({
        wabWidget: this
      })
      tabs.push({
        title: this.nls.configTitles[2],
        content: this.pocos
      })
      this._tcConfig = new TabContainer3({        
        tabs: tabs,
        isNested: true,
        style: 'width:100%; height:100%;'
      })

      this.tabContainer.appendChild(this._tcConfig.domNode);

    },

    _getDataStore: function(e) {
      var featureSetRemapped = [];
      var def = new Deferred();
      var features = e.result.feature

      var featureSet = utils.toFeatureSet(features)
      
      utils.zoomToFeatureSet(this.map, featureSet)
      .then(
        lang.hitch(this, function () {
          this._addGeometryToMapGraphics(featureSet)
        })
      );

        def.resolve(new Memory({
          data: featureSetRemapped
        })
      );
      return def;
    },
    
    _addGeometryToMapGraphics: function (geometry) {
      var geometry = geometry.features[0].geometry
      var lineSymbol = new SimpleLineSymbol();
      lineSymbol.setWidth(3);
      lineSymbol.setColor(new Color("#ffeb3b"));

      var graphic = new Graphic(geometry, lineSymbol);
      this.map.graphics.add(graphic);
      this._graphics[graphicType] = graphic;
    },

  });

});
