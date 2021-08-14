<template>
  <div class="table-container">
    <b-table
      :data="dividends"
      :loading="isLoading"
      :sticky-header="true"
      height="600"
    >
      <b-table-column field="id" label="#" width="40" v-slot="props">
        {{ props.index + 1 }}
      </b-table-column>

      <b-table-column label="Ticker" v-slot="props">
        {{ props.row.ticker }}
      </b-table-column>

      <b-table-column field="date" label="Дата" v-slot="props">
        <span class="tag">{{ props.row.date | date }}</span>
      </b-table-column>

      <b-table-column field="amount" label="Сумма" v-slot="props" width="100">
        {{ props.row.amount | currency }}
      </b-table-column>

      <b-table-column
        field="comment"
        label="Комментарий"
        v-slot="props"
        width="300"
      >
        {{ props.row.comment }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        header-class="portfolio__table__last__col"
        width="95"
      >
        <div class="buttons">
          <b-button
            @click.prevent="
              $emit('onShowModal', 'update', props.row.id, props.row)
            "
            title="Редактировать дивиденд"
            icon-left="pencil"
            size="is-small"
          ></b-button>
          <b-button
            @click="removeDividendById(props.row.id)"
            type="is-danger"
            title="Удалить дивиденд"
            icon-left="trash-can"
            size="is-small"
            outlined
          ></b-button>
        </div>
      </b-table-column>

      <template #empty v-if="!isLoading">
        <div class="has-text-centered">{{ emptyTableText }}</div>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import messages from "@/utils/messages";

export default Vue.extend({
  name: "DividendsTable",

  props: {
    isLoading: Boolean,
    dividends: Array,
  },

  data() {
    return {
      emptyTableText: messages.dividends["no-dividends"] as string,
    };
  },

  methods: {
    ...mapActions({
      removeDividend: "dividends/REMOVE_DIVIDEND",
    }),

    removeDividendById(id: string): void {
      if (confirm(messages.actions["sure-question"])) {
        this.removeDividend(id);
      }
    },
  },
});
</script>
