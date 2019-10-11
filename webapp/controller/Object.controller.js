sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter"
  ],
  function(BaseController, JSONModel, History, formatter) {
    "use strict";

    return BaseController.extend(
      "iot.timetracking-projects-ui.controller.Object",
      {
        formatter: formatter,

        onInit: function() {
          const oViewModel = new JSONModel({
            busy: true,
            delay: 0
          });

          this.getRouter()
            .getRoute("object")
            .attachPatternMatched(this._onObjectMatched, this);

          this.setModel(oViewModel, "objectView");
        },

        onNavBack: function() {
          const sPreviousHash = History.getInstance().getPreviousHash();

          if (sPreviousHash !== undefined) {
            // eslint-disable-next-line sap-no-history-manipulation
            history.go(-1);
          } else {
            this.getRouter().navTo("worklist", {}, true);
          }
        },

        _onObjectMatched: function(oEvent) {
          const sObjectId = oEvent.getParameter("arguments").objectId;

          this._bindView("/Projects" + sObjectId);
        },

        _bindView: function(sObjectPath) {
          const oViewModel = this.getModel("objectView");

          this.getView().bindElement({
            path: sObjectPath,
            events: {
              change: this._onBindingChange.bind(this),
              dataRequested: () => oViewModel.setProperty("/busy", true),
              dataReceived: () => oViewModel.setProperty("/busy", false)
            }
          });
        },

        _onBindingChange: function() {
          const oViewModel = this.getModel("objectView");
          const oElementBinding = oView.getElementBinding();

          // No data for the binding
          if (!oElementBinding.getBoundContext()) {
            this.getRouter()
              .getTargets()
              .display("objectNotFound");
            return;
          }

          this.getView()
            .getBindingContext()
            .requestObject()
            .then(() => {
              oViewModel.setProperty("/busy", false);
            });
        }
      }
    );
  }
);
