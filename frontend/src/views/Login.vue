<template>
  <form @submit.prevent="loginUser">
    <input type="text" id="email" placeholder="Email" v-model="login.email" />
    <!-- Password -->
    <input
      type="password"
      id="password"
      placeholder="Password"
      v-model="login.password"
    />
    <p>
      Dont have an account??<router-link to="/register">click here</router-link>
    </p>
    <!-- Sign in button -->
    <center>
      <button type="submit">Sign in</button>
    </center>
  </form>
</template>
<script>
export default {
  data() {
    return {
      login: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async loginUser() {},
  },
};
</script>