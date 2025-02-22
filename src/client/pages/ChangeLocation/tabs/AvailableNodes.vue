<template>
  <ul
    v-if="nodes.length && displayedContinent === null"
  >
    <li
      v-for="(continentNodes, continentName) in nodes"
      :key="continentName"
      class="change-location__list-item change-location__list-item--continent"
      @click="() => openContinent(continentName)"
    >
      <continent-preview
        :continent="continentName"
        :nodes-length="continentNodes.length"
      />

      <slr-icon
        :width="7"
        :height="12"
        :icon="'chevron-right'"
        class="mr-3"
      />
    </li>
  </ul>

  <p
    v-if="!nodes.length"
    class="m-s12-lh15 opacity-4 text-center mt-2"
  >
    {{ t('node.list.noData') }}
  </p>

  <template v-if="displayedContinent">
    <div class="change-location__list-toolbar">
      <slr-button
        :tiny="true"
        :text="true"
        class="mb-4 m-s14-lh17 px-0 py-0"
        @click="showContinents"
      >
        {{ t('action.back') }}
      </slr-button>

      <slr-search-input
        v-model="searchString"
        :placeholder="t('node.list.search.placeholder')"
        class="mb-4"
      />
    </div>

    <slr-lazy-list
      v-slot="{item: node, idx}"
      :items="filteredNodes"
      :key-field="'address'"
    >
      <li
        :class="{'pt-2': idx === 0}"
        class="change-location__list-item"
      >
        <node-details
          :node="node"
          @click="() => openNode(node)"
        />
      </li>
    </slr-lazy-list>
  </template>
</template>

<script>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import useNodeTabs from '@/client/pages/ChangeLocation/tabs/useNodeTabs'
import ContinentPreview from '@/client/components/app/ContinentPreview'
import NodeDetails from '@/client/components/app/NodeDetails'

export default {
  name: 'AvailableNodes',

  components: {
    NodeDetails,
    ContinentPreview
  },

  setup () {
    const store = useStore()
    const { t } = useI18n()
    const router = useRouter()
    const { openNode, filterNodes } = useNodeTabs()
    const searchString = ref('')
    const nodes = computed(() => store.getters.nodes)
    const displayedContinent = ref(null)
    const filteredNodes = computed(() => filterNodes(nodes.value?.[displayedContinent.value], searchString.value))

    const openContinent = c => {
      router.push({ name: 'home', query: { continent: c, tab: 1 } })
      displayedContinent.value = c
    }

    const resetContinent = () => {
      displayedContinent.value = null
    }

    const resetSearch = () => {
      searchString.value = ''
    }

    const showContinents = () => {
      resetContinent()
      resetSearch()
    }

    return {
      openContinent,
      openNode,
      t,
      filteredNodes,
      nodes,
      displayedContinent,
      searchString,
      showContinents
    }
  }
}
</script>
