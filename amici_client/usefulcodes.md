<!-- VUEX STORE OPERATIONS -->
<h1>How to Delete an item in an array</h1>
  
DELETE_CONTRACT(state, request_id) {
    let filtered = state.contracts.filter((c) => c.id != request_id);
    state.contracts = filtered;
},

<h1>How to UPDATE an item in an array</h1>
  EDIT_MEMBER_BENEFICIARY(state, member_beneficiary) {
            state.member_beneficiaries.forEach((m, index) => {
                if (m.id == member_beneficiary.id) {
                    // m = member_beneficiary;
                    Object.assign(state.member_beneficiaries[index], member_beneficiary);
                }
            });
}

<!-- EDIT FORM -->
<h1>How to make a proper edit form</h1>
1. use ref instead of direct from props or data e.g
<v-text-field
          ref="contact_number"
          label="Contact Number"
          :value="item.contact_number"
          class="rounded-xl"
          filled
></v-text-field>
2. make another form for request e.g.
 var form = {
        id: this.item.id,
        name: this.$refs.name.internalValue,
        relationship: this.$refs.relationship.internalValue,
        age: this.$refs.age.internalValue,
        date_of_birth: this.$refs.date_of_birth.internalValue,
        member_id: this.item.member_id,
        contact_number: this.$refs.contact_number.internalValue,
};
