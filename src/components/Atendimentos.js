import React, { Component } from 'react'
import toastr from 'cogo-toast';
import Create from './Create'
import api from '../services/api'
import { format } from 'date-fns'
import { Link } from 'react-router-dom';
class Atendimentos extends Component {
	constructor(props) {
		super(props);

		this.state = {
			atendimentos: [],
			editUser: {},
			deleteUser: 0
		}

		this.handleAnswer = this.handleAnswer.bind(this)
	}
	componentDidMount() {
		this.getAtendimentos()
	}
	async getAtendimentos() {
		let { data } = (await api.get('atendimentos'))
		const strFormat = 'dd/MM/yyyy HH:mm:ss'
		const atendimentos = []

		data.forEach(element => {
			let obj = {}
			obj.id = element.id
			obj.pessoa = element.Pessoa.nome
			obj.convenio = element.Convenio.Nome
			obj.tipoAtendimento = element.TipoAtendimento.Nome
			obj.procedencia = element.Procedencium.Nome
			obj.dataEntrada = element.Dt_entrada ? format(new Date(element.Dt_entrada), strFormat) : '-'
			obj.dataAlta = element.Dt_alta ? format(new Date(element.Dt_alta), strFormat) : '-'
			obj.dataCancelamento = element.Dt_cancelamento ? format(new Date(element.Dt_cancelamento), strFormat) : '-'

			atendimentos.push(obj)
		});

		this.setState({
			atendimentos,
		})
	}

	async handleAnswer(answer) {
		if (answer) {
			const response = await api.delete(`atendimentos/${this.state.deleteUser}`)
			await this.getAtendimentos()
			toastr.success(response.data.msg, { position: 'top-right', heading: 'Sucesso !!' })
		}
	}

	handleDeleteUser(id) {
		this.setState({
			deleteUser: id
		})
		// toastr.error('User has been deleted successfully!', { position: 'top-right', heading: 'Done' });
	}

	async handleSearch(e) {
		let { atendimentos } = this.state

		if (e.target.value) {
			const filter = atendimentos.filter(atend => atend.id === Number(e.target.value))
			this.setState({
				atendimentos: filter
			})
		} else {
			await this.getAtendimentos()
		}
	}

	render() {
		return (
			<div className="card mt-4">
				<div className="card-header">
					<h4 className="card-title"> Atendimentos </h4>
					{/* <button type="button" className="btn btn-primary btn-sm pull-right" data-toggle="modal" data-target="#addModal"> Add User </button> */}
				</div>

				<div className="card-body">
					<div class="input-group col-md-12">
						<div className="col-md-12">
							<div class="form-outline">
								<input type="search" id="form1" class="form-control" onChange={this.handleSearch.bind(this)} placeholder="Insira o Id do Atendimento para pesquisa" />
							</div>
						</div>
						&nbsp;
					</div>
					<div className="col-md-12">
						{this.state.atendimentos.length > 0 ? (<table className="table table-bordered">
							<thead>
								<tr>
									<th> Id </th>
									<th> Pessoa </th>
									<th> Convenio </th>
									<th> Tipo Atendimento </th>
									<th> Procendencia </th>
									<th> Data de Entrada </th>
									<th> Data de Alta </th>
									<th> Data de Cancelamento </th>
									<th> Ações </th>
								</tr>
							</thead>
							<tbody>
								{this.state.atendimentos.map((atend, i) => (
									<tr key={atend.id} align="center">
										<td> {atend.id} </td>
										<td> {atend.pessoa} </td>
										<td> {atend.convenio} </td>
										<td> {atend.tipoAtendimento} </td>
										<td> {atend.procedencia} </td>
										<td> {atend.dataEntrada} </td>
										<td> {atend.dataAlta} </td>
										<td> {atend.dataCancelamento} </td>
										<td>
											<Link className="btn btn-info btn-sm mr-2" to={`/prescricoes/${atend.id}`}> Prescricoes </Link>
											<button className="btn btn-danger btn-sm" onClick={this.handleDeleteUser.bind(this, atend.id)} data-toggle="modal" data-target="#deleteModal"> Cancelar </button>
										</td>
									</tr>
								))}
							</tbody>
						</table>) : (
							<label className="modal-title">Não existe atendimentos com esse Id !! </label>
						)}
					</div>
				</div>
				<div className="modal" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div className="modal-dialog" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Atenção !! O atendimento {this.state.deleteUser} vai ser deletado</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body">
								<label className="modal-title">Você deseja prosseguir com a cancelamento ? </label>
							</div>
							<div className="modal-footer">
								<button type="submit" className="btn btn-info btn-sm mr-2" onClick={this.handleAnswer.bind(this, true)} data-dismiss="modal">Sim</button>
								<button type="submit" className="btn btn-danger btn-sm" onClick={this.handleAnswer.bind(this, false)} data-dismiss="modal">Não</button>
							</div>
						</div>
					</div>
				</div>
				<Create updateState={this.handleUpdateState} />
			</div>
		)
	}
}
export default Atendimentos