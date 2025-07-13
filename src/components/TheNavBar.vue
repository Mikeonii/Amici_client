<template>
  <nav class="" v-if="user">
    <!-- nav drawer -->
    <v-navigation-drawer
      app
      v-model="drawer"
      :src="require(`@/assets/${this.app_settings.app_bg}`)"
      width="320"
      class=""
    >
      <v-list>
        <!-- link 1 -->
        <template v-if="authenticated">
          <v-list-item>
            <v-list-item-avatar>
              <img
                :src="
                  app_settings.app_logo2
                    ? require('@/assets/' + app_settings.app_logo2)
                    : require('@/assets/' + app_settings.app_logo)
                "
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <!-- <template v-if="authenticated"> -->
              <v-list-item-title class="white--text text--lighten-4 overline">{{
                this.app_settings.app_name
              }}</v-list-item-title>
              <v-list-item-subtitle
                :class="`${this.app_settings.app_color}--text text--darken-1`"
                >Powered by JMBComputers</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            active-class="active"
            v-for="link in links"
            v-bind:key="link.icon"
            route
            :to="link.route"
          >
            <v-list-item-icon>
              <v-icon class="white--text text--darken-2">{{
                link.icon
              }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="white--text text--lighten-2">{{
                link.name
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <!-- link 2 -->
        <template v-else>
          <v-list-item>
            <v-list-item-avatar>
              <img
                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8SEhUPDRIVFQ0XFRcYDRcYFRUXFRgVFxcbFhUYGhUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtQygtLisBCgoKDg0OGxAPGismHyYtKy0rMS01LSs1NzMyMC01NSstLS01NS0vLS43Li0rNjUvLS0tLisrLy0tNi0tLS4yLv/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAADAQADAQEAAAAAAAAAAAABAgMABQYHBAj/xABJEAABAwIDBgQEAQYJDAMAAAABAALwAxEEQcEFEiFRcdEGBzFhEyKB4RQycnOCkdIIIzQ1U1RiobMlM0JDUnSSoqOxwvEXJJP/xAAaAQEBAQEBAQEAAAAAAAAAAAAAAQIDBQQG/8QALxEBAAICAAQBCwQDAAAAAAAAAAECAxEEEiExUQUTMkFxgZGhwdHwFFJhsSIjNP/aAAwDAQACEQMRAD8A7qhPsihPsqgz7LWmiwE0Ths0QYBMGohqcNQKGzVMGzVMBNUwbNUC7s1Tbs1Tbs1TbqBN2ckQ2ck+7OSIbOSCYbNEd2aKgbNFt2aIJ7s0W3VTdmi26gluzmhuqu6huoJbs1Sls1Vt2apS2aoJFs1SlqsWzVKWoIFqUtVi1IWoIkTRafZUImiQiaIBPsstPssgN/dBa6yoywE06LAJ2iadFAQJp0ThqwbNOicNkyQYBMGohqcNQANmqYCa9UQ2TNMGzXqgF`pr`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"
              />
            </v-list-item-avatar>
            <v-list-item-content>
              <!-- <template v-if="authenticated"> -->
              <v-list-item-title class="white--text text--lighten-4"
                >Mata Online Portal</v-list-item-title
              >
              <v-list-item-subtitle class="primary--text text--lighten-3"
                >Mata Funeral Homes & Plan Inc.</v-list-item-subtitle
              >
              <v-list-item-subtitle
                class="grey--text text--lighten-3"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            class="pr-2"
            v-for="link in links2"
            v-bind:key="link.icon"
            route
            :to="link.route"
          >
            <v-list-item-icon>
              <v-icon class="grey--text text--lighten-4">{{
                link.icon
              }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="grey--text text--lighten-4">{{
                link.name
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>

      <template v-slot:append class="">
        <div class="pa-2 d-flex justify ml-3">
          <p class="caption white--text">
            <v-icon small color="white" class="pr-2">mdi-flash</v-icon>Powered
            by:
            <strong>JMBComputers IT Solutions version {{ version }}</strong>
            <br />
            <span class="grey--text text--darken-1"
              ><v-icon color="white" small class="pr-2">mdi-gmail</v-icon>
              janmichaelbesinga873@gmail.com</span
            >
          </p>
          <!-- <v-btn block> Logout </v-btn> -->
        </div>
      </template>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import packageJson from "../../package.json";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["hide"],
  name: "Navbar",
  computed: {
    ...mapGetters({
      user: "auth/user",
      loading_out: "1",
      app_settings: "auth/app_settings",
    }),
  },
  created() {
    this.version = packageJson.version;
    console.log(this.appLogo);
  },
  data() {
    return {
      version: "",
      authenticated: true,
      drawer: true,
      links: [
        { icon: "mdi-home", name: "Dashboard", route: "/" },

        // {
        //   icon: "mdi-account-group",
        //   name: "Accounts",
        //   route: "/accounts",
        // },

        {
          icon: "mdi-package-variant-closed",
          name: "Subscriptions",
          route: "/items",
        },
      ],
      links2: [
        { icon: "mdi-login", name: "Sign-in", route: "/signin", small: true },
        { icon: "mdi-book", name: "About", route: "/about", small: true },
      ],
    };
  },
  methods: {
    ...mapActions({
      signOutActions: "auth/signOut",
    }),
    signOut() {
      this.loading_out = "2";
      this.signOutActions().then(() => {
        this.loading_out = "1";
        this.$router.push(`/signin`);
      });
    },
  },
};
</script>
<style scoped>
.active {
  background-image: #1565c0;
}
</style>
