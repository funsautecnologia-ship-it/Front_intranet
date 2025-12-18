export default class User {
    constructor({
        nome = '',
        name = '',
        email = '',
        password = '',
        confirmPassword = '',
        role = '',
        active = true,
        endereco = [
            {
                rua: '',
                numero: '',
                bairro: '',
                cidade: '',
                estado: '',
                cep: '',
            },
        ],
    } = {}) {
        this.nome = nome || name;
        this.name = name || nome;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.role = role;
        this.active = active;
        this.endereco = endereco;
    }
}
