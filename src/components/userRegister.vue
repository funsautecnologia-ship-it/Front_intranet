<template>
    <div class="user-register">
        <h1>Cadastro de Usuário</h1>
        <p v-if="message">{{ this.message }}</p>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="name">Nome</label>
                <input
                    type="text"
                    id="name"
                    v-model="form.name"
                    placeholder="Digite seu nome"
                    required
                />
            </div>
            <div class="form-group">
                <label for="email">E-mail</label>
                <input
                    type="email"
                    id="email"
                    v-model="form.email"
                    placeholder="Digite seu e-mail"
                    required
                />
            </div>
            <div>
                <label for="role">Tipo de Usuário</label>
                <select id="role" v-model="form.role" required>
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>
            <div class="form-group">
                <label for="password">Senha</label>
                <input
                    type="password"
                    id="password"
                    v-model="form.password"
                    placeholder="Digite sua senha"
                    required
                />
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirmar Senha</label>
                <input
                    type="password"
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    placeholder="Confirme sua senha"
                    required
                />
            </div>
            <button type="submit">Cadastrar</button>
        </form>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import api from '../services/api'
export default {
    name: "UserRegister",
    data() {
        return {
            form: {
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "user",
            },
            message: "",
        };
    },
    methods: {
        async handleSubmit() {

            try {
                const response = await api.post('/auth/register', {
                    name: this.form.name,
                    email: this.form.email,
                    password: this.form.password,
                    role: this.form.role,
                })// Simulate form submission
                console.log("Formulário enviado:", this.form);
                alert("Usuário cadastrado com sucesso!");
                this.resetForm();
            } catch (error) {
                alert("Erro ao cadastrar usuário!");
                this.message = "Erro ao cadastrar usuário. Verifique os dados e tente novamente.";  
            }
            /*if (this.form.password !== this.form.confirmPassword) {
                alert("As senhas não coincidem!");
                return;
            }
            const response = await api.post('/auth/register', {
                name: this.form.name,
                email: this.form.email,
                password: this.form.password 
                })// Simulate form submission
            console.log("Formulário enviado:", this.form);
            alert("Usuário cadastrado com sucesso!");
            this.resetForm();*/
        },
        resetForm() {
            this.form = {
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                role: "user",
                endereco: [
                    {
                        rua: '',
                        numero: '',
                        bairro: '',
                        cidade: '',
                        estado: '',
                        cep: '',
                    },
                ],
            };
        },
    },
};
</script>

<style scoped>
.user-register {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>