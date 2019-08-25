var data;
var keyname=[];
$.getJSON("ygopro_pics/cardData.json", function(jsonObj){
    data = jsonObj;
    keyname=Object.keys(data)
});

function isKey(id) {
    return ($.inArray(id, keyname)==-1? false: true)
}

function fill_ygoimg(id) {
    obj = data[id]
    $('#cardType').val(obj["type"][0][0]);
    toggleCardType();
    $('#cardType2').val(obj["type"][0][1]);
    $('#cardAttr').val(obj["attribute"]);
    $('#cardEff1').val(obj["type"][0][2]);
    $('#cardEff2').val(obj["type"][0][3]);
    $('#cardRace').val(obj["race"]);
    $('#Pendulum').prop('checked', obj["type"][0][4]);
    $('#Special').prop('checked', obj["type"][0][5]);
    $('#cardLevel').val(obj["level"]);
    $('#cardBLUE').val(obj["blue"]);
    $('#cardRED').val(obj["red"]);
    $('#cardATK').val(obj["atk"]);
    $('#cardDEF').val(obj["def"]);
    $('#cardTitle').val(obj["title"]);
    $('#cardInfo').val(obj["infoText"]);
    $('#cardPendulumInfo').val(obj["pendulumText"]);
    $('#infoSize').val(obj["size"]);
    $('#pendulumSize').val(obj["pSize"]);
    for(var i=0; i<9; i++)
        $('#link'+i).prop('checked', obj["link"+i]); 
    $('#titleColor').val(obj["color"]);
    $('#cardRare').val(obj["rare"]);
    $('#holo').prop('checked', obj["holo"]);
    toggleLink();
    togglePendulum();
    toggleCardRare();
}

function download_allimg(){
    var dt = new Date().toLocaleDateString('zh-TW', {timeZone: 'Asia/Taipei'}).split('/');
    var zip = new JSZip();
    var img  = zip.folder("pics");
    var count=0, min=0, max=keyname.length; 
    dt = [dt[2],dt[0],dt[1]].join('_')
    Swal.mixin({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2']
    }).queue([
        {title: '從第幾張開始下載？', text: '依卡片密碼順序排序（資料自ygopro提取）'},
        {title: '下載到第幾張為止？', text: '最大值'+keyname.length+'張'}
    ]).then((result) => {
        if(isNaN(result.value[0])) result.value[0]=0;
        if(isNaN(result.value[1])) result.value[1]=keyname.length;
        min = Math.max(Math.min(Number(result.value[0]), Number(result.value[1])), 1) - 1;
        max = Math.min(Math.max(Number(result.value[0]), Number(result.value[1])), keyname.length) - 1;
        count = min;
        clearInterval(autoGenInterval);

        $("#prgText").html('　'); prgChange(count-min-1, max-min+1); $('#modalProgress').modal('show');
        
        var interval = setInterval(function(){
            if(count>max){
                clearInterval(interval);
                autoGenInterval = setInterval(loadingCardContent, 1500);
                $("#prgText").html('檔案壓縮中...');  //進度條Log
                zip.generateAsync({type:"blob"})
                .then(function(content) {
                    setTimeout(function(){ $('#modalProgress').modal('hide');}, 500); //進度條
                    Swal.fire({
                        type: 'success',
                        title: '檔案壓縮完成',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    saveAs(content, "ygoproPics_ZHTW_" + dt + ".zip");
                });
            }
            else{ 
                var countDraw = count //Log用，對照zip時的id
                /*記錄繪圖狀況*/
                console.log('[' + (count-min+1) + '/' + (max-min+1) + '] drawing '+keyname[count]) //console Log
                /*----------*/
                prgChange(count-min, max-min+1); //進度條
                $("#prgText").html((count-min+1) + '/' + (max-min+1) + '<br>' + keyname[count] + ' "' + data[keyname[count]]['title'] + '" 繪製中');  //進度條Log
                $('#cardKey').val(keyname[count])
                loadingCardContent();
                setTimeout(function(){
                    image = canvas.toDataURL("image/jpeg").split('base64,')[1]
                    img.file(keyname[count]+".jpg", image, {base64: true});
                    $("#prgText").html((count-min+1) + '/' + (max-min+1) + '<br>' + keyname[count] + ' "' + data[keyname[count]]['title'] + '" 已存檔'); //進度條Log
                    /*記錄存檔狀況*/
                    if(countDraw!=count) console.error('%c[error][' + (count-min+1) + '/' + (max-min+1) + '] ziping '+keyname[count], 'color: red') //console Log 
                    else console.log('%c[' + (count-min+1) + '/' + (max-min+1) + '] ziping '+keyname[count], 'color: green') //console Log
                    /*----------*/
                    count++;
                },800)
            } 
        }, 1200);
    })
}

function prgChange(num,n){
    $("#progress").css("width",((num+1)/n*100).toFixed(2)+"%");
    $("#progress").html(((num+1)/n*100).toFixed(2)+"%");
}