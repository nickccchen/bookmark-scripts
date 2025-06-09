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

// 都市計畫區選項 (依上傳檔案)
const cityPlans = [
    "all,all",
    "八德(八德地區)都市計畫",
    "八德(大湳地區)都市計畫",
    "大園(菓林地區)都市計畫",
    "大園都市計畫",
    "大溪都市計畫",
    "大溪鎮(埔頂地區)都市計畫",
    "小烏來風景特定區計畫",
    "中壢(龍岡地區)都市計畫",
    "中壢市(過嶺地區)楊梅鎮(高榮地區)新屋鄉(頭洲地區)觀音鄉(富源地區)都市計畫",
    "中壢平鎮都市計畫",
    "巴陵拉拉山風景特定區計畫",
    "平鎮(山子頂地區)都市計畫",
    "石門水庫水源特定區計畫",
    "石門都市計畫",
    "林口特定區計畫",
    "南崁地區都市計畫",
    "桃園市都市計畫",
    "桃園航空貨運園區暨客運園區(大園南港地區)特定區計畫",
    "桃園國際機場園區及附近地區特定區計畫",
    "高速公路中壢及內壢交流道附近特定區計畫",
    "高速鐵路桃園車站特定區計畫",
    "復興都市計畫",
    "新屋都市計畫",
    "楊梅都市計畫",
    "楊梅鎮(富岡、豐野地區)都市計畫",
    "龍壽、迴龍地區都市計畫",
    "龍潭都市計畫",
    "龜山都市計畫",
    "縱貫公路桃園內壢間都市計畫",
    "蘆竹鄉(大竹地區)都市計畫",
    "觀音(草漯地區)都市計畫",
    "觀音(新坡地區)都市計畫",
    "觀音都市計畫"
];

async function fetchAndSaveLandUse(plan, index) {
    if (stopFlag) return;

    $('#ddlConditionCityplan')
        .val(plan)
        .trigger('chosen:updated')
        .change();

    console.log(`🚩正在設定選單為『${plan}』 (${index+1}/${cityPlans.length})`);

    await new Promise(resolve => setTimeout(resolve, 3000));

    if ($("#ddlConditionCityplan").val() !== plan) {
        alert(`❌『${plan}』選單未成功設定！`);
        return;
    }

    await new Promise(resolve => {
        $(document).one('ajaxComplete', function(event, xhr, settings) {
            if (settings.url.includes('datahandler.ashx')) {
                if (xhr.status === 200 && xhr.responseText) {
                    const data = JSON.parse(xhr.responseText);
                    const landUses = data.DATA.map(item => item.LANDUSE).join('\n');

                    const blob = new Blob([landUses], { type: 'text/plain;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${String(index+1).padStart(2, '0')} ${plan}-使用分區.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    console.log(`✅『${plan}』使用分區已下載 (${index+1}/${cityPlans.length})`);
                    alert(`✅『${plan}』使用分區已下載 (${index+1}/${cityPlans.length})`);
                } else {
                    alert(`❌XHR資料回應不正確：${xhr.status} - ${plan}`);
                }
                resolve();
            }
        });

        $(document).one('ajaxError', function(event, xhr, settings) {
            if (settings.url.includes('datahandler.ashx')) {
                alert(`❌XHR請求失敗：${xhr.status} - ${plan}`);
                resolve();
            }
        });
    });
}

async function executeSequentially() {
    for (let i = 0; i < cityPlans.length; i++) {
        if (stopFlag) {
            alert("❌已手動中斷整體執行！");
            break;
        }
        await fetchAndSaveLandUse(cityPlans[i], i);
    }
    if (!stopFlag) {
        alert("🎉全部都市計畫區使用分區資料已完成下載！");
        console.log("🎉全部都市計畫區使用分區資料已完成下載！");
    }
}

// 開始執行
setTimeout(executeSequentially, 1000);
