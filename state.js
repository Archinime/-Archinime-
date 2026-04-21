// state.js - Central de estado y eventos
window.ArchinimeState = (function() {
  let state = {
    currentUser: null,
    currentUserColor: null,
    comentariosAnimeId: null,
    comentariosSeason: null,
    comentariosEpisode: null,
  };

  const listeners = {};

  function emit(event, data) {
    if (listeners[event]) {
      listeners[event].forEach(cb => cb(data));
    }
  }

  function on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  }

  function off(event, callback) {
    if (listeners[event]) {
      listeners[event] = listeners[event].filter(cb => cb !== callback);
    }
  }

  function set(key, value) {
    if (state[key] !== value) {
      state[key] = value;
      emit(key, value);
    }
  }

  function get(key) {
    return state[key];
  }

  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(async (user) => {
      set('currentUser', user);
      if (user) {
        try {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          const color = userDoc.exists && userDoc.data().customColor ? userDoc.data().customColor : null;
          set('currentUserColor', color);
        } catch(e) { console.warn(e); }
      } else {
        set('currentUserColor', null);
      }
    });
  }

  return {
    set,
    get,
    on,
    off
  };
})();