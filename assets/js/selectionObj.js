var fontName = {'zh':['zh','zh','zh'],
                'jp':['jp2','jp2','jp2'],
                'en':['en','en2','en3']};
var linkObj = { "Link":{
                "X":[85,385,823,72,878,85,383,825], "Y":[230,213,230,528,528,967,1022,967],
                "W":[93,235,93,51,55,93,235,93], "H":[93,54,93,230,230,93,54,93]},
                "Pendulum":{
                "X":[41,413,868,13,935,41,411,870], "Y":[221,204,215,715,715,1308,1372,1308],
                "W":[86,180,86,52,52,90,180,90], "H":[90,51,90,174,174,90,51,90]} }
const optMsType = {
    "monster": [["Normal","通常"], ["Effect","效果"], ["Fusion","融合"], ["Ritual","儀式"],
                ["Synchro","同步"], ["Xyz","超量"], ["Link","連結"], ["Token","衍生物"]],
    "Spell": [["Normal","通常"], ["Continuous","永續"], ["Field","場地"], ["Equip","裝備"], 
              ["Quick","速攻"], ["Ritual","儀式"]],
    "Trap": [["Normal","通常"], ["Continuous","永續"], ["Counter","反擊"]],
    "Eff2": ["無","一般","卡通","靈魂","聯合","二重","反轉","協調"]
}
const langString = {
    "zh": { "Sp": '　',
            "Ql": '【',
            "Qr": '】',
            "Sl": '／',
            "Special": '特殊召喚',
            "Effect": '效果',
            "Pendulum": '靈擺',
            "Type2": {"Fusion": "融合", "Ritual": "儀式", "Synchro": "同步", "Xyz": "超量", "Link": "連結"},
            "Eff": ["","","卡通","靈魂","聯合","二重","反轉","協調"],
            "Race": ["惡魔族","不死族","海龍族","雷族","岩石族","機械族","恐龍族","獸族","昆蟲族","魚族","植物族","獸戰士族","戰士族","鳥獸族","天使族","龍族","爬蟲類族","水族","炎族","魔法師族","幻龍族","網域族","超能族","幻神獸族","創造神族"],
            "Spell": "魔法卡",
            "Trap": "陷阱卡",
            "Attr": "jp",
            "Default": {
                "title": "超天新龍 異色眼革命龍",
                "info": "這張卡不能通常召喚。從手牌的靈擺召喚或者釋放自己場上的龍族的融合．同步．超量怪獸各1隻的場合才能特殊召喚。①：丟棄手牌的這張卡，支付500生命值才能發動。從牌組把1隻8星以下的龍族靈擺怪獸加入手牌。②：這張卡的攻擊力·守備力上升對方一半的生命值。③：1回合1次，支付一半生命值才能發動。這張卡以外的雙方的場上．墓地的卡全部回到持有者牌組。",
                "pInfo": "①：自己不是龍族怪獸不能靈擺召喚。這個效果不會被無效化。②：以自己墓地1隻龍族的融合．同步．超量怪獸為對象才能發動。這張卡破壞，那隻怪獸特殊召喚。",
                "size": 20, "pSize": 22,
                "color": "#000000", "rare": "0", "holo": false,
                "type": "monster", "type2": "1",
                "attr": "LIGHT", "eff1": "1", "eff2": "1", "race": "15",
                "pendulum": true, "special": true, "level": "12",
                "blue": "12", "red": "12", "atk": "?", "def": "?",
                "link1": false, "link2": false, "link3": false, "link4": false, 
                "link5": false, "link6": false, "link7": false, "link8": false
            }
    },
    "jp": { "Sp": '　',
            "Ql": '【',
            "Qr": '】',
            "Sl": '／',
            "Special": '特殊召喚',
            "Effect": '効果',
            "Pendulum": 'ペンデュラム',
            "Type2": {"Fusion": "融合", "Ritual": "儀式", "Synchro": "シンクロ", "Xyz": "エクシーズ", "Link": "リンク"},
            "Eff": ["","","トゥーン","スピリット","ユニオン","デュアル","リバース","チューナー"],
            "Race": ["悪魔族","アンデット族","海竜族","雷族","岩石族","機械族","恐竜族","獣族","昆虫族","魚族","植物族","獣戦士族","戦士族","鳥獣族","天使族","ドラゴン族","爬虫類族","水族","炎族","魔法使い族","幻竜族","サイバース族","サイキック族","幻神獣族","創造神族"],
            "Spell": "魔法カード",
            "Trap": "罠カード",
            "Attr": "jp",
            "Default": {
                "title": "超天新龍オッドアイズ・レボリューション・ドラゴン",
                "info": "このカードは通常召喚できない。手札からのP召喚、または自分フィールドのドラゴン族の融合・S・Xモンスターを１体ずつリリースした場合のみ特殊召喚できる。①：このカードを手札から捨て、５００LPを払って発動できる。デッキからレベル８以下のドラゴン族Pモンスター１体を手札に加える。②：このカードの攻撃力・守備力は相手のLPの半分の数値分アップする。③：１ターンに１度、LPを半分払って発動できる。このカード以外のお互いのフィールド・墓地のカードを全て持ち主のデッキに戻す。",
                "pInfo": "①：自分はドラゴン族モンスターしかＰ召喚できない。この効果は無効化されない。②：自分の墓地のドラゴン族の融合・Ｓ・Ｘモンスター１体を対象として発動できる。このカードを破壊し、そのモンスターを特殊召喚する。",
                "size": 17, "pSize": 19,
                "color": "#000000", "rare": "0", "holo": false,
                "type": "monster", "type2": "1",
                "attr": "LIGHT", "eff1": "1", "eff2": "1", "race": "15",
                "pendulum": true, "special": true, "level": "12",
                "blue": "12", "red": "12", "atk": "?", "def": "?",
                "link1": false, "link2": false, "link3": false, "link4": false, 
                "link5": false, "link6": false, "link7": false, "link8": false
            }
    },
    "en": { "Sp": '     ',
            "Ql": '[',
            "Qr": ']',
            "Sl": '/',
            "Special": 'Special Summon',
            "Effect": 'Effect',
            "Pendulum": 'Pendulum',
            "Type2": {"Fusion": "Fusion", "Ritual": "Ritual", "Synchro": "Synchro", "Xyz": "Xyz", "Link": "Link"},
            "Eff": ["","","Toon","Spirit","Union","Gemini","Flip","Tuner"],
            "Race": ["Fiend","Zombie","Sea Serpent","Thunder","Rock","Machine","Dinosaur","Beast","Insect","Fish","Plant","Beast-Warrior","Warrior","Winged Beast","Fairy","Dragon","Reptile","Aqua","Pyro","Spellcaster","Wyrm","Cyberse","Psychic","Divine-Beast","Creator God"],
            "Spell": "Spell Card",
            "Trap": "Trap Card",
            "Attr": "en",
            "Default": {
                "title": "Odd-Eyes Revolution Dragon",
                "info": "Cannot be Normal Summoned/Set. Must be either Pendulum Summoned from the hand, or Special Summoned (from your hand) by Tributing 3 Dragon monsters (1 Fusion, 1 Synchro, and 1 Xyz). You can discard this card and pay 500 LP; add 1 Level 8 or lower Dragon Pendulum Monster from your Deck to your hand. Gains ATK/DEF equal to half your opponent's LP. Once per turn: You can pay half your LP; shuffle all other cards on the field and in the GYs into the Deck.",
                "pInfo": "You cannot Pendulum Summon monsters, except Dragon monsters. This effect cannot be negated. You can target 1 Dragon Fusion, Synchro, or Xyz Monster in your GY; destroy this card, and if you do, Special Summon that monster.",
                "size": 20, "pSize": 22,
                "color": "#000000", "rare": "0", "holo": false,
                "type": "monster", "type2": "1",
                "attr": "LIGHT", "eff1": "1", "eff2": "1", "race": "15",
                "pendulum": true, "special": true, "level": "12",
                "blue": "12", "red": "12", "atk": "?", "def": "?",
                "link1": false, "link2": false, "link3": false, "link4": false, 
                "link5": false, "link6": false, "link7": false, "link8": false
            }
    },
}

const langOffset ={
    "zh": {
        "tS": 0, "sS": 0,
        "tX": 0, "tY": 0, 
        "sX1": 0, "sX2": 0, "sY1": 0, "sY2": 0,
        "oX": 0, "oY": 0, "lh": 7
    },
    "jp": {
        "tS": 0, "sS": 0,
        "tX": -5, "tY": 8, 
        "sX1": -10, "sX2": 9, "sY1": 8, "sY2": 3,
        "oX": 10, "oY": 5, "lh": 10
    },
    "en": {
        "tS": 10, "sS": 5,
        "tX": 0, "tY": -6, 
        "sX1": -17, "sX2": 3, "sY1": 0, "sY2": 0,
        "oX": 15, "oY": 0, "lh": 7
    }
}