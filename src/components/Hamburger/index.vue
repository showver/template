<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <svg
      :class="{'is-active':isActive}"
      t="1610336426212"
      class="hamburger"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="4362"
      width="20"
      height="20"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <!-- <defs>
        <style type="text/css"></style>
      </defs> -->
      <path
        d="M81.408 459.776H1024v103.936H81.408V459.776zM0 5.12h601.088v103.936H0V5.12zM763.904 5.12H1024v103.936h-260.096V5.12z"
        fill="#ffffff"
        p-id="4363"
      ></path>
      <path
        d="M243.2 714.752L0 512l243.2-202.752 66.56 79.872-147.456 122.88 146.944 122.368-66.048 80.384zM0 914.944h601.088V1018.88H0v-103.936zM763.904 914.944H1024V1018.88h-260.096v-103.936z"
        fill="#ffffff"
        p-id="4364"
      ></path>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 16px;
  height: 16px;
  transform: rotate(180deg);
}

.hamburger.is-active {
  transform: rotate(360deg);
  /* background: #ffffff;
   */
   color: #ffff;
}
</style>
