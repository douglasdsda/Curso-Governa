package com.controledegastosapi.controledegastosAulaapi.service;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import com.controledegastosapi.controledegastosAulaapi.model.Pessoa;
import com.controledegastosapi.controledegastosAulaapi.repository.PessoaRepository;

@Service
public class PessoaService {

	@Autowired
	private PessoaRepository pessoaRepository;

	public List<Pessoa> listar() {
		return pessoaRepository.findAll();
	}
	
	public Pessoa buscarPeloCodigo(Long codigo) {
		return pessoaRepository.findById(codigo).orElse(null);
	}

	public Pessoa salvar(Pessoa pessoa) {
		return pessoaRepository.save(pessoa);
	}

	public void remover(Long codigo) {
		pessoaRepository.deleteById(codigo);
	}

	public Pessoa atualizar(Long codigo, Pessoa pessoa) {
		Pessoa pessoaSalva = verificarPessoaExisteAntesAtualizar(codigo);
		BeanUtils.copyProperties(pessoa, pessoaSalva, "codigo");
		return pessoaRepository.save(pessoaSalva);
	}
	
	public void atualizarPropriedadeAtivo(Long codigo, Boolean ativo) {
		Pessoa pessoaSalvar = verificarPessoaExisteAntesAtualizar(codigo);
		pessoaSalvar.setAtivo(ativo);
		pessoaRepository.save(pessoaSalvar);
	}
	
	private Pessoa verificarPessoaExisteAntesAtualizar(Long codigo) {
		Pessoa pessoaSalva = buscarPeloCodigo(codigo);
		if(pessoaSalva == null) {
			throw new EmptyResultDataAccessException(1);
		}
		return pessoaSalva;
	}
}
