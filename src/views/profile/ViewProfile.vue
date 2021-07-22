<template>
  <div class="view-profile container">
    <div v-if="profile" class="card">
      <h2 class="deep-purple-text center">{{ profile.alias }}'s Wall</h2>
      <transition-group
        tag="ul"
        class="comments collection"
        name="comments"
        appear
      >
        <li v-for="(message, index) in formattedDocuments" :key="index">
          <div class="deep-purple-text user-name">
            <span>{{ message.from }}</span>
          </div>
          <div class="grey-text text-darken-2">
            <span> {{ message.content }}</span>
          </div>
          <div class="grey-text user-time">
            <span> {{ message.time }} ago </span>
          </div>
        </li>
      </transition-group>
      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label for="comment">Add a comment</label>
          <input type="text" name="comment" v-model="comment" />
        </div>
        <div>
          <a class="btn waves-effect waves-light deep-purple" @click.prevent="handleSubmit">
            Send
            <i class="material-icons right">send</i>
          </a>
        </div>
      </form>
      <p v-if="feedback" class="red-text center">{{ feedback }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import {
  projectFirestore,
  projectAuth,
  timestamp,
} from "../../firebase/config";
import { useRoute } from "vue-router";
import { computed } from "@vue/runtime-core";
import { formatDistanceToNow } from "date-fns";
export default {
  name: "ViewProfile",
  setup() {
    const route = useRoute();

    // user wall
    const profile = ref("");
    const comment = ref("");
    const feedback = ref("");
    const user = ref(null);
    // all commets
    const comments = ref(null);
    // name of collection
    const collectionUsers = projectFirestore.collection("users");
    const collectionComments = projectFirestore.collection("comments");

    // get current user
    collectionUsers
      .where("user_id", "==", projectAuth.currentUser.uid)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          user.value = doc.data();
          user.id = doc.id;
        });
      });

    // profile data
    collectionUsers
      .doc(route.params.id)
      .get()
      .then((user) => {
        profile.value = user.data();
      });

    // comments
    collectionComments
      .orderBy("time")
      .where("to", "==", route.params.id)
      .onSnapshot((snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          if (doc.data().time) {
            results.push({
              from: doc.data().from,
              content: doc.data().content,
              time: doc.data().time,
            });
          }
          comments.value = results;
          feedback.value = null;
        }),
          (err) => {
            console.log(err.message);
            feedback.value = "Could not fetch comments";
          };
      });

    // formatted time
    const formattedDocuments = computed(() => {
      if (comments.value) {
        return comments.value.map((doc) => {
          let t = formatDistanceToNow(doc.time.toDate());
          return { ...doc, time: t };
        });
      }
    });

    const handleSubmit = () => {
      if (comment.value) {
        feedback.value = null;
        projectFirestore.collection("comments").add({
          to: route.params.id,
          from: user.value.alias,
          content: comment.value,
          time: timestamp(),
        });
        comment.value = "";
      } else {
        feedback.value = "You must enter a comment to add it";
      }
    };

    return { profile, feedback, comment, handleSubmit, formattedDocuments };
  },
};
</script>

<style scoped>
.view-profile .card {
  padding: 20px;
  margin-top: 60px;
}

.view-profile h2 {
  font-size: 2em;
  margin-top: 0;
}
.view-profile li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

form {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.field {
  width: 70%;
}

.user-name {
  font-size: 1.2em;
}

.user-time {
  font-size: 0.9em;
  font-style: italic;
}

/* Comments transitions */
.comments-enter-from,
.comments-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
.comments-enter-active,
.comments-leave-active {
  transition: all 0.4s ease;
}
.comments-leave-active {
  position: absolute;
}
.comments-move {
  transition: all 0.3s ease;
}
</style>
