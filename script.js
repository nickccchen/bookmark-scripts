require(["esri/config"], function(esriConfig) {
    esriConfig.defaults.io.corsEnabledServers.push("uparcgis.tycg.gov.tw");
});

// 選單設定示範
$('#ddlConditionCityplan')
    .val('all,all')
    .trigger('chosen:updated')
    .change();

// 確認設定成功驗證步驟
setTimeout(function(){
    if($("#ddlConditionCityplan").val() !== "all,all"){
        alert("❌選單未成功設定");
    } else {
        alert("✅選單已成功設定");
    }
}, 1000);

// 後續可加入XHR監聽，進一步處理
$(document).ajaxComplete(function(event, xhr, settings){
    if(settings.url.includes('datahandler.ashx')){
        console.log("成功從uparcgis取得資料:", xhr.responseText);
        // 後續處理你的xhr.responseText
    }
});
