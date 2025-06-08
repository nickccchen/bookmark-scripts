(async function () {
    const plans = [
        "全市",
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

    let stopFlag = false;
    $(document).keydown(function (e) {
        if (e.key === "Escape") {
            stopFlag = true;
            alert("❌ 已手動中斷執行！");
        }
    });

    async function setDropdown(value) {
        $("#ddlConditionCityplan").val(value).trigger("chosen:updated").change();
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    async function fetchSubZones(plan, idx) {
        const data = Array.from($("#ddlConditionUse option")).map(opt => opt.text).filter(t => t.trim());
        const content = data.join("\n");
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const fileName = `${String(idx + 1).padStart(2, '0')} ${plan}-使用分區.txt`;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    for (let i = 0; i < plans.length; i++) {
        if (stopFlag) break;
        
        await setDropdown(plans[i]);
        await fetchSubZones(plans[i], i);
        console.log(`✅ 已完成 ${plans[i]} 的資料擷取與存檔 (${i + 1}/${plans.length})`);
    }

    if (!stopFlag) alert("🎉 全部資料擷取與存檔已完成！");
})();
