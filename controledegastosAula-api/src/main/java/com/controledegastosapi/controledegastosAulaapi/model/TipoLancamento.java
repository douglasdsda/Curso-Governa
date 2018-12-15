package com.controledegastosapi.controledegastosAulaapi.model;

public enum TipoLancamento {

	RECEITA,
	DESPESA;
	
	private String descricao;

	public String getDescricao() {
		return descricao;
	}
}
