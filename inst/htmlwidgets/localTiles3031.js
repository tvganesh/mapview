// arbitrary projected local tiles as leaflet map

HTMLWidgets.widget({

  name: 'localTiles3031',

  type: 'output',

  initialize: function(el, width, height) {
  // we need a not htmlwidget div in the widget container
  addElement();
  var ProjCode = "urn:ogc:def:crs:EPSG::3031";
  var Proj4String = "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs";
  // initialize the leaflet map staticly at the "el" object
  // hard-coding center/zoom here for a non-empty initial view, since there
  // is no way for htmlwidgets to pass initial params to initialize()
  // so we set maxbounds to the world and center somewhat at 0 Lat 0 Lon
  var crs = new L.Proj.CRS(ProjCode,Proj4String,{
    resolutions: [8192,4096,2048,1024,512,256],
    origin: [-3199300/(5), 3199300/(5)]
    })

// create map object
    var map = new L.map(el, {
     crs : crs
    });

    // we could add more (static) leaflet stuff here ;-)

    // The map is rendered staticly => so there would be no output binding
    // for the further handling we generate the binding to el this.getId(el)
    if (typeof this.getId === 'undefined') return map;
    map.id = this.getId(el);

    // Store the map on the element so we could find it later by ID
    $(el).data("leaflet-map", map);

    //return the initial mapsetup to the renderValue function
    return map;
  },

  renderValue: function(el, x, map) {
      return this.doRenderValue(el, x, map);
    },

  doRenderValue: function(el, x, map) {

    var baseLayers = {};
    var defaultLayer = L.tileLayer(x.layer[0],
                                  {tileSize: x.tilesize,
                                   noWrap: true,
                                   continuousWorld:true,
                                   minZoom: 0,
                                   maxZoom: x.zoom,
                                   attribution: x.attribution}).addTo(map);



  // GeoJSON SOUTH POLE
   proj4.defs(x.epsgcode,x.epsgproj);
   var geojson = {
                  'type': 'Feature',
                  'geometry': {
                    'type': 'Point',
                    'coordinates': [0, 0],
                    },
                  'properties': {
                    'name': 'south pole'
                    },
                  'crs': {
                    'type': 'name',
                      'properties': {
                          'name': "urn:ogc:def:crs:EPSG::3031"
                       }
                    }
    };

   var pointLayer = L.Proj.geoJson(geojson, {
        'pointToLayer': function(feature, latlng) {
        return L.marker(latlng).bindPopup(feature.properties.name);
    }
    });
   baseLayers[x.layername[0]] = defaultLayer;
   var overlayLayers = {};
   overlayLayers["The Pole"] = pointLayer;
   for (var i = 1; i < x.layer.length;  i++) {
          overlayLayers[x.layername[i] ] = L.tileLayer(x.layer[i],
                                                  {tileSize: x.tilesize,
                                                  subdomains: "abc",
                                                  noWrap: true,
                                                  continuousWorld: true,
                                                  minZoom: 0,
                                                  maxZoom: x.zoom,
                                                  attribution: x.attribution});
       }

   L.control.layers(baseLayers, overlayLayers).addTo(map);
   map.setView([-90.0,0.0], 0);





  lnlt = document.getElementById('lnlt');
  map.on('mousemove', function (e) {
        lnlt.textContent =
                " Latitude: " + (e.latlng.lat).toFixed(5)
                + " | Longitude: " + (e.latlng.lng).toFixed(5)
                + " | Zoom: " + map.getZoom() + " ";
  });


},


resize: function(el, width, height, instance) {
}
});

// we need a new div element because we have to handle
// the mouseover output seperatly
function addElement () {
  // generate new div ElementdefaultLayer
  var newDiv = document.createElement("div");
  // insert to DOM
  document.body.insertBefore(newDiv, null);
      //provide ID and style
      newDiv.id = 'lnlt';
      newDiv.style.cssText = 'position: relative; bottomleft:  0px; background-color: rgba(255, 255, 255, 0.7);box-shadow: 0 0 2px #bbb; background-clip: padding-box; margin:0; color: #333; font: 9px/1.5 "Helvetica Neue", Arial, Helvetica, sans-serif; ></div>;';
}