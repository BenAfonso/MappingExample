
(function() {
   
    // Creating the map
    var map = L.map('map', {
                crs: L.CRS.Simple,
                minZoom: -3,
                drawControl: false
            });
            
       
            var geojson;
            
            // Fetching data
            fetchData();

            
			drawnItems = L.featureGroup().addTo(map);

    
            // Control scale bottomleft
            L.control.scale({imperial: false}).addTo(map);

            // Bounding the map
            var bounds = [[0,0], [10,10]];
            map.fitBounds(bounds);

            // Adding all the drawn features
            var drawnItems = new L.FeatureGroup();
            map.addLayer(drawnItems);
    
            // Adding the edit feature
            var drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: drawnItems
                }
            });
    
            // Adding draw control to the map
            map.addControl(drawControl);
    
    
        // DRAW TRIGGERS
    
        map.on('draw:created', function (e) {
            var type = e.layerType,
                layer = e.layer;

            if (type === 'marker') {
                // Do marker specific actions
            }

            // Do whatever else you need to. (save to db, add to map etc)
            drawnItems.addLayer(layer);
        });
    
    
    
            // Setting the info control
            var info = L.control();
            
            
            info.onAdd = function(map) {
                this._div = L.DomUtil.create('div', 'info');
                this.update();
                return this._div;
            };
            
            // Update info bar
            info.update = function (props) {
                this._div.innerHTML = '<h4>id</h4>' +  (props ?
                    '<b>' + props.id 
                    : 'nothing selected');
            };
            
            // Adding info control to map
            info.addTo(map);
            
            
            // Base style for features
            function style(feature) {
                return {
                    fillColor: 'red',
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            }
    
            // Set a style for a feature
            function highlightFeature(e) {
                var layer = e.target;

                layer.setStyle({
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                });

                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    layer.bringToFront();
                }
                
                info.update(layer.feature);
                
                
            }
            
            // Adding event listener for button
            document.getElementById('fetchData').addEventListener("click", fetchData);
    
            // Reset style on features
            function resetHighlight(e) {
                geojson.resetStyle(e.target);
                
                info.update();
            }
            
            // Function for zooming onto a feature
            function zoomToFeature(e) {
                map.fitBounds(e.target.getBounds());
            }
            
            // Event trigger for map features
            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                });
            }
            

            // Fetch data from distant server
            function fetchData() {
                loadJSON('http://127.0.0.1:3000/api/sieges', function(err,data){
                        geojson = L.geoJSON(JSON.parse(data), {
                                style: style,
                                onEachFeature: onEachFeature
                            }).addTo(map);
                    
                    
                        document.getElementById('dataState').innerHTML = !err ? '<font color="green"> Données récupérées !</font>' : '<font color="red">Récupération des données échouée</font>';  
                  
                });
                    
            }
                        

            // Ajax request for loading JSON
            function loadJSON(file,callback) {   

                var xobj = new XMLHttpRequest();
                    xobj.overrideMimeType("application/json");
                xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
                xobj.onreadystatechange = function () {
                      if (xobj.readyState == 4 && xobj.status == "200") {
                        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                        callback(null,xobj.responseText);
                      }
                };
                xobj.send(null);  
                callback(new Error('failed'),null);
             }
})();      
            

