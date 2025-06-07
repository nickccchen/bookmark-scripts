(async function(){
    // 都市計畫區選單設定
    $("#ddlConditionCityplan")
        .val("all,all")
        .trigger("chosen:updated")
        .change();

    // 等待 XHR 請求完成
    function waitXHR(urlFragment){
        return new Promise((resolve)=>{
            $(document).ajaxComplete(function(event, xhr, settings){
                if(settings.url.includes(urlFragment)){
                    resolve(xhr);
                }
            });
        });
    }

    // 驗證步驟①：選單是否設定完成
    await new Promise(resolve => setTimeout(resolve, 1000));
    if($("#ddlConditionCityplan").val() !== "all,all"){
        alert("❌ 選單設定失敗，請檢查！");
        return;
    }

    // 驗證步驟②：等待XHR回傳資料（datahandler.ashx）
    const xhr = await waitXHR('datahandler.ashx');
    if(xhr.status !== 200){
        alert("❌ 請求失敗！");
        return;
    }

    // 驗證步驟③：解析並顯示回傳資料
    const responseData = JSON.parse(xhr.responseText);
    console.log("✅ 成功取得資料：", responseData);
    alert("✅ 成功取得資料，請查看Console輸出內容");
})();
