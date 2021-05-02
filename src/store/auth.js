import firebase from "firebase/app";

const auth = {
  actions: {
    async register({ dispatch }, { email, password }) {
      console.log(dispatch);
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    },
  },
};

export default auth;
