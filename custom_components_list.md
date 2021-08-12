<!-- NOTIFICATIONS COMPONENT -->

<h1>How to use Confirm Notification</h1>

1. import the component
   import ConfirmNotification from "@/components/ConfirmNotification.vue";
2. register the component in the components
   components:{
   ConfirmNotification
   }
3. insert this into the DOM
   <div v-if="show_confirm">
          <confirm-notification
            icon="mdi-alert-outline"
            class="alert"
            type="warning"
            :message="this.alert_message"
            @confirm-event="proceed_deletion"
            @cancel-event="close"
          />
    </div>
4. edit alert_message in data()
5. @ event fires, set this.show_confirm = true;
6. if confirm create a function
   proceed_deletion()
   else create a function
   close()

<h1>How to use Alert Notification</h1>

1.  instantiate the fuction through mapActions using Vuex
    ...mapActions({
    set_notification: "notification/set_notification",
    }),
2.  call the function
    this.set_notification({
    message: "You have successfully deleted an item",
    color: "success",
    showing: true,
    icon: "mdi-check",
    });

<!-- HOW TO USE PROCESSING NOTIFICATION -->
<h1>How to use Processing notification</h1>

1. import component
   import ProgressLinear from "@/components/ProgressLinear.vue";
2. insert this in your vue
   <progress-linear :dialog="progress_dialog" />
3. register your component
4. turn progress linear on or off through "progress_dialog" data binding in data(){return{}}

<!-- END OF NOTIFICATIONS COMPONENT -->
