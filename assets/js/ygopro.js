function download_allimg() {
    $.getJSON("ygopro_pics/cardData.json", function(data){
        // $.each(data, function(i, item){    
        //     alert(i);
        //     alert(item);
        // });
        obj = data[27551]
        langString["zh"]["Default"]["type"] = obj["type"][0][0];
        langString["zh"]["Default"]["type2"] = obj["type"][0][1];
        langString["zh"]["Default"]["attr"] = obj["attribute"];
        langString["zh"]["Default"]["eff1"] = obj["type"][0][2];
        langString["zh"]["Default"]["eff2"] = obj["type"][0][3];
        langString["zh"]["Default"]["race"] = obj["race"];
        langString["zh"]["Default"]["pendulum"] = obj["type"][0][4];
        langString["zh"]["Default"]["special"] = obj["type"][0][5];
        langString["zh"]["Default"]["level"] = obj["level"];
        langString["zh"]["Default"]["blue"] = obj["blue"];
        langString["zh"]["Default"]["red"] = obj["red"];
        langString["zh"]["Default"]["atk"] = obj["atk"];
        langString["zh"]["Default"]["def"] = obj["def"];
        langString["zh"]["Default"]["title"] = obj["title"];
        langString["zh"]["Default"]["info"] = obj["infoText"];
        langString["zh"]["Default"]["pInfo"] = obj["pendulumText"];
        langString["zh"]["Default"]["size"] = String(obj["size"]);
        langString["zh"]["Default"]["pSize"] = obj["pSize"][0][1];
        for(var i=0; i<9; i++)
            langString["zh"]["Default"]["link"+i] = obj["link"+i]; 
        langString["zh"]["Default"]["color"] = obj["color"];
        langString["zh"]["Default"]["rare"] = obj["rare"];
        langString["zh"]["Default"]["holo"] = obj["holo"];
    });
}