package br.com.sgdw.domain.dto;

import org.hibernate.validator.constraints.NotBlank;

public class AtualizacaoManual{

	@NotBlank
	private String datasetUri;
	
	private String newQuery;
	
	@NotBlank
	private String description;
	
	private String newId;
	
	@NotBlank
	private String motivo;
		
	public String getDatasetUri() {
		return datasetUri;
	}

	public void setDatasetUri(String datasetUri) {
		this.datasetUri = datasetUri;
	}
	
	public String getNewQuery() {
		return newQuery;
	}

	public void setNewQuery(String newQuery) {
		this.newQuery = newQuery;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getNewId() {
		return newId;
	}

	public void setNewId(String newId) {
		this.newId = newId;
	}

	public String getMotivo() {
		return motivo;
	}

	public void setMotivo(String motivo) {
		this.motivo = motivo;
	}	
	
}
