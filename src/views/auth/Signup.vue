<template>
  <div class="signup container">
    <form @submit.prevent="handleSubmit" class="card-panel">
      <h2 class="center deep-purple-text">
        Signup
      </h2>
      <div class="field">
        <label for="email">Email:</label>
        <input type="email" v-model="email" name="email" />
      </div>
      <div class="field">
        <label for="password">Password:</label>
        <input type="password" v-model="password" name="password" />
      </div>
      <div class="field">
        <label for="alias">Alias:</label>
        <input type="text" v-model="alias" name="alias" />
      </div>
      <p class="red-text center">{{ feedback }}</p>
      <div class="field center">
        <button class="btn deep-purple">
          Signup
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "@vue/reactivity";
import slugify from "slugify";
import { projectFirestore, projectAuth } from "@/firebase/config";
export default {
  name: "Signup",
  setup() {
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const alias = ref("");
    const feedback = ref("");

    const handleSubmit = () => {
      if (alias.value && email.value && password.value) {
        const slug = slugify(alias.value, {
          replacement: "-",
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true,
        });

        const docRef = projectFirestore.collection("users").doc(slug);
        docRef.get().then((doc) => {
          // check if data exists
          if (doc.data()) {
            feedback.value = "This alias already exists";
          } else {
            projectAuth
              .createUserWithEmailAndPassword(email.value, password.value)
              .then((res) => {
                docRef.set({
                  alias: alias.value,
                  geolocation: null,
                  user_id: res.user.uid,
                });
              })
              .then(() => {
                router.push({ name: "GMap" });
              })
              .catch((err) => {
                console.log(err);
                feedback.value = err.message;
              });
          }
        });
      } else {
        feedback.value = "You must enter all fields";
      }
    };
    return { email, password, alias, feedback, handleSubmit };
  },
};
</script>

<style>
.signup {
  max-width: 400px;
  margin-top: 60px;
}
.signup h2 {
  font-size: 2.4em;
}
.signup .field {
  margin-bottom: 16px;
}
</style>
