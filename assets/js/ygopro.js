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
    var count = 0; 
    dt = [dt[2],dt[0],dt[1]].join('_')
    $("#prgText").html('　'); prgChange(-1); $('#modalProgress').modal('show');

    var interval = setInterval(function(){
        if(count>=keyname.length){
            clearInterval(interval);
            $("#prgText").html('檔案壓縮中...');  //進度條Log
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                $("#prgText").html('壓縮完成！');  //進度條Log
                setTimeout(function(){ $('#modalProgress').modal('hide');}, 500); //進度條
                saveAs(content, "ygoproPics_ZHTW_" + dt + ".zip");
            });
        }
        else{       
            $("#prgText").html((count+1) + ': ' + keyname[count] + ' "' + data[keyname[count]]['title'] + '" 繪製中');  //進度條Log
            $('#cardKey').val(keyname[count])
            loadingCardContent();
            setTimeout(function(){
                image = canvas.toDataURL("image/jpeg").split('base64,')[1]
                img.file(keyname[count]+".jpg", image, {base64: true});                
                $("#prgText").html((count+1) + ': ' + keyname[count] + ' "' + data[keyname[count]]['title'] + '" 已存檔'); //進度條Log
                prgChange(count); //進度條
                count++;
            },800)
        } 
    }, 1100);
}

function prgChange(num){
    $("#progress").css("width",((num+1)/keyname.length*100).toFixed(2)+"%");
    $("#progress").html(((num+1)/keyname.length*100).toFixed(2)+"%");
}