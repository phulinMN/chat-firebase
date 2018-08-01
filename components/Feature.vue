<template>
    <div>
        <h1>Feature</h1>
        <input class="form-control" v-model="message" v-on:keyup.13="add" type="text">
        <div v-if="data">
            <ul class="list-group">
                <li  v-for="(item,index) in data" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
                    {{item}}
                    <span class="badge badge-primary badge-pill" @click="deleteMessage(index)">x</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      message: null,
      data: null,
      n: 0
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    add() {
      this.addToFirebase();
      // this.data[this.n] = this.message;
      // this.message = null;
      // this.n++;
    },
    async addToFirebase() {
      const messageRef = this.$firebase
        .database()
        .ref()
        .child("message")
        .push(this.message);
      this.message = null;
      this.loadList();
    },
    async loadList() {
      const messageRef = await this.$firebase.database().ref("message");
      messageRef.once("value", snapshot => {
          this.data = snapshot.val();
          console.log(snapshot.val());
      });
      console.log('load');
    },
    async deleteMessage(id) {
      var updates = {};
      updates[`/message/${id}`] = null;
      // console.log(`${this.catId}----${id}`);
      const deletemsg = await this.$firebase
        .database()
        .ref()
        .update(updates);
      this.loadList();
    }
  }
};
</script>

