<template>
  <template v-if="nodes.length">
    <div class="change-location__list-toolbar">
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

  <p
    v-else
    class="m-s12-lh15 opacity-4 text-center mt-2"
  >
    {{ t('subscription.list.noData') }}
  </p>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useNodeTabs from '@/client/pages/ChangeLocation/tabs/useNodeTabs'
import NodeDetails from '@/client/components/app/NodeDetails'

export default {
  name: 'SubscribedNodes',

  components: {
    NodeDetails
  },

  setup () {
    const store = useStore()
    const { t } = useI18n()
    const { openNode, filterNodes } = useNodeTabs()
    const searchString = ref('')
    const nodes = computed(() => store.getters.subscribedNodes)
    const filteredNodes = computed(() => filterNodes(nodes.value, searchString.value))

    return { t, searchString, filteredNodes, openNode, nodes }
  }
}
</script>
