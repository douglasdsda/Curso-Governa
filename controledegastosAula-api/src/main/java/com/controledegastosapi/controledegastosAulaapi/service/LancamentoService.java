package com.controledegastosapi.controledegastosAulaapi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.controledegastosapi.controledegastosAulaapi.model.Lancamento;
import com.controledegastosapi.controledegastosAulaapi.model.Pessoa;
import com.controledegastosapi.controledegastosAulaapi.repository.LancamentoRepository;
import com.controledegastosapi.controledegastosAulaapi.repository.PessoaRepository;
import com.controledegastosapi.controledegastosAulaapi.service.exception.PessoaInexistenteOuInativaException;

@Service
public class LancamentoService {

	@Autowired
	private LancamentoRepository lancamentoRepository;
	
	@Autowired
	private PessoaRepository pessoaRepository;
	
	public List<Lancamento> listar(){
		return lancamentoRepository.findAll();
	}
	
	public Lancamento buscarPeloCodigo(Long codigo) {
		return lancamentoRepository.findById(codigo).orElse(null);
	}
	
	public Lancamento salvar(Lancamento lancamento) {
		Pessoa pessoa = pessoaRepository.findById(lancamento.getPessoa().getCodigo()).orElse(null);
		if(pessoa == null || pessoa.isInativo()) {
			throw new PessoaInexistenteOuInativaException();
		}
		return lancamentoRepository.save(lancamento);
	}
}
