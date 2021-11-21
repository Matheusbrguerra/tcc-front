import React, { Component } from 'react'
import toastr from 'cogo-toast';
import api from '../services/api'
import { format } from 'date-fns'
import { Link } from 'react-router-dom';
class Prescricao extends Component {
    constructor(props) {
        super(props);

        this.state = {
            prescricoes: [],
            atendimentos: [],
            pessoas: [],
            editUser: {},
            deleteUser: 0,
            IdAtendimento: 0,
            IdPessoa: 0,
            pessoaPrescricao: '',
            deletePrescricao: 0
        }

        this.handleAnswer = this.handleAnswer.bind(this)
        this.handlePostPrescricao = this.handlePostPrescricao.bind(this)
    }
    componentDidMount() {
        const pathname = this.props.location.pathname
        const [, , id] = pathname.split('/')
        this.setState({
            IdAtendimento: Number(id)
        })
        this.getPrescricoes(id)
        this.getAtendimentos()
        this.getPessoas()
    }

    async getPrescricoes(id) {
        let { data } = (await api.get(`prescricoes/atendimento/${id}`))
        const strFormat = 'dd/MM/yyyy HH:mm:ss'
        const prescricoes = []
        data.forEach(element => {
            let obj = {}
            obj.id = element.id
            obj.Atendimento = element.Atendimento.id
            obj.Pessoa = element.Pessoa.nome
            obj.IdPessoa = element.Pessoa.id
            obj.dataLiberacao = element.Dt_liberacao ? format(new Date(element.Dt_liberacao), strFormat) : '-'
            obj.dataPrescricao = element.Dt_prescricao ? format(new Date(element.Dt_prescricao), strFormat) : '-'
            obj.dataSuspensao = element.Dt_suspensao ? format(new Date(element.Dt_suspensao), strFormat) : '-'

            prescricoes.push(obj)
        })

        this.setState({
            prescricoes,
            IdPessoa: prescricoes.length ? prescricoes[0].IdPessoa : 0,
            pessoaPrescricao: prescricoes.length ? prescricoes[0].Pessoa : ''
        })
    }

    async getAtendimentos() {
        let { data } = (await api.get('atendimentos'))
        const atendimentos = []

        data.forEach(element => {
            let obj = {}
            obj.id = element.id

            atendimentos.push(obj)
        });

        this.setState({
            atendimentos,
        })
    }

    async getPessoas() {
        const { data } = (await api.get('pessoas'))

        this.setState({
            pessoas: data,
        })
    }

    async handleAnswer(answer) {
        if (answer) {
            const response = await api.delete(`prescricoes/${this.state.deletePrescricao}`)
            await this.getPrescricoes(this.state.IdAtendimento)
            toastr.success(response.data.msg, { position: 'top-right', heading: 'Sucesso !!' })
        }
    }

    handleDeletePrescricao(id) {
        this.setState({
            deletePrescricao: id
        })
    }

    async handlePostPrescricao(answer) {
        const { IdAtendimento, IdPessoa } = this.state
        if (answer) {
            const response = await api.post('prescricoes',
                {
                    IdAtendimento,
                    IdPessoa
                })
            if (response) {
                toastr.success(`Prescrição criada com sucesso !!`, { position: 'top-right', heading: 'Sucesso !!' })
            }
            await this.getPrescricoes(this.state.IdAtendimento)
        }
    }

    render() {
        return (
            <div className="card mt-4">
                <div className="card-header">
                    <h4 className="card-title"> Prescrições </h4>
                    <Link to="/" className="btn btn-primary btn-sm pull-right" > Voltar </Link>
                    <button type="button" className="btn btn-primary btn-sm pull-right" data-toggle="modal" data-target="#addModal"> Cadastrar </button>
                </div>
                <div className="card-body">
                    <div className="col-md-12">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th> Id </th>
                                    <th> Atendimento </th>
                                    <th> Pessoa </th>
                                    <th> Data de Prescrição </th>
                                    <th> Data de Liberação </th>
                                    <th> Data de Suspensão </th>
                                    <th> Ações </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.prescricoes.map((prescr, i) => (
                                    <tr key={prescr.id} align="center">
                                        <td> {prescr.id} </td>
                                        <td> {prescr.Atendimento} </td>
                                        <td> {prescr.Pessoa} </td>
                                        <td> {prescr.dataPrescricao} </td>
                                        <td> {prescr.dataLiberacao} </td>
                                        <td> {prescr.dataSuspensao} </td>
                                        <td>
                                            <Link className="btn btn-info btn-sm mr-2" to={{
                                                pathname: `/procedimentos/${prescr.id}`, 
                                                state: {
                                                    IdAtendimento: this.state.IdAtendimento
                                                }
                                            }}> Procedimentos </Link>
                                            <button className="btn btn-danger btn-sm" onClick={this.handleDeletePrescricao.bind(this, prescr.id)} data-toggle="modal" data-target="#deleteModal"> Suspender </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* 
                    Modal suspensão
                */}
                <div className="modal" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Atenção !! A prescrição {this.state.deletePrescricao} será suspensa </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <label className="modal-title">Você deseja prosseguir com a suspensão ? </label>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-info btn-sm mr-2" onClick={this.handleAnswer.bind(this, true)} data-dismiss="modal">Sim</button>
                                <button type="submit" className="btn btn-danger btn-sm" onClick={this.handleAnswer.bind(this, false)} data-dismiss="modal">Não</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 
                    Modal cricao
                */}
                <div className="modal fade" id="addModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Atenção !! </h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <label className="modal-title">Você deseja realmente prosseguir com o cadastro uma nova prescrição para {this.state.pessoaPrescricao} ?</label>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-info btn-sm mr-2" onClick={this.handlePostPrescricao.bind(this, true)} data-dismiss="modal">Sim</button>
                                <button type="submit" className="btn btn-danger btn-sm" onClick={this.handlePostPrescricao.bind(this, false)} data-dismiss="modal">Não</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Prescricao