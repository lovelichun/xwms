package com.fise.controller.departconfig;

import javax.annotation.Resource;
import javax.validation.Valid;

import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fise.base.ErrorCode;
import com.fise.base.Response;
import com.fise.model.entity.IMDepartConfig;
import com.fise.model.param.DepartConfigParam;
import com.fise.server.departconfig.IDepartConfigService;

@RestController
@RequestMapping("/boss/departconf")
public class DepartConfigController {
	
	private Logger logger=Logger.getLogger(getClass());
	
	@Resource
	IDepartConfigService iDepartConfigService;
	
	/*添加imdepartconfig*/
	@RequestMapping(value="/addimdepartconfig",method=RequestMethod.POST)
	public Response addImdepartConfig(@RequestBody @Valid IMDepartConfig param){
		
		Response response=new Response();
		
		if(param.getDepartid()==null || param.getClienttype()==null){
            return response.failure(ErrorCode.ERROR_FISE_DEVICE_PARAM_NULL);
        }
		
		logger.info(param.toString());
		response=iDepartConfigService.insertDepartConfig(param);
		logger.info("end insert imdepartconfig"+response.toString());
		
		return response;
	}
	
	/*查询imdepartconfig*/
	@RequestMapping(value="/queryimdepartconfig",method=RequestMethod.POST)
	public Response queryImdepartConfig(@RequestBody @Valid DepartConfigParam param){
		
		Response response=new Response();
		
		logger.info(param.toString());
		response=iDepartConfigService.queryDepartConfig(param);
		logger.info("end query imdepartconfig"+response.toString());
		
		return response;
	}
	
	/*删除imdepartconfig*/
	@RequestMapping(value="/delimdepartconfig",method=RequestMethod.POST)
	public Response delImdepartConfig(@RequestBody @Valid DepartConfigParam param){
		
		Response response=new Response();
		
		if(param.getConfigid()==null){
            return response.failure(ErrorCode.ERROR_FISE_DEVICE_PARAM_NULL);
        }
		
		logger.info(param.toString());
		response=iDepartConfigService.delDepartConfig(param);
		logger.info("end delete imdepartconfig"+response.toString());
		
		return response;
	}
	
	/*修改imdepartconfig信息*/
	@RequestMapping(value="/updateimdepartconfig",method=RequestMethod.POST)
	public Response updateImdepartConfig(@RequestBody @Valid IMDepartConfig param){

		Response response=new Response();
		
		if(param.getConfigid()==null){
            return response.failure(ErrorCode.ERROR_FISE_DEVICE_PARAM_NULL);
        }
		
		logger.info(param.toString());
		response=iDepartConfigService.updateDepartConfig(param);
		logger.info("end update imdepartconfig"+response.toString());
		
		return response;
	}
}