<template>
  <div class="map">
    <div class="google-map" id="map"></div>
  </div>
</template>

<script>
import getUser from "@/composables/getUser";
import { onMounted, ref } from "@vue/runtime-core";
import { projectFirestore } from "../firebase/config";
import { useRouter } from "vue-router";
export default {
  name: "Gmap",
  setup() {
    const router = useRouter();
    const lat = ref(53);
    const lng = ref(-2);
    // get current user
    const { user } = getUser();

    const renderMap = () => {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: lat.value, lng: lng.value },
        zoom: 6,
        maxZoom: 15,
        minZoom: 3,
        streetViewControl: false,
      });

      projectFirestore
        .collection("users")
        .get()
        .then((users) => {
          users.docs.forEach((doc) => {
            const data = doc.data();
            if (data.geolocation) {
              const marker = new google.maps.Marker({
                position: {
                  lat: data.geolocation.lat,
                  lng: data.geolocation.lng,
                },
                map,
              });
              // add click event to marker
              marker.addListener("click", () => {
                router.push({ name: "ViewProfile", params: { id: doc.id } });
              });
            }
          });
        });
    };
    onMounted(() => {
      // get user geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            lat.value = pos.coords.latitude;
            lng.value = pos.coords.longitude;

            // find the user record and then update geocoords
            projectFirestore
              .collection("users")
              .where("user_id", "==", user.value.uid)
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc) => {
                  projectFirestore
                    .collection("users")
                    .doc(doc.id)
                    .update({
                      geolocation: {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                      },
                    });
                });
              })
              .then(() => {
                renderMap();
              });
          },
          (err) => {
            console.log(err);
            renderMap();
          },
          {
            maximumAge: 60000,
            timeout: 3000,
          }
        );
      } else {
        //  position center by default values
        renderMap();
      }
    });

    return { renderMap };
  },
};
</script>

<style>
.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
