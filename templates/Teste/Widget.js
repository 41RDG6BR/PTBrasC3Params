define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/text!./Widget.html",
    "esri/dijit/Search",
    'dojo/Deferred',
    'dgrid/OnDemandList',
    'dgrid/Selection',
    "dojo/store/Memory",
    "esri/layers/FeatureLayer", 
    "dojo/on", 
    "dojo/_base/lang",
    "jimu/Utils",
    "esri/tasks/query",
    "esri/graphic", 
    "esri/tasks/FeatureSet",
    'jimu/LayerInfos/LayerInfos',
  ], function(
    declare,
    _WidgetBase,
    _TemplatedMixin,
    template,
    Search,
    Deferred,
    OnDemandList, 
    Selection, 
    Memory,
    FeatureLayer,
    on,
    lang,
    utils,
    Query,
    Graphic, 
    FeatureSet,
    LayerInfos
  ){
    return declare([_WidgetBase, _TemplatedMixin], {
      templateString: template,
  
      startup: function() {
        this.inherited(arguments)

        var search = new Search({
  
            enableButtonMode: false, 
    
            showInfoWindowOnSelect: false,
    
            theme: 'arcgisSearch',
    
            sources: []
    
        });
         
        this.searchTwo.appendChild(search.domNode);
  
        var sources = search.get("sources");
  
        sources.push({
      
          featureLayer: new FeatureLayer("https://www.senocwb.com/senoportal/rest/services/Petrobras/Mapa_SEAL_Pocos/FeatureServer/1"),
    
          searchFields: ["instalacao"],
    
          displayField: "instalacao",
    
          exactMatch: false,
    
          outFields: ["*"],
    
          maxResults: 6,
    
          maxSuggestions: 6,
    
          enableSuggestions: true,
    
          minCharacters: 1,
    
        });
  
        sources.push({
      
          featureLayer: new FeatureLayer("https://www.senocwb.com/senoportal/rest/services/Petrobras/Mapa_SEAL_Pocos/FeatureServer/1"),
    
          searchFields: ["sequencial"],
    
          displayField: "sequencial",
    
          exactMatch: false,
    
          outFields: ["*"],
    
          maxResults: 6,
    
          maxSuggestions: 6,
    
          enableSuggestions: true,
    
          minCharacters: 1,
    
        });
  
        search.set("sources", sources);
  
        this.own(on(search,'select-result', lang.hitch(this, function(e) {
          this.createList(e)

        })));
  
      },
      
  
      _getDataStore: function(e) {
        var def = new Deferred();
  

        var query = new Query();
        query.returnGeometry = false;
        query.outFields = ["*"];
        query.where = '1=1';
            

          def.resolve(new Memory({
            data: featureSetRemapped
          })
        );
        return def;
      },
    
    
      createList: function(e) {
        this._getDataStore(e).then(lang.hitch(this, function(datastore) {
          var list = new (declare([OnDemandList, Selection]))({
            'store': datastore,
            'selectionMode': 'single',
            'renderRow': lang.hitch(this, function (object, options) {
              return this._createListItem(object);
            })
          }, this.listNode);
          list.startup();
          
          list.on('.dgrid-row:click', lang.hitch(this, function(evt) {
            var row = list.row(evt);

          }))
        }))
      },
  
      _createListItem: function(featureObj) {
        var listItemRoot = document.createElement('DIV');
        listItemRoot.className = 'list-item';
        if(featureObj) {
              propSeq = document.createElement('div');
              propSeq.className = 'div-item';
              propSeq.innerHTML = featureObj;
              listItemRoot.appendChild(propSeq);
  
        } else {
          listItemRoot.innerHTML = 'NO DATA AVAILABLE';
        }
        return listItemRoot;
      },
  
    })
  })