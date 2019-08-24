var canvas = document.getElementById('yugiohcard'),
    ctx = canvas.getContext('2d'),			
    imageURLs=[];
var imgs=[], imagesOK=0;// 已加載的圖片會放進imgs[]裡
var Lang="zh", holo=true, cardTitle="", cardAttr="", cardType="", cardType2="", cardEff1="", cardEff2="", cardRace="", 
    Pendulum=false, Special=false, typeText="", level=0, ATK="?", DEF="?", redSC=1, blueSC=12, 
    pendulumInfoText="", infoText="", fontSize=28, fontSize2=22, titleColor="", cardImg="", cardRare=0;
    

//載入網頁
$(function(){
    $('#modalLoading').modal('show');
    toggleLink();
    togglePendulum();
})
$(window).on("load", function () {
    languageInit(Lang);
    setInterval(loadingCardContent, 1500);
}); 

//載入卡片資料
function loadingCardContent(){
    setTimeout(function(){ $('#modalLoading').modal('hide');}, 500);
    //語言
    Lang = $('#cardLang').val();
    //----------------------------------//
    if(Lang=="zh" && isKey($('#cardKey').val())) fill_ygoimg($('#cardKey').val())
    //卡片資料
    cardTitle = $('#cardTitle').val(); //卡片標題
    cardImg = $('#cardImg').val()? URL.createObjectURL($('#cardImg')[0].files[0]): ""; //卡片圖案
    titleColor = $('#titleColor').val(); //標題顏色
    cardRare = $('#cardRare').val(); //卡片稀有度
    holo = $('#holo').prop('checked'); //防偽貼
    cardAttr = $('#cardType').val()=="monster"? $('#cardAttr').val(): $('#cardType').val();
    cardType = $('#cardType').val(); //卡片類型
    cardType2 = $('#cardType2').val(); //子類別
        //怪獸卡//
        cardEff1 = $('#cardEff1').val(); //效果怪獸類型1
        cardEff2 = $('#cardEff2').val(); //效果怪獸類型2
        cardRace = $('#cardRace').val(); //怪獸卡種族
        Pendulum = $('#Pendulum').prop('checked'); //怪獸卡種類
        Special = $('#Special').prop('checked'); //限特殊召喚
        level = $('#cardLevel').val(); //怪獸卡等級
        ATK = String($('#cardATK').val()); //怪獸卡ATK
        DEF = String($('#cardDEF').val()); //怪獸卡DEF
        typeText = langString[Lang]["Race"][cardRace] + //種族
                (Special? langString[Lang]["Sl"]+langString[Lang]["Special"]: "") + //特殊召喚
                ((cardType2>"1")? langString[Lang]["Sl"]+langString[Lang]["Type2"][optMsType["monster"][cardType2][0]]: "") + //卡面種類
                (cardEff1>"1"? langString[Lang]["Sl"]+langString[Lang]["Eff"][cardEff1]: "") + //功能1(效果)
                ((cardEff2>"1"&&cardEff1!=cardEff2)? langString[Lang]["Sl"]+langString[Lang]["Eff"][cardEff2]: "") + //功能2(效果)
                (Pendulum? langString[Lang]["Sl"]+langString[Lang]["Pendulum"]: "") + //功能3(靈擺有無)
                ((cardEff2>="1"&&cardType2!="0")? langString[Lang]["Sl"]+langString[Lang]["Effect"]: ""); //功能4(效果有無)
        //靈擺卡//
        redSC = $('#cardRED').val();
        blueSC = $('#cardBLUE').val();
        pendulumInfoText = $('#cardPendulumInfo').val();
        fontSize2 = Number($('#pendulumSize').val());
        //連結卡//
        if(cardType2=="6"){
            var count=0;
            for(var i=1; i<=8; i++) count += $('#link'+i).prop('checked');
            DEF = String(count);
        }
        //-----//
    infoText = $('#cardInfo').val(); //卡片說明
    fontSize = Number($('#infoSize').val());
    //----------------------------------//
    cardURL = (cardType!="monster"? cardType: optMsType['monster'][cardType2][0]) + ((Pendulum)? "Pendulum": "");
    imgs=[]; imageURLs=[];
    for(var i=1; i<=8; i++)
        imageURLs.push("images/pic/LINK"+i+".png"); //link角
    imageURLs.push("images/pic/holo.png"); //防偽貼
    imageURLs.push("images/card/"+cardURL+".png"); //卡片種類
    imageURLs.push("images/attr/"+langString[Lang]["Attr"]+"/"+cardAttr+".webp"); //卡片屬性
    if(Lang=="zh" && isKey($('#cardKey').val())) imageURLs.push("ygopro_pics/pics/"+$('#cardKey').val()+".jpg"); //卡片圖片
    else imageURLs.push(cardImg==""? "images/default.jpg": cardImg); //卡片圖片
    if(cardType=="monster" || cardType2!="0")
        imageURLs.push("images/pic/" + (cardType!="monster"? optMsType[cardType][cardType2][0]:
                                       (cardType2=="5"? "Rank": "Level")) + ".webp"); //等級.魔罠種類
    restoreData(Lang);
    startLoadingAllImages(imagesAreNowLoaded); //載入圖檔
}

//載入圖片
function startLoadingAllImages(callback){
    for (var i=0; i<imageURLs.length; i++) {
    imgs.push(new Image());
    imgs[i].onload = function(){ 
        imagesOK++;
        if (imagesOK>=imageURLs.length ) setTimeout(callback, 200);
    };
    imgs[i].src = imageURLs[i];
    }      
}

//所有圖片都載入完成
function imagesAreNowLoaded(){
    canvas.width = 1000;
    canvas.height = 1450;
    drawCardImg()
    //卡片標題
    ctx.font = 57+langOffset[Lang]["tS"]+"pt " + [fontName[Lang][0],fontName[Lang][3],fontName[Lang][4],fontName[Lang][5]].join(', ');
    ctx.fillStyle = rareColor(cardRare);
    ctx.fillText(cardTitle, 77+langOffset[Lang]["tX"], 140+langOffset[Lang]["tY"], 750);
    removeShadow();
    //其他資料
    ctx.font = (cardType=="monster"?25:40)-langOffset[Lang]["sS"] + "pt " + fontName[Lang][1];
    ctx.fillStyle = '#000';
    if(cardType=="monster"){ //怪獸卡
        ctx.fillText(langString[Lang]["Ql"]+typeText+langString[Lang]["Qr"], 65+langOffset[Lang]["oX"], 1120+langOffset[Lang]["oY"], 750); //怪獸屬性
        ctx.font = "35pt 'MatrixBoldSmallCaps', " + fontName[Lang][2];
        ctx.textAlign = "right";
        if(ATK.includes("∞") || DEF.includes("∞")) ctx.font = "Bold 34pt 'Times New Roman', " + fontName[Lang][2];
        ctx.fillText(ATK, 719+(Pendulum&&cardType2=="6"?5:0), 1355+(Pendulum&&cardType2=="6"?6:0), 100); //怪獸ATK
        if(cardType2=="6") ctx.font = "31pt 'link', 'MatrixBoldSmallCaps', " + fontName[Lang][2];
        ctx.fillText(DEF, 920, 1355+(Pendulum&&cardType2=="6"?6:0), 100); //怪獸DEF.LINK
        ctx.textAlign = "left";
        if(cardType2!="6"){ //非連結怪獸
            for(let i=1; i<=level; i++)
                ctx.drawImage(imgs[12], (cardType2=="5"? (122+(i-1)*63): (820-(i-1)*63)), 181, 58, 58); //怪獸等級.階級
        }else{ //連結怪獸
            var linkStr = Pendulum? "Pendulum": "Link";
            for(var i=1; i<=8; i++)
                if($('#link'+i).prop('checked'))
                    ctx.drawImage(imgs[i-1], 
                                  linkObj[linkStr]["X"][i-1], 
                                  linkObj[linkStr]["Y"][i-1], 
                                  linkObj[linkStr]["W"][i-1], 
                                  linkObj[linkStr]["H"][i-1]); //連結圖片
        }
    }else{ //魔罠卡
        ctx.textAlign = "right";
        ctx.fillText(langString[Lang]["Ql"] + 
                     (cardType=="Spell"? langString[Lang]["Spell"]: langString[Lang]["Trap"]) + 
                     (cardType2=='0'? "": langString[Lang]["Sp"]) + 
                     langString[Lang]["Qr"], 920+langOffset[Lang]["sX1"], 222+langOffset[Lang]["sY1"]); //魔罠卡
        if(cardType2!='0') ctx.drawImage(imgs[12], 820+langOffset[Lang]["sX2"], 178+langOffset[Lang]["sY2"], 58, 58); //魔罠子類別
    }
    //若有卡片密碼
    if(Lang=="zh" && isKey($('#cardKey').val())){
        ctx.fillStyle = (cardType=="monster"&&cardType2=="5")? '#FFF': '#000';
        ctx.font = "22pt 'cardkey','MatrixBoldSmallCaps', " + fontName[Lang][2];
        ctx.textAlign = "left";
        ctx.fillText(paddingLeft($('#cardKey').val(), 8), 54, 1405); //卡片密碼
    }
    ctx.fillStyle = '#000';
    //若開啟靈擺
    if(Pendulum) {ctx.textAlign = "center";
                  ctx.font = "55pt 'MatrixBoldSmallCaps'";
                  ctx.fillText(blueSC, 106-((cardType2>="6"||cardType!="monster")? 5: 0), 1040, 60); ctx.fillText(redSC, 895, 1040, 60);
                  pendulumInfoTextFill();}
    //防偽貼            
    if(holo) ctx.drawImage(imgs[8], 928, 1371, 44, 46);
    //填入卡片說明
    infoTextFill();
}

//填入底圖、卡圖、屬性
function drawCardImg(){
    var cX, cY, cW, cH;
    if(Pendulum){ cX=69; cY=255; cW=862; cH=647;}
    else{ cX=123; cY=268; cW=754; cH=754;}
    iW = imgs[11].width/imgs[11].height*cH;
    iH = imgs[11].height/imgs[11].width*cW;
    if(imgs[11].width <= imgs[11].height*(Pendulum? 1.33:1)) ctx.drawImage(imgs[11], cX, cY-((iH-cH)/2), cW, iH);
    else ctx.drawImage(imgs[11], cX-((iW-cW)/2), cY, iW, cH);
    ctx.drawImage(imgs[9], 0, 0, 1000, 1450);
    ctx.drawImage(imgs[10], 840, 68, 90, 90);
}

//填入卡片說明
function infoTextFill(){
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = fontSize + "pt " + [fontName[Lang][2],fontName[Lang][3],fontName[Lang][4],fontName[Lang][5]].join(', ');
    wrapText(infoText, 78, 1095 + langOffset[Lang]["oY"] + ((cardType=="monster")? 30: 0), 825, fontSize+langOffset[Lang]["lh"]);
}

//填入靈擺效果
function pendulumInfoTextFill(){
    ctx.textAlign = "left";	
    ctx.textBaseline = "top";
    ctx.font = fontSize2 + "pt " + [fontName[Lang][2],fontName[Lang][3],fontName[Lang][4],fontName[Lang][5]].join(', ');
    wrapText(pendulumInfoText, 160, 920+langOffset[Lang]["oY"], 660, fontSize2+langOffset[Lang]["lh"]);
}

//字體效果
function removeShadow(){
    ctx.shadowColor = "#000"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
}
function rareColor(lv){
    switch(lv) {
        case "0":
            return titleColor;
            break;
        case "1":
            gradient = ctx.createLinearGradient(0, 0, 600, 0);
            gradient.addColorStop("0", "#ffdabf");
            gradient.addColorStop("0.14", "#fff6bf");
            gradient.addColorStop("0.28", "#fffebf");
            gradient.addColorStop("0.42", "#d8ffbf");
            gradient.addColorStop("0.56", "#bfffd4");
            gradient.addColorStop("0.7", "#bffdff");
            gradient.addColorStop("0.84", "#bfe4ff");
            gradient.addColorStop("1", "#bfc2ff");
            return gradient;
            break;
        case "2":
            ctx.shadowColor = "#dcff32";
            ctx.shadowBlur = 1;
            ctx.shadowOffsetX = 0.4;
            ctx.shadowOffsetY = 1.5;
            return "#524100";//"#3b2f00";
            break;	
    }
}

//字串左邊補零
function paddingLeft(str, lenght){
	return (str.length >= lenght)? str: paddingLeft("0" +str,lenght);
}

//*********************//
//儲存目前語言資料
function restoreData(LN){
    langString[LN]["Default"]["type"] = $('#cardType').val();
    langString[LN]["Default"]["type2"] = $('#cardType2').val();
    langString[LN]["Default"]["attr"] = $('#cardAttr').val();
    langString[LN]["Default"]["eff1"] = $('#cardEff1').val();
    langString[LN]["Default"]["eff2"] = $('#cardEff2').val();
    langString[LN]["Default"]["race"] = $('#cardRace').val();
    langString[LN]["Default"]["pendulum"] = $('#Pendulum').prop('checked');
    langString[LN]["Default"]["special"] = $('#Special').prop('checked');
    langString[LN]["Default"]["level"] = $('#cardLevel').val();
    langString[LN]["Default"]["blue"] = $('#cardBLUE').val();
    langString[LN]["Default"]["red"] = $('#cardRED').val();
    langString[LN]["Default"]["atk"] = $('#cardATK').val();
    langString[LN]["Default"]["def"] = $('#cardDEF').val();
    langString[LN]["Default"]["title"] = $('#cardTitle').val();
    langString[LN]["Default"]["info"] = $('#cardInfo').val();
    langString[LN]["Default"]["pInfo"] = $('#cardPendulumInfo').val();
    langString[LN]["Default"]["size"] = $('#infoSize').val();
    langString[LN]["Default"]["pSize"] = $('#pendulumSize').val();
    for(var i=0; i<9; i++)
        langString[LN]["Default"]["link"+i] = $('#link'+i).prop('checked'); 
    langString[LN]["Default"]["color"] = $('#titleColor').val();
    langString[LN]["Default"]["rare"] = $('#cardRare').val();
    langString[LN]["Default"]["holo"] = $('#holo').prop('checked');
}
//切換語言時
function languageInit(LN){
    if(LN=="zh") $("#mtCardKey").show();
    else $("#mtCardKey").hide();
    $('#cardType').val(langString[LN]["Default"]["type"]); 
    toggleCardType();
    $('#cardType2').val(langString[LN]["Default"]["type2"]); 
    $('#cardAttr').val(langString[LN]["Default"]["attr"]); 
    $('#cardEff1').val(langString[LN]["Default"]["eff1"]); 
    $('#cardEff2').val(langString[LN]["Default"]["eff2"]); 
    $('#cardRace').val(langString[LN]["Default"]["race"]); 
    $('#Pendulum').prop('checked', langString[LN]["Default"]["pendulum"]); 
    $('#Special').prop('checked', langString[LN]["Default"]["special"]); 
    $('#cardLevel').val(langString[LN]["Default"]["level"]); 
    $('#cardBLUE').val(langString[LN]["Default"]["blue"]); 
    $('#cardRED').val(langString[LN]["Default"]["red"]); 
    $('#cardATK').val(langString[LN]["Default"]["atk"]); 
    $('#cardDEF').val(langString[LN]["Default"]["def"]); 
    $('#cardTitle').val(langString[LN]["Default"]["title"]); 
    $('#cardInfo').val(langString[LN]["Default"]["info"]); 
    $('#cardPendulumInfo').val(langString[LN]["Default"]["pInfo"]); 
    $('#infoSize').val(langString[LN]["Default"]["size"]); 
    $('#pendulumSize').val(langString[LN]["Default"]["pSize"]);
    for(var i=0; i<9; i++)
        $('#link'+i).prop('checked', langString[LN]["Default"]["link"+i]); 
    $('#titleColor').val(langString[LN]["Default"]["color"]);
    $('#cardRare').val(langString[LN]["Default"]["rare"]);
    $('#holo').prop('checked', langString[LN]["Default"]["holo"]);
    toggleLink();
    togglePendulum();
    toggleCardRare();
}
//切換稀有度時
function toggleCardRare(){
    if($('#cardRare').val() != 0) $('#mtTitleColor').hide();
    else $('#mtTitleColor').show();
}
//切換卡片種類時
function toggleCardType(){
    if($('#cardType').val()!="monster"){
        $("[id^='mtMonster']").hide(); $('#mtSpecial').hide(); $('#mtCardLevel').hide(); $('#mtCardATK').hide(); $('#mtCardDEF').hide(); $('#mtLink').hide();
    }else{
        $("[id^='mtMonster']").show(); $('#mtSpecial').show(); $('#mtCardLevel').show(); $('#mtCardATK').show(); $('#mtCardDEF').show(); $('#mtLink').hide();
    }
    var str="";
    for (var i=0; i<optMsType[$('#cardType').val()].length; i++)
        str += "<option value='"+i+"'>"+optMsType[$('#cardType').val()][i][1]+"</option>";
    $('#cardType2').html(str);
    toogleEffect()
}
//切換為連結怪獸時
function toggleLink(){
    if($('#cardType').val()=="monster"){
        if($('#cardType2').val()!="6"){
            $('#mtLink').hide(); $('#mtCardDEF').show(); $('#mtCardLevel').show();
        }else{
            $('#mtCardDEF').hide(); $('#mtLink').show(); $('#mtCardLevel').hide();
        }
    }
    toogleEffect()
}
//切換通常.效果怪獸時
function toogleEffect(){
    if($('#cardType').val()=="monster"){
        var str="";
        for(var i=0; i< optMsType['Eff2'].length; i++)
            if(!($('#cardType2').val()=="0"&&i==1 || $('#cardType2').val()=="1"&&i==0))
                str += "<option value='"+i+"'>"+optMsType['Eff2'][i]+"</option>";
        $('#cardEff2').html(str);
    }
}
//切換靈擺時
function togglePendulum(){
    if($('#Pendulum').prop('checked')) $('#areaPendulum').show();
    else $('#areaPendulum').hide();
}
//上傳後顯示檔名
function imgUploaded(){
    var fileName = ($('#cardImg').val())? $('#cardImg')[0].files[0].name.replace('C:\\fakepath\\', ""): "上傳圖片";
    $('#cardImg').next('label').html(fileName);
}
//\\
//\\
$('#cardLang')[0].addEventListener("change", function(){languageInit($('#cardLang').val());});
$('#cardRare')[0].addEventListener("change", toggleCardRare);
$('#cardType')[0].addEventListener("change", toggleCardType);
$('#cardType2')[0].addEventListener("change", toggleLink);
$('#Pendulum').change(togglePendulum);
$('#cardImg').on('change', imgUploaded());
//*********************//

//下載
function download_img() {
	if (canvas.msToBlob) { //for IE
		var blob = canvas.msToBlob();
		window.navigator.msSaveBlob(blob, 'YuGiOh.png');
	} else {
        var a = document.createElement('a');
        a.href = canvas.toDataURL("image/jpeg");
        a.download = 'YuGiOh.jpg';
        a.click();
	}
}


//**********Canvas區塊文字***********//
function wrapText(text, x, y, maxWidth, lineHeight) {
    var lineWidth = 0 - ctx.measureText(text[0]).width; //目前佔用行寬
    var fieldWidth = maxWidth; //欄位寬度
    var initHeight= y; //文字距離圖片頂部高度
    var lastSubStrIndex= 0; //每次擷取的子字串起始位置
    for(let i=0; i<text.length; i++){ 
        lineWidth += ctx.measureText(text[i]).width;
        if(lineWidth>fieldWidth || text.substring(i, i+1)=='\n'){ // 
            if(text.substring(i, i+1)=='\n') i++;
            ctx.fillText(text.substring(lastSubStrIndex, i), x, initHeight);//绘制截取部分
            initHeight+=lineHeight; lineWidth=0; lastSubStrIndex=i;
        } 
        if(i==text.length-1){//若本行未超過，位已達最後一字，則直接填入
            ctx.fillText(text.substring(lastSubStrIndex, i+1), x, initHeight);
        }
    }
};
//**********手動換行***********//
/* function wrapText(text, x, y, line_width, line_height)
{
    var line = '';
    var paragraphs = text.split('\n');
    for (var i = 0; i < paragraphs.length; i++)
    {
        var words = paragraphs[i].split(' ');
        for (var n = 0; n < words.length; n++)
        {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > line_width && n > 0)
            {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += line_height;
            }
            else
            {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
        y += line_height;
        line = '';
    }
} */
//*********************//