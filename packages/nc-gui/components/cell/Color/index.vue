<script lang="ts" setup>
interface Props {
  modelValue: string | null | undefined
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const vModel = useVModel(props, 'modelValue', emit)

const editEnabled = inject(EditModeInj, ref(false))
const readOnly = inject(ReadonlyInj, ref(false))

const { showNull } = useGlobal()
</script>

<template>
  <CellColorEditor v-if="!readOnly && editEnabled" v-model="vModel" />
  <span v-else-if="vModel === null && showNull" class="nc-cell-field nc-null uppercase">{{ $t('general.null') }}</span>
  <CellColorReadonly v-else :model-value="vModel" />
</template>
