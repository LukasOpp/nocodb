<script setup lang="ts">
import { ColumnHelper, UITypes } from 'nocodb-sdk'

const props = defineProps<{
  value: any
}>()

const emit = defineEmits(['update:value'])

const vModel = useVModel(props, 'value', emit)

const colorFormats = [
  { id: 'hex', title: 'HEX  (#ff5733)' },
  { id: 'rgb', title: 'RGB  (rgb(255, 87, 51))' },
  { id: 'hsl', title: 'HSL  (hsl(11, 100%, 60%))' },
  { id: 'hsv', title: 'HSV  (hsv(11, 80%, 100%))' },
]

// set default value
vModel.value.meta = {
  ...ColumnHelper.getColumnDefaultMeta(UITypes.Color),
  ...(vModel.value.meta || {}),
}
</script>

<template>
  <a-row>
    <a-col :span="24">
      <a-form-item :label="$t('general.format')">
        <a-select v-model:value="vModel.meta.colorFormat" class="w-52" dropdown-class-name="nc-dropdown-color-format">
          <template #suffixIcon> <GeneralIcon icon="arrowDown" class="text-nc-content-gray-subtle" /> </template>

          <a-select-option v-for="(format, i) of colorFormats" :key="i" :value="format.id">
            <div class="flex gap-2 w-full truncate items-center" :data-testid="format.title">
              <NcTooltip show-on-truncate-only class="flex-1 truncate">
                <template #title> {{ format.title }}</template>
                {{ format.title }}
              </NcTooltip>

              <component
                :is="iconMap.check"
                v-if="vModel.meta.colorFormat === format.id"
                id="nc-selected-item-icon"
                class="text-primary w-4 h-4"
              />
            </div>
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-col>
  </a-row>
</template>
