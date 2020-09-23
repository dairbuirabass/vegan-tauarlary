import Vue from 'vue';
import Vuex from 'vuex';
import * as firebase from 'firebase';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        loadedProducts: [],
        user: null,
        loading: false,
        error: null
    },
    mutations: {
        setLoadedProducts (state, payload) {
            state.loadedProducts = payload
        },
        addProduct (state, payload) {
            state.loadedProducts.push(payload)
        },
        setUser (state, payload) {
             state.user = payload
        },
        setLoading (state, payload) {
             state.loading = payload
        },
        setError (state, payload) {
            state.error = payload
        },
        clearError (state) {
            state.error = null
        }
    },
    actions: {
        loadProducts({commit}) {
            commit('setLoading', true)
            firebase.database().ref('products').once('value')
              .then((data) => {
                  let products = []
                  const obj = data.val()
                  for (let key in obj) {
                      let imgUrl
                      firebase.storage().ref('products/' + key).getDownloadURL()
                        .then(url => {
                          imgUrl = url

                          products.push({
                              id: key,
                              title: obj[key].title,
                              imageUrl: imgUrl,
                          })
                        })
                  }
                  commit('setLoadedProducts', products)
                  commit('setLoading', false)
                })
                .catch(
                    (error) => {
                        console.log(error)
                        commit('setLoading', false)
                    }
                )
        },
        addProduct ({commit}, payload) {
            const product = {
                title: payload.title,
            }
            let key
            firebase.database().ref('products').push(product)
              .then((data) => {
                  key = data.key
                  return key
              })
              .then(key => {
                  return firebase.storage().ref('products/' + key).put(payload.image)
              })
              .then((snapshot) => {
                  return snapshot.ref.getDownloadURL()
              })
              .then((url) => {
                  commit('addProduct', {
                      ...product,
                      id: key,
                      imageUrl: url
                  })
              })
              .catch((error) => {
                  console.log(error)
              })
        },
        signUserUp ({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
              .then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.uid,
                        registeredProducts: []
                    }
                    commit('setUser', newUser)
                }
              )
              .catch(
                error => {
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error)
                }
              )
        },
        signUserIn ({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
              .then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.uid,
                        registeredProducts: []
                    }
                    commit('setUser', newUser)
                }
              )
              .catch(
                error => {
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error)
                }
              )
        },
        autoSignIn ({commit}, payload) {
            commit('setUser', {id: payload.uid, registeredProducts: []})
        },
        logout ({commit}) {
            firebase.auth().signOut()
            commit('setUser', null)
        },
        clearError ({commit}) {
            commit('clearError')
        },
        setError ({commit}, payload) {
            commit('setError', payload)
        }
    },
    getters: {
        loadedSeries (state) {
            return state.loadedProducts
        },
        user (state) {
            return state.user
        },
        loading (state) {
            return state.loading
        },
        error (state) {
            return state.error
        }
    }
})
