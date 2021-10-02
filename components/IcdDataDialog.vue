<template>
  <div>
    <!-- SVG取色參照表 -->
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="svg-settings">
      <defs>
        <linearGradient id="success">
          <stop style="stop-color: var(--kGreen)" offset="0%"></stop>
          <stop style="stop-color: var(--kGreen60)" offset="100%"></stop>
        </linearGradient>
        <linearGradient id="error">
          <stop style="stop-color: var(--kRed)" offset="0%"></stop>
          <stop style="stop-color: var(--kRed60)" offset="100%"></stop>
        </linearGradient>
        <linearGradient id="info">
          <stop style="stop-color: var(--kBlue)" offset="0%"></stop>
          <stop style="stop-color: var(--kBlue60)" offset="100%"></stop>
        </linearGradient>
      </defs>
    </svg>

    <!-- Modal主題 -->
    <b-modal
      v-model="show"
      hide-header
      hide-footer
      centered
      size="lg"
    >
      <template #default="{ hide }">
         <b-row>
          <b-col class="py-3 px-5">
            <b-row class="mx-0">
              <b-col class="pl-0">
                <b-row class="mx-0">
                  <div class="dialog-code bg-grad-gray my-2 p-1">{{ icdDataDialog.code }}</div>
                  <div class="dialog-title my-1">&emsp;{{ icdDataDialog.title }}</div>
                </b-row>
              </b-col>
              <b-col class="pr-0 text-right dialog-close-area">
                <fa :icon="['fas', 'times']" class="dialog-close cursor-pointer" @click="hide()"/>
              </b-col>
            </b-row>
            <div class="separator mt-3 mb-4"></div>
            <div class="text-justify dialog-description my-1">{{ icdDataDialog.description }}</div>
          </b-col>
        </b-row>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters(['icdDataDialog']),
    show: {
      get() {
        return this.icdDataDialog.show
      },
      set(_) {
        this.closeIcdDataDialog()
      },
    },
  },
  methods: {
    ...mapMutations(['closeIcdDataDialog']),
  },
}
</script>

<style scoped>
/* 隱藏SVG取色參照物件 */
.svg-settings {
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
}

/* -------------------- icon顏色 -------------------- */
.grad-info path {
  fill: url(#info);
}
.grad-success path {
  fill: url(#success);
}
.grad-error path {
  fill: url(#error);
}

/* -------------------- MODAL基底 -------------------- */
>>> .modal-content, >>> .modal-body {
  border-radius: 20px;
  border: none;
  box-shadow: 1px 1px 20px #646464A6;
  -webkit-box-shadow: 1px 1px 20px #646464A6;
	-moz-box-shadow: 1px 1px 20px #646464A6;
}
.separator {
  display: block;
  height: 2px;
  border-radius: 2px;
  background: var(--kLight);
}

/* -------------------- 資料物件 -------------------- */
.dialog-close-area {
  min-width: 60px;
  max-width: 60px;
}
.dialog-close {
  font-size: 35px;
  font-weight: 700;
  color: #EBEBEB;
}
.dialog-code {
  color: var(--kLight);
  font-size: 14px;
  line-height: 24px;
  min-width: 100px;
  max-width: 100px;
  font-weight: 900;
  border-radius: 5px 5px 17px 5px;
  text-align: center;
  vertical-align: middle;
  --smooth-corners: 16, 4;
  mask-image: paint(smooth-corners);
  -webkit-mask-image: paint(smooth-corners);
}
.dialog-title {
  color: var(--kBlack);
  font-size: 24px;
  font-weight: 700;
}
.dialog-description {
  color: var(--kLightBlack);
  font-size: 18px;
  font-weight: 500;
}

@supports (mask-image: paint(smooth-corners)) {
  .ok-btn {
    --smooth-corners: 8, 4;
    mask-image: paint(smooth-corners);
    -webkit-mask-image: paint(smooth-corners);
  }
}
</style>