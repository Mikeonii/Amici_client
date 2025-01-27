<template>
  <div>
    <v-img src="@/assets/banner.jpg" width="" height="%">
      <v-container class="mt-15">
        <v-container class="fill-height mt-13" fluid>
          <v-row align="center" justify="center">
            <v-card class="elevation-12 rounded-l" max-width="800">
              <div class="mt-10 mr-11 ml-5 text-center">
                <h1 class="grey--text">Sign in here</h1>
                <br />
                <v-form ref="form">
                  <v-text-field
                    class="rounded-xl"
                    prepend-icon="mdi-account-outline"
                    label="Username"
                    placeholder="Enter your username"
                    filled
                    v-model="form.username"
                  ></v-text-field>
                  <v-text-field
                    type="password"
                    class="rounded-xl"
                    prepend-icon="mdi-lock-outline"
                    label="Password"
                    placeholder="Enter your password"
                    filled
                    v-model="form.password"
                  ></v-text-field>
                </v-form>
                <v-btn
                  rounded
                  elevation="2"
                  color="black"
                  class="mr-2 white--text"
                  @click="submit()"
                  :loading="loading"
                  >Login</v-btn
                >
                <v-btn rounded elevation="2" color="" @click="reset"
                  >Reset</v-btn
                >

                <p class="caption grey--text text--lighten-1 mt-5">
                  Powered by: JMBComputers | Version 2.0
                </p>
              </div>
            </v-card>
          </v-row>
        </v-container>
      </v-container>
    </v-img>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      loading: false,
    };
  },
  methods: {
    ...mapActions({
      signin: "auth/signin",
      set_notification: "notification/set_notification",
    }),
    reset() {
      (this.form.username = ""), (this.form.password = "");
    },
    submit() {
      this.loading = true;
      this.signin(this.form)
        .then(() => {
          this.loading = false;
          this.$router.push("/");
        })
        .catch((err) => {
          if (err.response.status == 401) {
            this.set_notification({
              message: "Username or Password Incorrect. Please try again.",
              color: "red",
              showing: true,
              icon: "mdi-alert",
            });
          } else {
            this.set_notification({
              message: "Something went wrong. Please contact the administrator",
              color: "red",
              showing: true,
              icon: "mdi-alert",
            });
          }
          this.loading = false;
        });
    },
  },
};
</script>

<style></style>
