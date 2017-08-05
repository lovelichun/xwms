package com.fise.server.auth.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fise.base.HttpContext;
import com.fise.dao.WiPermissionMapper;
import com.fise.framework.redis.RedisManager;
import com.fise.model.entity.WiPermission;
import com.fise.model.entity.WiPermissionExample;
import com.fise.server.auth.IAuthService;
import com.fise.utils.Constants;

import redis.clients.jedis.Jedis;

@Service
public class AuthServiceImpl implements IAuthService{

    @Autowired
    WiPermissionMapper WiPermissionDao;
    
    @Override
    public Boolean queryAuth(Integer module_id) {
        Integer memberId=HttpContext.getMemberId();
        String role_id=getRoleId(memberId);
        
        WiPermissionExample example =new WiPermissionExample();
        WiPermissionExample.Criteria criteria=example.createCriteria();
        criteria.andRoleIdEqualTo(Integer.parseInt(role_id));
        criteria.andModuleIdEqualTo(memberId);
        List<WiPermission> list=WiPermissionDao.selectByExample(example);
        
        if(list.get(0).getQueryAuth()==0){
            return false;
        }
        return true;
    }

    @Override
    public Boolean inserAuth(Integer module_id) {
        Integer memberId=HttpContext.getMemberId();
        String role_id=getRoleId(memberId);
        
        WiPermissionExample example =new WiPermissionExample();
        WiPermissionExample.Criteria criteria=example.createCriteria();
        criteria.andRoleIdEqualTo(Integer.parseInt(role_id));
        criteria.andModuleIdEqualTo(memberId);
        List<WiPermission> list=WiPermissionDao.selectByExample(example);
        
        if(list.get(0).getInsertAuth()==0){
            return false;
        }
        return true;
    }

    @Override
    public Boolean updateAuth(Integer module_id) {
        Integer memberId=HttpContext.getMemberId();
        String role_id=getRoleId(memberId);
        
        WiPermissionExample example =new WiPermissionExample();
        WiPermissionExample.Criteria criteria=example.createCriteria();
        criteria.andRoleIdEqualTo(Integer.parseInt(role_id));
        criteria.andModuleIdEqualTo(memberId);
        List<WiPermission> list=WiPermissionDao.selectByExample(example);
        
        if(list.get(0).getUpdateAuth()==0){
            return false;
        }
        return true;
    }
    
    public static String getRoleId(Integer memberId){
        Jedis jedis=null;
        String role_id="";
        try {
            jedis = RedisManager.getInstance().getResource(Constants.REDIS_POOL_NAME_MEMBER);
            String key = Constants.REDIS_KEY_PREFIX_MEMBER_ROLE_ID + "_" + memberId;
            role_id = jedis.get(key);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            RedisManager.getInstance().returnResource(Constants.REDIS_POOL_NAME_MEMBER, jedis);
        }
        return role_id;
    }

}
