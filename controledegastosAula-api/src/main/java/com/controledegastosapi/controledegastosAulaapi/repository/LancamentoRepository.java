package com.controledegastosapi.controledegastosAulaapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.controledegastosapi.controledegastosAulaapi.model.Lancamento;

public interface LancamentoRepository extends JpaRepository<Lancamento, Long> {

}
