import React, { Component } from 'react'
import toastr from 'cogo-toast';
import api from '../services/api'
import { format } from 'date-fns'
import { Link } from 'react-router-dom';

class Procedimentos extends Component {
    constructor(props) {
        super(props);

        this.state = {
            procedimentos: [],
            deleteUser: 0,
            IdPrescricao: 0,
        }
    }
    componentDidMount() {
        const pathname = this.props.location.pathname
        const [, , id] = pathname.split('/')
        this.setState({
            IdPrescricao: Number(id)
        })
        this.getProcedimentos(id)
    }

    async getProcedimentos(id) {
        let { data } = (await api.get(`prescricao/${id}/procedimentos`))
        const strFormat = 'dd/MM/yyyy HH:mm:ss'
        const procedimentos = []
        
        data.forEach(element => {
            let obj = {}
            obj.id = element.id
            obj.Prescricao = element.Prescricao.id
            obj.Status = element.StatusExec.Nome
            obj.dataLiberacao = element.Dt_liberacao ? format(new Date(element.Dt_liberacao), strFormat) : '-'
            obj.dataProcedimento = element.Dt_prescricao ? format(new Date(element.Dt_prescricao), strFormat) : '-'
            obj.dataResultado = element.Dt_resultado ? format(new Date(element.Dt_resultado), strFormat) : '-'
            obj.dataSuspensao = element.Dt_suspensao ? format(new Date(element.Dt_suspensao), strFormat) : '-'
            obj.Procedimento = element.Procedimento.Nome
            procedimentos.push(obj)
        })


        this.setState({
            procedimentos,
            IdAtendimento: data.length > 0 ? data[0].Prescricao.Atendimento.id : null
        })
    }

    async handleAnswer(answer) {
        if (answer) {
            const response = await api.delete('prescricao-procedimento',{
                params:{
                    IdParam:this.state.deleteProcedimento,
                    IdPrescricao:this.state.IdPrescricao
                }
            })
            await this.getProcedimentos(this.state.IdPrescricao)
            toastr.success(response.data.msg, { position: 'top-right', heading: 'Sucesso !!' })
        }
    }

    handleDeleteProcedimento(id) {
        this.setState({
            deleteProcedimento: id
        })
    }
    render() {
        return (
            <div className="card mt-4">
                <div className="card-header">
                    <h4 className="card-title"> Procedimentos da Prescrição </h4>
                    <Link to={`/prescricoes/${this.state.IdAtendimento}`} className="btn btn-primary btn-sm pull-right" > Voltar </Link>
                </div>
                <div className="card-body">
                    <div className="col-md-12">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th> Id </th>
                                    <th> Prescrição </th>
                                    <th> Procedimento </th>
                                    <th> Status </th>
                                    <th> Data de Procedimento </th>
                                    <th> Data de Liberação </th>
                                    <th> Data de Suspensão </th>
                                    <th> Data de Resultado </th>
                                    <th> Ações </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.procedimentos.map((prescr, i) => (
                                    <tr key={prescr.id} align="center">
                                        <td> {prescr.id} </td>
                                        <td> {prescr.Prescricao} </td>
                                        <td> {prescr.Procedimento} </td>
                                        <td> {prescr.Status} </td>
                                        <td> {prescr.dataProcedimento} </td>
                                        <td> {prescr.dataLiberacao} </td>
                                        <td> {prescr.dataSuspensao} </td>
                                        <td> {prescr.dataResultado} </td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={this.handleDeleteProcedimento.bind(this, prescr.id)} data-toggle="modal" data-target="#deleteModal" disabled={prescr.dataSuspensao === true ? true : false}> Suspender </button>
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
                                <h5 className="modal-title">Atenção !! O Procedimento {this.state.deleteProcedimento} será suspenso </h5>
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
            </div>
        )
    }
}
export default Procedimentos