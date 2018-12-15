package com.controledegastosapi.controledegastosAulaapi.model;

import javax.persistence.Embeddable;
import javax.validation.constraints.Size;

@Embeddable
public class Endereco {

	@Size(min = 5, max = 30)
	private String logradouro;
	
	private Integer numero;
	
	@Size(min = 5, max = 30)
	private String complemento;
	
	@Size(min = 5, max = 30)
	private String bairro;
	
	@Size(min = 10, max = 10)
	private String cep;
	
	@Size(min = 2, max = 30)
	private String estado;

	public String getLogradouro() {
		return logradouro;
	}

	public void setLogradouro(String logradouro) {
		this.logradouro = logradouro;
	}

	public Integer getNumero() {
		return numero;
	}

	public void setNumero(Integer numero) {
		this.numero = numero;
	}

	public String getComplemento() {
		return complemento;
	}

	public void setComplemento(String complemento) {
		this.complemento = complemento;
	}

	public String getBairro() {
		return bairro;
	}

	public void setBairro(String bairro) {
		this.bairro = bairro;
	}

	public String getCep() {
		return cep;
	}

	public void setCep(String cep) {
		this.cep = cep;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}
}
