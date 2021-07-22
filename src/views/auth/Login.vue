<template>
  <div class="login container">
    <form @submit.prevent="handleSubmit" class="card-panel">
      <h2 class="center deep-purple-text">
        Login
      </h2>
      <div class="field">
        <label for="email">Email:</label>
        <input type="email" v-model="email" name="email" />
      </div>
      <div class="field">
        <label for="password">Password:</label>
        <input type="password" v-model="password" name="password" />
      </div>
      <p v-if="feedback" class="red-text center">
        {{ feedback }}
      </p>
      <div class="field center">
        <button class="btn deep-purple">
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { projectAuth } from "../../firebase/config";
import { useRouter } from "vue-router";
export default {
  name: "Login",
  setup() {
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const feedback = ref("");

    const handleSubmit = () => {
      if (email.value && password.value) {
        feedback.value = null;
        const res = projectAuth.signInWithEmailAndPassword(
          email.value,
          password.value
        );
        res
          .then(() => {
            router.push({ name: "GMap" });
          })
          .catch((err) => {
            console.log(err.message);
            feedback.value = err.message;
          });
      } else {
        feedback.value = "Please fill in both fields";
      }
    };

    return { email, password, feedback, handleSubmit };
  },
};
</script>

<style>
.login {
  max-width: 400px;
  margin-top: 60px;
}
.login h2 {
  font-size: 2.4em;
}
.login .field {
  margin-bottom: 16px;
}
</style>
