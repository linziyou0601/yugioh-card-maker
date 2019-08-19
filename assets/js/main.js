var canvas = document.getElementById('yugiohcard'),
    ctx = canvas.getContext('2d'),			
    imageURLs=[];
var imgs=[], imagesOK=0;// 已加載的圖片會放進imgs[]裡
var Effect=false, Pendulum=false, holo=true, cardTitle="", cardAttr="", cardType="", cardSubType="", cardEffType="",
    cardThrType="", typeText="", level=0, ATK="?", DEF="?", redSC=1, blueSC=12, pendulumInfoText="", infoText="",
    fontSize=28, fontSize2=22, titleColor="", Special="", cardImg="", rare=0;
var LangInit = {"zh": false, "jp": false, "en": false}

//載入網頁
$(function(){
    $('#modalLoading').modal('show');
    toggleLink();
    togglePendulum();
})
$(window).on("load", function () {
    setTimeout(function() {
        $('#modalLoading').modal('hide');
    }, 500);
    languageInit("zh");
    setInterval(loadingCardContent, 1500);
}); 

//載入卡片資料
function loadingCardContent(){
    //語言
    Lang = $('#cardLang').val();
    //----------------------------------//
    //卡片資料
    cardTitle = $('#cardTitle').val(); //卡片標題
    cardImg = $('#cardImg').val()? URL.createObjectURL($('#cardImg')[0].files[0]): ""; //卡片圖案
    cardTitleColor = $('#titleColor').val(); //標題顏色
    rare = $('#cardRare').val(); //卡片稀有度
    holo = $('#holo').prop('checked'); //防偽貼
    cardAttr = $('#cardType').val()=="monster"? $('#cardAttr').val(): $('#cardType').val();
    cardType = $('#cardType').val(); //卡片類型
    cardSubType = $('#cardSubType').val(); //子類別
        //怪獸卡//
        cardEffType = $('#cardEffType').val(); //效果怪獸類型
        cardThrType = $('#cardThrType').val(); //怪獸卡種族
        Effect = cardEffType=="None"? false: true; //怪獸卡種類
        Pendulum = $('#Pendulum').prop('checked'); //怪獸卡種類
        Special = $('#Special').prop('checked'); //限特殊召喚？
        level = $('#cardLevel').val(); //怪獸卡等級
        ATK = String($('#cardATK').val()); //怪獸卡ATK
        DEF = String($('#cardDEF').val()); //怪獸卡DEF
        typeText = langString[Lang]["thrType"][cardThrType] + //種族
                   (Special? langString[Lang]["Sl"]+langString[Lang]["Special"]: "") + //特殊召喚
                   ((cardEffType!="Normal" && cardEffType!="None")? langString[Lang]["Sl"]+langString[Lang]["effType"][cardEffType]: "") + //功能1(效果)
                   ((cardSubType!="Normal" && cardSubType!="Token")? langString[Lang]["Sl"]+langString[Lang]["subType"][cardSubType]: "") + //功能2(子類別)
                   (Pendulum? langString[Lang]["Sl"]+langString[Lang]["Pendulum"]: "") + //功能3(靈擺有無)
                   (Effect? langString[Lang]["Sl"]+langString[Lang]["Effect"]: ""); //功能4(效果有無)
        //靈擺卡//
        redSC = $('#cardRED').val();
        blueSC = $('#cardBLUE').val();
        pendulumInfoText = $('#cardPendulumInfo').val();
        fontSize2 = Number($('#pendulumSize').val());
        //連結卡//
        if(cardSubType=="Link"){
            var count=0;
            for(var i=1; i<=8; i++) count += $('#link'+i).prop('checked');
            DEF = String(count);
        }
        //-----//
    infoText = $('#cardInfo').val(); //卡片說明
    fontSize = Number($('#infoSize').val());
    //----------------------------------//
    cardURL = (cardType!="monster"? cardType: 
                ((cardSubType=="Normal")? (Effect)? "Effect": "Normal": cardSubType))
                + ((Pendulum)? "Pendulum": "");
    imgs=[]; imageURLs=[];
    for(var i=1; i<=8; i++)
        imageURLs.push("images/pic/LINK"+i+".png"); //link角
    imageURLs.push("images/pic/holo.png"); //防偽貼
    imageURLs.push("images/card/"+cardURL+".png"); //卡片種類
    imageURLs.push("images/attr/"+langString[Lang]["Attr"]+"/"+cardAttr+".webp"); //卡片屬性
    imageURLs.push(cardImg==""? "images/default.PNG": cardImg); //卡片圖片
    if(cardType=="monster" || cardSubType!="Normal")
        imageURLs.push("images/pic/" + (cardType!="monster"? cardSubType:
                                       (cardSubType=="Xyz"? "Rank": "Level")) + ".webp"); //等級.魔罠種類

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
    ctx.font = 57+langOffset[Lang]["tS"]+"pt " + fontName[Lang][0];
    ctx.fillStyle = rareColor(rare);
    ctx.fillText(cardTitle, 77+langOffset[Lang]["tX"], 140+langOffset[Lang]["tY"], 750);
    removeShadow();
    //其他資料
    ctx.font = (cardType=="monster"?25:40)-langOffset[Lang]["sS"] + "pt " + fontName[Lang][1];
    ctx.fillStyle = '#000';
    if(cardType=="monster"){ //怪獸卡
        ctx.fillText(langString[Lang]["Ql"]+typeText+langString[Lang]["Qr"], 65+langOffset[Lang]["oX"], 1120+langOffset[Lang]["oY"], 750); //怪獸屬性
        ctx.font = "42pt 'MatrixBoldSmallCaps', " + fontName[Lang][2];
        ctx.textAlign = "right";
        if(ATK.includes("∞") || DEF.includes("∞")) ctx.font = "Bold 34pt 'Times New Roman', " + fontName[Lang][2];
        ctx.fillText(ATK, 719+(Pendulum&&cardSubType=="Link"?5:0), 1355+(Pendulum&&cardSubType=="Link"?6:0), 100); //怪獸ATK
        ctx.fillText(DEF, 920-(Pendulum&&cardSubType=="Link"?12:0), 1355+(Pendulum&&cardSubType=="Link"?6:0), 100); //怪獸DEF.LINK
        ctx.textAlign = "left";
        if(cardSubType!="Link"){ //非連結怪獸
            for(let i=1; i<=level; i++)
                ctx.drawImage(imgs[12], (cardSubType=="Xyz"? (122+(i-1)*63): (817-(i-1)*63)), 181, 58, 58); //怪獸等級.階級
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
                     (cardSubType=='Normal'? "": langString[Lang]["Sp"]) + 
                     langString[Lang]["Qr"], 920+langOffset[Lang]["sX1"], 222+langOffset[Lang]["sY1"]); //魔罠卡
        if(cardSubType!='Normal') ctx.drawImage(imgs[12], 820+langOffset[Lang]["sX2"], 178+langOffset[Lang]["sY2"], 58, 58); //魔罠子類別
    }
    //若開啟靈擺
    if(Pendulum) {ctx.textAlign = "center";
                  ctx.font = "55pt 'MatrixBoldSmallCaps'";
                  ctx.fillText(blueSC, 106, 1040, 60); ctx.fillText(redSC, 895, 1040, 60);
                  pendulumInfoTextFill();}
    //填入卡片說明
    infoTextFill();
}

//填入圖片
function drawCardImg(){
    var cX, cY, cW, cH;
    if(Pendulum){ cX=69; cY=255; cW=862; cH=647;}
    else{ cX=123; cY=268; cW=754; cH=754;}
    iW = imgs[11].width/imgs[11].height*cH;
    iH = imgs[11].height/imgs[11].width*cW;
    if(imgs[11].width<=imgs[11].height) ctx.drawImage(imgs[11], cX, cY-((iH-cH)/2), cW, iH);
    else ctx.drawImage(imgs[11], cX-((iW-cW)/2), cY, iW, cH);
    ctx.drawImage(imgs[9], 0, 0, 1000, 1450);
    ctx.drawImage(imgs[10], 840, 68, 90, 90);
    if(holo) ctx.drawImage(imgs[8], 928, 1371, 44, 46);
}

//填入卡片說明
function infoTextFill(){
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = fontSize + "pt " + fontName[Lang][2];
    wrapText(infoText, 78, 1100 + langOffset[Lang]["oY"] + ((cardType=="monster")? 30: 0), 840, fontSize+langOffset[Lang]["lh"]);
}

//填入靈擺效果
function pendulumInfoTextFill(){
    ctx.textAlign = "left";	
    ctx.textBaseline = "top";
    ctx.font = fontSize2 + "pt " + fontName[Lang][2];
    wrapText(pendulumInfoText, 160, 920+langOffset[Lang]["oY"], 655, fontSize2+langOffset[Lang]["lh"]);
}

//字體效果
function removeShadow(){
    ctx.shadowColor = "#000"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
}
function rareColor(lv){
    switch(lv) {
        case "0":
            return cardTitleColor;
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
            return "#3b2f00";
            break;	
    }
}

//*********************//
//切換語言時
function languageInit(LN){
    if(!LangInit[LN]){
        $('#cardType').val("monster");
        $('#cardSubType').val("Normal");
        $('#cardAttr').val("LIGHT");
        $('#cardEffType').val("Normal");
        $('#cardThrType').val("15");
        $('#Pendulum').prop('checked',true);
        $('#Special').prop('checked',true);
        $('#cardBLUE').val("12");
        $('#cardRED').val("12");
        $('#cardATK').val("?");
        $('#cardDEF').val("?");
        $('#cardTitle').val(langString[LN]["Default"]["title"]);
        $('#cardInfo').val(langString[LN]["Default"]["info"]);
        $('#cardPendulumInfo').val(langString[LN]["Default"]["pInfo"]);
        $('#infoSize').val(langString[LN]["Default"]["size"]);
        $('#pendulumSize').val(langString[LN]["Default"]["pSize"]);
        toggleCardType();
        toggleLink();
        togglePendulum();
        LangInit[LN] = true;
    }
}
//切換稀有度時
function toggleCardRare(){
    if($('#cardRare').val() != 0) $('#mtTitleColor').hide();
    else $('#mtTitleColor').show();
}
//切換卡片種類時
function toggleCardType(){
    if($('#cardType').val()!="monster"){
        $('#areaMonsterAttr').hide(); $('#mtSpecial').hide(); $('#mtCardLevel').hide(); $('#mtCardATK').hide(); $('#mtCardDEF').hide(); $('#mtLink').hide();
    }else{
        $('#areaMonsterAttr').show(); $('#mtSpecial').show(); $('#mtCardLevel').show(); $('#mtCardATK').show(); $('#mtCardDEF').show(); $('#mtLink').hide();
    }
    var str="";
    for (var i=0; i<optType[$('#cardType').val()].length; i++)
        str += "<option value='"+optType[$('#cardType').val()][i][0]+"'"+(i==0?" selected":"")+">"+optType[$('#cardType').val()][i][1]+"</option>";
    $('#cardSubType').html(str);
}
//切換為連結怪獸時
function toggleLink(){
    if($('#cardType').val()=="monster"){
        if($('#cardSubType').val()!="Link"){
            $('#mtLink').hide(); $('#mtCardDEF').show(); $('#mtCardLevel').show();
        }else{
            $('#mtCardDEF').hide(); $('#mtLink').show(); $('#mtCardLevel').hide();
        }
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
$('#cardLang')[0].addEventListener("input", function(){languageInit($('#cardLang').val());});
$('#cardRare')[0].addEventListener("input", toggleCardRare);
$('#cardType')[0].addEventListener("input", toggleCardType);
$('#cardSubType')[0].addEventListener("input", toggleLink);
$('#Pendulum').change(togglePendulum);
$('#cardImg').on('change', imgUploaded());
//*********************//

//下載
function download_img() {
    var MIME_TYPE = "image/jpeg";
    var imgURL = canvas.toDataURL(MIME_TYPE);
    console.log(imgURL);
    var dlLink = document.createElement('a');
    dlLink.download = 'YuGiOh.jpg';
    dlLink.href = imgURL;
    dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
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