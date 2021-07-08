<template>
  <div class="table-container">
    <b-table
      :data="convertToArray(trades) || []"
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

      <b-table-column field="openDate" label="Дата откр." v-slot="props">
        <span class="tag">{{ props.row[1].openDate | date }}</span>
      </b-table-column>

      <b-table-column field="closeDate" label="Дата закр." v-slot="props">
        <span class="tag">{{ props.row[1].closeDate | date }}</span>
      </b-table-column>

      <b-table-column field="quantity" label="Кол-во" v-slot="props">
        {{ props.row[1].quantity }}
      </b-table-column>

      <b-table-column
        field="buyPrice"
        label="Цена покупки"
        v-slot="props"
        width="100"
      >
        {{ props.row[1].buyPrice | currency }}
      </b-table-column>

      <b-table-column
        field="sellPrice"
        width="100"
        label="Цена продажи"
        v-slot="props"
      >
        {{ props.row[1].sellPrice | currency }}
      </b-table-column>

      <b-table-column field="" label="% изм." v-slot="props">
        <span
          :class="[
            'tag',
            getPercentClass(props.row[1].buyPrice, props.row[1].sellPrice),
          ]"
        >
          {{
            getPercent(props.row[1].buyPrice, props.row[1].sellPrice) | percent
          }}
        </span>
      </b-table-column>

      <b-table-column field="" label="Профит">
        <template v-slot:header="{ column }">
          <b-tooltip :label="getTooltip" dashed position="is-top">
            {{ column.label }}
          </b-tooltip>
        </template>

        <template v-slot="props">
          <span
            :class="
              getProfitClass(props.row[1].buyPrice, props.row[1].sellPrice)
            "
          >
            {{
              getProfit(
                props.row[1].buyPrice,
                props.row[1].sellPrice,
                props.row[1].quantity,
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
            title="Редактировать сделку"
            icon-left="pencil"
            size="is-small"
          ></b-button>
          <b-button
            @click="removeTradeById(props.row[0])"
            type="is-danger"
            title="Удалить сделку"
            icon-left="trash-can"
            size="is-small"
            outlined
          ></b-button>
        </div>
      </b-table-column>

      <template #empty v-if="!isLoading">
        <div class="has-text-centered">{{ noTradesText }}</div>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import messages from "@/components/utils/messages.js";
import tradeMixin from "@/mixins/trade.js";

export default {
  name: "Table",

  mixins: [tradeMixin],

  props: {
    portfolioId: String,
    isLoading: Boolean,
    trades: Object,
  },

  data() {
    return {
      noTradesText: messages.trade["no-trades"],
    };
  },

  computed: {
    ...mapGetters({
      getTooltip: "user/GET_TABLE_FEE_TOOLTIP",
    }),

    ...mapState({
      fee: (state) => state.user.profile.brokerFeePercent,
    }),
  },

  methods: {
    ...mapActions({
      removeTrade: "portfolio/REMOVE_TRADE",
    }),

    getPercent(buyPrice, sellPrice) {
      let percent = (buyPrice * 100) / sellPrice;

      if (buyPrice === sellPrice) {
        return "0";
      } else if (percent > 100) {
        percent = percent - 100;

        return -parseFloat(percent.toFixed(2));
      } else {
        return parseFloat(percent.toFixed(2));
      }
    },

    getPercentClass(buyPrice, sellPrice) {
      buyPrice = parseFloat(buyPrice);
      sellPrice = parseFloat(sellPrice);

      if (buyPrice < sellPrice) {
        return "is-success";
      } else if (buyPrice > sellPrice) {
        return "is-danger";
      }
    },

    getProfitClass(buyPrice, sellPrice) {
      buyPrice = parseFloat(buyPrice);
      sellPrice = parseFloat(sellPrice);

      if (buyPrice < sellPrice) {
        return "has-text-success";
      } else if (buyPrice > sellPrice) {
        return "has-text-danger";
      }

      return "";
    },

    removeTradeById(id) {
      const params = {
        id: id,
        portfolioId: this.portfolioId,
      };

      if (confirm(messages.actions["sure-question"])) {
        this.removeTrade(params);
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
