<template>
  <div class="container">
    <ul>
      <li v-for="msg in messages" :key="msg.text">
        {{ msg.userName }}:
        {{ msg.text }}
      </li>
    </ul>

    <input
      class="h-12 rounded-full shadow focus:shadow-md outline-none px-6 py-3"
      placeholder="Typ een bericht"
      @input="textInputChange"
      @keyup.enter="send"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      messages: {}, // {id: message}
      socket: window.io("localhost:4000"),
    };
  },

  created: function () {
    console.log(this.messages);

    const sendJWT = () => {
      this.socket.emit("jwt", localStorage.getItem("jwt"));
    };

    this.socket.on("reconnect", () => {
      console.log("socket reconnected");
      sendJWT();
    });
    sendJWT();

    this.socket.on("message", (msg) => {
      this.$set(this.messages, msg._id, msg);
      console.log(this.messages);
    });
  },

  destroyed: function () {
    this.socket.close();
  },

  methods: {
    textInputChange: function (evt) {
      this.socket.emit("typing", evt.target.value);
    },
    send: function (evt) {
      this.socket.emit("send");
      evt.target.value = "";
    },
  },
};
</script>