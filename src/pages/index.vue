<script setup lang="ts">
import { HTMLInputEvent } from '~/types'
import { loadPdf } from '~/util'

const filename = ref('No file Chosen.')
const url = ref('')
const range = ref(0.3)
const compressing = ref(false)

function load(e: Event) {
  const files = (e as HTMLInputEvent).target.files
  if (files && files.length > 0) {
    const file = files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      url.value = reader.result as string
      filename.value = files[0]['name']
    }
  }else {
    filename.value = 'No file Chosen'
  }
}

function download(){
  if(url.value === '') return 
  compressing.value = true
  loadPdf(url.value, +range.value, compressing)
}
</script>

<template>
  <div>
    <div i-carbon-document-pdf inline-block text-4xl />    
    <p>
        Compress PDF
    </p>
    
    <div py-4 />

    <div m="0 auto">
      <div relative h-10>
        <input id="load" display-none type="file" accept="application/pdf" @change="load">
        <label for="load">
          <span
            class="m-3 text-sm btn"
          >
            Load PDF
          </span>
          <span>{{ filename }}</span>
        </label>
      </div>
    </div>

    <div py-3/>

    <div>
      <input 
        class="range"
        title="Lower the Value, Better the Compression" 
        type="range" min="0" max="1" 
        v-model="range" 
        step="0.1"/>
      <p py-2>
        Compression Range： {{ range }}
      </p>
    </div>

    <div py-4 />

    <div m="0 auto">
      <button
          class="m-3 text-sm btn"
          @click="download"
        >
          Download PDF
        </button>
    </div>

    <div py-4 />

    <p>
      <em text-sm op75>No sever, so safe</em>
    </p>
  </div>
  <div v-show="compressing" position='fixed' left-0 top-0 right-0 bottom-0 flex items-center justify-center bg-teal-100 >
    <span class="loading btn" i-carbon-3rd-party-connected text-4xl></span>
  </div>
</template>
