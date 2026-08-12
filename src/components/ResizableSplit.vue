<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    direction: "horizontal" | "vertical";
    minPx?: number;
    maxPx?: number;
  }>(),
  {
    minPx: 200,
    maxPx: Infinity,
  },
);

const modelValue = defineModel<number>({ required: true }); // 0~1 사이의 값

const containerRef = ref<HTMLElement | null>(null);

const firstBasis = computed(() => `${modelValue.value * 100}%`);

const getClampedRatio = (
  pointerPos: number,
  containerSize: number,
  minPx: number,
  maxPx: number,
): number => {
  const lowerBound = Math.max(minPx, containerSize - maxPx);
  const upperBound = Math.min(maxPx, containerSize - minPx);

  const clampedPx = Math.max(lowerBound, Math.min(upperBound, pointerPos));

  return Math.max(0, Math.min(1, clampedPx / containerSize));
};

const onMouseMove = (e: MouseEvent) => {
  const containerRect = containerRef.value?.getBoundingClientRect();
  if (!containerRect) return;

  if (props.direction === "horizontal") {
    const x = e.clientX - containerRect.left; //왼쪽 slot의 x좌표 (너비)
    const clampedRatio = getClampedRatio(
      x,
      containerRect.width,
      props.minPx,
      props.maxPx,
    );

    modelValue.value = clampedRatio;
  } else {
    const y = e.clientY - containerRect.top; //위쪽 slot의 y좌표 (높이)
    const clampedRatio = getClampedRatio(
      y,
      containerRect.height,
      props.minPx,
      props.maxPx,
    );

    modelValue.value = clampedRatio;
  }
};

const onMouseUp = () => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
};

const handleMouseDown = () => {
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
  window.removeEventListener("mouseup", onMouseUp);
});
</script>

<template>
  <div ref="containerRef" class="resizable-split" :class="direction">
    <div class="first">
      <slot name="first" :value="modelValue"></slot>
    </div>
    <div class="divider" @mousedown="handleMouseDown"></div>
    <div class="second">
      <slot name="second" :value="modelValue"></slot>
    </div>
  </div>
</template>

<style scoped>
.resizable-split {
  display: flex;
}

.resizable-split.horizontal {
  flex-direction: row;
}

.resizable-split.vertical {
  flex-direction: column;
}

.divider {
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  background-color: transparent;
  transition: background-color 0.15s;
}

.divider:hover,
.divider:active {
  background-color: var(--color-border-active);
}

.resizable-split.horizontal > .divider {
  width: 1px;
  cursor: col-resize;
}

.resizable-split.horizontal > .divider::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: -5px;
  width: 11px;
}

.resizable-split.horizontal > .divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 24px;
  transform: translate(-70%, -50%);
  background-image: repeating-linear-gradient(
    to right,
    var(--color-border-active) 0,
    var(--color-border-active) 3px,
    transparent 3px,
    transparent 5px
  );
}

.resizable-split.vertical > .divider {
  height: 1px;
  cursor: row-resize;
}

.resizable-split.vertical > .divider::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: -5px;
  height: 11px;
}

.resizable-split.vertical > .divider::before {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  width: 24px;
  height: 10px;
  transform: translateX(-50%);
  background-image: repeating-linear-gradient(
    to bottom,
    var(--color-border-active) 0,
    var(--color-border-active) 3px,
    transparent 3px,
    transparent 5px
  );
}

.resizable-split > .first {
  flex-basis: v-bind(firstBasis);
}

.resizable-split.horizontal > .first {
  min-width: v-bind("minPx + 'px'");
  max-width: v-bind("maxPx + 'px'");
}

.resizable-split.vertical > .first {
  min-height: v-bind("minPx + 'px'");
  max-height: v-bind("maxPx + 'px'");
}

.resizable-split > .second {
  flex: 1;
}

.resizable-split.horizontal > .second {
  min-width: v-bind("minPx + 'px'");
  max-width: v-bind("maxPx + 'px'");
}

.resizable-split.vertical > .second {
  min-height: v-bind("minPx + 'px'");
  max-height: v-bind("maxPx + 'px'");
}
</style>
