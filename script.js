// 跨域伺服器設定（ArcGIS API）
require(["esri/config"], function(esriConfig) {
    esriConfig.defaults.io.corsEnabledServers.push("uparcgis.tycg.gov.tw");
});

// ESC中斷功能
let stopFlag = false;
$(document).keydown(function(e){
    if(e.key === "Escape"){
        stopFlag = true;
        alert("❌已手動中斷執行！");
    }
});

// 讀取都市計畫區選項
const cityPlans = [
    "all,all", "八德(八德地區)都市計畫", "八德(大湳地區)都市計畫", "大園(菓林地區)都市計畫",
    "大園都市計畫", "大溪都市計畫", "大溪鎮(埔頂地區)都市計畫", "小烏來風景特定區計畫",
    "中壢(龍岡地區)都市計畫", "中壢市(過嶺地區)楊梅鎮(高榮地區)新屋鄉(頭洲地區)觀音鄉(富源地區)都市計畫",
    "中壢平鎮都市計畫", "巴陵拉拉山風景特定區計畫", "平鎮(山子頂地區)都市計畫", "石門水庫水源特定區計畫",
    "石門都市計畫", "林口特定區計畫", "南崁地區都市計畫", "桃園市都市計畫",
    "桃園航空貨運園區暨客運園區(大園南港地區)特定區計畫", "桃園國際機場園區及附近地區特定區計畫",
    "高速公路中壢及內壢交流道附近特定區計畫", "高速鐵路桃園車站特定區計畫", "復興都市計畫",
    "新屋都市計畫", "楊梅都市計畫", "楊梅鎮(富岡、豐野地區)都市計畫", "龍壽、迴龍地區都市計畫",
    "龍潭都市計畫", "龜山都市計畫", "縱貫公路桃園內壢間都市計畫", "蘆竹鄉(大竹地區)都市計畫",
    "觀音(草漯地區)都市計畫", "觀音(新坡地區)都市計畫", "觀音都市計畫"
];

// 主要執行函數
async function fetchLandUses(){
    for(let i = 0; i < cityPlans.length; i++){
        if(stopFlag) break; // 檢查手動中斷

        let plan = cityPlans[i];

        $('#ddlConditionCityplan')
            .val(plan)
            .trigger('chosen:updated')
            .change();

        console.log(`🚩設定選單為 ${plan} (${i+1}/${cityPlans.length})`);

        // 等待XHR完成
        await new Promise(resolve => setTimeout(resolve, 3000));

        if($("#ddlConditionCityplan").val() !== plan){
            alert(`❌選單未成功設定: ${plan}`);
            continue;
        }

        await new Promise((resolve) => {
            $(document).one('ajaxComplete', function(event, xhr, settings){
                if(settings.url.includes('datahandler.ashx') && xhr.status === 200 && xhr.responseText){
                    let data = JSON.parse(xhr.responseText);
                    let landUses = data.DATA.map(item => item.LANDUSE).join('\n');

                    let blob = new Blob([landUses], { type: 'text/plain;charset=utf-8;' });
                    let url = URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    let fileName = `${String(i+1).padStart(2,'0')} ${plan}-使用分區.txt`;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    console.log(`✅完成 ${fileName} 的資料擷取與存檔 (${i+1}/${cityPlans.length})`);
                    resolve();
                }else{
                    alert(`❌XHR資料回應不正確 (${xhr.status}) - ${plan}`);
                    resolve();
                }
            });
        });

        if(stopFlag) break; //再次檢查手動中斷
    }

    if(stopFlag){
        console.log("❌手動中斷程序已結束");
    } else {
        console.log("🎉全部完成");
    }
}

// 開始執行
setTimeout(fetchLandUses, 1000);
