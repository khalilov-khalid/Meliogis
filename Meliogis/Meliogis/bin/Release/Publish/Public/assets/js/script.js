
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



