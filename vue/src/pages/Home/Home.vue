<template>
  <section class="masterContainer">
    {{ query }}
    <div class="masterItem">
      <label class="font-white">Busque por artistas, álbuns ou músicas:</label>
    </div>
    <div class="item div-border-bottom">
      <input
        style="background: black"
        class="font-white"
        label="Material input"
        v-model="search"
        placeholder="Comece a escrever"
      />
    </div>
    <h1>ALO</h1>
    <section class="container flex flex-wrap">
      <div class="item">Teste 1</div>
      <div class="item">Teste 2</div>
      <div class="item">Teste 3</div>
      <div class="item">Teste 4</div>
      <div class="item">Teste 5</div>
      <div class="item">Teste 6</div>
      <div class="item">Teste 7</div>
    </section>    
    <section class="container-second-line stretch" v-if="this.$store.getters.getAlbums">
      <div class="item-second-line" v-for="(album, id) in this.$store.getters.getAlbums.items" :key="id">
        <div class="square"></div>
        <span class="item-second-line item-label font-white">{{ album.name }}</span>
      </div>
    </section>
    <span v-if="this.$store.getters.getTracks">
      <tr
        v-for="(track, id) in this.$store.getters.getTracks.items"
        :key="id"
        class="box-shadow-hover pointer f-14-300-gray"
      >
        <td class="font-white">{{ track.name }}</td>
      </tr>
    </span>
  </section>
</template>

<script>
import { mdbInput } from "mdbvue";

export default {
  components: {
    mdbInput
  },
  data() {
    return {
      search: undefined
    };
  },
  methods: {
    processInput: function(selection) {}
  },
  created() {},
  computed: {
    query() {
      if (this.search != undefined) {
        this._findByTrackAndAlbum(this.search);
      }
    },
    tracks() {},
    albums() {}
  }
};
</script>

<style>

/* Flex */
.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-item-1 {
  flex: 1;
}

/* Flex Item */
.item {
  margin: 5px;
  background: tomato;
  text-align: center;
  font-size: 1.5em;
}

.container {
  max-width: 400px;
  margin: 0 auto;
  border: 1px solid #ccc;
}

h1 {
  text-align: center;
  margin: 20px 0 0 0;
  font-size: 1.25em;
  font-weight: normal;
}

body {
  font-family: monospace;
  color: #333;
}

.stretch {
  align-items: stretch;
}

.square {
  width: 1in;
  height: 1in;
  background: gray;
  padding: 0 10px;  
  max-width: 1in;
  margin: 1in;
  display: absolute;

}

.item-second-line {
  width: 100%;
  height: 100%;
  max-width: 100%;
  flex: 1;
  margin: 15px;
  padding: 0 10px;
  text-align: center;
  font-size: 1.5em;
}

input {
  border: none;
  background-color: transparent;
  font-family: "lineto-circular-black";
}

.item-label {
  padding: 5px 5px 5px 5px;
  font-family: "lineto-circular-pro-medium";
  display: flex;
  margin: 0 auto;
  font-size: 10px;
}

.div-border-bottom {
  border: none;
  outline-width: 1;
  border-bottom: 1px solid #75d46b;
}

textarea:focus,
input:focus {
  outline: 1px;
}

.flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.flex-item-1 {
  flex: 1;
}

/* Flex Item */
.masterItem {
  margin: 5px;
  text-align: left;
  font-size: 1.5em;
}
.container-second-line {
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  border: 1px solid #ccc;
}

.masterContainer {
  max-width: 85%;
  margin: 0 auto;
}

h1 {
  text-align: cenleftter;
  margin: 20px 0 0 0;
  font-size: 1.25em;
  font-weight: normal;
}

body {
  background: black;
}

.font-white {
  color: white;
}
</style>