/**
 * Created by giorgio.arcella on 29/12/2016.
 */

var app = {

    //Inizializzo oggetto dati di configurazione
    appsettings: {},

    //Funzione che viene lanciata quando viene caricato il documento
    initialize: function() {

        var self = this;

        //Estensione di jQuery per lanciare animazioni con animate.css
        $.fn.extend({
            /** @function animateCss
             * jQuery extension fot animate.css animations */
            animateCss: function (animationName, callback) {
                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                $(this).addClass('animated ' + animationName).one(animationEnd, function() {
                    $(this).removeClass('animated ' + animationName);
                    if(callback)
                        callback();
                });
                return $(this);
            }
        });

        //Caricamento file di configurazione (comprende menu e serie di views per home e navigazione)
        $.getJSON( "config.json", function( appsettings ) {
            self.appsettings = appsettings;

            //Recupero template navigation
            var ret = $('#navigation-template').html();
            var template = _.template(ret);
            var vars = {data: appsettings};
            var html = template(vars);
            $('.navigation').html(html);

            $.ajaxSetup({beforeSend: function(xhr){
                if (xhr.overrideMimeType)
                {
                    xhr.overrideMimeType("application/json");
                }
            }
            });
            self.opensection('home');
        }).fail( function(d, textStatus, error) {
            $('.container').html("<h1>No config.json file found!</h1><p>getJSON failed, status: " + textStatus + ", error: "+error+"</p>");
            console.error("getJSON failed, status: " + textStatus + ", error: "+error);
        });
    },

    //Mostro loader animato
    showLoader: function(){
        $('.loadingclabbackground').css('height','100%').fadeIn();
        $('.loadingclab').fadeIn();
    },

    //Nascondo loader
    hideLoader: function(){
        $('.loadingclab').hide();
        $('.loadingclabbackground').hide();
    },

    //Mostro loader e poi lo nascondo non appena cambia rotta
    showAndHideLoader: function(){
        showLoader();
        window.onunload = hideLoader;
    },

    //Carico la view passata in argomento
    opensection: function(name){
        var self = this;
        $.get('templates/'+name+'.html',
            {},
            function(ret){
                $('#dynamic_element').html(ret);
                $.getJSON( "json/"+name+".json", function( data ) {
                    $.extend(data, {"appsettings" : self.appsettings});
                    self.render(name, data);
					
                    //Events
                    if(name == 'home'){
                        $('li.home-nav').addClass('active');
                        self.homepage();
                    }else if(name == 'subject'){
                        self.subjectpage(data);
                    }else if(name == 'sorting'){
                        self.sortingpage(data);
                    }else if(name == 'availability'){
                        self.availabilitypage(data);
                    }else if(name == 'limitnumber'){
                        self.limitnumberpage(data);
                    }else if(name == 'headline'){
                        self.headlinepage(data);
                    }else if(name == 'special'){
                        self.specialpage(data);
                    }else if(name == 'jolly'){
                        self.jollypage(data);
                    }else if(name == 'onetoone'){
                        self.onetoonepage(data);
                    }else if(name == 'preview'){
                        self.previewpage(data);
                    }else if(name == 'schedulation'){
                        self.schedulationpage(data);
                    }
                    $('.openpage').off();
                    $('.openpage').click(function(){
                        if(!$(this).parent().hasClass('active')) {
                            self.opensection($(this).attr('data-page'));
                        }
                    });
                });
            },
            'text'
        );
    },

    //Renderizzo la view passando al template i dati
    render: function(name, data){
        var self = this;
		
        var template = _.template($('#' + name + '-template').html());
        var vars = {data: data};
        var html = template(vars);
        $('.container').html(html);
        $('li.active').removeClass('active');

        //Cambio sezione
        $('.openpage').off();
        $('.openpage').click(function(){
            if(!$(this).parent().hasClass('active')) {
                $('li.active').removeClass('active');
                $(this).addClass('active');
                self.opensection($(this).attr('data-page'));
            }
        });

        //Torno alla sezione precedente
        $('.back-btn').off();
        $('.back-btn').click(function(){
			self.opensection(data.back);
        });

        //Passo alla sezione successiva
        $('.next-btn').off();
        $('.next-btn').click(function(){
			self.opensection(data.next);
        });

        //Finto salvataggio
        $('.save-btn').off();
        $('.save-btn').click(function() {
			self.showLoader();
            $('.final-actions.save').fadeOut(function(){
                $(this).after('<div class="final-actions panel-success centered success">Salvataggio avvenuto correttamente!</div>');
				setTimeout(function(){
					self.hideLoader();
				},500);
            });
        });
    },

    homepage: function(){
        var $padre = $('.home-content');
    },

    subjectpage: function(data){
        var $padre = $('.subject-content');

        $padre.find('.delete-icon').off();
        $padre.find('.delete-icon').click(function() {
            $(this).parents('div.row').remove();
        });

        $padre.find('.save-icon').off();
        $padre.find('.save-icon').click(function(){
            $padre.find('.choose_tupla input').removeClass('notfilled');
            var tupla = $padre.find('#subject_price option:selected').text()+' | '+$padre.find('#subject_place option:selected').text();
            var subject = $padre.find('#subject_text').val();
            var salva = false;
            if(subject != ''){
                $.each(data.settings, function(i,v){
                    //if(v.tupla == tupla){
                    //    salva = false;
                    //}else{
                        if(!$padre.find('#subject_text').hasClass('notfilled'))
                            salva = true;
                    //}
                    $padre.find('.subjects_saved input').each(function(){
                        if($(this).val() == tupla) {
                            salva = false;
                        }
                    });
                });
                if(salva == true){
                    $padre.find('.subjects_saved').append('<div class="row"> <div class="col-md-5 form-group"> <label>Dimensione: </label> <input class="form-control" disabled value="'+tupla+'" /> </div> <div class="col-md-6 form-group"> <label>Subject: </label> <input class="form-control" disabled value="'+subject+'" /> </div> <div class="col-md-1 actions-icon delete-icon"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> </div> </div>')
                    $padre.find('.delete-icon').off();
                    $padre.find('.delete-icon').click(function() {
                        $(this).parents('div.row').remove();
                    });
                    $padre.find('.errormsg').empty();
                    $padre.find('#subject_text').val('');
                    salva = false;
                }else{
                    $padre.find('.errormsg').html('Tupla già presente');
                }
            }else{
                salva = false;
                $padre.find('#subject_text').addClass('notfilled');
                $padre.find('.errormsg').html('Compilare i campi correttamente');
            }
        });
    },

    sortingpage: function(data){
        var $padre = $('.sorting-content');
        $padre.find('select.criterio_sorting').on('change', function(){
            if($(this).val() != 'ranking'){
                $(this).parents('.row').find('.ascdesc').fadeIn();
            }else{
                $(this).parents('.row').find('.ascdesc').fadeOut();
            }
        });
    },

    availabilitypage: function(data){
        var $padre = $('.availability-content');
    },

    limitnumberpage: function(data){
        var $padre = $('.limitnumber-content');

        //Limita per tutti i cluster
        $padre.find('#limitnumber_all_check').on('change', function(){
            if($(this).prop('checked')){
                $padre.find('#limitnumber_all').removeAttr('disabled');
                $padre.find('.bottongroups.cluster').fadeOut();
            }else{
                $padre.find('#limitnumber_all').attr('disabled', true);
                $padre.find('.bottongroups.cluster').fadeIn();
            }
        });
        $padre.find('#limitnumber_all').on('change', function(){
            $padre.find('div.bottongroups.cluster select').val($(this).val());
        });

        //$padre.find('.delete-icon').off();
        //$padre.find('.delete-icon').click(function() {
        //    $(this).parents('div.row').remove();
        //});
        //$padre.find('.save-icon').off();
        //$padre.find('.save-icon').click(function(){
        //    $padre.find('.choose_tupla input').removeClass('notfilled');
        //    var tupla = $padre.find('#number_price option:selected').text()+', '+$padre.find('#number_place option:selected').text();
        //    var number = $padre.find('#number_text').val();
        //    var salva = false;
        //    if(number != '' && parseInt(number) <= 20){
        //        $.each(data.settings, function(i,v){
        //                if(!$padre.find('#number_text').hasClass('notfilled')){
        //                    salva = true;
        //                }
        //            $padre.find('.number_saved input').each(function(){
        //                if($(this).val() == tupla) {
        //                    salva = false;
        //                }
        //            });
        //        });
        //        if(salva == true){
        //            $padre.find('.number_saved').append('<div class="row"> <div class="col-md-8 form-group"> <label>Dimensione: </label> <input class="form-control" disabled value="'+tupla+'" /> </div> <div class="col-md-3 form-group"> <label>Number of departures: </label> <input class="form-control" disabled value="'+number+'" /> </div> <div class="col-md-1 actions-icon delete-icon"> <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> </div> </div>')
        //            $padre.find('.delete-icon').off();
        //            $padre.find('.delete-icon').click(function() {
        //                $(this).parents('div.row').remove();
        //            });
        //            $padre.find('.errormsg').empty();
        //            $padre.find('#number_text').val('');
        //            salva = false;
        //        }else{
        //            $padre.find('.errormsg').html('Tupla già presente');
        //        }
        //    }else{
        //        salva = false;
        //        $padre.find('#number_text').addClass('notfilled');
        //        $padre.find('.errormsg').html('Compilare i campi correttamente');
        //    }
        //});
    },

    headlinepage: function(data){
        var $padre = $('.headline-content');

        var panel_default = $padre.find('.headline_setting .btn.active').attr('data-panel');
        $padre.find('.settings_panel').html($padre.find('#'+panel_default+'_panel').html());

        $padre.find('.headline_setting .btn').off();
        $padre.find('.headline_setting .btn').click(function(){
            var panel_active = $(this).attr('data-panel');
            $padre.find('.settings_panel').html($padre.find('#'+panel_active+'_panel').html());
            if($(this).hasClass('jolly')){
                $(this).parents('.row').find('.viewboxheadlinelist').fadeIn();
            }else{
                $(this).parents('.row').find('.viewboxheadlinelist').fadeOut();
            }
        });
    },

    specialpage: function(data){
        var $padre = $('.special-content');

        var panel_default = $padre.find('.special_setting .btn.active').attr('data-panel');
        $padre.find('.settings_panel').html($padre.find('#'+panel_default+'_panel').html());

        $padre.find('.bottongroups .btn').off();
        $padre.find('.bottongroups .btn').click(function(){
            var panel_active = $(this).attr('data-panel');
            $padre.find('.settings_panel').html($padre.find('#'+panel_active+'_panel').html());
            if($(this).hasClass('gotrue')){
                $(this).parents('.row').find('.viewboxpeoplelist').fadeIn();
            }else{
                $(this).parents('.row').find('.viewboxpeoplelist').fadeOut();
            }
        });
    },

    jollypage: function(data){
        var $padre = $('.jolly-content');

        $padre.find('.bottongroups .btn').off();
        $padre.find('.bottongroups .btn').click(function(){
            //var panel_active = $(this).attr('data-panel');
            //$padre.find('.settings_panel').html($padre.find('#'+panel_active+'_panel').html());
            if($(this).hasClass('gotrue')){
                $(this).parents('.row').find('.viewboxpeoplelist').fadeIn();
            }else{
                $(this).parents('.row').find('.viewboxpeoplelist').fadeOut();
            }
        });
    },

    onetoonepage: function(data){
        var $padre = $('.onetoone-content');
    },
	
	previewpage: function(data){
        var $padre = $('.preview-content');
		
		$padre.find('select').on('change', function(){
			if(($padre.find('select#preview_price').val() != null) && ($padre.find('select#preview_place').val() != null)){
				var tupla = $padre.find('select#preview_price').val()+'-'+$padre.find('select#preview_place').val();
				if(data.settings[tupla] != ''){
					var vars = {dati: data.settings[tupla]};
					var template = _.template($('#previewdata-template').html());
					var html = template(vars);
					$padre.find('.loadedsettings').html(html);
				}
			}
		});

		//$padre.find(".slides").sortable({
		//	placeholder: 'slide-placeholder',
		//	axis: "y",
		//	revert: 150,
		//	start: function(e, ui){
		//
		//		placeholderHeight = ui.item.outerHeight();
		//		ui.placeholder.height(placeholderHeight + 15);
		//		$('<div class="slide-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
		//
		//	},
		//	change: function(event, ui) {
		//		ui.placeholder.stop().height(0).animate({
		//			height: ui.item.outerHeight() + 15
		//		}, 300);
		//		placeholderAnimatorHeight = parseInt($(".slide-placeholder-animator").attr("data-height"));
		//		$padre.find(".slide-placeholder-animator").stop().height(placeholderAnimatorHeight + 15).animate({
		//			height: 0
		//		}, 300, function() {
		//			$(this).remove();
		//			placeholderHeight = ui.item.outerHeight();
		//			$('<div class="slide-placeholder-animator" data-height="' + placeholderHeight + '"></div>').insertAfter(ui.placeholder);
		//		});
		//	},
		//	stop: function(e, ui) {
		//		$padre.find(".slide-placeholder-animator").remove();
		//	}
		//});
	},

    schedulationpage: function(data){
        var $padre = $('.schedulation-content');
        $padre.find('.btn').on('click', function(){
            if($(this).hasClass('gotrue')){
                $(this).parents('.row').find('.date').fadeIn();
            }else{
                $(this).parents('.row').find('.date').fadeOut();
            }
        });
        var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        $padre.find('.datepickerschedulation').datetimepicker({
            minDate: currentDate
        });
    }

};

$(document).ready(function(){
    app.initialize();
});