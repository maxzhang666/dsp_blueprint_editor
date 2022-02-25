<template>
    <template v-for="(s, i) in p.storage" :key="i">
        <div class="station-storage" v-if="s.itemId > 0">
            <ItemRecipeIcon :name="itemsMap.get(s.itemId)!.icon"/>
            <div class="num">上限：{{s.max}}</div>
            <div>
                <div class="role" :class="roleClass.get(s.localRole)">本地{{roleText.get(s.localRole)}}</div>
                <div v-if="inter" class="role" :class="roleClass.get(s.remoteRole)">星际{{roleText.get(s.remoteRole)}}</div>
            </div>
        </div>
        <div class="station-storage" v-else>
            <div class="icon-placeholder"></div>
            <div class="placeholder">空栏位</div>
        </div>
    </template>
    <div class="station-params">
        <div><label>最大充能功率</label><span class="v">{{(p.workEnergyPerTick * 60 / 1_000_000).toLocaleString([], { minimumFractionDigits: 1, maximumFractionDigits: 1 })}} MW</span></div>
        <div><label>运输机最远路程</label><span class="v">{{(Math.acos(p.tripRangeOfDrones) / Math.PI * 180.0).toLocaleString([], { maximumFractionDigits: 0 })}}°</span></div>
        <div v-if="inter"><label>运输船最远路程</label><span class="v">{{tripRangeOfShips}}</span></div>
        <div v-if="inter"><label>轨道采集器</label><span class="v">{{truth(p.includeOrbitCollector)}}</span></div>
        <div v-if="inter"><label>曲速启用路程</label><span class="v">{{p.warpEnableDistance / 40000}} AU</span></div>
        <div v-if="inter"><label>翘曲器必备</label><span class="v">{{truth(p.warperNecessary)}}</span></div>
        <div><label>运输机起送量</label><span class="v">{{p.deliveryAmountOfDrones}}%</span></div>
        <div v-if="inter"><label>运输船起送量</label><span class="v">{{p.deliveryAmountOfShips}}%</span></div>
        <div><label>输出货物集装数量</label><span class="v">{{p.pilerCount === 0 ? '使用科技上限' : p.pilerCount}}</span></div>
    </div>
</template>

<script lang="ts">
import { LogisticRole } from '@/blueprint/parser';

const roleText = new Map([
    [LogisticRole.None, '仓储'],
    [LogisticRole.Demand, '需求'],
    [LogisticRole.Supply, '供应'],
])

const roleClass = new Map([
    [LogisticRole.None, 'role-none'],
    [LogisticRole.Demand, 'role-demand'],
    [LogisticRole.Supply, 'role-supply'],
])
</script>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';
import { BlueprintBuilding, StationParameters } from '@/blueprint/parser';
import ItemRecipeIcon from './ItemRecipeIcon.vue';
import { itemsMap } from '@/data';
import { isInterstellarStation } from '@/data/items';

const props = defineProps<{
    building: BlueprintBuilding,
}>();

const p = computed(() => props.building.parameters as StationParameters);

const tripRangeOfShips = computed(() => {
    const ly = p.value.tripRangeOfShips / 2400000.0;
    if (ly > 9999.0)
        return '∞';
    else
        return ly.toLocaleString([], { maximumFractionDigits: 0 }) + ' ly';
})

const inter = computed(() => isInterstellarStation(props.building.itemId));

const truth = (v: boolean) => v ? '√' : '×';
</script>

<style lang="scss">
.station-storage {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 10px 0;

    .num {
        margin-left: 5px;
        margin-right: auto;
    }

    .role {
        padding: 2px 10px;
        margin: 2px 0;
        font-size: 0.8em;
    }
    .role-none {
        background: #B2B2B2;
    }
    .role-demand {
        background: #D98A59;
    }
    .role-supply {
        background: #4A8BA8;
    }

    .icon-placeholder {
        height: 2.5em;
        width: 2.5em;
        border-radius: 50%;
        background: #e4e4e4;
    }
    .placeholder {
        opacity: 0.3;
        font-size: 1.8em;
        text-align: center;
        flex: auto;
    }

}
.station-params {
    >div {
        display: flex;
        flex-direction: row;
    }
    label {
        display: inline-block;
    }
    .v {
        display: inline-block;
        text-align: right;
        flex: auto;
    }
}
</style>