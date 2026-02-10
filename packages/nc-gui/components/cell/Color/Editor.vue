<script lang="ts" setup>
import tinycolor from 'tinycolor2'
import type { VNodeRef } from '@vue/runtime-core'
import type { ColumnType } from 'nocodb-sdk'

interface Props {
  modelValue: string | null | undefined
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const editEnabled = inject(EditModeInj, ref(false))
const readOnly = inject(ReadonlyInj, ref(false))
const column = inject(ColumnInj, ref<ColumnType>())
const isEditColumn = inject(EditColumnInj, ref(false))
const isExpandedFormOpen = inject(IsExpandedFormOpenInj, ref(false))!
const isForm = inject(IsFormInj)!
const isCanvasInjected = inject(IsCanvasInjectionInj, false)
const isUnderLookup = inject(IsUnderLookupInj, ref(false))

const localState = ref(props.modelValue)
const inputRef = ref<HTMLInputElement>()
const isOpenColorPicker = ref(false)

const picked = computed({
  get: () => props.modelValue || '#000000',
  set: (val) => {
    const color = tinycolor(val)
    if (color.isValid()) {
      vModel.value = color.toHexString()
      isOpenColorPicker.value = false
    }
  },
})

const vModel = computed({
  get: () => props.modelValue,
  set: (val) => {
    localState.value = val
    const color = tinycolor(val)
    if (!val || color.isValid()) {
      emit('update:modelValue', val ? color.toHexString() : val)
    }
  },
})

const displayValue = computed({
  get: () => {
    if (!vModel.value) return ''
    const color = tinycolor(vModel.value)
    if (!color.isValid()) return vModel.value

    const format = column.value?.meta?.colorFormat || 'hex'

    switch (format) {
      case 'rgb':
        return color.toRgbString()
      case 'hsl':
        return color.toHslString()
      case 'hsv':
        return color.toHsvString()
      default:
        return color.toHexString()
    }
  },
  set: (val) => {
    vModel.value = val
  },
})

const swatchStyle = computed(() => {
  const color = tinycolor(vModel.value)
  if (!color.isValid()) {
    return { backgroundColor: '#ffffff' }
  }
  return { backgroundColor: color.toHexString() }
})

const focus: VNodeRef = (el) => {
  if (!isExpandedFormOpen.value && !isEditColumn.value && !isForm.value) {
    inputRef.value = el as HTMLInputElement
    inputRef.value?.focus()
  }
}

const onBlur = () => {
  editEnabled.value = false
}

onMounted(() => {
  if (isCanvasInjected && !isExpandedFormOpen.value && !isEditColumn.value && !isForm.value && !isUnderLookup.value) {
    inputRef.value?.focus()
  }
})
</script>

<template>
  <div class="nc-cell-field w-full flex items-center gap-2">
    <NcDropdown v-model:visible="isOpenColorPicker" :trigger="['click']" overlay-class-name="nc-dropdown-color-picker">
      <div
        class="w-6 h-6 rounded border border-gray-300 flex-shrink-0 cursor-pointer hover:shadow-sm transition-shadow"
        :style="swatchStyle"
        :class="{
          'cursor-not-allowed opacity-50': readOnly,
        }"
      />
      <template #overlay>
        <div>
          <LazyGeneralAdvanceColorPicker
            v-model="picked"
            :is-open="isOpenColorPicker"
            @input="(el: string) => (picked = el)"
          />
        </div>
      </template>
    </NcDropdown>

    <input
      v-bind="$attrs"
      :ref="focus"
      v-model="displayValue"
      class="nc-cell-field flex-1 outline-none py-1"
      :disabled="readOnly"
      @blur="onBlur"
      @keydown.down.stop
      @keydown.left.stop
      @keydown.right.stop
      @keydown.up.stop
      @keydown.delete.stop
      @keydown.alt.stop
      @selectstart.capture.stop
      @mousedown.stop
    />
  </div>
</template>
