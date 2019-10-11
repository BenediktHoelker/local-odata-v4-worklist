sap.ui.define(
  [
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function(BaseController, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend(
      "iot.timetracking-projects-ui.controller.Worklist",
      {
        formatter: formatter,

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit: function() {
          const oResBundle = this.getResourceBundle();

          // keeps the search state
          this._aTableSearchState = [];

          // Model used to manipulate control states
          const oViewModel = new JSONModel({
            worklistTableTitle: oResBundle.getText("worklistTableTitle"),
            tableNoDataText: oResBundle.getText("tableNoDataText")
          });

          this.setModel(oViewModel, "worklistView");
        },

        onUpdateFinished: function(oEvent) {
          // update the worklist's object counter after the table update
          let sTitle;
          const oTable = oEvent.getSource();
          const oResBundle = this.getResourceBundle();
          const iTotalItems = oEvent.getParameter("total");

          // only update the counter if the length is final and
          // the table is not empty
          if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
            sTitle = oResBundle.getText("worklistTableTitleCount", [
              iTotalItems
            ]);
          } else {
            sTitle = oResBundle.getText("worklistTableTitle");
          }
          this.getModel("worklistView").setProperty(
            "/worklistTableTitle",
            sTitle
          );
        },

        onAfterRendering: function() {
          this.setListBinding(
            "Projects",
            this.byId("table").getBinding("items")
          );
        },

        onPress: function(oEvent) {
          // The source is the list item that got pressed
          this._showObject(oEvent.getSource());
        },

        onNavBack: function() {
          // eslint-disable-next-line sap-no-history-manipulation
          history.go(-1);
        },

        onPressAdd: function() {
          this.getRouter().navTo("create");
				},
				
        onPressDelete: function(oEvent) {
          const oTable = this.byId("table");
          const aSelectedContexts = oTable.getSelectedContexts();
          aSelectedContexts.forEach(oContext => oContext.delete());
        },

        onSearch: function(oEvent) {
          if (oEvent.getParameters().refreshButtonPressed) {
            // Search field's 'refresh' button has been pressed.
            // This is visible if you select any master list item.
            // In this case no new search is triggered, we only
            // refresh the list binding.
            this.onRefresh();
          } else {
            const aTableSearchState = [];
            const sQuery = oEvent.getParameter("query");

            if (sQuery && sQuery.length > 0) {
              aTableSearchState = [
                new Filter("title", FilterOperator.Contains, sQuery)
              ];
            }
            this._applySearch(aTableSearchState);
          }
        },

        /**
         * Event handler for refresh event. Keeps filter, sort
         * and group settings and refreshes the list binding.
         * @public
         */
        onRefresh: function() {
          this.byId("table")
            .getBinding("items")
            .refresh();
        },

        _showObject: function(oItem) {
          oItem
            .getBindingContext()
            .requestCanonicalPath()
            .then(sObjectPath => {
              this.getRouter().navTo("object", {
                objectId_Old: oItem.getBindingContext().getProperty("ID"),
                objectId: sObjectPath.slice("/Projects".length) // /Products(3)->(3)
              });
            });
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function(aTableSearchState) {
          const oTable = this.byId("table");
          const oViewModel = this.getModel("worklistView");
					
					oTable.getBinding("items").filter(aTableSearchState, "Application");
					
					// changes the noDataText of the list in case there are no filter results
          if (aTableSearchState.length !== 0) {
            oViewModel.setProperty(
              "/tableNoDataText",
              this.getResourceBundle().getText("worklistNoDataWithSearchText")
            );
          }
        }
      }
    );
  }
);
