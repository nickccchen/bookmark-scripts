// 跨域伺服器設定（ArcGIS API）
require(["esri/config"], function(esriConfig) {
    esriConfig.defaults.io.corsEnabledServers.push("uparcgis.tycg.gov.tw");
});

// 中斷標記功能
let stopFlag = false;
$(document).keydown(function(e){
    if(e.key === "Escape"){
        stopFlag = true;
        alert("❌ 已手動中斷執行！");
    }
});

// 都市計畫區選項陣列
const cityPlanOptions = [
    { value: "all,all", name: "01 全市" },
    { value: "八德(八德地區)都市計畫", name: "02 八德(八德地區)都市計畫" },
    { value: "八德(大湳地區)都市計畫", name: "03 八德(大湳地區)都市計畫" },
    { value: "大園(菓林地區)都市計畫", name: "04 大園(菓林地區)都市計畫" },
    { value: "大園都市計畫", name: "05 大園都市計畫" },
    { value: "大溪都市計畫", name: "06 大溪都市計畫" },
    { value: "大溪鎮(埔頂地區)都市計畫", name: "07 大溪鎮(埔頂地區)都市計畫" },
    { value: "小烏來風景特定區計畫", name: "08 小烏來風景特定區計畫" },
    { value: "中壢(內壢地區)都市計畫", name: "09 中壢(內壢地區)都市計畫" },
    { value: "中壢都市計畫", name: "10 中壢都市計畫" },
    { value: "中壢平鎮擴大都市計畫", name: "11 中壢平鎮擴大都市計畫" },
    { value: "中壢市(龍岡地區)都市計畫", name: "12 中壢市(龍岡地區)都市計畫" },
    { value: "五酒桶山風景特定區計畫", name: "13 五酒桶山風景特定區計畫" },
    { value: "平鎮都市計畫", name: "14 平鎮都市計畫" },
    { value: "桃園(埔子地區)都市計畫", name: "15 桃園(埔子地區)都市計畫" },
    { value: "桃園都市計畫", name: "16 桃園都市計畫" },
    { value: "南崁地區都市計畫", name: "17 南崁地區都市計畫" },
    { value: "桃園航空貨運園區都市計畫", name: "18 桃園航空貨運園區都市計畫" },
    { value: "桃園國際機場園區都市計畫", name: "19 桃園國際機場園區都市計畫" },
    { value: "高速公路中壢交流道附近特定區計畫", name: "20 高速公路中壢交流道附近特定區計畫" },
    { value: "高速鐵路桃園車站特定區計畫", name: "21 高速鐵路桃園車站特定區計畫" },
    { value: "復興都市計畫", name: "22 復興都市計畫" },
    { value: "新屋都市計畫", name: "23 新屋都市計畫" },
    { value: "楊梅(埔心地區)都市計畫", name: "24 楊梅(埔心地區)都市計畫" },
    { value: "楊梅都市計畫", name: "25 楊梅都市計畫" },
    { value: "楊梅新市鎮特定區計畫", name: "26 楊梅新市鎮特定區計畫" },
    { value: "楊梅高榮特定區計畫", name: "27 楊梅高榮特定區計畫" },
    { value: "蘆竹(南崁地區)都市計畫", name: "28 蘆竹(南崁地區)都市計畫" },
    { value: "蘆竹都市計畫", name: "29 蘆竹都市計畫" },
    { value: "觀音都市計畫", name: "30 觀音都市計畫" }
];

let currentIndex = 0;

function setCityPlanOption(index) {
    const option = cityPlanOptions[index];
    const selectOption = $("#ddlConditionCityplan option").filter(function() {
        return $(this).text().trim() === option.value;
    });

    if(selectOption.length === 0) {
        alert(`❌ 找不到選項: ${option.value}`);
        return;
    }

    $('#ddlConditionCityplan')
        .val(selectOption.val())
        .trigger('chosen:updated')
        .change();

    console.log(`🔄 設定都市計畫區: ${option.value}`);

    setTimeout(() => verifySelection(option, index), 1500);
}

function verifySelection(option, index) {
    if ($("#ddlConditionCityplan").val() !== option.value) {
        alert(`❌ 選單未成功設定: ${option.name}`);
        return;
    }

    console.log(`✅ 都市計畫區設定成功: ${option.name}，等待資料回應...`);
}

$(document).ajaxComplete(function(event, xhr, settings){
    if (stopFlag) return;
    if(settings.url.includes('datahandler.ashx')){
        if(xhr.status === 200 && xhr.responseText){
            const data = JSON.parse(xhr.responseText);
            const landUses = data.DATA.map(item => item.LANDUSE).join('\n');

            // 建立下載連結並下載檔案
            const blob = new Blob([landUses], {type:'text/plain;charset=utf-8;'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = cityPlanOptions[currentIndex].name + "-使用分區.txt";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert(`✅ 「${cityPlanOptions[currentIndex].name}-使用分區.txt」已下載完成！`);

            currentIndex++;

            if (currentIndex < cityPlanOptions.length && !stopFlag) {
                setTimeout(() => setCityPlanOption(currentIndex), 2000);
            } else {
                alert("🎉 所有都市計畫區資料擷取完成！");
            }
        } else {
            alert(`❌ XHR資料回應不正確：狀態碼 ${xhr.status}`);
        }
    }
});

$(document).ajaxError(function(event, xhr, settings){
    if(settings.url.includes('datahandler.ashx')){
        alert(`❌ XHR請求錯誤，狀態碼：${xhr.status}`);
    }
});

// 開始執行
setCityPlanOption(currentIndex);
