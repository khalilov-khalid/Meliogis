﻿
var Latitude = 49.465965;
var Longitude = 40.437018;
var zoommap = 7;
var map;



function MapFunction() {
require([
    "esri/map",
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
    function (Map, Search, Scalebar, InfoTemplate, ArcGISDynamicMapServiceLayer, BasemapToggle, ImageParameters, Measurement, FeatureLayer, SimpleFillSymbol,
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
                    fieldName: "ASSIGMENT",
                    visible: true,
                    label: "Təyinatı"
                },
                {
                    fieldName: "EXPLONATION_DATE",
                    visible: true,
                    label: "İstismara verildiyi tarix (il)"
                },
                {
                    fieldName: "SIBS",
                    visible: true,
                    label: "Xidmət etdiyi SİB-lərin adı"
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
                },
                {
                    fieldName: "DEVICE_SUM",
                    visible: true,
                    label: "Üzərindəki qurğuların sayı (ədəd)"
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
                    fieldName: "PASSING_AREAS",
                    visible: true,
                    label: "Yerləşdiyi Ərazi"
                },
                {
                    fieldName: "RECIVER",
                    visible: true,
                    label: "Drenaj Sularının Qəbuledicisi"
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
                    fieldName: "PASSING_AREAS",
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
                    fieldName: "REGION",
                    visible: true,
                    label: "Yerləşdiyi yer"
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
                    fieldName: "LOCATION",
                    visible: true,
                    label: "Yerləşdiyi Ərazi"
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
                    fieldName: "NAME",
                    visible: true,
                    label: "Adı"
                },
                {
                    fieldName: "LOCATED_NETWORK",
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
                    fieldName: "TECHNICAL_CONDITION",
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
                    fieldName: "PLACED_AREA",
                    visible: true,
                    label: "Yerləşdiyi Ərazi"
                },
                {
                    fieldName: "PLACED_SOURCE",
                    visible: true,
                    label: "Yerləşdiyi Mənbə"
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
                    fieldName: "BRAND_OFF_AGGREGATE",
                    visible: true,
                    label: "Aqreqatların markası"
                },
                {
                    fieldName: "AGREGAT_SUM",
                    visible: true,
                    label: "Aqreqatların sayı (ədəd)"
                },
                {
                    fieldName: "ENGINE_BRAND",
                    visible: true,
                    label: "Mühərrikin markası"
                },
                {
                    fieldName: "ENGINE_KIND",
                    visible: true,
                    label: "Mühərrikin növü"
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
                    label: "Nasos stansiyanın xidmət etdiyi sahə (ha)"
                },
                {
                    fieldName: "PIPELINE",
                    visible: true,
                    label: "Basqılı boru kəməri"
                },
                {
                    fieldName: "PIPELINE_LENGHT",
                    visible: true,
                    label: "Basqılı boru uzunluğu (km)"
                },
                {
                    fieldName: "PIPELINE_DIAMETER_ID",
                    visible: true,
                    label: "Basqılı boru diametri (m)"
                },
                {
                    fieldName: "PIPELINE_MATERIAL",
                    visible: true,
                    label: "Basqılı boru materialı",
                },
                {
                    fieldName: "ENGINE_INSTALL_DATE",
                    visible: true,
                    label: "Mühərrikin quraşdırılma ili"
                },

                {
                    fieldName: "VILLAGE",
                    visible: true,
                    label: "Nasos stansiyanın yerləşdiyi kənd"
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
                    label: "Yerləşdiyi Ərazi"
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
                    fieldName: "LENGTH",
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
                    fieldName: "SERVED_AREA",
                    visible: true,
                    label: "Xidmət etdiyi sahə (ha) "
                },
                {
                    fieldName: "DEVICE_SUM",
                    visible: true,
                    label: "Üzərindəki qurğuların sayı (ədəd)",
                }
            ]
        });
        
        layerRegion = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0905_REL/MapServer/12",
            {
                "imageParameters": imageParameters,
                mode: FeatureLayer.MODE_ONDEMAND,
                visible: true
            });

        layerVillage = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0905_REL/MapServer/11",
            {
                "imageParameters": imageParameters,
                mode: FeatureLayer.MODE_ONDEMAND,
                visible: false
            });
        
        layerChannel = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0905_REL/MapServer/5",
            {
                "imageParameters": imageParameters,
                infoTemplate: popupTemplateChannel,
                
                outFields: ["*"],
                visible: false
            });
                
        layerDrenaj = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0905_REL/MapServer/6",
            {
                "imageParameters": imageParameters,

                infoTemplate: popupTemplateDrenaj,
                outFields: ["*"],
                visible: false
            });
        
        layerRiverBand = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0905_REL/MapServer/8",
            {
                "imageParameters": imageParameters,

                infoTemplate: popupTemplateRiverBand,
                outFields: ["*"],
                visible: false
            });
        layerArtesian = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0905_REL/MapServer/0",
            {
                "imageParameters": imageParameters,

                infoTemplate: popupTemplateArtesian,
                outFields: ["*"],
                visible: false
            });
        layerWell = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0905_REL/MapServer/4",
            {
                "imageParameters": imageParameters,

                infoTemplate: popupTemplateWell,
                outFields: ["*"],
                visible: false
            });
        layerDevice = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0905_REL/MapServer/2",
            {
                "imageParameters": imageParameters,

                infoTemplate: popupTemplateDevice,
                outFields: ["*"],
                visible: false
            });
        layerDepartment = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0905_REL/MapServer/1",
            {
                "imageParameters": imageParameters,

                infoTemplate: popupTemplateDepartment,
                outFields: ["*"],
                visible: false
            });
        layerPump = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0905_REL/MapServer/3",
            {
                "imageParameters": imageParameters,

                infoTemplate: popupTemplatePump,
                outFields: ["*"],
                visible: false
            });
        layerBuilding = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0905_REL/MapServer/10",
            {
                "imageParameters": imageParameters,

                infoTemplate: popupTemplateBuilding,
                outFields: ["*"],
                visible: false
            });
        layerRoad = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0905_REL/MapServer/7",
            {
                "imageParameters": imageParameters,

                infoTemplate: popupTemplateRoad,
                outFields: ["*"],
                visible: false
            });
        layerPastures = new FeatureLayer("http://213.154.5.139:8021/arcgis/rest/services/Melo_0905_REL/MapServer/9",
            {
                "imageParameters": imageParameters,

                infoTemplate: popupTemplatePastures,
                outFields: ["*"],
                visible: false
            });
        
        
        map.addLayer(layerRegion);
       // map.addLayer(layerVillage);
        //map.addLayer(layerChannel);
        
        ////Drenaj map        
        //map.addLayer(layerDrenaj);
        
        ////Riverband map
        //map.addLayer(layerRiverBand);
        ////Other map
        //map.addLayer(layerArtesian);
        //map.addLayer(layerWell);
        //map.addLayer(layerDevice);
        //map.addLayer(layerDepartment);
        //map.addLayer(layerPump);
        //map.addLayer(layerBuilding);
        //map.addLayer(layerRoad);
        //map.addLayer(layerPastures);

        

        //var measurement = new Measurement({
        //    map: map
        //}, dom.byId("measurementDiv"));

        //measurement.startup();

        //on(dom.byId("channel-Magistral"), "change", updateLayerVisibility);
        //on(dom.byId("channel-1"), "change", updateLayerVisibility);
        //on(dom.byId("channel-2"), "change", updateLayerVisibility);
        //on(dom.byId("channel-3"), "change", updateLayerVisibility);
        //on(dom.byId("channel-Closed"), "change", updateLayerVisibility);
        //on(dom.byId("drenaj-Magistral"), "change", updateLayerVisibility);
        //on(dom.byId("drenaj-1"), "change", updateLayerVisibility);
        //on(dom.byId("drenaj-2"), "change", updateLayerVisibility);
        //on(dom.byId("drenaj-3"), "change", updateLayerVisibility);
        //on(dom.byId("drenaj-Closed"), "change", updateLayerVisibility);
        //on(dom.byId("network-12"), "change", updateLayerVisibility);
        //on(dom.byId("network-15"), "change", updateLayerVisibility);
        //on(dom.byId("network-16"), "change", updateLayerVisibility);
        //on(dom.byId("network-17"), "change", updateLayerVisibility);
        //on(dom.byId("network-18"), "change", updateLayerVisibility);
        //on(dom.byId("network-19"), "change", updateLayerVisibility);
        //on(dom.byId("network-20"), "change", updateLayerVisibility);
        //on(dom.byId("network-21"), "change", updateLayerVisibility);
        //on(dom.byId("network-14"), "change", updateLayerVisibility);



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

            if (tname == "KANAL") {
                layerChannel.visible = true;
                layerChannel.setDefinitionExpression(query);
                map.addLayer(layerChannel);
            }
            if (tname == "DRENAJ") {
                layerDrenaj.visible = true;
                layerDrenaj.setDefinitionExpression(query);
                map.addLayer(layerDrenaj);
            }
            if (tname == "DEVICE") {
                layerDevice.visible = true;
                layerDevice.setDefinitionExpression(query);
                map.addLayer(layerDevice);
            }
            if (tname == "ARTEZIAN") {
                query = "REPER_NO = N'" + value + "'";
                layerArtesian.visible = true;
                layerArtesian.setDefinitionExpression(query);
                map.addLayer(layerArtesian);
            }
            if (tname == "WELL") {                
                layerWell.visible = true;
                layerWell.setDefinitionExpression(query);
                map.addLayer(layerWell);
            }
            if (tname == "PUMSTATION") {
                layerPump.visible = true;
                layerPump.setDefinitionExpression(query);
                map.addLayer(layerPump);
            }
            if (tname == "WINTERPASTURES") {
                layerPastures.visible = true;
                layerPastures.setDefinitionExpression(query);
                map.addLayer(layerPastures);
            }
            if (tname == "RIVERBAND") {
                layerRiverBand.visible = true;
                layerRiverBand.setDefinitionExpression(query);
                map.addLayer(layerRiverBand);
            }
            if (tname == "BUILDINGS") {
                layerBuilding.visible = true;
                layerBuilding.setDefinitionExpression(query);
                map.addLayer(layerBuilding);
            }
            if (tname == "EXPLOITATION_ROAD") {
                layerRoad.visible = true;
                layerRoad.setDefinitionExpression(query);
                map.addLayer(layerRoad);
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

            var regionlist = "";
            var allRegionsInput = $("._regions");
            for (var i = 0; i < allRegionsInput.length; i++) {
                if ($(allRegionsInput[i]).is(":checked")) {
                    regionlist+= allRegionsInput[i].id+","
                }
            }
            console.log("region -----" + regionlist)
            villiageList = "";
            var allvilliagesInput = $("._villiages");
            for (var i = 0; i < allvilliagesInput.length; i++) {
                if ($(allvilliagesInput[i]).is(":checked")) {
                    villiageList += allvilliagesInput[i].id + ","
                }
            }
            console.log("villiage ----  " + villiageList)
            if (regionlist.length!=0) {
                regionlist = regionlist.substring(0,regionlist.length - 1);
            }
            if (villiageList.length != 0) {
                villiageList = villiageList.substring(0,regionlist.length - 1);
            }

            var regionalquery = "";
            if (villiageList.length!=0) {
                regionalquery += " and VILLAGE_ID in (" + villiageList + ") ";
            }
            if (villiageList.length == 0 && regionlist.length != 0) {
                regionalquery += " and REGIONS_ID in (" + regionlist  + ") ";
            }

            console.log(regionalquery)

            var magistralChannel = "1 = 1 " + regionalquery;
            ($("select[name*='CHANNEL_M_SOBJECTID']").val() == null) ? "" : magistralChannel += " and OBJECTID=" + $("select[name*='CHANNEL_M_SOBJECTID']").val();
            ($("input[name*='CHANNEL_M_EXPLONATION_DATE_MIN']").val() == "") ? "" : magistralChannel += " and EXPLONATION_DATE >= "+ $("input[name*='CHANNEL_M_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='CHANNEL_M_EXPLONATION_DATE_MAX']").val() == "") ? "" : magistralChannel += " and EXPLONATION_DATE <= " + $("input[name*='CHANNEL_M_EXPLONATION_DATE_MAX']").val();
            ($("select[name*='CHANNEL_M_SERVED_REGION_ID']").val() == null) ? "" : magistralChannel += " and SERVED_REGION_ID = " + $("select[name*='CHANNEL_M_SERVED_REGION_ID']").val();
            ($("input[name*='CHANNEL_M_SERVED_AREA_MIN']").val() == "") ? "" : magistralChannel += " and SERVED_AREAHA >= " + $("input[name*='CHANNEL_M_SERVED_AREA_MIN']").val();
            ($("input[name*='CHANNEL_M_SERVED_AREA_MAX']").val() == "") ? "" : magistralChannel += " and SERVED_AREAHA <= " + $("input[name*='CHANNEL_M_SERVED_AREA_MAX']").val();
            ($("input[name*='CHANNEL_M_FACTICAL_LENGTH_MIN']").val() == "") ? "" : magistralChannel += " and FACTICAL_LENGTH >= " +  $("input[name*='CHANNEL_M_FACTICAL_LENGTH_MIN']").val();
            ($("input[name*='CHANNEL_M_FACTICAL_LENGTH_MAX']").val() == "") ? "" : magistralChannel += " and FACTICAL_LENGTH <= " + $("input[name*='CHANNEL_M_FACTICAL_LENGTH_MAX']").val();
            ($("select[name*='CHANNEL_M_COVER_TYPE_ID']").val() == null) ? "" : magistralChannel += " and COVER_TYPE_ID = " + $("select[name*='CHANNEL_M_COVER_TYPE_ID']").val();
            ($("input[name*='CHANNEL_M_WATER_CAPABILITY_MIN']").val() == "") ? "" : magistralChannel += " and WATER_CAPABILITY >= " + $("input[name*='CHANNEL_M_WATER_CAPABILITY_MIN']").val();
            ($("input[name*='CHANNEL_M_WATER_CAPABILITY_MAX']").val() == "") ? "" : magistralChannel += " and WATER_CAPABILITY <= " + $("input[name*='CHANNEL_M_WATER_CAPABILITY_MAX']").val();
            ($("input[name*='CHANNEL_M_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : magistralChannel += " and WATERPROOF_WIDTH >= " + $("input[name*='CHANNEL_M_WATERPROOF_WIDTH_MIN']").val();
            ($("input[name*='CHANNEL_M_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : magistralChannel += " and WATERPROOF_WIDTH <= " + $("input[name*='CHANNEL_M_WATERPROOF_WIDTH_MAX']").val();
            ($("select[name*='CHANNEL_M_TECHNICAL_ID']").val() == null) ? "" : magistralChannel += " and TECHNICAL_ID = " + $("select[name*='CHANNEL_M_TECHNICAL_ID']").val();
            ($("select[name*='CNANNEL_M_PROPERTY_ID']").val() == null) ? "" : magistralChannel += " and SSI_ID = " +  $("select[name*='CNANNEL_M_PROPERTY_ID']").val();
            ($("select[name*='CHANNEL_M_PROPERTY_TYPE_ID']").val() == null) ? "" : magistralChannel += " and PROPERTY_TYPE_ID = " +  $("select[name*='CHANNEL_M_PROPERTY_TYPE_ID']").val();
            ($("select[name*='CHANNEL_M_ACTIVITY_ID']").val() == null) ? "" : magistralChannel += " and ACTIVITY_ID = " + $("select[name*='CHANNEL_M_ACTIVITY_ID']").val();
            ($("input[name*='CHANNEL_M_DEVICE_SUM']").val() == "") ? "" : magistralChannel += " and DEVICE_SUM = " + $("input[name*='CHANNEL_M_DEVICE_SUM']").val();
           

            var ICHANNEL = "1 = 1 " + regionalquery;
            ($("select[name*='CHANNEL_I_SOBJECTID']").val() == null) ? "" : ICHANNEL += " and OBJECTID=" + $("select[name*='CHANNEL_I_SOBJECTID']").val();
            ($("input[name*='CHANNEL_I_EXPLONATION_DATE_MIN']").val() == "") ? "" : ICHANNEL += " and EXPLONATION_DATE >=" + $("input[name*='CHANNEL_I_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='CHANNEL_I_EXPLONATION_DATE_MAX']").val() == "") ? "" : ICHANNEL += " and EXPLONATION_DATE <=" + $("input[name*='CHANNEL_I_EXPLONATION_DATE_MAX']").val();
            ($("select[name*='CHANNEL_I_SERVED_REGION_ID']").val() == null) ? "" : ICHANNEL += " and SERVED_REGION_ID=" + $("select[name*='CHANNEL_I_SERVED_REGION_ID']").val();
            ($("input[name*='CHANNEL_I_SERVED_AREA_MIN']").val() == "") ? "" : ICHANNEL += " and SERVED_AREAHA >=" + $("input[name*='CHANNEL_I_SERVED_AREA_MIN']").val();
            ($("input[name*='CHANNEL_I_SERVED_AREA_MAX']").val() == "") ? "" : ICHANNEL += " and SERVED_AREAHA <=" + $("input[name*='CHANNEL_I_SERVED_AREA_MAX']").val();
            ($("input[name*='CHANNEL_I_FACTICAL_LENGTH_MIN']").val() == "") ? "" : ICHANNEL += " and FACTICAL_LENGTH >=" + $("input[name*='CHANNEL_I_FACTICAL_LENGTH_MIN']").val();
            ($("input[name*='CHANNEL_I_FACTICAL_LENGTH_MAX']").val() == "") ? "" : ICHANNEL += " and FACTICAL_LENGTH <=" + $("input[name*='CHANNEL_I_FACTICAL_LENGTH_MAX']").val();
            ($("select[name*='CHANNEL_I_COVER_TYPE_ID']").val() == null) ? "" : ICHANNEL += " and COVER_TYPE_ID =" + $("select[name*='CHANNEL_I_COVER_TYPE_ID']").val();
            ($("input[name*='CHANNEL_I_WATER_CAPABILITY_MIN']").val() == "") ? "" : ICHANNEL += " and WATER_CAPABILITY >=" + $("input[name*='CHANNEL_I_WATER_CAPABILITY_MIN']").val();
            ($("input[name*='CHANNEL_I_WATER_CAPABILITY_MAX']").val() == "") ? "" : ICHANNEL += " and WATER_CAPABILITY <=" + $("input[name*='CHANNEL_I_WATER_CAPABILITY_MAX']").val();
            ($("input[name*='CHANNEL_I_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : ICHANNEL += " and WATERPROOF_WIDTH >=" + $("input[name*='CHANNEL_I_WATERPROOF_WIDTH_MIN']").val();
            ($("input[name*='CHANNEL_I_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : ICHANNEL += " and WATERPROOF_WIDTH <=" + $("input[name*='CHANNEL_I_WATERPROOF_WIDTH_MAX']").val();
            ($("select[name*='CHANNEL_I_TECHNICAL_ID']").val() == null) ? "" : ICHANNEL += " and TECHNICAL_ID=" + $("select[name*='CHANNEL_I_TECHNICAL_ID']").val();
            ($("select[name*='CNANNEL_I_PROPERTY_ID']").val() == null) ? "" : ICHANNEL += " and SSI_ID=" + $("select[name*='CNANNEL_I_PROPERTY_ID']").val();
            ($("select[name*='CHANNEL_I_PROPERTY_TYPE_ID']").val() == null) ? "" : ICHANNEL += " and PROPERTY_TYPE_ID=" + $("select[name*='CHANNEL_I_PROPERTY_TYPE_ID']").val();
            ($("select[name*='CHANNEL_I_ACTIVITY_ID']").val() == null) ? "" : ICHANNEL += " and ACTIVITY_ID=" + $("select[name*='CHANNEL_I_ACTIVITY_ID']").val();
            ($("input[name*='CHANNEL_I_DEVICE_SUM']").val() == "") ? "" : ICHANNEL += " and DEVICE_SUM=" + $("input[name*='CHANNEL_I_DEVICE_SUM']").val();
            

            var IICHANNEL = "1 = 1 " + regionalquery;
            ($("select[name*='CHANNEL_II_SOBJECTID']").val() == null) ? "" : IICHANNEL += " and OBJECTID=" + $("select[name*='CHANNEL_II_SOBJECTID']").val();
            ($("input[name*='CHANNEL_II_EXPLONATION_DATE_MIN']").val() == "") ? "" : IICHANNEL += " and EXPLONATION_DATE >=" + $("input[name*='CHANNEL_II_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='CHANNEL_II_EXPLONATION_DATE_MAX']").val() == "") ? "" : IICHANNEL += " and EXPLONATION_DATE <=" + $("input[name*='CHANNEL_II_EXPLONATION_DATE_MAX']").val();
            ($("select[name*='CHANNEL_II_SERVED_REGION_ID']").val() == null) ? "" : IICHANNEL += " and SERVED_REGION_ID=" + $("select[name*='CHANNEL_II_SERVED_REGION_ID']").val();
            ($("input[name*='CHANNEL_II_SERVED_AREA_MIN']").val() == "") ? "" : IICHANNEL += " and SERVED_AREAHA >=" + $("input[name*='CHANNEL_II_SERVED_AREA_MIN']").val();
            ($("input[name*='CHANNEL_II_SERVED_AREA_MAX']").val() == "") ? "" : IICHANNEL += " and SERVED_AREAHA <=" + $("input[name*='CHANNEL_II_SERVED_AREA_MAX']").val();
            ($("input[name*='CHANNEL_II_FACTICAL_LENGTH_MIN']").val() == "") ? "" : IICHANNEL += " and FACTICAL_LENGTH >=" + $("input[name*='CHANNEL_II_FACTICAL_LENGTH_MIN']").val();
            ($("input[name*='CHANNEL_II_FACTICAL_LENGTH_MAX']").val() == "") ? "" : IICHANNEL += " and FACTICAL_LENGTH <=" + $("input[name*='CHANNEL_II_FACTICAL_LENGTH_MAX']").val();
            ($("select[name*='CHANNEL_II_COVER_TYPE_ID']").val() == null) ? "" : IICHANNEL += " and COVER_TYPE_ID =" + $("select[name*='CHANNEL_II_COVER_TYPE_ID']").val();
            ($("input[name*='CHANNEL_II_WATER_CAPABILITY_MIN']").val() == "") ? "" : IICHANNEL += " and WATER_CAPABILITY >=" + $("input[name*='CHANNEL_II_WATER_CAPABILITY_MIN']").val();
            ($("input[name*='CHANNEL_II_WATER_CAPABILITY_MAX']").val() == "") ? "" : IICHANNEL += " and WATER_CAPABILITY <=" + $("input[name*='CHANNEL_II_WATER_CAPABILITY_MAX']").val();
            ($("input[name*='CHANNEL_II_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : IICHANNEL += " and WATERPROOF_WIDTH >=" + $("input[name*='CHANNEL_II_WATERPROOF_WIDTH_MIN']").val();
            ($("input[name*='CHANNEL_II_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : IICHANNEL += " and WATERPROOF_WIDTH <=" + $("input[name*='CHANNEL_II_WATERPROOF_WIDTH_MAX']").val();
            ($("select[name*='CHANNEL_II_TECHNICAL_ID']").val() == null) ? "" : IICHANNEL += " and TECHNICAL_ID=" + $("select[name*='CHANNEL_II_TECHNICAL_ID']").val();
            ($("select[name*='CNANNEL_II_PROPERTY_ID']").val() == null) ? "" : IICHANNEL += " and SSI_ID=" + $("select[name*='CNANNEL_II_PROPERTY_ID']").val();
            ($("select[name*='CHANNEL_II_PROPERTY_TYPE_ID']").val() == null) ? "" : IICHANNEL += " and PROPERTY_TYPE_ID=" + $("select[name*='CHANNEL_II_PROPERTY_TYPE_ID']").val();
            ($("select[name*='CHANNEL_II_ACTIVITY_ID']").val() == null) ? "" : IICHANNEL += " and ACTIVITY_ID=" + $("select[name*='CHANNEL_II_ACTIVITY_ID']").val();
            ($("input[name*='CHANNEL_II_DEVICE_SUM']").val() == "") ? "" : IICHANNEL += " and DEVICE_SUM=" + $("input[name*='CHANNEL_II_DEVICE_SUM']").val();
            

            var IIICHANNEL = "1 = 1 " + regionalquery;
            ($("select[name*='CHANNEL_III_SOBJECTID']").val() == null) ? "" : IIICHANNEL += " and OBJECTID=" + $("select[name*='CHANNEL_III_SOBJECTID']").val();
            ($("input[name*='CHANNEL_III_EXPLONATION_DATE_MIN']").val() == "") ? "" : IIICHANNEL += " and EXPLONATION_DATE >=" + $("input[name*='CHANNEL_III_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='CHANNEL_III_EXPLONATION_DATE_MAX']").val() == "") ? "" : IIICHANNEL += " and EXPLONATION_DATE <=" + $("input[name*='CHANNEL_III_EXPLONATION_DATE_MAX']").val();
            ($("select[name*='CHANNEL_III_SERVED_REGION_ID']").val() == null) ? "" : IIICHANNEL += " and SERVED_REGION_ID=" + $("select[name*='CHANNEL_III_SERVED_REGION_ID']").val();
            ($("input[name*='CHANNEL_III_SERVED_AREA_MIN']").val() == "") ? "" : IIICHANNEL += " and SERVED_AREAHA >=" + $("input[name*='CHANNEL_III_SERVED_AREA_MIN']").val();
            ($("input[name*='CHANNEL_III_SERVED_AREA_MAX']").val() == "") ? "" : IIICHANNEL += " and SERVED_AREAHA <=" + $("input[name*='CHANNEL_III_SERVED_AREA_MAX']").val();
            ($("input[name*='CHANNEL_III_FACTICAL_LENGTH_MIN']").val() == "") ? "" : IIICHANNEL += " and FACTICAL_LENGTH >=" + $("input[name*='CHANNEL_III_FACTICAL_LENGTH_MIN']").val();
            ($("input[name*='CHANNEL_III_FACTICAL_LENGTH_MAX']").val() == "") ? "" : IIICHANNEL += " and FACTICAL_LENGTH <=" + $("input[name*='CHANNEL_III_FACTICAL_LENGTH_MAX']").val();
            ($("select[name*='CHANNEL_III_COVER_TYPE_ID']").val() == null) ? "" : IIICHANNEL += " and COVER_TYPE_ID =" + $("select[name*='CHANNEL_III_COVER_TYPE_ID']").val();
            ($("input[name*='CHANNEL_III_WATER_CAPABILITY_MIN']").val() == "") ? "" : IIICHANNEL += " and WATER_CAPABILITY >=" + $("input[name*='CHANNEL_III_WATER_CAPABILITY_MIN']").val();
            ($("input[name*='CHANNEL_III_WATER_CAPABILITY_MAX']").val() == "") ? "" : IIICHANNEL += " and WATER_CAPABILITY <=" + $("input[name*='CHANNEL_III_WATER_CAPABILITY_MAX']").val();
            ($("input[name*='CHANNEL_III_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : IIICHANNEL += " and WATERPROOF_WIDTH >=" + $("input[name*='CHANNEL_III_WATERPROOF_WIDTH_MIN']").val();
            ($("input[name*='CHANNEL_III_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : IIICHANNEL += " and WATERPROOF_WIDTH <=" + $("input[name*='CHANNEL_III_WATERPROOF_WIDTH_MAX']").val();
            ($("select[name*='CHANNEL_III_TECHNICAL_ID']").val() == null) ? "" : IIICHANNEL += " and TECHNICAL_ID=" + $("select[name*='CHANNEL_III_TECHNICAL_ID']").val();
            ($("select[name*='CNANNEL_III_PROPERTY_ID']").val() == null) ? "" : IIICHANNEL += " and SSI_ID=" + $("select[name*='CNANNEL_III_PROPERTY_ID']").val();
            ($("select[name*='CHANNEL_III_PROPERTY_TYPE_ID']").val() == null) ? "" : IIICHANNEL += " and PROPERTY_TYPE_ID=" + $("select[name*='CHANNEL_III_PROPERTY_TYPE_ID']").val();
            ($("select[name*='CHANNEL_III_ACTIVITY_ID']").val() == null) ? "" : IIICHANNEL += " and ACTIVITY_ID=" + $("select[name*='CHANNEL_III_ACTIVITY_ID']").val();
            ($("input[name*='CHANNEL_III_DEVICE_SUM']").val() == "") ? "" : IIICHANNEL += " and DEVICE_SUM=" + $("input[name*='CHANNEL_III_DEVICE_SUM']").val();
           

            var QmagistralChannel = "1 = 1 " + regionalquery;
            ($("select[name*='CHANNEL_QM_SOBJECTID']").val() == null) ? "" : QmagistralChannel += " and OBJECTID=" + $("select[name*='CHANNEL_QM_SOBJECTID']").val();
            ($("input[name*='CHANNEL_QM_EXPLONATION_DATE_MIN']").val() == "") ? "" : QmagistralChannel += " and EXPLONATION_DATE >= " + $("input[name*='CHANNEL_QM_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='CHANNEL_QM_EXPLONATION_DATE_MAX']").val() == "") ? "" : QmagistralChannel += " and EXPLONATION_DATE <= " + $("input[name*='CHANNEL_QM_EXPLONATION_DATE_MAX']").val();
            ($("select[name*='CHANNEL_QM_SERVED_REGION_ID']").val() == null) ? "" : QmagistralChannel += " and SERVED_REGION_ID = " + $("select[name*='CHANNEL_QM_SERVED_REGION_ID']").val();
            ($("input[name*='CHANNEL_QM_SERVED_AREA_MIN']").val() == "") ? "" : QmagistralChannel += " and SERVED_AREAHA >= " + $("input[name*='CHANNEL_QM_SERVED_AREA_MIN']").val();
            ($("input[name*='CHANNEL_QM_SERVED_AREA_MAX']").val() == "") ? "" : QmagistralChannel += " and SERVED_AREAHA <= " + $("input[name*='CHANNEL_QM_SERVED_AREA_MAX']").val();
            ($("input[name*='CHANNEL_QM_FACTICAL_LENGTH_MIN']").val() == "") ? "" : QmagistralChannel += " and FACTICAL_LENGTH >= " + $("input[name*='CHANNEL_QM_FACTICAL_LENGTH_MIN']").val();
            ($("input[name*='CHANNEL_QM_FACTICAL_LENGTH_MAX']").val() == "") ? "" : QmagistralChannel += " and FACTICAL_LENGTH <= " + $("input[name*='CHANNEL_QM_FACTICAL_LENGTH_MAX']").val();
            ($("select[name*='CHANNEL_QM_COVER_TYPE_ID']").val() == null) ? "" : QmagistralChannel += " and COVER_TYPE_ID = " + $("select[name*='CHANNEL_QM_COVER_TYPE_ID']").val();
            ($("input[name*='CHANNEL_QM_WATER_CAPABILITY_MIN']").val() == "") ? "" : QmagistralChannel += " and WATER_CAPABILITY >= " + $("input[name*='CHANNEL_QM_WATER_CAPABILITY_MIN']").val();
            ($("input[name*='CHANNEL_QM_WATER_CAPABILITY_MAX']").val() == "") ? "" : QmagistralChannel += " and WATER_CAPABILITY <= " + $("input[name*='CHANNEL_QM_WATER_CAPABILITY_MAX']").val();
            ($("input[name*='CHANNEL_QM_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : QmagistralChannel += " and WATERPROOF_WIDTH >= " + $("input[name*='CHANNEL_QM_WATERPROOF_WIDTH_MIN']").val();
            ($("input[name*='CHANNEL_QM_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : QmagistralChannel += " and WATERPROOF_WIDTH <= " + $("input[name*='CHANNEL_QM_WATERPROOF_WIDTH_MAX']").val();
            ($("select[name*='CHANNEL_QM_TECHNICAL_ID']").val() == null) ? "" : QmagistralChannel += " and TECHNICAL_ID = " + $("select[name*='CHANNEL_QM_TECHNICAL_ID']").val();
            ($("select[name*='CNANNEL_QM_PROPERTY_ID']").val() == null) ? "" : QmagistralChannel += " and SSI_ID = " + $("select[name*='CNANNEL_QM_PROPERTY_ID']").val();
            ($("select[name*='CHANNEL_QM_PROPERTY_TYPE_ID']").val() == null) ? "" : QmagistralChannel += " and PROPERTY_TYPE_ID = " + $("select[name*='CHANNEL_QM_PROPERTY_TYPE_ID']").val();
            ($("select[name*='CHANNEL_QM_ACTIVITY_ID']").val() == null) ? "" : QmagistralChannel += " and ACTIVITY_ID = " + $("select[name*='CHANNEL_QM_ACTIVITY_ID']").val();
            ($("input[name*='CHANNEL_QM_DEVICE_SUM']").val() == "") ? "" : QmagistralChannel += " and DEVICE_SUM = " + $("input[name*='CHANNEL_QM_DEVICE_SUM']").val();
            

            var QICHANNEL = "1 = 1 " + regionalquery;
            ($("select[name*='CHANNEL_QI_SOBJECTID']").val() == null) ? "" : QICHANNEL += " and OBJECTID=" + $("select[name*='CHANNEL_QI_SOBJECTID']").val();
            ($("input[name*='CHANNEL_QI_EXPLONATION_DATE_MIN']").val() == "") ? "" : QICHANNEL += " and EXPLONATION_DATE >=" + $("input[name*='CHANNEL_QI_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='CHANNEL_QI_EXPLONATION_DATE_MAX']").val() == "") ? "" : QICHANNEL += " and EXPLONATION_DATE <=" + $("input[name*='CHANNEL_QI_EXPLONATION_DATE_MAX']").val();
            ($("select[name*='CHANNEL_QI_SERVED_REGION_ID']").val() == null) ? "" : QICHANNEL += " and SERVED_REGION_ID=" + $("select[name*='CHANNEL_QI_SERVED_REGION_ID']").val();
            ($("input[name*='CHANNEL_QI_SERVED_AREA_MIN']").val() == "") ? "" : QICHANNEL += " and SERVED_AREAHA >=" + $("input[name*='CHANNEL_QI_SERVED_AREA_MIN']").val();
            ($("input[name*='CHANNEL_QI_SERVED_AREA_MAX']").val() == "") ? "" : QICHANNEL += " and SERVED_AREAHA <=" + $("input[name*='CHANNEL_QI_SERVED_AREA_MAX']").val();
            ($("input[name*='CHANNEL_QI_FACTICAL_LENGTH_MIN']").val() == "") ? "" : QICHANNEL += " and FACTICAL_LENGTH >=" + $("input[name*='CHANNEL_QI_FACTICAL_LENGTH_MIN']").val();
            ($("input[name*='CHANNEL_QI_FACTICAL_LENGTH_MAX']").val() == "") ? "" : QICHANNEL += " and FACTICAL_LENGTH <=" + $("input[name*='CHANNEL_QI_FACTICAL_LENGTH_MAX']").val();
            ($("select[name*='CHANNEL_QI_COVER_TYPE_ID']").val() == null) ? "" : QICHANNEL += " and COVER_TYPE_ID =" + $("select[name*='CHANNEL_QI_COVER_TYPE_ID']").val();
            ($("input[name*='CHANNEL_QI_WATER_CAPABILITY_MIN']").val() == "") ? "" : QICHANNEL += " and WATER_CAPABILITY >=" + $("input[name*='CHANNEL_QI_WATER_CAPABILITY_MIN']").val();
            ($("input[name*='CHANNEL_QI_WATER_CAPABILITY_MAX']").val() == "") ? "" : QICHANNEL += " and WATER_CAPABILITY <=" + $("input[name*='CHANNEL_QI_WATER_CAPABILITY_MAX']").val();
            ($("input[name*='CHANNEL_QI_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : QICHANNEL += " and WATERPROOF_WIDTH >=" + $("input[name*='CHANNEL_QI_WATERPROOF_WIDTH_MIN']").val();
            ($("input[name*='CHANNEL_QI_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : QICHANNEL += " and WATERPROOF_WIDTH <=" + $("input[name*='CHANNEL_QI_WATERPROOF_WIDTH_MAX']").val();
            ($("select[name*='CHANNEL_QI_TECHNICAL_ID']").val() == null) ? "" : QICHANNEL += " and TECHNICAL_ID=" + $("select[name*='CHANNEL_QI_TECHNICAL_ID']").val();
            ($("select[name*='CNANNEL_QI_PROPERTY_ID']").val() == null) ? "" : QICHANNEL += " and SSI_ID=" + $("select[name*='CNANNEL_QI_PROPERTY_ID']").val();
            ($("select[name*='CHANNEL_QI_PROPERTY_TYPE_ID']").val() == null) ? "" : QICHANNEL += " and PROPERTY_TYPE_ID=" + $("select[name*='CHANNEL_QI_PROPERTY_TYPE_ID']").val();
            ($("select[name*='CHANNEL_QI_ACTIVITY_ID']").val() == null) ? "" : QICHANNEL += " and ACTIVITY_ID=" + $("select[name*='CHANNEL_QI_ACTIVITY_ID']").val();
            ($("input[name*='CHANNEL_QI_DEVICE_SUM']").val() == "") ? "" : QICHANNEL += " and DEVICE_SUM=" + $("input[name*='CHANNEL_QI_DEVICE_SUM']").val();
            

            var QIICHANNEL = "1 = 1 " + regionalquery;
            ($("select[name*='CHANNEL_QII_SOBJECTID']").val() == null) ? "" : QIICHANNEL += " and OBJECTID=" + $("select[name*='CHANNEL_QII_SOBJECTID']").val();
            ($("input[name*='CHANNEL_QII_EXPLONATION_DATE_MIN']").val() == "") ? "" : QIICHANNEL += " and EXPLONATION_DATE >=" + $("input[name*='CHANNEL_QII_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='CHANNEL_QII_EXPLONATION_DATE_MAX']").val() == "") ? "" : QIICHANNEL += " and EXPLONATION_DATE <=" + $("input[name*='CHANNEL_QII_EXPLONATION_DATE_MAX']").val();
            ($("select[name*='CHANNEL_QII_SERVED_REGION_ID']").val() == null) ? "" : QIICHANNEL += " and SERVED_REGION_ID=" + $("select[name*='CHANNEL_QII_SERVED_REGION_ID']").val();
            ($("input[name*='CHANNEL_QII_SERVED_AREA_MIN']").val() == "") ? "" : QIICHANNEL += " and SERVED_AREAHA >=" + $("input[name*='CHANNEL_QII_SERVED_AREA_MIN']").val();
            ($("input[name*='CHANNEL_QII_SERVED_AREA_MAX']").val() == "") ? "" : QIICHANNEL += " and SERVED_AREAHA <=" + $("input[name*='CHANNEL_QII_SERVED_AREA_MAX']").val();
            ($("input[name*='CHANNEL_QII_FACTICAL_LENGTH_MIN']").val() == "") ? "" : QIICHANNEL += " and FACTICAL_LENGTH >=" + $("input[name*='CHANNEL_QII_FACTICAL_LENGTH_MIN']").val();
            ($("input[name*='CHANNEL_QII_FACTICAL_LENGTH_MAX']").val() == "") ? "" : QIICHANNEL += " and FACTICAL_LENGTH <=" + $("input[name*='CHANNEL_QII_FACTICAL_LENGTH_MAX']").val();
            ($("select[name*='CHANNEL_QII_COVER_TYPE_ID']").val() == null) ? "" : QIICHANNEL += " and COVER_TYPE_ID =" + $("select[name*='CHANNEL_QII_COVER_TYPE_ID']").val();
            ($("input[name*='CHANNEL_QII_WATER_CAPABILITY_MIN']").val() == "") ? "" : QIICHANNEL += " and WATER_CAPABILITY >=" + $("input[name*='CHANNEL_QII_WATER_CAPABILITY_MIN']").val();
            ($("input[name*='CHANNEL_QII_WATER_CAPABILITY_MAX']").val() == "") ? "" : QIICHANNEL += " and WATER_CAPABILITY <=" + $("input[name*='CHANNEL_QII_WATER_CAPABILITY_MAX']").val();
            ($("input[name*='CHANNEL_QII_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : QIICHANNEL += " and WATERPROOF_WIDTH >=" + $("input[name*='CHANNEL_QII_WATERPROOF_WIDTH_MIN']").val();
            ($("input[name*='CHANNEL_QII_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : QIICHANNEL += " and WATERPROOF_WIDTH <=" + $("input[name*='CHANNEL_QII_WATERPROOF_WIDTH_MAX']").val();
            ($("select[name*='CHANNEL_QII_TECHNICAL_ID']").val() == null) ? "" : QIICHANNEL += " and TECHNICAL_ID=" + $("select[name*='CHANNEL_QII_TECHNICAL_ID']").val();
            ($("select[name*='CNANNEL_QII_PROPERTY_ID']").val() == null) ? "" : QIICHANNEL += " and SSI_ID=" + $("select[name*='CNANNEL_QII_PROPERTY_ID']").val();
            ($("select[name*='CHANNEL_QII_PROPERTY_TYPE_ID']").val() == null) ? "" : QIICHANNEL += " and PROPERTY_TYPE_ID=" + $("select[name*='CHANNEL_QII_PROPERTY_TYPE_ID']").val();
            ($("select[name*='CHANNEL_QII_ACTIVITY_ID']").val() == null) ? "" : QIICHANNEL += " and ACTIVITY_ID=" + $("select[name*='CHANNEL_QII_ACTIVITY_ID']").val();
            ($("input[name*='CHANNEL_QII_DEVICE_SUM']").val() == "") ? "" : QIICHANNEL += " and DEVICE_SUM=" + $("input[name*='CHANNEL_QII_DEVICE_SUM']").val();
            

            var QIIICHANNEL = "1 = 1 " + regionalquery;
            //($("select[name*='CHANNEL_QIII_SOBJECTID']").val() == null) ? "" : QIIICHANNEL += " and OBJECTID=" + $("select[name*='CHANNEL_QIII_SOBJECTID']").val();
            ($("input[name*='CHANNEL_QIII_EXPLONATION_DATE_MIN']").val() == "") ? "" : QIIICHANNEL += " and EXPLONATION_DATE >=" + $("input[name*='CHANNEL_QIII_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='CHANNEL_QIII_EXPLONATION_DATE_MAX']").val() == "") ? "" : QIIICHANNEL += " and EXPLONATION_DATE <=" + $("input[name*='CHANNEL_QIII_EXPLONATION_DATE_MAX']").val();
            ($("select[name*='CHANNEL_QIII_SERVED_REGION_ID']").val() == null) ? "" : QIIICHANNEL += " and SERVED_REGION_ID=" + $("select[name*='CHANNEL_QIII_SERVED_REGION_ID']").val();
            ($("input[name*='CHANNEL_QIII_SERVED_AREA_MIN']").val() == "") ? "" : QIIICHANNEL += " and SERVED_AREAHA >=" + $("input[name*='CHANNEL_QIII_SERVED_AREA_MIN']").val();
            ($("input[name*='CHANNEL_QIII_SERVED_AREA_MAX']").val() == "") ? "" : QIIICHANNEL += " and SERVED_AREAHA <=" + $("input[name*='CHANNEL_QIII_SERVED_AREA_MAX']").val();
            ($("input[name*='CHANNEL_QIII_FACTICAL_LENGTH_MIN']").val() == "") ? "" : QIIICHANNEL += " and FACTICAL_LENGTH >=" + $("input[name*='CHANNEL_QIII_FACTICAL_LENGTH_MIN']").val();
            ($("input[name*='CHANNEL_QIII_FACTICAL_LENGTH_MAX']").val() == "") ? "" : QIIICHANNEL += " and FACTICAL_LENGTH <=" + $("input[name*='CHANNEL_QIII_FACTICAL_LENGTH_MAX']").val();
            ($("select[name*='CHANNEL_QIII_COVER_TYPE_ID']").val() == null) ? "" : QIIICHANNEL += " and COVER_TYPE_ID =" + $("select[name*='CHANNEL_QIII_COVER_TYPE_ID']").val();
            ($("input[name*='CHANNEL_QIII_WATER_CAPABILITY_MIN']").val() == "") ? "" : QIIICHANNEL += " and WATER_CAPABILITY >=" + $("input[name*='CHANNEL_QIII_WATER_CAPABILITY_MIN']").val();
            ($("input[name*='CHANNEL_QIII_WATER_CAPABILITY_MAX']").val() == "") ? "" : QIIICHANNEL += " and WATER_CAPABILITY <=" + $("input[name*='CHANNEL_QIII_WATER_CAPABILITY_MAX']").val();
            ($("input[name*='CHANNEL_QIII_WATERPROOF_WIDTH_MIN']").val() == "") ? "" : QIIICHANNEL += " and WATERPROOF_WIDTH >=" + $("input[name*='CHANNEL_QIII_WATERPROOF_WIDTH_MIN']").val();
            ($("input[name*='CHANNEL_QIII_WATERPROOF_WIDTH_MAX']").val() == "") ? "" : QIIICHANNEL += " and WATERPROOF_WIDTH <=" + $("input[name*='CHANNEL_QIII_WATERPROOF_WIDTH_MAX']").val();
            ($("select[name*='CHANNEL_QIII_TECHNICAL_ID']").val() == null) ? "" : QIIICHANNEL += " and TECHNICAL_ID=" + $("select[name*='CHANNEL_QIII_TECHNICAL_ID']").val();
            ($("select[name*='CNANNEL_QIII_PROPERTY_ID']").val() == null) ? "" : QIIICHANNEL += " and SSI_ID=" + $("select[name*='CNANNEL_QIII_PROPERTY_ID']").val();
            ($("select[name*='CHANNEL_QIII_PROPERTY_TYPE_ID']").val() == null) ? "" : QIIICHANNEL += " and PROPERTY_TYPE_ID=" + $("select[name*='CHANNEL_QIII_PROPERTY_TYPE_ID']").val();
            ($("select[name*='CHANNEL_QIII_ACTIVITY_ID']").val() == null) ? "" : QIIICHANNEL += " and ACTIVITY_ID=" + $("select[name*='CHANNEL_QIII_ACTIVITY_ID']").val();
            ($("input[name*='CHANNEL_QIII_DEVICE_SUM']").val() == "") ? "" : QIIICHANNEL += " and DEVICE_SUM=" + $("input[name*='CHANNEL_QIII_DEVICE_SUM']").val();

            
            var DRENAJM = " 1 = 1 " + regionalquery;
            ($("select[name*='DRENAJ_M_RECIVER_ID']").val() == null) ? "" : DRENAJM += "and OBJECTID=" + $("input[name*='DRENAJ_M_RECIVER_ID']").val();
            ($("input[name*='DRENAJ_M_EXPLONATION_DATE_MIN']").val() == "") ? "" : DRENAJM += "and EXPLONATION_DATE >=" + $("input[name*='DRENAJ_M_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='DRENAJ_M_EXPLONATION_DATE_MAX']").val() == "") ? "" : DRENAJM += "and EXPLONATION_DATE <=" + $("input[name*='DRENAJ_M_EXPLONATION_DATE_MAX']").val();
            ($("input[name*='DRENAJ_M_SERVED_AREA_MIN']").val() == "") ? "" : DRENAJM += "and SERVED_AREA >=" +$("input[name*='DRENAJ_M_SERVED_AREA_MIN']").val();
            ($("input[name*='DRENAJ_M_SERVED_AREA_MAX']").val() == "") ? "" : DRENAJM += "and SERVED_AREA <=" + $("input[name*='DRENAJ_M_SERVED_AREA_MAX']").val();
            ($("input[name*='DRENAJ_M_FACTICAL_LENGTH_MIN']").val() == "") ? "" : DRENAJM += "and FACTICAL_LENGTH >=" + $("input[name*='DRENAJ_M_FACTICAL_LENGTH_MIN']").val();
            ($("input[name*='DRENAJ_M_FACTICAL_LENGTH_MAX']").val() == "") ? "" : DRENAJM += "and FACTICAL_LENGTH <=" + $("input[name*='DRENAJ_M_FACTICAL_LENGTH_MAX']").val();
            ($("select[name*='DRENAJ_M_ACTIVITY_ID']").val() == null) ? "" : DRENAJM += "and ACTIVITY_ID=" + $("select[name*='DRENAJ_M_ACTIVITY_ID']").val();
            ($("select[name*='DRENAJ_M_KIND_ID']").val() == null) ? "" : DRENAJM += "and KIND_ID=" + $("select[name*='DRENAJ_M_KIND_ID']").val();
            ($("select[name*='DRENAJ_M_TECHNICAL_CONDITION_ID']").val() == null) ? "" : DRENAJM += "and TECHNICAL_CONDINITION_ID=" + $("select[name*='DRENAJ_M_TECHNICAL_CONDITION_ID']").val();
            ($("select[name*='DRENAJ_M_PROPERTY_TYPE_ID']").val() == null) ? "" : DRENAJM += "and PROPERTY_TYPE_ID=" + $("select[name*='DRENAJ_M_PROPERTY_TYPE_ID']").val();
            ($("select[name*='DRENAJ_M_PROPERTY_ID']").val() == null) ? "" : DRENAJM += "and SSI_ID=" + $("select[name*='DRENAJ_M_PROPERTY_ID']").val();
            ($("input[name*='DRENAJ_M_WATER_CAPABILITY_MIN']").val() == "") ? "" : DRENAJM += "and WATER_CAPABILITY >=" + $("input[name*='DRENAJ_M_WATER_CAPABILITY_MIN']").val();
            ($("input[name*='DRENAJ_M_WATER_CAPABILITY_MAX']").val() == "") ? "" : DRENAJM += "and WATER_CAPABILITY <=" + $("input[name*='DRENAJ_M_WATER_CAPABILITY_MAX']").val();
            ($("input[name*='DRENAJ_M_DEVICE_SUM']").val() == "") ? "" : DRENAJM += "and DEVICE_SUM =" + $("input[name*='DRENAJ_M_DEVICE_SUM']").val();
            
            
            var DRENAJI = " 1 = 1 " + regionalquery;
            ($("select[name*='DRENAJ_I_RECIVER_ID']").val() == null) ? "" : DRENAJI += "and OBJECTID=" + $("input[name*='DRENAJ_I_RECIVER_ID']").val();
            ($("input[name*='DRENAJ_I_EXPLONATION_DATE_MIN']").val() == "") ? "" : DRENAJI += "and EXPLONATION_DATE >=" + $("input[name*='DRENAJ_I_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='DRENAJ_I_EXPLONATION_DATE_MAX']").val() == "") ? "" : DRENAJI += "and EXPLONATION_DATE <=" + $("input[name*='DRENAJ_I_EXPLONATION_DATE_MAX']").val();
            ($("input[name*='DRENAJ_I_SERVED_AREA_MIN']").val() == "") ? "" : DRENAJI += "and SERVED_AREA >=" + $("input[name*='DRENAJ_I_SERVED_AREA_MIN']").val();
            ($("input[name*='DRENAJ_I_SERVED_AREA_MAX']").val() == "") ? "" : DRENAJI += "and SERVED_AREA <=" + $("input[name*='DRENAJ_I_SERVED_AREA_MAX']").val();
            ($("input[name*='DRENAJ_I_FACTICAL_LENGTH_MIN']").val() == "") ? "" : DRENAJI += "and FACTICAL_LENGTH >=" + $("input[name*='DRENAJ_I_FACTICAL_LENGTH_MIN']").val();
            ($("input[name*='DRENAJ_I_FACTICAL_LENGTH_MAX']").val() == "") ? "" : DRENAJI += "and FACTICAL_LENGTH <=" + $("input[name*='DRENAJ_I_FACTICAL_LENGTH_MAX']").val();
            ($("select[name*='DRENAJ_I_ACTIVITY_ID']").val() == null) ? "" : DRENAJI += "and ACTIVITY_ID=" + $("select[name*='DRENAJ_I_ACTIVITY_ID']").val();
            ($("select[name*='DRENAJ_I_KIND_ID']").val() == null) ? "" : DRENAJI += "and KIND_ID=" + $("select[name*='DRENAJ_I_KIND_ID']").val();
            ($("select[name*='DRENAJ_I_TECHNICAL_CONDITION_ID']").val() == null) ? "" : DRENAJI += "and TECHNICAL_CONDINITION_ID=" + $("select[name*='DRENAJ_I_TECHNICAL_CONDITION_ID']").val();
            ($("select[name*='DRENAJ_I_PROPERTY_TYPE_ID']").val() == null) ? "" : DRENAJI += "and PROPERTY_TYPE_ID=" + $("select[name*='DRENAJ_I_PROPERTY_TYPE_ID']").val();
            ($("select[name*='DRENAJ_I_PROPERTY_ID']").val() == null) ? "" : DRENAJI += "and SSI_ID=" + $("select[name*='DRENAJ_I_PROPERTY_ID']").val();
            ($("input[name*='DRENAJ_I_WATER_CAPABILITY_MIN']").val() == "") ? "" : DRENAJI += "and WATER_CAPABILITY >=" + $("input[name*='DRENAJ_I_WATER_CAPABILITY_MIN']").val();
            ($("input[name*='DRENAJ_I_WATER_CAPABILITY_MAX']").val() == "") ? "" : DRENAJI += "and WATER_CAPABILITY <=" + $("input[name*='DRENAJ_I_WATER_CAPABILITY_MAX']").val();
            ($("input[name*='DRENAJ_I_DEVICE_SUM']").val() == "") ? "" : DRENAJI += "and DEVICE_SUM =" + $("input[name*='DRENAJ_I_DEVICE_SUM']").val();
            
            var DRENAJII = " 1 = 1 " + regionalquery;
            ($("select[name*='DRENAJ_II_RECIVER_ID']").val() == null) ? "" : DRENAJII += "and OBJECTID=" + $("input[name*='DRENAJ_II_RECIVER_ID']").val();
            ($("input[name*='DRENAJ_II_EXPLONATION_DATE_MIN']").val() == "") ? "" : DRENAJII += "and EXPLONATION_DATE >=" + $("input[name*='DRENAJ_II_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='DRENAJ_II_EXPLONATION_DATE_MAX']").val() == "") ? "" : DRENAJII += "and EXPLONATION_DATE <=" + $("input[name*='DRENAJ_II_EXPLONATION_DATE_MAX']").val();
            ($("input[name*='DRENAJ_II_SERVED_AREA_MIN']").val() == "") ? "" : DRENAJII += "and SERVED_AREA >=" + $("input[name*='DRENAJ_II_SERVED_AREA_MIN']").val();
            ($("input[name*='DRENAJ_II_SERVED_AREA_MAX']").val() == "") ? "" : DRENAJII += "and SERVED_AREA <=" + $("input[name*='DRENAJ_II_SERVED_AREA_MAX']").val();
            ($("input[name*='DRENAJ_II_FACTICAL_LENGTH_MIN']").val() == "") ? "" : DRENAJII += "and FACTICAL_LENGTH >=" + $("input[name*='DRENAJ_II_FACTICAL_LENGTH_MIN']").val();
            ($("input[name*='DRENAJ_II_FACTICAL_LENGTH_MAX']").val() == "") ? "" : DRENAJII += "and FACTICAL_LENGTH <=" + $("input[name*='DRENAJ_II_FACTICAL_LENGTH_MAX']").val();
            ($("select[name*='DRENAJ_II_ACTIVITY_ID']").val() == null) ? "" : DRENAJII += "and ACTIVITY_ID=" + $("select[name*='DRENAJ_II_ACTIVITY_ID']").val();
            ($("select[name*='DRENAJ_II_KIND_ID']").val() == null) ? "" : DRENAJII += "and KIND_ID=" + $("select[name*='DRENAJ_II_KIND_ID']").val();
            ($("select[name*='DRENAJ_II_TECHNICAL_CONDITION_ID']").val() == null) ? "" : DRENAJII += "and TECHNICAL_CONDINITION_ID=" + $("select[name*='DRENAJ_II_TECHNICAL_CONDITION_ID']").val();
            ($("select[name*='DRENAJ_II_PROPERTY_TYPE_ID']").val() == null) ? "" : DRENAJII += "and PROPERTY_TYPE_ID=" + $("select[name*='DRENAJ_II_PROPERTY_TYPE_ID']").val();
            ($("select[name*='DRENAJ_II_PROPERTY_ID']").val() == null) ? "" : DRENAJII += "and SSI_ID=" + $("select[name*='DRENAJ_II_PROPERTY_ID']").val();
            ($("input[name*='DRENAJ_II_WATER_CAPABILITY_MIN']").val() == "") ? "" : DRENAJII += "and WATER_CAPABILITY >=" + $("input[name*='DRENAJ_II_WATER_CAPABILITY_MIN']").val();
            ($("input[name*='DRENAJ_II_WATER_CAPABILITY_MAX']").val() == "") ? "" : DRENAJII += "and WATER_CAPABILITY <=" + $("input[name*='DRENAJ_II_WATER_CAPABILITY_MAX']").val();
            ($("input[name*='DRENAJ_II_DEVICE_SUM']").val() == "") ? "" : DRENAJII += "and DEVICE_SUM =" + $("input[name*='DRENAJ_II_DEVICE_SUM']").val();
           

            var DRENAJK = " 1 = 1 " + regionalquery;
            ($("select[name*='DRENAJ_K_RECIVER_ID']").val() == null) ? "" : DRENAJK += "and OBJECTID=" + $("input[name*='DRENAJ_K_RECIVER_ID']").val();
            ($("input[name*='DRENAJ_K_EXPLONATION_DATE_MIN']").val() == "") ? "" : DRENAJK += "and EXPLONATION_DATE >=" + $("input[name*='DRENAJ_K_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='DRENAJ_K_EXPLONATION_DATE_MAX']").val() == "") ? "" : DRENAJK += "and EXPLONATION_DATE <=" + $("input[name*='DRENAJ_K_EXPLONATION_DATE_MAX']").val();
            ($("input[name*='DRENAJ_K_SERVED_AREA_MIN']").val() == "") ? "" : DRENAJK += "and SERVED_AREA >=" + $("input[name*='DRENAJ_K_SERVED_AREA_MIN']").val();
            ($("input[name*='DRENAJ_K_SERVED_AREA_MAX']").val() == "") ? "" : DRENAJK += "and SERVED_AREA <=" + $("input[name*='DRENAJ_K_SERVED_AREA_MAX']").val();
            ($("input[name*='DRENAJ_K_FACTICAL_LENGTH_MIN']").val() == "") ? "" : DRENAJK += "and FACTICAL_LENGTH >=" + $("input[name*='DRENAJ_K_FACTICAL_LENGTH_MIN']").val();
            ($("input[name*='DRENAJ_K_FACTICAL_LENGTH_MAX']").val() == "") ? "" : DRENAJK += "and FACTICAL_LENGTH <=" + $("input[name*='DRENAJ_K_FACTICAL_LENGTH_MAX']").val();
            ($("select[name*='DRENAJ_K_ACTIVITY_ID']").val() == null) ? "" : DRENAJK += "and ACTIVITY_ID=" + $("select[name*='DRENAJ_K_ACTIVITY_ID']").val();
            ($("select[name*='DRENAJ_K_KIND_ID']").val() == null) ? "" : DRENAJK += "and KIND_ID=" + $("select[name*='DRENAJ_K_KIND_ID']").val();
            ($("select[name*='DRENAJ_K_TECHNICAL_CONDITION_ID']").val() == null) ? "" : DRENAJK += "and TECHNICAL_CONDINITION_ID=" + $("select[name*='DRENAJ_K_TECHNICAL_CONDITION_ID']").val();
            ($("select[name*='DRENAJ_K_PROPERTY_TYPE_ID']").val() == null) ? "" : DRENAJK += "and PROPERTY_TYPE_ID=" + $("select[name*='DRENAJ_K_PROPERTY_TYPE_ID']").val();
            ($("select[name*='DRENAJ_K_PROPERTY_ID']").val() == null) ? "" : DRENAJK += "and SSI_ID=" + $("select[name*='DRENAJ_K_PROPERTY_ID']").val();
            ($("input[name*='DRENAJ_K_WATER_CAPABILITY_MIN']").val() == "") ? "" : DRENAJK += "and WATER_CAPABILITY >=" + $("input[name*='DRENAJ_K_WATER_CAPABILITY_MIN']").val();
            ($("input[name*='DRENAJ_K_WATER_CAPABILITY_MAX']").val() == "") ? "" : DRENAJK += "and WATER_CAPABILITY <=" + $("input[name*='DRENAJ_K_WATER_CAPABILITY_MAX']").val();
            ($("input[name*='DRENAJ_K_DEVICE_SUM']").val() == "") ? "" : DRENAJK += "and DEVICE_SUM =" + $("input[name*='DRENAJ_K_DEVICE_SUM']").val();
            

            var device = "1 = 1 " + regionalquery;
            ($("input[name*='DEVICE_EXDATA_MIN']").val() == "") ? "" : device += "and EXPLONATION_DATE >=" + $("input[name*='DEVICE_EXDATA_MIN']").val();
            ($("input[name*='DEVICE_EXDATA_MAX']").val() == "") ? "" : device += "and EXPLONATION_DATE <=" + $("input[name*='DEVICE_EXDATA_MAX']").val();
            ($("input[name*='DEVICE_SEVAREA_MIN']").val() == "") ? "" : device += "and SERVED_AREA >=" + $("input[name*='DEVICE_SEVAREA_MIN']").val();
            ($("input[name*='DEVICE_SEVAREA_MAX']").val() == "") ? "" : device += "and SERVED_AREA <=" + $("input[name*='DEVICE_SEVAREA_MAX']").val();
            ($("select[name*='DEVICE_NETWORK_TYPE']").val() == null) ? "" : device += "and NETWORK_TYPE_ID=" + $("select[name*='DEVICE_NETWORK_TYPE']").val();
            ($("input[name*='DEVICE_WTRCAPASTY_MIN']").val() == "") ? "" : device += "and WATER_CAPABILITY >=" + $("input[name*='DEVICE_WTRCAPASTY_MIN']").val();
            ($("input[name*='DEVICE_WTRCAPASTY_MAX']").val() == "") ? "" : device += "and WATER_CAPABILITY <=" + $("input[name*='DEVICE_WTRCAPASTY_MAX']").val();
            ($("select[name*='DEVICE_ACTIVITY_ID']").val() == null) ? "" : device += "and ACTIVITY_ID=" + $("select[name*='DEVICE_ACTIVITY_ID']").val();
            ($("select[name*='DEVICE_SECURITY_TYPE_ID']").val() == null) ? "" : device += "and SECURITY_TYPE_ID=" + $("select[name*='DEVICE_SECURITY_TYPE_ID']").val();
            ($("select[name*='DEVICE_TECHNICAL_TYPE_ID']").val() == null) ? "" : device += "and TECHNICAL_TYPE_ID=" + $("select[name*='DEVICE_TECHNICAL_TYPE_ID']").val();
            ($("select[name*='DEVICE_PROPERTY_TYPE_ID']").val() == null) ? "" : device += "and PROPERTY_TYPE_ID=" + $("select[name*='DEVICE_PROPERTY_TYPE_ID']").val();
            ($("select[name*='DEVICE_SSI_ID']").val() == null) ? "" : device += "and SSI_ID=" + $("select[name*='DEVICE_SSI_ID']").val();
            


            var artezianWell = "1 = 1 " + regionalquery;
            ($("select[name*='ARTEZIAN_WELL_TYPE_ID']").val() == null) ? "" : artezianWell += "and WELL_TYPE_ID=" + $("select[name*='ARTEZIAN_WELL_TYPE_ID']").val();
            ($("input[name*='ARTEZIAN_PRODUCTIVITY_MIN']").val() == "") ? "" : artezianWell += "and PRODUCTIVITY >=" + $("input[name*='ARTEZIAN_PRODUCTIVITY_MIN']").val();
            ($("input[name*='ARTEZIAN_PRODUCTIVITY_MAX']").val() == "") ? "" : artezianWell += "and PRODUCTIVITY <=" + $("input[name*='ARTEZIAN_PRODUCTIVITY_MAX']").val();
            ($("select[name*='ARTEZIAN_SIBS_ID']").val() == null) ? "" : artezianWell += "and SIBS_ID=" + $("select[name*='ARTEZIAN_SIBS_ID']").val();
            ($("input[name*='ARTEZIAN_EXPDATE_MIN']").val() == "") ? "" : artezianWell += "and EXPLONATION_DATE >=" + $("input[name*='ARTEZIAN_EXPDATE_MIN']").val();
            ($("input[name*='ARTEZIAN_EXPDATE_MAX']").val() == "") ? "" : artezianWell += "and EXPLONATION_DATE <=" + $("input[name*='ARTEZIAN_EXPDATE_MAX']").val();
            ($("select[name*='ATREZIAN_ACTIVITY_ID']").val() == null) ? "" : artezianWell += "and ACTIVITY_ID=" + $("select[name*='ATREZIAN_ACTIVITY_ID']").val();
            ($("input[name*='ARTEZIAN_IRRIGATED_AREA_MIN']").val() == "") ? "" : artezianWell += "and IRRIGATED_AREA >=" + $("input[name*='ARTEZIAN_IRRIGATED_AREA_MIN']").val();
            ($("input[name*='ARTEZIAN_IRRIGATED_AREA_MAX']").val() == "") ? "" : artezianWell += "and IRRIGATED_AREA <=" + $("input[name*='ARTEZIAN_IRRIGATED_AREA_MAX']").val();
            ($("select[name*='ARTEZIAN_PROPERTY_TYPE_ID']").val() == null) ? "" : artezianWell += "and PROPERTY_TYPE_ID=" + $("select[name*='ARTEZIAN_PROPERTY_TYPE_ID']").val();
            ($("select[name*='ARTEZIAN_PROPERTY_ID']").val() == null) ? "" : artezianWell += "and SSI_ID=" + $("select[name*='ARTEZIAN_PROPERTY_ID']").val();
            ($("input[name*='ARTEZIAN_Depth_MIN']").val() == "") ? "" : artezianWell += "and DEPTH >=" + $("input[name*='ARTEZIAN_Depth_MIN']").val();
            ($("input[name*='ARTEZIAN_Depth_MAX']").val() == "") ? "" : artezianWell += "and DEPTH <=" + $("input[name*='ARTEZIAN_Depth_MAX']").val();

            
            var well = "1 = 1 " + regionalquery;
            ($("select[name*='WELL_WELL_TYPE_ID']").val() == null) ? "" : well += "and WELL_TYPE_ID=" + $("select[name*='WELL_WELL_TYPE_ID']").val();
            ($("input[name*='WELL_PRODUCTIVITY_MIN']").val() == "") ? "" : well += "and PRODUCTIVITY >=" + $("input[name*='WELL_PRODUCTIVITY_MIN']").val();
            ($("input[name*='WELL_PRODUCTIVITY_MAX']").val() == "") ? "" : well += "and PRODUCTIVITY <=" + $("input[name*='WELL_PRODUCTIVITY_MAX']").val();
            ($("select[name*='WELL_SIBS_ID']").val() == null) ? "" : well += "and SIBS_ID=" + $("select[name*='WELL_SIBS_ID']").val();
            ($("input[name*='WELL_EXPDATE_MIN']").val() == "") ? "" : well += "and EXPLONATION_DATE >=" + $("input[name*='WELL_EXPDATE_MIN']").val();
            ($("input[name*='WELL_EXPDATE_MAX']").val() == "") ? "" : well += "and EXPLONATION_DATE <=" + $("input[name*='WELL_EXPDATE_MAX']").val();
            ($("select[name*='WELL_ACTIVITY_ID']").val() == null) ? "" : well += "and ACTIVITY_ID=" + $("select[name*='WELL_ACTIVITY_ID']").val();
            ($("input[name*='WELL_IRRIGATED_AREA_MIN']").val() == "") ? "" : well += "and IRRIGATED_AREA >=" + $("input[name*='WELL_IRRIGATED_AREA_MIN']").val();
            ($("input[name*='WELL_IRRIGATED_AREA_MAX']").val() == "") ? "" : well += "and IRRIGATED_AREA <=" + $("input[name*='WELL_IRRIGATED_AREA_MAX']").val();
            ($("select[name*='WELL_PROPERTY_TYPE_ID']").val() == null) ? "" : well += "and PROPERTY_TYPE_ID=" + $("select[name*='WELL_PROPERTY_TYPE_ID']").val();
            ($("select[name*='WELL_PROPERTY_ID']").val() == null) ? "" : well += "and SSI_ID=" + $("select[name*='WELL_PROPERTY_ID']").val();
            ($("input[name*='WELL_Depth_MIN']").val() == "") ? "" : well += "and DEPTH >=" + $("input[name*='WELL_Depth_MIN']").val();
            ($("input[name*='WELL_Depth_MAX']").val() == "") ? "" : well += "and DEPTH <=" + $("input[name*='WELL_Depth_MAX']").val();
           

            var Pums = "1 = 1 " + regionalquery;
            ($("select[name*='PUMPSTATION_PLACED_SOURCE_ID']").val() == null) ? "" : Pums +=" and PLACED_SOURCE_ID="+ $("select[name*='PUMPSTATION_PLACED_SOURCE_ID']").val();
            ($("input[name*='PUMPSTATION_EXPLONATION_DATE_MIN']").val() == "") ? "" : Pums += " and EXPLONATION_DATE >=" + $("input[name*='PUMPSTATION_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='PUMPSTATION_EXPLONATION_DATE_MAX']").val() == "") ? "" : Pums += " and EXPLONATION_DATE <=" + $("input[name*='PUMPSTATION_EXPLONATION_DATE_MAX']").val();
            ($("input[name*='PUMPSTATION_SERVED_AREA_MIN']").val() == "") ? "" : Pums += " and SERVED_AREA >=" + $("input[name*='PUMPSTATION_SERVED_AREA_MIN']").val();
            ($("input[name*='PUMPSTATION_SERVED_AREA_MAX']").val() == "") ? "" : Pums += " and SERVED_AREA <=" + $("input[name*='PUMPSTATION_SERVED_AREA_MAX']").val();
            ($("select[name*='PUMPSTATION_PURPOSEFUL_ID']").val() == null) ? "" : Pums += " and PURPOSEFUL_ID=" + $("select[name*='PUMPSTATION_PURPOSEFUL_ID']").val();
            ($("select[name*='PUMPSTATION_PUMP_KIND_ID']").val() == null) ? "" : Pums += " and PUMP_KIND_ID=" + $("select[name*='PUMPSTATION_PUMP_KIND_ID']").val();
            ($("select[name*='PUMPSTATION_PUMP_TYPE_ID']").val() == null) ? "" : Pums += " and PUMP_TYPE_ID=" + $("select[name*='PUMPSTATION_PUMP_TYPE_ID']").val();
            ($("select[name*='PUMPSTATION_BRAND_OF_AGGREGATE_ID']").val() == null) ? "" : Pums += " and BRAND_OF_AGGREGATE_ID=" + $("select[name*='PUMPSTATION_BRAND_OF_AGGREGATE_ID']").val();
            ($("input[name*='PUMPSTATION_AGREGATE_SUM_MIN']").val() == "") ? "" : Pums += " and AGREGATE_SUM >=" + $("input[name*='PUMPSTATION_AGREGATE_SUM_MIN']").val();
            ($("input[name*='PUMPSTATION_AGREGATE_SUM_MAX']").val() == "") ? "" : Pums += " and AGREGATE_SUM <=" + $("input[name*='PUMPSTATION_AGREGATE_SUM_MAX']").val();
            ($("input[name*='PUMPSTATION_POWER_MIN']").val() == "") ? "" : Pums += " and POWER >=" + $("input[name*='PUMPSTATION_POWER_MIN']").val();
            ($("input[name*='PUMPSTATION_POWER_MAX']").val() == "") ? "" : Pums += " and POWER <=" + $("input[name*='PUMPSTATION_POWER_MAX']").val();
            ($("input[name*='PUMPSTATION_PRODUCTIVITY_MIN']").val() == "") ? "" : Pums += " and PRODUCTIVITY >=" + $("input[name*='PUMPSTATION_PRODUCTIVITY_MIN']").val();
            ($("input[name*='PUMPSTATION_PRODUCTIVITY_MAX']").val() == "") ? "" : Pums += " and PRODUCTIVITY <=" + $("input[name*='PUMPSTATION_PRODUCTIVITY_MAX']").val();
            ($("input[name*='PUMPSTATION_PIPELINE_LENGTH_MIN']").val() == "") ? "" : Pums += " and PIPELINE_LENGHT >=" + $("input[name*='PUMPSTATION_PIPELINE_LENGTH_MIN']").val();
            ($("input[name*='PUMPSTATION_PIPELINE_LENGTH_MAX']").val() == "") ? "" : Pums += " and PIPELINE_LENGHT <=" + $("input[name*='PUMPSTATION_PIPELINE_LENGTH_MAX']").val();
            ($("select[name*='PUMPSTATION_PIPELINE_MATERIAL']").val() == null) ? "" : Pums += " and PIPELINE_MATERIAL_ID=" + $("select[name*='PUMPSTATION_PIPELINE_MATERIAL']").val();
            ($("input[name*='PUMPSTATION_PIPELINE_DIAMETER_MIN']").val() == "") ? "" : Pums += " and PIPELINE_DIAMETER_ID >=" + $("input[name*='PUMPSTATION_PIPELINE_DIAMETER_MIN']").val();
            ($("input[name*='PUMPSTATION_PIPELINE_DIAMETER_MAX']").val() == "") ? "" : Pums += " and PIPELINE_DIAMETER_ID <=" + $("input[name*='PUMPSTATION_PIPELINE_DIAMETER_MAX']").val();
            

            var winterpasture = "1 = 1 " + regionalquery;
            ($("input[name*='WINTERPASTURES_SERVED_AREA_MIN']").val() == "") ? "" : winterpasture += " and SERVED_AREA >=" + $("input[name*='WINTERPASTURES_SERVED_AREA_MIN']").val();
            ($("input[name*='WINTERPASTURES_SERVED_AREA_MAX']").val() == "") ? "" : winterpasture += " and SERVED_AREA <=" + $("input[name*='WINTERPASTURES_SERVED_AREA_MAX']").val();
            ($("input[name*='WINTERPASTURES_DEVICE_SUM_MIN']").val() == "") ? "" : winterpasture += " and DEVICE_SUM >=" + $("input[name*='WINTERPASTURES_DEVICE_SUM_MIN']").val();
            ($("input[name*='WINTERPASTURES_DEVICE_SUM_MAX']").val() == "") ? "" : winterpasture += " and DEVICE_SUM <=" + $("input[name*='WINTERPASTURES_DEVICE_SUM_MAX']").val();
            ($("input[name*='WINTERPASTURES_WATER_PIPE_MIN']").val() == "") ? "" : winterpasture += " and WATER_PIPE >=" + $("input[name*='WINTERPASTURES_WATER_PIPE_MIN']").val();
            ($("input[name*='WINTERPASTURES_WATER_PIPE_MAX']").val() == "") ? "" : winterpasture += " and WATER_PIPE <=" + $("input[name*='WINTERPASTURES_WATER_PIPE_MAX']").val();

            var riverbands = "1 = 1 " + regionalquery;
            ($("input[name*='RIVERBAND_EXPLONATION_DATE_MIN']").val() == "") ? "" : riverbands += " and EXPLONATION_DATE >=" + $("input[name*='RIVERBAND_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='RIVERBAND_EXPLONATION_DATE_MAX']").val() == "") ? "" : riverbands += " and EXPLONATION_DATE <=" +  $("input[name*='RIVERBAND_EXPLONATION_DATE_MAX']").val();
            ($("select[name*='RIVERBAND_TECHNICAL_TYPE_ID']").val() == null) ? "" : riverbands += " and TECHNICAL_TYPE_ID=" + $("select[name*='RIVERBAND_TECHNICAL_TYPE_ID']").val();
            ($("select[name*='RIVERBAND_ASSIGMENT']").val() == null) ? "" : riverbands += " and ASSIGMENT_ID=" +  $("select[name*='RIVERBAND_ASSIGMENT']").val();
            ($("input[name*='RIVERBAND_LENGTH_MIN']").val() == "") ? "" : riverbands += " and LENGTH >=" +  $("input[name*='RIVERBAND_LENGTH_MIN']").val();
            ($("input[name*='RIVERBAND_LENGTH_MAX']").val() == "") ? "" : riverbands += " and LENGTH <=" +  $("input[name*='RIVERBAND_LENGTH_MAX']").val();
            ($("select[name*='RIVERBAND_COVER_TYPE_ID']").val() == null) ? "" : riverbands += " and COVER_TYPE_ID=" +  $("select[name*='RIVERBAND_COVER_TYPE_ID']").val();
            ($("select[name*='RIVERBAND_PROPERTY_TYPE_ID']").val() == null) ? "" : riverbands += " and PROPERTY_TYPE_ID=" +  $("select[name*='RIVERBAND_PROPERTY_TYPE_ID']").val();
            ($("select[name*='RIVERBAND_PROPERTY_ID']").val() == null) ? "" : riverbands += " and SSI_ID=" +  $("select[name*='RIVERBAND_PROPERTY_ID']").val();


            var build = "1 = 1 " + regionalquery;
            ($("input[name*='BUILDINGS_EXPLONATION_DATE_MIN']").val() == "") ? "" : build += " and EXPLONATIO >=" + $("input[name*='BUILDINGS_EXPLONATION_DATE_MIN']").val();
            ($("input[name*='BUILDINGS_EXPLONATION_DATE_MAX']").val() == "") ? "" : build += " and EXPLONATIO <=" + $("input[name*='BUILDINGS_EXPLONATION_DATE_MAX']").val();
            ($("select[name*='BUILDINGS_ACTIVITY_ID']").val() == null) ? "" : build += " and ACTIVITY_ID =" + $("select[name*='BUILDINGS_ACTIVITY_ID']").val();
            ($("select[name*='BUILDINGS_ASSIGMENT']").val() == null) ? "" : build += " and ASSIGMENT_ID =" + $("select[name*='BUILDINGS_ASSIGMENT']").val();
            ($("select[name*='BUILDINGS_PROTECTING']").val() == null) ? "" : build += " and PROTECTING =" + $("select[name*='BUILDINGS_PROTECTING']").val();
            ($("input[name*='BUILDINGS_TOTAL_AREA_MIN']").val() == "") ? "" : build += " and TOTAL_AREA >=" + $("input[name*='BUILDINGS_TOTAL_AREA_MIN']").val();
            ($("input[name*='BUILDINGS_TOTAL_AREA_MAX']").val() == "") ? "" : build += " and TOTAL_AREA <=" + $("input[name*='BUILDINGS_TOTAL_AREA_MAX']").val();
            ($("select[name*='BUILDINGS_USING_MODE']").val() == null) ? "" : build += " and USING_MODE =" +$("select[name*='BUILDINGS_USING_MODE']").val();
            ($("select[name*='BUILDINGS_PROPERTY_TYPE_ID']").val() == null) ? "" : build += " and PROPERTY_TYPE_ID =" + $("select[name*='BUILDINGS_PROPERTY_TYPE_ID']").val();
            ($("select[name*='BUILDINGS_PROPERTY_ID']").val() == null) ? "" : build += " and SSI_ID =" + $("select[name*='BUILDINGS_PROPERTY_ID']").val();
           
            var EXPROAD = "1 = 1 " + regionalquery;
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
                EXPLONATION_ROAD: ($("#EXPLONATION_ROAD").is(":checked")) ? true : false


            }


            if (keyword == "map") {//xeritede gosterilme bolmesi

                console.log("Map bolmesi")
                // Aciq suvarma sebekesi 
                if (FILCHECK.CHANNEL.CH == true && (FILCHECK.CHANNEL.CHANNELFILDS.CHM == false && FILCHECK.CHANNEL.CHANNELFILDS.CHI == false && FILCHECK.CHANNEL.CHANNELFILDS.CHII == false && FILCHECK.CHANNEL.CHANNELFILDS.CHII == false)) {
                    console.log("test aciq suvarma sebekesi hamisi")
                    layerChannel.visible = true;
                    layerChannel.setDefinitionExpression("KIND_ID = 1");
                    map.addLayer(layerChannel);
                }

                if (FILCHECK.CHANNEL.CH == true && FILCHECK.CHANNEL.CHANNELFILDS.CHM == true) {
                    console.log("magistral open channels")
                    layerChannel.visible = true;
                    layerChannel.setDefinitionExpression("KIND_ID = 1 and TYPE_ID=4 and " + magistralChannel);
                    map.addLayer(layerChannel);
                }

                if (FILCHECK.CHANNEL.CH == true && FILCHECK.CHANNEL.CHANNELFILDS.CHI == true) {
                    console.log("I open channels")
                    layerChannel.visible = true;
                    layerChannel.setDefinitionExpression("KIND_ID = 1 and TYPE_ID=1 and " + ICHANNEL);
                    map.addLayer(layerChannel);
                }

                if (FILCHECK.CHANNEL.CH == true && FILCHECK.CHANNEL.CHANNELFILDS.CHII == true) {
                    console.log("II open channels")
                    layerChannel.visible = true;
                    layerChannel.setDefinitionExpression("KIND_ID = 1 and TYPE_ID=2 and " + IICHANNEL);
                    map.addLayer(layerChannel);
                }

                if (FILCHECK.CHANNEL.CH == true && FILCHECK.CHANNEL.CHANNELFILDS.CHII == true) {
                    console.log("II open channels")
                    layerChannel.visible = true;
                    layerChannel.setDefinitionExpression("KIND_ID = 1 and TYPE_ID=3 and " + IIICHANNEL);
                    map.addLayer(layerChannel);
                }

                // Qapali suvarma sebekesi
                if (FILCHECK.QCHANNEL.QCH == true && (FILCHECK.QCHANNEL.QCHANNELFILDS.QCHM == false && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHI == false && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHII == false && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHIII == false)) {
                    console.log("close channels all")
                    layerChannel.visible = true;
                    layerChannel.setDefinitionExpression("KIND_ID = 2");
                    map.addLayer(layerChannel);
                }

                if (FILCHECK.QCHANNEL.QCH == true && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHM == true) {
                    console.log("magistral close channels")
                    layerChannel.visible = true;
                    layerChannel.setDefinitionExpression("KIND_ID = 2 and TYPE_ID=4 and " + QmagistralChannel);
                    map.addLayer(layerChannel);
                }

                if (FILCHECK.QCHANNEL.QCH == true && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHI == true) {
                    console.log("I close channels")
                    layerChannel.visible = true;
                    layerChannel.setDefinitionExpression("KIND_ID = 2 and TYPE_ID = 1 and " + QICHANNEL);
                    map.addLayer(layerChannel);
                }

                if (FILCHECK.QCHANNEL.QCH == true && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHII == true) {
                    console.log("II close channels")
                    layerChannel.visible = true;
                    layerChannel.setDefinitionExpression("KIND_ID = 2 and TYPE_ID = 2 and " + QIICHANNEL);
                    map.addLayer(layerChannel);
                }

                if (FILCHECK.QCHANNEL.QCH == true && FILCHECK.QCHANNEL.QCHANNELFILDS.QCHIII == true) {
                    console.log("III close channels")
                    layerChannel.visible = true;
                    layerChannel.setDefinitionExpression("KIND_ID = 2 and TYPE_ID = 3 and " + QIIICHANNEL);
                    map.addLayer(layerChannel);
                }

                //Drenajlar
                if (FILCHECK.DRENAJ.DREN == true && (FILCHECK.DRENAJ.DRENAJFILDS.DRENAJM == false && FILCHECK.DRENAJ.DRENAJFILDS.DRENAJI == false && FILCHECK.DRENAJ.DRENAJFILDS.DRENAJII == false && FILCHECK.DRENAJ.DRENAJFILDS.DRENAJK == false)) {
                    console.log("Drenaj all")
                    layerDrenaj.visible = true;
                    layerDrenaj.setDefinitionExpression();
                    map.addLayer(layerDrenaj);
                }

                if (FILCHECK.DRENAJ.DREN == true && FILCHECK.DRENAJ.DRENAJFILDS.DRENAJM == true) {
                    console.log("Drenaj magistral")
                    layerDrenaj.visible = true;
                    layerDrenaj.setDefinitionExpression(" DRENAJ.CHANNEL_TYPE_ID =4 " + DRENAJM);
                    map.addLayer(layerDrenaj);
                }

                if (FILCHECK.DRENAJ.DREN == true && FILCHECK.DRENAJ.DRENAJFILDS.DRENAJI == true) {
                    console.log("Drenaj I")
                    layerDrenaj.visible = true;
                    layerDrenaj.setDefinitionExpression(" DRENAJ.CHANNEL_TYPE_ID =1 " + DRENAJI);
                    map.addLayer(layerDrenaj);
                }

                if (FILCHECK.DRENAJ.DREN == true && FILCHECK.DRENAJ.DRENAJFILDS.DRENAJII == true) {
                    console.log("Drenaj II")
                    layerDrenaj.visible = true;
                    layerDrenaj.setDefinitionExpression(" DRENAJ.CHANNEL_TYPE_ID =2 " + DRENAJII);
                    map.addLayer(layerDrenaj);
                }

                if (FILCHECK.DRENAJ.DREN == true && FILCHECK.DRENAJ.DRENAJFILDS.DRENAJK == true) {
                    console.log("Drenaj ilkin")
                    layerDrenaj.visible = true;
                    layerDrenaj.setDefinitionExpression(" DRENAJ.CHANNEL_TYPE_ID =3 " + DRENAJK);
                    map.addLayer(layerDrenaj);
                }

                if (FILCHECK.DEVICE) {
                    console.log("hidrogen")
                    layerDevice.visible = true;
                    layerDevice.setDefinitionExpression(device);
                    map.addLayer(layerDevice);
                }

                if (FILCHECK.ARTEZIANWELL) {
                    console.log("hidrogen")
                    layerArtesian.visible = true;
                    layerArtesian.setDefinitionExpression(artezianWell);
                    map.addLayer(layerArtesian);
                }

                if (FILCHECK.ARTEZIANWELL) {
                    console.log("hidrogen")
                    layerWell.visible = true;
                    layerWell.setDefinitionExpression(well);
                    map.addLayer(layerWell);
                }

                if (FILCHECK.PUMPSTATION) {
                    console.log("nasoslar")
                    layerPump.visible = true;
                    layerPump.setDefinitionExpression(Pums);
                    map.addLayer(layerPump);
                }
                if (FILCHECK.WINTERPASTURES) {
                    console.log("qis otlaq")
                    layerPastures.visible = true;
                    layerPastures.setDefinitionExpression(winterpasture);
                    map.addLayer(layerPastures);
                }
                if (FILCHECK.RIVERBAND) {
                    console.log("bendler")
                    layerRiverBand.visible = true;
                    layerRiverBand.setDefinitionExpression(riverbands);
                    map.addLayer(layerRiverBand);
                }
                if (FILCHECK.BUILDINGS) {
                    console.log("tikililer")
                    layerBuilding.visible = true;
                    layerBuilding.setDefinitionExpression(build);
                    map.addLayer(layerBuilding);
                }
                if (FILCHECK.EXPLONATION_ROAD) {
                    console.log("istismar yollarl")
                    layerRoad.visible = true;
                    layerRoad.setDefinitionExpression(EXPROAD);
                    map.addLayer(layerRoad);
                }

            }
            else {//db gore filterleme bolmesi
                var Filter = {
                    OCHM: magistralChannel,
                    OCHI: ICHANNEL,
                    OCHII: IICHANNEL,
                    OCHIII: IIICHANNEL,
                    QCHM: QmagistralChannel,
                    QCHI: QICHANNEL,
                    QCHII: QIICHANNEL,
                    QCHIII: QIIICHANNEL,
                    DRENAJM: DRENAJM,
                    DRENAJI: DRENAJI,
                    DRENAJII: DRENAJII,
                    DRENAJK: DRENAJK,
                    DEVICE: device,
                    ARTEZIANWELL: artezianWell,
                    WELL: well,
                    PUMPSTATION: Pums,
                    WINTERPASTURES: winterpasture,
                    RIVERBAND: riverbands,
                    BUILDINGS: build,
                    EXPLONATION_ROAD: EXPROAD
                }

                //Clear Filer modal
                $("#_FilterResult tbody tr").remove();


                $.ajax({
                    url: "/Home/Filter",
                    data: { FILCHECK: FILCHECK, FILTER: Filter },
                    method: "post",
                    type: "JSON",
                    success: function (response) {
                        console.log(response)
                        if (response != null) {
                            if (response.CH_CHECK) {
                                FilterAppent(response.CH_Count, response.CH_Lenght,"Açıq suvarma şəbəkəsi")
                            }
                            if (response.CHM_CHECK) {
                                FilterAppent(response.CHM_Count, response.CHM_Lenght, "Açıq suvarma şəbəkəsi: Magistral kanallar")
                            }
                            if (response.CHI_CHECK) {
                                FilterAppent(response.CHI_Count, response.CHI_Lenght, "Açıq suvarma şəbəkəsi: I dərəcəli kanallar")
                            }
                            if (response.CHII_CHECK) {
                                FilterAppent(response.CHII_Count, response.CHII_Lenght, "Açıq suvarma şəbəkəsi: II dərəcəli kanallar")
                            }
                            if (response.CHIII_CHECK) {
                                FilterAppent(response.CHIII_Count, response.CHIII_Lenght, "Açıq suvarma şəbəkəsi: III dərəcəli kanallar")
                            }
                            if (response.QCH_CHECK) {
                                FilterAppent(response.QCH_Count, response.QCH_Lenght, "Qapalı suvarma şəbəkəsi")
                            }
                            if (response.QCHM_CHECK) {
                                FilterAppent(response.QCHM_Count, response.QCHM_Lenght, "Qapalı suvarma şəbəkəsi: Magistral kanallar")
                            }
                            if (response.QCHI_CHECK) {
                                FilterAppent(response.QCHI_Count, response.QCHI_Lenght, "Qapalı suvarma şəbəkəsi: I dərəcəli kanallar")
                            }
                            if (response.QCHII_CHECK) {
                                FilterAppent(response.QCHII_Count, response.QCHII_Lenght, "Qapalı suvarma şəbəkəsi: II dərəcəli kanallar")
                            }
                            if (response.QCHIII_CHECK) {
                                FilterAppent(response.QCHIII_Count, response.QCHIII_Lenght, "Qapalı suvarma şəbəkəsi: III dərəcəli kanallar")
                            }
                            if (response.DRENAJ_CHECK ) {
                                FilterAppent(response.DRENAJ_Count, response.DRENAJ_Lenght, "Kollektor-drenaj şəbəkəsi")
                            }
                            if (response.DRENAJM_CHECK) {
                                FilterAppent(response.DRENAJM_Count, response.DRENAJM_Lenght, "Kollektor-drenaj şəbəkəsi: Magistral kollektorlar")
                            }
                            if (response.DRENAJK_CHECK) {
                                FilterAppent(response.DRENAJK_Count, response.DRENAJK_Lenght, "Kollektor-drenaj şəbəkəsi: İlkin drenlər")
                            }
                            if (response.DRENAJI_CHECK) {
                                FilterAppent(response.DRENAJI_Count, response.DRENAJI_Lenght, "Kollektor-drenaj şəbəkəsi: I dərəcəli kollektorlar")
                            }
                            if (response.DRENAJII_CHECK ) {
                                FilterAppent(response.DRENAJII_Count, response.DRENAJII_Lenght, "Kollektor-drenaj şəbəkəsi: II dərəcəli kollektorlar")
                            }
                            if (response.DEVICE_CHECK) {
                                FilterAppent(response.DEVICE_count, response.DEVICE_lenght, "Hidrotexniki qurğular")
                            }
                            if (response.ARTEZIAN_CHECK) {
                                FilterAppent(response.ARTEZIAN_COUNT, response.ARTEZIAN_lenght, "Artezian quyular")
                            }
                            if (response.WELL_CHECK) {
                                FilterAppent(response.WELL_Count, response.WELL_lenght, "Quyular")
                            }
                            if (response.PUMPSTATION_CHECK ) {
                                FilterAppent(response.PUMPSTATION_Count, response.PUMPSTATION_lenght, "Nasos stansiyaları")
                            }
                            if (response.WINTERPASTURES_CHECK ) {
                                FilterAppent(response.WINTERPASTURES_count, response.WINTERPASTURES_length, "Qış otlaqlarının su təminatı sistemləri")
                            }
                            if (response.RIVERBAND_CHECK ) {
                                FilterAppent(response.RIVERBAND_count, response.RIVERBAND_lenght, "Mühafizə bəndləri")
                            }
                            if (response.BUILDINGS_CHECK ) {
                                FilterAppent(response.BUILDINGS_count, response.BUILDINGS_lenght, "Binalar və tikililər")
                            }
                            if (response.EXPLONATION_ROAD_CHECK) {
                                FilterAppent(response.EXPLONATION_ROAD_count, response.EXPLONATION_ROAD_lenght, "İstismar yolları")
                            }
                        }
                    }
                })
            }
        }        
    });
}


//Filter result append function
function FilterAppent(count, lenght, name) {

    $("#_FilterResult tbody").append("<tr> <td>" + name + "</td> <td>" + count + "</td> <td>" + lenght + "</td> </tr>")
}


//map function
MapFunction();

var def = "";
$("#search-input").bind("keyup focusin",function () {
    if (def != $(this).val() && $(this).val().length >=3 ) {
        $.ajax({
            url: "/Home/Search",
            data: { name: $(this).val()},
            method: "post",
            type: "JSON",
            success: function (response) {
                console.log(response)
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








