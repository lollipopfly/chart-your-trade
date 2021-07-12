<template>
  <div class="table-container">
    <b-table
      :data="convertToArray(dividends) || []"
      :loading="isLoading"
      :sticky-header="true"
      height="600"
    >
      <b-table-column field="id" label="#" width="40" v-slot="props">
        {{ props.index + 1 }}
      </b-table-column>

      <b-table-column label="Ticker" v-slot="props">
        {{ props.row[1].ticker }}
      </b-table-column>

      <b-table-column field="date" label="Дата" v-slot="props">
        <span class="tag">{{ props.row[1].date | date }}</span>
      </b-table-column>

      <b-table-column field="amount" label="Сумма" v-slot="props" width="100">
        {{ props.row[1].amount | currency }}
      </b-table-column>

      <b-table-column
        field="comment"
        label="Комментарий"
        v-slot="props"
        width="300"
      >
        {{ props.row[1].comment }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        header-class="portfolio__table__last__col"
        width="95"
      >
        <div class="buttons">
          <b-button
            @click.prevent="
              $emit('onShowModal', 'update', props.row[0], props.row[1])
            "
            title="Редактировать дивиденд"
            icon-left="pencil"
            size="is-small"
          ></b-button>
          <b-button
            @click="removeDividendById(props.row[0])"
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

<script>
import { mapActions } from "vuex";
import messages from "@/components/utils/messages.js";

export default {
  name: "DividendsTable",

  props: {
    isLoading: Boolean,
    dividends: Object,
  },

  data() {
    return {
      emptyTableText: messages.dividends["no-dividends"],
    };
  },

  methods: {
    ...mapActions({
      removeDividend: "dividends/REMOVE_DIVIDEND",
    }),

    removeDividendById(id) {
      if (confirm(messages.actions["sure-question"])) {
        this.removeDividend(id);
      }
    },

    convertToArray(obj) {
      let arr = [];

      if (obj !== undefined) {
        arr = Object.entries(obj);
      }

      return arr;
    },
  },
};
</script>

<style></style>
