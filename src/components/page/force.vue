<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/" class="breadcrumb">
                <el-breadcrumb-item><i class="el-icon-upload"></i> Test</el-breadcrumb-item>
                <el-breadcrumb-item>力导向图</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-button
                @click="a">
                点击就送
            </el-button>
        </div>
        <svg></svg>
    </div>
</template>

<script>
    import {event as currentEvent} from 'd3';
    export default {
        data() {
            return {
            }
        },
        methods:{
            a() {
                this.load();
            },
            load() {
              var json = {
            "nodes": [
              {"name": "Myriel", "group": 1},
              {"name": "Napoleon", "group": 1},
              {"name": "Mlle.Baptistine", "group": 1},
              {"name": "Mme.Magloire", "group": 1},
              {"name": "CountessdeLo", "group": 1},
              {"name": "Geborand", "group": 1},
              {"name": "Champtercier", "group": 1},
              {"name": "Cravatte", "group": 1},
              {"name": "Count", "group": 1},
              {"name": "OldMan", "group": 1},
              {"name": "Labarre", "group": 2},
              {"name": "Valjean", "group": 2},
              {"name": "Marguerite", "group": 3},
              {"name": "Mme.deR", "group": 2},
              {"name": "Isabeau", "group": 2},
              {"name": "Gervais", "group": 2},
              {"name": "Tholomyes", "group": 3},
              {"name": "Listolier", "group": 3},
              {"name": "Fameuil", "group": 3},
              {"name": "Blacheville", "group": 3},
              {"name": "Favourite", "group": 3},
              {"name": "Dahlia", "group": 3},
              {"name": "Zephine", "group": 3},
              {"name": "Fantine", "group": 3},
              {"name": "Mme.Thenardier", "group": 4},
              {"name": "Thenardier", "group": 4},
              {"name": "Cosette", "group": 5},
              {"name": "Javert", "group": 4},
              {"name": "FauchelcurrentEvent", "group": 0},
              {"name": "Bamatabois", "group": 2},
              {"name": "Perpetue", "group": 3},
              {"name": "Simplice", "group": 2},
              {"name": "Scaufflaire", "group": 2},
              {"name": "Woman1", "group": 2},
              {"name": "Judge", "group": 2},
              {"name": "Champmathieu", "group": 2},
              {"name": "Brevet", "group": 2},
              {"name": "Chenildieu", "group": 2},
              {"name": "Cochepaille", "group": 2},
              {"name": "Pontmercy", "group": 4},
              {"name": "Boulatruelle", "group": 6},
              {"name": "Eponine", "group": 4},
              {"name": "Anzelma", "group": 4},
              {"name": "Woman2", "group": 5},
              {"name": "MotherInnocent", "group": 0},
              {"name": "Gribier", "group": 0},
              {"name": "Jondrette", "group": 7},
              {"name": "Mme.Burgon", "group": 7},
              {"name": "Gavroche", "group": 8},
              {"name": "Gillenormand", "group": 5},
              {"name": "Magnon", "group": 5},
              {"name": "Mlle.Gillenormand", "group": 5},
              {"name": "Mme.Pontmercy", "group": 5},
              {"name": "Mlle.Vaubois", "group": 5},
              {"name": "Lt.Gillenormand", "group": 5},
              {"name": "Marius", "group": 8},
              {"name": "BaronessT", "group": 5},
              {"name": "Mabeuf", "group": 8},
              {"name": "Enjolras", "group": 8},
              {"name": "Combeferre", "group": 8},
              {"name": "Prouvaire", "group": 8},
              {"name": "Feuilly", "group": 8},
              {"name": "Courfeyrac", "group": 8},
              {"name": "Bahorel", "group": 8},
              {"name": "Bossuet", "group": 8},
              {"name": "Joly", "group": 8},
              {"name": "Grantaire", "group": 8},
              {"name": "MotherPlutarch", "group": 9},
              {"name": "Gueulemer", "group": 4},
              {"name": "Babet", "group": 4},
              {"name": "Claquesous", "group": 4},
              {"name": "Montparnasse", "group": 4},
              {"name": "Toussaint", "group": 5},
              {"name": "Child1", "group": 10},
              {"name": "Child2", "group": 10},
              {"name": "Brujon", "group": 4},
              {"name": "Mme.Hucheloup", "group": 8}
            ],
            "links": [
              {"source": "Napoleon", "target": "Myriel", "value": 1},
              {"source": "Mlle.Baptistine", "target": "Myriel", "value": 8},
              {"source": "Mme.Magloire", "target": "Myriel", "value": 10},
              {"source": "Mme.Magloire", "target": "Mlle.Baptistine", "value": 6},
              {"source": "CountessdeLo", "target": "Myriel", "value": 1},
              {"source": "Geborand", "target": "Myriel", "value": 1},
              {"source": "Champtercier", "target": "Myriel", "value": 1},
              {"source": "Cravatte", "target": "Myriel", "value": 1},
              {"source": "Count", "target": "Myriel", "value": 2},
              {"source": "OldMan", "target": "Myriel", "value": 1},
              {"source": "Valjean", "target": "Labarre", "value": 1},
              {"source": "Valjean", "target": "Mme.Magloire", "value": 3},
              {"source": "Valjean", "target": "Mlle.Baptistine", "value": 3},
              {"source": "Valjean", "target": "Myriel", "value": 5},
              {"source": "Marguerite", "target": "Valjean", "value": 1},
              {"source": "Mme.deR", "target": "Valjean", "value": 1},
              {"source": "Isabeau", "target": "Valjean", "value": 1},
              {"source": "Gervais", "target": "Valjean", "value": 1},
              {"source": "Listolier", "target": "Tholomyes", "value": 4},
              {"source": "Fameuil", "target": "Tholomyes", "value": 4},
              {"source": "Fameuil", "target": "Listolier", "value": 4},
              {"source": "Blacheville", "target": "Tholomyes", "value": 4},
              {"source": "Blacheville", "target": "Listolier", "value": 4},
              {"source": "Blacheville", "target": "Fameuil", "value": 4},
              {"source": "Favourite", "target": "Tholomyes", "value": 3},
              {"source": "Favourite", "target": "Listolier", "value": 3},
              {"source": "Favourite", "target": "Fameuil", "value": 3},
              {"source": "Favourite", "target": "Blacheville", "value": 4},
              {"source": "Dahlia", "target": "Tholomyes", "value": 3},
              {"source": "Dahlia", "target": "Listolier", "value": 3},
              {"source": "Dahlia", "target": "Fameuil", "value": 3},
              {"source": "Dahlia", "target": "Blacheville", "value": 3},
              {"source": "Dahlia", "target": "Favourite", "value": 5},
              {"source": "Zephine", "target": "Tholomyes", "value": 3},
              {"source": "Zephine", "target": "Listolier", "value": 3},
              {"source": "Zephine", "target": "Fameuil", "value": 3},
              {"source": "Zephine", "target": "Blacheville", "value": 3},
              {"source": "Zephine", "target": "Favourite", "value": 4},
              {"source": "Zephine", "target": "Dahlia", "value": 4},
              {"source": "Fantine", "target": "Tholomyes", "value": 3},
              {"source": "Fantine", "target": "Listolier", "value": 3},
              {"source": "Fantine", "target": "Fameuil", "value": 3},
              {"source": "Fantine", "target": "Blacheville", "value": 3},
              {"source": "Fantine", "target": "Favourite", "value": 4},
              {"source": "Fantine", "target": "Dahlia", "value": 4},
              {"source": "Fantine", "target": "Zephine", "value": 4},
              {"source": "Fantine", "target": "Marguerite", "value": 2},
              {"source": "Fantine", "target": "Valjean", "value": 9},
              {"source": "Mme.Thenardier", "target": "Fantine", "value": 2},
              {"source": "Mme.Thenardier", "target": "Valjean", "value": 7},
              {"source": "Thenardier", "target": "Mme.Thenardier", "value": 13},
              {"source": "Thenardier", "target": "Fantine", "value": 1},
              {"source": "Thenardier", "target": "Valjean", "value": 12},
              {"source": "Cosette", "target": "Mme.Thenardier", "value": 4},
              {"source": "Cosette", "target": "Valjean", "value": 31},
              {"source": "Cosette", "target": "Tholomyes", "value": 1},
              {"source": "Cosette", "target": "Thenardier", "value": 1},
              {"source": "Javert", "target": "Valjean", "value": 17},
              {"source": "Javert", "target": "Fantine", "value": 5},
              {"source": "Javert", "target": "Thenardier", "value": 5},
              {"source": "Javert", "target": "Mme.Thenardier", "value": 1},
              {"source": "Javert", "target": "Cosette", "value": 1},
              {"source": "FauchelcurrentEvent", "target": "Valjean", "value": 8},
              {"source": "FauchelcurrentEvent", "target": "Javert", "value": 1},
              {"source": "Bamatabois", "target": "Fantine", "value": 1},
              {"source": "Bamatabois", "target": "Javert", "value": 1},
              {"source": "Bamatabois", "target": "Valjean", "value": 2},
              {"source": "Perpetue", "target": "Fantine", "value": 1},
              {"source": "Simplice", "target": "Perpetue", "value": 2},
              {"source": "Simplice", "target": "Valjean", "value": 3},
              {"source": "Simplice", "target": "Fantine", "value": 2},
              {"source": "Simplice", "target": "Javert", "value": 1},
              {"source": "Scaufflaire", "target": "Valjean", "value": 1},
              {"source": "Woman1", "target": "Valjean", "value": 2},
              {"source": "Woman1", "target": "Javert", "value": 1},
              {"source": "Judge", "target": "Valjean", "value": 3},
              {"source": "Judge", "target": "Bamatabois", "value": 2},
              {"source": "Champmathieu", "target": "Valjean", "value": 3},
              {"source": "Champmathieu", "target": "Judge", "value": 3},
              {"source": "Champmathieu", "target": "Bamatabois", "value": 2},
              {"source": "Brevet", "target": "Judge", "value": 2},
              {"source": "Brevet", "target": "Champmathieu", "value": 2},
              {"source": "Brevet", "target": "Valjean", "value": 2},
              {"source": "Brevet", "target": "Bamatabois", "value": 1},
              {"source": "Chenildieu", "target": "Judge", "value": 2},
              {"source": "Chenildieu", "target": "Champmathieu", "value": 2},
              {"source": "Chenildieu", "target": "Brevet", "value": 2},
              {"source": "Chenildieu", "target": "Valjean", "value": 2},
              {"source": "Chenildieu", "target": "Bamatabois", "value": 1},
              {"source": "Cochepaille", "target": "Judge", "value": 2},
              {"source": "Cochepaille", "target": "Champmathieu", "value": 2},
              {"source": "Cochepaille", "target": "Brevet", "value": 2},
              {"source": "Cochepaille", "target": "Chenildieu", "value": 2},
              {"source": "Cochepaille", "target": "Valjean", "value": 2},
              {"source": "Cochepaille", "target": "Bamatabois", "value": 1},
              {"source": "Pontmercy", "target": "Thenardier", "value": 1},
              {"source": "Boulatruelle", "target": "Thenardier", "value": 1},
              {"source": "Eponine", "target": "Mme.Thenardier", "value": 2},
              {"source": "Eponine", "target": "Thenardier", "value": 3},
              {"source": "Anzelma", "target": "Eponine", "value": 2},
              {"source": "Anzelma", "target": "Thenardier", "value": 2},
              {"source": "Anzelma", "target": "Mme.Thenardier", "value": 1},
              {"source": "Woman2", "target": "Valjean", "value": 3},
              {"source": "Woman2", "target": "Cosette", "value": 1},
              {"source": "Woman2", "target": "Javert", "value": 1},
              {"source": "MotherInnocent", "target": "FauchelcurrentEvent", "value": 3},
              {"source": "MotherInnocent", "target": "Valjean", "value": 1},
              {"source": "Gribier", "target": "FauchelcurrentEvent", "value": 2},
              {"source": "Mme.Burgon", "target": "Jondrette", "value": 1},
              {"source": "Gavroche", "target": "Mme.Burgon", "value": 2},
              {"source": "Gavroche", "target": "Thenardier", "value": 1},
              {"source": "Gavroche", "target": "Javert", "value": 1},
              {"source": "Gavroche", "target": "Valjean", "value": 1},
              {"source": "Gillenormand", "target": "Cosette", "value": 3},
              {"source": "Gillenormand", "target": "Valjean", "value": 2},
              {"source": "Magnon", "target": "Gillenormand", "value": 1},
              {"source": "Magnon", "target": "Mme.Thenardier", "value": 1},
              {"source": "Mlle.Gillenormand", "target": "Gillenormand", "value": 9},
              {"source": "Mlle.Gillenormand", "target": "Cosette", "value": 2},
              {"source": "Mlle.Gillenormand", "target": "Valjean", "value": 2},
              {"source": "Mme.Pontmercy", "target": "Mlle.Gillenormand", "value": 1},
              {"source": "Mme.Pontmercy", "target": "Pontmercy", "value": 1},
              {"source": "Mlle.Vaubois", "target": "Mlle.Gillenormand", "value": 1},
              {"source": "Lt.Gillenormand", "target": "Mlle.Gillenormand", "value": 2},
              {"source": "Lt.Gillenormand", "target": "Gillenormand", "value": 1},
              {"source": "Lt.Gillenormand", "target": "Cosette", "value": 1},
              {"source": "Marius", "target": "Mlle.Gillenormand", "value": 6},
              {"source": "Marius", "target": "Gillenormand", "value": 12},
              {"source": "Marius", "target": "Pontmercy", "value": 1},
              {"source": "Marius", "target": "Lt.Gillenormand", "value": 1},
              {"source": "Marius", "target": "Cosette", "value": 21},
              {"source": "Marius", "target": "Valjean", "value": 19},
              {"source": "Marius", "target": "Tholomyes", "value": 1},
              {"source": "Marius", "target": "Thenardier", "value": 2},
              {"source": "Marius", "target": "Eponine", "value": 5},
              {"source": "Marius", "target": "Gavroche", "value": 4},
              {"source": "BaronessT", "target": "Gillenormand", "value": 1},
              {"source": "BaronessT", "target": "Marius", "value": 1},
              {"source": "Mabeuf", "target": "Marius", "value": 1},
              {"source": "Mabeuf", "target": "Eponine", "value": 1},
              {"source": "Mabeuf", "target": "Gavroche", "value": 1},
              {"source": "Enjolras", "target": "Marius", "value": 7},
              {"source": "Enjolras", "target": "Gavroche", "value": 7},
              {"source": "Enjolras", "target": "Javert", "value": 6},
              {"source": "Enjolras", "target": "Mabeuf", "value": 1},
              {"source": "Enjolras", "target": "Valjean", "value": 4},
              {"source": "Combeferre", "target": "Enjolras", "value": 15},
              {"source": "Combeferre", "target": "Marius", "value": 5},
              {"source": "Combeferre", "target": "Gavroche", "value": 6},
              {"source": "Combeferre", "target": "Mabeuf", "value": 2},
              {"source": "Prouvaire", "target": "Gavroche", "value": 1},
              {"source": "Prouvaire", "target": "Enjolras", "value": 4},
              {"source": "Prouvaire", "target": "Combeferre", "value": 2},
              {"source": "Feuilly", "target": "Gavroche", "value": 2},
              {"source": "Feuilly", "target": "Enjolras", "value": 6},
              {"source": "Feuilly", "target": "Prouvaire", "value": 2},
              {"source": "Feuilly", "target": "Combeferre", "value": 5},
              {"source": "Feuilly", "target": "Mabeuf", "value": 1},
              {"source": "Feuilly", "target": "Marius", "value": 1},
              {"source": "Courfeyrac", "target": "Marius", "value": 9},
              {"source": "Courfeyrac", "target": "Enjolras", "value": 17},
              {"source": "Courfeyrac", "target": "Combeferre", "value": 13},
              {"source": "Courfeyrac", "target": "Gavroche", "value": 7},
              {"source": "Courfeyrac", "target": "Mabeuf", "value": 2},
              {"source": "Courfeyrac", "target": "Eponine", "value": 1},
              {"source": "Courfeyrac", "target": "Feuilly", "value": 6},
              {"source": "Courfeyrac", "target": "Prouvaire", "value": 3},
              {"source": "Bahorel", "target": "Combeferre", "value": 5},
              {"source": "Bahorel", "target": "Gavroche", "value": 5},
              {"source": "Bahorel", "target": "Courfeyrac", "value": 6},
              {"source": "Bahorel", "target": "Mabeuf", "value": 2},
              {"source": "Bahorel", "target": "Enjolras", "value": 4},
              {"source": "Bahorel", "target": "Feuilly", "value": 3},
              {"source": "Bahorel", "target": "Prouvaire", "value": 2},
              {"source": "Bahorel", "target": "Marius", "value": 1},
              {"source": "Bossuet", "target": "Marius", "value": 5},
              {"source": "Bossuet", "target": "Courfeyrac", "value": 12},
              {"source": "Bossuet", "target": "Gavroche", "value": 5},
              {"source": "Bossuet", "target": "Bahorel", "value": 4},
              {"source": "Bossuet", "target": "Enjolras", "value": 10},
              {"source": "Bossuet", "target": "Feuilly", "value": 6},
              {"source": "Bossuet", "target": "Prouvaire", "value": 2},
              {"source": "Bossuet", "target": "Combeferre", "value": 9},
              {"source": "Bossuet", "target": "Mabeuf", "value": 1},
              {"source": "Bossuet", "target": "Valjean", "value": 1},
              {"source": "Joly", "target": "Bahorel", "value": 5},
              {"source": "Joly", "target": "Bossuet", "value": 7},
              {"source": "Joly", "target": "Gavroche", "value": 3},
              {"source": "Joly", "target": "Courfeyrac", "value": 5},
              {"source": "Joly", "target": "Enjolras", "value": 5},
              {"source": "Joly", "target": "Feuilly", "value": 5},
              {"source": "Joly", "target": "Prouvaire", "value": 2},
              {"source": "Joly", "target": "Combeferre", "value": 5},
              {"source": "Joly", "target": "Mabeuf", "value": 1},
              {"source": "Joly", "target": "Marius", "value": 2},
              {"source": "Grantaire", "target": "Bossuet", "value": 3},
              {"source": "Grantaire", "target": "Enjolras", "value": 3},
              {"source": "Grantaire", "target": "Combeferre", "value": 1},
              {"source": "Grantaire", "target": "Courfeyrac", "value": 2},
              {"source": "Grantaire", "target": "Joly", "value": 2},
              {"source": "Grantaire", "target": "Gavroche", "value": 1},
              {"source": "Grantaire", "target": "Bahorel", "value": 1},
              {"source": "Grantaire", "target": "Feuilly", "value": 1},
              {"source": "Grantaire", "target": "Prouvaire", "value": 1},
              {"source": "MotherPlutarch", "target": "Mabeuf", "value": 3},
              {"source": "Gueulemer", "target": "Thenardier", "value": 5},
              {"source": "Gueulemer", "target": "Valjean", "value": 1},
              {"source": "Gueulemer", "target": "Mme.Thenardier", "value": 1},
              {"source": "Gueulemer", "target": "Javert", "value": 1},
              {"source": "Gueulemer", "target": "Gavroche", "value": 1},
              {"source": "Gueulemer", "target": "Eponine", "value": 1},
              {"source": "Babet", "target": "Thenardier", "value": 6},
              {"source": "Babet", "target": "Gueulemer", "value": 6},
              {"source": "Babet", "target": "Valjean", "value": 1},
              {"source": "Babet", "target": "Mme.Thenardier", "value": 1},
              {"source": "Babet", "target": "Javert", "value": 2},
              {"source": "Babet", "target": "Gavroche", "value": 1},
              {"source": "Babet", "target": "Eponine", "value": 1},
              {"source": "Claquesous", "target": "Thenardier", "value": 4},
              {"source": "Claquesous", "target": "Babet", "value": 4},
              {"source": "Claquesous", "target": "Gueulemer", "value": 4},
              {"source": "Claquesous", "target": "Valjean", "value": 1},
              {"source": "Claquesous", "target": "Mme.Thenardier", "value": 1},
              {"source": "Claquesous", "target": "Javert", "value": 1},
              {"source": "Claquesous", "target": "Eponine", "value": 1},
              {"source": "Claquesous", "target": "Enjolras", "value": 1},
              {"source": "Montparnasse", "target": "Javert", "value": 1},
              {"source": "Montparnasse", "target": "Babet", "value": 2},
              {"source": "Montparnasse", "target": "Gueulemer", "value": 2},
              {"source": "Montparnasse", "target": "Claquesous", "value": 2},
              {"source": "Montparnasse", "target": "Valjean", "value": 1},
              {"source": "Montparnasse", "target": "Gavroche", "value": 1},
              {"source": "Montparnasse", "target": "Eponine", "value": 1},
              {"source": "Montparnasse", "target": "Thenardier", "value": 1},
              {"source": "Toussaint", "target": "Cosette", "value": 2},
              {"source": "Toussaint", "target": "Javert", "value": 1},
              {"source": "Toussaint", "target": "Valjean", "value": 1},
              {"source": "Child1", "target": "Gavroche", "value": 2},
              {"source": "Child2", "target": "Gavroche", "value": 2},
              {"source": "Child2", "target": "Child1", "value": 3},
              {"source": "Brujon", "target": "Babet", "value": 3},
              {"source": "Brujon", "target": "Gueulemer", "value": 3},
              {"source": "Brujon", "target": "Thenardier", "value": 3},
              {"source": "Brujon", "target": "Gavroche", "value": 1},
              {"source": "Brujon", "target": "Eponine", "value": 1},
              {"source": "Brujon", "target": "Claquesous", "value": 1},
              {"source": "Brujon", "target": "Montparnasse", "value": 1},
              {"source": "Mme.Hucheloup", "target": "Bossuet", "value": 1},
              {"source": "Mme.Hucheloup", "target": "Joly", "value": 1},
              {"source": "Mme.Hucheloup", "target": "Grantaire", "value": 1},
              {"source": "Mme.Hucheloup", "target": "Bahorel", "value": 1},
              {"source": "Mme.Hucheloup", "target": "Courfeyrac", "value": 1},
              {"source": "Mme.Hucheloup", "target": "Gavroche", "value": 1},
              {"source": "Mme.Hucheloup", "target": "Enjolras", "value": 1}
            ]
          };  
                  
              var width = 800;
              var height = 600;
              var svg = this.$d3.select("svg")
                          .attr("width",width)
                          .attr("height",height);
              
              // 通过布局来转换数据，然后进行绘制
              var simulation = this.$d3.forceSimulation()
                    .force("link", this.$d3.forceLink().id(function(d) { return d.name; }))
                    .force("charge",this.$d3.forceManyBody())
                    .force("center",this.$d3.forceCenter(width/2, height/2));
              // console.log(simulation);

              simulation.nodes(json.nodes).on('tick', draw);
              simulation.force('link').links(json.links);

              var color = this.$d3.scaleOrdinal(this.$d3.schemeCategory20);  
              // 绘制
              var svg_links = svg.selectAll("line")
                  .data(json.links)
                  .enter()
                  .append("line")
                  .attr("class", "lines")
                  .attr("stroke","#000")
                  .attr("stroke-width",1/*, function(d) { return d.value / 5; }*/)
                  .attr("stroke-opacity", 0.5);
              // console.log('links', svg_links);

              var svg_nodes = svg.selectAll("circle")
                  .data(json.nodes)
                  .enter()
                  .append("circle")
                  .attr("r",2)
                  .attr("fill",function(d,i){
                      return color(i);
                  })    
                  .attr("cx",function(d){return d.x;})
                  .attr("cy",function(d){return d.y;})
                  .call(this.$d3.drag()
                      .on("start", dragstarted)
                      .on("drag", dragged)
                      .on("end", dragended));
              
              var svg_text = svg.selectAll("text")
                  .data(json.nodes)
                  .enter()
                  .append("text")
                  .style("fill","#000")
                  .attr("dx",2)
                  .attr("dy",1)
                  .text(function(d){return d.name;});

              // console.log("转换后的nodes links数据:");
              // console.log(json.nodes);
              // console.log(json.links);
              
              function draw(){
                  svg_nodes
                      .attr("cx",function(d){return d.x;})
                      .attr("cy",function(d){return d.y;});

                  svg_text
                      .attr("x", function(d){ return d.x; })
                       .attr("y", function(d){ return d.y; });

                  svg_links
                      .attr("x1",function(d){return d.source.x; })
                       .attr("y1",function(d){ return d.source.y; })
                       .attr("x2",function(d){ return d.target.x; })
                       .attr("y2",function(d){ return d.target.y; });
              }
              // simulation.on("tick",draw);

              function dragstarted(d) {
                console.log("DragStarted");
                if (!currentEvent.active) {
                  simulation.alphaTarget(0.3).restart();
                }
                d.fx = d.x;
                d.fy = d.y;
              }

              function dragged(d) {
                console.log("Dragged");
                d.fx = currentEvent.x;
                d.fy = currentEvent.y;
              }

              function dragended(d) {
                console.log("DragEnded");
                if (!currentEvent.active) {
                  simulation.alphaTarget(0);
                }
                d.fx = null;
                d.fy = null;
              }
            }
          }
        }
</script>

<style>
      line:hover {
          stroke-width: 2;
          stroke-opacity: 0.8;
      }
      circle:hover {
          r: 5;
      }
      text {
          font-family: sans-serif;
          font-weight: bold;
          font-size: 10px;
      }
</style>