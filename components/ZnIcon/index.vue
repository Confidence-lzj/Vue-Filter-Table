<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon zn-icon"
    v-on="$listeners"
  />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :xlink:href="iconClass" />
  </svg>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  name: 'ZnSvgIcon',
  props: {
    iconName: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: '',
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.iconName)
    },
    iconClass() {
      return `#icon-${this.iconName}`
    },
    svgClass() {
      if (this.className) {
        return 'zn-icon ' + this.className
      } else {
        return 'zn-icon'
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconName}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconName}) no-repeat 50% 50%`,
      }
    },
  },
}
</script>

<style scoped>
.zn-icon {
  width: 1rem;
  height: 1rem;
  fill: currentColor;
  overflow: hidden;
  font-size: 16px;
  text-align: center;
  vertical-align: -3px;
  cursor: pointer;
  margin-right: 5px;
}
/* .el-button .zn-icon {
  width: 1rem;
  height: 1rem;
  vertical-align: -2.5px;
  color: inherit;
} */
.zn-icon:hover path {
  fill: var(--mainTone);
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
