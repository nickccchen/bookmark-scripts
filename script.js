// 都市計畫區選項列表
const cityPlans = [
  {value: 'all,all', name: '01 全市'},
  {value: '02,01', name: '02 八德(八德地區)都市計畫'},
  {value: '01,02', name: '03 八德(大湳地區)都市計畫'},
  // 依序加入其他都市計畫區...
  {value: '09,32', name: '34 觀音都市計畫'}
];

// 設定跨域伺服器
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

// 核心邏輯（循環處理每個選項）
async function processCityPlans(plans) {
    for(let i = 0; i < plans.length; i++){
        if(stopFlag) {
            console.log("❌ 已手動中斷！");
            break;
        }

        let plan = plans[i];
        console.log(`🔄 正在處理：${plan.name}`);

        $('#ddlConditionCityplan')
            .val(plan.value)
            .trigger('chosen:updated')
            .change();

        await new Promise(resolve => setTimeout(resolve, 1500)); // 等待AJAX完成，確保資料取得

        // XHR 監聽成功處理
        await new Promise((resolve) => {
            $(document).one('ajaxComplete', function(event, xhr, settings){
                if(settings.url.includes('datahandler.ashx') && xhr.status === 200 && xhr.responseText){
                    const data = JSON.parse(xhr.responseText);
                    const landUses = data.DATA.map(item => item.LANDUSE).join('\n');

                    const blob = new Blob([landUses], { type: 'text/plain;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${plan.name}-使用分區.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    console.log(`✅ ${plan.name}-使用分區.txt 已成功下載！`);
                }else{
                    alert(`❌ ${plan.name} 的XHR資料回應不正確`);
                }
                resolve();
            });
        });

        await new Promise(resolve => setTimeout(resolve, 500)); // 進入下一筆之前短暫等待
    }
    alert("🎉 所有都市計畫區資料已完成下載！");
}

// 執行
processCityPlans(cityPlans);
