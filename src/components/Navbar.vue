<template>
  <div class="navbar">
    <nav class="deep-purple darken-1">
      <div class="container">
        <router-link :to="{ name: 'GMap' }" class="brand-logo left">
          Geome!
        </router-link>
        <ul class="right">
          <li v-if="!user">
            <router-link :to="{ name: 'Signup' }">Signup</router-link>
          </li>
          <li v-if="!user">
            <router-link :to="{ name: 'Login' }">Login</router-link>
          </li>
          <li v-if="user">
            Hi here, <b class="name">{{ user.email }}</b>
          </li>
          <li v-if="user">
            <a @click="handleClick">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { projectAuth } from "../firebase/config";
import { useRouter } from "vue-router";
import getUser from "@/composables/getUser";
export default {
  name: "Navbar",
  setup() {
    const feedback = ref("");
    const router = useRouter();

    // observer check if user sign in
    const { user } = getUser();

    const handleClick = () => {
      const logout = projectAuth.signOut();
      logout
        .then(() => {
          router.push({ name: "Login" });
        })
        .catch((err) => {
          console.log(err.message);
          feedback.value = err.message;
        });
    };

    return { feedback, handleClick, user };
  },
};
</script>

<style>
.name {
  border-right: 1px solid #d4a7d480;
  padding-right: 10px;
}
</style>
