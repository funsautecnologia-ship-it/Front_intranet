import api from './api.js';

export default {
    login:(user)=>{
        return api.post('/auth/login', user)
    }
    
    ,loadSession: (token) => {
        return api.get('/auth/loadSession', {
                headers: { Authorization: `Bearer ${token}` }
            });
    }
}