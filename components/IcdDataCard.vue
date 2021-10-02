<template>
  <!-- ICD資料卡 -->
  <section class="m-2 cursor-pointer" v-bind="$attrs">
    <b-row class="icd-card py-3 px-3" align-v="center">
      <b-col class="icd-card-code-area">
        <div class="icd-card-code bg-grad-gray my-2">{{ $attrs.code }}</div>
      </b-col>
      <b-col>
        <div class="icd-card-title">{{ $attrs.title }}</div>
        <div class="icd-card-content">percentage: {{ $attrs.percentage }}</div>
      </b-col>
    </b-row>
  </section>
</template>

<script>
export default {}
</script>

<style scoped>
.icd-card {
  position: relative;
  background: #FFFFFF;
  border-radius: 20px;
  box-shadow: 1px 1px 20px #EDEDEDA6;
  -webkit-box-shadow: 1px 1px 20px #EDEDEDA6;
	-moz-box-shadow: 1px 1px 20px #EDEDEDA6;
}
.icd-card-code-area {
  min-width: 90px;
  max-width: 90px;
}
.icd-card-code {
  color: var(--kLight);
  font-size: 14px;
  font-weight: 900;
  width: 65px;
  height: 65px;
  line-height: 65px;
  text-align: center;
  vertical-align: middle;
  --smooth-corners: 3;
  mask-image: paint(smooth-corners);
  -webkit-mask-image: paint(smooth-corners);
}
.icd-card-title {
  color: var(--kDark);
  font-size: 16px;
  font-weight: 700;
}
.icd-card-content {
  color: var(--kLightDark);
  font-size: 10px;
  font-weight: 500;
}
</style>