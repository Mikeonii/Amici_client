import store from '@/store'
import axios from 'axios'
store.subscribe((mutation) => {
    //   we can set axios headers and local storage from here
    switch (mutation.type) {
        case 'auth/SET_TOKEN':
            if (mutation.payload) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${mutation.payload}`
                // storing token in browser's local storage
                localStorage.setItem('token', mutation.payload)
            }
            else {
                axios.defaults.headers.common['Authorization'] = null
                // if no item from payload, remove the token
                localStorage.removeItem('token', mutation.payload)
            }
            break
    }
})