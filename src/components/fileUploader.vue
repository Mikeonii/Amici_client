<template>
  <div v-if="item">
    <div v-if="!item.profile_picture_url">
      <v-img
        :src="require(`@/assets/${this.app_settings.app_logo}`)"
        width="100%"
        height="50%"
      ></v-img>
    </div>
    <div v-else-if="item.profile_picture_url">
      <v-avatar size="250">
        <v-img :src="item.profile_picture_url" width="100%"></v-img>
      </v-avatar>
    </div>
    <div class="mt-5">
      <input
        class="black--text"
        type="file"
        ref="photo_upload"
        name="photo_upload"
        accept="image/*"
      />
      <br />
      <v-btn small class="mt-5" color="" @click="uploadFile" :loading="loading">
        Upload Picture</v-btn
      >
    </div>
    <!-- lazy -->
    <alert-modal
      title="Alert"
      :message="alertMessage"
      v-if="enableAlert"
      @close="enableAlert = false"
    />
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default {
  components: { alertModal: () => import("./alertModal.vue") },
  props: ["item"],
  data() {
    return {
      alertMessage: "",
      enableAlert: "",
      imageUrl: null, // Stores uploaded image path
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      default_server_url: "auth/default_server_url",
      app_settings: "auth/app_settings",
    }),
  },
  methods: {
    ...mapActions({
      upload_profile_picture: "account/upload_profile_picture",
    }),
    async uploadFile() {
      this.loading = true;
      //1. store file in the laravel public folder
      const file = this.$refs.photo_upload.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await axios.post(
          this.default_server_url + "/api/upload_file",
          //   this.default_server_url is 127.0.0.1:8000
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        // Assuming response.data.filePath contains the URL of the uploaded image
        this.imageUrl = this.default_server_url + response.data.filePath;

        //   2. edit user's profile picture url
        this.upload_profile_picture({
          id: this.item.id,
          profile_picture_url: this.imageUrl,
        }).then(() => {
          this.alertMessage = "Picture Uploaded!";
          this.enableAlert = true;
          this.uploading = false;
        });

        this.loading = false;
      } catch (error) {
        console.error("Upload error:", error);
        this.loading = false;
      }
    },
  },
};
</script>
