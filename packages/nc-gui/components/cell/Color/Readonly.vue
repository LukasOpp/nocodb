<script lang="ts" setup>
import tinycolor from 'tinycolor2'
import type { ColumnType } from 'nocodb-sdk'

interface Props {
  modelValue: string | null | undefined
}

const props = defineProps<Props>()

const column = inject(ColumnInj, ref<ColumnType>())

const rowHeight = inject(RowHeightInj, ref(undefined))

const color = computed(() => {
  if (!props.modelValue) return null
  const c = tinycolor(props.modelValue)
  return c.isValid() ? c : null
})

const displayValue = computed(() => {
  if (!color.value) return props.modelValue || ''

  const format = column.value?.meta?.colorFormat || 'hex'

  switch (format) {
    case 'rgb':
      return color.value.toRgbString()
    case 'hsl':
      return color.value.toHslString()
    case 'hsv':
      return color.value.toHsvString()
    default:
      return color.value.toHexString()
  }
})

const swatchStyle = computed(() => {
  if (!color.value) return {}
  return {
    backgroundColor: color.value.toHexString(),
  }
})
</script>

<template>
  <div v-if="color" class="flex items-center gap-2 py-1">
    <div
      class="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
      :style="swatchStyle"
    />
    <LazyCellClampedText :value="displayValue" :lines="rowHeight" class="nc-cell-field flex-1" />
  </div>
  <LazyCellClampedText v-else :value="modelValue" :lines="rowHeight" class="nc-cell-field py-1" />
</template>
