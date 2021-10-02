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
    >
      <template #default="{ ok }">
         <b-row>
          <b-col class="text-center py-5">
            <div>
              <fa 
                :icon="[alertDialog.iconSet, alertDialog.iconName]"
                :class="`dialog-icon mb-4 grad-${alertDialog.type}`" 
              />
            </div>
            <div class="dialog-title my-1">{{ alertDialog.title }}</div>
            <div class="dialog-content mt-1 mb-3">{{ alertDialog.content }}</div>
            <b-button class="bg-grad-blue ok-btn mt-3" @click="ok()">確定</b-button>
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
    ...mapGetters(['alertDialog']),
    show: {
      get() {
        return this.alertDialog.show
      },
      set(_) {
        this.closeAlertDialog()
      },
    },
  },
  methods: {
    ...mapMutations(['closeAlertDialog']),
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

/* -------------------- 資料物件 -------------------- */
.dialog-icon {
  font-size: 70px;
  font-weight: 700;
}
.dialog-title {
  color: var(--kBlack);
  font-size: 36px;
  font-weight: 700;
}
.dialog-content {
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