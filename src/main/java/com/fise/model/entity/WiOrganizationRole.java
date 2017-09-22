package com.fise.model.entity;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * @author 
 */
public class WiOrganizationRole implements Serializable {
    
    private Integer id;

    @JsonProperty("auth_level")
    private Integer authLevel;

    private String name;

    @JsonProperty("desc")
    private String description;

    @JsonProperty("company_id")
    private Integer organizationId;

    @JsonProperty("depart_id")
    private Integer departId;
    
    @JsonProperty("creator_id")
    private Integer creatorId;

    private static final long serialVersionUID = 1L;

    public Integer getCreatorId() {
		return creatorId;
	}

	public void setCreatorId(Integer creatorId) {
		this.creatorId = creatorId;
	}

	public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getAuthLevel() {
        return authLevel;
    }

    public void setAuthLevel(Integer authLevel) {
        this.authLevel = authLevel;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Integer organizationId) {
        this.organizationId = organizationId;
    }

    public Integer getDepartId() {
        return departId;
    }

    public void setDepartId(Integer departId) {
        this.departId = departId;
    }
}