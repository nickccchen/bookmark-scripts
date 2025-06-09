(function(){
    const cityPlans = [
        {value: 'all,all', name: '01 全市'},
        {value: '02,01', name: '02 八德(八德地區)都市計畫'},
        {value: '01,02', name: '03 八德(大湳地區)都市計畫'},
        {value: '21,03', name: '04 大園(菓林地區)都市計畫'},
        {value: '14,04', name: '05 大園都市計畫'},
        {value: '19,06', name: '06 大溪都市計畫'},
        {value: '33,05', name: '07 大溪鎮(埔頂地區)都市計畫'},
        {value: '12,07', name: '08 小烏來風景特定區計畫'},
        {value: '29,10', name: '09 中壢(龍岡地區)都市計畫'},
        {value: '10,09', name: '10 中壢市(過嶺地區)楊梅鎮(高榮地區)新屋鄉(頭洲地區)觀音鄉(富源地區)都市計畫'},
        {value: '23,08', name: '11 中壢平鎮都市計畫'},
        {value: '13,21', name: '12 巴陵拉拉山風景特定區計畫'},
        {value: '26,11', name: '13 平鎮(山子頂地區)都市計畫'},
        {value: '32,12', name: '14 石門水庫水源特定區計畫'},
        {value: '31,13', name: '15 石門都市計畫'},
        {value: '27,14', name: '16 林口特定區計畫'},
        {value: '34,15', name: '17 南崁地區都市計畫'},
        {value: '22,16', name: '18 桃園市都市計畫'},
        {value: '04,17', name: '19 桃園航空貨運園區暨客運園區(大園南港地區)特定區計畫'},
        {value: '00,34', name: '20 桃園國際機場園區及附近地區特定區計畫'},
        {value: '28,18', name: '21 高速公路中壢及內壢交流道附近特定區計畫'},
        {value: '03,20', name: '22 高速鐵路桃園車站特定區計畫'},
        {value: '16,22', name: '23 復興都市計畫'},
        {value: '11,23', name: '24 新屋都市計畫'},
        {value: '17,24', name: '25 楊梅都市計畫'},
        {value: '30,25', name: '26 楊梅鎮(富岡、豐野地區)都市計畫'},
        {value: '18,26', name: '27 龍壽、迴龍地區都市計畫'},
        {value: '20,27', name: '28 龍潭都市計畫'},
        {value: '24,28', name: '29 龜山都市計畫'},
        {value: '25,29', name: '30 縱貫公路桃園內壢間都市計畫'},
        {value: '07,30', name: '31 蘆竹鄉(大竹地區)都市計畫'},
        {value: '05,31', name: '32 觀音(草漯地區)都市計畫'},
        {value: '08,33', name: '33 觀音(新坡地區)都市計畫'},
        {value: '09,32', name: '34 觀音都市計畫'}
    ];

    require(["esri/config"], function(esriConfig) {
        esriConfig.defaults.io.corsEnabledServers.push("uparcgis.tycg.gov.tw");
    });

    let stopFlag = false;
    $(document).keydown(function(e){
        if(e.key === "Escape"){
            stopFlag = true;
            alert("❌已手動中斷執行！");
        }
    });

    async function processCityPlans(plans) {
        for(let i = 0; i < plans.length; i++){
            if(stopFlag) {
                alert("❌已手動中斷執行！");
                break;
            }

            const plan = plans[i];
            console.log(`🔄 正在處理：${plan.name}`);

            $('#ddlConditionCityplan')
                .val(plan.value)
                .trigger('chosen:updated')
                .change();

            await new Promise(resolve => setTimeout(resolve, 1500));

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

                        console.log(`✅ ${plan.name}-使用分區.txt 已下載！`);
                    }else{
                        alert(`❌ ${plan.name} 的XHR資料回應不正確`);
                    }
                    resolve();
                });
            });

            await new Promise(resolve => setTimeout(resolve, 500));
        }
        alert("🎉 所有都市計畫區資料已完成下載！");
    }

    processCityPlans(cityPlans);

})();
