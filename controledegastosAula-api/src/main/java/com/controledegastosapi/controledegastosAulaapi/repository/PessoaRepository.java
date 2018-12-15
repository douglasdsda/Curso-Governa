package com.controledegastosapi.controledegastosAulaapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.controledegastosapi.controledegastosAulaapi.model.Pessoa;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

}
