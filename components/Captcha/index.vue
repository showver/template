<template>
  <div class="s-canvas">
    <canvas id="s-canvas" canvas-id="s-canvas" style="width: 90px; height: 50px;" />
  </div>
</template>
<script>
export default {
  name: 'SIdentify',
  props: {
    identifyCode: {
      type: String,
      default: '1234'
    },
    fontSizeMin: {
      type: Number,
      default: 16
    },
    fontSizeMax: {
      type: Number,
      default: 40
    },
    backgroundColorMin: {
      type: Number,
      default: 180
    },
    backgroundColorMax: {
      type: Number,
      default: 240
    },
    colorMin: {
      type: Number,
      default: 0
    },
    colorMax: {
      type: Number,
      default: 10
    },
    lineColorMin: {
      type: Number,
      default: 40
    },
    lineColorMax: {
      type: Number,
      default: 180
    },
    dotColorMin: {
      type: Number,
      default: 0
    },
    dotColorMax: {
      type: Number,
      default: 255
    },
    contentWidth: {
      type: Number,
      default: 82
    },
    contentHeight: {
      type: Number,
      default: 41
    }
  },
  watch: {
    identifyCode() {
      this.drawPic()
    }
  },
  mounted() {
    this.drawPic()
  },
  methods: {
    // 生成一个随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 生成一个随机的颜色
    randomColor(min, max) {
      const r = this.randomNum(min, max)
      const g = this.randomNum(min, max)
      const b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    drawPic() {
      const canvas = uni.createCanvasContext('s-canvas')
      const ctx = canvas
      ctx.textBaseline = 'middle'
      // 绘制背景
      ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
	  ctx.fillStyle = '#000'
	  ctx.setFontSize(20)
	  ctx.fillText(this.identifyCode, 20, 20)
	  ctx.draw()
    }
  }
}
</script>
<style>
.s-canvas {
    display: flex;
}
</style>
