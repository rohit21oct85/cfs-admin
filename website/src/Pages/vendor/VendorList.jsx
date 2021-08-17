import React, { useContext, useEffect, useState } from "react";
import "../mainDash.css";
import { useHistory, Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import { AuthContext } from "../../context/AuthContext";
import * as utils from "../../utils/MakeSlug";
import useVendorList from "../../hooks/useVendorList";
import { LoadingComp } from "../../components/LoadingComp";
import CreateVendor from "./CreateVendor";

export default function VendorList() {
  const history = useHistory();
  const { state } = useContext(AuthContext);
  const { data: vendors, isLoading: vendorLoading } = useVendorList();

  const handleDelete = async (e) => {
    const vendor_id = e.id;
    history.push(`delete-data/master-vendor/delete/${vendor_id}`);
  };
  const handleUpdate = async (e) => {
    history.push(`/app-vendors/update/${e}`);
  };

  const handlePage = async (e) => {
    history.push(`/${utils.MakeSlug(e)}`);
  };

  const handleLock = async (e) => {
    const vendor_id = e.id;
    const vendor_name = e.vendor_name.toLowerCase().replace(" ", "-");
    history.push(`/view-data/master-vendor/${vendor_name}/view/${vendor_id}`);
  };

  return (
    <>
      {state.isLoggedIn && (
        <div className="col-lg-10 col-md-10 main_dash_area">
          <div className="main-area-all">
            <div className="dashboard_main-container">
              {vendorLoading && <LoadingComp />}
              <div className="dash-main-head">
                <h2>Vendor List</h2>
              </div>
              <div className="dash-con-heading"></div>

              <div className="dash-cont-start">
                <div className="col-md-12 row pr-0">
                  <div className="col-md-3 pl-0">
                    <CreateVendor />
                  </div>

                  <div className="col-md-9 pr-0">
                  <p className="mt-1 mb-1"><b><span className="fa fa-gears"></span> All Vendors</b></p>    
        <hr className="mt-1 mb-2"/>
                    <div className="org-main-area">
                      <div className="dark mb-2" style={{ display: 'flex', justifyContent: 'space-between'}}>
                        <div className="col-md-4 pl-2">
                          <span>vendor Name</span>
                        </div>
                        <div className="col-md-6 pl-2">
                          <span>vendor Email</span>
                        </div>
                        
                        <div className="col-md-2 pl-2">
                          <span>vendor Action</span>
                        </div>

                      </div>
                      {!vendorLoading && (
                        
                        <div className="pr-2" 
                        style={{ height: '420px', overflow: 'scroll'}}>
                          {vendors?.map((vendor) => (
                            <>
                            <div style={{ display: 'flex',flexDirection: 'row', justifyContent: 'space-between'}}
                            className="card mb-2 mb-2"
                            key={vendor._id}
                            id={`card-${vendor._id}`}>
                            <div className="col-md-4 pl-2 pr-0">
                                {vendor.fullname}
                            </div>

                            <div className="col-md-6 pl-2 pr-0">
                              {vendor.email}
                            </div>
                            
                            <div className="col-md-2 pl-2 pr-0">
                              <Button
                                    className="delBtn pl-1 pr-1 "
                                    onClick={handlePage.bind(
                                      this,
                                      vendor.vendor_name
                                    )}
                                  >
                                    <span className="fa fa-eye mr-2 text-success"></span>
                              </Button>

                              <Button
                                    className="delBtn pl-1 pr-1"
                                    onClick={handleUpdate.bind(
                                      this,
                                      vendor._id
                                    )}
                                  >
                                    <span className="fa fa-edit mr-2 text-danger"></span>
                                  </Button>

                                  <Button
                                    className="delBtn pl-1 pr-1"
                                    onClick={handleLock.bind(this, {
                                      id: vendor._id,
                                      vendor_name: vendor.vendor_name,
                                    })}
                                  >
                                    <span className="fa fa-lock mr-2 text-success"></span>
                                  </Button>

                                  <Button
                                    className="delBtn pl-1 pr-1"
                                    onClick={handleDelete.bind(this, {
                                      id: vendor._id,
                                      vendor_name: vendor.vendor_name,
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
