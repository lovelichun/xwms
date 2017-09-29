package com.fise.model.result;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fise.model.entity.AppInformation;
import com.fise.utils.JsonUtil;

public class AppDetailResult {

    private Integer id;

    private String appIndex;

    private String appName;

    private Integer devId;

    private String devName;

    private String topCategory;

    private String category;

    private String description;

    private String version;
    
    private String versionCode;

    private String icon;

    private Integer iconType;
    
    private String download;

    private String size;

    private Integer updated;
    
    private Integer created;
    
    private String remarks;
    
    private String label;

    private String star;
    
    private Integer orientation;
    
    private String packageName;
    
    private List<String> images;
    
	public String getPackageName() {
		return packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	public Integer getOrientation() {
		return orientation;
	}

	public void setOrientation(Integer orientation) {
		this.orientation = orientation;
	}

	public List<String> getImages() {
		return images;
	}

	public void setImages(List<String> images) {
		this.images = images;
	}

	public String getVersionCode() {
		return versionCode;
	}

	public void setVersionCode(String versionCode) {
		this.versionCode = versionCode;
	}

	public Integer getIconType() {
		return iconType;
	}

	public void setIconType(Integer iconType) {
		this.iconType = iconType;
	}

	public String getStar() {
		return star;
	}

	public void setStar(String star) {
		this.star = star;
	}

	public Integer getCreated() {
		return created;
	}

	public void setCreated(Integer created) {
		this.created = created;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAppIndex() {
        return appIndex;
    }

    public void setAppIndex(String appIndex) {
        this.appIndex = appIndex;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public Integer getDevId() {
        return devId;
    }

    public void setDevId(Integer devId) {
        this.devId = devId;
    }

    public String getDevName() {
        return devName;
    }

    public void setDevName(String devName) {
        this.devName = devName;
    }

    public String getTopCategory() {
        return topCategory;
    }

    public void setTopCategory(String topCategory) {
        this.topCategory = topCategory;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

   

    public String getDownload() {
        return download;
    }

    public void setDownload(String download) {
        this.download = download;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Integer getUpdated() {
        return updated;
    }

    public void setUpdated(Integer updated) {
        this.updated = updated;
    }

    public void init(AppInformation data){
        this.id = data.getId();
        this.appIndex = data.getAppIndex();
        this.appName = data.getAppName();
        this.devId = data.getDevId();
        this.devName = data.getDevName();
        this.topCategory = data.getTopCategory();
        this.category = data.getCategory();
        this.description = data.getDescription();
        this.version = data.getVersion();
        this.icon = data.getIcon();
        this.download = data.getDownload();
        this.size = data.getSize();
        this.updated = data.getUpdated();
        this.created=data.getCreated();
        this.remarks=data.getRemarks();
        this.label=data.getLabel();
        this.versionCode=data.getVersioncode();
        this.iconType=data.getIconType();
        this.star=data.getStar();
        this.orientation=data.getOrientation();
        this.packageName=data.getPackageName();
        String imageStr= data.getImages();
        String[] listStr=imageStr.split(";");
        List<String> imageList=new ArrayList<String>();
        for(int i=0;i<listStr.length;i++){
        	imageList.add(listStr[i]);
        }
       this.images=imageList;
        
    }
    
    @Override
    public String toString() {
        return JsonUtil.toJson(this);
    }
}
