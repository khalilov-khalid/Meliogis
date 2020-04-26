
var Latitude = 49.465965;
var Longitude = 40.437018;
var zoommap = 7;
var map;



function MapFunction() {
    require([
        "esri/map",
        "esri/geometry/Geometry",
        "esri/tasks/query",
        "esri/dijit/Search",
        "esri/dijit/Scalebar",
        "esri/InfoTemplate",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/dijit/BasemapToggle",
        "esri/layers/ImageParameters",
        "esri/dijit/Measurement",
        "esri/layers/FeatureLayer",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/tasks/IdentifyTask",
        "esri/tasks/IdentifyParameters",
        "esri/dijit/Popup",
        "esri/dijit/PopupTemplate",
        "dojo/_base/array",
        "esri/Color",
        "dojo/dom-construct",
        "dojo/dom",
        "dojo/on",
        "dojo/query",
        "dojo/domReady!"
    ],
        function (Map, Geometry, Query, Search, Scalebar, InfoTemplate, ArcGISDynamicMapServiceLayer, BasemapToggle, ImageParameters, Measurement, FeatureLayer, SimpleFillSymbol,
            SimpleLineSymbol, IdentifyTask, IdentifyParameters, Popup, PopupTemplate, arrayUtils, Color, domConstruct, dom, on, query) {
            var layer, visibleLayerIds = [];

            var identifyTask, identifyParams;

            map = new Map("mapDiv", {
                basemap: "topo",
                sliderOrientation: "vertical",
                sliderPosition: "bottom-left",
                logo: false,
                zoom: zoommap,          // Sets the initial scale to 1:50,000,000
                center: [Latitude, Longitude],  // Sets the center point of view with lon/lat
                showLabels: true,
                infoWindow: popup
            });

            var toggle = new BasemapToggle({
                map: map,
                basemap: "topo"
            }, "topo");

            var toggle1 = new BasemapToggle({
                map: map,
                basemap: "satellite"
            }, "satellite");

            toggle2 = new BasemapToggle({
                map: map,
                basemap: "osm"
            }, "streets");

            toggle.startup();
            toggle1.startup();
            toggle2.startup();

            var popup = new Popup({
                fillSymbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                        new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]))
            }, domConstruct.create("div"));

            var scalebar = new Scalebar({
                map: map,
                // "dual" displays both miles and kilometers
                // "english" is the default, which displays miles
                // use "metric" for kilometers
                scalebarUnit: "metric"
            });

            var measurement = new Measurement({
                map: map
            }, dom.byId("measurementDiv"));

            measurement.startup();

            //Use the ImageParameters to set the visibleLayerIds layers in the map service during ArcGISDynamicMapServiceLayer construction.
            var imageParameters = new ImageParameters();
            imageParameters.layerIds = [22];
            imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
            //can also be: LAYER_OPTION_EXCLUDE, LAYER_OPTION_HIDE, LAYER_OPTION_INCLUDE

            var popupTemplateChannel = new PopupTemplate({
                fieldInfos: [

                    {
                        fieldName: "NAME",
                        visible: true,
                        label: "Adı"
                    },
                    {
                        fieldName: "SOURCE",
                        visible: true,
                        label: "Su mənbəyi"
                    },
                    {
                        fieldName: "ASSIGMENT_NAME",
                        visible: true,
                        label: "Təyinatı"
                    },
                    {
                        fieldName: "FACTICAL_LENGTH",
                        visible: true,
                        label: "Uzunluğu (km)"
                    },
                    {
                        fieldName: "GIS_LENGTH",
                        visible: true,
                        label: "Coğrafi Uzunluğu (km)"
                    },
                    {
                        fieldName: "WATER_CAPABILITY",
                        visible: true,
                        label: "Su buraxma qabiliyyəti (m³/san)"
                    },
                    {
                        fieldName: "SERVED_AREAHA",
                        visible: true,
                        label: "Xidmət etdiyi sahə (ha)"
                    },
                    {
                        fieldName: "DEVICE_SUM",
                        visible: true,
                        label: "Üzərindəki qurğuların sayı (ədəd)"
                    },
                    {
                        fieldName: "EXPLONATION_DATE",
                        visible: true,
                        label: "İstismara verildiyi tarix (il)"
                    },
                    {
                        fieldName: "TECHNICAL_TYPE",
                        visible: true,
                        label: " Texniki vəziyyəti"
                    },
                    {
                        fieldName: "SSI",
                        visible: true,
                        label: "Mülkiyyətçisi"
                    },
                    {
                        fieldName: "PROPERTY_TYPE",
                        visible: true,
                        label: "Mülkiyyət növü"
                    }
                ]
            });

            var popupTemplateDrenaj = new PopupTemplate({
                fieldInfos: [

                    {
                        fieldName: "NAME",
                        visible: true,
                        label: "Adı"
                    },

                    {
                        fieldName: "TYPE",
                        visible: true,
                        label: "Tipi"
                    },
                    {
                        fieldName: "EXPLONATION_DATE",
                        visible: true,
                        label: "İstismara verildiyi tarix (il)"
                    },
                    {
                        fieldName: "REGION",
                        visible: true,
                        label: "Xidmət etdiyi rayon"
                    },
                    {
                        fieldName: "SERVED_AREA",
                        visible: true,
                        label: "Xidmət etdiyi drenləşdirilmiş sahə (ha) "
                    },
                    {
                        fieldName: "FACTICAL_LENGTH",
                        visible: true,
                        label: "Uzunluğu (km)"
                    },
                    {
                        fieldName: "GISLENGTH",
                        visible: true,
                        label: "Coğrafi Uzunluğu (km)"
                    },
                    {
                        fieldName: "ASSIGMENT",
                        visible: true,
                        label: "Təyinatı"
                    },
                    {
                        fieldName: "TECHNICAL_CONDITION",
                        visible: true,
                        label: " Texniki vəziyyəti"
                    },
                    {
                        fieldName: "PROPERTY",
                        visible: true,
                        label: "Mülkiyyətçisi"
                    },
                    {
                        fieldName: "PROPERTY_TYPE",
                        visible: true,
                        label: "Mülkiyyət növü"
                    },
                    {
                        fieldName: "WATER_CONSUPTION",
                        visible: true,
                        label: "Kollektorun normal və maksimum su sərfləri"
                    },
                    {
                        fieldName: "DEVICE_SUM",
                        visible: true,
                        label: "Üzərindəki qurğuların sayı (ədəd)"
                    }
                ],
                showAttachments: true
            });

            var popupTemplateRiverBand = new PopupTemplate({
                fieldInfos: [

                    {
                        fieldName: "NAME",
                        visible: true,
                        label: "Adı"
                    },
                    {
                        fieldName: "EXPLONATION_DATE",
                        visible: true,
                        label: "İstismara verildiyi tarix (il)"
                    },
                    {
                        fieldName: "ASSIGMENT",
                        visible: true,
                        label: "Təyinatı"
                    },
                    {
                        fieldName: "TECHNICAL_TYPE",
                        visible: true,
                        label: " Texniki vəziyyəti"
                    },
                    {
                        fieldName: "LENGTH",
                        visible: true,
                        label: "Bəndin Uzunluğu (km)"
                    },
                    {
                        fieldName: "TYPE",
                        visible: true,
                        label: "Bəndin Növü"
                    },
                    {
                        fieldName: "HEIGHT",
                        visible: true,
                        label: "Hündürlüyü (m)"
                    },
                    {
                        fieldName: "PROPERTY_TYPE",
                        visible: true,
                        label: "Mülkiyyət növü"
                    }
                ],
                showAttachments: true
            });

            var popupTemplateArtesian = new PopupTemplate({
                fieldInfos: [

                    {
                        fieldName: "Adi",
                        visible: true,
                        label: "Yerləşdiyi ərazi"
                    },
                    {
                        fieldName: "REPER_NO",
                        visible: true,
                        label: "Reper nömrəsi"
                    },
                    {
                        fieldName: "WELL_TYPE",
                        visible: true,
                        label: "Tipi"
                    },
                    {
                        fieldName: "EXPLONATION_DATE",
                        visible: true,
                        label: "İstismara verildiyi tarix (il)"
                    },
                    {
                        fieldName: "ASSIGMENT",
                        visible: true,
                        label: "Təyinatı"
                    },
                    {
                        fieldName: "WATER_CAPABILITY",
                        visible: true,
                        label: "Məhsuldarlığı (l/san)"
                    },
                    {
                        fieldName: "IRRIGATED_AREA",
                        visible: true,
                        label: "Suvarılan sahə (ha)"
                    },
                    {
                        fieldName: "SIBS",
                        visible: true,
                        label: "Xidmət etdiyi SİB"
                    },
                    {
                        fieldName: "DEPTH",
                        visible: true,
                        label: "Dərinliyi (m)"
                    },
                    {
                        fieldName: "Pumpstation_Brand",
                        visible: true,
                        label: "Nasosun markası"
                    },
                    {
                        fieldName: "PROPERTY",
                        visible: true,
                        label: "Mülkiyyətçi"
                    },
                    {
                        fieldName: "PROPERTY_TYPE",
                        visible: true,
                        label: "Mülkiyyət növü"
                    }
                ],
                showAttachments: true
            });

            var popupTemplateWell = new PopupTemplate({
                fieldInfos: [

                    {
                        fieldName: "NAME",
                        visible: true,
                        label: "Adı"
                    },
                    {
                        fieldName: "REGION",
                        visible: true,
                        label: "Yerləşdiyi ərazi"
                    },
                    {
                        fieldName: "WELL_TYPE",
                        visible: true,
                        label: "Tipi"
                    },
                    {
                        fieldName: "EXPLONATION_DATE",
                        visible: true,
                        label: "İstismara verildiyi tarix (il)"
                    },
                    {
                        fieldName: "IRRIGATED_AREA",
                        visible: true,
                        label: "Xidmət etdiyi sahə (ha) "
                    },
                    {
                        fieldName: "SIBS",
                        visible: true,
                        label: "SİB-lər"
                    },
                    {
                        fieldName: "TECHNICAL_TYPE",
                        visible: true,
                        label: "Texniki vəziyyəti"
                    },
                    {
                        fieldName: "PROPERTY",
                        visible: true,
                        label: "Mülkiyyətçi"
                    },

                    {
                        fieldName: "DEPTH",
                        visible: true,
                        label: "Dərinliyi (m)"
                    },
                    {
                        fieldName: "PROPERTY_TYPE",
                        visible: true,
                        label: "Mülkiyyət növü"
                    }
                ],
                showAttachments: true
            });

            var popupTemplateDevice = new PopupTemplate({
                fieldInfos: [
                    {
                        fieldName: "DEVICE",
                        visible: true,
                        label: "Adı"
                    },
                    {
                        fieldName: "NAME",
                        visible: true,
                        label: "Yerləşdiyi şəbəkə"
                    },
                    {
                        fieldName: "EXPLONATION_DATE",
                        visible: true,
                        label: "İstismara verildiyi tarix (il)"
                    },
                    {
                        fieldName: "NETWORK_TYPE",
                        visible: true,
                        label: "Tipi"
                    },
                    {
                        fieldName: "TECHNICAL_TYPE",
                        visible: true,
                        label: " Texniki vəziyyəti"
                    },
                    {
                        fieldName: "PROPERTY",
                        visible: true,
                        label: "Mülkiyyətçi"
                    },
                    {
                        fieldName: "PROPERTY_TYPE",
                        visible: true,
                        label: "Mülkiyyət növü"
                    },
                    {
                        fieldName: "WATER_CAPABILITY",
                        visible: true,
                        label: "Su buraxma qabiliyyəti (m³/san)"
                    },
                    {
                        fieldName: "SERVED_AREA",
                        visible: true,
                        label: "Xidmət etdiyi sahə (ha) "
                    }
                ]
            });

            var popupTemplateDepartment = new PopupTemplate({
                fieldInfos: [

                    {
                        fieldName: "NAME",
                        visible: true,
                        label: "Adı"
                    }
                ]
            });

            var popupTemplatePump = new PopupTemplate({
                fieldInfos: [

                    {
                        fieldName: "NAME",
                        visible: true,
                        label: "Adı"
                    },
                    {
                        fieldName: "REGION",
                        visible: true,
                        label: "Yerləşdiyi ərazi"
                    },
                    {
                        fieldName: "PLACED_SOURCE",
                        visible: true,
                        label: "Su mənbəyi"
                    },
                    {
                        fieldName: "EXPLONATION_DATE",
                        visible: true,
                        label: "İstismara verildiyi tarix (il)"
                    },
                    {
                        fieldName: "PURPOSEFUL",
                        visible: true,
                        label: "Nasos stansiyasının məqsədi"
                    },
                    {
                        fieldName: "TYPE",
                        visible: true,
                        label: "Nasos stansiyasının tipi"
                    },
                    {
                        fieldName: "KIND",
                        visible: true,
                        label: "Nasos stansiyasının növü"
                    },
                    {
                        fieldName: "AGREGAT_SUM",
                        visible: true,
                        label: "Aqreqatların sayı (ədəd)"
                    },
                    {
                        fieldName: "BRAND_OFF_AGGREGATE",
                        visible: true,
                        label: "Aqreqatların markası"
                    },
                    {
                        fieldName: "ENGINE_KIND",
                        visible: true,
                        label: "Mühərrikin növü"
                    },
                    {
                        fieldName: "ENGINE_BRAND",
                        visible: true,
                        label: "Mühərrikin markası"
                    },
                    {
                        fieldName: "POWER",
                        visible: true,
                        label: "Ümumi Gücü (kvt)"
                    },
                    {
                        fieldName: "PRODUCTIVITY",
                        visible: true,
                        label: "Məhsuldarlığı (m³/san)"
                    },
                    {
                        fieldName: "SERVED_AREA",
                        visible: true,
                        label: "Nasos/S xidməti sahəsi (ha)"
                    },
                    {
                        fieldName: "PIPELINE_LENGHT",
                        visible: true,
                        label: "Basqılı boru uzunluğu (m)"
                    },
                    {
                        fieldName: "PIPELINE_DIAMETER_ID",
                        visible: true,
                        label: "Basqılı boru diametri (mm)"
                    },
                    {
                        fieldName: "PIPELINE_MATERIAL",
                        visible: true,
                        label: "Basqılı boru materialı",
                    },
                    {
                        fieldName: "ENGINE_INSTALL_DATE",
                        visible: true,
                        label: "Mühərrikin son təmir ili"
                    },
                    {
                        fieldName: "PROPERTY",
                        visible: true,
                        label: "Mülkiyyətçi"
                    },
                    {
                        fieldName: "PROPERTY_TYPE",
                        visible: true,
                        label: "Mülkiyyət növü"
                    }

                ],
                showAttachments: true
            });

            var popupTemplateBuilding = new PopupTemplate({
                fieldInfos: [

                    {
                        fieldName: "NAME",
                        visible: true,
                        label: "Adı"
                    },
                    {
                        fieldName: "EXPLONATIO",
                        visible: true,
                        label: "İstismara verildiyi tarix (il)"
                    },
                    {
                        fieldName: "REGION",
                        visible: true,
                        label: "Yerləşdiyi ərazi"
                    },
                    {
                        fieldName: "ASSIGMENT",
                        visible: true,
                        label: "Təyinatı"
                    },
                    {
                        fieldName: "PROPERTY",
                        visible: true,
                        label: "Mülkiyyətçi"
                    },
                    {
                        fieldName: "PROPERTY_TYPE",
                        visible: true,
                        label: "Mülkiyyət növü"
                    },
                    {
                        fieldName: "TOTAL_AREA",
                        visible: true,
                        label: "Ümumi sahə (ha) "
                    },
                    {
                        fieldName: "SERVICE_AR",
                        visible: true,
                        label: "Tikili altı sahə (ha) "
                    }
                ]
            });

            var popupTemplateRoad = new PopupTemplate({
                fieldInfos: [

                    {
                        fieldName: "NAME",
                        visible: true,
                        label: "Adı"
                    },
                    {
                        fieldName: "COVER_TYPES",
                        visible: true,
                        label: "Tipi"
                    },
                    {
                        fieldName: "LENGHT",
                        visible: true,
                        label: "Uzunluğu (km)"
                    }
                ]
            });

            var popupTemplatePastures = new PopupTemplate({
                fieldInfos: [

                    {
                        fieldName: "NAME",
                        visible: true,
                        label: "Adı"
                    },
                    {
                        fieldName: "CHANNEL",
                        visible: true,
                        label: "Su mənbəyi"
                    },
                    {
                        fieldName: "FACTICAL_LENGTH",
                        visible: true,
                        label: "Uzunluğu (km)"
                    },
                    {
                        fieldName: "GIS_LENGTH",
                        visible: true,
                        label: "Coğrafi Uzunluğu (km)"
                    },
                    {
                        fieldName: "WATER_CAPABILITY",
                        visible: true,
                        label: "Su buraxma qabiliyyəti (m³/san)"
                    },
                    {
                        fieldName: "PIPE_DIAMETER",
                        visible: true,
                        label: "Borunun diametri (mm)"
                    },
                    {
                        fieldName: "PIPE_MATERIAL",
                        visible: true,
                        label: "Borunun materialı",
                    },
                    {
                        fieldName: "SERVED_AREA",
                        visible: true,
                        label: "Xidmət etdiyi sahə (ha)"
                    },
                    {
                        fieldName: "DEVICE_SUM",
                        visible: true,
                        label: "Üzərindəki qurğuların sayı (ədəd)"
                    },
                    {
                        fieldName: "WATER_PIPE",
                        visible: true,
                        label: "İstismara verildiyi tarix (il)"
                    },
                    {
                        fieldName: "PROPERTY",
                        visible: true,
                        label: "Mülkiyyətçisi"
                    },
                    {
                        fieldName: "SIBS",
                        visible: true,
                        label: "Xidmət etdiyi SİB-lərin adı"
                    },
                    {
                        fieldName: "PROPERTY_TYPE",
                        visible: true,
                        label: "Mülkiyyət növü"
                    }
                ]
            });

            var popupTemplateReservior = new PopupTemplate({
                fieldInfos: [

                    {
                        fieldName: "NAME",
                        visible: true,
                        label: "Adı"
                    },
                    {
                        fieldName: "COVER_TYPES",
                        visible: true,
                        label: "Ümumi sahəsi (m²)"
                    },
                    {
                        fieldName: "EXPLONATION",
                        visible: true,
                        label: "İstismar tarixi"
                    },
                    {
                        fieldName: "SOURCE",
                        visible: true,
                        label: "Mənbəyi"
                    }
                ]
            });

            layerRegion = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/11",
                {
                    "imageParameters": imageParameters,
                    mode: FeatureLayer.MODE_ONDEMAND,
                    visible: true
                });

            layerVillage = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/10",
                {
                    "imageParameters": imageParameters,
                    mode: FeatureLayer.MODE_ONDEMAND,
                    visible: false
                });

            layerChannel = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/4",
                {
                    "imageParameters": imageParameters,
                    infoTemplate: popupTemplateChannel,
                    mode: FeatureLayer.MODE_ONDEMAND,
                    outFields: ["*"],
                    visible: false
                });

            layerDrenaj = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/5",
                {
                    "imageParameters": imageParameters,

                    infoTemplate: popupTemplateDrenaj,
                    outFields: ["*"],
                    visible: false
                });

            layerRiverBand = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/7",
                {
                    "imageParameters": imageParameters,

                    infoTemplate: popupTemplateRiverBand,
                    outFields: ["*"],
                    visible: false
                });

            layerArtesian = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/0",
                {
                    "imageParameters": imageParameters,

                    infoTemplate: popupTemplateArtesian,
                    outFields: ["*"],
                    visible: false
                });

            layerWell = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/3",
                {
                    "imageParameters": imageParameters,

                    infoTemplate: popupTemplateWell,
                    outFields: ["*"],
                    visible: false
                });

            layerDevice = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/1",
                {
                    "imageParameters": imageParameters,

                    infoTemplate: popupTemplateDevice,
                    outFields: ["*"],
                    visible: false
                });

            layerPump = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/2",
                {
                    "imageParameters": imageParameters,

                    infoTemplate: popupTemplatePump,
                    outFields: ["*"],
                    visible: false
                });

            layerBuilding = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/9",
                {
                    "imageParameters": imageParameters,

                    infoTemplate: popupTemplateBuilding,
                    outFields: ["*"],
                    visible: false
                });

            layerRoad = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/6",
                {
                    "imageParameters": imageParameters,

                    infoTemplate: popupTemplateRoad,
                    outFields: ["*"],
                    visible: false
                });

            layerRivers = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/12",
                {
                    "imageParameters": imageParameters,

                    //infoTemplate: popupTemplateR,
                    outFields: ["*"],
                    visible: false
                });

            layerReservior = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/13",
                {
                    "imageParameters": imageParameters,

                    infoTemplate: popupTemplateReservior,
                    outFields: ["*"],
                    visible: false
                });

            layerPastures = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0610/MapServer/8",
                {
                    "imageParameters": imageParameters,

                    infoTemplate: popupTemplatePastures,
                    outFields: ["*"],
                    visible: false
                });


            map.addLayer(layerRegion);

            $("#_testSearch").on("click", function () {

                var value = $("#search-input").val();
                var query = "NAME = N'" + value + "'";
                var tname = $("#search-input").attr("data-tname")

                layerChannel.visible = false;
                layerDrenaj.visible = false;
                layerDevice.visible = false;
                layerArtesian.visible = false;
                layerWell.visible = false;
                layerPump.visible = false;
                layerPastures.visible = false;
                layerRiverBand.visible = false;
                layerBuilding.visible = false;
                layerRoad.visible = false;
                layerReservior.visible = false;
                layerRivers.visible = false;

                var queryTask = new esri.tasks.Query();
                queryTask.where = "1=1";
                queryTask.outSpatialReference = map.spatialReference;



                if (tname == "KANAL") {
                    layerChannel.visible = true;
                    layerChannel.setDefinitionExpression(query);
                    layerChannel.queryFeatures(queryTask, function (featureSet) {
                        var data = [];
                        if (featureSet && featureSet.features && featureSet.features.length > 0) {
                            data = featureSet.features;
                        }
                        var zoomExtent = esri.graphicsExtent(data);
                        map.setExtent(zoomExtent);
                    });
                    map.addLayer(layerChannel);
                }
                if (tname == "DRENAJ") {
                    //console.log("drenaj");
                    layerDrenaj.visible = true;
                    layerDrenaj.setDefinitionExpression(query);
                    layerDrenaj.queryFeatures(queryTask, function (featureSet) {
                        var data = [];
                        if (featureSet && featureSet.features && featureSet.features.length > 0) {
                            data = featureSet.features;
                        }
                        var zoomExtent = esri.graphicsExtent(data);
                        map.setExtent(zoomExtent);
                    });
                    map.addLayer(layerDrenaj);
                }
                if (tname == "DEVICE") {
                    layerDevice.visible = true;
                    layerDevice.setDefinitionExpression(query);
                    layerDevice.queryFeatures(queryTask, function (featureSet) {
                        var data = [];
                        if (featureSet && featureSet.features && featureSet.features.length > 0) {
                            data = featureSet.features;
                        }
                        var zoomExtent = esri.graphicsExtent(data);
                        map.setExtent(zoomExtent);
                    });
                    map.addLayer(layerDevice);
                }
                if (tname == "ARTEZIAN") {
                    query = "REPER_NO = N'" + value + "'";
                    layerArtesian.visible = true;
                    layerArtesian.setDefinitionExpression(query);
                    layerArtesian.queryFeatures(queryTask, function (featureSet) {
                        var data = [];
                        if (featureSet && featureSet.features && featureSet.features.length > 0) {
                            data = featureSet.features;
                        }
                        var zoomExtent = esri.graphicsExtent(data);
                        map.setExtent(zoomExtent);
                    });
                    map.addLayer(layerArtesian);
                }
                if (tname == "WELL") {
                    layerWell.visible = true;
                    layerWell.setDefinitionExpression(query);
                    layerWell.queryFeatures(queryTask, function (featureSet) {
                        var data = [];
                        if (featureSet && featureSet.features && featureSet.features.length > 0) {
                            data = featureSet.features;
                        }
                        var zoomExtent = esri.graphicsExtent(data);
                        map.setExtent(zoomExtent);
                    });
                    map.addLayer(layerWell);
                }
                if (tname == "PUMSTATION") {
                    ////console.log("test")

                    layerPump.visible = true;
                    layerPump.setDefinitionExpression(query);
                    layerPump.queryFeatures(queryTask, function (featureSet) {
                        var data = [];
                        if (featureSet && featureSet.features && featureSet.features.length > 0) {
                            data = featureSet.features;
                        }
                        var zoomExtent = esri.graphicsExtent(data);
                        map.setExtent(zoomExtent);
                    });
                    map.addLayer(layerPump);
                }
                if (tname == "WINTERPASTURES") {
                    layerPastures.visible = true;
                    layerPastures.setDefinitionExpression(query);
                    layerPastures.queryFeatures(queryTask, function (featureSet) {
                        var data = [];
                        if (featureSet && featureSet.features && featureSet.features.length > 0) {
                            data = featureSet.features;
                        }
                        var zoomExtent = esri.graphicsExtent(data);
                        map.setExtent(zoomExtent);
                    });
                    map.addLayer(layerPastures);
                }
                if (tname == "RIVERBAND") {
                    layerRiverBand.visible = true;
                    layerRiverBand.setDefinitionExpression(query);
                    layerRiverBand.queryFeatures(queryTask, function (featureSet) {
                        var data = [];
                        if (featureSet && featureSet.features && featureSet.features.length > 0) {
                            data = featureSet.features;
                        }
                        var zoomExtent = esri.graphicsExtent(data);
                        map.setExtent(zoomExtent);
                    });
                    map.addLayer(layerRiverBand);
                }
                if (tname == "BUILDINGS") {
                    layerBuilding.visible = true;
                    layerBuilding.setDefinitionExpression(query);
                    layerBuilding.queryFeatures(queryTask, function (featureSet) {
                        var data = [];
                        if (featureSet && featureSet.features && featureSet.features.length > 0) {
                            data = featureSet.features;
                        }
                        var zoomExtent = esri.graphicsExtent(data);
                        map.setExtent(zoomExtent);
                    });
                    map.addLayer(layerBuilding);
                }
                if (tname == "EXPLOITATION_ROAD") {
                    layerRoad.visible = true;
                    layerRoad.setDefinitionExpression(query);
                    layerRoad.queryFeatures(queryTask, function (featureSet) {
                        var data = [];
                        if (featureSet && featureSet.features && featureSet.features.length > 0) {
                            data = featureSet.features;
                        }
                        var zoomExtent = esri.graphicsExtent(data);
                        map.setExtent(zoomExtent);
                    });
                    map.addLayer(layerRoad);
                }
                if (tname == "RIVERS") {
                    layerRivers.visible = true;
                    layerRivers.setDefinitionExpression(query);
                    layerRivers.queryFeatures(queryTask, function (featureSet) {
                        var data = [];
                        if (featureSet && featureSet.features && featureSet.features.length > 0) {
                            data = featureSet.features;
                        }
                        var zoomExtent = esri.graphicsExtent(data);
                        map.setExtent(zoomExtent);
                    });
                    map.addLayer(layerRivers);
                }


            });


            //xerite goster
            $("#_ShowInMap").on("click", function () {
                Filter("map")
            })
            //db gore sorugu
            $("#_GetFilTER").on("click", function () {
                Filter("filter")
            })

            function Filter(keyword) {
                map.removeLayer(layerChannel);
                map.removeLayer(layerDrenaj);
                map.removeLayer(layerDevice);
                map.removeLayer(layerArtesian);
                map.removeLayer(layerWell);
                map.removeLayer(layerPump);
                map.removeLayer(layerPastures);
                map.removeLayer(layerRiverBand);
                map.removeLayer(layerBuilding);
                map.removeLayer(layerRoad);


                var regionlist = "";
                var allRegionsInput = $("._regions");
                for (var i = 0; i < allRegionsInput.length; i++) {
                    if ($(allRegionsInput[i]).is(":checked")) {
                        regionlist += allRegionsInput[i].id + ","
                    }
                }
                villiageList = "";
                var allvilliagesInput = $("._villiages");
                for (var i = 0; i < allvilliagesInput.length; i++) {
                    if ($(allvilliagesInput[i]).is(":checked")) {
                        villiageList += allvilliagesInput[i].id + ","
                    }
                }
                if (regionlist.length != 0) {
                    regionlist = regionlist.substring(0, regionlist.length - 1);
                }
                if (villiageList.length != 0) {
                    villiageList = villiageList.substring(0, regionlist.length - 1);
                }

                var regionalquery = " 1 = 1";
                if (villiageList.length != 0) {
                    regionalquery += " and VILLAGE_ID in (" + villiageList + ") ";
                }
                if (villiageList.length == 0 && regionlist.length != 0) {
                    regionalquery += " and REGIONS_ID in (" + regionlist + ") ";
                }

                //idareler ve sibler
                var SSIList = "";
                var AllSSIinput = $("._property");
                for (var i = 0; i < AllSSIinput.length; i++) {
                    if ($(AllSSIinput[i]).is(":checked")) {
                        SSIList += AllSSIinput[i].getAttribute("data-id") + ","
                    }
                }
                var SibsList = "";
                var allSibsInput = $("._villiages");
                for (var i = 0; i < allSibsInput.length; i++) {
                    if ($(allSibsInput[i]).is(":checked")) {
                        SibsList += allSibsInput[i].getAttribute("data-id") + ","
                    }
                }
                if (SSIList.length != 0) {
                    SSIList = SSIList.substring(0, SSIList.length - 1);
                }
                if (SibsList.length != 0) {
                    SibsList = SibsList.substring(0, SibsList.length - 1);
                }

                var SSIandSibsquery = " 1 = 1";
                if (SibsList.length != 0) {
                    regionalquery += " and SIBS_ID in (" + SibsList + ") ";
                }
                if (SibsList.length == 0 && SSIList.length != 0) {
                    regionalquery += " and SSI_ID in (" + SSIList + ") ";
                }


                function checkboxlist(_list) {
                    var stringlist = "";                    
                    for (var i = 0; i < _list.length; i++) {
                        if ($(_list[i]).is(":checked")) {
                            stringlist += _list[i].getAttribute("data-id") + ","
                        }
                    }
                    if (stringlist.length != 0) {
                        stringlist = stringlist.substring(0, stringlist.length - 1);
                    }
                    return stringlist;
                }

                // magistral kanallar

                var magistralChannel = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("select[name*='CHANNEL_M_SOBJECTID']").val() == null) ? "" : magistralChannel += " and OBJECTID=" + $("select[name*='CHANNEL_M_SOBJECTID']").val();
                ($("input[name*='CHANNEL_M_EXPLONATION_DATE_MIN']").val() == "") ? "" : magistralChannel += " and EXPLONATION_DATE >= " + $("input[name*='CHANNEL_M_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='CHANNEL_M_EXPLONATION_DATE_MAX']").val() == "") ? "" : magistralChannel += " and EXPLONATION_DATE <= " + $("input[name*='CHANNEL_M_EXPLONATION_DATE_MAX']").val();
                ($("select[name*='CHANNEL_M_SERVED_REGION_ID']").val() == null) ? "" : magistralChannel += " and SERVED_REGION_ID = " + $("select[name*='CHANNEL_M_SERVED_REGION_ID']").val();
                ($("input[name*='CHANNEL_M_SERVED_AREA_MIN']").val() == "") ? "" : magistralChannel += " and SERVED_AREAHA >= " + $("input[name*='CHANNEL_M_SERVED_AREA_MIN']").val();
                ($("input[name*='CHANNEL_M_SERVED_AREA_MAX']").val() == "") ? "" : magistralChannel += " and SERVED_AREAHA <= " + $("input[name*='CHANNEL_M_SERVED_AREA_MAX']").val();
                ($("input[name*='CHANNEL_M_FACTICAL_LENGTH_MIN']").val() == "") ? "" : magistralChannel += " and FACTICAL_LENGTH >= " + $("input[name*='CHANNEL_M_FACTICAL_LENGTH_MIN']").val();
                ($("input[name*='CHANNEL_M_FACTICAL_LENGTH_MAX']").val() == "") ? "" : magistralChannel += " and FACTICAL_LENGTH <= " + $("input[name*='CHANNEL_M_FACTICAL_LENGTH_MAX']").val();                

                var allCHMCoverInput = $(".CHMCover");
                var chmCover = checkboxlist(allCHMCoverInput);
                (chmCover.length == 0 || chmCover[0] == "0") ? "" : magistralChannel += " and COVER_TYPE_ID in (" + chmCover + ") ";


                ($("input[name*='CHANNEL_M_WATER_CAPABILITY_MIN']").val() == "") ? "" : magistralChannel += " and WATER_CAPABILITY >= " + $("input[name*='CHANNEL_M_WATER_CAPABILITY_MIN']").val();
                ($("input[name*='CHANNEL_M_WATER_CAPABILITY_MAX']").val() == "") ? "" : magistralChannel += " and WATER_CAPABILITY <= " + $("input[name*='CHANNEL_M_WATER_CAPABILITY_MAX']").val();
                ($("input[name*='CHANNEL_M_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : magistralChannel += " and WATERPROOF_WIDTH >= " + $("input[name*='CHANNEL_M_WATERPROOF_WIDTH_MIN']").val();
                ($("input[name*='CHANNEL_M_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : magistralChannel += " and WATERPROOF_WIDTH <= " + $("input[name*='CHANNEL_M_WATERPROOF_WIDTH_MAX']").val();


                var allCHMTecInput = $(".CHMCover");
                var chmtec = checkboxlist(allCHMTecInput);
                (chmtec.length == 0 || chmtec[0] == "0") ? "" : magistralChannel += " and TECHNICAL_ID in (" + chmtec + ") ";

                var allCHMSSIInput = $(".CHMproperty");
                var chmssi = checkboxlist(allCHMSSIInput);
                (chmssi.length == 0 || chmssi[0] == "0") ? "" : magistralChannel += " and SSI_ID in (" + chmssi + ") ";
                
                var allCHMProTypeInput = $(".CHMprotype");
                var chmproType = checkboxlist(allCHMProTypeInput);
                (chmproType.length == 0 || chmproType[0] == "0") ? "" : magistralChannel += " and PROPERTY_TYPE_ID in (" + chmproType + ") ";

                var allCHMActivityInput = $(".CHMactivity");
                var chmActivity = checkboxlist(allCHMActivityInput);
                (chmActivity.length == 0 || chmActivity[0] == "0") ? "" : magistralChannel += " and ACTIVITY_ID in (" + chmActivity + ") ";

                ($("input[name*='CHANNEL_M_DEVICE_SUM']").val() == "") ? "" : magistralChannel += " and DEVICE_SUM = " + $("input[name*='CHANNEL_M_DEVICE_SUM']").val();

                //console.log(magistralChannel)


                // 1 dereceli kanallar

                var ICHANNEL = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("select[name*='CHANNEL_I_SOBJECTID']").val() == null) ? "" : ICHANNEL += " and OBJECTID=" + $("select[name*='CHANNEL_I_SOBJECTID']").val();
                ($("input[name*='CHANNEL_I_EXPLONATION_DATE_MIN']").val() == "") ? "" : ICHANNEL += " and EXPLONATION_DATE >=" + $("input[name*='CHANNEL_I_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='CHANNEL_I_EXPLONATION_DATE_MAX']").val() == "") ? "" : ICHANNEL += " and EXPLONATION_DATE <=" + $("input[name*='CHANNEL_I_EXPLONATION_DATE_MAX']").val();
                ($("select[name*='CHANNEL_I_SERVED_REGION_ID']").val() == null) ? "" : ICHANNEL += " and SERVED_REGION_ID=" + $("select[name*='CHANNEL_I_SERVED_REGION_ID']").val();
                ($("input[name*='CHANNEL_I_SERVED_AREA_MIN']").val() == "") ? "" : ICHANNEL += " and SERVED_AREAHA >=" + $("input[name*='CHANNEL_I_SERVED_AREA_MIN']").val();
                ($("input[name*='CHANNEL_I_SERVED_AREA_MAX']").val() == "") ? "" : ICHANNEL += " and SERVED_AREAHA <=" + $("input[name*='CHANNEL_I_SERVED_AREA_MAX']").val();
                ($("input[name*='CHANNEL_I_FACTICAL_LENGTH_MIN']").val() == "") ? "" : ICHANNEL += " and FACTICAL_LENGTH >=" + $("input[name*='CHANNEL_I_FACTICAL_LENGTH_MIN']").val();
                ($("input[name*='CHANNEL_I_FACTICAL_LENGTH_MAX']").val() == "") ? "" : ICHANNEL += " and FACTICAL_LENGTH <=" + $("input[name*='CHANNEL_I_FACTICAL_LENGTH_MAX']").val();

                var allCHICoverInput = $(".CHICover");
                var chiCover = checkboxlist(allCHICoverInput);
                (chiCover.length == 0 || chiCover[0] == "0") ? "" : ICHANNEL += " and COVER_TYPE_ID in (" + chiCover + ") ";

                ($("input[name*='CHANNEL_I_WATER_CAPABILITY_MIN']").val() == "") ? "" : ICHANNEL += " and WATER_CAPABILITY >=" + $("input[name*='CHANNEL_I_WATER_CAPABILITY_MIN']").val();
                ($("input[name*='CHANNEL_I_WATER_CAPABILITY_MAX']").val() == "") ? "" : ICHANNEL += " and WATER_CAPABILITY <=" + $("input[name*='CHANNEL_I_WATER_CAPABILITY_MAX']").val();
                ($("input[name*='CHANNEL_I_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : ICHANNEL += " and WATERPROOF_WIDTH >=" + $("input[name*='CHANNEL_I_WATERPROOF_WIDTH_MIN']").val();
                ($("input[name*='CHANNEL_I_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : ICHANNEL += " and WATERPROOF_WIDTH <=" + $("input[name*='CHANNEL_I_WATERPROOF_WIDTH_MAX']").val();

                var allCHITecInput = $(".CHITec");
                var chitec = checkboxlist(allCHITecInput);
                (chitec.length == 0 || chitec[0] == "0") ? "" : ICHANNEL += " and TECHNICAL_ID in (" + chitec + ") ";

                var allCHISSIInput = $(".CHIproperty");
                var chissi = checkboxlist(allCHISSIInput);
                (chissi.length == 0 || chissi[0] == "0") ? "" : ICHANNEL += " and SSI_ID in (" + chissi + ") ";

                var allCHIProTypeInput = $(".CHIprotype");
                var chiproType = checkboxlist(allCHIProTypeInput);
                (chiproType.length == 0 || chiproType[0] == "0") ? "" : ICHANNEL += " and PROPERTY_TYPE_ID in (" + chiproType + ") ";

                var allCHIActivityInput = $(".CHIactivity");
                var chiActivity = checkboxlist(allCHIActivityInput);
                (chiActivity.length == 0 || chiActivity[0] == "0") ? "" : ICHANNEL += " and ACTIVITY_ID in (" + chiActivity + ") ";

                ($("input[name*='CHANNEL_I_DEVICE_SUM']").val() == "") ? "" : ICHANNEL += " and DEVICE_SUM=" + $("input[name*='CHANNEL_I_DEVICE_SUM']").val();

                // 2 dereceli kanallar

                var IICHANNEL = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("select[name*='CHANNEL_II_SOBJECTID']").val() == null) ? "" : IICHANNEL += " and OBJECTID=" + $("select[name*='CHANNEL_II_SOBJECTID']").val();
                ($("input[name*='CHANNEL_II_EXPLONATION_DATE_MIN']").val() == "") ? "" : IICHANNEL += " and EXPLONATION_DATE >=" + $("input[name*='CHANNEL_II_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='CHANNEL_II_EXPLONATION_DATE_MAX']").val() == "") ? "" : IICHANNEL += " and EXPLONATION_DATE <=" + $("input[name*='CHANNEL_II_EXPLONATION_DATE_MAX']").val();
                ($("select[name*='CHANNEL_II_SERVED_REGION_ID']").val() == null) ? "" : IICHANNEL += " and SERVED_REGION_ID=" + $("select[name*='CHANNEL_II_SERVED_REGION_ID']").val();
                ($("input[name*='CHANNEL_II_SERVED_AREA_MIN']").val() == "") ? "" : IICHANNEL += " and SERVED_AREAHA >=" + $("input[name*='CHANNEL_II_SERVED_AREA_MIN']").val();
                ($("input[name*='CHANNEL_II_SERVED_AREA_MAX']").val() == "") ? "" : IICHANNEL += " and SERVED_AREAHA <=" + $("input[name*='CHANNEL_II_SERVED_AREA_MAX']").val();
                ($("input[name*='CHANNEL_II_FACTICAL_LENGTH_MIN']").val() == "") ? "" : IICHANNEL += " and FACTICAL_LENGTH >=" + $("input[name*='CHANNEL_II_FACTICAL_LENGTH_MIN']").val();
                ($("input[name*='CHANNEL_II_FACTICAL_LENGTH_MAX']").val() == "") ? "" : IICHANNEL += " and FACTICAL_LENGTH <=" + $("input[name*='CHANNEL_II_FACTICAL_LENGTH_MAX']").val();

                var allCHIICoverInput = $(".CHIICover");
                var chiiCover = checkboxlist(allCHIICoverInput);
                (chiiCover.length == 0 || chiiCover[0] == "0") ? "" : IICHANNEL += " and COVER_TYPE_ID in (" + chiiCover + ") ";

                ($("input[name*='CHANNEL_II_WATER_CAPABILITY_MIN']").val() == "") ? "" : IICHANNEL += " and WATER_CAPABILITY >=" + $("input[name*='CHANNEL_II_WATER_CAPABILITY_MIN']").val();
                ($("input[name*='CHANNEL_II_WATER_CAPABILITY_MAX']").val() == "") ? "" : IICHANNEL += " and WATER_CAPABILITY <=" + $("input[name*='CHANNEL_II_WATER_CAPABILITY_MAX']").val();
                ($("input[name*='CHANNEL_II_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : IICHANNEL += " and WATERPROOF_WIDTH >=" + $("input[name*='CHANNEL_II_WATERPROOF_WIDTH_MIN']").val();
                ($("input[name*='CHANNEL_II_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : IICHANNEL += " and WATERPROOF_WIDTH <=" + $("input[name*='CHANNEL_II_WATERPROOF_WIDTH_MAX']").val();

                var allCHIITecInput = $(".CHIITec");
                var chiitec = checkboxlist(allCHIITecInput);
                (chiitec.length == 0 || chiitec[0] == "0") ? "" : IICHANNEL += " and TECHNICAL_ID in (" + chiitec + ") ";

                var allCHIISSIInput = $(".CHIIproperty");
                var chiissi = checkboxlist(allCHIISSIInput);
                (chiissi.length == 0 || chiissi[0] == "0") ? "" : IICHANNEL += " and SSI_ID in (" + chiissi + ") ";

                var allCHIIProTypeInput = $(".CHIIprotype");
                var chiiproType = checkboxlist(allCHIIProTypeInput);
                (chiiproType.length == 0 || chiiproType[0] == "0") ? "" : IICHANNEL += " and PROPERTY_TYPE_ID in (" + chiiproType + ") ";

                var allCHIIActivityInput = $(".CHIIactivity");
                var chiiActivity = checkboxlist(allCHIIActivityInput);
                (chiiActivity.length == 0 || chiiActivity[0] == "0") ? "" : IICHANNEL += " and ACTIVITY_ID in (" + chiiActivity + ") ";

                ($("input[name*='CHANNEL_II_DEVICE_SUM']").val() == "") ? "" : IICHANNEL += " and DEVICE_SUM=" + $("input[name*='CHANNEL_II_DEVICE_SUM']").val();


                // 3 dereceli kanallar
                var IIICHANNEL = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("select[name*='CHANNEL_III_SOBJECTID']").val() == null) ? "" : IIICHANNEL += " and OBJECTID=" + $("select[name*='CHANNEL_III_SOBJECTID']").val();
                ($("input[name*='CHANNEL_III_EXPLONATION_DATE_MIN']").val() == "") ? "" : IIICHANNEL += " and EXPLONATION_DATE >=" + $("input[name*='CHANNEL_III_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='CHANNEL_III_EXPLONATION_DATE_MAX']").val() == "") ? "" : IIICHANNEL += " and EXPLONATION_DATE <=" + $("input[name*='CHANNEL_III_EXPLONATION_DATE_MAX']").val();
                ($("select[name*='CHANNEL_III_SERVED_REGION_ID']").val() == null) ? "" : IIICHANNEL += " and SERVED_REGION_ID=" + $("select[name*='CHANNEL_III_SERVED_REGION_ID']").val();
                ($("input[name*='CHANNEL_III_SERVED_AREA_MIN']").val() == "") ? "" : IIICHANNEL += " and SERVED_AREAHA >=" + $("input[name*='CHANNEL_III_SERVED_AREA_MIN']").val();
                ($("input[name*='CHANNEL_III_SERVED_AREA_MAX']").val() == "") ? "" : IIICHANNEL += " and SERVED_AREAHA <=" + $("input[name*='CHANNEL_III_SERVED_AREA_MAX']").val();
                ($("input[name*='CHANNEL_III_FACTICAL_LENGTH_MIN']").val() == "") ? "" : IIICHANNEL += " and FACTICAL_LENGTH >=" + $("input[name*='CHANNEL_III_FACTICAL_LENGTH_MIN']").val();
                ($("input[name*='CHANNEL_III_FACTICAL_LENGTH_MAX']").val() == "") ? "" : IIICHANNEL += " and FACTICAL_LENGTH <=" + $("input[name*='CHANNEL_III_FACTICAL_LENGTH_MAX']").val();

                var allCHIIICoverInput = $(".CHIIICover");
                var chiiiCover = checkboxlist(allCHIIICoverInput);
                (chiiiCover.length == 0 || chiiiCover[0] == "0") ? "" : IIICHANNEL += " and COVER_TYPE_ID in (" + chiiiCover + ") ";

                ($("input[name*='CHANNEL_III_WATER_CAPABILITY_MIN']").val() == "") ? "" : IIICHANNEL += " and WATER_CAPABILITY >=" + $("input[name*='CHANNEL_III_WATER_CAPABILITY_MIN']").val();
                ($("input[name*='CHANNEL_III_WATER_CAPABILITY_MAX']").val() == "") ? "" : IIICHANNEL += " and WATER_CAPABILITY <=" + $("input[name*='CHANNEL_III_WATER_CAPABILITY_MAX']").val();
                ($("input[name*='CHANNEL_III_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : IIICHANNEL += " and WATERPROOF_WIDTH >=" + $("input[name*='CHANNEL_III_WATERPROOF_WIDTH_MIN']").val();
                ($("input[name*='CHANNEL_III_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : IIICHANNEL += " and WATERPROOF_WIDTH <=" + $("input[name*='CHANNEL_III_WATERPROOF_WIDTH_MAX']").val();

                var allCHIIITecInput = $(".CHIIITec");
                var chiiitec = checkboxlist(allCHIIITecInput);
                (chiiitec.length == 0 || chiiitec[0] == "0") ? "" : IIICHANNEL += " and TECHNICAL_ID in (" + chiiitec + ") ";

                var allCHIIISSIInput = $(".CHIIIproperty");
                var chiiissi = checkboxlist(allCHIIISSIInput);
                (chiiissi.length == 0 || chiiissi[0] == "0") ? "" : IIICHANNEL += " and SSI_ID in (" + chiiissi + ") ";

                var allCHIIIProTypeInput = $(".CHIIIprotype");
                var chiiiproType = checkboxlist(allCHIIIProTypeInput);
                (chiiiproType.length == 0 || chiiiproType[0] == "0") ? "" : IIICHANNEL += " and PROPERTY_TYPE_ID in (" + chiiiproType + ") ";

                var allCHIIIActivityInput = $(".CHIIIactivity");
                var chiiiActivity = checkboxlist(allCHIIIActivityInput);
                (chiiiActivity.length == 0 || chiiiActivity[0] == "0") ? "" : IIICHANNEL += " and ACTIVITY_ID in (" + chiiiActivity + ") ";

                ($("input[name*='CHANNEL_III_DEVICE_SUM']").val() == "") ? "" : IIICHANNEL += " and DEVICE_SUM=" + $("input[name*='CHANNEL_III_DEVICE_SUM']").val();

                // qapali magistral kanal
                var QmagistralChannel = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("select[name*='CHANNEL_QM_SOBJECTID']").val() == null) ? "" : QmagistralChannel += " and OBJECTID=" + $("select[name*='CHANNEL_QM_SOBJECTID']").val();
                ($("input[name*='CHANNEL_QM_EXPLONATION_DATE_MIN']").val() == "") ? "" : QmagistralChannel += " and EXPLONATION_DATE >= " + $("input[name*='CHANNEL_QM_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='CHANNEL_QM_EXPLONATION_DATE_MAX']").val() == "") ? "" : QmagistralChannel += " and EXPLONATION_DATE <= " + $("input[name*='CHANNEL_QM_EXPLONATION_DATE_MAX']").val();
                ($("select[name*='CHANNEL_QM_SERVED_REGION_ID']").val() == null) ? "" : QmagistralChannel += " and SERVED_REGION_ID = " + $("select[name*='CHANNEL_QM_SERVED_REGION_ID']").val();
                ($("input[name*='CHANNEL_QM_SERVED_AREA_MIN']").val() == "") ? "" : QmagistralChannel += " and SERVED_AREAHA >= " + $("input[name*='CHANNEL_QM_SERVED_AREA_MIN']").val();
                ($("input[name*='CHANNEL_QM_SERVED_AREA_MAX']").val() == "") ? "" : QmagistralChannel += " and SERVED_AREAHA <= " + $("input[name*='CHANNEL_QM_SERVED_AREA_MAX']").val();
                ($("input[name*='CHANNEL_QM_FACTICAL_LENGTH_MIN']").val() == "") ? "" : QmagistralChannel += " and FACTICAL_LENGTH >= " + $("input[name*='CHANNEL_QM_FACTICAL_LENGTH_MIN']").val();
                ($("input[name*='CHANNEL_QM_FACTICAL_LENGTH_MAX']").val() == "") ? "" : QmagistralChannel += " and FACTICAL_LENGTH <= " + $("input[name*='CHANNEL_QM_FACTICAL_LENGTH_MAX']").val();

                var allCHQMCoverInput = $(".CHQMCover");
                var chqmCover = checkboxlist(allCHQMCoverInput);
                (chqmCover.length == 0 || chqmCover[0] == "0") ? "" : QmagistralChannel += " and COVER_TYPE_ID in (" + chqmCover + ") ";

                ($("input[name*='CHANNEL_QM_WATER_CAPABILITY_MIN']").val() == "") ? "" : QmagistralChannel += " and WATER_CAPABILITY >= " + $("input[name*='CHANNEL_QM_WATER_CAPABILITY_MIN']").val();
                ($("input[name*='CHANNEL_QM_WATER_CAPABILITY_MAX']").val() == "") ? "" : QmagistralChannel += " and WATER_CAPABILITY <= " + $("input[name*='CHANNEL_QM_WATER_CAPABILITY_MAX']").val();
                ($("input[name*='CHANNEL_QM_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : QmagistralChannel += " and WATERPROOF_WIDTH >= " + $("input[name*='CHANNEL_QM_WATERPROOF_WIDTH_MIN']").val();
                ($("input[name*='CHANNEL_QM_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : QmagistralChannel += " and WATERPROOF_WIDTH <= " + $("input[name*='CHANNEL_QM_WATERPROOF_WIDTH_MAX']").val();

                var allCHQMTecInput = $(".CHQMTec");
                var chqmtec = checkboxlist(allCHQMTecInput);
                (chqmtec.length == 0 || chqmtec[0] == "0") ? "" : QmagistralChannel += " and TECHNICAL_ID in (" + chqmtec + ") ";

                var allCHQMSSIInput = $(".CHQMproperty");
                var chqmssi = checkboxlist(allCHQMSSIInput);
                (chqmssi.length == 0 || chqmssi[0] == "0") ? "" : QmagistralChannel += " and SSI_ID in (" + chqmssi + ") ";

                var allCHQMProTypeInput = $(".CHQMprotype");
                var chqmproType = checkboxlist(allCHQMProTypeInput);
                (chqmproType.length == 0 || chqmproType[0] == "0") ? "" : QmagistralChannel += " and PROPERTY_TYPE_ID in (" + chqmproType + ") ";

                var allCHQMActivityInput = $(".CHQMactivity");
                var chqmActivity = checkboxlist(allCHQMActivityInput);
                (chqmActivity.length == 0 || chqmActivity[0] == "0") ? "" : QmagistralChannel += " and ACTIVITY_ID in (" + chqmActivity + ") ";


                ($("input[name*='CHANNEL_QM_DEVICE_SUM']").val() == "") ? "" : QmagistralChannel += " and DEVICE_SUM = " + $("input[name*='CHANNEL_QM_DEVICE_SUM']").val();

                // qapali 1 dereceli kanallar
                var QICHANNEL = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("select[name*='CHANNEL_QI_SOBJECTID']").val() == null) ? "" : QICHANNEL += " and OBJECTID=" + $("select[name*='CHANNEL_QI_SOBJECTID']").val();
                ($("input[name*='CHANNEL_QI_EXPLONATION_DATE_MIN']").val() == "") ? "" : QICHANNEL += " and EXPLONATION_DATE >=" + $("input[name*='CHANNEL_QI_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='CHANNEL_QI_EXPLONATION_DATE_MAX']").val() == "") ? "" : QICHANNEL += " and EXPLONATION_DATE <=" + $("input[name*='CHANNEL_QI_EXPLONATION_DATE_MAX']").val();
                ($("select[name*='CHANNEL_QI_SERVED_REGION_ID']").val() == null) ? "" : QICHANNEL += " and SERVED_REGION_ID=" + $("select[name*='CHANNEL_QI_SERVED_REGION_ID']").val();
                ($("input[name*='CHANNEL_QI_SERVED_AREA_MIN']").val() == "") ? "" : QICHANNEL += " and SERVED_AREAHA >=" + $("input[name*='CHANNEL_QI_SERVED_AREA_MIN']").val();
                ($("input[name*='CHANNEL_QI_SERVED_AREA_MAX']").val() == "") ? "" : QICHANNEL += " and SERVED_AREAHA <=" + $("input[name*='CHANNEL_QI_SERVED_AREA_MAX']").val();
                ($("input[name*='CHANNEL_QI_FACTICAL_LENGTH_MIN']").val() == "") ? "" : QICHANNEL += " and FACTICAL_LENGTH >=" + $("input[name*='CHANNEL_QI_FACTICAL_LENGTH_MIN']").val();
                ($("input[name*='CHANNEL_QI_FACTICAL_LENGTH_MAX']").val() == "") ? "" : QICHANNEL += " and FACTICAL_LENGTH <=" + $("input[name*='CHANNEL_QI_FACTICAL_LENGTH_MAX']").val();
                var allCHQICoverInput = $(".CHQICover");
                var chqiCover = checkboxlist(allCHQICoverInput);
                (chqiCover.length == 0 || chqiCover[0] == "0") ? "" : QICHANNEL += " and COVER_TYPE_ID in (" + chqiCover + ") ";

                ($("input[name*='CHANNEL_QI_WATER_CAPABILITY_MIN']").val() == "") ? "" : QICHANNEL += " and WATER_CAPABILITY >=" + $("input[name*='CHANNEL_QI_WATER_CAPABILITY_MIN']").val();
                ($("input[name*='CHANNEL_QI_WATER_CAPABILITY_MAX']").val() == "") ? "" : QICHANNEL += " and WATER_CAPABILITY <=" + $("input[name*='CHANNEL_QI_WATER_CAPABILITY_MAX']").val();
                ($("input[name*='CHANNEL_QI_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : QICHANNEL += " and WATERPROOF_WIDTH >=" + $("input[name*='CHANNEL_QI_WATERPROOF_WIDTH_MIN']").val();
                ($("input[name*='CHANNEL_QI_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : QICHANNEL += " and WATERPROOF_WIDTH <=" + $("input[name*='CHANNEL_QI_WATERPROOF_WIDTH_MAX']").val();

                var allCHQITecInput = $(".CHQITec");
                var chqitec = checkboxlist(allCHQITecInput);
                (chqitec.length == 0 || chqitec[0] == "0") ? "" : QICHANNEL += " and TECHNICAL_ID in (" + chqitec + ") ";

                var allCHQISSIInput = $(".CHQIproperty");
                var chqissi = checkboxlist(allCHQISSIInput);
                (chqissi.length == 0 || chqissi[0] == "0") ? "" : QICHANNEL += " and SSI_ID in (" + chqissi + ") ";

                var allCHQIProTypeInput = $(".CHQIprotype");
                var chqiproType = checkboxlist(allCHQIProTypeInput);
                (chqiproType.length == 0 || chqiproType[0] == "0") ? "" : QICHANNEL += " and PROPERTY_TYPE_ID in (" + chqiproType + ") ";

                var allCHQIActivityInput = $(".CHQIactivity");
                var chqiActivity = checkboxlist(allCHQIActivityInput);
                (chqiActivity.length == 0 || chqiActivity[0] == "0") ? "" : QICHANNEL += " and ACTIVITY_ID in (" + chqiActivity + ") ";


                ($("input[name*='CHANNEL_QI_DEVICE_SUM']").val() == "") ? "" : QICHANNEL += " and DEVICE_SUM=" + $("input[name*='CHANNEL_QI_DEVICE_SUM']").val();

                // qapali 2 dereceli kanallar
                var QIICHANNEL = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("select[name*='CHANNEL_QII_SOBJECTID']").val() == null) ? "" : QIICHANNEL += " and OBJECTID=" + $("select[name*='CHANNEL_QII_SOBJECTID']").val();
                ($("input[name*='CHANNEL_QII_EXPLONATION_DATE_MIN']").val() == "") ? "" : QIICHANNEL += " and EXPLONATION_DATE >=" + $("input[name*='CHANNEL_QII_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='CHANNEL_QII_EXPLONATION_DATE_MAX']").val() == "") ? "" : QIICHANNEL += " and EXPLONATION_DATE <=" + $("input[name*='CHANNEL_QII_EXPLONATION_DATE_MAX']").val();
                ($("select[name*='CHANNEL_QII_SERVED_REGION_ID']").val() == null) ? "" : QIICHANNEL += " and SERVED_REGION_ID=" + $("select[name*='CHANNEL_QII_SERVED_REGION_ID']").val();
                ($("input[name*='CHANNEL_QII_SERVED_AREA_MIN']").val() == "") ? "" : QIICHANNEL += " and SERVED_AREAHA >=" + $("input[name*='CHANNEL_QII_SERVED_AREA_MIN']").val();
                ($("input[name*='CHANNEL_QII_SERVED_AREA_MAX']").val() == "") ? "" : QIICHANNEL += " and SERVED_AREAHA <=" + $("input[name*='CHANNEL_QII_SERVED_AREA_MAX']").val();
                ($("input[name*='CHANNEL_QII_FACTICAL_LENGTH_MIN']").val() == "") ? "" : QIICHANNEL += " and FACTICAL_LENGTH >=" + $("input[name*='CHANNEL_QII_FACTICAL_LENGTH_MIN']").val();
                ($("input[name*='CHANNEL_QII_FACTICAL_LENGTH_MAX']").val() == "") ? "" : QIICHANNEL += " and FACTICAL_LENGTH <=" + $("input[name*='CHANNEL_QII_FACTICAL_LENGTH_MAX']").val();

                var allCHQIICoverInput = $(".CHQIICover");
                var chqiiCover = checkboxlist(allCHQIICoverInput);
                (chqiiCover.length == 0 || chqiiCover[0] == "0") ? "" : QIICHANNEL += " and COVER_TYPE_ID in (" + chqiiCover + ") ";

                ($("input[name*='CHANNEL_QII_WATER_CAPABILITY_MIN']").val() == "") ? "" : QIICHANNEL += " and WATER_CAPABILITY >=" + $("input[name*='CHANNEL_QII_WATER_CAPABILITY_MIN']").val();
                ($("input[name*='CHANNEL_QII_WATER_CAPABILITY_MAX']").val() == "") ? "" : QIICHANNEL += " and WATER_CAPABILITY <=" + $("input[name*='CHANNEL_QII_WATER_CAPABILITY_MAX']").val();
                ($("input[name*='CHANNEL_QII_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : QIICHANNEL += " and WATERPROOF_WIDTH >=" + $("input[name*='CHANNEL_QII_WATERPROOF_WIDTH_MIN']").val();
                ($("input[name*='CHANNEL_QII_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : QIICHANNEL += " and WATERPROOF_WIDTH <=" + $("input[name*='CHANNEL_QII_WATERPROOF_WIDTH_MAX']").val();

                var allCHQIITecInput = $(".CHQIITec");
                var chqiitec = checkboxlist(allCHQIITecInput);
                (chqiitec.length == 0 || chqiitec[0] == "0") ? "" : QIICHANNEL += " and TECHNICAL_ID in (" + chqiitec + ") ";

                var allCHQIISSIInput = $(".CHQIIproperty");
                var chqiissi = checkboxlist(allCHQIISSIInput);
                (chqiissi.length == 0 || chqiissi[0] == "0") ? "" : QIICHANNEL += " and SSI_ID in (" + chqiissi + ") ";

                var allCHQIIProTypeInput = $(".CHQIIprotype");
                var chqiiproType = checkboxlist(allCHQIIProTypeInput);
                (chqiiproType.length == 0 || chqiiproType[0] == "0") ? "" : QIICHANNEL += " and PROPERTY_TYPE_ID in (" + chqiiproType + ") ";

                var allCHQIIActivityInput = $(".CHQIIactivity");
                var chqiiActivity = checkboxlist(allCHQIIActivityInput);
                (chqiiActivity.length == 0 || chqiiActivity[0] == "0") ? "" : QIICHANNEL += " and ACTIVITY_ID in (" + chqiiActivity + ") ";


                ($("input[name*='CHANNEL_QII_DEVICE_SUM']").val() == "") ? "" : QIICHANNEL += " and DEVICE_SUM=" + $("input[name*='CHANNEL_QII_DEVICE_SUM']").val();


                // qapali 3 derecli kanallar
                var QIIICHANNEL = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                //($("select[name*='CHANNEL_QIII_SOBJECTID']").val() == null) ? "" : QIIICHANNEL += " and OBJECTID=" + $("select[name*='CHANNEL_QIII_SOBJECTID']").val();
                ($("input[name*='CHANNEL_QIII_EXPLONATION_DATE_MIN']").val() == "") ? "" : QIIICHANNEL += " and EXPLONATION_DATE >=" + $("input[name*='CHANNEL_QIII_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='CHANNEL_QIII_EXPLONATION_DATE_MAX']").val() == "") ? "" : QIIICHANNEL += " and EXPLONATION_DATE <=" + $("input[name*='CHANNEL_QIII_EXPLONATION_DATE_MAX']").val();
                ($("select[name*='CHANNEL_QIII_SERVED_REGION_ID']").val() == null) ? "" : QIIICHANNEL += " and SERVED_REGION_ID=" + $("select[name*='CHANNEL_QIII_SERVED_REGION_ID']").val();
                ($("input[name*='CHANNEL_QIII_SERVED_AREA_MIN']").val() == "") ? "" : QIIICHANNEL += " and SERVED_AREAHA >=" + $("input[name*='CHANNEL_QIII_SERVED_AREA_MIN']").val();
                ($("input[name*='CHANNEL_QIII_SERVED_AREA_MAX']").val() == "") ? "" : QIIICHANNEL += " and SERVED_AREAHA <=" + $("input[name*='CHANNEL_QIII_SERVED_AREA_MAX']").val();
                ($("input[name*='CHANNEL_QIII_FACTICAL_LENGTH_MIN']").val() == "") ? "" : QIIICHANNEL += " and FACTICAL_LENGTH >=" + $("input[name*='CHANNEL_QIII_FACTICAL_LENGTH_MIN']").val();
                ($("input[name*='CHANNEL_QIII_FACTICAL_LENGTH_MAX']").val() == "") ? "" : QIIICHANNEL += " and FACTICAL_LENGTH <=" + $("input[name*='CHANNEL_QIII_FACTICAL_LENGTH_MAX']").val();

                var allCHQIIICoverInput = $(".CHQIIICover");
                var chqiiiCover = checkboxlist(allCHQIIICoverInput);
                (chqiiiCover.length == 0 || chqiiiCover[0] == "0") ? "" : QIIICHANNEL += " and COVER_TYPE_ID in (" + chqiiiCover + ") ";

                ($("input[name*='CHANNEL_QIII_WATER_CAPABILITY_MIN']").val() == "") ? "" : QIIICHANNEL += " and WATER_CAPABILITY >=" + $("input[name*='CHANNEL_QIII_WATER_CAPABILITY_MIN']").val();
                ($("input[name*='CHANNEL_QIII_WATER_CAPABILITY_MAX']").val() == "") ? "" : QIIICHANNEL += " and WATER_CAPABILITY <=" + $("input[name*='CHANNEL_QIII_WATER_CAPABILITY_MAX']").val();
                ($("input[name*='CHANNEL_QIII_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : QIIICHANNEL += " and WATERPROOF_WIDTH >=" + $("input[name*='CHANNEL_QIII_WATERPROOF_WIDTH_MIN']").val();
                ($("input[name*='CHANNEL_QIII_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : QIIICHANNEL += " and WATERPROOF_WIDTH <=" + $("input[name*='CHANNEL_QIII_WATERPROOF_WIDTH_MAX']").val();

                var allCHQIIITecInput = $(".CHQIIITec");
                var chqiiitec = checkboxlist(allCHQIIITecInput);
                (chqiiitec.length == 0 || chqiiitec[0] == "0") ? "" : QIIICHANNEL += " and TECHNICAL_ID in (" + chqiiitec + ") ";

                var allCHQIIISSIInput = $(".CHQIIIproperty");
                var chqiiissi = checkboxlist(allCHQIIISSIInput);
                (chqiiissi.length == 0 || chqiiissi[0] == "0") ? "" : QIIICHANNEL += " and SSI_ID in (" + chqiiissi + ") ";

                var allCHQIIIProTypeInput = $(".CHQIIIprotype");
                var chqiiiproType = checkboxlist(allCHQIIIProTypeInput);
                (chqiiiproType.length == 0 || chqiiiproType[0] == "0") ? "" : QIIICHANNEL += " and PROPERTY_TYPE_ID in (" + chqiiiproType + ") ";

                var allCHQIIIActivityInput = $(".CHQIIIactivity");
                var chqiiiActivity = checkboxlist(allCHQIIIActivityInput);
                (chqiiiActivity.length == 0 || chqiiiActivity[0] == "0") ? "" : QIIICHANNEL += " and ACTIVITY_ID in (" + chqiiiActivity + ") ";

                ($("input[name*='CHANNEL_QIII_DEVICE_SUM']").val() == "") ? "" : QIIICHANNEL += " and DEVICE_SUM=" + $("input[name*='CHANNEL_QIII_DEVICE_SUM']").val();



                // magistral drenajlar

                var DRENAJM = " 1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("select[name*='DRENAJ_M_RECIVER_ID']").val() == null) ? "" : DRENAJM += "and OBJECTID=" + $("input[name*='DRENAJ_M_RECIVER_ID']").val();
                ($("input[name*='DRENAJ_M_EXPLONATION_DATE_MIN']").val() == "") ? "" : DRENAJM += "and EXPLONATION_DATE >=" + $("input[name*='DRENAJ_M_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='DRENAJ_M_EXPLONATION_DATE_MAX']").val() == "") ? "" : DRENAJM += "and EXPLONATION_DATE <=" + $("input[name*='DRENAJ_M_EXPLONATION_DATE_MAX']").val();
                ($("input[name*='DRENAJ_M_SERVED_AREA_MIN']").val() == "") ? "" : DRENAJM += "and SERVED_AREA >=" + $("input[name*='DRENAJ_M_SERVED_AREA_MIN']").val();
                ($("input[name*='DRENAJ_M_SERVED_AREA_MAX']").val() == "") ? "" : DRENAJM += "and SERVED_AREA <=" + $("input[name*='DRENAJ_M_SERVED_AREA_MAX']").val();
                ($("input[name*='DRENAJ_M_FACTICAL_LENGTH_MIN']").val() == "") ? "" : DRENAJM += "and FACTICAL_LENGTH >=" + $("input[name*='DRENAJ_M_FACTICAL_LENGTH_MIN']").val();
                ($("input[name*='DRENAJ_M_FACTICAL_LENGTH_MAX']").val() == "") ? "" : DRENAJM += "and FACTICAL_LENGTH <=" + $("input[name*='DRENAJ_M_FACTICAL_LENGTH_MAX']").val();

                var allDRENMactivtyInput = $(".DRENMactivty");
                var DRENMactivty = checkboxlist(allDRENMactivtyInput);
                (DRENMactivty.length == 0 || DRENMactivty[0] == "0") ? "" : DRENAJM += " and ACTIVITY_ID in (" + DRENMactivty + ") ";

                var allDRENMkindInput = $(".DRENMkind");
                var DRENMkind = checkboxlist(allDRENMkindInput);
                (DRENMkind.length == 0 || DRENMkind[0] == "0") ? "" : DRENAJM += " and KIND_ID in (" + DRENMkind + ") ";


                var allDRENMtecInput = $(".DRENMtec");
                var DRENMtec = checkboxlist(allDRENMtecInput);
                (DRENMtec.length == 0 || DRENMtec[0] == "0") ? "" : DRENAJM += " and TECHNICAL_CONDINITION_ID in (" + DRENMtec + ") ";

                var allDRENMProTypeInput = $(".DRENMProType");
                var DRENMProType = checkboxlist(allDRENMProTypeInput);
                (DRENMProType.length == 0 || DRENMProType[0] == "0") ? "" : DRENAJM += " and PROPERTY_TYPE_ID in (" + DRENMProType + ") ";
                
                var allDRENMSSIInput = $(".DRENMSSI");
                var DRENMSSI = checkboxlist(allDRENMSSIInput);
                (DRENMSSI.length == 0 || DRENMSSI[0] == "0") ? "" : DRENAJM += " and SSI_ID in (" + DRENMSSI + ") ";

                ($("input[name*='DRENAJ_M_WATER_CAPABILITY_MIN']").val() == "") ? "" : DRENAJM += "and WATER_CAPABILITY >=" + $("input[name*='DRENAJ_M_WATER_CAPABILITY_MIN']").val();
                ($("input[name*='DRENAJ_M_WATER_CAPABILITY_MAX']").val() == "") ? "" : DRENAJM += "and WATER_CAPABILITY <=" + $("input[name*='DRENAJ_M_WATER_CAPABILITY_MAX']").val();
                ($("input[name*='DRENAJ_M_DEVICE_SUM']").val() == "") ? "" : DRENAJM += "and DEVICE_SUM =" + $("input[name*='DRENAJ_M_DEVICE_SUM']").val();

                // 1 DERECELI KANALLAR
                var DRENAJI = " 1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("select[name*='DRENAJ_I_RECIVER_ID']").val() == null) ? "" : DRENAJI += "and OBJECTID=" + $("input[name*='DRENAJ_I_RECIVER_ID']").val();
                ($("input[name*='DRENAJ_I_EXPLONATION_DATE_MIN']").val() == "") ? "" : DRENAJI += "and EXPLONATION_DATE >=" + $("input[name*='DRENAJ_I_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='DRENAJ_I_EXPLONATION_DATE_MAX']").val() == "") ? "" : DRENAJI += "and EXPLONATION_DATE <=" + $("input[name*='DRENAJ_I_EXPLONATION_DATE_MAX']").val();
                ($("input[name*='DRENAJ_I_SERVED_AREA_MIN']").val() == "") ? "" : DRENAJI += "and SERVED_AREA >=" + $("input[name*='DRENAJ_I_SERVED_AREA_MIN']").val();
                ($("input[name*='DRENAJ_I_SERVED_AREA_MAX']").val() == "") ? "" : DRENAJI += "and SERVED_AREA <=" + $("input[name*='DRENAJ_I_SERVED_AREA_MAX']").val();
                ($("input[name*='DRENAJ_I_FACTICAL_LENGTH_MIN']").val() == "") ? "" : DRENAJI += "and FACTICAL_LENGTH >=" + $("input[name*='DRENAJ_I_FACTICAL_LENGTH_MIN']").val();
                ($("input[name*='DRENAJ_I_FACTICAL_LENGTH_MAX']").val() == "") ? "" : DRENAJI += "and FACTICAL_LENGTH <=" + $("input[name*='DRENAJ_I_FACTICAL_LENGTH_MAX']").val();

                var allDRENIactivtyInput = $(".DRENIactivty");
                var DRENIactivty = checkboxlist(allDRENIactivtyInput);
                (DRENIactivty.length == 0 || DRENIactivty[0] == "0") ? "" : DRENAJI += " and ACTIVITY_ID in (" + DRENIactivty + ") ";

                var allDRENIkindInput = $(".DRENIkind");
                var DRENIkind = checkboxlist(allDRENIkindInput);
                (DRENIkind.length == 0 || DRENIkind[0] == "0") ? "" : DRENAJI += " and KIND_ID in (" + DRENIkind + ") ";


                var allDRENItecInput = $(".DRENItec");
                var DRENItec = checkboxlist(allDRENItecInput);
                (DRENItec.length == 0 || DRENItec[0] == "0") ? "" : DRENAJI += " and TECHNICAL_CONDINITION_ID in (" + DRENItec + ") ";

                var allDRENIProTypeInput = $(".DRENIProType");
                var DRENIProType = checkboxlist(allDRENIProTypeInput);
                (DRENIProType.length == 0 || DRENIProType[0] == "0") ? "" : DRENAJI += " and PROPERTY_TYPE_ID in (" + DRENIProType + ") ";

                var allDRENISSIInput = $(".DRENISSI");
                var DRENISSI = checkboxlist(allDRENISSIInput);
                (DRENISSI.length == 0 || DRENISSI[0] == "0") ? "" : DRENAJI += " and SSI_ID in (" + DRENISSI + ") ";

                ($("input[name*='DRENAJ_I_WATER_CAPABILITY_MIN']").val() == "") ? "" : DRENAJI += "and WATER_CAPABILITY >=" + $("input[name*='DRENAJ_I_WATER_CAPABILITY_MIN']").val();
                ($("input[name*='DRENAJ_I_WATER_CAPABILITY_MAX']").val() == "") ? "" : DRENAJI += "and WATER_CAPABILITY <=" + $("input[name*='DRENAJ_I_WATER_CAPABILITY_MAX']").val();
                ($("input[name*='DRENAJ_I_DEVICE_SUM']").val() == "") ? "" : DRENAJI += "and DEVICE_SUM =" + $("input[name*='DRENAJ_I_DEVICE_SUM']").val();


                // 2 DERECELI KANALAR
                var DRENAJII = " 1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("select[name*='DRENAJ_II_RECIVER_ID']").val() == null) ? "" : DRENAJII += "and OBJECTID=" + $("input[name*='DRENAJ_II_RECIVER_ID']").val();
                ($("input[name*='DRENAJ_II_EXPLONATION_DATE_MIN']").val() == "") ? "" : DRENAJII += "and EXPLONATION_DATE >=" + $("input[name*='DRENAJ_II_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='DRENAJ_II_EXPLONATION_DATE_MAX']").val() == "") ? "" : DRENAJII += "and EXPLONATION_DATE <=" + $("input[name*='DRENAJ_II_EXPLONATION_DATE_MAX']").val();
                ($("input[name*='DRENAJ_II_SERVED_AREA_MIN']").val() == "") ? "" : DRENAJII += "and SERVED_AREA >=" + $("input[name*='DRENAJ_II_SERVED_AREA_MIN']").val();
                ($("input[name*='DRENAJ_II_SERVED_AREA_MAX']").val() == "") ? "" : DRENAJII += "and SERVED_AREA <=" + $("input[name*='DRENAJ_II_SERVED_AREA_MAX']").val();
                ($("input[name*='DRENAJ_II_FACTICAL_LENGTH_MIN']").val() == "") ? "" : DRENAJII += "and FACTICAL_LENGTH >=" + $("input[name*='DRENAJ_II_FACTICAL_LENGTH_MIN']").val();
                ($("input[name*='DRENAJ_II_FACTICAL_LENGTH_MAX']").val() == "") ? "" : DRENAJII += "and FACTICAL_LENGTH <=" + $("input[name*='DRENAJ_II_FACTICAL_LENGTH_MAX']").val();

                var allDRENIIactivtyInput = $(".DRENIIactivty");
                var DRENIIactivty = checkboxlist(allDRENIIactivtyInput);
                (DRENIIactivty.length == 0 || DRENIIactivty[0] == "0") ? "" : DRENAJII += " and ACTIVITY_ID in (" + DRENIIactivty + ") ";

                var allDRENIIkindInput = $(".DRENIIkind");
                var DRENIIkind = checkboxlist(allDRENIIkindInput);
                (DRENIIkind.length == 0 || DRENIIkind[0] == "0") ? "" : DRENAJII += " and KIND_ID in (" + DRENIIkind + ") ";


                var allDRENIItecInput = $(".DRENIItec");
                var DRENIItec = checkboxlist(allDRENIItecInput);
                (DRENIItec.length == 0 || DRENIItec[0] == "0") ? "" : DRENAJII += " and TECHNICAL_CONDINITION_ID in (" + DRENIItec + ") ";

                var allDRENIIProTypeInput = $(".DRENIIProType");
                var DRENIIProType = checkboxlist(allDRENIIProTypeInput);
                (DRENIIProType.length == 0 || DRENIIProType[0] == "0") ? "" : DRENAJII += " and PROPERTY_TYPE_ID in (" + DRENIIProType + ") ";

                var allDRENIISSIInput = $(".DRENISSI");
                var DRENIISSI = checkboxlist(allDRENIISSIInput);
                (DRENIISSI.length == 0 || DRENIISSI[0] == "0") ? "" : DRENAJII += " and SSI_ID in (" + DRENIISSI + ") ";


                ($("input[name*='DRENAJ_II_WATER_CAPABILITY_MIN']").val() == "") ? "" : DRENAJII += "and WATER_CAPABILITY >=" + $("input[name*='DRENAJ_II_WATER_CAPABILITY_MIN']").val();
                ($("input[name*='DRENAJ_II_WATER_CAPABILITY_MAX']").val() == "") ? "" : DRENAJII += "and WATER_CAPABILITY <=" + $("input[name*='DRENAJ_II_WATER_CAPABILITY_MAX']").val();
                ($("input[name*='DRENAJ_II_DEVICE_SUM']").val() == "") ? "" : DRENAJII += "and DEVICE_SUM =" + $("input[name*='DRENAJ_II_DEVICE_SUM']").val();

                // ILKIN DRENAJLAR
                var DRENAJK = " 1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("select[name*='DRENAJ_K_RECIVER_ID']").val() == null) ? "" : DRENAJK += "and OBJECTID=" + $("input[name*='DRENAJ_K_RECIVER_ID']").val();
                ($("input[name*='DRENAJ_K_EXPLONATION_DATE_MIN']").val() == "") ? "" : DRENAJK += "and EXPLONATION_DATE >=" + $("input[name*='DRENAJ_K_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='DRENAJ_K_EXPLONATION_DATE_MAX']").val() == "") ? "" : DRENAJK += "and EXPLONATION_DATE <=" + $("input[name*='DRENAJ_K_EXPLONATION_DATE_MAX']").val();
                ($("input[name*='DRENAJ_K_SERVED_AREA_MIN']").val() == "") ? "" : DRENAJK += "and SERVED_AREA >=" + $("input[name*='DRENAJ_K_SERVED_AREA_MIN']").val();
                ($("input[name*='DRENAJ_K_SERVED_AREA_MAX']").val() == "") ? "" : DRENAJK += "and SERVED_AREA <=" + $("input[name*='DRENAJ_K_SERVED_AREA_MAX']").val();
                ($("input[name*='DRENAJ_K_FACTICAL_LENGTH_MIN']").val() == "") ? "" : DRENAJK += "and FACTICAL_LENGTH >=" + $("input[name*='DRENAJ_K_FACTICAL_LENGTH_MIN']").val();
                ($("input[name*='DRENAJ_K_FACTICAL_LENGTH_MAX']").val() == "") ? "" : DRENAJK += "and FACTICAL_LENGTH <=" + $("input[name*='DRENAJ_K_FACTICAL_LENGTH_MAX']").val();

                var allDRENKactivtyInput = $(".DRENKactivty");
                var DRENKactivty = checkboxlist(allDRENKactivtyInput);
                (DRENKactivty.length == 0 || DRENKactivty[0] == "0") ? "" : DRENAJK += " and ACTIVITY_ID in (" + DRENKactivty + ") ";

                var allDRENKkindInput = $(".DRENKkind");
                var DRENKkind = checkboxlist(allDRENKkindInput);
                (DRENKkind.length == 0 || DRENKkind[0] == "0") ? "" : DRENAJK += " and KIND_ID in (" + DRENKkind + ") ";


                var allDRENKtecInput = $(".DRENKtec");
                var DRENKtec = checkboxlist(allDRENKtecInput);
                (DRENKtec.length == 0 || DRENKtec[0] == "0") ? "" : DRENAJK += " and TECHNICAL_CONDINITION_ID in (" + DRENKtec + ") ";

                var allDRENKProTypeInput = $(".DRENIProType");
                var DRENKProType = checkboxlist(allDRENKProTypeInput);
                (DRENKProType.length == 0 || DRENKProType[0] == "0") ? "" : DRENAJK += " and PROPERTY_TYPE_ID in (" + DRENKProType + ") ";

                var allDRENKSSIInput = $(".DRENKSSI");
                var DRENKSSI = checkboxlist(allDRENKSSIInput);
                (DRENKSSI.length == 0 || DRENKSSI[0] == "0") ? "" : DRENAJK += " and SSI_ID in (" + DRENKSSI + ") ";


                ($("input[name*='DRENAJ_K_WATER_CAPABILITY_MIN']").val() == "") ? "" : DRENAJK += "and WATER_CAPABILITY >=" + $("input[name*='DRENAJ_K_WATER_CAPABILITY_MIN']").val();
                ($("input[name*='DRENAJ_K_WATER_CAPABILITY_MAX']").val() == "") ? "" : DRENAJK += "and WATER_CAPABILITY <=" + $("input[name*='DRENAJ_K_WATER_CAPABILITY_MAX']").val();
                ($("input[name*='DRENAJ_K_DEVICE_SUM']").val() == "") ? "" : DRENAJK += "and DEVICE_SUM =" + $("input[name*='DRENAJ_K_DEVICE_SUM']").val();

                // hidrogen qurgular
                var device = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("input[name*='DEVICE_EXDATA_MIN']").val() == "") ? "" : device += " and DEVICE.EXPLONATION_DATE >=" + $("input[name*='DEVICE_EXDATA_MIN']").val();
                ($("input[name*='DEVICE_EXDATA_MAX']").val() == "") ? "" : device += " and DEVICE.EXPLONATION_DATE <=" + $("input[name*='DEVICE_EXDATA_MAX']").val();
                ($("input[name*='DEVICE_SEVAREA_MIN']").val() == "") ? "" : device += " and DEVICE.SERVED_AREA >=" + $("input[name*='DEVICE_SEVAREA_MIN']").val();
                ($("input[name*='DEVICE_SEVAREA_MAX']").val() == "") ? "" : device += " and DEVICE.SERVED_AREA <=" + $("input[name*='DEVICE_SEVAREA_MAX']").val();
                ($("select[name*='DEVICE_NETWORK_TYPE']").val() == null) ? "" : device += " and DEVICE.NETWORK_TYPE_ID=" + $("select[name*='DEVICE_NETWORK_TYPE']").val();
                ($("input[name*='DEVICE_WTRCAPASTY_MIN']").val() == "") ? "" : device += " and DEVICE.WATER_CAPABILITY >=" + $("input[name*='DEVICE_WTRCAPASTY_MIN']").val();
                ($("input[name*='DEVICE_WTRCAPASTY_MAX']").val() == "") ? "" : device += " and DEVICE.WATER_CAPABILITY <=" + $("input[name*='DEVICE_WTRCAPASTY_MAX']").val();

                var allDEVICEactnput = $(".DEVICEact");
                var DEVICEact = checkboxlist(allDEVICEactnput);
                (DEVICEact.length == 0 || DEVICEact[0] == "0") ? "" : device += " and DEVICE.ACTIVITY_ID in (" + DEVICEact + ") ";

                var allDEVICEsecnput = $(".DEVICEsec");
                var DEVICEsec = checkboxlist(allDEVICEsecnput);
                (DEVICEsec.length == 0 || DEVICEsec[0] == "0") ? "" : device += " and DEVICE.SECURITY_TYPE_ID in (" + DEVICEsec + ") ";

                var allDEVICEtecnput = $(".DEVICEtec");
                var DEVICEtec = checkboxlist(allDEVICEtecnput);
                (DEVICEtec.length == 0 || DEVICEtec[0] == "0") ? "" : device += " and DEVICE.TECHNICAL_TYPE_ID in (" + DEVICEtec + ") ";

                var allDEVICEprotypenput = $(".DEVICEprotype");
                var DEVICEprotype = checkboxlist(allDEVICEprotypenput);
                (DEVICEprotype.length == 0 || DEVICEprotype[0] == "0") ? "" : device += " and DEVICE.PROPERTY_TYPE_ID in (" + DEVICEprotype + ") ";

                var allDEVICEssinput = $(".DEVICEssi");
                var DEVICEssi = checkboxlist(allDEVICEssinput);
                (DEVICEssi.length == 0 || DEVICEssi[0] == "0") ? "" : device += " and DEVICE.SSI_ID in (" + DEVICEssi + ") ";

                if ($("select[name*='DEVICE_NETWORK_TYPE']").val() == 1) {

                    var allDEVICECHcovernput = $(".DEVICECHcover");
                    var DEVICECHcover = checkboxlist(allDEVICECHcovernput);
                    (DEVICECHcover.length == 0 || DEVICECHcover[0] == "0") ? "" : device += " and CHANNELS.COVER_TYPE_ID in (" + DEVICECHcover + ") ";

                    ($("input[name*='DEVICECHANNEL_WATER_CAPABILITY_MIN']").val() == "") ? "" : device += "and CHANNELS.WATER_CAPABILITY >=" + $("input[name*='DEVICECHANNEL_WATER_CAPABILITY_MIN']").val();
                    ($("input[name*='DEVICECHANNEL_WATER_CAPABILITY_MAX']").val() == "") ? "" : device += "and CHANNELS.WATER_CAPABILITY <=" + $("input[name*='DEVICECHANNEL_WATER_CAPABILITY_MAX']").val();

                    var allDEVICECHtypenput = $(".DEVICECHtype");
                    var DEVICECHtype = checkboxlist(allDEVICECHtypenput);
                    (DEVICECHtype.length == 0 || DEVICECHtype[0] == "0") ? "" : device += " and CHANNELS.TYPE_ID in (" + DEVICECHtype + ") ";


                }
                if ($("select[name*='DEVICE_NETWORK_TYPE']").val() == 3) {

                    ($("input[name*='DEVICE_DRENAJWTRCAPASTY_MIN']").val() == "") ? "" : device += " and DRENAJ.WATER_CAPABILITY >=" + $("input[name*='DEVICE_DRENAJWTRCAPASTY_MIN']").val();
                    ($("input[name*='DEVICE_DRENAJWTRCAPASTY_MAX']").val() == "") ? "" : device += " and DRENAJ.WATER_CAPABILITY <=" + $("input[name*='DEVICE_DRENAJWTRCAPASTY_MAX']").val();

                    var allDEVICEDRtypenput = $(".DEVICEDRtype");
                    var DEVICEDRtype = checkboxlist(allDEVICEDRtypenput);
                    (DEVICEDRtype.length == 0 || DEVICEDRtype[0] == "0") ? "" : device += " and DRENAJ.CHANNEL_TYPE_ID in (" + DEVICEDRtype + ") ";

                }


                var deviceMap = " 1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("input[name*='DEVICE_EXDATA_MIN']").val() == "") ? "" : deviceMap += " and EXPLONATION_DATE >=" + $("input[name*='DEVICE_EXDATA_MIN']").val();
                ($("input[name*='DEVICE_EXDATA_MAX']").val() == "") ? "" : deviceMap += " and EXPLONATION_DATE <=" + $("input[name*='DEVICE_EXDATA_MAX']").val();
                ($("input[name*='DEVICE_SEVAREA_MIN']").val() == "") ? "" : deviceMap += " and SERVED_AREA >=" + $("input[name*='DEVICE_SEVAREA_MIN']").val();
                ($("input[name*='DEVICE_SEVAREA_MAX']").val() == "") ? "" : deviceMap += " and SERVED_AREA <=" + $("input[name*='DEVICE_SEVAREA_MAX']").val();
                ($("select[name*='DEVICE_NETWORK_TYPE']").val() == null) ? "" : deviceMap += " and NETWORK_TYPE_ID=" + $("select[name*='DEVICE_NETWORK_TYPE']").val();
                ($("input[name*='DEVICE_WTRCAPASTY_MIN']").val() == "") ? "" : deviceMap += " and WATER_CAPABILITY >=" + $("input[name*='DEVICE_WTRCAPASTY_MIN']").val();
                ($("input[name*='DEVICE_WTRCAPASTY_MAX']").val() == "") ? "" : deviceMap += " and WATER_CAPABILITY <=" + $("input[name*='DEVICE_WTRCAPASTY_MAX']").val();

                var allDEVICEactnput = $(".DEVICEact");
                var DEVICEact = checkboxlist(allDEVICEactnput);
                (DEVICEact.length == 0 || DEVICEact[0] == "0") ? "" : deviceMap += " and ACTIVITY_ID in (" + DEVICEact + ") ";

                var allDEVICEsecnput = $(".DEVICEsec");
                var DEVICEsec = checkboxlist(allDEVICEsecnput);
                (DEVICEsec.length == 0 || DEVICEsec[0] == "0") ? "" : deviceMap += " and SECURITY_TYPE_ID in (" + DEVICEsec + ") ";

                var allDEVICEtecnput = $(".DEVICEtec");
                var DEVICEtec = checkboxlist(allDEVICEtecnput);
                (DEVICEtec.length == 0 || DEVICEtec[0] == "0") ? "" : deviceMap += " and TECHNICAL_TYPE_ID in (" + DEVICEtec + ") ";

                var allDEVICEprotypenput = $(".DEVICEprotype");
                var DEVICEprotype = checkboxlist(allDEVICEprotypenput);
                (DEVICEprotype.length == 0 || DEVICEprotype[0] == "0") ? "" : deviceMap += " and PROPERTY_TYPE_ID in (" + DEVICEprotype + ") ";

                var allDEVICEssinput = $(".DEVICEssi");
                var DEVICEssi = checkboxlist(allDEVICEssinput);
                (DEVICEssi.length == 0 || DEVICEssi[0] == "0") ? "" : deviceMap += " and SSI_ID in (" + DEVICEssi + ") ";

                if ($("select[name*='DEVICE_NETWORK_TYPE']").val() == 1) {

                    var allDEVICECHcovernput = $(".DEVICECHcover");
                    var DEVICEssi = checkboxlist(allDEVICECHcovernput);
                    (DEVICECHcover.length == 0 || DEVICECHcover[0] == "0") ? "" : deviceMap += " and COVER_TYPE_ID in (" + DEVICECHcover + ") ";

                    ($("input[name*='DEVICECHANNEL_WATER_CAPABILITY_MIN']").val() == "") ? "" : deviceMap += " and CHANNELS_WATER_CAPABILITY  >=" + $("input[name*='DEVICECHANNEL_WATER_CAPABILITY_MIN']").val();
                    ($("input[name*='DEVICECHANNEL_WATER_CAPABILITY_MAX']").val() == "") ? "" : deviceMap += " and CHANNELS_WATER_CAPABILITY  <=" + $("input[name*='DEVICECHANNEL_WATER_CAPABILITY_MAX']").val();

                    var allDEVICECHtypenput = $(".DEVICECHtype");
                    var DEVICECHtype = checkboxlist(allDEVICECHtypenput);
                    (DEVICECHtype.length == 0 || DEVICECHtype[0] == "0") ? "" : deviceMap += " and TYPE_ID in (" + DEVICECHtype + ") ";


                }
                if ($("select[name*='DEVICE_NETWORK_TYPE']").val() == 3) {

                    ($("input[name*='DEVICE_DRENAJWTRCAPASTY_MIN']").val() == "") ? "" : deviceMap += " and DRENAJ_WATER_CAPABILITY >=" + $("input[name*='DEVICE_DRENAJWTRCAPASTY_MIN']").val();
                    ($("input[name*='DEVICE_DRENAJWTRCAPASTY_MAX']").val() == "") ? "" : deviceMap += " and DRENAJ_WATER_CAPABILITY <=" + $("input[name*='DEVICE_DRENAJWTRCAPASTY_MAX']").val();
                    var allDEVICEDRtypenput = $(".DEVICEDRtype");
                    var DEVICEDRtype = checkboxlist(allDEVICEDRtypenput);
                    (DEVICEDRtype.length == 0 || DEVICEDRtype[0] == "0") ? "" : deviceMap += " and CHANNEL_TYPE_ID in (" + DEVICEDRtype + ") ";

                }
                


                // artezian quyular

                var artezianWell = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;

                var allARTWELLTYPEnput = $(".ARTWELLTYPE");
                var ARTWELLTYPE = checkboxlist(allARTWELLTYPEnput);
                (ARTWELLTYPE.length == 0 || ARTWELLTYPE[0] == "0") ? "" : artezianWell += " and WELL_TYPE_ID in (" + ARTWELLTYPE + ") ";

                ($("input[name*='ARTEZIAN_PRODUCTIVITY_MIN']").val() == "") ? "" : artezianWell += "and PRODUCTIVITY >=" + $("input[name*='ARTEZIAN_PRODUCTIVITY_MIN']").val();
                ($("input[name*='ARTEZIAN_PRODUCTIVITY_MAX']").val() == "") ? "" : artezianWell += "and PRODUCTIVITY <=" + $("input[name*='ARTEZIAN_PRODUCTIVITY_MAX']").val();
                ($("select[name*='ARTEZIAN_SIBS_ID']").val() == null) ? "" : artezianWell += "and SIBS_ID=" + $("select[name*='ARTEZIAN_SIBS_ID']").val();
                ($("input[name*='ARTEZIAN_EXPDATE_MIN']").val() == "") ? "" : artezianWell += "and EXPLONATION_DATE >=" + $("input[name*='ARTEZIAN_EXPDATE_MIN']").val();
                ($("input[name*='ARTEZIAN_EXPDATE_MAX']").val() == "") ? "" : artezianWell += "and EXPLONATION_DATE <=" + $("input[name*='ARTEZIAN_EXPDATE_MAX']").val();

                var allARTWELLACTnput = $(".ARTWELLACT");
                var ARTWELLACT = checkboxlist(allARTWELLACTnput);
                (ARTWELLACT.length == 0 || ARTWELLACT[0] == "0") ? "" : artezianWell += " and ACTIVITY_ID in (" + ARTWELLACT + ") ";

                ($("input[name*='ARTEZIAN_IRRIGATED_AREA_MIN']").val() == "") ? "" : artezianWell += "and IRRIGATED_AREA >=" + $("input[name*='ARTEZIAN_IRRIGATED_AREA_MIN']").val();
                ($("input[name*='ARTEZIAN_IRRIGATED_AREA_MAX']").val() == "") ? "" : artezianWell += "and IRRIGATED_AREA <=" + $("input[name*='ARTEZIAN_IRRIGATED_AREA_MAX']").val();

                var allARTWELLPRTYPEnput = $(".ARTWELLPRTYPE");
                var ARTWELLPRTYPE = checkboxlist(allARTWELLPRTYPEnput);
                (ARTWELLPRTYPE.length == 0 || ARTWELLPRTYPE[0] == "0") ? "" : artezianWell += " and PROPERTY_TYPE_ID in (" + ARTWELLPRTYPE + ") ";

                var allARTWELLSSInput = $(".ARTWELLSSI");
                var ARTWELLSSI = checkboxlist(allARTWELLSSInput);
                (ARTWELLSSI.length == 0 || ARTWELLSSI[0] == "0") ? "" : artezianWell += " and SSI_ID in (" + ARTWELLSSI + ") ";

                ($("input[name*='ARTEZIAN_Depth_MIN']").val() == "") ? "" : artezianWell += "and DEPTH >=" + $("input[name*='ARTEZIAN_Depth_MIN']").val();
                ($("input[name*='ARTEZIAN_Depth_MAX']").val() == "") ? "" : artezianWell += "and DEPTH <=" + $("input[name*='ARTEZIAN_Depth_MAX']").val();


                // quyular
                var well = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;

                var allWELLTYPEnput = $(".WELLTYPE");
                var WELLTYPE = checkboxlist(allWELLTYPEnput);
                (WELLTYPE.length == 0 || WELLTYPE[0] == "0") ? "" : well += " and WELL_TYPE_ID in (" + WELLTYPE + ") ";

                ($("input[name*='WELL_PRODUCTIVITY_MIN']").val() == "") ? "" : well += "and PRODUCTIVITY >=" + $("input[name*='WELL_PRODUCTIVITY_MIN']").val();
                ($("input[name*='WELL_PRODUCTIVITY_MAX']").val() == "") ? "" : well += "and PRODUCTIVITY <=" + $("input[name*='WELL_PRODUCTIVITY_MAX']").val();
                ($("select[name*='WELL_SIBS_ID']").val() == null) ? "" : well += "and SIBS_ID=" + $("select[name*='WELL_SIBS_ID']").val();
                ($("input[name*='WELL_EXPDATE_MIN']").val() == "") ? "" : well += "and EXPLONATION_DATE >=" + $("input[name*='WELL_EXPDATE_MIN']").val();
                ($("input[name*='WELL_EXPDATE_MAX']").val() == "") ? "" : well += "and EXPLONATION_DATE <=" + $("input[name*='WELL_EXPDATE_MAX']").val();

                var allWELLACTnput = $(".WELLACT");
                var WELLACT = checkboxlist(allWELLACTnput);
                (WELLACT.length == 0 || WELLACT[0] == "0") ? "" : well += " and ACTIVITY_ID in (" + WELLACT + ") ";


                ($("input[name*='WELL_IRRIGATED_AREA_MIN']").val() == "") ? "" : well += "and IRRIGATED_AREA >=" + $("input[name*='WELL_IRRIGATED_AREA_MIN']").val();
                ($("input[name*='WELL_IRRIGATED_AREA_MAX']").val() == "") ? "" : well += "and IRRIGATED_AREA <=" + $("input[name*='WELL_IRRIGATED_AREA_MAX']").val();

                var allWELLPRTYPEnput = $(".WELLPRTYPE");
                var WELLPRTYPE = checkboxlist(allWELLPRTYPEnput);
                (WELLPRTYPE.length == 0 || WELLPRTYPE[0] == "0") ? "" : well += " and PROPERTY_TYPE_ID in (" + WELLPRTYPE + ") ";

                var allWELLSSInput = $(".WELLSSI");
                var WELLSSI = checkboxlist(allWELLSSInput);
                (WELLSSI.length == 0 || WELLSSI[0] == "0") ? "" : well += " and SSI_ID in (" + WELLSSI + ") ";

                ($("input[name*='WELL_Depth_MIN']").val() == "") ? "" : well += "and DEPTH >=" + $("input[name*='WELL_Depth_MIN']").val();
                ($("input[name*='WELL_Depth_MAX']").val() == "") ? "" : well += "and DEPTH <=" + $("input[name*='WELL_Depth_MAX']").val();


                // nasos stansiyalari

                var Pums = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("select[name*='PUMPSTATION_PLACED_SOURCE_ID']").val() == null) ? "" : Pums += " and PLACED_SOURCE_ID=" + $("select[name*='PUMPSTATION_PLACED_SOURCE_ID']").val();
                ($("input[name*='PUMPSTATION_EXPLONATION_DATE_MIN']").val() == "") ? "" : Pums += " and EXPLONATION_DATE >=" + $("input[name*='PUMPSTATION_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='PUMPSTATION_EXPLONATION_DATE_MAX']").val() == "") ? "" : Pums += " and EXPLONATION_DATE <=" + $("input[name*='PUMPSTATION_EXPLONATION_DATE_MAX']").val();
                ($("input[name*='PUMPSTATION_SERVED_AREA_MIN']").val() == "") ? "" : Pums += " and SERVED_AREA >=" + $("input[name*='PUMPSTATION_SERVED_AREA_MIN']").val();
                ($("input[name*='PUMPSTATION_SERVED_AREA_MAX']").val() == "") ? "" : Pums += " and SERVED_AREA <=" + $("input[name*='PUMPSTATION_SERVED_AREA_MAX']").val();
                ($("select[name*='PUMPSTATION_PURPOSEFUL_ID']").val() == null) ? "" : Pums += " and PURPOSEFUL_ID=" + $("select[name*='PUMPSTATION_PURPOSEFUL_ID']").val();

                var allPUMPKINDnput = $(".PUMPKIND");
                var PUMPKIND = checkboxlist(allPUMPKINDnput);
                (PUMPKIND.length == 0 || PUMPKIND[0] == "0") ? "" : Pums += " and PUMP_KIND_ID in (" + PUMPKIND + ") ";

                var allPUMPTYPEnput = $(".PUMPTYPE");
                var PUMPTYPE = checkboxlist(allPUMPTYPEnput);
                (PUMPTYPE.length == 0 || PUMPTYPE[0] == "0") ? "" : Pums += " and PUMP_TYPE_ID in (" + PUMPTYPE + ") ";

                var allPUMPBRAGGnput = $(".PUMPBRAGG");
                var PUMPBRAGG = checkboxlist(allPUMPBRAGGnput);
                (PUMPBRAGG.length == 0 || PUMPBRAGG[0] == "0") ? "" : Pums += " and BRAND_OF_AGGREGATE_ID in (" + PUMPBRAGG + ") ";

                ($("input[name*='PUMPSTATION_AGREGATE_SUM_MIN']").val() == "") ? "" : Pums += " and AGREGATE_SUM >=" + $("input[name*='PUMPSTATION_AGREGATE_SUM_MIN']").val();
                ($("input[name*='PUMPSTATION_AGREGATE_SUM_MAX']").val() == "") ? "" : Pums += " and AGREGATE_SUM <=" + $("input[name*='PUMPSTATION_AGREGATE_SUM_MAX']").val();
                ($("input[name*='PUMPSTATION_POWER_MIN']").val() == "") ? "" : Pums += " and POWER >=" + $("input[name*='PUMPSTATION_POWER_MIN']").val();
                ($("input[name*='PUMPSTATION_POWER_MAX']").val() == "") ? "" : Pums += " and POWER <=" + $("input[name*='PUMPSTATION_POWER_MAX']").val();
                ($("input[name*='PUMPSTATION_PRODUCTIVITY_MIN']").val() == "") ? "" : Pums += " and PRODUCTIVITY >=" + $("input[name*='PUMPSTATION_PRODUCTIVITY_MIN']").val();
                ($("input[name*='PUMPSTATION_PRODUCTIVITY_MAX']").val() == "") ? "" : Pums += " and PRODUCTIVITY <=" + $("input[name*='PUMPSTATION_PRODUCTIVITY_MAX']").val();
                ($("input[name*='PUMPSTATION_PIPELINE_LENGTH_MIN']").val() == "") ? "" : Pums += " and PIPELINE_LENGHT >=" + $("input[name*='PUMPSTATION_PIPELINE_LENGTH_MIN']").val();
                ($("input[name*='PUMPSTATION_PIPELINE_LENGTH_MAX']").val() == "") ? "" : Pums += " and PIPELINE_LENGHT <=" + $("input[name*='PUMPSTATION_PIPELINE_LENGTH_MAX']").val();

                var allPUMPPIPnput = $(".PUMPPIP");
                var PUMPPIP = checkboxlist(allPUMPPIPnput);
                (PUMPPIP.length == 0 || PUMPPIP[0] == "0") ? "" : Pums += " and PIPELINE_MATERIAL_ID in (" + PUMPPIP + ") ";

                ($("input[name*='PUMPSTATION_PIPELINE_DIAMETER_MIN']").val() == "") ? "" : Pums += " and PIPELINE_DIAMETER_ID >=" + $("input[name*='PUMPSTATION_PIPELINE_DIAMETER_MIN']").val();
                ($("input[name*='PUMPSTATION_PIPELINE_DIAMETER_MAX']").val() == "") ? "" : Pums += " and PIPELINE_DIAMETER_ID <=" + $("input[name*='PUMPSTATION_PIPELINE_DIAMETER_MAX']").val();

                // qis otlaqlari
                var winterpasture = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("input[name*='WINTERPASTURES_SERVED_AREA_MIN']").val() == "") ? "" : winterpasture += " and SERVED_AREA >=" + $("input[name*='WINTERPASTURES_SERVED_AREA_MIN']").val();
                ($("input[name*='WINTERPASTURES_SERVED_AREA_MAX']").val() == "") ? "" : winterpasture += " and SERVED_AREA <=" + $("input[name*='WINTERPASTURES_SERVED_AREA_MAX']").val();
                ($("input[name*='WINTERPASTURES_DEVICE_SUM_MIN']").val() == "") ? "" : winterpasture += " and DEVICE_SUM >=" + $("input[name*='WINTERPASTURES_DEVICE_SUM_MIN']").val();
                ($("input[name*='WINTERPASTURES_DEVICE_SUM_MAX']").val() == "") ? "" : winterpasture += " and DEVICE_SUM <=" + $("input[name*='WINTERPASTURES_DEVICE_SUM_MAX']").val();
                ($("input[name*='WINTERPASTURES_WATER_PIPE_MIN']").val() == "") ? "" : winterpasture += " and WATER_PIPE >=" + $("input[name*='WINTERPASTURES_WATER_PIPE_MIN']").val();
                ($("input[name*='WINTERPASTURES_WATER_PIPE_MAX']").val() == "") ? "" : winterpasture += " and WATER_PIPE <=" + $("input[name*='WINTERPASTURES_WATER_PIPE_MAX']").val();

                // muhafize bendleri
                var riverbands = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("input[name*='RIVERBAND_EXPLONATION_DATE_MIN']").val() == "") ? "" : riverbands += " and EXPLONATION_DATE >=" + $("input[name*='RIVERBAND_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='RIVERBAND_EXPLONATION_DATE_MAX']").val() == "") ? "" : riverbands += " and EXPLONATION_DATE <=" + $("input[name*='RIVERBAND_EXPLONATION_DATE_MAX']").val();

                var allRIVERBANDTECnput = $(".RIVERBANDTEC");
                var RIVERBANDTEC = checkboxlist(allRIVERBANDTECnput);
                (RIVERBANDTEC.length == 0 || RIVERBANDTEC[0] == "0") ? "" : riverbands += " and TECHNICAL_TYPE_ID in (" + RIVERBANDTEC + ") ";

                var allRIVERBANDASNGnput = $(".RIVERBANDASNG");
                var RIVERBANDASNG = checkboxlist(allRIVERBANDASNGnput);
                (RIVERBANDASNG.length == 0 || RIVERBANDASNG[0] == "0") ? "" : riverbands += " and ASSIGMENT_ID in (" + RIVERBANDASNG + ") ";

                ($("input[name*='RIVERBAND_LENGTH_MIN']").val() == "") ? "" : riverbands += " and LENGTH >=" + $("input[name*='RIVERBAND_LENGTH_MIN']").val();
                ($("input[name*='RIVERBAND_LENGTH_MAX']").val() == "") ? "" : riverbands += " and LENGTH <=" + $("input[name*='RIVERBAND_LENGTH_MAX']").val();

                var allRIVERBANDCOVERnput = $(".RIVERBANDCOVER");
                var RIVERBANDCOVER = checkboxlist(allRIVERBANDCOVERnput);
                (RIVERBANDCOVER.length == 0 || RIVERBANDCOVER[0] == "0") ? "" : riverbands += " and COVER_TYPE_ID in (" + RIVERBANDCOVER + ") ";

                var allRIVERBANDPRTYPEnput = $(".RIVERBANDPRTYPE");
                var RIVERBANDPRTYPE = checkboxlist(allRIVERBANDPRTYPEnput);
                (RIVERBANDPRTYPE.length == 0 || RIVERBANDPRTYPE[0] == "0") ? "" : riverbands += " and PROPERTY_TYPE_ID in (" + RIVERBANDPRTYPE + ") ";

                var allRIVERBANDSSInput = $(".RIVERBANDSSI");
                var RIVERBANDSSI = checkboxlist(allRIVERBANDSSInput);
                (RIVERBANDSSI.length == 0 || RIVERBANDSSI[0] == "0") ? "" : riverbands += " and SSI_ID in (" + RIVERBANDSSI + ") ";

                // binalar
                var build = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("input[name*='BUILDINGS_EXPLONATION_DATE_MIN']").val() == "") ? "" : build += " and EXPLONATIO >=" + $("input[name*='BUILDINGS_EXPLONATION_DATE_MIN']").val();
                ($("input[name*='BUILDINGS_EXPLONATION_DATE_MAX']").val() == "") ? "" : build += " and EXPLONATIO <=" + $("input[name*='BUILDINGS_EXPLONATION_DATE_MAX']").val();

                var allBUILDACTnput = $(".BUILDACT");
                var BUILDACT = checkboxlist(allBUILDACTnput);
                (BUILDACT.length == 0 || BUILDACT[0] == "0") ? "" : build += " and ACTIVITY_ID in (" + BUILDACT + ") ";

                var allBULIDASNGnput = $(".BULIDASNG");
                var BULIDASNG = checkboxlist(allBULIDASNGnput);
                (BULIDASNG.length == 0 || BULIDASNG[0] == "0") ? "" : build += " and ASSIGMENT_ID in (" + BULIDASNG + ") ";

                ($("select[name*='BUILDINGS_PROTECTING']").val() == null) ? "" : build += " and PROTECTING =" + $("select[name*='BUILDINGS_PROTECTING']").val();
                ($("input[name*='BUILDINGS_TOTAL_AREA_MIN']").val() == "") ? "" : build += " and TOTAL_AREA >=" + $("input[name*='BUILDINGS_TOTAL_AREA_MIN']").val();
                ($("input[name*='BUILDINGS_TOTAL_AREA_MAX']").val() == "") ? "" : build += " and TOTAL_AREA <=" + $("input[name*='BUILDINGS_TOTAL_AREA_MAX']").val();
                ($("select[name*='BUILDINGS_USING_MODE']").val() == null) ? "" : build += " and USING_MODE =" + $("select[name*='BUILDINGS_USING_MODE']").val();

                var allBUILDPRTYPEnput = $(".BUILDPRTYPE");
                var BUILDPRTYPE = checkboxlist(allBUILDPRTYPEnput);
                (BUILDPRTYPE.length == 0 || BUILDPRTYPE[0] == "0") ? "" : build += " and PROPERTY_TYPE_ID in (" + BUILDPRTYPE + ") ";

                var allBUILDSSInput = $(".BUILDSSI");
                var BUILDSSI = checkboxlist(allBUILDSSInput);
                (BUILDSSI.length == 0 || BUILDSSI[0] == "0") ? "" : build += " and SSI_ID in (" + BUILDSSI + ") ";


                // istismar yollari
                var EXPROAD = "1 = 1 and " + regionalquery + " and " + SSIandSibsquery;
                ($("input[name*='EXPLONATION_ROAD_MIN']").val() == "") ? "" : EXPROAD += " and LENGHT >=" + $("input[name*='EXPLONATION_ROAD_MIN']").val();
                ($("input[name*='EXPLONATION_ROAD_MAX']").val() == "") ? "" : EXPROAD += " and LENGHT <=" + $("input[name*='EXPLONATION_ROAD_MAX']").val();
                ($("select[name*='EXPLONATION_ROAD_TYPE']").val() == null) ? "" : EXPROAD += " and COVER_TYPE_ID =" + $("select[name*='EXPLONATION_ROAD_TYPE']").val();


                var FILCHECK = {
                    CHANNEL: {
                        CH: ($("#CH").is(":checked")) ? true : false,
                        CHANNELFILDS: {
                            CHM: ($("#CHM").is(":checked")) ? true : false,
                            CHI: ($("#CHI").is(":checked")) ? true : false,
                            CHII: ($("#CHII").is(":checked")) ? true : false,
                            CHIII: ($("#CHIII").is(":checked")) ? true : false
                        }
                    },
                    QCHANNEL: {
                        QCH: ($("#QCH").is(":checked")) ? true : false,
                        QCHANNELFILDS: {
                            QCHM: ($("#QCHM").is(":checked")) ? true : false,
                            QCHI: ($("#QCHI").is(":checked")) ? true : false,
                            QCHII: ($("#QCHII").is(":checked")) ? true : false,
                            QCHIII: ($("#QCHIII").is(":checked")) ? true : false
                        }
                    },
                    DRENAJ: {
                        DREN: ($("#DRENAJ").is(":checked")) ? true : false,
                        DRENAJFILDS: {
                            DRENAJM: ($("#DRENAJ-M").is(":checked")) ? true : false,
                            DRENAJI: ($("#DRENAJ-I").is(":checked")) ? true : false,
                            DRENAJII: ($("#DRENAJ-II").is(":checked")) ? true : false,
                            DRENAJK: ($("#DRENAJ-K").is(":checked")) ? true : false
                        }
                    },
                    DEVICE: ($("#DEVICE").is(":checked")) ? true : false,
                    ARTEZIANWELL: ($("#ARTEZIAN_WELL").is(":checked")) ? true : false,
                    WELL: ($("#WELL").is(":checked")) ? true : false,
                    PUMPSTATION: ($("#PUMPSTATION").is(":checked")) ? true : false,
                    WINTERPASTURES: ($("#WINTERPASTURES").is(":checked")) ? true : false,
                    RIVERBAND: ($("#RIVERBAND").is(":checked")) ? true : false,
                    BUILDINGS: ($("#BUILDINGS").is(":checked")) ? true : false,
                    EXPLONATION_ROAD: ($("#EXPLONATION_ROAD").is(":checked")) ? true : false,
                    DEPOREZERVUAR: ($("#DEPOREZERVUAR").is(":checked")) ? true : false,
                    RIVERS: ($("#RIVERS").is(":checked")) ? true : false


                }


                if (keyword == "map") {//xeritede gosterilme bolmesi

                    // Aciq suvarma sebekesi 					
                    channelQuery = "1 < 1";

                    if (FILCHECK.CHANNEL.CH == true) {

                        if ((FILCHECK.CHANNEL.CHANNELFILDS.CHM == false && FILCHECK.CHANNEL.CHANNELFILDS.CHI == false && FILCHECK.CHANNEL.CHANNELFILDS.CHII == false && FILCHECK.CHANNEL.CHANNELFILDS.CHIII == false)) {
                            ////console.log(channelQuery);
                            // layerChannel.setDefinitionExpression("KIND_ID = 1 and " + magistralChannel );
                            channelQuery = "(KIND_ID = 1 and " + magistralChannel + ")";

                        }

                        if (FILCHECK.CHANNEL.CHANNELFILDS.CHM == true) {
                            //layerChannel.setDefinitionExpression("KIND_ID = 1 and TYPE_ID=4 and " + magistralChannel);
                            channelQuery = channelQuery + " OR " + "(KIND_ID = 1 and TYPE_ID=4 and " + magistralChannel + ")";
                            ////console.log(channelQuery);
                        }

                        if (FILCHECK.CHANNEL.CHANNELFILDS.CHI == true) {
                            //layerChannel.setDefinitionExpression("KIND_ID = 1 and (TYPE_ID=1 or TYPE_ID=4) and (" + ICHANNEL + " or " + magistralChannel + ")");
                            channelQuery = channelQuery + " OR " + "(KIND_ID = 1 and TYPE_ID=1 and " + ICHANNEL + ")";
                            ////console.log(channelQuery);
                        }

                        if (FILCHECK.CHANNEL.CHANNELFILDS.CHII == true) {
                            //layerChannel.setDefinitionExpression("KIND_ID = 1 and TYPE_ID=2 and " + IICHANNEL);                        
                            channelQuery = channelQuery + " OR " + "(KIND_ID = 1 and TYPE_ID=2 and " + IICHANNEL + ")";
                            ////console.log(channelQuery);
                        }

                        if (FILCHECK.CHANNEL.CHANNELFILDS.CHIII == true) {
                            //layerChannel.setDefinitionExpression("KIND_ID = 1 and TYPE_ID=3 and " + IIICHANNEL);
                            channelQuery = channelQuery + " OR " + "(KIND_ID = 1 and TYPE_ID=3 and " + IIICHANNEL + ")";
                            ////console.log(channelQuery);
                        };

                        layerChannel.visible = true;
                        layerChannel.setDefinitionExpression(channelQuery);
                        map.addLayer(layerChannel);
                    }

                    // Qapali suvarma sebekesi
                    QchannelQuery = channelQuery;

                    if (FILCHECK.QCHANNEL.QCH == true) {

                        if ((FILCHECK.QCHANNEL.QCHANNELFILDS.QCHM == false && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHI == false && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHII == false && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHIII == false)) {

                            QchannelQuery = QchannelQuery + " OR " + "(KIND_ID = 2 and " + magistralChannel + ")";
                        }

                        if (FILCHECK.QCHANNEL.QCH == true && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHM == true) {

                            QchannelQuery = QchannelQuery + " OR " + "(KIND_ID = 2 and TYPE_ID=4 and " + QmagistralChannel + ")";
                        }

                        if (FILCHECK.QCHANNEL.QCH == true && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHI == true) {

                            QchannelQuery = QchannelQuery + " OR " + "(KIND_ID = 2 and TYPE_ID = 1 and " + QICHANNEL + ")";
                        }

                        if (FILCHECK.QCHANNEL.QCH == true && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHII == true) {

                            QchannelQuery = QchannelQuery + " OR " + "(KIND_ID = 2 and TYPE_ID = 2 and " + QIICHANNEL + ")";
                        }

                        if (FILCHECK.QCHANNEL.QCH == true && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHIII == true) {
                            ////console.log("III close channels")

                            QchannelQuery = QchannelQuery + " OR " + "(KIND_ID = 2 and TYPE_ID = 3 and " + QIIICHANNEL + ")";
                        }
                        layerChannel.visible = true;
                        layerChannel.setDefinitionExpression(QchannelQuery);
                        map.addLayer(layerChannel);
                    }

                    if ((FILCHECK.CHANNEL.CH == true && (FILCHECK.CHANNEL.CHANNELFILDS.CHM == false && FILCHECK.CHANNEL.CHANNELFILDS.CHI == false && FILCHECK.CHANNEL.CHANNELFILDS.CHII == false && FILCHECK.CHANNEL.CHANNELFILDS.CHII == false)) && (FILCHECK.QCHANNEL.QCH == true && (FILCHECK.QCHANNEL.QCHANNELFILDS.QCHM == false && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHI == false && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHII == false && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHIII == false))) {

                        layerChannel.visible = true;
                        layerChannel.setDefinitionExpression("1 = 1 and " + magistralChannel);
                        map.addLayer(layerChannel);
                    }

                    //Drenajlar
                    drenajQuery = "1 > 1"
                    if (FILCHECK.DRENAJ.DREN == true) {

                        if ((FILCHECK.DRENAJ.DRENAJFILDS.DRENAJM == false && FILCHECK.DRENAJ.DRENAJFILDS.DRENAJI == false && FILCHECK.DRENAJ.DRENAJFILDS.DRENAJII == false && FILCHECK.DRENAJ.DRENAJFILDS.DRENAJK == false)) {

                            drenajQuery = drenajQuery + " OR (" + regionalquery + ")";

                        }

                        if (FILCHECK.DRENAJ.DRENAJFILDS.DRENAJM == true) {

                            drenajQuery = drenajQuery + " OR " + "(CHANNEL_TYPE_ID =4 and " + DRENAJM + ")";
                            //console.log(drenajQuery);
                        }

                        if (FILCHECK.DRENAJ.DRENAJFILDS.DRENAJI == true) {
                            drenajQuery = drenajQuery + " OR " + "(CHANNEL_TYPE_ID =1 and " + DRENAJI + ")";
                            //console.log(drenajQuery);
                        }

                        if (FILCHECK.DRENAJ.DRENAJFILDS.DRENAJII == true) {
                            drenajQuery = drenajQuery + " OR " + "(CHANNEL_TYPE_ID =2 and " + DRENAJII + ")";
                            //console.log(drenajQuery);
                        }

                        if (FILCHECK.DRENAJ.DRENAJFILDS.DRENAJK == true) {
                            drenajQuery = drenajQuery + " OR " + "(CHANNEL_TYPE_ID =3 and " + DRENAJK + ")";
                            //console.log(drenajQuery);
                        }
                        layerDrenaj.visible = true;
                        layerDrenaj.setDefinitionExpression(drenajQuery);
                        map.addLayer(layerDrenaj);
                    }

                    if (FILCHECK.DEVICE) {
                        console.log(deviceMap)
                        layerDevice.visible = true;
                        layerDevice.setDefinitionExpression(deviceMap);
                        map.addLayer(layerDevice);
                    }

                    if (FILCHECK.ARTEZIANWELL) {
                        layerArtesian.visible = true;
                        layerArtesian.setDefinitionExpression(artezianWell);
                        map.addLayer(layerArtesian);
                    }

                    if (FILCHECK.WELL) {
                        layerWell.visible = true;
                        layerWell.setDefinitionExpression(well);
                        map.addLayer(layerWell);
                    }

                    if (FILCHECK.PUMPSTATION) {
                        layerPump.visible = true;
                        layerPump.setDefinitionExpression(Pums);
                        map.addLayer(layerPump);
                    }

                    if (FILCHECK.WINTERPASTURES) {
                        layerPastures.visible = true;
                        layerPastures.setDefinitionExpression(winterpasture);
                        map.addLayer(layerPastures);
                    }

                    if (FILCHECK.RIVERBAND) {
                        layerRiverBand.visible = true;
                        layerRiverBand.setDefinitionExpression(riverbands);
                        map.addLayer(layerRiverBand);
                    }

                    if (FILCHECK.BUILDINGS) {
                        layerBuilding.visible = true;
                        layerBuilding.setDefinitionExpression(build);
                        map.addLayer(layerBuilding);
                    }

                    if (FILCHECK.EXPLONATION_ROAD) {
                        layerRoad.visible = true;
                        layerRoad.setDefinitionExpression(EXPROAD);
                        map.addLayer(layerRoad);
                    }

                    if (FILCHECK.DEPOREZERVUAR) {
                        layerReservior.visible = true;
                        //layerRoad.setDefinitionExpression(EXPROAD);
                        map.addLayer(layerReservior);
                    }

                    if (FILCHECK.RIVERS) {
                        layerRivers.visible = true;
                        //layerRoad.setDefinitionExpression(EXPROAD);
                        map.addLayer(layerRivers);
                    }

                }
                else {//db gore filterleme bolmesi
                    //////console.log(regionalquery)
                    var Filter = {
                        OCH: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//regionalquery,
                        OCHM: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//magistralChannel,
                        OCHI: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//ICHANNEL,
                        OCHII: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//IICHANNEL,
                        OCHIII: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//IIICHANNEL,
                        QCH: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//regionalquery,
                        QCHM: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//QmagistralChannel,
                        QCHI: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//QICHANNEL,
                        QCHII: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//QIICHANNEL,
                        QCHIII: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//QIIICHANNEL,
                        DRENAJ: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//regionalquery,
                        DRENAJM: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//DRENAJM,
                        DRENAJI: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//DRENAJI,
                        DRENAJII: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//DRENAJII,
                        DRENAJK: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//DRENAJK,
                        DEVICE: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,//device,
                        ARTEZIANWELL: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,// artezianWell,
                        WELL: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery,// well,
                        PUMPSTATION: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery, // Pums,
                        WINTERPASTURES: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery, //winterpasture,
                        RIVERBAND: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery, //riverbands,
                        BUILDINGS: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery, //build,
                        EXPLONATION_ROAD: "1 = 1 and " + regionalquery + " and " + SSIandSibsquery //EXPROAD
                    }

                    //Clear Filer modal
                    $("#_FilterResult tbody tr").remove();


                    $.ajax({
                        url: "/Home/Filter",
                        data: { FILCHECK: FILCHECK, FILTER: Filter },
                        method: "post",
                        type: "JSON",
                        success: function (response) {
                            ////console.log(response)
                            if (response != null) {
                                if (response.CH_CHECK) {
                                    FilterAppent(response.CH_Count, response.CH_Lenght, response.CH_ServedArea, response.CH_WATERCAPABILITY, response.CH_DEVICESUM, response.CH_WITDH, "Açıq suvarma şəbəkəsi", "ACH");
                                    CreateLocalStorage("ACH", response.CH_ID);
                                }
                                if (response.CHM_CHECK) {
                                    FilterAppent(response.CHM_Count, response.CHM_Lenght, response.CHM_ServedArea, response.CHM_WATERCAPABILITY, response.CHM_DEVICESUM, response.CHM_WITDH, "Açıq suvarma şəbəkəsi: Magistral kanallar", "ACHM");
                                    CreateLocalStorage("ACHM", response.CHM_ID);
                                }
                                if (response.CHI_CHECK) {
                                    FilterAppent(response.CHI_Count, response.CHI_Lenght, response.CHI_ServedArea, response.CHI_WATERCAPABILITY, response.CHI_DEVICESUM, response.CHI_WITDH, "Açıq suvarma şəbəkəsi: I dərəcəli kanallar", "ACHI");
                                    CreateLocalStorage("ACHI", response.CHI_ID);
                                }
                                if (response.CHII_CHECK) {
                                    FilterAppent(response.CHII_Count, response.CHII_Lenght, response.CHII_ServedArea, response.CHII_WATERCAPABILITY, response.CHII_DEVICESUM, response.CHII_WITDH, "Açıq suvarma şəbəkəsi: II dərəcəli kanallar", "ACHII");
                                    CreateLocalStorage("ACHII", response.CHII_ID);
                                }
                                if (response.CHIII_CHECK) {
                                    FilterAppent(response.CHIII_Count, response.CHIII_Lenght, response.CHIII_ServedArea, response.CHIII_WATERCAPABILITY, response.CHIII_DEVICESUM, response.CHIII_WITDH, "Açıq suvarma şəbəkəsi: III dərəcəli kanallar", "ACHIII");
                                    CreateLocalStorage("ACHIII", response.CHIII_ID);
                                }
                                if (response.QCH_CHECK) {
                                    FilterAppent(response.QCH_Count, response.QCH_Lenght, response.QCH_ServedArea, response.QCH_WATERCAPABILITY, response.QCH_DEVICESUM, response.QCH_WITDH, "Qapalı suvarma şəbəkəsi", "QCH")
                                    CreateLocalStorage("QCH", response.QCH_ID);
                                }
                                if (response.QCHM_CHECK) {
                                    FilterAppent(response.QCHM_Count, response.QCHM_Lenght, response.QCHM_ServedArea, response.QCHM_WATERCAPABILITY, response.QCHM_DEVICESUM, response.QCHM_WITDH, "Qapalı suvarma şəbəkəsi: Magistral kanallar", "QCHM")
                                    CreateLocalStorage("QCHM", response.QCHM_ID);
                                }
                                if (response.QCHI_CHECK) {
                                    FilterAppent(response.QCHI_Count, response.QCHI_Lenght, response.QCHI_ServedArea, response.QCHI_WATERCAPABILITY, response.QCHI_DEVICESUM, response.QCHI_WITDH, "Qapalı suvarma şəbəkəsi: I dərəcəli kanallar", "QCHI")
                                    CreateLocalStorage("QCHI", response.QCHI_ID);
                                }
                                if (response.QCHII_CHECK) {
                                    FilterAppent(response.QCHII_Count, response.QCHII_Lenght, response.QCHII_ServedArea, response.QCHII_WATERCAPABILITY, response.QCHII_DEVICESUM, response.QCHII_WITDH, "Qapalı suvarma şəbəkəsi: II dərəcəli kanallar", "QCHII")
                                    CreateLocalStorage("QCHII", response.QCHII_ID);
                                }
                                if (response.QCHIII_CHECK) {
                                    FilterAppent(response.QCHIII_Count, response.QCHIII_Lenght, response.QCHIII_ServedArea, response.QCHIII_WATERCAPABILITY, response.QCHIII_DEVICESUM, response.QCHIII_WITDH, "Qapalı suvarma şəbəkəsi: III dərəcəli kanallar", "QCHIII")
                                    CreateLocalStorage("QCHIII", response.QCHIII_ID);
                                }
                                if (response.DRENAJ_CHECK) {
                                    FilterAppent(response.DRENAJ_Count, response.DRENAJ_Lenght, response.DRENAJ_ServedArea, response.DRENAJ_WATERCAPABILITY, response.DRENAJ_DEVICESUM, response.DRENAJ_WITDH, "Kollektor-drenaj şəbəkəsi", "DR")
                                    CreateLocalStorage("DR", response.DRENAJ_ID);
                                }
                                if (response.DRENAJM_CHECK) {
                                    FilterAppent(response.DRENAJM_Count, response.DRENAJM_Lenght, response.DRENAJM_ServedArea, response.DRENAJM_WATERCAPABILITY, response.DRENAJM_DEVICESUM, response.DRENAJM_WITDH, "Kollektor-drenaj şəbəkəsi: Magistral kollektorlar", "MDR")
                                    CreateLocalStorage("MDR", response.DRENAJM_ID);
                                }
                                if (response.DRENAJK_CHECK) {
                                    FilterAppent(response.DRENAJK_Count, response.DRENAJK_Lenght, response.DRENAJK_ServedArea, response.DRENAJK_WATERCAPABILITY, response.DRENAJK_DEVICESUM, response.DRENAJK_WITDH, "Kollektor-drenaj şəbəkəsi: İlkin drenlər", "KDR")
                                    CreateLocalStorage("KDR", response.DRENAJK_ID);
                                }
                                if (response.DRENAJI_CHECK) {
                                    FilterAppent(response.DRENAJI_Count, response.DRENAJI_Lenght, response.DRENAJI_ServedArea, response.DRENAJI_WATERCAPABILITY, response.DRENAJI_DEVICESUM, response.DRENAJI_WITDH, "Kollektor-drenaj şəbəkəsi: I dərəcəli kollektorlar", "IDR")
                                    CreateLocalStorage("IDR", response.DRENAJI_ID);
                                }
                                if (response.DRENAJII_CHECK) {
                                    FilterAppent(response.DRENAJII_Count, response.DRENAJII_Lenght, response.DRENAJII_ServedArea, response.DRENAJII_WATERCAPABILITY, response.DRENAJII_DEVICESUM, response.DRENAJII_WITDH, "Kollektor-drenaj şəbəkəsi: II dərəcəli kollektorlar", "IIDR")
                                    CreateLocalStorage("IIDR", response.DRENAJII_ID);
                                }
                                if (response.DEVICE_CHECK) {
                                    FilterAppent(response.DEVICE_count, response.DEVICE_lenght, response.DEVICE_ServedArea, response.DEVICE_WATERCAPABILITY, response.DEVICE_DEVICESUM, response.DEVICE_WITDH, "Hidrotexniki qurğular", "DEV")
                                    CreateLocalStorage("DEV", response.DEVICE_ID);
                                }
                                if (response.ARTEZIAN_CHECK) {
                                    FilterAppent(response.ARTEZIAN_COUNT, response.ARTEZIAN_lenght, response.ARTEZIAN_ServedArea, response.ARTEZIAN_WATERCAPABILITY, response.ARTEZIAN_DEVICESUM, response.ARTEZIAN_WITDH, "Artezian-Subartezian quyular", "ART")
                                    CreateLocalStorage("ART", response.ARTEZIAN_ID);
                                }
                                if (response.WELL_CHECK) {
                                    FilterAppent(response.WELL_Count, response.WELL_lenght, response.WELL_ServedArea, response.WELL_WATERCAPABILITY, response.WELL_DEVICESUM, response.WELL_WITDH, "Quyular", "WLL")
                                    CreateLocalStorage("WLL", response.WELL_ID);
                                }
                                if (response.PUMPSTATION_CHECK) {
                                    FilterAppent(response.PUMPSTATION_Count, response.PUMPSTATION_lenght, response.PUMPSTATION_ServedArea, response.PUMPSTATION_WATERCAPABILITY, response.PUMPSTATION_DEVICESUM, response.PUMPSTATION_WITDH, "Nasos stansiyaları", "PMB")
                                    CreateLocalStorage("PMB", response.PUMPSTATION_ID);
                                }
                                if (response.WINTERPASTURES_CHECK) {
                                    FilterAppent(response.WINTERPASTURES_count, response.WINTERPASTURES_length, response.WINTERPASTURES_ServedArea, response.WINTERPASTURES_WATERCAPABILITY, response.WINTERPASTURES_DEVICESUM, response.WINTERPASTURES_WITDH, "Qış otlaqlarının su təminatı sistemləri", "WTP")
                                    CreateLocalStorage("WTP", response.WINTERPASTURES_ID);
                                }
                                if (response.RIVERBAND_CHECK) {
                                    FilterAppent(response.RIVERBAND_count, response.RIVERBAND_lenght, response.RIVERBAND_ServedArea, response.RIVERBAND_WATERCAPABILITY, response.RIVERBAND_DEVICESUM, response.RIVERBAND_WITDH, "Mühafizə bəndləri", "RVB")
                                    CreateLocalStorage("RVB", response.RIVERBAND_ID);
                                }
                                if (response.BUILDINGS_CHECK) {
                                    FilterAppent(response.BUILDINGS_count, response.BUILDINGS_lenght, response.BUILDINGS_ServedArea, response.BUILDINGS_WATERCAPABILITY, response.BUILDINGS_DEVICESUM, response.BUILDINGS_WITDH, "Binalar və tikililər", "BLD")
                                    CreateLocalStorage("BLD", response.BUILDINGS_ID);
                                }
                                if (response.EXPLONATION_ROAD_CHECK) {
                                    FilterAppent(response.EXPLONATION_ROAD_count, response.EXPLONATION_ROAD_lenght, response.EXPLONATION_ROAD_ServedArea, response.EXPLONATION_ROAD_WATERCAPABILITY, response.EXPLONATION_ROAD_DEVICESUM, response.EXPLONATION_ROAD_WITDH, "İstismar yolları", "EXP")
                                    CreateLocalStorage("EXP", response.EXPLONATION_ROAD_ID);
                                }
                            }
                        }
                    })
                }
            }
        });
}


//Filter result append function
//function FilterAppent(count, lenght, area, capability, devsum, witdh, name, attrname) {
//    $("#_FilterResult tbody").append("<tr> <td>" + name + "</td> <td>" + count + "</td> <td>" + lenght + "</td> <td>" + witdh + "</td> <td>" + area + "</td> <td>" + capability + "</td> <td>" + devsum + "</td>   <td class='text-center'><button class='_DetalsReport br-100'   data-name='" + attrname + "' data-skip='0'><i aria-hidden='true' class='icon-info-circle-thin mb-30' ></i></button></td> </tr>")
//}

function FilterAppent(count, lenght, area, capability, devsum, witdh, name, attrname) {
    $("#_FilterResult tbody").append("<tr> <td>" + name + "</td> <td>" + count + "</td> <td>" + lenght + "</td> <td>" + area + "</td> <td>" + devsum + "</td>   <td class='text-center'><button class='_DetalsReport br-100'   data-name='" + attrname + "' data-skip='0'><i aria-hidden='true' class='icon-info-circle-thin mb-30' ></i></button></td> </tr>")
}

function CreateLocalStorage(key, value) {
    //localStorage.setItem(key, value);
    localStorage.setItem(key, JSON.stringify(value));
}

$("._closeReport").on("click", function () {
    localStorage.clear();
})

//Request
$(document).on("click", "._DetalsReport", function () {
    $("#_FilterResultDetails").html("");
    var attrname = $(this).attr("data-name");
    var Idlist = JSON.parse(localStorage.getItem(attrname));

    $.ajax({
        url: "/Home/DetalsFilter",
        data: { list: Idlist, dataname: attrname, page: $(this).data("skip") },
        method: "post",
        type: "JSON",
        beforeSend: function () {
            $("#loading_result_details").css("display", "block");
            $("#_FilterResultDetails").css("display", "none");
        },
        success: function (response) {
            ////console.log(response);
            $("#_FilterResultDetails").append(response);
        },
        complete: function () {
            $("#loading_result_details").css("display", "none");
            $("#_FilterResultDetails").css("display", "block");
        }
    })
    $("#DetailsButton").click();
})

$(document).on("click", "._closeReportDetais", function () {
    $("#_FilterResultDetails").html("");
})


//map function
MapFunction();

var def = "";
$("#search-input").bind("keyup focusin", function () {
    if (def != $(this).val() && $(this).val().length >= 3) {
        $.ajax({
            url: "/Home/Search",
            data: { name: $(this).val() },
            method: "post",
            type: "JSON",
            success: function (response) {
                ////console.log(response)
                if (response != null && response.length != 0) {
                    $("#_searchContect div").remove();
                    $("#_searchContect").append("<div class='filter-list' role='group' aria-hidden='true'>  <ul id='_searchResult' class='type-none m-0 p-0' role='listbox' aria-hidden='true'></ul>    </div>");
                    for (var i = 0; i < response.length; i++) {
                        $("#_searchResult").append("<li role='listitem' class='pt-7 pb-7 pl-15 pr-15 pointer _searchdata' data-name='" + response[i].NAME + "' data-tname='" + response[i].TABLENAME + "'> <span class='line-camp line-1'> <i aria-hidden='true' class='icon-map-pin mr-10'></i> <span>" + response[i].NAME + "</span> </span> </li>")
                    }
                }
                else {
                    $("#_searchContect div").remove();
                    $("#_searchContect").append("<div class='empty-result text-center text-gray pt-40 pb-40 border-top' role='presentation' aria-hidden='true'> <p class='h1'><i aria-hidden='true' class='fa fa-search'></i></p><span>Uyğun nəticə tapılmadı</span> </div>")
                }

            }
        })
    }
    if ($(this).val().length < 3) {
        $("#_searchContect div").remove();
    }
    def = $(this).val()
})

$(document).on("click", "._searchdata", function () {
    var tname = $(this).attr("data-tname")
    var name = $(this).attr("data-name")
    $("#search-input").val(name);
    $("#search-input").attr("data-tname", tname);
    $("#_searchContect div").remove();
    $("#_testSearch").click();
})


$(document).on("click", "#_GetCamera", function () {
    $.ajax({
        url: "/Home/ArtRealData",
        method: "post",
        type: "JSON",
        success: function (response) {
            console.log(response);
            if (response != null) {
                $("#_ArtezianResult tbody").append("<tr> <td>" + response.light[0] + "</td> <td>" + response.water[0] + "</td> </tr>")
            }


            var canvas = document.getElementById('videoCanvas');
            var ws = new WebSocket("ws://10.10.1.81:9001")
            var player = new jsmpeg(ws, { canvas: canvas, autoplay: true, audio: false, loop: true });
            
        }
    })
})

$("._closeArtezianCamera").on("click", function () {
    $("#_ArtezianResult tbody tr").remove();
})


$(document).on("click", 'image', function () {

    let btn = $('<button data-target-modal="Camera-arezian" type="button" id="_GetCamera" class="btn xs bg-green">Ətraflı bax</button>')
    $('.actionList').find('.btn').remove();

    $('.actionList').append(btn)
})






