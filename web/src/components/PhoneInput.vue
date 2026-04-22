<template>
  <input ref="inputRef" type="text" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import IMask from 'imask'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)

let mask: ReturnType<typeof IMask>

onMounted(() => {
  if (!inputRef.value) return

  mask = IMask(inputRef.value, {
    mask: '+{7} 000 000 00 00',
  })

  mask.on('accept', () => {
    emit('update:modelValue', mask.value)
  })

  mask.value = props.modelValue || ''
})

watch(
  () => props.modelValue,
  (val) => {
    if (!mask) return

    if (val !== mask.value) {
      mask.value = val || ''
    }
  },
)
</script>
