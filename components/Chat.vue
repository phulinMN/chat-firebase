<template>
  <div>
    <div v-if="connected" class="chat-window">
      <div class="chat-head">
        <h1>ROOM : {{this.room}}</h1>
      </div>
      <div class="chat-body" ref="chatbox">
        <div class="message-body" v-if="Object.keys(customHistory).length" v-for="(item,index) in customHistory" :key="index">
          <div :class="checkUser(item.user)">
            <div class="col-10">
              <div><span class="name-user" v-if="item.check">{{item.user}}</span></div>
              <div><span class="message-box" v-html="item.message"></span></div>
              <!-- <div><span class="time-send">{{item.timeSend}}</span></div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="chat-input">
        <input type="text" class="form-control input-msg" v-model="message" v-on:keyup.13="sendMessage">
      </div>
    </div>
    <div v-else>
      <div>
        <label>room</label>
        <input type="text" v-model="room">
      </div>
      <div v-if="room">
        <label>name</label>
        <input type="text" v-model="user" v-on:keyup.13="login"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      connected: false,
      user: null,
      message: null,
      room: null,
      history: null,
      imageType: /image.*/,
      fileText: /pdf|doc|docx/,
      urlR: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
    };
  },
  computed: {
    customHistory() {
      var sender = null;
      const history = { ...this.history };
      let data = Object.values(history).map(h => {
        const item = { ...h };
        var ty = item.type;
        var ms = item.message;
        if (ty.match(this.imageType)) {
          item.img = "img";
          item.message = null;
        } else if (ty.match(this.fileText)) {
          item.message =
            '<a href="' + item.fileUrl + '" target="_blank">' + ms + "</a>";
        }
        if (ms.match(this.urlR)) {
          var web = ms;
          if (ms.match(/^www.*/)) {
            web = "https://" + ms;
          }
          item.message = '<a href="' + web + '" target="_blank">' + ms + "</a>";
        }
        if (item.timeSend) {
          var date = new Date(item.timeSend);
          var hours = date.getHours();
          var minutes = "0" + date.getMinutes();
          var formattedTime = hours + ":" + minutes.substr(-2);
          item.timeSend = formattedTime;
        }
        if (item.user == sender) {
          item.check = 0;
        } else {
          item.check = 1;
        }
        sender = item.user;
        return item;
      });
      return data;
    }
  },
  mounted() {
    this.loadHistory();
  },
  methods: {
    async login() {
      const roomRef = await this.$firebase
        .database()
        .ref(`${this.room}`);
      const snapshotMe = await roomRef
        .child("user")
        .orderByChild("name")
        .equalTo(this.user)
        .once("value");
        
      const joined = snapshotMe.val() !== null;
      if (!joined) {
        roomRef.child("user").push({
          name: this.user 
        });
        console.log('add');
      }
      this.loadHistory();
      this.connected = true;
    },
    async loadHistory() {
      const roomRef = await this.$firebase.database().ref(`${this.room}`);
      const snapshot = await roomRef.child("message").once("value");
      if (snapshot.val()) {
        this.history = snapshot.val();
      }
      roomRef.child("message").on("child_added", snapshot => {
        const value = snapshot.val();
        let newHistory = { ...this.history };
        newHistory[snapshot.key] = value;
        this.history = newHistory;
        this.scrollToBottom();
      });
    },
    sendMessage() {
      if (this.message.length === 0) return;
      this.$firebase
        .database()
        .ref(`${this.room}`)
        .child("message")
        .push({
          user: this.user,
          message: this.message,
          fileUrl: "",
          type: "text",
          timeSend: this.$firebase.database.ServerValue.TIMESTAMP
        });
      this.message = "";
      this.loadHistory();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        var refChatBox = this.$refs.chatbox;
        if (typeof refChatBox === "undefined") return;
        refChatBox.scrollTop =
          refChatBox.scrollHeight - refChatBox.clientHeight;
      });
    },
    checkUser(user) {
      if(user == this.user) {
        return "row justify-content-end text-right";
      } else {
        return "row justify-content-start text-left";
      }
    }
  }
};
</script>

<style scoped>
.chat-window {
  padding: 10px;
  width: 100%;
  height: 600px;
}
.chat-head {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  background-color: orange;
}
.chat-body {
  width: 100%;
  height: 80%;
  background-color: rgb(211, 207, 207);
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-behavior: smooth;
}
.chat-input {
  width: 100%;
  height: 10%;
  background-color: gray;
}
.input-msg {
  background-color: gray;
  height: 100%;
}
.message-body {
  padding: 5px 10px;
}
.message-box {
  padding: 5px;
  background-color: gray;
  border-radius: 10px;
  color: white;
}
.name-user, .time-send {
  color: gray;
}
</style>


