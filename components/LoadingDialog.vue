<template>
  <div>
    <!-- SVG取色參照表 -->
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="svg-settings">
      <defs>
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
      :no-close-on-backdrop="true"
    >
      <b-row>
        <b-col class="text-center py-5">
          <b-img src="logo_3d.png" class="logo"/>
          <div class="text-center mt-3 mb-1">
            <b-spinner small type="grow" label="Small Spinning"></b-spinner>&nbsp;
            <b-spinner small variant="primary" type="grow" label="Small Spinning"></b-spinner>&nbsp;
            <b-spinner small variant="success" type="grow" label="Small Spinning"></b-spinner>&nbsp;
            <b-spinner small variant="danger" type="grow" label="Small Spinning"></b-spinner>&nbsp;
            <b-spinner small variant="warning" type="grow" label="Small Spinning"></b-spinner>
          </div>
          <div class="dialog-content mt-3 mb-1">請稍候</div>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters(['loadingDialogShow']),
    show: {
      get() {
        return this.loadingDialogShow
      },
      set(_) {
        this.closeLoadingDialog()
      },
    },
  },
  methods: {
    ...mapMutations(['closeLoadingDialog']),
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

.grad-info path {
  fill: url(#info);
}

.logo {
  width: 70px;
}

.dialog-content {
  color: var(--kLightBlack);
  font-size: 18px;
  font-weight: 500;
}
</style>