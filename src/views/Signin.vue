<template>
  <div>
    <v-img src="@/assets/mata_background.jpg">
      <v-container class="mt-15">
        <v-container class="fill-height mt-13" fluid>
          <v-row align="center" justify="center">
            <v-col cols="15" sm="8" md="8">
              <v-card class="elevation-12 rounded-l" max-width="">
                <v-row>
                  <v-col class="primary darken-4 white--text" cols="6">
                    <v-container class="mt-12 mb-15">
                      <div class="d-flex justify-center">
                        <v-img
                          class=""
                          src="@/assets/sample_logo.png"
                          max-width="100%"
                        ></v-img>
                      </div>
                    </v-container>
                  </v-col>
                  <v-col cols="">
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
                        color="primary darken-4"
                        class="mr-2"
                        @click="submit()"
                        :loading="loading"
                        >Login</v-btn
                      >
                      <v-btn rounded elevation="2" color="yellow" @click="reset"
                        >Reset</v-btn
                      >
                      <p class="caption primary--text mt-5">
                        Forgot your password?
                      </p>
                      <v-divider class="mt-"></v-divider>
                      <p class="caption grey--text text--lighten-1 mt-5">
                        Powered by: NWAS IT Solutions | Version 2.0
                      </p>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
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
