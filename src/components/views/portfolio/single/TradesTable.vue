<template>
  <div class="table-container">
    <b-table
      :data="trades"
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

      <b-table-column field="openDate" label="Дата откр." v-slot="props">
        <span class="tag">{{ props.row.openDate | date }}</span>
      </b-table-column>

      <b-table-column field="closeDate" label="Дата закр." v-slot="props">
        <span class="tag">{{ props.row.closeDate | date }}</span>
      </b-table-column>

      <b-table-column field="quantity" label="Кол-во" v-slot="props">
        {{ props.row.quantity }}
      </b-table-column>

      <b-table-column
        field="buyPrice"
        label="Цена покупки"
        v-slot="props"
        width="100"
      >
        {{ props.row.buyPrice | currency }}
      </b-table-column>

      <b-table-column
        field="sellPrice"
        width="100"
        label="Цена продажи"
        v-slot="props"
      >
        {{ props.row.sellPrice | currency }}
      </b-table-column>

      <b-table-column field="" label="% изм." v-slot="props">
        <span
          :class="[
            'tag',
            getPercentClass(props.row.buyPrice, props.row.sellPrice),
          ]"
        >
          {{ getPercent(props.row.buyPrice, props.row.sellPrice) | percent }}
        </span>
      </b-table-column>

      <b-table-column field="" label="Профит">
        <template v-slot:header="{ column }">
          <b-tooltip :label="getTooltip" dashed position="is-left">
            {{ column.label }}
          </b-tooltip>
        </template>

        <template v-slot="props">
          <span
            :class="getProfitClass(props.row.buyPrice, props.row.sellPrice)"
          >
            {{
              getProfit(
                props.row.buyPrice,
                props.row.sellPrice,
                props.row.quantity,
                fee
              ) | currency
            }}
          </span>
        </template>
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
            title="Редактировать сделку"
            icon-left="pencil"
            size="is-small"
          ></b-button>
          <b-button
            @click="removeTradeById(props.row.id)"
            type="is-danger"
            title="Удалить сделку"
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
import { mapActions, mapGetters, mapState } from "vuex";
import { State } from "@/types/state";
import { DeletedTradeParams } from "@/types/portfolio";
import messages from "@/utils/messages";
import tradeMixin from "@/mixins/trade";

export default Vue.extend({
  name: "Table",

  mixins: [tradeMixin],

  props: {
    portfolioId: String,
    isLoading: Boolean,
    trades: Array,
  },

  data() {
    return {
      emptyTableText: messages.trade["no-trades"] as string,
    };
  },

  computed: {
    ...mapGetters({
      getTooltip: "user/GET_TABLE_FEE_TOOLTIP",
    }),

    ...mapState({
      fee: (state) => (state as State).user.profile.brokerFeePercent,
    }),
  },

  methods: {
    ...mapActions({
      removeTrade: "portfolio/REMOVE_TRADE",
    }),

    getPercent(buyPrice: string, sellPrice: string): number {
      const buyPriceNumber: number = parseFloat(buyPrice);
      const sellPriceNumber: number = parseFloat(sellPrice);
      let percent: number = (buyPriceNumber * 100) / sellPriceNumber;

      if (buyPriceNumber === sellPriceNumber) {
        return 0;
      } else if (percent > 100) {
        percent = percent - 100;

        return -parseFloat(percent.toFixed(2));
      } else {
        return parseFloat(percent.toFixed(2));
      }
    },

    getPercentClass(buyPrice: string, sellPrice: string): string {
      const buyPriceNumber: number = parseFloat(buyPrice);
      const sellPriceNumber: number = parseFloat(sellPrice);

      if (buyPriceNumber < sellPriceNumber) {
        return "is-success";
      } else if (buyPriceNumber > sellPriceNumber) {
        return "is-danger";
      }

      return "";
    },

    getProfitClass(buyPrice: string, sellPrice: string): string {
      const buyPriceNumber: number = parseFloat(buyPrice);
      const sellPriceNumber: number = parseFloat(sellPrice);

      if (buyPriceNumber < sellPriceNumber) {
        return "has-text-success";
      } else if (buyPriceNumber > sellPriceNumber) {
        return "has-text-danger";
      }

      return "";
    },

    removeTradeById(id: string): void {
      const params: DeletedTradeParams = {
        id: id,
        portfolioId: this.portfolioId,
      };

      if (confirm(messages.actions["sure-question"])) {
        this.removeTrade(params);
      }
    },
  },
});
</script>
