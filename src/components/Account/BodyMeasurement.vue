<template>
  <v-container>
    <!-- MEASUREMENTS TABLE -->
    <v-row class="mt-3">
      <v-col> <h4>Body Measurement (By inches)</h4></v-col>
      <v-spacer></v-spacer>
      <v-col class="d-flex justify-end">
        <add-body-measurement-modal :account_id="item.id" class="mb-2" />
      </v-col>
    </v-row>
    <v-data-table :items="measurements" :headers="measurement_headers">
      <template v-slot:item.created_at="{ item }">
        {{ formatted_date_time(item.created_at) }}</template
      >
      <!-- <template v-slot:item.action="{ item }"> -->
      <!-- <div class="d-flex">
                  <account-modal :item="item" />
                  <edit-account-modal :item="item" />
                  <v-btn icon @click="print_waiver(item)">
                    <v-icon color="green">mdi-printer</v-icon></v-btn
                  >
                  <v-btn
                    icon
                    color="red"
                    @click="del(item.id)"
                    :loading="button_loading"
                    ><v-icon>mdi-delete</v-icon></v-btn
                  >
                </div> -->
      <!-- </template> -->
    </v-data-table>
  </v-container>
</template>

<script>
import moment from "moment";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { mapActions, mapGetters } from "vuex";
import AddBodyMeasurementModal from "./AddBodyMeasurementModal.vue";

export default {
  props: ["item"],
  components: { AddBodyMeasurementModal },
  data() {
    return {
      picture: null,
      picture_url: null,
      uploading: false,
      measurement_headers: [
        { text: "ID", value: "id" },

        {
          text: "Upper Arm",
          value: "upper_arm",
        },
        {
          text: "Forearm",
          value: "forearm",
        },
        {
          text: "Chest",
          value: "chest",
        },
        {
          text: "Thigh",
          value: "thigh",
        },
        {
          text: "Calf",
          value: "calf",
        },
        {
          text: "Waist",
          value: "waist",
        },
        {
          text: "Shoulder",
          value: "shoulder",
        },
        {
          text: "Date Measured",
          value: "created_at",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      measurements: "account/measurements",
    }),
  },
  mounted() {
    this.get_measurements(this.item.id);
  },
  methods: {
    formatted_date(item) {
      let x = moment(item).format("MMMM D, YYYY");
      return x;
    },
    formatted_date_time(dateTime) {
      return moment(dateTime).format("MMMM D,YYYY - h:m:s A");
    },
    ...mapActions({ get_measurements: "account/get_measurements" }),
    insert_body_image(e) {
      this.picture = e.target.files[0];
      this.picture_url = URL.createObjectURL(this.picture);
    },
    upload_body_image() {
      this.uploading = true;
      const storage = getStorage();
      const storageRef = ref(storage, "BodyImprovements/" + this.picture_url);
      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, this.picture).then(() => {
        getDownloadURL(storageRef).then((downloadURL) => {
          this.upload_body_improvement_picture({
            id: this.item.id,
            body_improvement_url: downloadURL,
          }).then(() => {
            alert("Picture Uploaded!");
            this.uploading = false;
          });
        });
      });
    },
  },
};
</script>

<style></style>
