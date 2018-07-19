odoo.define('avd_pos.pos_customer_required', function (require) {
    "use strict";

    var screens = require('point_of_sale.screens');
    var gui = require('point_of_sale.gui');
    var core = require('web.core');
    var _t = core._t;
    var models = require('point_of_sale.models');


    models.load_models({
        model: 'province',
        fields: ['name', 'code'],
        loaded: function(self,province){
            // self.product_loc_qty = qty;
        },
    });

    models.load_models({
        model: 'canton',
        fields: ['name', 'code', 'province_id'],
        loaded: function(self,canton){
            // self.product_loc_qty = qty;
        },
    });

    models.load_models({
        model: 'district',
        fields: ['name', 'code', 'canton_id'],
        loaded: function(self,district){
            // self.product_loc_qty = qty;
        },
    });

    models.load_models({
        model: 'locality',
        fields: ['name', 'code', 'district_id'],
        loaded: function(self,locality){
            // self.product_loc_qty = qty;
        },
    });

    screens.PaymentScreenWidget.include({
        validate_order: function(options) {
            if(!this.pos.get('selectedOrder').get_client()){
                this.gui.show_popup('error',{
                    'title': _t('Order cannot be confirmed'),
                    'body':  _t('Please select a customer for this order.'),
                });
                return;
            }
            return this._super(options);
        }
    });

    var _show_screen_ = gui.Gui.prototype.show_screen;
    gui.Gui.prototype.show_screen = function(screen_name, params, refresh){
        if(this.pos.config.require_customer == 'order'
                && !this.pos.get('selectedOrder').get_client()
                && screen_name != 'clientlist'){
            _show_screen_.call(this, screen_name, params, refresh);
            screen_name = 'clientlist';
        }
        _show_screen_.call(this, screen_name, params, refresh);
    };

    var _super_posmodel = models.PosModel.prototype;

    models.PosModel = models.PosModel.extend({
        initialize: function (session, attributes) {
            var partner_model = _.find(this.models, function(model){
                return model.model === 'res.partner';
            });
            partner_model.fields.push('fax_no');
            partner_model.fields.push('province_id');
            partner_model.fields.push('canton_id');
            partner_model.fields.push('district_id');
            partner_model.fields.push('locality_id');
            partner_model.fields.push('phone');
            return _super_posmodel.initialize.call(this, session, attributes);
        },
    });

});
