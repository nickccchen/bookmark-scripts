// 跨域伺服器設定（ArcGIS API）
require(["esri/config"], function(esriConfig) {
    esriConfig.defaults.io.corsEnabledServers.push("uparcgis.tycg.gov.tw");
});

// 設定選單
$('#ddlConditionCityplan')
    .val('all,all')
    .trigger('chosen:updated')
    .change();

// DOM驗證
setTimeout(function(){
    if($("#ddlConditionCityplan").val() !== "all,all"){
        alert("❌選單未成功設定");
    } else {
        alert("✅選單已成功設定，開始擷取使用分區資料...");
    }
}, 1000);

// ESC中斷功能
let stopFlag = false;
$(document).keydown(function(e){
    if(e.key === "Escape"){
        stopFlag = true;
        alert("❌已手動中斷執行！");
    }
});

// XHR監聽成功處理與失敗處理
$(document).ajaxComplete(function(event, xhr, settings){
    if(stopFlag) return; //手動中斷邏輯
    if(settings.url.includes('datahandler.ashx')){
        if(xhr.status === 200 && xhr.responseText){
            console.log("✅成功取得資料:", xhr.responseText);
            const data = JSON.parse(xhr.responseText);

            // 提取使用分區選項並整理成文字
            const landUses = data.DATA.map(item => item.LANDUSE).join('\n');

            // 自動建立下載連結並下載檔案
            const blob = new Blob([landUses], { type: 'text/plain;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '01 全市-使用分區.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert("✅「01 全市-使用分區.txt」已成功下載！");
        }else{
            alert("❌XHR資料回應不正確：" + xhr.status);
        }
    }
});

$(document).ajaxError(function(event, xhr, settings){
    if(settings.url.includes('datahandler.ashx')){
        alert("❌XHR請求失敗：" + xhr.status);
    }
});
