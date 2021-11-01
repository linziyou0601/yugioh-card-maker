<template>
  <div id="app">
    <!-- 標題區 -->
    <header>
      <b-navbar type="dark" fixed="top">
        <div class="text-center text-white mx-auto">
          遊戲王卡片製造機<br/>yugioh card makers
        </div>
      </b-navbar>
    </header>

    <!-- 主內容區 -->
    <main class="container-fluid mt-5 mb-3 h-100 py-3 py-md-5 px-0 px-sm-5">
      <b-row class="h-100 justify-content-center align-content-center">

        <!-- 卡片繪製區 -->
        <b-col id="card-panel" cols="12" md="6" lg="4" class="mt-3 mt-sm-5 mt-md-0">
          <div :class="{'padding-transition': true, 'sticky-top': true, 'pt-5': pageScrolling > 10}">
            <div :class="{'padding-transition': true, 'pt-5': pageScrolling > 10}">
              <div class="panel-bg shadow p-3">
                <div 
                  id="yugiohcard-wrap"
                  ref="yugiohcard-wrap"
                  class="card-body"
                  @mousemove="move"
                  @mouseleave="leave"
                >
                  <canvas id="yugiohcard" ref="yugiohcard" class="cardbg img-fluid"></canvas>
                </div>
              </div>
            </div>
          </div>
        </b-col>

        <!-- 卡片資料區 -->
        <b-col id="data-panel" cols="12" md="6" lg="8" class="mt-3 mt-sm-5 mt-md-0">
          <div class="panel-bg shadow p-3">
            <div class="card-body">
              <!-- 語言、防偽、稀有、顏色 -->
              <b-row class="mb-3">
                <!-- 語言 -->
                <b-col cols="6" lg="3" class="px-2">
                  <label>語言</label>
                  <b-form-select v-model="cardLang" :options="cardLangOpts"></b-form-select>
                </b-col>
                <!-- 防偽貼 -->
                <b-col cols="6" lg="3" class="px-2">
                  <div class="form-check px-0">
                    <label>防偽貼</label>
                    <b-form-checkbox 
                      v-model="holo" 
                      :class="{'checkbox-wrap': true, 'active': holo}" 
                      button
                    >{{ holo ? '開' : '關' }}</b-form-checkbox>
                  </div>
                </b-col>
                <!-- 防偽貼 -->
                <b-col cols="6" lg="3" class="px-2">
                  <label>稀有</label>
                  <b-form-select v-model="cardRare" :options="cardRareOpts"></b-form-select>
                </b-col>
                <!-- 卡名色 -->
                <b-col cols="6" lg="3" class="px-2">
                  <label>標題色</label>
                  <b-form-input v-model="titleColor" type="color"></b-form-input>
                </b-col>
              </b-row>

              <!-- 卡片密碼 -->
              <b-row class="my-3">
                <b-col cols="6" lg="4" class="px-2">
                  <div class="form-check px-0">
                    <label>卡片密碼</label>
                    <b-form-checkbox 
                      v-model="cardLoadYgoProEnabled" 
                      :class="{'checkbox-wrap': true, 'active': cardLoadYgoProEnabled}" 
                      button
                    >自動填入資料</b-form-checkbox>
                  </div>
                </b-col>
                <b-col cols="6" lg="8" class="px-2">
                  <label><small>僅有2019/09前的資料</small></label>
                  <b-form-input v-model="cardKey" type="number" maxlength="8" placeholder="請輸入卡片密碼"></b-form-input>
                </b-col>
              </b-row>

              <!-- 卡片名稱 -->
              <b-row class="my-3">
                <b-col class="px-2">
                  <label>卡片名稱</label>
                  <b-form-input v-model="cardTitle"></b-form-input>
                </b-col>
              </b-row>

              <!-- 卡圖 -->
              <b-row class="my-3">
                <b-col class="px-2">
                  <b-form-file
                    v-model="cardImg"
                    :state="Boolean(cardImg)"
                    placeholder="上傳圖片"
                    browse="✚"
                    accept="image/*"
                    drop-placeholder="拖曳圖片至此..."
                  ></b-form-file>
                </b-col>
              </b-row>

              <!-- 卡種、卡面、效果 -->
              <b-row class="my-3">
                <!-- 卡種 -->
                <b-col cols="6" lg="3" class="px-2">
                  <label>卡種</label>
                  <b-form-select v-model="cardType" :options="cardTypeOpts"></b-form-select>
                </b-col>

                <!-- 卡面 -->
                <b-col cols="6" lg="3" class="px-2">
                  <label>卡面</label>
                  <b-form-select v-model="cardFace" :options="cardFaceOpts[cardType]"></b-form-select>
                </b-col>

                <!-- 效果 -->
                <b-col v-show="cardType==='Monster'" cols="6" lg="3" class="px-2">
                  <label>效果</label>
                  <b-form-select v-model="cardEff1" :options="cardEff1Opts"></b-form-select>
                </b-col>
                <b-col v-show="cardType==='Monster'" cols="6" lg="3" class="px-2">
                  <label>&emsp;</label>
                  <b-form-select v-model="cardEff2" :options="cardEff2Opts"></b-form-select>
                </b-col>
              </b-row>

              <!-- 屬性、種族 -->
              <b-row v-show="cardType==='Monster'" class="my-3">
                <!-- 屬性 -->
                <b-col cols="12" lg="6" class="px-2">
                  <label>屬性</label>
                  <b-form-select v-model="cardAttr" :options="cardAttrOpts"></b-form-select>
                </b-col>

                <!-- 種族 -->
                <b-col v-show="cardType==='Monster'" cols="6" lg="3" class="px-2">
                  <div class="form-check px-0">
                    <label>種族</label>
                    <b-form-checkbox 
                      v-model="cardCustomRaceEnabled" 
                      :class="{'checkbox-wrap': true, 'active': cardCustomRaceEnabled}" 
                      button
                    >自定義</b-form-checkbox>
                  </div>
                </b-col>
                <!-- 種族 - 種族選擇 -->
                <b-col v-show="!cardCustomRaceEnabled" cols="6" lg="3" class="px-2">
                  <label>&emsp;</label>
                  <b-form-select v-model="cardRace" :options="cardRaceOpts"></b-form-select>
                </b-col>
                <!-- 種族 - 自訂輸入 -->
                <b-col v-show="cardCustomRaceEnabled" cols="6" lg="3" class="px-2">
                  <label>&emsp;</label>
                  <b-form-input v-model="cardCustomRace" type="text" maxlength="8" placeholder="請輸入種族"></b-form-input>
                </b-col>
              </b-row>

              <!-- 靈擺、特殊召喚、等級 -->
              <b-row class="my-3">
                <!-- 靈擺 -->
                <b-col v-show="canPendulumEnabled" cols="6" lg="4" class="px-2">
                  <div class="form-check px-0">
                    <label>&emsp;</label>
                    <b-form-checkbox 
                      v-model="Pendulum" 
                      :class="{'checkbox-wrap': true, 'active': Pendulum}" 
                      button
                    >靈擺</b-form-checkbox>
                  </div>
                </b-col>

                <!-- 特殊召喚 -->
                <b-col v-show="cardType==='Monster'" cols="6" lg="4" class="px-2">
                  <div class="form-check px-0">
                    <label>&emsp;</label>
                    <b-form-checkbox 
                      v-model="Special" 
                      :class="{'checkbox-wrap': true, 'active': Special}" 
                      button
                    >特殊召喚</b-form-checkbox>
                  </div>
                </b-col>

                <!-- 等級 -->
                <b-col v-show="cardType==='Monster' && !isLinkMonster" cols="12" lg="4" class="px-2">
                  <label>等級</label>
                  <b-form-select v-model="cardLevel" :options="cardLevelOpts"></b-form-select>
                </b-col>
              </b-row>

              <!-- 靈擺效果區 -->
              <b-row v-show="Pendulum" class="my-3">
                <b-col cols="12">
                  <h4 class="text-light text-center">靈擺效果</h4>
                </b-col>
                <b-col cols="12">
                  <b-row class="mb-3">
                    <b-col cols="4" class="px-2">
                      <label>藍刻度</label>
                      <b-form-input v-model="cardBLUE" type="number" min="0" max="12"></b-form-input>
                    </b-col>

                    <b-col cols="4" class="px-2">
                      <label>紅刻度</label>
                      <b-form-input v-model="cardRED" type="number" min="0" max="12"></b-form-input>
                    </b-col>

                    <b-col cols="4" class="px-2">
                      <label>文字大小</label>
                      <b-form-input v-model="pendulumSize" type="number"></b-form-input>
                    </b-col>
                  </b-row>

                  <b-row class="my-3">
                    <b-col class="px-2">
                      <label>效果文字</label>
                      <b-form-textarea v-model="cardPendulumInfo" rows="5"></b-form-textarea>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>

              <!-- 攻守區 -->
              <b-row class="my-3">     
                <!-- 攻擊力 -->
                <b-col v-show="cardType==='Monster'" cols="4" class="px-2">
                  <label>攻擊力</label>
                  <b-form-input v-model="cardATK" type="text" maxlength="6"></b-form-input>
                </b-col>
                
                <!-- 守備力 -->
                <b-col v-show="cardType==='Monster' && !isLinkMonster" cols="4" class="px-2">
                  <label>守備力</label>
                  <b-form-input v-model="cardDEF" type="text" maxlength="6"></b-form-input>
                </b-col>

                <!-- 連結區 -->
                <b-col v-show="isLinkMonster" cols="4" class="px-2">
                  <label>連結</label>
                  <table>
                    <tr v-for="row in [0,1,2]" :key="row">
                      <td v-for="col in [1,2,3]" :key="col">
                        <b-form-checkbox 
                          v-if="row*3+col!==5"
                          v-model="links[row*3+col].val" 
                          :class="{'checkbox-wrap': true, 'active': links[row*3+col].val}" 
                          button
                        >{{ links[row*3+col].symbol }}</b-form-checkbox>
                      </td>
                    </tr>
                  </table>
                </b-col>

                <!-- 文字大小 -->
                <b-col cols="4" class="px-2">
                  <label>文字大小</label>
                  <b-form-input v-model="infoSize" type="number"></b-form-input>
                </b-col>
              </b-row>

              <!-- 卡片說明 -->
              <b-row class="my-3">
                <b-col class="px-2">
                  <label>卡片說明</label>
                  <b-form-textarea v-model="cardInfo" rows="5"></b-form-textarea>
                </b-col>
              </b-row>
              
              <!-- 按鈕區 -->
              <b-row class="my-3">
                <b-col class="px-2">
                  <button type="button" class="my-2 btn btn-info" @click="doDrawCard">產生</button>&emsp;
                  <button type="button" class="my-2 btn btn-success" @click="download_img">下載</button>
                  <label style="color: #CCC;">&emsp;每1.5秒自動更新</label>
                </b-col>
                <b-col cols="6" class="px-2 text-right">
                  <button type="button" class="my-2 btn btn-danger" @click="load_default_data">預設資料</button>
                </b-col>
              </b-row>
            </div>
          </div>
        </b-col>
      </b-row>
    </main>

    <!-- 頁尾區 -->
    <footer class="container-fluid mb-5 px-0 px-md-5">
      <b-row class="justify-content-center align-content-center">
        <b-col id="footer-panel" cols="12">
          <div class="card-body text-center text-white">
            Linziyou <a
              class="text-white text-decoration-none"
              href="https://github.com/linziyou0601/yugioh-card-maker"
              data-size="large"
              aria-label="Star linziyou0601/yugioh-card-maker on GitHub"
            >
              <fa :icon="['fab', 'github']" /> GitHub
            </a>
          </div>
        </b-col>
      </b-row>
    </footer>

    <LoadingDialog />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import langMeta from '../static/lang_meta.json'
import ygoproData from '../static/ygo/card_data.json'
export default {
  data() {
    return {
      adCollapsed: false,
      pageScrolling: 0,

      cardLang: 'zh',
      cardLangOpts: [
        { value: 'zh', text: '正體中文' },
        { value: 'jp', text: '日本語' },
        { value: 'en', text: 'English' },
      ],
      holo: true,
      cardRare: '0',
      cardRareOpts: [
        { value: '0', text: 'N' },
        { value: '1', text: 'R' },
        { value: '2', text: 'UR' },
      ],
      titleColor: '#000000',

      cardLoadYgoProEnabled: true,
      cardKey: '',

      cardTitle: '超天新龍 異色眼革命龍',
      cardImg: null,

      cardType: 'Monster',
      cardTypeOpts: [
        { value: 'Monster', text: '怪獸' },
        { value: 'Spell', text: '魔法' },
        { value: 'Trap', text: '陷阱' },
      ],

      cardFace: 'Normal',
      cardFaceOpts: {
        "Monster": [
          { value: 'Normal', text: '通常' },
          { value: 'Effect', text: '效果' },
          { value: 'Fusion', text: '融合' },
          { value: 'Ritual', text: '儀式' },
          { value: 'Synchro', text: '同步' },
          { value: 'Xyz', text: '超量' },
          { value: 'Link', text: '連結' },
          { value: 'Token', text: '衍生物' },
          { value: 'Slifer', text: '天空龍底色' },
          { value: 'Ra', text: '翼神龍底色' },
          { value: 'Obelisk', text: '巨神兵底色' },
          { value: 'LDragon', text: '傳說之龍底色' },
        ],
        "Spell": [
          { value: 'Normal', text: '通常' },
          { value: 'Continuous', text: '永續' },
          { value: 'Field', text: '場地' },
          { value: 'Equip', text: '裝備' },
          { value: 'Quick', text: '速攻' },
          { value: 'Ritual', text: '儀式' },
        ],
        "Trap": [
          { value: 'Normal', text: '通常' },
          { value: 'Continuous', text: '永續' },
          { value: 'Counter', text: '反擊' },
        ]
      },

      cardEff1: '1',
      cardEff2: '0',
      cardEffOpts: [
        { value: '0', text: '無' },
        { value: '1', text: '一般' },
        { value: '2', text: '卡通' },
        { value: '3', text: '靈魂' },
        { value: '4', text: '聯合' },
        { value: '5', text: '二重' },
        { value: '6', text: '反轉' },
        { value: '7', text: '協調' },
      ],

      cardAttr: 'LIGHT',
      cardAttrOpts: [
        { value: 'DIVINE', text: '神' },
        { value: 'EARTH', text: '地' },
        { value: 'WATER', text: '水' },
        { value: 'FIRE', text: '炎' },
        { value: 'WIND', text: '風' },
        { value: 'LIGHT', text: '光' },
        { value: 'DARK', text: '闇' },
      ],

      cardCustomRaceEnabled: false,
      cardCustomRace: '',
      cardRace: '15',
      cardRaceOpts: [
        { value: '0', text: '惡魔' },
        { value: '1', text: '不死' },
        { value: '2', text: '海龍' },
        { value: '3', text: '雷' },
        { value: '4', text: '岩石' },
        { value: '5', text: '機械' },
        { value: '6', text: '恐龍' },
        { value: '7', text: '獸' },
        { value: '8', text: '昆蟲' },
        { value: '9', text: '魚' },
        { value: '10', text: '植物' },
        { value: '11', text: '獸戰士' },
        { value: '12', text: '戰士' },
        { value: '13', text: '鳥獸' },
        { value: '14', text: '天使' },
        { value: '15', text: '龍' },
        { value: '16', text: '爬蟲類' },
        { value: '17', text: '水' },
        { value: '18', text: '炎' },
        { value: '19', text: '魔法師' },
        { value: '20', text: '幻龍' },
        { value: '21', text: '網域' },
        { value: '22', text: '超能' },
        { value: '23', text: '幻神獸' },
        { value: '24', text: '創造神' },
      ],

      Pendulum: true,
      Special: true,
      cardLevel: '12',
      cardLevelOpts: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

      cardBLUE: 12,
      cardRED: 12,
      pendulumSize: 23,
      cardPendulumInfo: "①：自己不是龍族怪獸不能靈擺召喚。這個效果不會被無效化。②：以自己墓地1隻龍族的融合．同步．超量怪獸為對象才能發動。這張卡破壞，那隻怪獸特殊召喚。",

      cardATK: '?',
      cardDEF: '?',
      links: {
        1: {val: false, symbol: '◤'},
        2: {val: false, symbol: '▲'},
        3: {val: false, symbol: '◥'},
        4: {val: false, symbol: '◀'},
        6: {val: false, symbol: '▶'},
        7: {val: false, symbol: '◣'},
        8: {val: false, symbol: '▼'},
        9: {val: false, symbol: '◢'},
      },
      infoSize: '22',

      cardInfo: "這張卡不能通常召喚。從手牌的靈擺召喚或者釋放自己場上的龍族的融合．同步．超量怪獸各1隻的場合才能特殊召喚。①：丟棄手牌的這張卡，支付500生命值才能發動。從牌組把1隻8星以下的龍族靈擺怪獸加入手牌。②：這張卡的攻擊力·守備力上升對方一半的生命值。③：1回合1次，支付一半生命值才能發動。這張卡以外的雙方的場上．墓地的卡全部回到持有者牌組。",

      imgs: {},
    }
  },
  computed: {
    cardTemplateText () {
      let templateUrl = this.cardType!=="Monster"? this.cardType : this.cardFace
      if (this.Pendulum && !["Slifer", "Ra", "Obelisk", "LDragon"].includes(this.cardFace))
        templateUrl += "Pendulum"
      return templateUrl
    },
    isXyzMonster () {
      return this.cardType==='Monster' && this.cardFace==='Xyz'
    },
    isLinkMonster () {
      return this.cardType==='Monster' && this.cardFace==='Link'
    },
    canPendulumEnabled() {
      return this.cardType==='Monster' && !["Slifer", "Ra", "Obelisk", "LDragon"].includes(this.cardFace)
    },
    cardEff1Opts () {
      return this.cardEffOpts.filter((item, ind, arr) => {
        // 去掉「無」、去掉和Eff2重複的（除了value===1之外）
        return item.value !== '0' && (item.value === '1' || item.value !== this.cardEff2)
      })
    },
    cardEff2Opts () {
      return this.cardEffOpts.filter((item, ind, arr) => {
        // 去掉和Eff1重複的（除了value===1之外）
        return item.value === '1' || item.value !== this.cardEff1
      }).map((item, ind, arr) => {
        const ret = Object.assign({}, item)
        if (item.value === '1') ret.text = "效果"
        return ret
      })
    },
  },
  watch: {
    cardType() {
      this.cardFace = 'Normal'
      if (this.cardType!=="Monster") this.Pendulum = false
    },
    cardFace() {
      if (["Slifer", "Ra", "Obelisk", "LDragon"].includes(this.cardFace)) this.Pendulum = false
    }
  },
  mounted () {
    window.addEventListener('scroll', this.onScroll)
    this.fireLoadingDialog()
    setInterval(this.drawCard, 1500)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    ...mapMutations(['fireLoadingDialog', 'closeLoadingDialog']),

    doDrawCard() {
      this.fireLoadingDialog()
      this.drawCard()
    },

    // 卡片繪製 - 繪製前準備
    drawCard () {
      let cardImgUrl = this.cardImg? URL.createObjectURL(this.cardImg): null;
      if (this.cardLoadYgoProEnabled) {
        const hasData = this.load_ygopro_data(this.cardKey);
        if (hasData) cardImgUrl = `ygo/pics/${this.cardKey}.jpg`
      }
      this.imgs = {
        template: `images/card/${langMeta[this.cardLang].attrLang}/${this.cardTemplateText}.png`,
        holo: "images/pic/holo.png",
        link1: "images/pic/LINK1.png", link2: "images/pic/LINK2.png",
        link3: "images/pic/LINK3.png", link4: "images/pic/LINK4.png",
        link6: "images/pic/LINK6.png", link7: "images/pic/LINK7.png",
        link8: "images/pic/LINK8.png", link9: "images/pic/LINK9.png",
        attr: (
          this.cardType==="Monster" ?
          `images/attr/${langMeta[this.cardLang].attrLang}/${this.cardAttr}.webp` :
          `images/attr/${langMeta[this.cardLang].attrLang}/${this.cardType}.webp`
        ),
        photo: cardImgUrl || "images/default.jpg",
        levelOrFace: (
          this.cardType!=="Monster" && this.cardFace!=="Normal" ?
          `images/pic/${this.cardFace}.webp` :
          `images/pic/${this.isXyzMonster ? 'Rank' : 'Level'}.webp`
        ),
      }
      this.drawCardLoadingImages(this.drawCardProcess) // 載入卡圖後，繪製卡片內容
    },

    // 卡片繪製 - 載入卡圖
    drawCardLoadingImages (callback) {
      const length = Object.keys(this.imgs).length
      let count = 0
      for (const key in this.imgs) {
        const image = new window.Image()
        image.src = this.imgs[key]
        this.imgs[key] = image
        this.imgs[key].onload = function() {
          count += 1
          if (count >= length ) setTimeout(callback, 200)
        }
      }   
    },
    
    // 卡片繪製 - 主要繪製流程
    drawCardProcess () {
      const canvas = this.$refs.yugiohcard
      const ctx = canvas.getContext('2d')
      canvas.width = 1000
      canvas.height = 1450

      const langStr = langMeta[this.cardLang]
      const offset = langStr.offset
      const fontName = langStr.fontName

      // 繪製底圖
      this.drawCardImg(ctx)

      // 卡片標題
      this.drawCardTitle(ctx, offset, fontName)

      // 卡片資料
      this.drawCardInfo(ctx, langStr, offset, fontName)
      
      // 卡片密碼
      if (this.cardKey!=="") {
        ctx.fillStyle = (this.isXyzMonster && !this.Pendulum )? '#FFF': '#000'
        ctx.font = `22pt 'cardkey', 'MatrixBoldSmallCaps', ${fontName[2]}`
        ctx.textAlign = "left";
        ctx.fillText(this.cardKey.padStart(8, '0'), 54, 1405); // 卡片密碼
      }
      ctx.fillStyle = '#000';

      // 防偽貼            
      if (this.holo) ctx.drawImage(this.imgs.holo, 928, 1371, 44, 46);

      // 靈擺效果說明
      if (this.Pendulum) this.drawCardPendulumInfoText(ctx, offset, fontName);

      // 卡片說明
      this.drawCardInfoText(ctx, offset, fontName);
      
      this.closeLoadingDialog()
    },

    // 主要繪製流程 - 底圖
    drawCardImg (ctx) {
      let cX, cY, cW, cH;
      if (this.Pendulum) { cX=69; cY=255; cW=862; cH=647; }
      else { cX=123; cY=268; cW=754; cH=754; }

      const photo = this.imgs.photo
      const iW = photo.width / photo.height * cH
      const iH = photo.height / photo.width * cW
      if (photo.width <= photo.height*(this.Pendulum? 1.33:1)) ctx.drawImage(photo, cX, cY-((iH-cH)/2), cW, iH);
      else ctx.drawImage(photo, cX-((iW-cW)/2), cY, iW, cH);
      ctx.drawImage(this.imgs.template, 0, 0, 1000, 1450);
      ctx.drawImage(this.imgs.attr, 840, 68, 90, 90);
    },

    // 主要繪製流程 - 標題
    drawCardTitle (ctx, offset, fontName) {
      ctx.font = `${57 + offset.tS}pt ${fontName[0]}, ${fontName[3]}, ${fontName[4]}, ${fontName[5]}`;
      ctx.fillStyle = this.rareColor(ctx);
      ctx.fillText(this.cardTitle, 77+offset.tX, 140+offset.tY, 750);
      ctx.shadowColor = "#000"; 
      ctx.shadowBlur = 0; 
      ctx.shadowOffsetX = 0; 
      ctx.shadowOffsetY = 0;
    },

    // 主要繪製流程 - 內容
    drawCardInfo (ctx, langStr, offset, fontName) {
      const linkPosition = { 
        Link: {
          X: [86,410,826,70, 0, 878,86,410,826], Y: [231,214,231,556, 0, 556,967,1020,967],
          W: [86,177,86,52, 0, 52,86,177,86], H: [86,52,86,177, 0, 177,86,52,86]
        },
        LinkPendulum: {
          X: [42,421,881,21, 0, 934,42,421,881], Y: [227,211,227,732, 0, 732,1319,1365,1319],
          W: [75,155,75,46, 0, 46,75,155,75], H: [75,46,75,155, 0, 155,75,46,75]
        }
      }
      ctx.font = `${(this.cardType==="Monster" ? 25 : 40) - offset.sS}pt ${fontName[1]}`
      ctx.fillStyle = '#000';
      if (this.cardType==="Monster") { // 怪獸卡
        // 怪獸屬性文字
        const typeText = (this.cardCustomRaceEnabled? this.cardCustomRace : langStr.Race[this.cardRace]) +             // 種族
        (this.Special? langStr.Sl + langStr.Special: "") +                                                             // 特殊召喚
        (!["Normal", "Effect", "Slifer", "Ra", "Obelisk", "LDragon"].includes(this.cardFace)? 
                                                               langStr.Sl + langStr.Face[this.cardFace]: "") +         // 卡面種類
        (this.cardEff1>"1"? langStr.Sl + langStr.Eff[this.cardEff1]: "") +                                             // 功能1(效果)
        (this.cardEff2>"1" && this.cardEff1!==this.cardEff2? langStr.Sl + langStr.Eff[this.cardEff2]: "") +            // 功能1(效果)
        (this.Pendulum? langStr.Sl + langStr.Pendulum: "") +                                                           // 功能3(靈擺有無)
        (this.cardFace==="Effect" || (this.cardEff2>"0" && this.cardFace!=="Normal")? langStr.Sl + langStr.Effect: "") // 功能4(效果有無)
        
        // 怪獸屬性
        ctx.fillText(`${langStr.Ql}${typeText}${langStr.Qr}`, 63 + offset.oX, 1120 + offset.oY, 750);

        // 怪獸ATK
        ctx.font = `33pt 'MatrixBoldSmallCaps', ${fontName[2]}`
        ctx.textAlign = "right";
        if (this.cardATK.includes("∞")) {
          ctx.font = `Bold 32pt 'Times New Roman', ${fontName[2]}`
        }
        ctx.fillText(this.cardATK, 719, 1353, 95)

        // 怪獸DEF / LINK
        ctx.font = `33pt 'MatrixBoldSmallCaps', ${fontName[2]}`
        if (this.isLinkMonster) {
          this.cardDEF = String(Object.values(this.links).filter((item, ind, arr) => item.val).length)
          ctx.font = `28pt 'link', 'MatrixBoldSmallCaps', ${fontName[2]}`
        } else if (this.cardDEF.includes("∞")) {
          ctx.font = `Bold 32pt 'Times New Roman', ${fontName[2]}`
        }
        ctx.fillText(this.cardDEF, 920 - (this.isLinkMonster? 3: 0), 1353 - (this.isLinkMonster? 1: 0), 95);

        // 怪獸等級 / 階級 / 連結
        ctx.textAlign = "left";
        if (!this.isLinkMonster) { // 非連結怪獸
          for(let i=1; i<=this.cardLevel; i++)
            ctx.drawImage(this.imgs.levelOrFace, (this.isXyzMonster? (122+(i-1)*63): (820-(i-1)*63)), 181, 58, 58);
        } else {                   // 連結怪獸
          const linkStr = this.Pendulum? "LinkPendulum": "Link";
          // 連結圖片
          for(let i=1; i<=9; i++)
            if(i!==5 && this.links[i].val)
              ctx.drawImage(this.imgs[`link${i}`], 
                linkPosition[linkStr].X[i-1], linkPosition[linkStr].Y[i-1], 
                linkPosition[linkStr].W[i-1], linkPosition[linkStr].H[i-1]
              );
        }
      } else {                         // 魔罠卡
        // 卡種
        const typeText = (this.cardType==="Spell"? langStr.Spell: langStr.Trap) + (this.cardFace==='Normal'? "": langStr.Sp)
        ctx.textAlign = "right";
        ctx.fillText(`${langStr.Ql}${typeText}${langStr.Qr}`, 920+offset.sX1, 222+offset.sY1); // 魔罠卡
        if (this.cardFace!=='Normal')
          ctx.drawImage(this.imgs.levelOrFace, 820+offset.sX2, 178+offset.sY2, 58, 58);        // 魔罠子類別
      }
    },

    // 填入靈擺效果說明
    drawCardPendulumInfoText (ctx, offset, fontName){
      // 畫符號
      ctx.textAlign = "center";
      ctx.font = "55pt 'MatrixBoldSmallCaps'";
      ctx.fillText(this.cardBLUE, 106-((['Xyz', 'Link', 'Token'].includes(this.cardFace) || this.cardType!=="Monster")? 5: 0 ), 1040, 60); 
      ctx.fillText(this.cardRED, 895, 1040, 60);
      // 畫文字
      const fontSize = Number(this.pendulumSize)
      ctx.textAlign = "left";	
      ctx.textBaseline = "top";
      ctx.font = `${fontSize}pt ${fontName[2]}, ${fontName[3]}, ${fontName[4]}, ${fontName[5]}`;
      this.wrapText(ctx, this.cardPendulumInfo, 160, 920+offset.oY, 660, fontSize+offset.lh);
    },

    // 填入卡片說明
    drawCardInfoText (ctx, offset, fontName) {
      const fontSize = Number(this.infoSize)
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.font = `${fontSize}pt ${fontName[2]}, ${fontName[3]}, ${fontName[4]}, ${fontName[5]}`;
      this.wrapText(ctx, this.cardInfo, 75, 1095+offset.oY+(this.cardType==="Monster"? 30: 0), 825, fontSize+offset.lh)
    },

    // 卡色
    rareColor (ctx) {
      let gradient
      switch(this.cardRare) {
        case "2":
          ctx.shadowColor = "#dcff32";
          ctx.shadowBlur = 1;
          ctx.shadowOffsetX = 0.4;
          ctx.shadowOffsetY = 1.5;
          return "#524100"; // "#3b2f00";
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
        default:
          return this.titleColor;
      }
    },

    // 文字區
    wrapText (ctx, text, x, y, maxWidth, lineHeight) {
      let lineWidth = 0 - ctx.measureText(text[0]).width; // 目前佔用行寬
      const fieldWidth = maxWidth;                        // 欄位寬度
      let initHeight = y;                                 // 文字距離圖片頂部高度
      let lastSubStrIndex = 0;                            // 每次擷取的子字串起始位置
      for(let i=0; i<text.length; i++){ 
        lineWidth += ctx.measureText(text[i]).width;
        if(lineWidth>fieldWidth || text.substring(i, i+1)==='\n') {
          if(text.substring(i, i+1)==='\n') i++;
          ctx.fillText(text.substring(lastSubStrIndex, i), x, initHeight);
          initHeight+=lineHeight
          lineWidth=0
          lastSubStrIndex=i;
        } 
        if(i===text.length-1){   // 若本行未超過，位已達最後一字，則直接填入
          ctx.fillText(text.substring(lastSubStrIndex, i+1), x, initHeight);
        }
      }
    },

    // 下載
    download_img () {
      const canvas = this.$refs.yugiohcard
      if (canvas.msToBlob) { // for IE
        const blob = canvas.msToBlob();
        window.navigator.msSaveBlob(blob, 'YuGiOh.png');
      } else {
        const a = document.createElement('a');
        a.href = canvas.toDataURL("image/jpeg");
        a.download = 'YuGiOh.jpg';
        a.click();
      }
    },

    // 載入預設
    load_default_data () {
      const data = langMeta[this.cardLang].Default
      this.holo = true
      this.cardRare = "0"
      this.titleColor = "#000000"
      this.cardLoadYgoProEnabled = true
      this.cardKey = ""
      this.cardTitle = data.title
      this.cardImg = null
      this.cardType = "Monster"
      this.cardFace = "Normal"
      this.cardAttr = "LIGHT"
      this.cardEff1 = "1"
      this.cardEff2 = "0"
      this.cardCustomRaceEnabled = false
      this.cardCustomRace = ""
      this.cardRace = "15"
      this.Pendulum = true
      this.Special = true
      this.cardLevel = "12"
      this.cardBLUE = "12"
      this.cardRED = "12"
      this.cardATK = "?"
      this.cardDEF = "?"
      for (let i=1; i<=9; i++)
        if (i!==5)
          this.links[i].val = false
      this.cardInfo = data.info
      this.infoSize = data.size
      this.cardPendulumInfo = data.pInfo
      this.pendulumSize = data.pSize
    },

    // 載入YGOPRO2資料
    load_ygopro_data(key) {
      const data = ygoproData[key]
      if (!data)
        return false
      this.cardLang = "zh"
      this.cardRare = data.rare
      this.titleColor = data.color
      this.cardTitle = data.title
      this.cardImg = null //
      this.cardType = data.type[0][0]
      this.cardFace = data.type[0][1]
      if (data.attribute!=="Trap" && data.attribute!=="Spell")
        this.cardAttr = data.attribute
      this.cardEff1 = data.type[0][2]
      this.cardEff2 = data.type[0][3]
      this.cardCustomRaceEnabled = false
      this.cardCustomRace = ""
      this.cardRace = data.race
      this.Pendulum = data.type[0][4]
      this.Special = data.type[0][5]
      this.cardLevel = data.level
      this.cardBLUE = data.blue
      this.cardRED = data.red
      this.cardATK = data.atk
      this.cardDEF = data.def
      for (let i=1; i<=9; i++)
        if (i!==5)
          this.links[i].val = data[`link${i}`]
      this.cardInfo = data.infoText
      this.infoSize = data.size
      this.cardPendulumInfo = data.pendulumText
      this.pendulumSize = data.pSize
      return true
    },
    
    // 頁面捲動時
    onScroll () {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
      this.pageScrolling = currentScrollPosition
    },

    // 3D效果 - 移動
    move(e) {
      const THRESHOLD = 5;
      const cardWrap = this.$refs["yugiohcard-wrap"];
      const { clientX, clientY, currentTarget } = e;
      const { clientWidth, clientHeight, offsetLeft, offsetTop } = currentTarget;

      const horizontal = (clientX - offsetLeft) / clientWidth;
      const vertical = (clientY - offsetTop) / clientHeight;

      const rotateX = (THRESHOLD / 2 - horizontal * THRESHOLD).toFixed(2);
      const rotateY = (vertical * THRESHOLD - THRESHOLD / 2).toFixed(2);

      cardWrap.style.transform = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`;
    },

    // 3D效果 - 離開
    leave(e) {
      const cardWrap = this.$refs["yugiohcard-wrap"];
      cardWrap.style.transform = `perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`;
    },
  }
}
</script>

<style>
/* font converted using font-converter.net. thank you! */

.preloadfont {
	font-family: YourFont;
	opacity:0;
	height:0;
	width:0;
	display:inline-block;
}

:root {
  --chevron-down-svg-path: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath fill='%23CCC' d='M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z'%3E%3C/path%3E%3C/svg%3E")
}

body{
  background: url("~static/Screentone.png") round,
              -webkit-linear-gradient(to bottom right, #000000BB, #66666699, #000000BB),
              -webkit-linear-gradient(to bottom left, #111111BB, #11111199, #111111BB);
  background: url("~static/Screentone.png") round,
              -moz-linear-gradient(to bottom right, #000000BB, #66666699, #000000BB),
              -moz-linear-gradient(to bottom left, #111111BB, #11111199, #111111BB);
  background: url("~static/Screentone.png") round,
              -o-linear-gradient(to bottom right, #000000BB, #66666699, #000000BB),
              -o-linear-gradient(to bottom left, #111111BB, #11111199, #111111BB);
  background: url("~static/Screentone.png") round,
              linear-gradient(to bottom right, #000000BB, #66666699, #000000BB),
              linear-gradient(to bottom left, #111111BB, #11111199, #111111BB);
  background-blend-mode: multiply;
	font-family: 'Noto Sans TC', 'arial', "微軟正黑體";
}

/* -------------------- 區塊樣式 -------------------- */
header {
  font-family: 'en', 'zh';
  font-size: 1.5rem;
  line-height: 1.2rem;
}
nav {
  background-color: #2f2f2f;
}
.panel-bg {
	background-color: #5555556A;
  border-radius: 1rem;
  color: #FFF;
}

/* -------------------- 卡片區樣式 -------------------- */
.padding-transition {
  transition: all .5s linear;
}
#yugiohcard-wrap {
  transition: transform 0.1s ease;
  transform-style: preserve-3d;
  will-change: transform;
}
#yugiohcard-wrap:hover #yugiohcard {
  transform: translateZ(12px);
}
#yugiohcard {
  transition: transform 0.3s ease;
}

/* -------------------- 輸入區樣式 -------------------- */
/* 輸入區底色 */
select, textarea, input, .custom-file-label{
	background-color: #7777774A !important;
	color: #ccc !important;
	border: 0 !important;
}
/* 下拉選單icon */
.custom-select {
  background-image: var(--chevron-down-svg-path);
}
/* 下拉區底色 */
select option {
  background: #666666;
  color: #fff;
}
/* Checkbox顏色 */
.checkbox-wrap {
  width: 100%;
}
.checkbox-wrap > label {
  width: 100%;
  text-align: left;
  border: none;
  color: #787878 !important;
  background-color: #7777774A !important;
}
.checkbox-wrap.active > label {
  color: #FFF !important;
  background-color: #17a2b8 !important;
}
/* 檔案上傳鈕 */
.custom-file-label::after {
  content: '✚' !important;
	background-color: #787878 !important;
	color: #FFF;
}
</style>
