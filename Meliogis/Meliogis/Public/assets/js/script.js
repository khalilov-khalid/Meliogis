
//$(document).ready(function () {
//    console.log("ready!");
//    var x = [1, 2, 59, 4, 8];
//    $.ajax({
//        url: "/Home/test",
//        data: { id: x },
//        method: "post",
//        type: "JSON",
//        success: function (response) {
//            console.log(response)
//        }
//    })
//});



$("._inputFilter").on("keyup", function () {
    var keyword = $(this).val().toLowerCase();
    var arrayTEst = $(this).next().find("li");
    console.log(keyword)
    for (var i = 0; i < $(this).next().find("li").length; i++) {        
        if ($($(this).next().find("li")[i]).find("label").text().toLowerCase().includes(keyword)) {
            $($(this).next().find("li")[i]).removeAttr("hidden")
            console.log($($(this).next().find("li")[i]).find("label").text().toLowerCase())
        }
        else {
            $($(this).next().find("li")[i]).attr("hidden","hidden")
        }
    }
})

$("._regions").on("click", function () {
    console.log(this.id);
    //butun regionlarin activ edilmesi ve deactiv edilmesi
    if (this.id == 0) {
        var allcheckboxs = $("._regions");
        //regionda hamisi duymesine basanda,eger secilise butun region bolmesindeki checkbosla secilmis kimi gosterir.
        if ($(this).is(":checked")) {            
            for (var i = 0; i < allcheckboxs.length; i++) {
                $(allcheckboxs[i]).prop("checked", true);
            }
        }//eger secilmeyibse hamisini deaktiv kimi gosterir.
        else {
            for (var i = 0; i < allcheckboxs.length; i++) {
                $(allcheckboxs[i]).prop("checked", false);
            }
        }
    } else {
        //eger hamisi secilibse asagilardan neyise deaktiv edende "hamisi" da deaktiv olur.
        if ($("._regions[id=0]").is(":checked")) {
            $("._regions[id=0]").prop("checked", false);
        }
    }
    var selectedRegions = [];
    var allRegionsInput = $("._regions");
    for (var i = 0; i < allRegionsInput.length; i++) {
        if ($(allRegionsInput[i]).is(":checked")) {
            selectedRegions.push(parseInt(allRegionsInput[i].id))
        }
    }
    if (selectedRegions.length != 0) {
        $.ajax({
            url: "/Home/GetVilliage",
            data: { _regions: selectedRegions },
            method: "post",
            type: "JSON",
            success: function (response) {
                $("#_villiageContent li").remove();
                for (var i = 0; i < response.length; i++) {
                    var villiageHTML = "<li class='menu-item'>"
                        + "<div class='ckbox'>"
                        + "<input type='checkbox' class='_villiages' name='village' id='" + response[i].OBJECTID + "'>"
                        + "<label for='" + response[i].OBJECTID + "'>" + response[i].NAME + "</label>"
                        + "</div>"
                        + "</li>"

                    $("#_villiageContent").append(villiageHTML);
                }

            }
        })
    }
    else {
        $("#_villiageContent li").remove();
    }

});







$("._property").on("click", function () {
    console.log(this.id);
    //butun regionlarin activ edilmesi ve deactiv edilmesi
    if (this.id == "ssi_0") {
        var allcheckboxsproperty = $("._property");
        //regionda hamisi duymesine basanda,eger secilise butun region bolmesindeki checkbosla secilmis kimi gosterir.
        if ($(this).is(":checked")) {
            for (var i = 0; i < allcheckboxsproperty.length; i++) {
                $(allcheckboxsproperty[i]).prop("checked", true);
            }
        }//eger secilmeyibse hamisini deaktiv kimi gosterir.
        else {
            for (var i = 0; i < allcheckboxsproperty.length; i++) {
                $(allcheckboxsproperty[i]).prop("checked", false);
            }
        }
    } else {
        //eger hamisi secilibse asagilardan neyise deaktiv edende "hamisi" da deaktiv olur.
        console.log("salam")
        if ($("._property[id=ssi_0]").is(":checked")) {
            $("._property[id=ssi_0]").prop("checked", false);
        }
    }
    var selectedpropertys = [];
    var allPropertyInput = $("._property");
    for (var i = 0; i < allPropertyInput.length; i++) {
        if ($(allPropertyInput[i]).is(":checked")) {
            console.log(parseInt(allPropertyInput[i].getAttribute("data-id")))
            selectedpropertys.push(parseInt(allPropertyInput[i].getAttribute("data-id")))
        }
    }
    if (selectedpropertys.length != 0) {
        $.ajax({
            url: "/Home/GetSibs",
            data: { _propery: selectedpropertys },
            method: "post",
            type: "JSON",
            success: function (response) {
                $("#_SibsContent li").remove();
                for (var i = 0; i < response.length; i++) {
                    var sibHTML = "<li class='menu-item'>"
                        + "<div class='ckbox'>"
                        + "<input type='checkbox' class='_sibs' name='sibs' data-sib='" + response[i].OBJECTID+"' id='sib_" + response[i].OBJECTID + "'>"
                        + "<label for='sib_" + response[i].OBJECTID + "'>" + response[i].NAME + "</label>"
                        + "</div>"
                        + "</li>"

                    $("#_SibsContent").append(sibHTML);
                }

            }
        })
    }
    else {
        $("#_SibsContent li").remove();
    }

});


$("._change").on("change", function () {
    if ($(this).val() == 1) {
        $("#_DeviceDrenaj").attr("hidden", "hidden");
        $("#_DeviceChannel").removeAttr("hidden");
        
    }
    else if ($(this).val() == 3) {
        $("#_DeviceChannel").attr("hidden", "hidden");
        $("#_DeviceDrenaj").removeAttr("hidden");
    }
    else {
        $("#_DeviceDrenaj").attr("hidden", "hidden");
        $("#_DeviceChannel").attr("hidden", "hidden");
    }
})


