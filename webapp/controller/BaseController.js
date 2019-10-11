sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent", "sap/m/library"],
  function(Controller, UIComponent, mobileLibrary) {
    "use strict";

    return Controller.extend(
      "iot.timetracking-projects-ui.controller.BaseController",
      {
        getListBinding: function(sName, sEntity) {
          const oListBinding = this.getOwnerComponent()._oListBindings[sName];

          if (!oListBinding) {
            return this.getModel().bindList(sEntity);
          }

          return oListBinding;
        },

        setListBinding: function(sName, oListBinding) {
          this.getOwnerComponent()._oListBindings[sName] = oListBinding;
        },

        _deepClone: function(object) {
          return JSON.parse(JSON.stringify(object));
        },

        getRouter: function() {
          return UIComponent.getRouterFor(this);
        },

        getModel: function(sName) {
          return this.getView().getModel(sName);
        },

        setModel: function(oModel, sName) {
          return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function() {
          return this.getOwnerComponent()
            .getModel("i18n")
            .getResourceBundle();
        }
      }
    );
  }
);
