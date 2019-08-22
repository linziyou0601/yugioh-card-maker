var data;
var keyname=[];
$.getJSON("ygopro_pics/cardData.json", function(jsonObj){
    data = jsonObj;
    keyname=Object.keys(data)
});

function download_ygoimg(id) {
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

function isKey(id) {
    return ($.inArray(id, keyname)==-1? false: true)
}