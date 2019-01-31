<template>
  <div class="hello">
    <b-jumbotron class="login" header="Login" lead="You need to login in order to use the service. Please login, or create a new user!">
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="usernameGroup">
          <b-form-input id="username" type="text" v-model="form.username" required placeholder="Enter username"/>
        </b-form-group>
        <b-form-group id="passwordGroup">
         <b-form-input id="password" type="text" v-model="form.password" required placeholder="Enter password"/>

        </b-form-group>
        <b-button type="submit" variant="info">Login</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
      <p>Don't have an account? <router-link id="link" to="/register">Join us!</router-link></p>
    </b-jumbotron>
  </div>
</template>

<script>
import UserService from '../services/UserService.js'
  export default {
    name: 'LoginView',
    data() {
      return {
        form: {
          username: '',
          password: '',
          token: null
        },
        show: true
      }
    },
    async created(){
    try{
      this.token = await UserService.checkToken();
    }catch(err){
      this.error = err.message;
    }
    },
    methods: {
      async onSubmit (evt) {
        evt.preventDefault();

        await UserService.login(this.form.username, this.form.password).then(resData => {
          // eslint-disable-next-line
          console.log(resData);
          if (resData.success) {
            this.$router.push('/');
          }
        })
      },
      onReset (evt) {
        evt.preventDefault();
        /* Reset our form values */
        this.form.username = '';
        this.form.password = '';
        /* Trick to reset/clear native browser form validation state */
        this.show = false;
        this.$nextTick(() => { this.show = true });
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  div.login {
    width: 50%;
    margin: 0 auto;
    background-color: #e6e6e6;
  }

  #link {
    text-decoration:underline;
    color: #2c3e50;
    font-weight: bold;
  }

  #link:hover {
    color:#5c73a8;
  }

</style>