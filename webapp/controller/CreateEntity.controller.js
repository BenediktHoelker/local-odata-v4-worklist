sap.ui.define(
  ["./BaseController", "sap/ui/model/json/JSONModel", "sap/m/MessageToast"],
  function(BaseController, JSONModel, MessageToast) {
    "use strict";

    const INITIAL_DATA = {
      newEntity: {
        title: "",
        description: "",
        billingFactor: "1"
      }
    };

    return BaseController.extend(
      "iot.timetracking-projects-ui.controller.CreateEntity",
      {
        onInit: function() {
          const oViewModel = new JSONModel(this._deepClone(INITIAL_DATA));

          this.getView().setModel(oViewModel, "viewModel");

          this.getRouter()
            .getRoute("create")
            .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function() {
          this.getModel("viewModel").setData(this._deepClone(INITIAL_DATA));
        },

        onPressSave: function() {
          const sProjectId = this._getUUID();
          const oNewEntity = this.getModel("viewModel").getProperty(
            "/newEntity"
          );

          const aMembers = this.byId("membersSelect")
            .getSelectedItems()
            .map(item => item.getBindingContext().getObject())
            .map(employee => ({
              employee_ID: employee.ID
            }));

          oNewEntity.members_db = aMembers;

          const oContext = this.getListBinding("Projects").create(oNewEntity);

          oContext.created().then(() => this.getRouter().navTo("worklist"));
        },

        onPressCancel: function() {
          history.go(-1);
        }
      }
    );
  }
);
