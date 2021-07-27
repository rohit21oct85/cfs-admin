import React, { useContext, useEffect, useState } from "react";
import "../mainDash.css";
import { useHistory, Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import { AuthContext } from "../../context/AuthContext";
import * as utils from "../../utils/MakeSlug";
import useAppModules from "../../hooks/useAppModules";
import { LoadingComp } from "../../components/LoadingComp";
import CreateModule from "./CreateModule";

export default function ModuleList() {
  const history = useHistory();
  const { state } = useContext(AuthContext);
  const { data: appModules, isLoading: appLoading } = useAppModules();

  const handleDelete = async (e) => {
    const module_id = e.id;
    history.push(`delete-data/master-module/delete/${module_id}`);
  };
  const handleUpdate = async (e) => {
    history.push(`/app-modules/update/${e}`);
  };

  const handlePage = async (e) => {
    history.push(`/${utils.MakeSlug(e)}`);
  };

  const handleLock = async (e) => {
    const module_id = e.id;
    const module_name = e.module_name.toLowerCase().replace(" ", "-");
    history.push(`/view-data/master-module/${module_name}/view/${module_id}`);
  };

  return (
    <>
      {state.isLoggedIn && (
        <div className="col-lg-10 col-md-10 main_dash_area">
          <div className="main-area-all">
            <div className="dashboard_main-container">
              {appLoading && <LoadingComp />}
              <div className="dash-main-head">
                <h2>Module List</h2>
              </div>
              <div className="dash-con-heading"></div>

              <div className="dash-cont-start">
                <div className="col-md-12 row pr-0">
                  <div className="col-md-3 pl-0">
                    <CreateModule />
                  </div>

                  <div className="col-md-9 pr-0">
                  <p className="mt-1 mb-1"><b><span className="fa fa-gears"></span> App Modules</b></p>    
        <hr className="mt-1 mb-2"/>
                    <div className="org-main-area">
                      <div className="dark mb-2" style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <div className="col-md-4 pl-2">
                          <span>Module Name</span>
                        </div>
                        <div className="col-md-6 pl-2">
                          <span>Module Slug</span>
                        </div>

                        <div className="col-md-2 pl-2">
                          <span>Module Action</span>
                        </div>

                      </div>
                      {!appLoading && (
                        
                        <div className="pr-2" 
                        style={{ height: '420px', overflow: 'scroll'}}>
                          {appModules?.map((module) => (
                            <>
                            <div style={{ display: 'flex',flexDirection: 'row', justifyContent: 'space-between'}}
                            className="card mb-2 mb-2"
                            key={module._id}
                            id={`card-${module._id}`}>
                            <div className="col-md-4 pl-2 pr-0">
                                <span className={`fa ${module?.icon} mr-2 mt-1`}></span>
                                {module.module_name}
                            </div>

                            <div className="col-md-6 pl-2 pr-0">
                              {utils.GetString(module.module_slug, 100)}
                            </div>
                            
                            <div className="col-md-2 pl-2 pr-0">
                            <Button
                                    className="delBtn pl-1 pr-1 "
                                    onClick={handlePage.bind(
                                      this,
                                      module.module_name
                                    )}
                                  >
                                    <span className="fa fa-eye mr-2 text-success"></span>
                                  </Button>
                                  <Button
                                    className="delBtn pl-1 pr-1"
                                    onClick={handleUpdate.bind(
                                      this,
                                      module._id
                                    )}
                                  >
                                    <span className="fa fa-edit mr-2 text-danger"></span>
                                  </Button>

                                  <Button
                                    className="delBtn pl-1 pr-1"
                                    onClick={handleLock.bind(this, {
                                      id: module._id,
                                      module_name: module.module_name,
                                    })}
                                  >
                                    <span className="fa fa-lock mr-2 text-success"></span>
                                  </Button>

                                  <Button
                                    className="delBtn pl-1 pr-1"
                                    onClick={handleDelete.bind(this, {
                                      id: module._id,
                                      module_name: module.module_name,
                                    })}
                                  >
                                    <span className="fa fa-trash mr-2 text-danger"></span>
                                  </Button>
                            </div>
                            </div>
                          </>

                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
