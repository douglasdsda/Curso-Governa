package com.controledegastosapi.controledegastosAulaapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.controledegastosapi.controledegastosAulaapi.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

}
