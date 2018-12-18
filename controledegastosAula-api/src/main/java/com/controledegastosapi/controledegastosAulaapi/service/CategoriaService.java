package com.controledegastosapi.controledegastosAulaapi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.controledegastosapi.controledegastosAulaapi.model.Categoria;
import com.controledegastosapi.controledegastosAulaapi.repository.CategoriaRepository;

@Service
public class CategoriaService {

	@Autowired
	private CategoriaRepository categoriaRepository;
	
	public List<Categoria> listar() {
		return categoriaRepository.findAll();
	}
	
	public Categoria buscarPeloCodigo(Long codigo) {
		return categoriaRepository.findById(codigo).orElse(null);
	}
	
	public Categoria salvar(Categoria categoria) {
		return categoriaRepository.save(categoria);
	}
}
