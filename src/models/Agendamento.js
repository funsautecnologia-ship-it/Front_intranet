export default class Agendamento
{
    constructor({
        descricao = '',
        dataInicio= '',
        Hora= '',
        Infra= null,
        Equipamentos = null,
        solicitante = null,
    } = {}) {
        this.descricao = descricao;
        this.dataInicio = dataInicio; // Deve ser um objeto Date
        this.Hora = Hora; // Deve ser um objeto Date
        this.Infra = Infra; // Deve ser um objeto Infraestrutura
        this.Equipamentos = Equipamentos; // Deve ser um objeto Equipamento
        this.solicitante = solicitante; // Deve ser um objeto User
    }
}
